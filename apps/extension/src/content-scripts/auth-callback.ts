// Content script for the OAuth callback page
// This runs on the API callback page to handle the OAuth success

console.log("=== OPENMEMO AUTH CALLBACK SCRIPT LOADED ===");
console.log("OpenMemo: Auth callback content script loaded on URL:", window.location.href);
console.log("OpenMemo: Window location hostname:", window.location.hostname);
console.log("OpenMemo: Window location pathname:", window.location.pathname);
console.log("OpenMemo: Window location search:", window.location.search);
console.log("OpenMemo: Document readyState:", document.readyState);
console.log("OpenMemo: Chrome runtime available:", typeof chrome !== 'undefined' && !!chrome.runtime);

// Function to send OAuth success message
function sendOAuthSuccess() {
  const url = window.location.href;
  
  // Parse URL parameters
  const urlObj = new URL(url);
  const code = urlObj.searchParams.get('code');
  const state = urlObj.searchParams.get('state');
  const error = urlObj.searchParams.get('error');
  
  console.log("OpenMemo: OAuth callback details:");
  console.log("  - URL:", url);
  console.log("  - Code:", code);
  console.log("  - State:", state);
  console.log("  - Error:", error);
  
  if (error) {
    console.error("OpenMemo: OAuth error:", error);
    // Notify extension of error
    chrome.runtime.sendMessage({
      type: "OAUTH_ERROR",
      error: error
    });
    return;
  }
  
  if (code && state) {
    // Determine provider from URL
    let provider = 'github';
    if (url.includes('/auth/google/')) {
      provider = 'google';
    } else if (url.includes('/auth/github/')) {
      provider = 'github';
    }
    
    console.log("OpenMemo: Sending OAuth success message to background script");
    console.log("  - Provider:", provider);
    console.log("  - Code:", code.substring(0, 10) + "...");
    console.log("  - State:", state);
    
    // Send message to background script
    try {
      console.log("OpenMemo: Sending OAUTH_SUCCESS message to background script");
      chrome.runtime.sendMessage({
        type: "OAUTH_SUCCESS",
        code: code,
        state: state,
        provider: provider
      }, (response) => {
        console.log("OpenMemo: Background script response:", response);
        if (chrome.runtime.lastError) {
          console.error("OpenMemo: Runtime error:", chrome.runtime.lastError);
        } else {
          console.log("OpenMemo: OAuth message sent successfully to background!");
        }
      });
    } catch (error) {
      console.error("OpenMemo: Failed to send message to background:", error);
    }
    
    // Also try postMessage for compatibility
    if (window.opener && !window.opener.closed) {
      try {
        window.opener.postMessage({
          type: 'oauth_success',
          code: code,
          state: state,
          provider: provider
        }, '*');
        console.log("OpenMemo: Sent postMessage to opener");
      } catch (error) {
        console.error("OpenMemo: Failed to send postMessage:", error);
      }
    } else {
      console.log("OpenMemo: No opener window available");
    }
    
    // Try to close the window after processing
    setTimeout(() => {
      console.log("OpenMemo: Attempting to close auth window from extension");
      try {
        window.close();
      } catch (error) {
        console.log("OpenMemo: Could not close window from extension (normal in some cases)");
      }
    }, 2000); // Close from extension side after 2 seconds
  } else {
    console.error("OpenMemo: Missing code or state parameters");
  }
}

// Function to detect if we're on the right page
function isCallbackPage() {
  const url = window.location.href;
  const pathname = window.location.pathname;
  const search = window.location.search;
  
  console.log("OpenMemo: Checking if callback page:");
  console.log("  - URL:", url);
  console.log("  - Pathname:", pathname);
  console.log("  - Search params:", search);
  
  const isCallback = (pathname.includes('/api/auth/') && pathname.includes('/callback')) || 
                    (url.includes('/api/auth/') && url.includes('/callback'));
  const hasParams = search.includes('code=') || search.includes('error=');
  
  console.log("  - Is callback URL:", isCallback);
  console.log("  - Has OAuth params:", hasParams);
  
  return isCallback && hasParams;
}

// Execute immediately if we're on the callback page
if (isCallbackPage()) {
  console.log("OpenMemo: Detected OAuth callback page, processing...");
  
  // Execute immediately
  sendOAuthSuccess();
  
  // Also execute when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      console.log("OpenMemo: DOM ready, re-checking OAuth callback...");
      sendOAuthSuccess();
    });
  }
  
  // Also execute when window is fully loaded
  if (document.readyState !== 'complete') {
    window.addEventListener('load', () => {
      console.log("OpenMemo: Window loaded, re-checking OAuth callback...");
      sendOAuthSuccess();
    });
  }
  
  // Execute after a short delay as well (in case the page data isn't ready yet)
  setTimeout(() => {
    console.log("OpenMemo: Delayed execution of OAuth callback...");
    sendOAuthSuccess();
  }, 1000);

  // Listen for custom event from page script as fallback
  document.addEventListener('oauthSuccess', (event: any) => {
    console.log("OpenMemo: Received oauthSuccess event:", event.detail);
    const { code, state, provider } = event.detail;
    
    if (code && state && provider) {
      console.log("OpenMemo: Processing OAuth success from custom event");
      
      // Send message to background script
      try {
        chrome.runtime.sendMessage({
          type: "OAUTH_SUCCESS",
          code: code,
          state: state,
          provider: provider
        }, (response) => {
          console.log("OpenMemo: Background script response from event:", response);
          if (chrome.runtime.lastError) {
            console.error("OpenMemo: Runtime error from event:", chrome.runtime.lastError);
          }
        });
      } catch (error) {
        console.error("OpenMemo: Failed to send message from event:", error);
      }
    }
  });

  // Also try to access window.oauthData if available - check multiple times
  const checkWindowData = () => {
    const oauthData = (window as any).oauthData;
    console.log("OpenMemo: Checking window.oauthData:", oauthData);
    
    if (oauthData && oauthData.code && oauthData.state) {
      console.log("OpenMemo: Found oauthData on window, processing...");
      try {
        chrome.runtime.sendMessage({
          type: "OAUTH_SUCCESS",
          code: oauthData.code,
          state: oauthData.state,
          provider: oauthData.provider
        }, (response) => {
          console.log("OpenMemo: Background script response from window data:", response);
          if (chrome.runtime.lastError) {
            console.error("OpenMemo: Runtime error from window data:", chrome.runtime.lastError);
          }
        });
        return true; // Found and processed
      } catch (error) {
        console.error("OpenMemo: Failed to send message from window data:", error);
      }
    }
    return false; // Not found or failed
  };
  
  // Check multiple times with increasing delays
  const delays = [100, 500, 1000, 2000];
  delays.forEach((delay, index) => {
    setTimeout(() => {
      if (!checkWindowData()) {
        console.log(`OpenMemo: Window data check ${index + 1} failed, retrying...`);
      } else {
        console.log(`OpenMemo: Window data check ${index + 1} succeeded!`);
      }
    }, delay);
  });
  
} else {
  console.log("OpenMemo: Not a callback page, script will not execute");
}