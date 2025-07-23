// Delphi.ai specific content script
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

function waitForDelphiReady() {
  // Check if basic DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      setTimeout(initDelphiIntegration, 1000);
    });
  } else {
    setTimeout(initDelphiIntegration, 1500);
  }
}

// Wait for page load event
if (document.readyState === "complete") {
  setTimeout(initDelphiIntegration, 2000);
} else {
  window.addEventListener("load", () => {
    setTimeout(initDelphiIntegration, 2000);
  });
  waitForDelphiReady();
}

function initDelphiIntegration() {
  if (isInitialized || buttonInserted) return;
  
  isInitialized = true;
  console.log("OpenMemo: Initializing Delphi.ai integration");

  // Set up mutation observer to watch for DOM changes
  observer = new MutationObserver(throttle((mutations) => {
    if (buttonInserted) return;
    
    const hasSignificantChanges = mutations.some(mutation => 
      mutation.type === "childList" && 
      (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)
    );
    
    if (hasSignificantChanges) {
      checkForDelphiContainer();
    }
  }, CHECK_THROTTLE));

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });

  // Initial check
  checkForDelphiContainer();
  
  // Progressive retry strategy for Delphi.ai
  const retryIntervals = [1000, 2000, 3000, 5000, 7000, 10000, 15000];
  
  retryIntervals.forEach((interval, index) => {
    const timeoutId = window.setTimeout(() => {
      if (!buttonInserted) {
        console.log(`OpenMemo: Delphi retry ${index + 1}`);
        checkForDelphiContainer();
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

function isDelphiReady(): boolean {
  // Check for the textarea and form to ensure the interface is loaded
  const textarea = document.querySelector('#message');
  const form = document.querySelector('form');
  return !!(textarea && form);
}

function checkForDelphiContainer() {
  if (buttonInserted) return;

  const now = Date.now();
  if (now - lastCheckTime < CHECK_THROTTLE) return;
  lastCheckTime = now;

  if (!isDelphiReady()) {
    console.log("OpenMemo: Delphi.ai not ready yet, waiting...");
    return;
  }

  console.log("OpenMemo: Checking for Delphi.ai container...");
  
  // Try to find the button container: div.flex.h-full.items-stretch
  let container = document.querySelector('div.flex.h-full.items-stretch');
  
  if (!container) {
    console.log("OpenMemo: Primary Delphi container not found, trying fallback selectors");
    // Fallback 1: Look for the RightButton container class
    container = document.querySelector('.light.z-20.flex.origin-center.items-end.justify-center');
    
    if (!container) {
      // Fallback 2: Look for any container with submit button near textarea
      const textarea = document.querySelector('#message');
      if (textarea) {
        let parent = textarea.parentElement;
        // Walk up the DOM to find a suitable container for buttons
        while (parent && parent !== document.body) {
          if (parent.querySelector('button[type="submit"]')) {
            console.log("OpenMemo: Using fallback container from textarea parent");
            container = parent;
            break;
          }
          parent = parent.parentElement;
        }
      }
    }
    
    if (!container) {
      console.log("OpenMemo: No suitable container found for Delphi");
      return;
    }
  }
  
  // Check if our button already exists
  if (container.querySelector('.openmemo-load-btn')) {
    console.log("OpenMemo: Button already exists in Delphi container");
    buttonInserted = true;
    stopObserving();
    return;
  }

  console.log("OpenMemo: Adding OpenMemo button to Delphi.ai container");
  addDelphiButton(container);
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
  console.log("OpenMemo: Delphi.ai button inserted, stopping all checks");
}

function addDelphiButton(container: Element) {
  const loadButton = document.createElement("button");
  loadButton.className = "openmemo-load-btn select-none border text-sm font-medium font-sans flex justify-center items-center gap-2 motion-safe:transition cursor-pointer motion-safe:active:scale-[0.98] ring-offset-sand-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-offset-1 focus-visible:ring-[var(--override-primary,_var(--blue-7))] disabled:opacity-50 disabled:cursor-default disabled:active:scale-100 active:text-sand-12 active:bg-sand-1 disabled:hover:bg-transparent disabled:hover:text-sand-11 disabled:active:bg-transparent disabled:active:text-sand-11 size-8 rounded-full duration-150 ease-in-out text-sand-10 bg-sand-1 hover:bg-sand-3 ring-sand-3 hover:text-sand-11 border-transparent";
  
  loadButton.setAttribute('type', 'button');
  loadButton.setAttribute('aria-label', 'Load memories from OpenMemo');
  loadButton.setAttribute('data-testid', 'openmemo-load-button');
  
  loadButton.style.cssText = `
    cursor: pointer;
    font-family: inherit;
    background: var(--sand-1, #fefdfb);
    color: var(--sand-10, #8e8683);
    border: 1px solid transparent;
    transition: all 0.15s ease-in-out;
  `;

  // Use the actual logo URL
  const logoUrl = chrome.runtime?.getURL('logo.png') || '/logo.png';
  
  loadButton.innerHTML = `
    <img src="${logoUrl}" width="16" height="16" style="object-fit: contain; opacity: 0.8; flex-shrink: 0;" alt="OpenMemo" />
  `;

  // Add error handling for logo loading
  const logoImg = loadButton.querySelector('img') as HTMLImageElement;
  if (logoImg) {
    logoImg.addEventListener('error', () => {
      console.warn('OpenMemo: Logo failed to load, using fallback');
      // Replace with text fallback that matches Delphi's design
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
          border-radius: 50%;
          flex-shrink: 0;
          opacity: 0.8;
        ">OM</div>
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
    loadMemoriesForPlatform();
  });

  container.appendChild(loadButton);
}




