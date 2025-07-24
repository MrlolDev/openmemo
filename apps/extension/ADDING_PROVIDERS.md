# Adding New AI Provider Support to OpenMemo

This guide explains how to add support for new AI chat providers to the OpenMemo extension's automatic memory loading feature.

## Overview

The automatic memory loading system works by intercepting HTTP requests made by AI chat interfaces and injecting relevant memories into the user's messages before they are sent to the AI provider.

## Step 1: Add Provider Configuration

Edit `src/config/providers.ts` and add a new provider configuration:

```typescript
export const AI_PROVIDERS: Record<string, ProviderConfig> = {
  // ... existing providers

  your_provider: {
    name: 'Your Provider Name',
    hostname: 'your-provider.com',
    apiEndpoint: '/api/chat/completion', // The API endpoint that handles chat requests
    method: 'POST', // HTTP method used by the provider
    description: 'Your Provider description',
    
    extractUserMessage: (data: any) => {
      // Extract the user's message from the request data
      // This function should return the user's message as a string
      // Example implementations:
      
      // For simple prompt-based providers:
      return data?.prompt || '';
      
      // For message-based providers:
      // const messages = data?.messages;
      // if (!messages || !Array.isArray(messages)) return '';
      // const lastMessage = messages[messages.length - 1];
      // return lastMessage?.content || '';
    },
    
    injectMemoryContext: (data: any, memoryContext: string) => {
      // Inject memory context into the request data
      // This function should return the modified request data
      
      // For simple prompt-based providers:
      const originalPrompt = data?.prompt || '';
      const enhancedPrompt = `Context from my saved memories:\n${memoryContext}\n\nMy current question/message: ${originalPrompt}`;
      
      return {
        ...data,
        prompt: enhancedPrompt
      };
      
      // For message-based providers:
      // const messages = data?.messages;
      // if (!messages || !Array.isArray(messages)) return data;
      // 
      // const lastMessage = messages[messages.length - 1];
      // const enhancedMessage = `Context from my saved memories:\n${memoryContext}\n\nMy current question/message: ${lastMessage.content}`;
      // 
      // return {
      //   ...data,
      //   messages: [
      //     ...messages.slice(0, -1),
      //     { ...lastMessage, content: enhancedMessage }
      //   ]
      // };
    }
  }
};
```

## Step 2: Create or Update Content Script

Create a new content script file `src/content-scripts/your-provider.ts`:

