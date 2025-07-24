// Content script for DeepSeek
import { loadMemoriesForPlatform } from "./shared";
import { requestInterceptor } from "../services/requestInterceptor";

console.log("OpenMemo: DeepSeek content script loaded");

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initDeepSeekIntegration);
} else {
  initDeepSeekIntegration();
}

function initDeepSeekIntegration() {
  console.log("OpenMemo: Initializing DeepSeek integration...");

  // Start automatic memory loading via request interception
  console.log("OpenMemo: Starting automatic memory loading for DeepSeek");
  console.log("OpenMemo: Current provider detected:", requestInterceptor.getCurrentProvider());
  
  // Always try to start interception for DeepSeek - the service will check provider internally
  if (window.location.hostname.includes('chat.deepseek.com') || window.location.hostname.includes('deepseek.com')) {
    console.log("OpenMemo: Confirmed on DeepSeek domain, starting request interception");
    requestInterceptor.startIntercepting();
  } else {
    console.log("OpenMemo: Not on DeepSeek domain, skipping request interception");
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
    console.log("OpenMemo: Delayed check for DeepSeek elements...");
    checkForComposer();
  }, 2000);

  setTimeout(() => {
    console.log("OpenMemo: Second delayed check for DeepSeek elements...");
    checkForComposer();
  }, 5000);
}

function checkForComposer() {
  console.log("OpenMemo: Checking for DeepSeek composer...");

  // Try multiple selectors for DeepSeek's composer actions area
  const selectors = [
    '.chat-input-container .actions',
    '.input-container .toolbar',
    '.chat-input .actions',
    'div[class*="input"] .actions',
    '.composer .actions',
    'form .actions',
    '#chat-input-container .actions',
  ];

  let composerActions = null;

  for (const selector of selectors) {
    composerActions = document.querySelector(selector);
    if (composerActions) {
      console.log(
        `OpenMemo: Found composer actions with selector: ${selector}`
      );
      break;
    }
  }

  // If no specific action area found, try to find the input and add a button near it
  if (!composerActions) {
    const inputArea = document.querySelector('textarea[placeholder*="Enter your message"], #chat-input, .chat-input textarea');
    if (inputArea) {
      console.log("OpenMemo: Found input area, creating action container");
      const container = inputArea.closest('div[class*="input"], div[class*="chat"]');
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
    console.log("OpenMemo: Adding load memories button to DeepSeek composer");
    addLoadMemoriesButton(composerActions);
  } else if (!composerActions) {
    console.log("OpenMemo: No composer actions area found in DeepSeek");
  } else {
    console.log("OpenMemo: Load memories button already exists in DeepSeek");
  }
}

function addLoadMemoriesButton(container: Element) {
  const loadButton = document.createElement("button");
  loadButton.className = "openmemo-load-btn";
  loadButton.setAttribute("aria-label", "Load memories");
  loadButton.setAttribute("type", "button");
  loadButton.setAttribute("data-testid", "openmemo-load-memories-button");
  
  // Style to match DeepSeek's design
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
  
  // Hover effects
  loadButton.addEventListener('mouseenter', () => {
    loadButton.style.background = 'rgba(255, 255, 255, 0.2)';
    loadButton.style.color = '#333';
  });
  
  loadButton.addEventListener('mouseleave', () => {
    loadButton.style.background = 'rgba(255, 255, 255, 0.1)';
    loadButton.style.color = '#666';
  });

  loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    loadMemoriesForPlatform();
  });

  container.appendChild(loadButton);
}
