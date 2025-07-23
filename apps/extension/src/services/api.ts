// API service for communicating with the backend
import config from '../config/environment';
import { FIXED_CATEGORIES } from '../constants/categories';

const API_BASE_URL = config.apiBaseUrl;

interface Memory {
  id: string;
  content: string;
  category: string;
  source: string;
  tags: string[] | string; // Can be array (legacy) or comma-separated string (new format)
  createdAt: string;
  updatedAt: string;
}

interface User {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
}

class ApiService {
  private tokenCache: { token: string | null; expiry: number } = { token: null, expiry: 0 };
  private userCache: { user: User | null; expiry: number } = { user: null, expiry: 0 };
  private usageStatsCache: { stats: any | null; expiry: number } = { stats: null, expiry: 0 };
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly USER_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes for user data
  private readonly STATS_CACHE_DURATION = 2 * 60 * 1000; // 2 minutes for stats
  private pendingRequests = new Map<string, Promise<any>>();

  getApiBaseUrl(): string {
    return API_BASE_URL;
  }

  private async getAuthToken(): Promise<string | null> {
    const now = Date.now();
    
    // Return cached token if still valid
    if (this.tokenCache.token && now < this.tokenCache.expiry) {
      return this.tokenCache.token;
    }

    // Fetch fresh token
    return new Promise((resolve) => {
      chrome.storage.local.get(["openmemo_auth_tokens"], (result) => {
        const tokens = result.openmemo_auth_tokens;
        const token = tokens?.accessToken || null;
        
        // Cache the token
        this.tokenCache = {
          token,
          expiry: now + this.CACHE_DURATION
        };
        
        resolve(token);
      });
    });
  }

  private async makeRequest<T>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> {
    const requestKey = `${options.method || 'GET'}_${url}_${JSON.stringify(options.body || '')}`;
    
    // Deduplicate identical requests
    if (this.pendingRequests.has(requestKey)) {
      console.log("OpenMemo API: Reusing pending request for:", url);
      return this.pendingRequests.get(requestKey);
    }

    const requestPromise = this.executeRequest<T>(url, options);
    this.pendingRequests.set(requestKey, requestPromise);

    try {
      const result = await requestPromise;
      return result;
    } finally {
      // Clean up after request completes
      this.pendingRequests.delete(requestKey);
    }
  }

  private async executeRequest<T>(url: string, options: RequestInit): Promise<T> {
    const token = await this.getAuthToken();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }

