// Universal content script for all AI platforms
import {
  getPlatformConfig,
  type PlatformConfig,
} from "../config/platforms";
import { loadMemoriesForPlatform } from "./shared";

// Performance optimizations
let platformConfig: PlatformConfig | null = null;
let observer: MutationObserver | null = null;
let timeouts: number[] = [];
let isInitialized = false;
let lastCheckTime = 0;
let buttonInserted = false;

// Global flag to prevent multiple universal scripts running
declare global {
  interface Window {
    openMemoUniversalRunning?: boolean;
  }
}

// Throttling for performance
const CHECK_THROTTLE = 500; // Only check for containers every 500ms

// Efficient initialization with cleanup
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

// Enhanced loading detection for all platforms
function waitForPageReady() {
  // Check if basic DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initUniversalIntegration, 1000); // Wait 1s after DOMContentLoaded
    });
  } else {
    // DOM is already ready, but wait a bit for dynamic content
    setTimeout(initUniversalIntegration, 1500);
  }
}

// Also wait for page load event (images, stylesheets, etc.)
if (document.readyState === "complete") {
  setTimeout(initUniversalIntegration, 2000);
} else {
  window.addEventListener("load", () => {
    setTimeout(initUniversalIntegration, 2000);
  });
  
  // Fallback: Start waiting for page ready
  waitForPageReady();
}

