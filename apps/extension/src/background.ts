chrome.runtime.onInstalled.addListener(() => {
  console.log("OpenMemo extension installed");
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
});