    const fullUrl = `${API_BASE_URL}${url}`;
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log("OpenMemo API: Making request to:", fullUrl);
    }

    const controller = new AbortController();
    // Increase timeout for bulk operations
    const timeoutDuration = url.includes('/memories') && options.method === 'POST' ? 120000 : 30000; // 2 minutes for memory creation, 30s for others
    const timeoutId = setTimeout(() => controller.abort(), timeoutDuration);

    try {
      const response = await fetch(fullUrl, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenMemo API: Error response:", errorText);
        
        // Handle specific HTTP errors
        if (response.status === 401) {
          // Clear all caches on auth failure
          this.tokenCache = { token: null, expiry: 0 };
          this.userCache = { user: null, expiry: 0 };
          this.usageStatsCache = { stats: null, expiry: 0 };
        }
        
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      return result;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      
      console.error("OpenMemo API: Request failed:", error);
      throw error;
    }
  }

  // Auth methods
  async authenticateWithGithub(
    code: string
  ): Promise<{ token: string; user: User }> {
    const result = await this.makeRequest<{ token: string; user: User }>(
      "/auth/github",
      {
        method: "POST",
        body: JSON.stringify({ code }),
      }
    );

    // Store the token
    await new Promise<void>((resolve) => {
      chrome.storage.local.set(
        {
          authToken: result.token,
          user: result.user,
        },
        resolve
      );
    });

    return result;
  }

  async getCurrentUser(): Promise<User> {
    const now = Date.now();
    
    // Return cached user if still valid
    if (this.userCache.user && now < this.userCache.expiry) {
      return this.userCache.user;
    }

    // Check if there's already a pending request for user data
    const requestKey = 'getCurrentUser';
    if (this.pendingRequests.has(requestKey)) {
      const pendingRequest = this.pendingRequests.get(requestKey);
      if (pendingRequest) {
        return pendingRequest.then((result: { user: User }) => result.user);
      }
    }

    // Fetch fresh user data
    const userPromise = this.makeRequest<{ user: User }>("/auth/me");
    this.pendingRequests.set(requestKey, userPromise);

    try {
      const result = await userPromise;
      
      // Cache the user data
      this.userCache = {
        user: result.user,
        expiry: now + this.USER_CACHE_DURATION
      };
      
      return result.user;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  async logout(): Promise<void> {
    // Clear all caches on logout
    this.tokenCache = { token: null, expiry: 0 };
    this.userCache = { user: null, expiry: 0 };
    this.usageStatsCache = { stats: null, expiry: 0 };
    this.pendingRequests.clear();
    
    await new Promise<void>((resolve) => {
      chrome.storage.local.remove(["authToken", "user"], resolve);
    });
  }

  // Memory methods
  async getMemories(
    params: {
      query?: string;
      limit?: number;
      extractNewMemories?: boolean;
    } = {}
  ): Promise<{ 
    memories: Memory[]; 
    searchType?: string;
    newMemoryDetected?: boolean;
    newMemorySaved?: Memory | null;
    responseTime?: number;
  }> {
    const queryParams = new URLSearchParams({
      ...Object.entries(params).reduce(
        (acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = value.toString();
          }
          return acc;
        },
        {} as Record<string, string>
      ),
    });

    return this.makeRequest<{ 
      memories: Memory[]; 
      searchType?: string;
      newMemoryDetected?: boolean;
      newMemorySaved?: Memory | null;
      responseTime?: number;
    }>(
      `/memories?${queryParams}`
    );
  }

  async createMemory(data: {
    content: string;
    category?: string;
    source?: string;
    tags?: string[];
  }): Promise<{ memory: Memory }> {
    return this.makeRequest<{ memory: Memory }>("/memories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async createBulkMemories(data: {
    memories: string[];
    source?: string;
  }): Promise<{ memories: Memory[]; processed: number; skipped: number; total: number }> {
    return this.makeRequest<{ memories: Memory[]; processed: number; skipped: number; total: number }>("/memories", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async updateMemory(
    id: string,
    data: {
      content?: string;
      category?: string;
      tags?: string[];
    }
  ): Promise<{ memory: Memory }> {
    return this.makeRequest<{ memory: Memory }>(`/memories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async deleteMemory(id: string): Promise<void> {
    await this.makeRequest(`/memories/${id}`, {
      method: "DELETE",
    });
  }



  // AI-powered memory finding with new memory detection and auto-save
  async findRelevantMemories(
    query: string,
    maxResults: number = 5,
    source: string = "extension"
  ): Promise<Memory[]> {
    // Include available categories for new memory detection
    const availableCategories = FIXED_CATEGORIES.filter(cat => cat !== 'All');
    
    const result = await this.makeRequest<{ 
      memories: Memory[]; 
      newMemoryDetected?: boolean;
      newMemorySaved?: Memory;
    }>(
      "/memories/find-relevant",
      {
        method: "POST",
        body: JSON.stringify({
          query,
          maxResults,
          source,
          availableCategories,
          checkForNewMemory: true, // Enable new memory detection
        }),
      }
    );
    return result.memories;
  }




  // Check if user is authenticated
  async isAuthenticated(): Promise<boolean> {
    try {
      const token = await this.getAuthToken();
      if (!token) return false;

      await this.getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  // Get usage statistics with caching
  async getUsageStats(): Promise<{
    totalMemories: number;
    memoriesBySource: Array<{ source: string; count: number }>;
    serviceUsage: Array<{
      service: string;
      usageCount: number;
      avgResponseTime: number;
    }>;
    recentActivity: number;
    stats: { totalQueries: number; averageResponseTime: number };
  }> {
    const now = Date.now();
    
    // Return cached stats if still valid
    if (this.usageStatsCache.stats && now < this.usageStatsCache.expiry) {
      return this.usageStatsCache.stats;
    }

    // Check if there's already a pending request for usage stats
    const requestKey = 'getUsageStats';
    if (this.pendingRequests.has(requestKey)) {
      const pendingRequest = this.pendingRequests.get(requestKey);
      if (pendingRequest) {
        return pendingRequest;
      }
    }

    const statsPromise = this.makeRequest<{
      totalMemories: number;
      memoriesBySource: Array<{ source: string; count: number }>;
      serviceUsage: Array<{
        service: string;
        usageCount: number;
        avgResponseTime: number;
      }>;
      recentActivity: number;
      stats: { totalQueries: number; averageResponseTime: number };
    }>(`/memories/usage-stats`);
    this.pendingRequests.set(requestKey, statsPromise);

    try {
      const result = await statsPromise;
      
      // Cache the stats
      this.usageStatsCache = {
        stats: result,
        expiry: now + this.STATS_CACHE_DURATION
      };
      
      return result;
    } finally {
      this.pendingRequests.delete(requestKey);
    }
  }

  // Legacy methods that some components still use
  async autoCategorizeMemory(
    content: string,
    availableCategories?: string[]
  ): Promise<{ category: string; tags: string[] }> {
    // Since auto-categorization is now handled by the API when creating memories,
    // we can return a default response or call the legacy endpoint if it still exists
    try {
      return this.makeRequest<{ category: string; tags: string[] }>(
        "/memories/auto-categorize",
        {
          method: "POST",
          body: JSON.stringify({ 
            content,
            availableCategories 
          }),
        }
      );
    } catch (error) {
      // Fallback to General category if API call fails
      return {
        category: "General",
        tags: []
      };
    }
  }

  async syncMemoriesWithAI(
    memories: string[],
    _availableCategories?: string[]
  ): Promise<{ processed: number; skipped: number }> {
    // This method is deprecated but keeping for backward compatibility
    console.warn("syncMemoriesWithAI is deprecated. Use bulk memory creation instead.");
    return { processed: 0, skipped: memories.length };
  }

  async findSimilarMemories(
    memoryId: string,
    _limit: number = 5,
    _similarityThreshold: number = 0.3
  ): Promise<{
    targetMemory: { id: string; content: string; category: string };
    similarMemories: Array<{
      id: string;
      content: string;
      category: string;
      tags: string;
      createdAt: string;
      similarity: number;
    }>;
    count: number;
  }> {
    // This functionality is deprecated with the streamlined API
    console.warn("findSimilarMemories is deprecated.");
    return {
      targetMemory: { id: memoryId, content: "", category: "" },
      similarMemories: [],
      count: 0
    };
  }

  async getVectorStats(): Promise<{
    vectorStore: {
      totalEmbeddings: number;
      status: string;
    };
  }> {
    // This functionality is deprecated with the streamlined API
    console.warn("getVectorStats is deprecated.");
    return {
      vectorStore: {
        totalEmbeddings: 0,
        status: "inactive"
      }
    };
  }

  async vectorSearch(
    query: string,
    limit: number = 10,
    _similarityThreshold: number = 0.1
  ): Promise<{
    query: string;
    results: Array<{
      id: string;
      content: string;
      category: string;
      tags: string;
      createdAt: string;
      similarity: number;
    }>;
    count: number;
    searchType: string;
  }> {
    // Vector search is now integrated into the main getMemories method
    const result = await this.getMemories({ query, limit });
    return {
      query,
      results: result.memories.map(memory => ({
        id: memory.id,
        content: memory.content,
        category: memory.category,
        tags: Array.isArray(memory.tags) ? memory.tags.join(', ') : memory.tags,
        createdAt: memory.createdAt,
        similarity: 1.0 // Default similarity since we don't get this from the new API
      })),
      count: result.memories.length,
      searchType: result.searchType || 'integrated'
    };
  }

  async extractAndCategorizeMemory(
    query: string,
    _source: string = "query-extraction"
  ): Promise<{ 
    hasNewMemory: boolean; 
    extractedMemory?: string; 
    category?: string; 
    savedMemory?: Memory 
  }> {
    // This functionality is now integrated into getMemories with extractNewMemories parameter
    const result = await this.getMemories({ query, extractNewMemories: true });
    
    return {
      hasNewMemory: !!result.newMemoryDetected,
      extractedMemory: result.newMemorySaved?.content,
      category: result.newMemorySaved?.category,
      savedMemory: result.newMemorySaved || undefined
    };
  }
}

export const apiService = new ApiService();
export type { Memory, User };
