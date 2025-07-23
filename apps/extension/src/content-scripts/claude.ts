// Claude.ai specific content script
import { apiService, type Memory } from "../services/api";
import { loadMemoriesForPlatform } from "./shared";

// Performance optimizations
let observer: MutationObserver | null = null;
let timeouts: number[] = [];
let buttonInserted = false;
let isInitialized = false;

// Prevent universal script from running
(window as any).openMemoUniversalRunning = true;

// Throttling for performance
const CHECK_THROTTLE = 500;
let lastCheckTime = 0;

// Cleanup function
const cleanup = () => {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  timeouts.forEach(clearTimeout);
  timeouts = [];
};

// Clean up on page unload
window.addEventListener('beforeunload', cleanup);

function waitForClaudeReady() {
  // Check if basic DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initClaudeIntegration, 1000);
    });
  } else {
    setTimeout(initClaudeIntegration, 1500);
  }
}

// Wait for page load event
if (document.readyState === "complete") {
  setTimeout(initClaudeIntegration, 2000);
} else {
  window.addEventListener("load", () => {
    setTimeout(initClaudeIntegration, 2000);
  });
  waitForClaudeReady();
}

function initClaudeIntegration() {
  if (isInitialized || buttonInserted) return;
  
  isInitialized = true;
  console.log("OpenMemo: Initializing Claude.ai integration");

  // Set up mutation observer to watch for DOM changes
  observer = new MutationObserver(throttle((mutations) => {
    if (buttonInserted) return;
    
    const hasSignificantChanges = mutations.some(mutation => 
      mutation.type === "childList" && 
      (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
    );
    
    if (hasSignificantChanges) {
      checkForClaudeContainer();
    }
  }, CHECK_THROTTLE));

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial check
  checkForClaudeContainer();
  
  // Progressive retry strategy for Claude.ai
  const retryIntervals = [1000, 2000, 3000, 5000, 7000, 10000, 15000];
  
  retryIntervals.forEach((interval, index) => {
    const timeoutId = window.setTimeout(() => {
      if (!buttonInserted) {
        console.log(`OpenMemo: Claude retry ${index + 1}`);
        checkForClaudeContainer();
      }
    }, interval);
    
    timeouts.push(timeoutId);
  });
}

function throttle<T extends (...args: any[]) => void>(func: T, wait: number): T {
  let timeout: number | null = null;
  let previous = 0;
  
  return ((...args: any[]) => {
    const now = Date.now();
    const remaining = wait - (now - previous);
    
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      func.apply(null, args);
    } else if (!timeout) {
      timeout = window.setTimeout(() => {
        previous = Date.now();
        timeout = null;
        func.apply(null, args);
      }, remaining);
    }
  }) as T;
}

function isClaudeReady(): boolean {
  const main = document.querySelector("main");
  const composer = document.querySelector('div[contenteditable="true"]');
  const attachmentButton = document.querySelector('#input-plus-menu-trigger');
  return !!(main && composer && attachmentButton);
}

function checkForClaudeContainer() {
  if (buttonInserted) return;

  const now = Date.now();
  if (now - lastCheckTime < CHECK_THROTTLE) return;
  lastCheckTime = now;

  if (!isClaudeReady()) {
    console.log("OpenMemo: Claude.ai not ready yet, waiting...");
    return;
  }

  console.log("OpenMemo: Checking for Claude.ai container...");
  
  // Look for the target container selector based on user request
  const targetContainer = document.querySelector('body > div.flex.min-h-screen.w-full.overflow-x-clip > div.min-h-full.w-full.min-w-0.flex-1 > main > div.top-5.z-10.mx-auto.w-full > div > fieldset > div.\\!box-content');
  
  if (targetContainer) {
    // Check if our button already exists before this container
    const existingButton = targetContainer.parentElement?.querySelector('.openmemo-load-btn');
    if (existingButton) {
      console.log("OpenMemo: Button already exists before target container");
      buttonInserted = true;
      stopObserving();
      return;
    }

    console.log("OpenMemo: Adding OpenMemo button before target container");
    addClaudeButtonBefore(targetContainer);
    buttonInserted = true;
    stopObserving();
    return;
  }
  
  // Fallback: Look for the inner container that contains the buttons
  const innerContainer = document.querySelector('div.relative.flex-1.flex.items-center.gap-2.shrink.min-w-0');
  
  if (!innerContainer) {
    console.log("OpenMemo: Claude containers not found, trying fallback");
    // Fallback: look for button container with tools button
    const toolsButton = document.querySelector('#input-tools-menu-trigger');
    if (toolsButton && toolsButton.parentElement && toolsButton.parentElement.parentElement) {
      const fallbackContainer = toolsButton.parentElement.parentElement;
      if (!fallbackContainer.querySelector('.openmemo-load-btn')) {
        console.log("OpenMemo: Using fallback container from tools button");
        addClaudeButton(fallbackContainer);
        buttonInserted = true;
        stopObserving();
      }
    }
    return;
  }
  
  // Check if our button already exists in the inner container
  if (innerContainer.querySelector('.openmemo-load-btn')) {
    console.log("OpenMemo: Button already exists in Claude inner container");
    buttonInserted = true;
    stopObserving();
    return;
  }

  console.log("OpenMemo: Adding OpenMemo button to Claude.ai inner container (fallback)");
  addClaudeButton(innerContainer);
  buttonInserted = true;
  stopObserving();
}

