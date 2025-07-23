import { apiService } from './api';

interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
  tokenType?: string;
}

interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  provider: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: AuthUser | null;
  tokens: AuthTokens | null;
}

/**
 * Secure authentication service for the extension
 * Handles OAuth flows, token storage, and auth state management
 */
class AuthService {
  private readonly STORAGE_KEYS = {
    TOKENS: 'openmemo_auth_tokens',
    USER: 'openmemo_auth_user',
    STATE: 'openmemo_auth_state'
  } as const;

  private authListeners: Array<(state: AuthState) => void> = [];
  private currentState: AuthState = {
    isAuthenticated: false,
    user: null,
    tokens: null
  };

  constructor() {
    this.initializeAuth();
    this.setupMessageListener();
  }

  /**
   * Initialize auth service and restore previous session
   */
  private async initializeAuth(): Promise<void> {
    try {
      // First check for pending OAuth data
      await this.checkPendingOAuth();
      
      const stored = await this.getStoredAuth();
      if (stored.tokens) {
        // Verify tokens are still valid
        if (await this.validateTokens(stored.tokens)) {
          this.currentState = {
            isAuthenticated: true,
            user: stored.user,
            tokens: stored.tokens
          };
        } else {
          // Tokens invalid, clear storage
          await this.clearAuth();
        }
      }
      this.notifyListeners();
    } catch (error) {
      console.error('Auth initialization failed:', error);
      await this.clearAuth();
    }
  }

