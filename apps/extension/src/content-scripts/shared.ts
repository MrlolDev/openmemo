// Shared utilities for content scripts
import { apiService, type Memory } from "../services/api";
import { universalAuthCheck, universalApiRequest } from "../utils/cspBypass";
import "../styles/content-scripts.css";

// Platform-specific textarea selectors
// Platform-specific textarea selectors (kept for future reference)
/*
const _PLATFORM_SELECTORS = {
  chatgpt: '#thread-bottom > div > div > div.max-xs\\:[--force-hide-label\\:none].relative.z-1.flex.h-full.max-w-full.flex-1.flex-col > form > div.bg-token-bg-primary.shadow-short.flex.w-full.cursor-text.flex-col.items-center.justify-center.overflow-clip.bg-clip-padding.contain-inline-size.dark\\:bg-\\[\\#303030\\].rounded-\\[28px\\] > div > div.relative.flex.w-full.flex-auto.flex-col > div.relative.mx-5.flex.min-h-14.flex-auto.bg-transparent.items-start > div > textarea',
  t3chat: '#chat-input',
  gemini: '#app-root > main > side-navigation-v2 > bard-sidenav-container > bard-sidenav-content > div.content-wrapper > div > div.content-container > chat-window > div > input-container > div > input-area-v2 > div > div > div.text-input-field_textarea-wrapper.ng-tns-c1118572211-6 > div > div > rich-textarea',
  deepseek: '#chat-input',
  claude: '#chat-input-file-upload-onpage',
  grok: 'textarea',
  delphi: '#message'
};
*/

// Helper functions for the direct memory loading
function getCurrentPageContent(): string {
  // Try to get content from common input selectors
  const selectors = [
    '#message', // Delphi
    'textarea[placeholder*="Message"]', // ChatGPT
    'div[contenteditable="true"]', // Various platforms
    'textarea', // Generic
    'input[type="text"]' // Generic
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLTextAreaElement | HTMLInputElement;
    if (element) {
      const content = element.value || element.textContent || '';
      if (content.trim()) {
        return content;
      }
    }
  }
  
  // Fallback: get some context from page title or visible text
  return document.title || '';
}

function insertMemoryIntoActiveInput(text: string) {
  // Try to insert into the most likely active input
  const selectors = [
    '#message', // Delphi
    'textarea[placeholder*="Message"]', // ChatGPT
    'div[contenteditable="true"]', // Various platforms
    'textarea', // Generic
  ];
  
  for (const selector of selectors) {
    const element = document.querySelector(selector) as HTMLTextAreaElement | HTMLElement;
    if (element) {
      if (element.tagName.toLowerCase() === 'textarea') {
        const textarea = element as HTMLTextAreaElement;
        const currentContent = textarea.value || '';
        textarea.value = currentContent + (currentContent ? '\n\n' + text : text);
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
        textarea.dispatchEvent(new Event('change', { bubbles: true }));
        textarea.focus();
      } else if (element.contentEditable === 'true') {
        const currentContent = element.textContent || '';
        element.textContent = currentContent + (currentContent ? '\n\n' + text : text);
        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.focus();
      }
      return;
    }
  }
  
  console.warn('OpenMemo: Could not find suitable input element to insert memory');
}

