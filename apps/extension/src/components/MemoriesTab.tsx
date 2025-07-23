import React from 'react';
import type { Memory } from '../services/api';
import MemoryCard from './MemoryCard';
import AddMemoryForm from './AddMemoryForm';
import CategoryTabs from './CategoryTabs';
import Tooltip from './Tooltip';

interface MemoriesTabProps {
  memories: Memory[];
  filteredMemories: Memory[];
  searchTerm: string;
  selectedCategory: string;
  categories: string[];
  isAddingMemory: boolean;
  newMemory: { content: string; category: string };
  onSearchChange: (term: string) => void;
  onCategoryChange: (category: string) => void;
  onAddMemoryClick: () => void;
  onDeleteMemory: (id: string) => void;
  onSaveMemory: () => void;
  onCancelAddMemory: () => void;
  onNewMemoryChange: (memory: { content: string; category: string }) => void;
  onFindSimilar?: (memoryId: string) => void;
}

const MemoriesTab: React.FC<MemoriesTabProps> = ({
  memories,
  filteredMemories,
  searchTerm,
  selectedCategory,
  categories,
  isAddingMemory,
  newMemory,
  onSearchChange,
  onCategoryChange,
  onAddMemoryClick,
  onDeleteMemory,
  onSaveMemory,
  onCancelAddMemory,
  onNewMemoryChange,
  onFindSimilar,
}) => {

  return (
    <div className="h-full flex flex-col relative">
      {/* Card Container for all content */}
      <div className="fluid-container flex-1 flex flex-col min-h-0">
        {isAddingMemory ? (
          /* Full-screen Add Memory Form - Replace entire card */
          <div className="h-full animate-slide-in-right">
            <AddMemoryForm
              newMemory={newMemory}
              onSave={onSaveMemory}
              onCancel={onCancelAddMemory}
              onChange={onNewMemoryChange}
            />
          </div>
        ) : (
          <>
            {/* Compact Header Section */}
            <div className="p-3 pb-2 flex-shrink-0">
              {/* Search Bar - Always visible but compact */}
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search memories..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-[#A8FF00]/50 transition-colors cursor-text text-sm"
                  />
                  <svg
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  {searchTerm && (
                    <Tooltip content="Clear search" position="left">
                      <button
                        onClick={() => onSearchChange('')}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white/80 p-1 rounded"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <line x1="18" y1="6" x2="6" y2="18"></line>
                          <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                      </button>
                    </Tooltip>
                  )}
                </div>
              </div>

              {/* Category Navigation - Scrollable */}
              <div className="overflow-hidden">
                <CategoryTabs
                  categories={categories}
                  selectedCategory={selectedCategory}
                  onCategoryChange={onCategoryChange}
                />
              </div>
            </div>

            {/* Content Area with more space */}
            <div className="flex-1 overflow-y-auto min-h-0 px-3">
              {/* Memories List */}
              <div className="space-y-3 pb-20">
                {filteredMemories.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 mx-auto mb-3 bg-white/5 rounded-full flex items-center justify-center">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="text-white/40"
                      >
                        <circle cx="12" cy="12" r="3" />
                        <path d="M12 1v6M12 17v6M4.22 4.22l4.24 4.24M15.54 15.54l4.24 4.24M1 12h6M17 12h6M4.22 19.78l4.24-4.24M15.54 8.46l4.24-4.24" />
                      </svg>
                    </div>
                    <p className="text-white/50 text-sm">
                      {memories.length === 0
                        ? "No memories saved yet"
                        : "No memories match your search"}
                    </p>
                  </div>
                ) : (
                  filteredMemories.map((memory) => (
                    <MemoryCard
                      key={memory.id}
                      memory={memory}
                      onDelete={() => onDeleteMemory(memory.id)}
                      onFindSimilar={onFindSimilar ? () => onFindSimilar(memory.id) : undefined}
                    />
                  ))
                )}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Add Button - Bottom right corner, outside memory cards */}
      {!isAddingMemory && (
        <div className="absolute bottom-4 right-4 z-10">
          <Tooltip content="Add new memory" position="top">
            <button
              onClick={onAddMemoryClick}
              className="w-14 h-14 btn-water-drop text-black font-medium flex items-center justify-center transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 shadow-2xl"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </button>
          </Tooltip>
        </div>
      )}
    </div>
  );
};

export default MemoriesTab;