function initUniversalIntegration() {
  if (isInitialized || window.openMemoUniversalRunning) return; // Prevent multiple initializations
  
  window.openMemoUniversalRunning = true;
  platformConfig = getPlatformConfig();

  if (!platformConfig) {
    console.log(
      "OpenMemo: No platform configuration found for",
      window.location.hostname
    );
    return;
  }

  isInitialized = true;
  console.log(`OpenMemo: Initializing efficient system for ${platformConfig.name}`);

  // Throttled mutation observer for better performance
  observer = new MutationObserver(throttle((mutations) => {
    if (buttonInserted) return; // Skip if button already inserted
    
    // Only process if there are significant changes
    const hasSignificantChanges = mutations.some(mutation => 
      mutation.type === "childList" && 
      (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
    );
    
    if (hasSignificantChanges) {
      checkForContainer();
    }
  }, CHECK_THROTTLE));

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial check
  checkForContainer();
  
  // Progressive retry strategy
  scheduleRetries();
}

function scheduleRetries() {
  // Claude.ai needs more time and more retries due to dynamic loading
  const isClaudeAi = platformConfig?.name === "Claude";
  const retryIntervals = isClaudeAi 
    ? [1000, 2000, 3000, 5000, 7000, 10000, 15000] // More retries for Claude
    : [1000, 2000, 5000, 10000]; // Standard retries for others
  
  retryIntervals.forEach((interval, index) => {
    const timeoutId = window.setTimeout(() => {
      if (!buttonInserted && platformConfig) {
        console.log(`OpenMemo: Retry ${index + 1} for ${platformConfig.name}`);
        checkForContainer();
      }
    }, interval);
    
    timeouts.push(timeoutId);
  });
}

// Platform readiness checks
function isPlatformReady(config: PlatformConfig): boolean {
  switch (config.name) {
    case "Claude":
      // Claude needs main content area and composer to be loaded
      const claudeMain = document.querySelector("main");
      const claudeComposer = document.querySelector('div[contenteditable="true"]');
      return !!(claudeMain && claudeComposer);
      
    case "Gemini":
      // Gemini needs Angular components to be fully loaded
      const geminiApp = document.querySelector("#app-root");
      const geminiMain = document.querySelector("main");
      return !!(geminiApp && geminiMain && document.querySelectorAll('[ng-version]').length > 0);
      
    case "ChatGPT":
      // ChatGPT needs React components to be loaded
      const chatgptMain = document.querySelector("main");
      const chatgptComposer = document.querySelector('[data-testid="composer-text-input"], textarea[placeholder*="Message"]');
      return !!(chatgptMain && chatgptComposer);
      
    case "DeepSeek":
      // DeepSeek needs main container and buttons to be loaded
      const deepseekMain = document.querySelector("#root");
      const deepseekButtons = document.querySelectorAll("button, [role='button']");
      return !!(deepseekMain && deepseekButtons.length > 3); // Ensure sufficient buttons are loaded
      
    case "T3.chat":
      // T3.chat needs main content and composer
      const t3Main = document.querySelector("main, [id*='root']");
      const t3Composer = document.querySelector("textarea, div[contenteditable='true']");
      return !!(t3Main && t3Composer);
      
    case "Perplexity":
      // Perplexity needs the composer and button container
      const perplexityComposer = document.querySelector('div[contenteditable="true"][id="ask-input"]');
      const perplexityContainer = document.querySelector("div.bg-background-50.dark\\:bg-offsetDark.flex.items-center.justify-self-end.rounded-full.col-start-3.row-start-2");
      return !!(perplexityComposer && perplexityContainer);
      
    default:
      // For unknown platforms, just check if DOM is interactive
      return document.readyState !== "loading";
  }
}

// Efficient throttle function
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

function checkForContainer() {
  if (!platformConfig || buttonInserted) return;

  const now = Date.now();
  if (now - lastCheckTime < CHECK_THROTTLE) return; // Throttle checks
  lastCheckTime = now;

  // Platform-specific readiness checks
  if (!isPlatformReady(platformConfig)) {
    console.log(`OpenMemo: ${platformConfig.name} not ready yet, waiting...`);
    return;
  }

  console.log(`OpenMemo: Checking for ${platformConfig.name} container...`);
  
  // Try primary container selector first
  let container = document.querySelector(platformConfig.selectors.container);
  
  // Platform-specific fallback selectors for dynamic content
  if (!container && platformConfig.name === "DeepSeek") {
    const fallbackSelectors = [
      ".ec4f5d61",
      "div[class*='ec4f5d61']", 
      "div.aaff8b8f > div",
      "div[class*='aaff8b8f'] > div > div",
      "[class*='cb86951c'] [class*='ec4f5d61']"
    ];
    
    for (const fallback of fallbackSelectors) {
      container = document.querySelector(fallback);
      if (container) {
        console.log(`OpenMemo: Found DeepSeek container with fallback: ${fallback}`);
        break;
      }
    }
  }
  
  // Claude.ai specific fallbacks - try different container patterns
  if (!container && platformConfig.name === "Claude") {
    const claudeFallbacks = [
      "div.relative.flex-1.flex.items-center.gap-2.shrink.min-w-0",
      "div.flex.items-center.gap-2 > div.flex.items-center.gap-1",
      "div.flex.gap-2\\.5.w-full.items-center > div.relative.flex-1",
      "div[data-testid*='input'] div.flex.items-center.gap-1",
      "fieldset div.flex.items-center.gap-2",
      // More general patterns that might work
      "main div.flex.items-center.gap-2",
      "main div.flex.gap-2 > div.flex.items-center"
    ];
    
    for (const fallback of claudeFallbacks) {
      container = document.querySelector(fallback);
      if (container) {
        // Verify this container has buttons (indicating it's the right container)
        const hasButtons = container.querySelector("button");
        if (hasButtons) {
          console.log(`OpenMemo: Found Claude container with fallback: ${fallback}`);
          break;
        } else {
          container = null; // Reset if no buttons found
        }
      }
    }
  }
  
  if (container) {
    console.log(`OpenMemo: Found ${platformConfig.name} container with primary selector`);
  } else {
    console.log(`OpenMemo: Primary selector failed for ${platformConfig.name}, trying fallback approach...`);
    
    // Fallback approach: Find container intelligently
    container = findContainerIntelligently(platformConfig);
  }

  if (container && !container.querySelector(".openmemo-load-btn")) {
    console.log(`OpenMemo: Adding button to ${platformConfig.name} container`);
    addLoadMemoriesButton(container);
    buttonInserted = true; // Mark as inserted
    
    // Stop observing once button is inserted for performance
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    
    // Clear remaining timeouts
    timeouts.forEach(clearTimeout);
    timeouts = [];
    
    console.log(`OpenMemo: Button successfully inserted for ${platformConfig.name}, stopping all checks`);
  } else if (container) {
    console.log(`OpenMemo: Button already exists in ${platformConfig.name} container`);
    buttonInserted = true;
    
    // Also stop observing if button already exists
    if (observer) {
      observer.disconnect();
      observer = null;
    }
    
    // Clear remaining timeouts
    timeouts.forEach(clearTimeout);
    timeouts = [];
  } else {
    console.log(`OpenMemo: No suitable container found for ${platformConfig.name}`);
  }
}

function findContainerIntelligently(config: PlatformConfig): Element | null {
  console.log(`OpenMemo: Using intelligent container detection for ${config.name}`);
  
  // Strategy 1: Look for common button container patterns
  const buttonContainerSelectors = [
    "div[class*='button']",
    "div[class*='action']",
    "div[class*='toolbar']",
    "div[class*='control']",
    "div[role='toolbar']",
    "[data-testid*='toolbar']",
    "[data-testid*='action']",
    ".toolbar",
    ".actions",
    ".controls"
  ];
  
  for (const selector of buttonContainerSelectors) {
    const containers = document.querySelectorAll(selector);
    for (const container of containers) {
      if (container.querySelector("button")) {
        console.log(`OpenMemo: Found button container with selector: ${selector}`);
        return container;
      }
    }
  }
  
  // Strategy 2: Find composer and look for nearby buttons
  const composer = findComposer(config);
  if (composer) {
    console.log("OpenMemo: Found composer, looking for nearby button container...");
    
    let parent = composer.parentElement;
    let attempts = 0;
    
    while (parent && attempts < 6) {
      // Look for containers with buttons in the same parent
      const buttonContainers = parent.querySelectorAll("div:has(button), [class*='button'], [class*='action'], [class*='toolbar']");
      
      for (const buttonContainer of buttonContainers) {
        if (buttonContainer !== composer && buttonContainer.querySelector("button")) {
          console.log("OpenMemo: Found button container near composer");
          return buttonContainer as Element;
        }
      }
      
      parent = parent.parentElement;
      attempts++;
    }
    
    // Strategy 3: Create container if none found but composer exists
    if (composer.parentElement) {
      console.log(`OpenMemo: Creating action container for ${config.name}`);
      const actionContainer = document.createElement("div");
      actionContainer.className = `openmemo-actions-${config.name.toLowerCase()} flex items-center gap-2`;
      actionContainer.style.cssText = "display: flex; align-items: center; gap: 8px; margin-left: 8px;";
      
      // Try to find the best position
      const form = composer.closest("form");
      if (form) {
        form.style.position = "relative";
        form.appendChild(actionContainer);
      } else {
        const inputContainer = composer.closest("div");
        if (inputContainer) {
          inputContainer.style.position = "relative";
          inputContainer.appendChild(actionContainer);
        }
      }
      
      return actionContainer;
    }
  }
  
  return null;
}

function findComposer(config: PlatformConfig): Element | null {
  if (config.selectors.composer) {
    const composer = document.querySelector(config.selectors.composer);
    if (composer) return composer;
  }
  
  if (config.selectors.alternativeComposers) {
    for (const altSelector of config.selectors.alternativeComposers) {
      const composer = document.querySelector(altSelector);
      if (composer) return composer;
    }
  }
  
  // Fallback: Look for common composer patterns
  const commonComposerSelectors = [
    'textarea[placeholder*="Ask"]',
    'textarea[placeholder*="Message"]',
    'textarea[placeholder*="Type"]',
    'textarea[placeholder*="Enter"]',
    'div[contenteditable="true"]',
    'input[type="text"][placeholder*="Ask"]',
    'input[type="text"][placeholder*="Message"]',
    'textarea',
    'input[type="text"]'
  ];
  
  for (const selector of commonComposerSelectors) {
    const composer = document.querySelector(selector);
    if (composer) return composer;
  }
  
  return null;
}

function addLoadMemoriesButton(container: Element) {
  if (!platformConfig) return;

  const loadButton = document.createElement("button");
  loadButton.className = platformConfig.button.className;
  loadButton.style.cssText = platformConfig.button.style;
  
  // Replace logo placeholder with actual logo URL
  let innerHTML = platformConfig.button.innerHTML;
  if (innerHTML.includes('LOGO_PLACEHOLDER')) {
    const logoUrl = chrome.runtime?.getURL('logo.png') || '/logo.png';
    innerHTML = innerHTML.replace('LOGO_PLACEHOLDER', logoUrl);
  }
  loadButton.innerHTML = innerHTML;

  // Add error handling for logo loading
  const logoImgs = loadButton.querySelectorAll('img[src*="logo.png"]');
  logoImgs.forEach(logoEl => {
    const logoImg = logoEl as HTMLImageElement;
    logoImg.addEventListener('error', () => {
      console.warn('OpenMemo: Logo failed to load, using fallback');
      // Replace with a simple text fallback
      logoImg.style.display = 'none';
      const textFallback = document.createElement('span');
      textFallback.textContent = 'OM';
      textFallback.style.cssText = `
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: ${logoImg.width || 16}px;
        height: ${logoImg.height || 16}px;
        font-size: ${Math.max(8, (logoImg.width || 16) * 0.6)}px;
        font-weight: bold;
        background: linear-gradient(135deg, #A8FF00, #85CC00);
        color: black;
        border-radius: 2px;
        flex-shrink: 0;
      `;
      logoImg.parentNode?.insertBefore(textFallback, logoImg);
    });
    
    // Test if logo loads by setting a timeout
    setTimeout(() => {
      if (!logoImg.complete || logoImg.naturalWidth === 0) {
        logoImg.dispatchEvent(new Event('error'));
      }
    }, 1000);
  });

  // Add hover effects if defined
  if (platformConfig.button.hoverEffects) {
    const effects = platformConfig.button.hoverEffects;

    if (effects.mouseenter) {
      loadButton.addEventListener("mouseenter", () => {
        const statements = effects.mouseenter!.split(";");
        statements.forEach((statement) => {
          const [property, value] = statement.split("=").map((s) => s.trim());
          if (property && value) {
            (loadButton.style as any)[property] = value.replace(/"/g, "");
          }
        });
      });
    }

    if (effects.mouseleave) {
      loadButton.addEventListener("mouseleave", () => {
        const statements = effects.mouseleave!.split(";");
        statements.forEach((statement) => {
          const [property, value] = statement.split("=").map((s) => s.trim());
          if (property && value) {
            (loadButton.style as any)[property] = value.replace(/"/g, "");
          }
        });
      });
    }

    if (effects.mousedown) {
      loadButton.addEventListener("mousedown", () => {
        const statements = effects.mousedown!.split(";");
        statements.forEach((statement) => {
          const [property, value] = statement.split("=").map((s) => s.trim());
          if (property && value) {
            (loadButton.style as any)[property] = value.replace(/"/g, "");
          }
        });
      });
    }

    if (effects.mouseup) {
      loadButton.addEventListener("mouseup", () => {
        const statements = effects.mouseup!.split(";");
        statements.forEach((statement) => {
          const [property, value] = statement.split("=").map((s) => s.trim());
          if (property && value) {
            (loadButton.style as any)[property] = value.replace(/"/g, "");
          }
        });
      });
    }
  }

  loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Use the new direct load functionality
    loadMemoriesForPlatform();
  });

  // Smart positioning based on platform
  insertButtonIntelligently(container, loadButton, platformConfig);
}

function insertButtonIntelligently(container: Element, button: HTMLElement, config: PlatformConfig) {
  console.log(`OpenMemo: Inserting button intelligently for ${config.name}`);
  
  // Platform-specific positioning rules
  switch (config.name) {
    case "Gemini":
      // For Gemini, wrap in toolbox item structure
      const toolboxItem = document.createElement("toolbox-drawer-item");
      toolboxItem.className =
        "mat-mdc-tooltip-trigger toolbox-drawer-item-button ng-tns-c712736219-16 mat-mdc-tooltip-disabled ng-star-inserted";
      toolboxItem.setAttribute("_ngcontent-ng-c712736219", "");
      toolboxItem.setAttribute("_nghost-ng-c3721336917", "");
      
      // Add Angular Material attributes to the button
      button.setAttribute("_ngcontent-ng-c3721336917", "");
      button.setAttribute("matripple", "");
      button.setAttribute("aria-pressed", "false");
      
      toolboxItem.appendChild(button);
      container.appendChild(toolboxItem);
      break;
      
    case "Claude":
      // For Claude, insert after the first button (attachment button)
      const firstButton = container.querySelector("button");
      if (firstButton && firstButton.parentNode) {
        firstButton.parentNode.insertBefore(button, firstButton.nextSibling);
      } else {
        container.appendChild(button);
      }
      break;
      
    case "T3.chat":
      // For T3.chat, insert after first child to be positioned correctly
      if (container.firstChild) {
        container.insertBefore(button, container.firstChild.nextSibling);
      } else {
        container.appendChild(button);
      }
      break;
      
    case "DeepSeek":
      // For DeepSeek, find search button and insert after it
      let searchButton: Element | null = null;
      
      // Look for buttons with "Search" text
      const allButtons = container.querySelectorAll('div[role="button"], button');
      for (const btn of allButtons) {
        const spans = btn.querySelectorAll('span');
        for (const span of spans) {
          if (span.textContent && span.textContent.includes('Search')) {
            searchButton = btn;
            break;
          }
        }
        if (searchButton) break;
      }
      
      if (searchButton && searchButton.parentNode) {
        searchButton.parentNode.insertBefore(button, searchButton.nextSibling);
      } else {
        container.appendChild(button);
      }
      break;
      
    default:
      // Default strategy: Try to find a good insertion point
      const existingButtons = container.querySelectorAll("button, [role='button']");
      
      if (existingButtons.length > 0) {
        // Insert after the last button
        const lastButton = existingButtons[existingButtons.length - 1];
        if (lastButton.parentNode) {
          lastButton.parentNode.insertBefore(button, lastButton.nextSibling);
        } else {
          container.appendChild(button);
        }
      } else {
        container.appendChild(button);
      }
      break;
  }
}

// Legacy function - keeping for reference but not used with direct load functionality
/*
function showMemorySelector() {
  if (!platformConfig) return;

  // Create a modal to select memories to load
  const modal = document.createElement("div");
  modal.className =
    "openmemo-modal fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-[9999]";

  const isLightTheme = platformConfig.modal.textColor.includes("gray-900");

  modal.innerHTML = `
    <div class="${platformConfig.modal.contentClass} rounded-2xl p-6 max-w-2xl w-full m-4 max-h-[80vh] overflow-hidden flex flex-col" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-lg font-semibold ${platformConfig.modal.textColor}">Load Relevant Memories</h3>
        <button class="close-modal ${platformConfig.modal.textColor} hover:opacity-70 text-2xl w-8 h-8 flex items-center justify-center rounded-lg transition-all">×</button>
      </div>
      
      <div class="mb-4">
        <input 
          type="text" 
          class="query-input w-full px-4 py-3 border-2 rounded-xl text-sm transition-all focus:outline-none" 
          style="border-color: ${isLightTheme ? "#e5e7eb" : "rgba(255,255,255,0.1)"}; background: ${isLightTheme ? "#ffffff" : "rgba(255,255,255,0.05)"}; color: ${isLightTheme ? "#111827" : "#ffffff"};"
          placeholder="Describe what you're looking for..."
        >
        <button class="search-btn mt-3 px-6 py-3 text-white text-sm font-medium rounded-xl transition-all hover:scale-105 active:scale-95" style="background: linear-gradient(135deg, ${platformConfig.modal.primaryColor}, ${platformConfig.modal.accentColor}); box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
          Find Relevant Memories
        </button>
      </div>
      
      <div class="memory-results flex-1 overflow-y-auto space-y-3 mb-4" style="max-height: 400px;">
        <p class="${isLightTheme ? "text-gray-500" : "text-white/70"} text-sm text-center py-8">Enter a search query to find relevant memories using AI</p>
      </div>
      
      <div class="flex justify-end gap-3">
        <button class="cancel-btn px-4 py-2 ${isLightTheme ? "text-gray-600 hover:text-gray-800" : "text-white/80 hover:text-white"} rounded-xl transition-all">Cancel</button>
        <button class="load-selected-btn px-6 py-2 text-white font-medium rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed" style="background: linear-gradient(135deg, ${platformConfig.modal.primaryColor}, ${platformConfig.modal.accentColor}); opacity: 0.5;" disabled>
          Load Selected
        </button>
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

      const isAuthenticated = await apiService.isAuthenticated();
      if (!isAuthenticated) {
        resultsDiv.innerHTML =
          '<p class="text-red-500 text-sm text-center py-4">Please sign in to OpenMemo to access your memories</p>';
        return;
      }

      const source = getPlatformSource();
      const result = await apiService.getMemories({ query, limit: 10 });
      const memories = result.memories;

      if (memories.length === 0) {
        resultsDiv.innerHTML = `<p class="${isLightTheme ? "text-gray-500" : "text-white/70"} text-sm text-center py-4">No relevant memories found for your query</p>`;
      } else {
        resultsDiv.innerHTML = memories
          .map(
            (memory, index) => `
          <label class="memory-item flex items-start gap-2 p-3 border rounded cursor-pointer hover:bg-gray-50">
            <input type="checkbox" class="memory-checkbox mt-1" data-memory-index="${index}">
            <div class="flex-1">
              <div class="text-sm font-medium ${platformConfig!.modal.textColor} mb-1">${memory.content.substring(0, 120)}${memory.content.length > 120 ? "..." : ""}</div>
              <div class="${isLightTheme ? "text-gray-500" : "text-white/60"} text-xs">${memory.category} • ${new Date(memory.createdAt).toLocaleDateString()}</div>
              ${memory.tags && (Array.isArray(memory.tags) ? memory.tags.length > 0 : memory.tags.trim().length > 0) ? `<div class="text-xs mt-1" style="color: ${platformConfig!.modal.primaryColor};">${Array.isArray(memory.tags) ? memory.tags.join(", ") : memory.tags}</div>` : ""}
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
      const memoryText = selectedMemories.map((m) => m.content).join("\n\n");
      insertTextIntoComposer(memoryText);
      showNotification(
        `Loaded ${selectedMemories.length} relevant memories`,
        "success"
      );
    }
    modal.remove();
  });

  document.body.appendChild(modal);

  // Focus the query input
  setTimeout(() => {
    (modal.querySelector(".query-input") as HTMLInputElement)?.focus();
  }, 100);
}
*/

// Not used with direct load functionality
/*
function insertTextIntoComposer(text: string) {
  if (!platformConfig) return;

  let composer = document.querySelector(
    platformConfig.selectors.composer || ""
  );

  // Try alternative composers if primary not found
  if (!composer && platformConfig.selectors.alternativeComposers) {
    for (const altSelector of platformConfig.selectors.alternativeComposers) {
      composer = document.querySelector(altSelector);
      if (composer) break;
    }
  }

  if (!composer) {
    console.log("OpenMemo: Could not find composer element");
    return;
  }

  const config = platformConfig.insertText;

  if (
    config.method === "value" &&
    (composer as HTMLInputElement).value !== undefined
  ) {
    const currentValue = (composer as HTMLInputElement).value;
    (composer as HTMLInputElement).value =
      currentValue + (currentValue ? "\n\n" + text : text);
  } else if (config.method === "textContent") {
    const currentContent = composer.textContent || "";
    composer.textContent =
      currentContent + (currentContent ? "\n\n" + text : text);
  } else if (config.method === "innerHTML") {
    const currentContent = composer.innerHTML || "";
    composer.innerHTML =
      currentContent + (currentContent ? "<br><br>" + text : text);
  }

  // Dispatch events
  config.events.forEach((eventName) => {
    composer!.dispatchEvent(new Event(eventName, { bubbles: true }));
  });

  // Focus if configured
  if (config.focus) {
    (composer as HTMLElement).focus();
  }

  // Place cursor at end if configured
  if (
    config.cursorToEnd &&
    composer.getAttribute("contenteditable") === "true"
  ) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(composer);
    range.collapse(false);
    selection?.removeAllRanges();
    selection?.addRange(range);
  }
}

}
*/

// Not used with direct load functionality  
/*
function showNotification(
  message: string,
  type: "success" | "error" | "warning" = "success"
) {
  const notification = document.createElement("div");
  notification.className = `openmemo-notification fixed top-4 right-4 z-[10000] px-4 py-2 rounded-md text-white text-sm font-medium ${
    type === "success"
      ? "bg-green-600"
      : type === "error"
        ? "bg-red-600"
        : "bg-yellow-600"
  }`;
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 3000);
}
*/
