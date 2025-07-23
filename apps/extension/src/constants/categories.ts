// Fixed category list for OpenMemo
export const FIXED_CATEGORIES = [
  'All',
  'Personal Info',
  'Work & Career',
  'Food & Recipes', 
  'Entertainment',
  'Travel & Places',
  'Health & Fitness',
  'Learning & Education',
  'Hobbies & Interests',
  'Relationships',
  'Finance & Money',
  'Technology',
  'Home & Lifestyle',
  'Goals & Planning',
  'General'
] as const;

export type CategoryType = typeof FIXED_CATEGORIES[number];

// Category display names and descriptions
export const CATEGORY_INFO: Record<string, { description: string; icon: string }> = {
  'Let AI decide': {
    description: 'AI will automatically categorize this memory',
    icon: '🤖'
  },
  'All': {
    description: 'Show all memories',
    icon: '📋'
  },
  'Personal Info': {
    description: 'Personal details, preferences, and identity',
    icon: '👤'
  },
  'Work & Career': {
    description: 'Professional information and career goals',
    icon: '💼'
  },
  'Food & Recipes': {
    description: 'Favorite foods, recipes, and dietary preferences',
    icon: '🍽️'
  },
  'Entertainment': {
    description: 'Movies, music, books, games, and media preferences',
    icon: '🎬'
  },
  'Travel & Places': {
    description: 'Travel experiences, places visited, and destinations',
    icon: '✈️'
  },
  'Health & Fitness': {
    description: 'Health information, fitness goals, and wellness',
    icon: '💪'
  },
  'Learning & Education': {
    description: 'Educational background, courses, and learning goals',
    icon: '📚'
  },
  'Hobbies & Interests': {
    description: 'Personal interests, hobbies, and activities',
    icon: '🎨'
  },
  'Relationships': {
    description: 'Family, friends, and social connections',
    icon: '👥'
  },
  'Finance & Money': {
    description: 'Financial information, budgets, and money management',
    icon: '💰'
  },
  'Technology': {
    description: 'Tech preferences, tools, and software',
    icon: '💻'
  },
  'Home & Lifestyle': {
    description: 'Living situation, home preferences, and lifestyle',
    icon: '🏠'
  },
  'Goals & Planning': {
    description: 'Future goals, plans, and aspirations',
    icon: '🎯'
  },
  'General': {
    description: 'Miscellaneous memories and information',
    icon: '📝'
  }
};