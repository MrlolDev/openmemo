// Platform configuration for OpenMemo extension
export interface PlatformConfig {
  name: string;
  hostname: string;
  selectors: {
    container: string;
    composer?: string;
    alternativeComposers?: string[];
  };
  button: {
    className: string;
    style: string;
    innerHTML: string;
    hoverEffects?: {
      mouseenter?: string;
      mouseleave?: string;
      mousedown?: string;
      mouseup?: string;
    };
  };
  modal: {
    contentClass: string;
    primaryColor: string;
    accentColor: string;
    textColor: string;
  };
  insertText: {
    method: "value" | "textContent" | "innerHTML";
    events: string[];
    focus?: boolean;
    cursorToEnd?: boolean;
  };
}

export const PLATFORM_CONFIGS: Record<string, PlatformConfig> = {
  chatgpt: {
    name: "ChatGPT",
    hostname: "chatgpt.com",
    selectors: {
      container: '[data-testid="composer-trailing-actions"]',
      composer:
        '[data-testid="composer-text-input"], textarea[placeholder*="Message"], [contenteditable="true"]',
    },
    button: {
      className:
        "openmemo-load-btn flex items-center justify-center gap-1 p-2 text-token-text-primary hover:bg-token-main-surface-secondary rounded-lg transition-colors duration-200",
      style: `
        background: transparent;
        border: none;
        cursor: pointer;
        min-width: auto;
        height: 32px;
        padding: 6px 8px;
        font-size: 13px;
        font-weight: 500;
        color: #6b7280;
      `,
      innerHTML: `
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="flex-shrink: 0;">
          <path d="M9 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-4"/>
          <polyline points="7,9 12,4 17,9"/>
          <line x1="12" y1="4" x2="12" y2="14"/>
        </svg>
        <span style="font-size: 13px; white-space: nowrap;">Memories</span>
      `,
      hoverEffects: {
        mouseenter:
          'backgroundColor = "rgba(0, 0, 0, 0.05)"; color = "#374151"',
        mouseleave: 'backgroundColor = "transparent"; color = "#6b7280"',
      },
    },
    modal: {
      contentClass: "bg-white border border-gray-200 shadow-2xl",
      primaryColor: "#10a37f",
      accentColor: "#1a7f64",
      textColor: "text-gray-900",
    },
    insertText: {
      method: "value",
      events: ["input"],
      focus: false,
      cursorToEnd: false,
    },
  },

  claude: {
    name: "Claude",
    hostname: "claude.ai", 
    selectors: {
      container: "div.relative.flex-1.flex.items-center.gap-2.shrink.min-w-0",
      composer: 'div[contenteditable="true"]',
      alternativeComposers: [
        'div[contenteditable="true"][data-testid*="composer"]',
        'div[contenteditable="true"][placeholder]',
        'textarea',
        'input[type="text"]'
      ],
    },
    button: {
      className:
        "openmemo-load-btn inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none border-0.5 transition-all h-8 min-w-8 rounded-lg flex items-center px-[7.5px] group !pointer-events-auto !outline-offset-1 text-text-300 border-border-300 active:scale-[0.98] hover:text-text-200/90 hover:bg-bg-100",
      style: `
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        background: transparent;
        color: hsl(var(--text-300));
        transition: all 0.2s ease;
        border: 0.5px solid hsl(var(--border-300));
      `,
      innerHTML: `
        <div class="flex flex-row items-center justify-center gap-1">
          <div style="transform: none;">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 256 256">
              <image href="LOGO_PLACEHOLDER" width="16" height="16" style="object-fit: contain;" />
            </svg>
          </div>
        </div>
      `,
      hoverEffects: {
        mouseenter:
          'color = "hsl(var(--text-200) / 0.9)"; backgroundColor = "hsl(var(--bg-100))"',
        mouseleave:
          'color = "hsl(var(--text-300))"; backgroundColor = "transparent"',
      },
    },
    modal: {
      contentClass: "bg-white border border-orange-200 shadow-2xl",
      primaryColor: "#f97316",
      accentColor: "#ea580c",
      textColor: "text-gray-900",
    },
    insertText: {
      method: "textContent",
      events: ["input", "change"],
      focus: true,
      cursorToEnd: false,
    },
  },

  perplexity: {
    name: "Perplexity",
    hostname: "perplexity.ai",
    selectors: {
      container: "div.bg-background-50.dark\\:bg-offsetDark.flex.items-center.justify-self-end.rounded-full.col-start-3.row-start-2",
      composer: 'div[contenteditable="true"][id="ask-input"]',
      alternativeComposers: [
        'div[contenteditable="true"]',
        'textarea[placeholder*="Ask"]',
        'input[type="text"][placeholder*="Ask"]',
        "textarea",
        'input[type="text"]'
      ],
    },
    button: {
      className:
        "openmemo-load-btn focus-visible:bg-offsetPlus dark:focus-visible:bg-offsetPlusDark hover:bg-offsetPlus text-textOff hover:text-textMain dark:hover:bg-offsetPlusDark dark:hover:text-textMainDark max-w-24 sm:max-w-none font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out font-sans select-none items-center relative group/button justify-center text-center items-center rounded-lg cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 aspect-[9/8]",
      style: `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        border: none;
        cursor: pointer;
        background: transparent;
        color: var(--text-off);
        transition: all 0.3s ease-out;
      `,
      innerHTML: `
        <div class="flex items-center min-w-0 font-medium gap-1.5 justify-center">
          <div class="flex shrink-0 items-center justify-center size-4">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7999999999999998" stroke-linecap="round" stroke-linejoin="round">
              <image href="LOGO_PLACEHOLDER" width="16" height="16" style="object-fit: contain;" />
            </svg>
          </div>
        </div>
      `,
      hoverEffects: {
        mouseenter:
          'backgroundColor = "var(--bg-offset-plus)"; color = "var(--text-main)"',
        mouseleave:
          'backgroundColor = "transparent"; color = "var(--text-off)"',
      },
    },
    modal: {
      contentClass: "bg-white border border-purple-200 shadow-2xl",
      primaryColor: "#8B5CF6",
      accentColor: "#3B82F6",
      textColor: "text-gray-900",
    },
    insertText: {
      method: "value",
      events: ["input", "change"],
      focus: true,
      cursorToEnd: false,
    },
  },

  gemini: {
    name: "Gemini",
    hostname: "gemini.google.com",
    selectors: {
      container:
        "#app-root > main > side-navigation-v2 > bard-sidenav-container > bard-sidenav-content > div.content-wrapper > div > div.content-container > chat-window > div > input-container > div > input-area-v2 > div > div > div.leading-actions-wrapper.ng-tns-c1118572211-4.ng-star-inserted > toolbox-drawer > div",
      composer:
        'div[contenteditable="true"][data-placeholder], textarea[placeholder*="Enter a prompt"], div.ql-editor[contenteditable="true"]',
      alternativeComposers: [
        'div[contenteditable="true"]',
        'textarea',
        'input[type="text"]'
      ],
    },
    button: {
      className:
        "openmemo-load-btn mat-ripple mat-mdc-tooltip-trigger toolbox-drawer-item-button gds-label-l ng-star-inserted",
      style: `
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        background: transparent;
        border: none;
        cursor: pointer;
        border-radius: 8px;
        transition: all 0.2s ease;
        width: 100%;
        color: #1a73e8;
        font-family: 'Google Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        font-size: 14px;
        font-weight: 500;
        text-align: left;
      `,
      innerHTML: `
        <mat-icon role="img" matlistitemicon="" class="mat-icon notranslate mat-mdc-list-item-icon menu-icon gds-icon-l google-symbols mat-ligature-font mat-icon-no-color mdc-list-item__start ng-star-inserted" aria-hidden="true" data-mat-icon-type="font" data-mat-icon-name="openmemo_load" style="width: 24px; height: 24px; font-size: 24px; display: flex; align-items: center; justify-content: center; color: #1a73e8;">
          <img src="LOGO_PLACEHOLDER" width="20" height="20" style="flex-shrink: 0; object-fit: contain;" alt="Load Memories" />
        </mat-icon>
        <div class="toolbox-drawer-button-label label">Load Memories</div>
      `,
      hoverEffects: {
        mouseenter: 'backgroundColor = "rgba(26, 115, 232, 0.08)"',
        mouseleave: 'backgroundColor = "transparent"',
        mousedown: 'backgroundColor = "rgba(26, 115, 232, 0.12)"',
        mouseup: 'backgroundColor = "rgba(26, 115, 232, 0.08)"',
      },
    },
    modal: {
      contentClass: "bg-white border border-blue-200 shadow-2xl",
      primaryColor: "#1a73e8",
      accentColor: "#1557b0",
      textColor: "text-gray-900",
    },
    insertText: {
      method: "textContent",
      events: ["input", "change"],
      focus: true,
      cursorToEnd: true,
    },
  },

  deepseek: {
    name: "DeepSeek",
    hostname: "chat.deepseek.com",
    selectors: {
      container: "#root > div > div.cb86951c > div.c3ecdb44 > div._7780f2e > div > div > div._9a2f8e4 > div.aaff8b8f.eb830e32 > div > div > div.ec4f5d61",
      composer:
        'textarea[placeholder*="Ask"], div[contenteditable="true"], input[type="text"]',
      alternativeComposers: [
        "textarea",
        'div[contenteditable="true"]',
        'input[type="text"]',
        ".ec4f5d61", // Fallback to the main container class
        "div[class*='ec4f5d61']",
        "div.aaff8b8f.eb830e32 > div > div > div"
      ],
    },
    button: {
      className:
        "openmemo-load-btn ds-button ds-button--primary ds-button--filled ds-button--rect ds-button--m _3172d9f",
      style: `
        --ds-button-color: transparent;
        --button-text-color: #F8FAFF;
        --button-border-color: #626262;
        --ds-button-hover-color: #424451;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
      `,
      innerHTML: `
        <div class="ds-button__icon">
          <span style="transition: none; transform: rotate(0deg);">
            <div class="ds-icon" style="font-size: 19px; width: 19px; height: 19px; color: rgb(248, 250, 255);">
              <img src="LOGO_PLACEHOLDER" width="20" height="20" style="flex-shrink: 0; object-fit: contain;" alt="Load Memories" />
            </div>
          </span>
        </div>
        <span class="ad0c98fd">Load Memories</span>
      `,
      hoverEffects: {
        mouseenter:
          'transform = "translateY(-1px)"; boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3)"',
        mouseleave: 'transform = "translateY(0)"; boxShadow = "none"',
      },
    },
    modal: {
      contentClass: "bg-white border border-indigo-200 shadow-2xl",
      primaryColor: "#4F46E5",
      accentColor: "#7C3AED",
      textColor: "text-gray-900",
    },
    insertText: {
      method: "value",
      events: ["input", "change"],
      focus: true,
      cursorToEnd: false,
    },
  },

  t3chat: {
    name: "T3.chat",
    hostname: "t3.chat",
    selectors: {
      container: ".ml-\\[-7px\\].flex.items-center.gap-1",
      composer:
        'textarea[placeholder*="Ask"], div[contenteditable="true"], input[type="text"]',
      alternativeComposers: [
        "textarea",
        'div[contenteditable="true"]',
        'input[type="text"]',
      ],
    },
    button: {
      className:
        "openmemo-load-btn inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-muted/40 hover:text-foreground disabled:hover:bg-transparent disabled:hover:text-foreground/50 px-3 text-xs -mb-1.5 h-auto gap-2 rounded-full border border-solid border-secondary-foreground/10 py-1.5 pl-2 pr-2.5 text-muted-foreground max-sm:p-2",
      style: `
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
        cursor: pointer;
        background-color: transparent;
        color: hsl(var(--muted-foreground));
        border-radius: 9999px;
        opacity: 1;
        pointer-events: auto;
      `,
      innerHTML: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide h-4 w-4">
          <image href="LOGO_PLACEHOLDER" width="24" height="24" style="object-fit: contain;" />
        </svg>
        <span>Load Memories</span>
      `,
    },
    modal: {
      contentClass: "bg-white border border-gray-200 shadow-2xl",
      primaryColor: "#6366f1",
      accentColor: "#4f46e5",
      textColor: "text-gray-900",
    },
    insertText: {
      method: "value",
      events: ["input", "change"],
      focus: true,
      cursorToEnd: false,
    },
  },
};

// Helper functions
export function getPlatformConfig(): PlatformConfig | null {
  const hostname = window.location.hostname;

  for (const [, config] of Object.entries(PLATFORM_CONFIGS)) {
    if (hostname.includes(config.hostname)) {
      return config;
    }
  }

  return null;
}

export function getPlatformSource(): string {
  const hostname = window.location.hostname;

  for (const [key, config] of Object.entries(PLATFORM_CONFIGS)) {
    if (hostname.includes(config.hostname)) {
      return key;
    }
  }

  return "extension";
}
