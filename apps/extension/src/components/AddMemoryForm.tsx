import React, { useState } from 'react';
import { FIXED_CATEGORIES, CATEGORY_INFO } from '../constants/categories';
import { apiService } from '../services/api';

interface AddMemoryFormProps {
  newMemory: { content: string; category: string };
  onSave: () => void;
  onCancel: () => void;
  onChange: (memory: { content: string; category: string }) => void;
}

const AddMemoryForm: React.FC<AddMemoryFormProps> = ({
  newMemory,
  onSave,
  onCancel,
  onChange,
}) => {
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [isAutoCategorizing, setIsAutoCategorizing] = useState(false);
  
  // Add "Let AI decide" option first, then filter out "All" from categories for adding memories
  const availableCategories = ['Let AI decide', ...FIXED_CATEGORIES.filter(cat => cat !== 'All')];
  
  const handleAutoCategorize = async () => {
    if (!newMemory.content.trim()) {
      return;
    }
    
    setIsAutoCategorizing(true);
    try {
      const result = await apiService.autoCategorizeMemory(
        newMemory.content, 
        availableCategories
      );
      
      onChange({
        ...newMemory,
        category: result.category,
      });
    } catch (error) {
      console.error('Auto-categorization failed:', error);
    } finally {
      setIsAutoCategorizing(false);
    }
  };

  return (
    <div className="h-full flex flex-col p-6 bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl relative">
      <div className="absolute inset-0 bg-gradient-to-br from-[#A8FF00]/5 to-transparent pointer-events-none" />
      <div className="relative flex flex-col h-full">
        <h3 className="font-semibold text-white mb-4">Add New Memory</h3>
        <textarea
          value={newMemory.content}
          onChange={(e) =>
            onChange({
              ...newMemory,
              content: e.target.value,
            })
          }
          placeholder="Describe your memory..."
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:border-[#A8FF00]/50 transition-all duration-300 resize-none flex-1 mb-3 min-h-32"
        />
        
        {/* Auto-categorize Button */}
        {newMemory.content.trim() && (
          <div className="mb-4 flex justify-end">
            <button
              type="button"
              onClick={handleAutoCategorize}
              disabled={isAutoCategorizing}
              className="px-3 py-1.5 text-xs bg-[#A8FF00]/20 hover:bg-[#A8FF00]/30 text-[#A8FF00] rounded-lg transition-all duration-200 cursor-pointer flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAutoCategorizing ? (
                <>
                  <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="32" />
                  </svg>
                  <span>Categorizing...</span>
                </>
              ) : (
                <>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386L9.663 17z" />
                  </svg>
                  <span>Auto-categorize with AI</span>
                </>
              )}
            </button>
          </div>
        )}
        
        {/* Custom Category Dropdown */}
        <div className="relative mb-4">
          <button
            type="button"
            onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
            className={`w-full px-4 py-4 bg-white/10 border-2 rounded-2xl text-white focus:outline-none transition-all duration-300 cursor-pointer text-left flex items-center justify-between hover:bg-white/15 hover:border-[#A8FF00]/40 shadow-lg ${
              showCategoryDropdown ? 'border-[#A8FF00]/60 bg-[#A8FF00]/10 shadow-[#A8FF00]/20' : 'border-white/20'
            } ${newMemory.category && newMemory.category !== 'Select Category' ? 'border-[#A8FF00]/40 bg-[#A8FF00]/5' : ''}`}
          >
            <div className="flex items-center gap-3">
              <div className="text-lg">
                {CATEGORY_INFO[newMemory.category]?.icon || '📋'}
              </div>
              <div>
                <div className="font-semibold text-base">
                  {newMemory.category || 'Select Category'}
                </div>
                {newMemory.category && newMemory.category !== 'Select Category' && (
                  <div className="text-sm text-white/70 mt-1">
                    {CATEGORY_INFO[newMemory.category]?.description}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {newMemory.category && newMemory.category !== 'Select Category' && (
                <div className="px-3 py-1.5 bg-[#A8FF00]/25 text-[#A8FF00] text-sm font-medium rounded-lg">
                  Selected
                </div>
              )}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform duration-300 ${showCategoryDropdown ? 'rotate-180' : ''}`}
              >
                <path d="m6 9 6 6 6-6" />
              </svg>
            </div>
          </button>
          
          {showCategoryDropdown && (
            <div className="category-dropdown absolute bottom-full left-0 right-0 mb-3 bg-gradient-to-br from-[#1a1a1a] via-[#1a1a1a] to-[#0d0d0d] border border-[#A8FF00]/30 rounded-2xl shadow-2xl shadow-[#A8FF00]/20 z-50 max-h-96 overflow-y-auto animate-fade-in-scale backdrop-blur-md">
              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#A8FF00]/5 to-transparent rounded-2xl pointer-events-none"></div>
              <div className="relative p-3">
                {/* AI Decide Option - Featured at top */}
                <button
                  type="button"
                  onClick={() => {
                    onChange({
                      ...newMemory,
                      category: 'Let AI decide',
                    });
                    setShowCategoryDropdown(false);
                  }}
                  className={`w-full p-4 mb-4 text-left hover:bg-[#A8FF00]/15 hover:border-[#A8FF00]/40 transition-all duration-300 flex items-center gap-3 text-white/90 hover:text-white cursor-pointer rounded-xl border-2 bg-white/10 hover:scale-[1.02] active:scale-[0.98] group shadow-lg ${
                    newMemory.category === 'Let AI decide' ? 'bg-[#A8FF00]/25 border-[#A8FF00]/60 text-[#A8FF00] shadow-[#A8FF00]/20' : 'border-white/20'
                  }`}
                >
                  <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                    🤖
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-base mb-1">Let AI decide</div>
                    <div className="text-sm text-white/60 group-hover:text-white/80 transition-colors">
                      AI will automatically categorize this memory
                    </div>
                  </div>
                  {newMemory.category === 'Let AI decide' && (
                    <div className="px-3 py-1.5 bg-[#A8FF00]/30 text-[#A8FF00] text-sm font-medium rounded-lg shadow-lg">
                      Selected
                    </div>
                  )}
                </button>
                
                {/* Separator */}
                <div className="border-t border-white/15 mb-4 mx-1"></div>
                
                {/* Regular Categories Grid */}
                <div className="grid grid-cols-2 gap-3">
                  {availableCategories.filter(cat => cat !== 'Let AI decide').map((category) => (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        onChange({
                          ...newMemory,
                          category,
                        });
                        setShowCategoryDropdown(false);
                      }}
                      className={`p-3 text-left hover:bg-[#A8FF00]/15 hover:border-[#A8FF00]/40 transition-all duration-300 flex flex-col items-center gap-2 text-white/90 hover:text-white cursor-pointer rounded-xl border-2 bg-white/10 hover:scale-105 active:scale-95 group shadow-md ${
                        newMemory.category === category ? 'bg-[#A8FF00]/25 border-[#A8FF00]/60 text-[#A8FF00] shadow-[#A8FF00]/20' : 'border-white/20'
                      }`}
                    >
                      <div className="text-2xl group-hover:scale-110 transition-transform duration-200">
                        {CATEGORY_INFO[category]?.icon || '📋'}
                      </div>
                      <div className="text-center">
                        <div className="font-semibold text-xs leading-tight mb-1">{category}</div>
                        <div className="text-xs text-white/60 group-hover:text-white/80 transition-colors leading-tight">
                          {CATEGORY_INFO[category]?.description.split(' ').slice(0, 3).join(' ')}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                
                {/* Footer with tip */}
                <div className="mt-3 pt-3 border-t border-white/10">
                  <div className="text-center text-xs text-white/40 flex items-center justify-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636-.707.707M21 12h-1M4 12H3m3.343-5.657-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386L9.663 17z" />
                    </svg>
                    <span>Try auto-categorize for AI-powered selection</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Click outside to close dropdown */}
          {showCategoryDropdown && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowCategoryDropdown(false)}
            />
          )}
        </div>
        
        {/* Action Buttons at Bottom */}
        <div className="flex gap-3 mt-4">
          <button
            onClick={onSave}
            className="flex-1 px-4 py-3 bg-gradient-to-r from-[#A8FF00] to-[#85CC00] text-black font-semibold rounded-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
          >
            Save Memory
          </button>
          <button
            onClick={onCancel}
            className="px-6 py-3 bg-white/10 text-white/80 font-medium rounded-2xl transition-all duration-300 hover:bg-white/20 active:scale-95 cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMemoryForm;