// Unified provider configuration for OpenMemo extension
// This consolidates platform configs, API interception, and UI integration

export interface UnifiedProviderConfig {
  // Basic provider info
  name: string;
  hostname: string;
  
  // API interception configuration
  api?: {
    endpoint: string;
    method: 'POST' | 'PUT' | 'PATCH';
    extractUserMessage: (data: any) => string;
    injectMemoryContext: (data: any, memoryContext: string) => any;
  };
  
  // UI integration configuration
  ui: {
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
  };
}

export const UNIFIED_PROVIDERS: Record<string, UnifiedProviderConfig> = {
  chatgpt: {
    name: 'ChatGPT',
    hostname: 'chatgpt.com',
    
    // API interception for automatic memory loading
    api: {
      endpoint: '/backend-api/f/conversation',
      method: 'POST',
      extractUserMessage: (data: any) => {
        const messages = data?.messages;
        if (!messages || !Array.isArray(messages)) return '';
        
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.author?.role === 'user' && lastMessage?.content?.parts) {
          return lastMessage.content.parts.join(' ');
        }
        return '';
      },
      injectMemoryContext: (data: any, memoryContext: string) => {
        const messages = data?.messages;
        if (!messages || !Array.isArray(messages)) return data;
        
        const lastMessage = messages[messages.length - 1];
        if (lastMessage?.author?.role === 'user' && lastMessage?.content?.parts) {
          const originalMessage = lastMessage.content.parts.join(' ');
          const enhancedMessage = `Context from my saved memories:\n${memoryContext}\n\nMy current question/message: ${originalMessage}`;
          
          return {
            ...data,
            messages: [
              ...messages.slice(0, -1),
              {
                ...lastMessage,
                content: {
                  ...lastMessage.content,
                  parts: [enhancedMessage]
                }
              }
            ]
          };
        }
        return data;
      }
    },
    
    // UI integration for manual memory loading
    ui: {
      selectors: {
        container: '[data-testid="composer-trailing-actions"]',
        composer: '[data-testid="composer-text-input"], textarea[placeholder*="Message"], [contenteditable="true"]',
      },
      button: {
        className: "openmemo-load-btn flex items-center justify-center gap-1 p-2 text-token-text-primary hover:bg-token-main-surface-secondary rounded-lg transition-colors duration-200",
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
          mouseenter: 'backgroundColor = "rgba(0, 0, 0, 0.05)"; color = "#374151"',
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
    }
  },

  deepseek: {
    name: 'DeepSeek',
    hostname: 'chat.deepseek.com',
    
    // API interception for automatic memory loading
    api: {
      endpoint: '/api/v0/chat/completion',
      method: 'POST',
      extractUserMessage: (data: any) => {
        return data?.prompt || '';
      },
      injectMemoryContext: (data: any, memoryContext: string) => {
        const originalPrompt = data?.prompt || '';
        const enhancedPrompt = `Context from my saved memories:\n${memoryContext}\n\nMy current question/message: ${originalPrompt}`;
        
        return {
          ...data,
          prompt: enhancedPrompt
        };
      }
    },
    
    // UI integration for manual memory loading
    ui: {
      selectors: {
        container: "#root > div > div.cb86951c > div.c3ecdb44 > div._7780f2e > div > div > div._9a2f8e4 > div.aaff8b8f.eb830e32 > div > div > div.ec4f5d61",
        composer: 'textarea[placeholder*="Ask"], div[contenteditable="true"], input[type="text"]',
        alternativeComposers: [
          "textarea",
          'div[contenteditable="true"]',
          'input[type="text"]',
          ".ec4f5d61",
          "div[class*='ec4f5d61']",
          "div.aaff8b8f.eb830e32 > div > div > div"
        ],
      },
      button: {
        className: "openmemo-load-btn ds-button ds-button--primary ds-button--filled ds-button--rect ds-button--m _3172d9f",
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
          mouseenter: 'transform = "translateY(-1px)"; boxShadow = "0 4px 12px rgba(79, 70, 229, 0.3)"',
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
    }
  },

  claude: {
    name: 'Claude',
    hostname: 'claude.ai',
    
    // UI integration only (API interception can be added later)
    ui: {
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
        className: "openmemo-load-btn inline-flex items-center justify-center relative shrink-0 can-focus select-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none disabled:drop-shadow-none border-0.5 transition-all h-8 min-w-8 rounded-lg flex items-center px-[7.5px] group !pointer-events-auto !outline-offset-1 text-text-300 border-border-300 active:scale-[0.98] hover:text-text-200/90 hover:bg-bg-100",
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
          mouseenter: 'color = "hsl(var(--text-200) / 0.9)"; backgroundColor = "hsl(var(--bg-100))"',
          mouseleave: 'color = "hsl(var(--text-300))"; backgroundColor = "transparent"',
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
    }
  }

  // Additional providers can be easily added here following the same pattern
  // Each provider can have just UI config, just API config, or both
};

// Helper functions
export function detectCurrentProvider(): string | null {
  const hostname = window.location.hostname;
  
  for (const [providerKey, config] of Object.entries(UNIFIED_PROVIDERS)) {
    if (hostname.includes(config.hostname)) {
      return providerKey;
    }
  }
  
  return null;
}

export function getProviderConfig(providerKey: string): UnifiedProviderConfig | null {
  return UNIFIED_PROVIDERS[providerKey] || null;
}

export function getProviderApiConfig(providerKey: string): UnifiedProviderConfig['api'] | null {
  const config = getProviderConfig(providerKey);
  return config?.api || null;
}

export function getProviderUiConfig(providerKey: string): UnifiedProviderConfig['ui'] | null {
  const config = getProviderConfig(providerKey);
  return config?.ui || null;
}

export function getSupportedProviders(): Array<{key: string, config: UnifiedProviderConfig}> {
  return Object.entries(UNIFIED_PROVIDERS).map(([key, config]) => ({key, config}));
}

export function isCurrentHostnameSupported(): boolean {
  return detectCurrentProvider() !== null;
}

export function supportsApiInterception(providerKey?: string): boolean {
  const provider = providerKey || detectCurrentProvider();
  if (!provider) return false;
  
  const config = getProviderConfig(provider);
  return !!config?.api;
}

export function supportsUiIntegration(providerKey?: string): boolean {
  const provider = providerKey || detectCurrentProvider();
  if (!provider) return false;
  
  const config = getProviderConfig(provider);
  return !!config?.ui;
}

// Cache for loaded configs (reserved for future use)
// const configCache = new Map<string, UnifiedProviderConfig>();

export function getPlatformConfigSync(): UnifiedProviderConfig['ui'] | null {
  const provider = detectCurrentProvider();
  if (!provider) return null;
  
  const config = getProviderConfig(provider);
  return config?.ui || null;
}

export function getPlatformSourceId(): string {
  const provider = detectCurrentProvider();
  return provider || 'extension';
}