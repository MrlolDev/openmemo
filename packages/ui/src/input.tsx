"use client";

import * as React from "react";
import { cn } from "./utils";

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: "default" | "glass" | "neon" | "minimal";
  size?: "sm" | "md" | "lg";
  appName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  error?: boolean;
  helperText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type = "text",
    variant = "default", 
    size = "md", 
    appName = "default",
    icon,
    iconPosition = "left",
    error = false,
    helperText,
    disabled,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    const inputClasses = cn(
      // Base styles
      "w-full font-medium transition-all duration-300 ease-out outline-none focus:outline-none placeholder:text-white/50",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      
      // Size variations
      {
        "px-3 py-2 text-sm": size === "sm",
        "px-4 py-3 text-base": size === "md",
        "px-5 py-4 text-lg": size === "lg",
      },
      
      // Icon spacing
      {
        "pl-10": icon && iconPosition === "left" && size === "sm",
        "pl-11": icon && iconPosition === "left" && size === "md", 
        "pl-12": icon && iconPosition === "left" && size === "lg",
        "pr-10": icon && iconPosition === "right" && size === "sm",
        "pr-11": icon && iconPosition === "right" && size === "md",
        "pr-12": icon && iconPosition === "right" && size === "lg",
      },
      
      // Variant styles
      {
        "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:bg-white/8 focus:border-white/20": variant === "default",
        "bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl text-white focus:bg-white/12 focus:border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.1)]": variant === "glass",
        "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:bg-white/8 focus:border-[#A8FF00]/50 focus:shadow-[0_0_20px_rgba(168,255,0,0.3)]": variant === "neon",
        "bg-transparent border-b-2 border-white/10 rounded-none text-white focus:border-[#A8FF00]/70": variant === "minimal",
      },
      
      // Error states
      {
        "border-red-500/50 focus:border-red-500/70": error,
        "focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]": error && variant === "neon",
      },
      
      className
    );

    return (
      <div className="w-full">
        <div className="relative">
          {/* Left icon */}
          {icon && iconPosition === "left" && (
            <div className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none transition-colors duration-300",
              {
                "left-3 w-4 h-4": size === "sm",
                "left-4 w-5 h-5": size === "md",
                "left-5 w-6 h-6": size === "lg",
              },
              isFocused && "text-white/80"
            )}>
              {icon}
            </div>
          )}
          
          {/* Input field */}
          <input
            ref={ref}
            type={type}
            className={inputClasses}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {/* Right icon */}
          {icon && iconPosition === "right" && (
            <div className={cn(
              "absolute right-0 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none transition-colors duration-300",
              {
                "right-3 w-4 h-4": size === "sm",
                "right-4 w-5 h-5": size === "md", 
                "right-5 w-6 h-6": size === "lg",
              },
              isFocused && "text-white/80"
            )}>
              {icon}
            </div>
          )}
          
          {/* Focus glow effect for neon variant */}
          {variant === "neon" && isFocused && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#A8FF00]/10 via-transparent to-[#A8FF00]/10 pointer-events-none animate-pulse" />
          )}
        </div>
        
        {/* Helper text */}
        {helperText && (
          <p className={cn(
            "mt-2 text-xs transition-colors duration-300",
            error ? "text-red-400" : "text-white/60"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// Textarea component with similar styling
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: "default" | "glass" | "neon" | "minimal";
  size?: "sm" | "md" | "lg";
  appName?: string;
  error?: boolean;
  helperText?: string;
  resize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ 
    className, 
    variant = "default", 
    size = "md", 
    appName = "default",
    error = false,
    helperText,
    resize = true,
    disabled,
    ...props 
  }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    
    const textareaClasses = cn(
      // Base styles
      "w-full font-medium transition-all duration-300 ease-out outline-none focus:outline-none placeholder:text-white/50",
      "disabled:opacity-50 disabled:cursor-not-allowed",
      !resize && "resize-none",
      
      // Size variations
      {
        "px-3 py-2 text-sm min-h-[80px]": size === "sm",
        "px-4 py-3 text-base min-h-[100px]": size === "md",
        "px-5 py-4 text-lg min-h-[120px]": size === "lg",
      },
      
      // Variant styles (same as Input)
      {
        "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:bg-white/8 focus:border-white/20": variant === "default",
        "bg-white/8 backdrop-blur-md border border-white/15 rounded-2xl text-white focus:bg-white/12 focus:border-white/25 shadow-[0_4px_20px_rgba(0,0,0,0.1)]": variant === "glass",
        "bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl text-white focus:bg-white/8 focus:border-[#A8FF00]/50 focus:shadow-[0_0_20px_rgba(168,255,0,0.3)]": variant === "neon",
        "bg-transparent border-2 border-white/10 rounded-xl text-white focus:border-[#A8FF00]/70": variant === "minimal",
      },
      
      // Error states
      {
        "border-red-500/50 focus:border-red-500/70": error,
        "focus:shadow-[0_0_20px_rgba(239,68,68,0.3)]": error && variant === "neon",
      },
      
      className
    );

    return (
      <div className="w-full">
        <div className="relative">
          <textarea
            ref={ref}
            className={textareaClasses}
            disabled={disabled}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            {...props}
          />
          
          {/* Focus glow effect for neon variant */}
          {variant === "neon" && isFocused && (
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#A8FF00]/10 via-transparent to-[#A8FF00]/10 pointer-events-none animate-pulse" />
          )}
        </div>
        
        {/* Helper text */}
        {helperText && (
          <p className={cn(
            "mt-2 text-xs transition-colors duration-300",
            error ? "text-red-400" : "text-white/60"
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

// Specialized input variants
export const GlassInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "variant">>(
  (props, ref) => <Input ref={ref} variant="glass" {...props} />
);

export const NeonInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "variant">>(
  (props, ref) => <Input ref={ref} variant="neon" {...props} />
);

export const MinimalInput = React.forwardRef<HTMLInputElement, Omit<InputProps, "variant">>(
  (props, ref) => <Input ref={ref} variant="minimal" {...props} />
);

Input.displayName = "Input";
Textarea.displayName = "Textarea";

export { Input, Textarea };