function stopObserving() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  timeouts.forEach(clearTimeout);
  timeouts = [];
  console.log("OpenMemo: Claude.ai button inserted, stopping all checks");
}

function addClaudeButtonBefore(targetContainer: Element) {
  const loadButton = document.createElement("button");
  loadButton.className = "openmemo-load-btn inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none border-0.5 transition-all h-8 min-w-8 rounded-lg flex items-center px-[7.5px] group !pointer-events-auto !outline-offset-1 text-text-300 border-border-300 active:scale-[0.98] hover:text-text-200/90 hover:bg-bg-100";
  
  loadButton.setAttribute('type', 'button');
  loadButton.setAttribute('aria-pressed', 'false');
  loadButton.setAttribute('aria-label', 'Load memories from OpenMemo');
  loadButton.setAttribute('data-testid', 'openmemo-load-button');
  
  loadButton.style.cssText = `
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: transparent;
    color: hsl(var(--text-300));
    transition: all 0.2s ease;
    border: 0.5px solid hsl(var(--border-300));
    margin-right: 8px;
    margin-bottom: 8px;
  `;

  // Use the actual logo URL
  const logoUrl = chrome.runtime?.getURL('logo.png') || '/logo.png';
  
  loadButton.innerHTML = `
    <div class="flex flex-row items-center justify-center gap-1">
      <img src="${logoUrl}" width="16" height="16" style="object-fit: contain; opacity: 1; flex-shrink: 0;" alt="OpenMemo" />
    </div>
  `;

  // Add error handling for logo loading
  const logoImg = loadButton.querySelector('img') as HTMLImageElement;
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      console.warn('OpenMemo: Logo failed to load, using fallback');
      loadButton.innerHTML = `
        <div class="flex flex-row items-center justify-center gap-1">
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            font-size: 10px;
            font-weight: bold;
            background: linear-gradient(135deg, #A8FF00, #85CC00);
            color: #000;
            border-radius: 3px;
            flex-shrink: 0;
            opacity: 1;
          ">OM</div>
        </div>
      `;
    });
    
    setTimeout(() => {
      if (!logoImg.complete || logoImg.naturalWidth === 0) {
        logoImg.dispatchEvent(new Event('error'));
      }
    }, 1000);
  }

  // Add hover effects
  loadButton.addEventListener("mouseenter", () => {
    loadButton.style.color = "hsl(var(--text-200) / 0.9)";
    loadButton.style.backgroundColor = "hsl(var(--bg-100))";
  });

  loadButton.addEventListener("mouseleave", () => {
    loadButton.style.color = "hsl(var(--text-300))";
    loadButton.style.backgroundColor = "transparent";
  });

  loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Try to use the direct memory loading first, fallback to memory selector
    if (typeof loadMemoriesForPlatform === 'function') {
      loadMemoriesForPlatform();
    } else {
      showMemorySelector();
    }
  });

  // Insert the button before the target container
  targetContainer.insertAdjacentElement('beforebegin', loadButton);
}

