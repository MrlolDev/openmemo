// Efficient platform registry with lazy loading
import type { PlatformConfig } from './platforms';

type PlatformLoader = () => Promise<PlatformConfig>;

// Registry of platform loaders for code splitting
const platformLoaders: Record<string, PlatformLoader> = {
  'chatgpt.com': () => import('./platforms').then(m => m.PLATFORM_CONFIGS.chatgpt),
  'claude.ai': () => import('./platforms').then(m => m.PLATFORM_CONFIGS.claude),
  'perplexity.ai': () => import('./platforms').then(m => m.PLATFORM_CONFIGS.perplexity),
  'gemini.google.com': () => import('./platforms').then(m => m.PLATFORM_CONFIGS.gemini),
  'chat.deepseek.com': () => import('./platforms').then(m => m.PLATFORM_CONFIGS.deepseek),
  't3.chat': () => import('./platforms').then(m => m.PLATFORM_CONFIGS.t3chat),
};

// Cache for loaded configs
const configCache = new Map<string, PlatformConfig>();

/**
 * Efficiently get platform config with caching and lazy loading
 */
export async function getPlatformConfigAsync(): Promise<PlatformConfig | null> {
  const hostname = window.location.hostname;
  
  // Check cache first
  if (configCache.has(hostname)) {
    return configCache.get(hostname)!;
  }
  
  // Find matching loader
  const loader = Object.entries(platformLoaders).find(([domain]) => 
    hostname.includes(domain)
  )?.[1];
  
  if (!loader) {
    return null;
  }
  
  try {
    const config = await loader();
    configCache.set(hostname, config);
    return config;
  } catch (error) {
    console.error('Failed to load platform config:', error);
    return null;
  }
}

/**
 * Synchronous version for backward compatibility
 */
export function getPlatformConfigSync(): PlatformConfig | null {
  const hostname = window.location.hostname;
  
  // Check cache first
  if (configCache.has(hostname)) {
    return configCache.get(hostname)!;
  }
  
  // Fall back to synchronous import
  try {
    const { PLATFORM_CONFIGS } = require('./platforms');
    
    for (const [, config] of Object.entries(PLATFORM_CONFIGS)) {
      const platformConfig = config as PlatformConfig;
      if (hostname.includes(platformConfig.hostname)) {
        configCache.set(hostname, platformConfig);
        return platformConfig;
      }
    }
  } catch (error) {
    console.error('Failed to load platform configs synchronously:', error);
  }
  
  return null;
}

/**
 * Get platform source identifier
 */
export function getPlatformSourceId(): string {
  const hostname = window.location.hostname;
  
  // Map hostnames to source IDs
  const sourceMap: Record<string, string> = {
    'chatgpt.com': 'chatgpt',
    'claude.ai': 'claude',
    'perplexity.ai': 'perplexity',
    'gemini.google.com': 'gemini',
    'chat.deepseek.com': 'deepseek',
    't3.chat': 't3chat'
  };
  
  for (const [domain, source] of Object.entries(sourceMap)) {
    if (hostname.includes(domain)) {
      return source;
    }
  }
  
  return 'extension';
}

/**
 * Pre-load platform config (for performance)
 */
export function preloadPlatformConfig(): void {
  // Start loading the config asynchronously
  getPlatformConfigAsync().catch(() => {
    // Ignore errors, will be handled when actually needed
  });
}