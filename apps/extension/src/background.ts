// Handle extension install, update, and enable events
chrome.runtime.onInstalled.addListener((details) => {
  console.log("OpenMemo extension event:", details.reason);
  
  if (details.reason === 'install') {
    // First time installation
    console.log("OpenMemo: First time installation detected");
    
    // Set initial installation data
    chrome.storage.local.set({
      'openmemo_installed': true,
      'install_date': new Date().toISOString(),
      'version': chrome.runtime.getManifest().version,
      'first_run': true
    });
    
    // Open popup automatically on first install
    setTimeout(() => {
      chrome.action.openPopup().catch((error) => {
        console.log("Could not auto-open popup on install:", error);
        // Alternative: Create notification or badge
        chrome.action.setBadgeText({ text: 'NEW' });
        chrome.action.setBadgeBackgroundColor({ color: '#A8FF00' });
      });
    }, 1500); // Wait a bit for extension to fully load
    
  } else if (details.reason === 'update') {
    // Extension update
    const oldVersion = details.previousVersion || '0.0.0';
    const newVersion = chrome.runtime.getManifest().version;
    
    console.log(`OpenMemo: Updated from ${oldVersion} to ${newVersion}`);
    
    // Store update information
    chrome.storage.local.set({
      'version': newVersion,
      'last_update': new Date().toISOString(),
      'previous_version': oldVersion,
      'updated': true
    });
    
    // Show update notification
    showUpdateNotification(oldVersion, newVersion);
    
  } else if (details.reason === 'chrome_update' || details.reason === 'shared_module_update') {
    console.log("OpenMemo: Browser or shared module was updated");
  }
});

// Function to show update notification
function showUpdateNotification(oldVersion: string, newVersion: string) {
  // Create a notification for major updates
  const [oldMajor, oldMinor] = oldVersion.split('.');
  const [newMajor, newMinor] = newVersion.split('.');
  
  // Show notification for major or minor version updates
  if (oldMajor !== newMajor || oldMinor !== newMinor) {
    chrome.action.setBadgeText({ text: 'UPD' });
    chrome.action.setBadgeBackgroundColor({ color: '#00D4FF' });
    
    // Clear badge after 5 seconds
    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 5000);
    
    console.log(`OpenMemo: Major update detected (${oldVersion} → ${newVersion})`);
  }
}

// Handle startup to check for updates and manage state
chrome.runtime.onStartup.addListener(() => {
  console.log("OpenMemo: Extension started");
  
  // Check if this is the first run after installation
  chrome.storage.local.get(['first_run', 'updated'], (result) => {
    if (result.first_run) {
      console.log("OpenMemo: First run after installation");
      // Clear first run flag
      chrome.storage.local.set({ 'first_run': false });
    }
    
    if (result.updated) {
      console.log("OpenMemo: Recently updated");
      // Clear updated flag after startup
      chrome.storage.local.set({ 'updated': false });
    }
  });
});

