"use client";

import * as React from "react";
import { cn } from "./utils";

export interface SearchProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'results'> {
  variant?: "default" | "neon" | "minimal";
  size?: "sm" | "md" | "lg";  
  onSearchChange?: (value: string) => void;
  debounceMs?: number;
  showIcon?: boolean;
  clearable?: boolean;
  onClear?: () => void;
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({
    className,
    variant = "default",
    size = "md",
    placeholder = "Search...",
    onSearchChange,
    debounceMs = 300,
    showIcon = true,
    clearable = true,
    onClear,
    value,
    onChange,
    ...props
  }, ref) => {
    const [internalValue, setInternalValue] = React.useState(value || "");
    const debounceTimeoutRef = React.useRef<NodeJS.Timeout | undefined>(undefined);

    // Handle controlled/uncontrolled input
    const inputValue = value !== undefined ? value : internalValue;
    const hasValue = Boolean(inputValue);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      
      if (value === undefined) {
        setInternalValue(newValue);
      }
      
      onChange?.(e);
      
      if (onSearchChange && debounceMs > 0) {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
          onSearchChange(newValue);
        }, debounceMs);
      } else if (onSearchChange) {
        onSearchChange(newValue);
      }
    };

    const handleClear = () => {
      if (value === undefined) {
        setInternalValue("");
      }
      onClear?.();
      onSearchChange?.("");
    };

    React.useEffect(() => {
      return () => {
        if (debounceTimeoutRef.current) {
          clearTimeout(debounceTimeoutRef.current);
        }
      };
    }, []);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value as string);
      }
    }, [value]);

    return (
      <div className="relative">
        {/* Search Icon */}
        {showIcon && (
          <div className={cn(
            "absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none",
            {
              "w-4 h-4": size === "sm",
              "w-5 h-5": size === "md",
              "w-6 h-6": size === "lg",
            }
          )}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-full h-full"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        )}

        <input
          ref={ref}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInputChange}
          className={cn(
            "w-full bg-white/5 backdrop-blur-sm border text-white placeholder-white/50 transition-all duration-300 outline-none focus:outline-none",
            
            // Icon padding
            showIcon && {
              "pl-10": size === "sm",
              "pl-12": size === "md",
              "pl-14": size === "lg",
            },
            
            // Clear button padding
            clearable && hasValue && {
              "pr-10": size === "sm",
              "pr-12": size === "md", 
              "pr-14": size === "lg",
            },
            
            // Size variations
            {
              "px-3 py-2 text-sm rounded-lg": size === "sm",
              "px-5 py-3 text-base rounded-3xl": size === "md",
              "px-6 py-4 text-lg rounded-3xl": size === "lg",
            },

            // Variant styles
            {
              // Default - glass morphism
              "border-white/10 focus:border-white/30 focus:bg-white/10": variant === "default",
              
              // Neon - glowing accent
              "border-white/10 focus:border-[#A8FF00]/50 focus:bg-white/8 focus:shadow-[0_0_20px_rgba(168,255,0,0.3)] glow-input": variant === "neon",
              
              // Minimal - subtle
              "border-white/5 focus:border-white/20 focus:bg-white/5": variant === "minimal",
            },

            className
          )}
          {...props}
        />

        {/* Clear Button */}
        {clearable && hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className={cn(
              "absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors",
              {
                "w-4 h-4": size === "sm",
                "w-5 h-5": size === "md",
                "w-6 h-6": size === "lg",
              }
            )}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="w-full h-full"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>
    );
  }
);

// Search with results dropdown
export interface SearchWithResultsProps<T = any> extends SearchProps {
  results?: T[];
  renderResult?: (item: T, index: number) => React.ReactNode;
  onResultSelect?: (item: T) => void;
  loading?: boolean;
  maxResults?: number;
  noResultsMessage?: string;
}

export const SearchWithResults = React.forwardRef<HTMLInputElement, SearchWithResultsProps>(
  ({
    results = [],
    renderResult,
    onResultSelect,
    loading = false,
    maxResults = 10,
    noResultsMessage = "No results found",
    onSearchChange,
    ...props
  }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedIndex, setSelectedIndex] = React.useState(-1);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const displayResults = results.slice(0, maxResults);

    const handleSearchChange = (value: string) => {
      onSearchChange?.(value);
      setIsOpen(value.length > 0);
      setSelectedIndex(-1);
    };

    const handleResultSelect = (item: any) => {
      onResultSelect?.(item);
      setIsOpen(false);
      setSelectedIndex(-1);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev < displayResults.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          e.preventDefault();
          setSelectedIndex(prev => 
            prev > 0 ? prev - 1 : displayResults.length - 1
          );
          break;
        case "Enter":
          e.preventDefault();
          if (selectedIndex >= 0 && displayResults[selectedIndex]) {
            handleResultSelect(displayResults[selectedIndex]);
          }
          break;
        case "Escape":
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    // Close dropdown when clicking outside
    React.useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
        }
      };

      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
      <div ref={containerRef} className="relative">
        <Search
          ref={ref}
          onSearchChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          {...props}
        />

        {/* Results Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-[#1a1a1a]/95 backdrop-blur-md border border-white/10 rounded-xl shadow-2xl max-h-64 overflow-y-auto z-50 openmemo-scrollbar">
            {loading ? (
              <div className="p-4 text-center text-white/60">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-[#A8FF00]/20 border-t-[#A8FF00] rounded-full animate-spin" />
                  <span>Searching...</span>
                </div>
              </div>
            ) : displayResults.length > 0 ? (
              displayResults.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleResultSelect(item)}
                  className={cn(
                    "w-full p-3 text-left hover:bg-white/5 transition-colors first:rounded-t-xl last:rounded-b-xl",
                    selectedIndex === index && "bg-[#A8FF00]/10 border-l-2 border-l-[#A8FF00]"
                  )}
                >
                  {renderResult ? renderResult(item, index) : (
                    <div className="text-white/80">{String(item)}</div>
                  )}
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-white/60">
                {noResultsMessage}
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
);

// Specialized search variants
export const NeonSearch = React.forwardRef<HTMLInputElement, Omit<SearchProps, "variant">>(
  (props, ref) => <Search ref={ref} variant="neon" {...props} />
);

export const MinimalSearch = React.forwardRef<HTMLInputElement, Omit<SearchProps, "variant">>(
  (props, ref) => <Search ref={ref} variant="minimal" {...props} />
);

Search.displayName = "Search";
SearchWithResults.displayName = "SearchWithResults";
NeonSearch.displayName = "NeonSearch";
MinimalSearch.displayName = "MinimalSearch";

export { Search };