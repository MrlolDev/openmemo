import React from 'react';
import { FIXED_CATEGORIES, CATEGORY_INFO } from '../constants/categories';

interface CategoryTabsProps {
  categories?: string[]; // Make optional since we use fixed categories
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onCategoryChange,
}) => {
  // Use fixed categories instead of dynamic ones
  const allCategories = FIXED_CATEGORIES;

  return (
    <div className="overflow-hidden">
      <div 
        className="flex gap-1.5 overflow-x-auto pb-1" 
        style={{
          scrollbarWidth: 'none', 
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        {allCategories.map((category) => (
          <button
            key={category}
            onClick={() => onCategoryChange(category)}
            className={`flex-shrink-0 px-2.5 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1 ${
              selectedCategory === category
                ? "bg-[#A8FF00] text-black shadow-md shadow-[#A8FF00]/20 hover:bg-[#85CC00]"
                : "text-white/70 hover:text-white hover:bg-white/10 hover:scale-105 active:scale-95"
            }`}
            title={CATEGORY_INFO[category]?.description || category}
          >
            <span className="text-xs">{CATEGORY_INFO[category]?.icon || '📋'}</span>
            <span className="whitespace-nowrap">{category}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryTabs;