// Utility to bypass CSP restrictions by using background script as proxy
// This allows content scripts to make API calls even when CSP blocks direct fetch

export interface ApiProxyOptions {
  endpoint: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export interface ApiProxyResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

/**
 * Make API requests through background script to bypass CSP restrictions
 */
export async function proxyApiRequest<T = any>(options: ApiProxyOptions): Promise<T> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'API_PROXY',
        endpoint: options.endpoint,
        method: options.method || 'GET',
        body: options.body,
        headers: options.headers || {}
      },
      (response: ApiProxyResponse<T>) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response.success) {
          resolve(response.data!);
        } else {
          reject(new Error(response.error || 'API request failed'));
        }
      }
    );
  });
}

/**
 * Check authentication status through background script proxy
 */
export async function proxyAuthCheck(): Promise<{ isAuthenticated: boolean; user?: any }> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'AUTH_PROXY' },
      (response: ApiProxyResponse<{ isAuthenticated: boolean; user?: any }>) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (response.success) {
          resolve(response.data!);
        } else {
          reject(new Error(response.error || 'Auth check failed'));
        }
      }
    );
  });
}

/**
 * Detect if we're on a CSP-restricted site that needs proxy
 */
export function needsCspBypass(): boolean {
  const hostname = window.location.hostname;
  
  // List of known CSP-restricted sites
  const restrictedSites = [
    'chat.deepseek.com',
    // Can add more sites as needed
  ];
  
  return restrictedSites.some(site => hostname.includes(site));
}

/**
 * Universal API function that automatically chooses direct or proxy based on site
 */
export async function universalApiRequest<T = any>(
  directApiCall: () => Promise<T>,
  proxyOptions: ApiProxyOptions
): Promise<T> {
  if (needsCspBypass()) {
    console.log('OpenMemo: Using CSP bypass proxy for API request');
    return proxyApiRequest<T>(proxyOptions);
  } else {
    console.log('OpenMemo: Using direct API request');
    return directApiCall();
  }
}

/**
 * Universal auth check that automatically chooses direct or proxy
 */
export async function universalAuthCheck(
  directAuthCheck: () => Promise<boolean>
): Promise<{ isAuthenticated: boolean; user?: any }> {
  if (needsCspBypass()) {
    console.log('OpenMemo: Using CSP bypass proxy for auth check');
    return proxyAuthCheck();
  } else {
    console.log('OpenMemo: Using direct auth check');
    const isAuthenticated = await directAuthCheck();
    return { isAuthenticated };
  }
}