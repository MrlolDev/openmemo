// OpenMemo supported services configuration
export interface Service {
  id: string;
  name: string;
  hostname?: string;
  status: 'supported' | 'coming-soon';
  icon: string; // SVG or icon identifier
  color: string; // Brand color
  description: string;
}

export const ALL_SERVICES: Service[] = [
  // Currently Supported
  {
    id: 'chatgpt',
    name: 'ChatGPT',
    hostname: 'chatgpt.com',
    status: 'supported',
    icon: '🤖',
    color: '#10a37f',
    description: 'OpenAI\'s conversational AI assistant'
  },
  {
    id: 'claude',
    name: 'Claude',
    hostname: 'claude.ai',
    status: 'supported',
    icon: '🎭',
    color: '#f97316',
    description: 'Anthropic\'s AI assistant focused on helpfulness and safety'
  },
  {
    id: 'perplexity',
    name: 'Perplexity',
    hostname: 'perplexity.ai',
    status: 'supported',
    icon: '🔮',
    color: '#8B5CF6',
    description: 'AI-powered search and research assistant'
  },
  {
    id: 'gemini',
    name: 'Gemini',
    hostname: 'gemini.google.com',
    status: 'supported',
    icon: '💎',
    color: '#1a73e8',
    description: 'Google\'s multimodal AI assistant'
  },
  {
    id: 'deepseek',
    name: 'DeepSeek',
    hostname: 'chat.deepseek.com',
    status: 'supported',
    icon: '🌊',
    color: '#4F46E5',
    description: 'Advanced reasoning AI with deep thinking capabilities'
  },
  {
    id: 't3chat',
    name: 'T3.chat',
    hostname: 't3.chat',
    status: 'supported',
    icon: '⚡',
    color: '#6366f1',
    description: 'Fast and efficient AI chat interface'
  },

  // Coming Soon
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