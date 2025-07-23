import React from 'react';

interface MemoryFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
}

const MemoryFilters: React.FC<MemoryFiltersProps> = ({
  searchTerm,
  selectedCategory,
  categories,
  onSearchChange,
  onCategoryChange,
}) => {
  const displayCategories = ['All', ...categories];

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type="text"
          placeholder="Search memories..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl text-white placeholder-white/50 focus:outline-none focus:border-[#A8FF00]/50 focus:bg-white/8 transition-all duration-300 glow-input"
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        </div>
      </div>

      <div className="relative">
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value)}
          className="w-full px-5 py-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl text-white focus:outline-none focus:border-[#A8FF00]/50 focus:bg-white/8 transition-all duration-300 appearance-none cursor-pointer"
        >
          {displayCategories.map((cat) => (
            <option key={cat} value={cat} className="bg-[#1a1a1a] text-white">
              {cat}
            </option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <polyline points="6,9 12,15 18,9" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default MemoryFilters;