  /**
   * Check for pending OAuth data from background script
   */
  private async checkPendingOAuth(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.local.get(['pending_oauth'], async (result) => {
        const pendingOAuth = result.pending_oauth;
        
        if (pendingOAuth) {
          console.log('OpenMemo: Found pending OAuth data:', pendingOAuth);
          
          // Check if the data is not too old (within 5 minutes)
          const fiveMinutesAgo = Date.now() - (5 * 60 * 1000);
          if (pendingOAuth.timestamp > fiveMinutesAgo) {
            console.log('OpenMemo: Processing pending OAuth data');
            
            // Process the OAuth data
            await this.handleOAuthMessage({
              code: pendingOAuth.code,
              state: pendingOAuth.state,
              provider: pendingOAuth.provider
            });
            
            // Clear the pending data
            chrome.storage.local.remove(['pending_oauth']);
          } else {
            console.log('OpenMemo: Pending OAuth data too old, ignoring');
            chrome.storage.local.remove(['pending_oauth']);
          }
        }
        
        resolve();
      });
    });
  }

  /**
   * Setup message listener for OAuth callbacks
   */
  private setupMessageListener(): void {
    chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
      console.log('=== AUTH SERVICE RECEIVED MESSAGE ===');
      console.log('OpenMemo: Auth service received message:', message);
      
      if (message.type === 'OAUTH_CALLBACK') {
        console.log('OpenMemo: Processing OAuth callback message:', message);
        this.handleOAuthMessage(message);
        sendResponse({ success: true });
        return true;
      }
      
      // Also handle direct OAUTH_SUCCESS messages from background
      if (message.type === 'OAUTH_SUCCESS') {
        console.log('OpenMemo: Processing direct OAuth success message:', message);
        this.handleOAuthMessage({
          code: message.code,
          state: message.state,
          provider: message.provider
        });
        sendResponse({ success: true });
        return true;
      }
      
      if (message.type === 'OAUTH_ERROR_CALLBACK') {
        console.error('OpenMemo: OAuth error received:', message.error);
        // Clear any stored auth state on error
        this.clearAuthState();
        sendResponse({ success: true });
        return true;
      }
      
      return false; // Let other listeners handle the message
    });
  }

  /**
   * Handle OAuth message from background script
   */
  private async handleOAuthMessage(message: { code: string; state: string; provider: string }): Promise<void> {
    console.log('OpenMemo: Starting OAuth message handling...');
    
    try {
      console.log('OpenMemo: Getting stored auth state...');
      
      // Get stored PKCE verifier
      const storedState = await this.getStoredAuthState();
      console.log('OpenMemo: Stored state:', storedState ? 'found' : 'not found');
      
      if (!storedState) {
        throw new Error('No stored auth state found');
      }
      
      if (storedState.state !== message.state) {
        console.error('State mismatch:', { stored: storedState.state, received: message.state });
        throw new Error('Invalid auth state - state parameter mismatch');
      }

      console.log('OpenMemo: Exchanging code for tokens...');
      
      // Exchange code for tokens
      const result = await this.exchangeCodeForTokens(message.code, storedState.codeVerifier, message.provider);
      
      console.log('OpenMemo: Token exchange successful, storing auth data...');
      
      // Store auth data
      await this.storeAuthData(result);
      
      // Update state
      this.currentState = {
        isAuthenticated: true,
        user: result.user,
        tokens: result.tokens
      };
      
      console.log('OpenMemo: Auth state updated, cleaning up...');
      
      // Clean up
      await this.clearAuthState();
      
      console.log('OpenMemo: Notifying listeners...');
      this.notifyListeners();
      
      console.log('OpenMemo: Authentication completed successfully');
    } catch (error) {
      console.error('OAuth message handling failed:', error);
      console.error('Error details:', error);
      await this.clearAuthState();
      
      // Notify listeners of failed auth
      this.notifyListeners();
    }
  }

  /**
   * Start OAuth authentication flow
   */
  async startAuth(provider: 'github' | 'google' = 'github'): Promise<void> {
    try {
      // Generate PKCE parameters
      const { codeVerifier, codeChallenge, state } = await this.generatePKCE();
      
      // Store PKCE state for verification
      await this.storeAuthState({ codeVerifier, state, provider });

      // Get auth URL from API
      const authUrl = await this.getAuthUrl(provider, codeChallenge, state);
      
      // Open auth URL in new tab
      await chrome.tabs.create({ url: authUrl });
      
      console.log('OpenMemo: Auth flow started, waiting for callback...');
      
    } catch (error) {
      console.error('Failed to start auth:', error);
      throw new Error('Authentication failed to start');
    }
  }


  /**
   * Logout user and clear all auth data
   */
  async logout(): Promise<void> {
    try {
      // Revoke tokens on server if possible
      if (this.currentState.tokens) {
        await this.revokeTokens();
      }
    } catch (error) {
      console.warn('Token revocation failed:', error);
    } finally {
      await this.clearAuth();
      this.currentState = {
        isAuthenticated: false,
        user: null,
        tokens: null
      };
      this.notifyListeners();
    }
  }

  /**
   * Get current auth state
   */
  getAuthState(): AuthState {
    return { ...this.currentState };
  }

  /**
   * Get access token for API calls
   */
  async getAccessToken(): Promise<string | null> {
    if (!this.currentState.tokens) {
      return null;
    }

    // Check if token is expired
    if (this.isTokenExpired(this.currentState.tokens)) {
      try {
        await this.refreshAccessToken();
      } catch (error) {
        console.error('Token refresh failed:', error);
        await this.logout();
        return null;
      }
    }

    return this.currentState.tokens.accessToken;
  }

  /**
   * Subscribe to auth state changes
   */
  onAuthStateChanged(listener: (state: AuthState) => void): () => void {
    this.authListeners.push(listener);
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(listener);
      if (index > -1) {
        this.authListeners.splice(index, 1);
      }
    };
  }

  /**
   * Generate PKCE parameters for OAuth
   */
  private async generatePKCE(): Promise<{ codeVerifier: string; codeChallenge: string; state: string }> {
    // Generate random code verifier
    const codeVerifier = this.generateRandomString(128);
    
    // Generate code challenge
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await crypto.subtle.digest('SHA-256', data);
    const codeChallenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '');
    
    // Generate state
    const state = this.generateRandomString(32);
    
    return { codeVerifier, codeChallenge, state };
  }

  /**
   * Generate random string for PKCE
   */
  private generateRandomString(length: number): string {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let text = '';
    
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    
    return text;
  }

  /**
   * Get auth URL from API
   */
  private async getAuthUrl(provider: string, codeChallenge: string, state: string): Promise<string> {
    const response = await fetch(`${apiService.getApiBaseUrl()}/auth/${provider}/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ codeChallenge, state })
    });

    if (!response.ok) {
      throw new Error(`Failed to get auth URL: ${response.statusText}`);
    }

    const { url } = await response.json();
    return url;
  }

  /**
   * Exchange authorization code for tokens
   */
  private async exchangeCodeForTokens(code: string, codeVerifier: string, provider: string): Promise<{
    tokens: AuthTokens;
    user: AuthUser;
  }> {
    const response = await fetch(`${apiService.getApiBaseUrl()}/auth/${provider}/callback`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, codeVerifier })
    });

    if (!response.ok) {
      throw new Error(`Token exchange failed: ${response.statusText}`);
    }

    const result = await response.json();
    return {
      tokens: {
        accessToken: result.token,
        refreshToken: result.refreshToken,
        expiresAt: result.expiresAt,
        tokenType: result.tokenType || 'Bearer'
      },
      user: {
        ...result.user,
        provider
      }
    };
  }


  /**
   * Validate stored tokens
   */
  private async validateTokens(tokens: AuthTokens): Promise<boolean> {
    try {
      // Check expiration
      if (this.isTokenExpired(tokens)) {
        return false;
      }

      // Verify with API
      const response = await fetch(`${apiService.getApiBaseUrl()}/auth/verify`, {
        headers: {
          'Authorization': `${tokens.tokenType || 'Bearer'} ${tokens.accessToken}`
        }
      });

      return response.ok;
    } catch {
      return false;
    }
  }

  /**
   * Check if token is expired
   */
  private isTokenExpired(tokens: AuthTokens): boolean {
    if (!tokens.expiresAt) {
      return false; // Assume non-expiring if no expiration set
    }
    return Date.now() >= tokens.expiresAt;
  }

  /**
   * Refresh access token
   */
  private async refreshAccessToken(): Promise<void> {
    if (!this.currentState.tokens?.refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await fetch(`${apiService.getApiBaseUrl()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: this.currentState.tokens.refreshToken })
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const result = await response.json();
    const newTokens: AuthTokens = {
      accessToken: result.token,
      refreshToken: result.refreshToken || this.currentState.tokens.refreshToken,
      expiresAt: result.expiresAt,
      tokenType: result.tokenType || 'Bearer'
    };

    this.currentState.tokens = newTokens;
    await this.storeTokens(newTokens);
  }

  /**
   * Revoke tokens on server
   */
  private async revokeTokens(): Promise<void> {
    if (!this.currentState.tokens) return;

    await fetch(`${apiService.getApiBaseUrl()}/auth/revoke`, {
      method: 'POST',
      headers: {
        'Authorization': `${this.currentState.tokens.tokenType || 'Bearer'} ${this.currentState.tokens.accessToken}`,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Storage methods
   */
  private async storeAuthData(data: { tokens: AuthTokens; user: AuthUser }): Promise<void> {
    await chrome.storage.local.set({
      [this.STORAGE_KEYS.TOKENS]: data.tokens,
      [this.STORAGE_KEYS.USER]: data.user
    });
  }

  private async storeTokens(tokens: AuthTokens): Promise<void> {
    await chrome.storage.local.set({
      [this.STORAGE_KEYS.TOKENS]: tokens
    });
  }

  private async storeAuthState(state: { codeVerifier: string; state: string; provider: string }): Promise<void> {
    await chrome.storage.local.set({
      [this.STORAGE_KEYS.STATE]: state
    });
  }

  private async getStoredAuth(): Promise<{ tokens: AuthTokens | null; user: AuthUser | null }> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.STORAGE_KEYS.TOKENS, this.STORAGE_KEYS.USER], (result) => {
        resolve({
          tokens: result[this.STORAGE_KEYS.TOKENS] || null,
          user: result[this.STORAGE_KEYS.USER] || null
        });
      });
    });
  }

  private async getStoredAuthState(): Promise<{ codeVerifier: string; state: string; provider: string } | null> {
    return new Promise((resolve) => {
      chrome.storage.local.get([this.STORAGE_KEYS.STATE], (result) => {
        resolve(result[this.STORAGE_KEYS.STATE] || null);
      });
    });
  }

  private async clearAuth(): Promise<void> {
    await chrome.storage.local.remove([
      this.STORAGE_KEYS.TOKENS,
      this.STORAGE_KEYS.USER,
      this.STORAGE_KEYS.STATE
    ]);
  }

  private async clearAuthState(): Promise<void> {
    await chrome.storage.local.remove([this.STORAGE_KEYS.STATE]);
  }

  /**
   * Notify listeners of auth state changes
   */
  private notifyListeners(): void {
    this.authListeners.forEach(listener => {
      try {
        listener(this.getAuthState());
      } catch (error) {
        console.error('Auth state listener error:', error);
      }
    });
  }
}

// Export singleton instance
export const authService = new AuthService();
export type { AuthTokens, AuthUser, AuthState };