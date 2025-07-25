import React from 'react';
import { Search, Select } from '@repo/ui';

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
  const selectOptions = displayCategories.map(cat => ({
    value: cat,
    label: cat
  }));

  return (
    <div className="space-y-3">
      <Search
        placeholder="Search memories..."
        value={searchTerm}
        onSearchChange={onSearchChange}
        variant="neon"
        size="md"
        debounceMs={300}
      />

      <Select
        options={selectOptions}
        value={selectedCategory}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onCategoryChange(e.target.value)}
        variant="neon"
        size="md"
      />
    </div>
  );
};

export default MemoryFilters;