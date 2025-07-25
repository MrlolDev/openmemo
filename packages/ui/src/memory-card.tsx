"use client";

import React from "react";
import { Tooltip } from "./tooltip";

export interface Memory {
  id: string;
  content: string;
  category: string;
  source?: string;
  tags: string[] | string;
  createdAt: string;
  updatedAt?: string;
}

interface MemoryCardProps {
  memory: Memory;
  onDelete?: () => void;
  onFindSimilar?: () => void;
  appName: "web" | "extension";
  maxContentLength?: number;
}

// Helper functions for memory handling
function getMemoryTagsArray(tags: string | string[]): string[] {
  if (Array.isArray(tags)) {
    return tags.filter(tag => tag.trim().length > 0);
  }
  if (typeof tags === 'string' && tags.trim()) {
    return tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
  }
  return [];
}

function hasMemoryTags(tags: string | string[]): boolean {
  return getMemoryTagsArray(tags).length > 0;
}

export function MemoryCard({ 
  memory, 
  onDelete, 
  onFindSimilar, 
  appName,
  maxContentLength = 100 
}: MemoryCardProps) {
  const isLongContent = memory.content.length > maxContentLength;
  const displayContent = isLongContent 
    ? `${memory.content.substring(0, maxContentLength)}...` 
    : memory.content;

  return (
    <div className="group relative p-3 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg transition-all duration-300 hover:bg-white/8 hover:border-[#A8FF00]/30 animate-fade-in">
      <div className="absolute inset-0 bg-gradient-to-br from-[#A8FF00]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />

      <div className="relative">
        {/* Header with category and actions */}
        <div className="flex justify-between items-center mb-2">
          <Tooltip content={`Category: ${memory.category}`} side="top">
            <span className="px-2 py-0.5 bg-[#A8FF00]/20 text-[#A8FF00] text-xs font-medium rounded-md cursor-help">
              {memory.category}
            </span>
          </Tooltip>
          
          {/* Actions - only show if handlers are provided */}
          {(onDelete || onFindSimilar) && (
            <div className="flex items-center gap-0.5">
              {onFindSimilar && (
                <Tooltip content="Find similar memories" side="left">
                  <button
                    onClick={onFindSimilar}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#A8FF00] hover:text-[#A8FF00]/80 transition-all duration-200 rounded hover:bg-[#A8FF00]/10"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </button>
                </Tooltip>
              )}
              {onDelete && (
                <Tooltip content="Delete this memory" side="left">
                  <button
                    onClick={onDelete}
                    className="opacity-0 group-hover:opacity-100 p-1 text-red-400 hover:text-red-300 transition-all duration-200 rounded hover:bg-red-400/10"
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3,6 5,6 21,6" />
                      <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6M8,6V4a2,2,0,0,1 2-2h4a2,2,0,0,1,2,2V6" />
                    </svg>
                  </button>
                </Tooltip>
              )}
            </div>
          )}
        </div>

        {/* Content - Limited length with ellipsis */}
        <Tooltip 
          content={isLongContent ? memory.content : ''} 
          side="top"
          disabled={!isLongContent}
        >
          <p className="text-white/90 text-sm leading-snug mb-2 cursor-help">
            {displayContent}
          </p>
        </Tooltip>

        {/* Footer - date and tags if available */}
        <div className="flex justify-between items-center">
          <Tooltip 
            content={`Created: ${new Date(memory.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}`} 
            side="bottom"
          >
            <div className="text-xs text-white/40 cursor-help">
              {memory.source && appName === "web" && (
                <span className="text-[#A8FF00]/60 mr-2">
                  {memory.source} •
                </span>
              )}
              {new Date(memory.createdAt).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
          </Tooltip>
          
          {hasMemoryTags(memory.tags) && (
            <div className="flex gap-1">
              {getMemoryTagsArray(memory.tags).slice(0, 1).map((tag, index) => (
                <Tooltip key={index} content={`Tag: ${tag}`} side="bottom">
                  <span className="px-1.5 py-0.5 bg-white/10 text-white/50 text-xs rounded cursor-help">
                    {tag.length > 8 ? `${tag.substring(0, 8)}...` : tag}
                  </span>
                </Tooltip>
              ))}
              {getMemoryTagsArray(memory.tags).length > 1 && (
                <Tooltip 
                  content={`All tags: ${getMemoryTagsArray(memory.tags).join(', ')}`} 
                  side="bottom"
                >
                  <span className="px-1.5 py-0.5 bg-white/5 text-white/40 text-xs rounded cursor-help">
                    +{getMemoryTagsArray(memory.tags).length - 1}
                  </span>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper functions export for use in other components
export { getMemoryTagsArray, hasMemoryTags };