export function showNotification(message: string, type: "success" | "error" | "warning" = "success") {
  const notification = document.createElement("div");
  
  // Enhanced styling to match OpenMemo popup design
  const baseClasses = "openmemo-notification fixed top-4 right-4 z-[10000] px-4 py-3 rounded-xl text-sm font-medium shadow-2xl backdrop-blur-sm border transition-all duration-300 animate-slide-in-right";
  
  let typeClasses = "";
  let icon = "";
  
  switch (type) {
    case "success":
      typeClasses = "bg-[#0d0d0d]/90 border-[#A8FF00]/30 text-white shadow-[0_0_20px_rgba(168,255,0,0.3)]";
      icon = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#A8FF00" stroke-width="2" class="flex-shrink-0">
          <polyline points="20,6 9,17 4,12"></polyline>
        </svg>
      `;
      break;
    case "error":
      typeClasses = "bg-[#0d0d0d]/90 border-red-500/30 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)]";
      icon = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" class="flex-shrink-0">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="15" y1="9" x2="9" y2="15"></line>
          <line x1="9" y1="9" x2="15" y2="15"></line>
        </svg>
      `;
      break;
    case "warning":
      typeClasses = "bg-[#0d0d0d]/90 border-yellow-500/30 text-white shadow-[0_0_20px_rgba(234,179,8,0.3)]";
      icon = `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#eab308" stroke-width="2" class="flex-shrink-0">
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      `;
      break;
  }
  
  notification.className = `${baseClasses} ${typeClasses}`;
  
  notification.innerHTML = `
    <div class="flex items-start gap-3">
      ${icon}
      <div class="flex-1">
        <div class="text-white/90 leading-relaxed">${message}</div>
      </div>
      <button class="text-white/60 hover:text-white/90 transition-colors ml-2" onclick="this.parentElement.parentElement.remove()">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  `;

  // Add floating animation keyframes if not already present
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slide-in-right {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    .animate-slide-in-right {
      animation: slide-in-right 0.3s ease-out;
    }
  `;
  
  if (!document.querySelector('style[data-openmemo-notifications]')) {
    style.setAttribute('data-openmemo-notifications', 'true');
    document.head.appendChild(style);
  }

  document.body.appendChild(notification);

  // Auto-remove after 4 seconds (slightly longer for better UX)
  setTimeout(() => {
    if (notification.parentElement) {
      notification.style.transform = 'translateX(100%)';
      notification.style.opacity = '0';
      setTimeout(() => {
        notification.remove();
      }, 300);
    }
  }, 4000);
}

// Helper function to check if extension context is valid
function isExtensionContextValid(): boolean {
  try {
    return !!(chrome && chrome.runtime && chrome.runtime.id);
  } catch (error) {
    return false;
  }
}

// New direct memory loading function for platforms
export async function loadMemoriesForPlatform() {
  try {
    // Check if extension context is still valid
    if (!isExtensionContextValid()) {
      showNotification("Extension was updated. Please refresh the page to continue.", "warning");
      return;
    }

    const isUniversal = !!((window as any).openMemoUniversalRunning);
    if (!isUniversal) {
      console.log("OpenMemo: Direct load memories called");
    }

    // Use universal auth check that automatically handles CSP restrictions
    const authResult = await universalAuthCheck(
      () => apiService.isAuthenticated()
    );
    const isAuthenticated = authResult.isAuthenticated;

    if (!isAuthenticated) {
      showNotification("Please sign in to OpenMemo to access your memories", "error");
      
      // Open the popup after 3 seconds (when notification disappears)
      setTimeout(() => {
        try {
          if (isExtensionContextValid()) {
            if (chrome.action) {
              chrome.action.openPopup().catch(() => {
                // If openPopup fails, send message to background script to open popup
                chrome.runtime.sendMessage({ action: 'openPopup' }).catch(() => {
                  console.log("OpenMemo: Could not communicate with extension");
                });
              });
            } else {
              // Fallback: send message to background script
              chrome.runtime.sendMessage({ action: 'openPopup' }).catch(() => {
                console.log("OpenMemo: Could not communicate with extension");
              });
            }
          } else {
            showNotification("Extension context lost. Please refresh the page.", "warning");
          }
        } catch (error) {
          console.log("OpenMemo: Extension context error:", error);
        }
      }, 3000);
      
      return;
    }

    // Get current text context from the active input field
    const currentContent = getCurrentPageContent();
    const query = currentContent.trim();

    if (!query) {
      // If no context, just load recent memories
      const result = await universalApiRequest(
        () => apiService.getMemories({ limit: 5 }),
        { endpoint: '/memories', method: 'GET' }
      );
      const memories = result.memories;
      
      if (memories.length === 0) {
        showNotification("No memories found. Add some memories first!", "warning");
        return;
      }
      
      const memoryText = memories.map((m: Memory) => m.content).join("\n\n");
      insertMemoryIntoActiveInput(memoryText);
      showNotification(`Loaded ${memories.length} recent memories`, "success");
      return;
    }

    // Load relevant memories based on current context with automatic new memory extraction
    const result = await universalApiRequest(
      () => apiService.getMemories({ 
        query, 
        limit: 5, 
        extractNewMemories: true 
      }),
      { 
        endpoint: `/memories?query=${encodeURIComponent(query)}&limit=5&extractNewMemories=true`,
        method: 'GET'
      }
    );
    const memories = result.memories;

    // Notify about new memory extraction
    if (result.newMemoryDetected && result.newMemorySaved) {
      showNotification(
        `New memory extracted and saved: "${result.newMemorySaved.content.substring(0, 50)}..."`,
        "success"
      );
    }

    if (memories.length === 0) {
      showNotification("No relevant memories found for the current context", "warning");
      return;
    }

    const memoryText = memories.map((m: Memory) => m.content).join("\n\n");
    insertMemoryIntoActiveInput(memoryText);
    
    const searchTypeText = result.searchType === 'vector-semantic' ? 'semantic' : 
                          result.searchType === 'ai-powered' ? 'AI-powered' : 'text';
    showNotification(
      `Loaded ${memories.length} relevant memories using ${searchTypeText} search`,
      "success"
    );

  } catch (error) {
    console.error("Error loading memories:", error);
    showNotification("Failed to load memories. Please try again.", "error");
  }
}

export function showMemorySelector(
  onMemoriesSelected: (memories: Memory[]) => void
) {
  // Detect current platform for styling
  const isOnChatGPT = window.location.hostname.includes("chatgpt.com");
  const isOnClaude = window.location.hostname.includes("claude.ai");
  const isOnPerplexity = window.location.hostname.includes("perplexity.ai");
  const isOnGemini = window.location.hostname.includes("gemini.google.com");
  const isOnDeepSeek = window.location.hostname.includes("chat.deepseek.com");
  const isOnT3Chat = window.location.hostname.includes("t3.chat");
  const isOnGrok = window.location.hostname.includes("grok.com");
  const isOnDelphi = window.location.hostname.includes("delphi.ai");

  // Create a modal to select memories to load with platform-specific isolated styles
  const modal = document.createElement("div");
  modal.className = "openmemo-widget";

  // Platform-specific styling classes
  let modalBgClass: string,
    modalContentClass: string,
    inputClass: string,
    primaryBtnClass: string,
    secondaryBtnClass: string,
    textClass: string,
    placeholderTextClass: string;

  if (isOnChatGPT) {
    modalBgClass = "bg-white";
    modalContentClass = "border border-gray-200 shadow-2xl";
    inputClass =
      "bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-green-500";
    primaryBtnClass = "bg-green-600 hover:bg-green-700 text-white";
    secondaryBtnClass = "text-gray-600 hover:text-gray-800";
    textClass = "text-gray-900";
    placeholderTextClass = "text-gray-500";
  } else if (isOnClaude) {
    modalBgClass = "bg-white";
    modalContentClass = "border border-orange-200 shadow-2xl";
    inputClass =
      "bg-white border-orange-300 text-gray-900 placeholder-gray-500 focus:border-orange-500";
    primaryBtnClass = "bg-orange-600 hover:bg-orange-700 text-white";
    secondaryBtnClass = "text-gray-600 hover:text-gray-800";
    textClass = "text-gray-900";
    placeholderTextClass = "text-gray-500";
  } else if (isOnPerplexity) {
    modalBgClass = "bg-white";
    modalContentClass = "border border-purple-200 shadow-2xl";
    inputClass =
      "bg-white border-purple-300 text-gray-900 placeholder-gray-500 focus:border-purple-500";
    primaryBtnClass = "bg-purple-600 hover:bg-purple-700 text-white";
    secondaryBtnClass = "text-gray-600 hover:text-gray-800";
    textClass = "text-gray-900";
    placeholderTextClass = "text-gray-500";
  } else if (isOnGemini) {
    modalBgClass = "bg-white";
    modalContentClass = "border border-blue-200 shadow-2xl";
    inputClass =
      "bg-white border-blue-300 text-gray-900 placeholder-gray-500 focus:border-blue-500";
    primaryBtnClass = "bg-blue-600 hover:bg-blue-700 text-white";
    secondaryBtnClass = "text-gray-600 hover:text-gray-800";
    textClass = "text-gray-900";
    placeholderTextClass = "text-gray-500";
  } else if (isOnDeepSeek) {
    modalBgClass = "bg-white";
    modalContentClass = "border border-blue-200 shadow-2xl";
    inputClass =
      "bg-white border-blue-300 text-gray-900 placeholder-gray-500 focus:border-blue-500";
    primaryBtnClass = "bg-blue-600 hover:bg-blue-700 text-white";
    secondaryBtnClass = "text-gray-600 hover:text-gray-800";
    textClass = "text-gray-900";
    placeholderTextClass = "text-gray-500";
  } else if (isOnT3Chat) {
    modalBgClass = "bg-white";
    modalContentClass = "border border-emerald-200 shadow-2xl";
    inputClass =
      "bg-white border-emerald-300 text-gray-900 placeholder-gray-500 focus:border-emerald-500";
    primaryBtnClass = "bg-emerald-600 hover:bg-emerald-700 text-white";
    secondaryBtnClass = "text-gray-600 hover:text-gray-800";
    textClass = "text-gray-900";
    placeholderTextClass = "text-gray-500";
  } else if (isOnGrok) {
    modalBgClass = "bg-white";
    modalContentClass = "border border-green-200 shadow-2xl";
    inputClass =
      "bg-white border-green-300 text-gray-900 placeholder-gray-500 focus:border-green-500";
    primaryBtnClass = "bg-green-600 hover:bg-green-700 text-white";
    secondaryBtnClass = "text-gray-600 hover:text-gray-800";
    textClass = "text-gray-900";
    placeholderTextClass = "text-gray-500";
  } else if (isOnDelphi) {
    modalBgClass = "bg-white";
    modalContentClass = "border border-blue-200 shadow-2xl";
    inputClass =
      "bg-white border-blue-300 text-gray-900 placeholder-gray-500 focus:border-blue-500";
    primaryBtnClass = "bg-blue-600 hover:bg-blue-700 text-white";
    secondaryBtnClass = "text-gray-600 hover:text-gray-800";
    textClass = "text-gray-900";
    placeholderTextClass = "text-gray-500";
  } else {
    // Default OpenMemo theme
    modalBgClass = "bg-black";
    modalContentClass = "border border-green-400 shadow-2xl";
    inputClass =
      "bg-gray-900 border-gray-700 text-white placeholder-gray-400 focus:border-green-500";
    primaryBtnClass = "bg-green-600 hover:bg-green-700 text-white";
    secondaryBtnClass = "text-gray-400 hover:text-white";
    textClass = "text-white";
    placeholderTextClass = "text-gray-400";
  }

  modal.innerHTML = `
    <div class="${modalBgClass} bg-opacity-90 backdrop-blur-sm fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div class="${modalContentClass} ${modalBgClass} rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold ${textClass}">Load Relevant Memories</h3>
          <button class="close-modal ${textClass} hover:opacity-70 text-2xl w-8 h-8 flex items-center justify-center rounded-lg transition-all">×</button>
        </div>
        
        <div class="mb-4">
          <input 
            type="text" 
            class="query-input w-full px-4 py-3 border-2 rounded-xl text-sm transition-all focus:outline-none ${inputClass}" 
            placeholder="Describe what you're looking for..."
          >
          <button class="search-btn mt-3 px-6 py-3 text-sm font-medium rounded-xl transition-all hover:scale-105 active:scale-95 ${primaryBtnClass}">
            Find Relevant Memories
          </button>
        </div>
        
        <div class="memory-results flex-1 overflow-y-auto space-y-3 mb-4" style="max-height: 400px;">
          <p class="${placeholderTextClass} text-sm text-center py-8">Enter a search query to find relevant memories using AI</p>
        </div>
        
        <div class="flex justify-end gap-3">
          <button class="cancel-btn px-4 py-2 ${secondaryBtnClass} rounded-xl transition-all">Cancel</button>
          <button class="load-selected-btn px-6 py-2 font-medium rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${primaryBtnClass}" disabled>
            Load Selected
          </button>
        </div>
      </div>
    </div>
  `;

  let selectedMemories: Memory[] = [];

  // Search for relevant memories
  async function searchMemories() {
    const queryInput = modal.querySelector(".query-input") as HTMLInputElement;
    const resultsDiv = modal.querySelector(".memory-results")!;
    const loadButton = modal.querySelector(
      ".load-selected-btn"
    ) as HTMLButtonElement;
    const searchButton = modal.querySelector(
      ".search-btn"
    ) as HTMLButtonElement;

    const query = queryInput.value.trim();
    if (!query) return;

    try {
      searchButton.disabled = true;
      searchButton.textContent = "Searching...";
      resultsDiv.innerHTML =
        '<div class="flex items-center justify-center py-4"><div class="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent"></div></div>';

      // Use universal auth check for CSP compatibility
      const authResult = await universalAuthCheck(
        () => apiService.isAuthenticated()
      );
      
      if (!authResult.isAuthenticated) {
        resultsDiv.innerHTML =
          '<p class="text-red-500 text-sm text-center py-4">Please sign in to OpenMemo to access your memories</p>';
        
        // Open the popup after a short delay
        setTimeout(() => {
          if (chrome.action) {
            chrome.action.openPopup().catch(() => {
              // If openPopup fails, send message to background script to open popup
              chrome.runtime.sendMessage({ action: 'openPopup' });
            });
          } else {
            // Fallback: send message to background script
            chrome.runtime.sendMessage({ action: 'openPopup' });
          }
        }, 2000);
        
        return;
      }

      // Use universal API request for CSP compatibility
      const result = await universalApiRequest(
        () => apiService.getMemories({ query, limit: 10 }),
        { 
          endpoint: `/memories?query=${encodeURIComponent(query)}&limit=10`,
          method: 'GET'
        }
      );
      const memories = result.memories;

      if (memories.length === 0) {
        resultsDiv.innerHTML = `<p class="${placeholderTextClass} text-sm text-center py-4">No relevant memories found for your query</p>`;
      } else {
        resultsDiv.innerHTML = memories
          .map(
            (memory, index) => `
          <label class="memory-item flex items-start gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
            <input type="checkbox" class="memory-checkbox mt-1" data-memory-index="${index}">
            <div class="flex-1">
              <div class="text-sm font-medium ${textClass} mb-1">${memory.content.substring(0, 120)}${memory.content.length > 120 ? "..." : ""}</div>
              <div class="${placeholderTextClass} text-xs">${memory.category} • ${new Date(memory.createdAt).toLocaleDateString()}</div>
              ${memory.tags && (Array.isArray(memory.tags) ? memory.tags.length > 0 : memory.tags.trim().length > 0) ? `<div class="text-xs mt-1" style="color: ${primaryBtnClass.includes('green') ? '#10B981' : primaryBtnClass.includes('orange') ? '#EA580C' : primaryBtnClass.includes('purple') ? '#9333EA' : '#3B82F6'};">${Array.isArray(memory.tags) ? memory.tags.join(", ") : memory.tags}</div>` : ""}
            </div>
          </label>
        `
          )
          .join("");

        // Update selected memories when checkboxes change
        const checkboxes = modal.querySelectorAll(".memory-checkbox");
        checkboxes.forEach((checkbox) => {
          checkbox.addEventListener("change", () => {
            selectedMemories = Array.from(
              modal.querySelectorAll(".memory-checkbox:checked")
            ).map((cb) => {
              const index = parseInt(
                (cb as HTMLInputElement).dataset.memoryIndex!
              );
              return memories[index];
            });

            loadButton.disabled = selectedMemories.length === 0;
            loadButton.style.opacity =
              selectedMemories.length > 0 ? "1" : "0.5";
            loadButton.textContent =
              selectedMemories.length > 0
                ? `Load ${selectedMemories.length} Selected`
                : "Load Selected";
          });
        });
      }
    } catch (error) {
      console.error("Error searching memories:", error);
      resultsDiv.innerHTML =
        '<p class="text-red-500 text-sm text-center py-4">Error searching memories. Please try again.</p>';
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
    if (
      e.target === modal ||
      (e.target as Element).classList.contains("close-modal") ||
      (e.target as Element).classList.contains("cancel-btn")
    ) {
      modal.remove();
    }
  });

  modal.querySelector(".load-selected-btn")?.addEventListener("click", () => {
    if (selectedMemories.length > 0) {
      onMemoriesSelected(selectedMemories);
    }
    modal.remove();
  });

  document.body.appendChild(modal);

  // Focus the query input
  setTimeout(() => {
    (modal.querySelector(".query-input") as HTMLInputElement)?.focus();
  }, 100);
}