// Handle messages from content scripts and auth callback
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "SAVE_MEMORY") {
    // Handle saving memory to Chrome storage
    chrome.storage.local.get(["memories"], (result) => {
      const memories = result.memories || [];
      const newMemory = {
        id: Date.now().toString(),
        content: request.content,
        category: request.category || "General",
        timestamp: new Date().toISOString(),
        source: request.source || "manual",
      };

      memories.push(newMemory);
      chrome.storage.local.set({ memories }, () => {
        sendResponse({ success: true, memory: newMemory });
      });
    });

    return true; // Keep the messaging channel open for async response
  }

  if (request.type === "GET_MEMORIES") {
    chrome.storage.local.get(["memories"], (result) => {
      sendResponse({ memories: result.memories || [] });
    });

    return true;
  }

  // Handle OAuth callback from the auth page
  if (request.type === "OAUTH_SUCCESS") {
    console.log("=== OAUTH SUCCESS RECEIVED IN BACKGROUND ===");
    console.log("OAuth success received in background:", request);
    
    // Store OAuth data for later retrieval by popup/auth service
    console.log("OpenMemo: Storing OAuth data in background script");
    chrome.storage.local.set({
      'pending_oauth': {
        type: "OAUTH_SUCCESS",
        code: request.code,
        state: request.state,
        provider: request.provider,
        timestamp: Date.now()
      }
    }, () => {
      console.log("OpenMemo: OAuth data stored successfully");
    });

    // Close the auth tab if provided
    if (sender.tab?.id) {
      chrome.tabs.remove(sender.tab.id);
    }

    // Automatically open popup after successful authentication
    setTimeout(() => {
      chrome.action.openPopup().catch((error) => {
        console.log("Could not open popup automatically:", error);
        // Fallback: try to open popup by creating a programmatic click
        // This might not work in all cases due to user gesture requirements
      });
    }, 1000);

    sendResponse({ success: true });
    return true;
  }

  // Handle OAuth errors from the auth page
  if (request.type === "OAUTH_ERROR") {
    console.error("OAuth error received in background:", request.error);
    
    // Broadcast error to extension contexts
    chrome.runtime.sendMessage({
      type: "OAUTH_ERROR_CALLBACK",
      error: request.error
    }).catch((error) => {
      console.error("Failed to broadcast OAuth error:", error);
    });

    // Close the auth tab if provided
    if (sender.tab?.id) {
      chrome.tabs.remove(sender.tab.id);
    }

    sendResponse({ success: true });
    return true;
  }

  // Handle popup opening requests from content scripts
  if (request.action === "openPopup") {
    console.log("OpenMemo: Content script requested popup opening");
    
    chrome.action.openPopup().catch((error) => {
      console.log("OpenMemo: Could not open popup from background:", error);
      // Try alternative method: create a new tab with the popup URL
      chrome.tabs.create({
        url: chrome.runtime.getURL("popup.html"),
        active: true
      }).catch((tabError) => {
        console.error("OpenMemo: Could not create popup tab:", tabError);
      });
    });

    sendResponse({ success: true });
    return true;
  }

  // Handle version check requests
  if (request.type === "GET_VERSION_INFO") {
    chrome.storage.local.get(['install_date', 'last_update', 'previous_version', 'first_run'], (result) => {
      sendResponse({
        current_version: chrome.runtime.getManifest().version,
        install_date: result.install_date,
        last_update: result.last_update,
        previous_version: result.previous_version,
        first_run: result.first_run || false
      });
    });
    return true;
  }

  // Handle badge clearing requests
  if (request.type === "CLEAR_BADGE") {
    chrome.action.setBadgeText({ text: '' });
    sendResponse({ success: true });
    return true;
  }

  // Handle API proxy requests for CSP-restricted sites (like DeepSeek)
  if (request.type === "API_PROXY") {
    handleApiProxy(request, sendResponse);
    return true;
  }

  // Handle authentication proxy for CSP-restricted sites
  if (request.type === "AUTH_PROXY") {
    handleAuthProxy(sendResponse);
    return true;
  }
});

// API proxy function to bypass CSP restrictions
async function handleApiProxy(request: any, sendResponse: any) {
  try {
    const { endpoint, method = 'GET', body, headers = {} } = request;
    
    // Get auth token from storage
    const result = await chrome.storage.local.get(["openmemo_auth_tokens"]);
    const tokens = result.openmemo_auth_tokens;
    const authToken = tokens?.accessToken;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers
    };

    if (authToken) {
      requestHeaders['Authorization'] = `Bearer ${authToken}`;
    }

    // Make the API request from background script (not subject to CSP)
    const apiUrl = `http://localhost:3001/api${endpoint}`;
    console.log(`OpenMemo Background: Making API request to ${apiUrl}`);

    const response = await fetch(apiUrl, {
      method,
      headers: requestHeaders,
      ...(body && { body: JSON.stringify(body) })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    sendResponse({ success: true, data });

  } catch (error) {
    console.error('OpenMemo Background: API proxy error:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}

// Authentication proxy function
async function handleAuthProxy(sendResponse: any) {
  try {
    // Get auth token from storage
    const result = await chrome.storage.local.get(["openmemo_auth_tokens"]);
    const tokens = result.openmemo_auth_tokens;
    const authToken = tokens?.accessToken;

    if (!authToken) {
      sendResponse({ success: true, isAuthenticated: false });
      return;
    }

    // Verify token by making a request to /auth/me
    const response = await fetch('http://localhost:3001/api/auth/me', {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.ok) {
      const userData = await response.json();
      sendResponse({ 
        success: true, 
        isAuthenticated: true, 
        user: userData.user 
      });
    } else {
      // Token is invalid, clear it
      await chrome.storage.local.remove(["openmemo_auth_tokens"]);
      sendResponse({ success: true, isAuthenticated: false });
    }

  } catch (error) {
    console.error('OpenMemo Background: Auth proxy error:', error);
    sendResponse({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    });
  }
}
