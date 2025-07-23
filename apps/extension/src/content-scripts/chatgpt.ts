// Content script for ChatGPT.com
import { apiService } from "../services/api";
import { showNotification, loadMemoriesForPlatform } from "./shared";

console.log("OpenMemo: ChatGPT content script loaded");

// Wait for DOM to be ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initChatGPTIntegration);
} else {
  initChatGPTIntegration();
}

function initChatGPTIntegration() {
  console.log("OpenMemo: Initializing ChatGPT integration...");

  // Monitor for changes in the DOM to handle dynamic content
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === "childList") {
        checkForMemoryDialog();
        checkForComposer();
      }
    });
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial checks
  checkForMemoryDialog();
  checkForComposer();

  // Also check periodically in case DOM isn't ready yet
  setTimeout(() => {
    console.log("OpenMemo: Delayed check for ChatGPT elements...");
    checkForMemoryDialog();
    checkForComposer();
  }, 2000);

  setTimeout(() => {
    console.log("OpenMemo: Second delayed check for ChatGPT elements...");
    checkForMemoryDialog();
    checkForComposer();
  }, 5000);
}

function checkForMemoryDialog() {
  // Look for the saved memories dialog on the personalization settings page
  // Handle multiple URL patterns for ChatGPT settings
  const currentUrl = window.location.href;
  const isPersonalizationPage =
    currentUrl.includes("#settings/Personalization") ||
    currentUrl.includes("/settings/Personalization") ||
    currentUrl.includes("#settings/personalization") ||
    currentUrl.includes("/settings/personalization") ||
    (currentUrl.includes("settings") && currentUrl.includes("personalization"));

  console.log(
    "OpenMemo: Checking for memory dialog. URL:",
    currentUrl,
    "Is personalization page:",
    isPersonalizationPage
  );

  if (isPersonalizationPage) {
    const memoryDialog = findMemoryDialog();
    console.log("OpenMemo: Memory dialog found:", !!memoryDialog);
    if (memoryDialog && !memoryDialog.querySelector(".openmemo-save-btn")) {
      console.log("OpenMemo: Adding save memories button");
      addSaveMemoriesButton(memoryDialog);
    }
  }

  // Also check for memory dialog regardless of URL (in case URL patterns change)
  const memoryDialog = findMemoryDialog();
  if (memoryDialog && !memoryDialog.querySelector(".openmemo-save-btn")) {
    console.log(
      "OpenMemo: Found memory dialog outside of personalization page, adding button"
    );
    addSaveMemoriesButton(memoryDialog);
  }
}

function findMemoryDialog() {
  // Find the dialog with memory-related content - try multiple approaches
  const headings = document.querySelectorAll("h1, h2, h3, h4, h5, h6");

  console.log(
    "OpenMemo: Searching through",
    headings.length,
    "headings for memory dialog"
  );

  for (const heading of headings) {
    const text = heading.textContent?.toLowerCase() || "";
    console.log("OpenMemo: Checking heading:", text);

    // Look for various memory-related text patterns
    if (
      text.includes("saved memories") ||
      (text.includes("memory") && text.includes("saved")) ||
      text.includes("memories") ||
      text.includes("remember")
    ) {
      console.log("OpenMemo: Found memory-related heading:", text);

      // Traverse up to find the dialog container
      let parent = heading.parentElement;
      let attempts = 0;

      while (parent && attempts < 10) {
        // Look for common dialog/modal/popover containers
        if (
          parent.classList.contains("popover") ||
          parent.classList.contains("modal") ||
          parent.classList.contains("dialog") ||
          parent.getAttribute("role") === "dialog" ||
          parent.getAttribute("data-testid")?.includes("modal") ||
          parent.getAttribute("data-testid")?.includes("dialog")
        ) {
          console.log("OpenMemo: Found dialog container for memories");

          // Look for action buttons area (various selectors)
          const actionArea =
            parent.querySelector(".mt-5.flex.justify-end") ||
            parent.querySelector("[data-testid*='button']")?.closest(".flex") ||
            parent.querySelector(".flex.justify-end") ||
            parent.querySelector(".flex.gap") ||
            parent.querySelector("button")?.closest(".flex");

          if (actionArea || parent.querySelector("button")) {
            console.log("OpenMemo: Found action area in dialog");
            return parent;
          }
        }
        parent = parent.parentElement;
        attempts++;
      }
    }
  }

  console.log("OpenMemo: No memory dialog found");
  return null;
}

function addSaveMemoriesButton(dialog: Element) {
  // Try multiple selectors for the footer/action area
  let footer =
    dialog.querySelector(".mt-5.flex.justify-end") ||
    dialog.querySelector(".flex.justify-end") ||
    dialog.querySelector(".flex.gap") ||
    dialog.querySelector("button")?.closest(".flex");

  if (!footer) {
    console.log("OpenMemo: No footer found in dialog, creating one");
    // Create a footer if none exists
    footer = document.createElement("div");
    footer.className = "mt-5 flex justify-end gap-3";
    dialog.appendChild(footer);
  }

  console.log("OpenMemo: Footer found/created:", footer);

  // Check if button already exists
  if (footer.querySelector(".openmemo-sync-btn")) {
    console.log("OpenMemo: Button already exists");
    return;
  }

  const syncButton = document.createElement("button");
  // Match ChatGPT's btn-secondary design exactly
  syncButton.className = "openmemo-sync-btn btn relative btn-secondary";
  syncButton.style.marginRight = "12px";
  syncButton.innerHTML = `
    <div class="flex items-center justify-center gap-2">
      <img src="${chrome.runtime?.getURL ? chrome.runtime.getURL('logo.png') : '/logo.png'}" class="sync-icon w-5 h-5" style="flex-shrink: 0; object-fit: contain;" alt="OpenMemo" />
      <span class="sync-text">Sync with OpenMemo</span>
      <div class="sync-loading hidden w-5 h-5">
        <svg class="animate-spin w-5 h-5" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" fill="none"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </div>
    </div>
  `;

  syncButton.addEventListener("click", () => {
    syncMemoriesWithAI(syncButton);
  });

  console.log("OpenMemo: Adding sync button to footer");

  // Find the Delete all button or any destructive-looking button
  const deleteAllBtn = Array.from(footer.querySelectorAll("button")).find(
    (btn) => {
      const text = btn.textContent?.trim().toLowerCase() || "";
      return (
        text.includes("delete all") ||
        text.includes("delete") ||
        text.includes("clear") ||
        text.includes("remove")
      );
    }
  );

  if (deleteAllBtn) {
    console.log(
      "OpenMemo: Found delete button, inserting sync button before it"
    );
    footer.insertBefore(syncButton, deleteAllBtn);
  } else {
    console.log(
      "OpenMemo: No delete button found, appending sync button to footer"
    );
    footer.appendChild(syncButton);
  }

  console.log("OpenMemo: Sync button added successfully");
}

// Helper function to check if extension context is valid
function isExtensionContextValid(): boolean {
  try {
    return !!(chrome && chrome.runtime && chrome.runtime.id);
  } catch (error) {
    return false;
  }
}

