// Request interceptor for automatic memory injection
import { apiService } from "./api";
import { showNotification } from "../content-scripts/shared";
import { detectCurrentProvider, getProviderApiConfig, getProviderConfig } from "../config/unified-providers";

class RequestInterceptor {
  private originalFetch: typeof fetch;
  private isIntercepting = false;
  private currentProvider: string | null = null;

  constructor() {
    this.originalFetch = window.fetch;
    this.detectProvider();
  }

  private detectProvider(): void {
    this.currentProvider = detectCurrentProvider();
    if (this.currentProvider) {
      console.log(`OpenMemo: Detected provider: ${this.currentProvider}`);
    }
  }

  public startIntercepting(): void {
    if (this.isIntercepting) {
      console.log('OpenMemo: Request interception already active');
      return;
    }
    
    if (!this.currentProvider) {
      console.log('OpenMemo: Cannot start interception - no provider detected');
      // Try to detect provider again
      this.detectProvider();
      if (!this.currentProvider) {
        console.log('OpenMemo: Provider detection failed, current hostname:', window.location.hostname);
        return;
      }
    }
    
    console.log(`OpenMemo: Starting request interception for ${this.currentProvider}`);
    this.isIntercepting = true;
    
    // Intercept fetch requests
    window.fetch = this.interceptFetch.bind(this);
  }

  public stopIntercepting(): void {
    if (!this.isIntercepting) return;
    
    console.log('OpenMemo: Stopping request interception');
    this.isIntercepting = false;
    
    // Restore original methods
    window.fetch = this.originalFetch;
  }

  private async interceptFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
    
    if (this.shouldInterceptRequest(url, init?.method || 'GET')) {
      return this.handleInterceptedFetchRequest(input, init);
    }
    
    return this.originalFetch.call(window, input, init);
  }

  private shouldInterceptRequest(url: string, method: string): boolean {
    if (!this.currentProvider || !this.isIntercepting) return false;
    
    const apiConfig = getProviderApiConfig(this.currentProvider);
    if (!apiConfig) return false;
    
    return url.includes(apiConfig.endpoint) && method.toUpperCase() === apiConfig.method;
  }

  private async handleInterceptedFetchRequest(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    try {
      const modifiedInit = await this.processRequest(init);
      return this.originalFetch.call(window, input, modifiedInit);
    } catch (error) {
      console.error('OpenMemo: Error processing fetch request:', error);
      return this.originalFetch.call(window, input, init);
    }
  }

  private async processRequest(init?: RequestInit): Promise<RequestInit | undefined> {
    if (!init?.body) return init;
    
    const modifiedBody = await this.processRequestBody(init.body);
    
    return {
      ...init,
      body: modifiedBody
    };
  }

  private async processRequestBody(body: BodyInit | null): Promise<BodyInit | null> {
    if (!body || !this.currentProvider) return body;
    
    try {
      const apiConfig = getProviderApiConfig(this.currentProvider);
      if (!apiConfig) return body;
      
      // Parse the request body
      let requestData: any;
      if (typeof body === 'string') {
        try {
          requestData = JSON.parse(body);
        } catch {
          return body; // Not JSON, return as-is
        }
      } else {
        return body; // Not a string, can't process
      }
      
      // Extract user message
      const userMessage = apiConfig.extractUserMessage(requestData);
      if (!userMessage || userMessage.trim().length === 0) {
        return body; // No user message to enhance
      }
      
      console.log('OpenMemo: Intercepted user message:', userMessage.substring(0, 100) + '...');
      
      // Load relevant memories
      const memories = await this.loadRelevantMemories(userMessage);
      if (memories.length === 0) {
        return body; // No memories found
      }
      
      // Create memory context
      const memoryContext = memories.map((m, i) => `${i + 1}. ${m.content}`).join('\n\n');
      
      // Inject memory context
      const enhancedData = apiConfig.injectMemoryContext(requestData, memoryContext);
      
      // Show notification
      this.showMemoryNotification(memories.length);
      
      console.log('OpenMemo: Enhanced request with', memories.length, 'memories');
      
      return JSON.stringify(enhancedData);
      
    } catch (error) {
      console.error('OpenMemo: Error processing request body:', error);
      return body;
    }
  }

  private async loadRelevantMemories(userMessage: string): Promise<Array<{content: string, category: string}>> {
    try {
      // Check if user is authenticated
      const isAuthenticated = await apiService.isAuthenticated();
      if (!isAuthenticated) {
        console.log('OpenMemo: User not authenticated, skipping memory loading');
        return [];
      }
      
      // Load relevant memories
      const result = await apiService.getMemories({ 
        query: userMessage, 
        limit: 3, // Keep it small to avoid overwhelming the context
        extractNewMemories: false // Don't extract new memories during automatic loading
      });
      
      return result.memories.map(m => ({
        content: m.content,
        category: m.category
      }));
      
    } catch (error) {
      console.error('OpenMemo: Error loading memories:', error);
      return [];
    }
  }

  private showMemoryNotification(count: number): void {
    const config = this.currentProvider ? getProviderConfig(this.currentProvider) : null;
    const providerName = config?.name || 'AI';
    showNotification(
      `🧠 Automatically loaded ${count} relevant ${count === 1 ? 'memory' : 'memories'} for your ${providerName} conversation`,
      'success'
    );
  }

  public getCurrentProvider(): string | null {
    return this.currentProvider;
  }

  public isCurrentlyIntercepting(): boolean {
    return this.isIntercepting;
  }
}

// Export singleton instance
export const requestInterceptor = new RequestInterceptor();

// Auto-start interception when the module loads (disabled to prevent conflicts with platform-specific scripts)
// Platform-specific content scripts will call startIntercepting() explicitly
/*
if (typeof window !== 'undefined') {
  // Wait a bit for the page to load
  setTimeout(() => {
    requestInterceptor.startIntercepting();
  }, 1000);
}
*/