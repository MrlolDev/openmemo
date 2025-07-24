// OpenMemo supported services configuration
import { getSupportedProviders } from './unified-providers';

export interface Service {
  id: string;
  name: string;
  hostname?: string;
  status: 'supported' | 'coming-soon';
  icon: string; // SVG or icon identifier
  color: string; // Brand color
  description: string;
}

// Generate supported services from unified providers
const supportedServicesFromProviders: Service[] = getSupportedProviders().map(({ key, config }) => ({
  id: key,
  name: config.name,
  hostname: config.hostname,
  status: 'supported' as const,
  icon: getProviderIcon(key),
  color: getProviderColor(key),
  description: getProviderDescription(key)
}));

// Helper functions to get provider-specific UI data
function getProviderIcon(providerId: string): string {
  const iconMap: Record<string, string> = {
    chatgpt: '🤖',
    claude: '🎭',
    deepseek: '🌊',
    perplexity: '🔮',
    gemini: '💎',
    't3chat': '⚡',
  };
  return iconMap[providerId] || '🤖';
}

function getProviderColor(providerId: string): string {
  const colorMap: Record<string, string> = {
    chatgpt: '#10a37f',
    claude: '#f97316',
    deepseek: '#4F46E5',
    perplexity: '#8B5CF6',
    gemini: '#1a73e8',
    't3chat': '#6366f1',
  };
  return colorMap[providerId] || '#6366f1';
}

function getProviderDescription(providerId: string): string {
  const descriptionMap: Record<string, string> = {
    chatgpt: 'OpenAI\'s conversational AI assistant',
    claude: 'Anthropic\'s AI assistant focused on helpfulness and safety',
    deepseek: 'Advanced reasoning AI with deep thinking capabilities',
    perplexity: 'AI-powered search and research assistant',
    gemini: 'Google\'s multimodal AI assistant',
    't3chat': 'Fast and efficient AI chat interface',
  };
  return descriptionMap[providerId] || 'AI assistant';
}

// Coming soon services (not yet in unified providers)
const comingSoonServices: Service[] = [
  {
    id: 'grok',
    name: 'Grok',
    status: 'coming-soon',
    icon: '🚀',
    color: '#1DA1F2',
    description: 'xAI\'s witty and unconventional AI assistant'
  },
  {
    id: 'delphi',
    name: 'Delphi',
    status: 'coming-soon',
    icon: '🏛️',
    color: '#9333EA',
    description: 'AI oracle for predictions and insights'
  },
  {
    id: 'copilot',
    name: 'Copilot',
    status: 'coming-soon',
    icon: '👨‍✈️',
    color: '#0078D4',
    description: 'Microsoft\'s AI companion for productivity'
  },
  {
    id: 'qwen',
    name: 'Qwen',
    status: 'coming-soon',
    icon: '🐉',
    color: '#FF6B35',
    description: 'Alibaba\'s large language model assistant'
  },
  {
    id: 'kimi',
    name: 'Kimi',
    status: 'coming-soon',
    icon: '🎌',
    color: '#E91E63',
    description: 'Moonshot AI\'s conversational assistant'
  },
  {
    id: 'poe',
    name: 'Poe',
    status: 'coming-soon',
    icon: '🎩',
    color: '#000000',
    description: 'Quora\'s platform for multiple AI assistants'
  },
  {
    id: 'huggingchat',
    name: 'HuggingChat',
    status: 'coming-soon',
    icon: '🤗',
    color: '#FF9D00',
    description: 'Open-source AI chat from Hugging Face'
  },
  {
    id: 'meta-ai',
    name: 'Meta AI',
    status: 'coming-soon',
    icon: '🌐',
    color: '#1877F2',
    description: 'Meta\'s AI assistant integrated across platforms'
  },
  {
    id: 'youchat',
    name: 'YouChat',
    status: 'coming-soon',
    icon: '💬',
    color: '#7C3AED',
    description: 'AI-powered search and chat from You.com'
  },
  {
    id: 'groq',
    name: 'Groq',
    status: 'coming-soon',
    icon: '⚡',
    color: '#F59E0B',
    description: 'Ultra-fast AI inference engine'
  },
  {
    id: 'pi',
    name: 'Pi',
    status: 'coming-soon',
    icon: '🥧',
    color: '#06B6D4',
    description: 'Inflection AI\'s personal intelligence assistant'
  },
  {
    id: 'lechat',
    name: 'Le Chat',
    status: 'coming-soon',
    icon: '🇫🇷',
    color: '#EF4444',
    description: 'Mistral AI\'s conversational assistant'
  },
  {
    id: 'character-ai',
    name: 'Character.AI',
    status: 'coming-soon',
    icon: '🎭',
    color: '#8B5CF6',
    description: 'AI characters for creative conversations'
  },
  {
    id: 'bing',
    name: 'Bing Chat',
    status: 'coming-soon',
    icon: '🔍',
    color: '#0078D4',
    description: 'Microsoft\'s AI-powered search assistant'
  },
  {
    id: 'replika',
    name: 'Replika',
    status: 'coming-soon',
    icon: '💙',
    color: '#FF6B9D',
    description: 'Your personal AI companion for emotional support'
  }
];

// Combine supported and coming soon services
export const ALL_SERVICES: Service[] = [
  ...supportedServicesFromProviders,
  ...comingSoonServices
];

export const SUPPORTED_SERVICES = ALL_SERVICES.filter(service => service.status === 'supported');
export const COMING_SOON_SERVICES = ALL_SERVICES.filter(service => service.status === 'coming-soon');

export function getServiceById(id: string): Service | undefined {
  return ALL_SERVICES.find(service => service.id === id);
}

export function getServiceByHostname(hostname: string): Service | undefined {
  return ALL_SERVICES.find(service => 
    service.hostname && hostname.includes(service.hostname)
  );
}