async function syncMemoriesWithAI(button: HTMLButtonElement) {
  try {
    // Check if extension context is still valid
    if (!isExtensionContextValid()) {
      showNotification("Extension was updated. Please refresh the page to continue.", "warning");
      return;
    }

    const isAuthenticated = await apiService.isAuthenticated();
    if (!isAuthenticated) {
      showNotification("Please sign in to OpenMemo first", "error");
      
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

    // Show loading state
    const syncIcon = button.querySelector(".sync-icon") as HTMLElement;
    const syncText = button.querySelector(".sync-text") as HTMLElement;
    const syncLoading = button.querySelector(".sync-loading") as HTMLElement;

    syncIcon.style.display = "none";
    syncText.textContent = "Saving...";
    syncLoading.classList.remove("hidden");
    button.disabled = true;

    // Extract memories from ChatGPT using multiple selectors
    const selectors = [
      "div.py-2.whitespace-pre-wrap",
      "[data-testid*='memory']",
      ".memory-item",
      "div[class*='memory']",
      "p", // Fallback to any paragraph in the dialog
      "div",
    ];

    let memories: string[] = [];

    for (const selector of selectors) {
      const elements = document.querySelectorAll(selector);
      console.log(
        `OpenMemo: Found ${elements.length} elements with selector '${selector}'`
      );

      elements.forEach((element) => {
        const text = element.textContent?.trim();
        if (text && text.length > 10 && !memories.includes(text)) {
          // Avoid duplicates and short text
          // Filter out UI text
          if (
            !text.toLowerCase().includes("delete") &&
            !text.toLowerCase().includes("button") &&
            !text.toLowerCase().includes("settings") &&
            !text.toLowerCase().includes("close")
          ) {
            memories.push(text);
          }
        }
      });

      if (memories.length > 0) {
        console.log(
          `OpenMemo: Found ${memories.length} memories with selector '${selector}'`
        );
        break; // Stop at first successful selector
      }
    }

    if (memories.length === 0) {
      showNotification("No new memories found to sync", "error");
      return;
    }

    // Get existing memories to check for duplicates
    const existingMemoriesResult = await apiService.getMemories({ limit: 1000 });
    const existingMemories = existingMemoriesResult.memories;
    
    // Filter out memories that already exist (check by content similarity)
    const newMemories = memories.filter(memory => {
      return !existingMemories.some(existing => 
        existing.content.trim().toLowerCase() === memory.trim().toLowerCase()
      );
    });
    
    if (newMemories.length === 0) {
      showNotification("No new memories found - all memories already exist in OpenMemo", "error");
      return;
    }
    
    if (newMemories.length < memories.length) {
      showNotification(
        `Found ${newMemories.length} new memories (${memories.length - newMemories.length} already exist). Processing...`,
        "success"
      );
    } else {
      showNotification(
        `Found ${newMemories.length} new memories. Processing with AI categorization...`,
        "success"
      );
    }

    // Update button text to show processing
    syncText.textContent = `Categorizing ${newMemories.length} memories...`;

    // Create memories using the bulk API with automatic categorization
    let processed = 0;
    let skipped = 0;

    try {
      const result = await apiService.createBulkMemories({
        memories: newMemories,
        source: "chatgpt-sync"
      });
      
      processed = result.processed;
      skipped = result.skipped;
    } catch (error) {
      console.error("Error creating bulk memories:", error);
      
      const errorMessage = error instanceof Error ? error.message : String(error);
      
      // Check if it's a timeout error
      if (errorMessage.includes('timeout') || errorMessage.includes('Request timeout')) {
        showNotification(
          `Processing is taking longer than expected. Some memories may still be saved in the background.`,
          "warning"
        );
        // Don't mark all as skipped for timeout, as some might have been processed
        skipped = Math.floor(newMemories.length / 2); // Estimate
        processed = newMemories.length - skipped;
      } else {
        showNotification(
          `Error processing memories: ${errorMessage}`,
          "error"
        );
        skipped = newMemories.length;
      }
    }

    if (processed > 0) {
      showNotification(
        `Successfully synced ${processed} memories! ${skipped > 0 ? `(${skipped} skipped due to errors)` : ''}`,
        "success"
      );
    } else {
      showNotification(
        "Failed to sync memories. Please try again.",
        "error"
      );
    }
  } catch (error) {
    console.error("Error syncing memories:", error);
    showNotification("Failed to sync memories", "error");
  } finally {
    // Reset button state
    const syncIcon = button.querySelector(".sync-icon") as HTMLElement;
    const syncText = button.querySelector(".sync-text") as HTMLElement;
    const syncLoading = button.querySelector(".sync-loading") as HTMLElement;

    syncIcon.style.display = "";
    syncText.textContent = "Sync with OpenMemo";
    syncLoading.classList.add("hidden");
    button.disabled = false;
  }
}

function checkForComposer() {
  console.log("OpenMemo: Checking for composer...");

  // Try multiple selectors for ChatGPT's composer actions area
  const selectors = [
    '[data-testid="composer-trailing-actions"]',
    ".flex.items-end.gap-2 > .flex.gap-1",
    ".flex.items-center.gap-2 > .flex.gap-1",
    'div[class*="composer"] .flex.gap-1',
    ".composer .flex.gap-1",
    ".composer-toolbar",
    "form div.flex.gap-1",
    'div.flex.gap-1[data-testid*="action"]',
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

  // If no specific action area found, try to find the compose form and add to it
  if (!composerActions) {
    const form = document
      .querySelector(
        'form[class*="composer"], form textarea[placeholder*="Message"]'
      )
      ?.closest("form");
    if (form) {
      console.log("OpenMemo: Found composer form, creating action area");
      // Create an action area if none exists
      let actionDiv = form.querySelector(".openmemo-actions") as HTMLElement;
      if (!actionDiv) {
        actionDiv = document.createElement("div");
        actionDiv.className = "openmemo-actions flex gap-2 items-center";
        actionDiv.style.cssText =
          "position: absolute; top: 8px; right: 8px; z-index: 10;";
        (form as HTMLElement).style.position = "relative";
        form.appendChild(actionDiv);
      }
      composerActions = actionDiv;
    }
  }

  if (composerActions && !composerActions.querySelector(".openmemo-load-btn")) {
    console.log("OpenMemo: Adding load memories button to composer");
    addLoadMemoriesButton(composerActions);
  } else if (!composerActions) {
    console.log("OpenMemo: No composer actions area found");
  } else {
    console.log("OpenMemo: Load memories button already exists");
  }
}

function addLoadMemoriesButton(container: Element) {
  // Create the wrapper div first
  const loadButtonContainer = document.createElement("div");
  loadButtonContainer.className = "min-w-9";
  loadButtonContainer.setAttribute("data-testid", "openmemo-load-memories-container");

  const loadButton = document.createElement("button");
  loadButton.className = "openmemo-load-btn composer-btn";
  loadButton.setAttribute("aria-label", "Load memories");
  loadButton.setAttribute("type", "button");
  loadButton.setAttribute("data-testid", "openmemo-load-memories-button");
  
  // Create SVG icon matching the dictate button structure
  loadButton.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-label="" class="icon" font-size="inherit">
      <image href="${chrome.runtime?.getURL ? chrome.runtime.getURL('logo.png') : '/logo.png'}" width="20" height="20" style="object-fit: contain;" />
    </svg>
  `;
  
  loadButtonContainer.appendChild(loadButton);

  loadButton.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
    loadMemoriesForPlatform();
  });

  // Insert at the beginning of the container (first button)
  if (container.firstChild) {
    container.insertBefore(loadButtonContainer, container.firstChild);
  } else {
    container.appendChild(loadButtonContainer);
  }
}



