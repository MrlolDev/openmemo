// Grok.com specific content script
import { apiService, type Memory } from "../services/api";

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

function waitForGrokReady() {
  // Check if basic DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initGrokIntegration, 1000);
    });
  } else {
    setTimeout(initGrokIntegration, 1500);
  }
}

// Wait for page load event
if (document.readyState === "complete") {
  setTimeout(initGrokIntegration, 2000);
} else {
  window.addEventListener("load", () => {
    setTimeout(initGrokIntegration, 2000);
  });
  waitForGrokReady();
}

function initGrokIntegration() {
  if (isInitialized || buttonInserted) return;
  
  isInitialized = true;
  console.log("OpenMemo: Initializing Grok.com integration");

  // Set up mutation observer to watch for DOM changes
  observer = new MutationObserver(throttle((mutations) => {
    if (buttonInserted) return;
    
    const hasSignificantChanges = mutations.some(mutation => 
      mutation.type === "childList" && 
      (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
    );
    
    if (hasSignificantChanges) {
      checkForGrokContainer();
    }
  }, CHECK_THROTTLE));

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial check
  checkForGrokContainer();
  
  // Progressive retry strategy for Grok.com
  const retryIntervals = [1000, 2000, 3000, 5000, 7000, 10000, 15000];
  
  retryIntervals.forEach((interval, index) => {
    const timeoutId = window.setTimeout(() => {
      if (!buttonInserted) {
        console.log(`OpenMemo: Grok retry ${index + 1}`);
        checkForGrokContainer();
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

function isGrokReady(): boolean {
  // Check for the textarea first to ensure the interface is loaded
  const textarea = document.querySelector('textarea');
  const form = document.querySelector('form');
  return !!(textarea && form);
}

function checkForGrokContainer() {
  if (buttonInserted) return;

  const now = Date.now();
  if (now - lastCheckTime < CHECK_THROTTLE) return;
  lastCheckTime = now;

  if (!isGrokReady()) {
    console.log("OpenMemo: Grok.com not ready yet, waiting...");
    return;
  }

  console.log("OpenMemo: Checking for Grok.com container...");
  
  // Try to find the specific button container
  // This is the container where buttons are placed (containing the existing buttons)
  const container = document.querySelector('.grow.flex.gap-1\\.5.max-w-full');
  
  if (!container) {
    console.log("OpenMemo: Grok container not found, trying fallback selectors");
    // Fallback: try to find any button container near the textarea
    const textarea = document.querySelector('textarea');
    if (textarea) {
      let parent = textarea.parentElement;
      // Walk up the DOM to find a suitable container for buttons
      while (parent && parent !== document.body) {
        if (parent.querySelector('button') && parent.classList.contains('gap-1.5')) {
          console.log("OpenMemo: Using fallback container from textarea parent");
          if (!parent.querySelector('.openmemo-load-btn')) {
            addGrokButton(parent);
            buttonInserted = true;
            stopObserving();
          }
          return;
        }
        parent = parent.parentElement;
      }
    }
    return;
  }
  
  // Check if our button already exists
  if (container.querySelector('.openmemo-load-btn')) {
    console.log("OpenMemo: Button already exists in Grok container");
    buttonInserted = true;
    stopObserving();
    return;
  }

  console.log("OpenMemo: Adding OpenMemo button to Grok.com container");
  addGrokButton(container);
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
  console.log("OpenMemo: Grok.com button inserted, stopping all checks");
}

function addGrokButton(container: Element) {
  const loadButton = document.createElement("button");
  loadButton.className = "openmemo-load-btn inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:opacity-60 disabled:cursor-not-allowed select-none border-border-l2 text-fg-primary hover:bg-button-ghost-hover disabled:hover:bg-transparent h-10 px-3.5 py-1.5 text-sm rounded-full group transition-colors duration-100 relative overflow-hidden border";
  
  loadButton.setAttribute('type', 'button');
  loadButton.setAttribute('aria-label', 'Load memories from OpenMemo');
  loadButton.setAttribute('data-testid', 'openmemo-load-button');
  
  loadButton.style.cssText = `
    cursor: pointer;
    font-family: inherit;
    background: transparent;
    transition: all 0.2s ease;
  `;

  // Use the actual logo URL
  const logoUrl = chrome.runtime?.getURL('logo.png') || '/logo.png';
  
  loadButton.innerHTML = `
    <img src="${logoUrl}" width="16" height="16" style="object-fit: contain; opacity: 0.8; flex-shrink: 0;" alt="OpenMemo" />
    <span style="font-size: 14px;">Load Memories</span>
  `;

  // Add error handling for logo loading
  const logoImg = loadButton.querySelector('img') as HTMLImageElement;
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      console.warn('OpenMemo: Logo failed to load, using fallback');
      // Replace with text fallback
      loadButton.innerHTML = `
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
          opacity: 0.8;
        ">OM</div>
        <span style="font-size: 14px;">Load Memories</span>
      `;
    });
    
    // Test if logo loads by setting a timeout
    setTimeout(() => {
      if (!logoImg.complete || logoImg.naturalWidth === 0) {
        logoImg.dispatchEvent(new Event('error'));
      }
    }, 1000);
  }

  loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    showMemorySelector();
  });

  // Insert the button into the container
  container.appendChild(loadButton);
}

function showMemorySelector() {
  // Create modal for memory selection
  const modal = document.createElement("div");
  modal.className = "openmemo-modal fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999]";

  modal.innerHTML = `
    <div class="bg-white border border-gray-200 shadow-2xl rounded-2xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-hidden flex flex-col" style="font-family: inherit;">
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
        <button class="search-btn mt-3 px-6 py-3 text-white text-sm font-medium rounded-xl transition-all hover:scale-105 active:scale-95" style="background: linear-gradient(135deg, #A8FF00, #85CC00); box-shadow: 0 4px 12px rgba(0,0,0,0.15); color: #000;">
          Find Relevant Memories
        </button>
      </div>
      
      <div class="memory-results flex-1 overflow-y-auto space-y-3 mb-4" style="max-height: 400px;">
        <p class="text-gray-500 text-sm text-center py-8">Enter a search query to find relevant memories using AI</p>
      </div>
      
      <div class="flex justify-end gap-3">
        <button class="cancel-btn px-4 py-2 text-gray-600 hover:text-gray-800 rounded-xl transition-all">Cancel</button>
        <button class="load-selected-btn px-6 py-2 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" style="background: linear-gradient(135deg, #A8FF00, #85CC00); color: #000; opacity: 0.5;" disabled>
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

      const memories = await apiService.findRelevantMemories(query, 10, 'grok');

      if (memories.length === 0) {
        resultsDiv.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">No relevant memories found for your query</p>';
      } else {
        resultsDiv.innerHTML = memories.map((memory, index) => `
          <label class="memory-item flex items-start gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
            <input type="checkbox" class="memory-checkbox mt-1" data-memory-index="${index}">
            <div class="flex-1">
              <div class="text-sm font-medium text-gray-900 mb-1">${memory.content.substring(0, 120)}${memory.content.length > 120 ? "..." : ""}</div>
              <div class="text-gray-500 text-xs">${memory.category} • ${new Date(memory.createdAt).toLocaleDateString()}</div>
              ${memory.tags && (Array.isArray(memory.tags) ? memory.tags.length > 0 : memory.tags.trim().length > 0) ? `<div class="text-xs mt-1" style="color: #A8FF00;">${Array.isArray(memory.tags) ? memory.tags.join(", ") : memory.tags}</div>` : ""}
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
      insertTextIntoGrokTextarea(memoryText);
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

function insertTextIntoGrokTextarea(text: string) {
  // Try the specific selector first
  const textarea = document.querySelector('textarea') as HTMLTextAreaElement;
  
  if (!textarea) {
    console.log("OpenMemo: Could not find Grok textarea element");
    return;
  }

  const currentContent = textarea.value || "";
  textarea.value = currentContent + (currentContent ? "\n\n" + text : text);

  // Dispatch events
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.dispatchEvent(new Event("change", { bubbles: true }));

  // Focus the textarea
  textarea.focus();
  
  // Set cursor to end
  textarea.setSelectionRange(textarea.value.length, textarea.value.length);
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