"use client";

import * as React from "react";
import { cn } from "./utils";

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  options: SelectOption[];
  placeholder?: string;
  variant?: "default" | "neon" | "minimal";
  size?: "sm" | "md" | "lg";
  error?: boolean;
  helperText?: string;
  icon?: React.ReactNode;
}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({
    className,
    options,
    placeholder,
    variant = "default",
    size = "md",
    error = false,
    helperText,
    icon,
    disabled,
    ...props
  }, ref) => {
    return (
      <div className="relative">
        <div className="relative">
          {/* Icon */}
          {icon && (
            <div className={cn(
              "absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none z-10",
              {
                "w-4 h-4": size === "sm",
                "w-5 h-5": size === "md",
                "w-6 h-6": size === "lg",
              }
            )}>
              {icon}
            </div>
          )}

          <select
            ref={ref}
            disabled={disabled}
            className={cn(
              "w-full appearance-none cursor-pointer transition-all duration-300 outline-none focus:outline-none",
              "bg-white/5 backdrop-blur-sm border text-white",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              
              // Icon padding
              icon ? (size === "sm" ? "pl-10" : size === "md" ? "pl-12" : size === "lg" ? "pl-14" : "") : "",
              
              // Size variations
              {
                "px-3 py-2 text-sm rounded-lg": size === "sm",
                "px-5 py-3 text-base rounded-3xl": size === "md",
                "px-6 py-4 text-lg rounded-3xl": size === "lg",
              },

              // Variant styles
              {
                // Default - glass morphism
                "border-white/10 focus:border-white/30 focus:bg-white/10": variant === "default" && !error,
                
                // Neon - glowing accent
                "border-white/10 focus:border-[#A8FF00]/50 focus:bg-white/8 focus:shadow-[0_0_20px_rgba(168,255,0,0.3)]": variant === "neon" && !error,
                
                // Minimal - subtle
                "border-white/5 focus:border-white/20 focus:bg-white/5": variant === "minimal" && !error,
              },

              // Error state
              error && "border-red-400/50 focus:border-red-400 focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]",

              className
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled className="bg-[#1a1a1a] text-white/60">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                disabled={option.disabled}
                className="bg-[#1a1a1a] text-white disabled:text-white/40"
              >
                {option.label}
              </option>
            ))}
          </select>

          {/* Dropdown arrow */}
          <div className={cn(
            "absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 pointer-events-none",
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
              <polyline points="6,9 12,15 18,9" />
            </svg>
          </div>
        </div>

        {/* Helper text */}
        {helperText && (
          <p className={cn(
            "mt-2 text-xs",
            error ? "text-red-400" : "text-white/60"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// Specialized select variants
export const NeonSelect = React.forwardRef<HTMLSelectElement, Omit<SelectProps, "variant">>(
  (props, ref) => <Select ref={ref} variant="neon" {...props} />
);

export const MinimalSelect = React.forwardRef<HTMLSelectElement, Omit<SelectProps, "variant">>(
  (props, ref) => <Select ref={ref} variant="minimal" {...props} />
);

Select.displayName = "Select";
NeonSelect.displayName = "NeonSelect";
MinimalSelect.displayName = "MinimalSelect";

export { Select };