function addClaudeButton(container: Element) {
  const loadButton = document.createElement("button");
  loadButton.className = "openmemo-load-btn inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none border-0.5 transition-all h-8 min-w-8 rounded-lg flex items-center px-[7.5px] group !pointer-events-auto !outline-offset-1 text-text-300 border-border-300 active:scale-[0.98] hover:text-text-200/90 hover:bg-bg-100";
  
  loadButton.setAttribute('type', 'button');
  loadButton.setAttribute('aria-pressed', 'false');
  loadButton.setAttribute('aria-label', 'Load memories from OpenMemo');
  loadButton.setAttribute('data-testid', 'openmemo-load-button');
  
  loadButton.style.cssText = `
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
    background: transparent;
    color: hsl(var(--text-300));
    transition: all 0.2s ease;
    border: 0.5px solid hsl(var(--border-300));
  `;

  // Use the actual logo URL - use img instead of SVG image for better visibility
  const logoUrl = chrome.runtime?.getURL('logo.png') || '/logo.png';
  
  loadButton.innerHTML = `
    <div class="flex flex-row items-center justify-center gap-1">
      <img src="${logoUrl}" width="16" height="16" style="object-fit: contain; opacity: 1; flex-shrink: 0;" alt="OpenMemo" />
    </div>
  `;

  // Add error handling for logo loading
  const logoImg = loadButton.querySelector('img') as HTMLImageElement;
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      console.warn('OpenMemo: Logo failed to load, using fallback');
      // Replace with text fallback with better visibility
      loadButton.innerHTML = `
        <div class="flex flex-row items-center justify-center gap-1">
          <div style="
            display: flex;
            align-items: center;
            justify-content: center;
            width: 16px;
            height: 16px;
            font-size: 10px;
            font-weight: bold;
            background: linear-gradient(135deg, #A8FF00, #85CC00);
            color: #000;
            border-radius: 3px;
            flex-shrink: 0;
            opacity: 1;
          ">OM</div>
        </div>
      `;
    });
    
    // Test if logo loads by setting a timeout
    setTimeout(() => {
      if (!logoImg.complete || logoImg.naturalWidth === 0) {
        logoImg.dispatchEvent(new Event('error'));
      }
    }, 1000);
  }

  // Add hover effects
  loadButton.addEventListener("mouseenter", () => {
    loadButton.style.color = "hsl(var(--text-200) / 0.9)";
    loadButton.style.backgroundColor = "hsl(var(--bg-100))";
  });

  loadButton.addEventListener("mouseleave", () => {
    loadButton.style.color = "hsl(var(--text-300))";
    loadButton.style.backgroundColor = "transparent";
  });

  loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Try to use the direct memory loading first, fallback to memory selector
    if (typeof loadMemoriesForPlatform === 'function') {
      loadMemoriesForPlatform();
    } else {
      showMemorySelector();
    }
  });

  // Find the last actual button element to insert after it, avoiding empty divs
  const buttons = container.querySelectorAll('button');
  const lastButton = buttons[buttons.length - 1];
  
  if (lastButton && lastButton.parentElement) {
    // Insert after the last button's parent div to be at the same level
    const lastButtonParent = lastButton.parentElement;
    if (lastButtonParent.parentElement === container) {
      // Insert after the last button's parent div
      lastButtonParent.insertAdjacentElement('afterend', loadButton);
    } else {
      // Fallback: just append to container
      container.appendChild(loadButton);
    }
  } else {
    // Fallback: append to container
    container.appendChild(loadButton);
  }
}

