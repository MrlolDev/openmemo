"use client";

import * as React from "react";
import { cn } from "./utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "subtle" | "destructive" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  appName?: string;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = "primary", 
    size = "md", 
    appName = "default",
    loading = false,
    disabled,
    children,
    icon,
    iconPosition = "left",
    onClick,
    ...props 
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (loading || disabled || !onClick) return;
      
      // Add ripple effect
      const button = e.currentTarget;
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = x + "px";
      ripple.style.top = y + "px";
      ripple.classList.add("openmemo-animate-ripple");
      ripple.style.cssText += `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        pointer-events: none;
        z-index: 10;
      `;
      
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
      
      onClick(e);
    };

    return (
      <button
        className={cn(
          // Base styles
          "relative inline-flex items-center justify-center gap-2 font-medium transition-all duration-300 ease-out overflow-hidden outline-none focus:outline-none group",
          "disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none",
          
          // Size variations
          {
            "px-3 py-1.5 text-xs rounded-lg": size === "sm",
            "px-4 py-2 text-sm rounded-xl": size === "md", 
            "px-6 py-3 text-base rounded-2xl": size === "lg",
            "px-8 py-4 text-lg rounded-3xl": size === "xl",
          },
          
          // Variant styles - Water Drop Theme
          {
            // Primary: Neon green water drop effect
            "bg-gradient-to-b from-[#A8FF00] to-[#85CC00] text-black font-semibold": variant === "primary",
            "hover:scale-105 hover:shadow-[0_8px_30px_rgba(168,255,0,0.4)] active:scale-95": variant === "primary",
            "shadow-[0_4px_20px_rgba(168,255,0,0.2)] border border-transparent": variant === "primary",
            
            // Secondary: Outlined neon green 
            "bg-transparent border-2 border-[#A8FF00] text-[#A8FF00]": variant === "secondary",
            "hover:bg-[#A8FF00] hover:text-black hover:scale-105": variant === "secondary",
            "backdrop-blur-sm shadow-[0_4px_15px_rgba(168,255,0,0.1)]": variant === "secondary",
            
            // Subtle: Glass morphism effect
            "bg-white/5 backdrop-blur-sm border border-white/10": variant === "subtle",
            "text-white/80 hover:bg-white/8 hover:text-white": variant === "subtle",
            "hover:border-white/20 hover:shadow-[0_4px_20px_rgba(255,255,255,0.1)]": variant === "subtle",
            
            // Destructive: Red variant maintaining water drop aesthetic  
            "bg-gradient-to-b from-red-500 to-red-600 text-white font-semibold": variant === "destructive",
            "hover:scale-105 hover:shadow-[0_8px_30px_rgba(239,68,68,0.4)] active:scale-95": variant === "destructive",
            "shadow-[0_4px_20px_rgba(239,68,68,0.2)]": variant === "destructive",
            
            // Ghost: Minimal transparent
            "bg-transparent text-white/70 hover:text-white": variant === "ghost",
            "hover:bg-white/5": variant === "ghost",
          },
          
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        onClick={handleClick}
        {...props}
      >
        {/* Water drop highlight effect for primary variant */}
        {variant === "primary" && (
          <div className="absolute top-[15%] left-[20%] w-[25%] h-[25%] bg-white/30 rounded-full blur-sm pointer-events-none" />
        )}
        
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        
        {/* Loading spinner */}
        {loading && (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        
        {/* Icon and content */}
        {icon && iconPosition === "left" && !loading && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        
        {children && (
          <span className={cn("relative z-10", loading && "opacity-70")}>
            {children}
          </span>
        )}
        
        {icon && iconPosition === "right" && !loading && (
          <span className="flex-shrink-0">{icon}</span>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";

// Specialized button variants
export const WaterDropButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  (props, ref) => <Button ref={ref} variant="primary" {...props} />
);

export const GhostButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  (props, ref) => <Button ref={ref} variant="ghost" {...props} />
);

export const GlassButton = React.forwardRef<HTMLButtonElement, Omit<ButtonProps, "variant">>(
  (props, ref) => <Button ref={ref} variant="subtle" {...props} />
);

export { Button };