```typescript
// Content script for your-provider.com
import { showNotification, loadMemoriesForPlatform } from "./shared";
import { requestInterceptor } from "../services/requestInterceptor";

console.log("OpenMemo: YourProvider content script loaded");

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initYourProviderIntegration);
} else {
  initYourProviderIntegration();
}

function initYourProviderIntegration() {
  console.log("OpenMemo: Initializing YourProvider integration...");

  // Start automatic memory loading via request interception
  console.log("OpenMemo: Starting automatic memory loading for YourProvider");
  if (requestInterceptor.getCurrentProvider() === 'your_provider') {
    requestInterceptor.startIntercepting();
  }

  // Monitor for changes in the DOM to handle dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        checkForComposer();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial check
  checkForComposer();

  // Also check periodically in case DOM isn't ready yet
  setTimeout(() => {
    console.log("OpenMemo: Delayed check for YourProvider elements...");
    checkForComposer();
  }, 2000);
}

function checkForComposer() {
  console.log("OpenMemo: Checking for YourProvider composer...");

  // Try multiple selectors for your provider's composer actions area
  const selectors = [
    '.chat-input .actions',
    '.input-container .toolbar',
    'div[class*="input"] .actions',
    '.composer .actions',
    'form .actions',
    // Add more selectors specific to your provider
  ];

  let composerActions = null;

  for (const selector of selectors) {
    composerActions = document.querySelector(selector);
    if (composerActions) {
      console.log(`OpenMemo: Found composer actions with selector: ${selector}`);
      break;
    }
  }

  // If no specific action area found, try to find the input and add a button near it
  if (!composerActions) {
    const inputArea = document.querySelector('textarea, input[type="text"]');
    if (inputArea) {
      console.log("OpenMemo: Found input area, creating action container");
      const container = inputArea.closest('div');
      if (container) {
        // Create an action area if none exists
        let actionDiv = container.querySelector(".openmemo-actions") as HTMLElement;
        if (!actionDiv) {
          actionDiv = document.createElement("div");
          actionDiv.className = "openmemo-actions";
          actionDiv.style.cssText = "position: absolute; top: 8px; right: 8px; z-index: 10; display: flex; gap: 8px; align-items: center;";
          (container as HTMLElement).style.position = "relative";
          container.appendChild(actionDiv);
        }
        composerActions = actionDiv;
      }
    }
  }

  if (composerActions && !composerActions.querySelector(".openmemo-load-btn")) {
    console.log("OpenMemo: Adding load memories button to YourProvider composer");
    addLoadMemoriesButton(composerActions);
  }
}

function addLoadMemoriesButton(container: Element) {
  const loadButton = document.createElement("button");
  loadButton.className = "openmemo-load-btn";
  loadButton.setAttribute("aria-label", "Load memories");
  loadButton.setAttribute("type", "button");
  
  // Style to match your provider's design
  loadButton.style.cssText = `
    width: 32px;
    height: 32px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: #666;
  `;
  
  loadButton.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <image href="${chrome.runtime?.getURL ? chrome.runtime.getURL('logo.png') : '/logo.png'}" width="18" height="18" style="object-fit: contain;" />
    </svg>
  `;
  
  loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    loadMemoriesForPlatform();
  });

  container.appendChild(loadButton);
}
```

## Step 3: Update Manifest

Add the new content script to `public/manifest.json`:

```json
{
  "content_scripts": [
    {
      "matches": ["*://your-provider.com/*"],
      "js": ["content-scripts/your-provider.js"],
      "run_at": "document_end"
    }
  ]
}
```

## Step 4: Update Build Configuration

Add the new content script to your build configuration (e.g., `vite.config.ts`):

```typescript
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // ... existing entries
        'content-scripts/your-provider': 'src/content-scripts/your-provider.ts'
      }
    }
  }
});
```

## Debugging Tips

1. **Check Request Interception**: Open the browser's developer tools and look for console logs starting with "OpenMemo:" when sending messages.

2. **Inspect API Requests**: Use the Network tab to examine the actual API requests made by the provider and ensure your `apiEndpoint` matches.

3. **Test Message Extraction**: Add console.log statements in your `extractUserMessage` function to verify it's correctly extracting the user's message.

4. **Test Memory Injection**: Add console.log statements in your `injectMemoryContext` function to verify the memory context is being properly injected.

## Common Patterns

### Simple Prompt-Based Providers
Many AI providers use a simple `prompt` field:

```typescript
extractUserMessage: (data: any) => data?.prompt || '',
injectMemoryContext: (data: any, memoryContext: string) => ({
  ...data,
  prompt: `Context from my saved memories:\n${memoryContext}\n\nMy current question/message: ${data?.prompt || ''}`
})
```

### Message Array-Based Providers
Some providers use a messages array with role-based messages:

```typescript
extractUserMessage: (data: any) => {
  const messages = data?.messages;
  if (!messages || !Array.isArray(messages)) return '';
  const userMessages = messages.filter(m => m.role === 'user');
  return userMessages[userMessages.length - 1]?.content || '';
},
injectMemoryContext: (data: any, memoryContext: string) => {
  const messages = data?.messages;
  if (!messages || !Array.isArray(messages)) return data;
  
  const lastUserIndex = messages.map(m => m.role).lastIndexOf('user');
  if (lastUserIndex === -1) return data;
  
  const enhancedMessages = [...messages];
  enhancedMessages[lastUserIndex] = {
    ...enhancedMessages[lastUserIndex],
    content: `Context from my saved memories:\n${memoryContext}\n\nMy current question/message: ${enhancedMessages[lastUserIndex].content}`
  };
  
  return { ...data, messages: enhancedMessages };
}
```

## Testing

1. Build the extension and load it in Chrome
2. Navigate to the AI provider's website
3. Send a message and check the console for OpenMemo logs
4. Verify that the notification appears when memories are loaded
5. Test the manual load memories button functionality

## Support

If you need help adding a new provider, please create an issue in the repository with:
- The provider's website URL
- Sample API request data (with sensitive information removed)
- Any specific requirements or challenges you're facing