function showMemorySelector() {
  // Create modal for memory selection
  const modal = document.createElement("div");
  modal.className = "openmemo-modal fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999]";

  modal.innerHTML = `
    <div class="bg-white border border-orange-200 shadow-2xl rounded-2xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-hidden flex flex-col" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold text-gray-900">Load Relevant Memories</h3>
        <button class="close-modal text-gray-900 hover:opacity-70 text-2xl w-8 h-8 flex items-center justify-center rounded-lg transition-all">×</button>
      </div>
      
      <div class="mb-4">
        <input 
          type="text" 
          class="query-input w-full px-4 py-3 border-2 rounded-xl text-sm transition-all focus:outline-none" 
          style="border-color: #e5e7eb; background: #ffffff; color: #111827;"
          placeholder="Describe what you're looking for..."
        >
        <button class="search-btn mt-3 px-6 py-3 text-white text-sm font-medium rounded-xl transition-all hover:scale-105 active:scale-95" style="background: linear-gradient(135deg, #f97316, #ea580c); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          Find Relevant Memories
        </button>
      </div>
      
      <div class="memory-results flex-1 overflow-y-auto space-y-3 mb-4" style="max-height: 400px;">
        <p class="text-gray-500 text-sm text-center py-8">Enter a search query to find relevant memories using AI</p>
      </div>
      
      <div class="flex justify-end gap-3">
        <button class="cancel-btn px-4 py-2 text-gray-600 hover:text-gray-800 rounded-xl transition-all">Cancel</button>
        <button class="load-selected-btn px-6 py-2 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" style="background: linear-gradient(135deg, #f97316, #ea580c); opacity: 0.5;" disabled>
          Load Selected
        </button>
      </div>
    </div>
  `;

  let selectedMemories: Memory[] = [];

  // Search for memories
  async function searchMemories() {
    const queryInput = modal.querySelector(".query-input") as HTMLInputElement;
    const resultsDiv = modal.querySelector(".memory-results")!;
    const loadButton = modal.querySelector(".load-selected-btn") as HTMLButtonElement;
    const searchButton = modal.querySelector(".search-btn") as HTMLButtonElement;

    const query = queryInput.value.trim();
    if (!query) return;

    try {
      searchButton.disabled = true;
      searchButton.textContent = "Searching...";
      resultsDiv.innerHTML = '<div class="flex items-center justify-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div></div>';

      const isAuthenticated = await apiService.isAuthenticated();
      if (!isAuthenticated) {
        resultsDiv.innerHTML = '<p class="text-red-500 text-sm text-center py-4">Please sign in to OpenMemo to access your memories</p>';
        return;
      }

      const memories = await apiService.findRelevantMemories(query, 10, 'claude');

      if (memories.length === 0) {
        resultsDiv.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">No relevant memories found for your query</p>';
      } else {
        resultsDiv.innerHTML = memories.map((memory, index) => `
          <label class="memory-item flex items-start gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
            <input type="checkbox" class="memory-checkbox mt-1" data-memory-index="${index}">
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900 mb-1">${memory.content.substring(0, 120)}${memory.content.length > 120 ? "..." : ""}</div>
              <div class="text-gray-500 text-xs">${memory.category} • ${new Date(memory.createdAt).toLocaleDateString()}</div>
              ${memory.tags && (Array.isArray(memory.tags) ? memory.tags.length > 0 : memory.tags.trim().length > 0) ? `<div class="text-xs mt-1" style="color: #f97316;">${Array.isArray(memory.tags) ? memory.tags.join(", ") : memory.tags}</div>` : ""}
            </div>
          </label>
        `).join("");

        // Update selected memories when checkboxes change
        const checkboxes = modal.querySelectorAll(".memory-checkbox");
        checkboxes.forEach((checkbox) => {
          checkbox.addEventListener("change", () => {
            selectedMemories = Array.from(modal.querySelectorAll(".memory-checkbox:checked")).map((cb) => {
              const index = parseInt((cb as HTMLInputElement).dataset.memoryIndex!);
              return memories[index];
            });

            loadButton.disabled = selectedMemories.length === 0;
            loadButton.style.opacity = selectedMemories.length > 0 ? "1" : "0.5";
            loadButton.textContent = selectedMemories.length > 0 ? `Load ${selectedMemories.length} Selected` : "Load Selected";
          });
        });
      }
    } catch (error) {
      console.error("Error searching memories:", error);
      resultsDiv.innerHTML = '<p class="text-red-500 text-sm text-center py-4">Error searching memories. Please try again.</p>';
    } finally {
      searchButton.disabled = false;
      searchButton.textContent = "Find Relevant Memories";
    }
  }

  // Event listeners
  modal.querySelector(".search-btn")?.addEventListener("click", searchMemories);
  modal.querySelector(".query-input")?.addEventListener("keypress", (e) => {
    if ((e as KeyboardEvent).key === "Enter") {
      searchMemories();
    }
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal || 
        (e.target as Element).classList.contains("close-modal") || 
        (e.target as Element).classList.contains("cancel-btn")) {
      modal.remove();
    }
  });

  modal.querySelector(".load-selected-btn")?.addEventListener("click", () => {
    if (selectedMemories.length > 0) {
      const memoryText = selectedMemories.map((m) => m.content).join("\n\n");
      insertTextIntoClaudeComposer(memoryText);
      showNotification(`Loaded ${selectedMemories.length} relevant memories`, "success");
    }
    modal.remove();
  });

  document.body.appendChild(modal);

  // Focus the query input
  setTimeout(() => {
    (modal.querySelector(".query-input") as HTMLInputElement)?.focus();
  }, 100);
}

function insertTextIntoClaudeComposer(text: string) {
  const composer = document.querySelector('div[contenteditable="true"]') as HTMLElement;
  
  if (!composer) {
    console.log("OpenMemo: Could not find Claude composer element");
    return;
  }

  const currentContent = composer.textContent || "";
  composer.textContent = currentContent + (currentContent ? "\n\n" + text : text);

  // Dispatch events
  composer.dispatchEvent(new Event("input", { bubbles: true }));
  composer.dispatchEvent(new Event("change", { bubbles: true }));

  // Focus and place cursor at end
  composer.focus();
  const range = document.createRange();
  const selection = window.getSelection();
  range.selectNodeContents(composer);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

function showNotification(message: string, type: "success" | "error" | "warning" = "success") {
  const notification = document.createElement("div");
  notification.className = `openmemo-notification fixed top-4 right-4 z-[10000] px-4 py-2 rounded-md text-white text-sm font-medium ${
    type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-yellow-600"
  }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}