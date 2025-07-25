"use client";

import * as React from "react";
import { cn } from "./utils";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "glass" | "elevated" | "glow" | "minimal";
  size?: "sm" | "md" | "lg";
  animated?: boolean;
  appName?: string;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "glass", size = "md", animated = true, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base styles
          "relative overflow-hidden transition-all duration-300 ease-out group",
          
          // Size variations
          {
            "p-3 rounded-lg": size === "sm",
            "p-4 rounded-xl": size === "md",
            "p-6 rounded-2xl": size === "lg",
          },
          
          // Variant styles
          {
            // Glass morphism - default OpenMemo style
            "bg-white/5 backdrop-blur-sm border border-white/10": variant === "glass",
            "hover:bg-white/8 hover:border-white/20": variant === "glass",
            
            // Elevated with stronger glass effect
            "bg-white/8 backdrop-blur-md border border-white/15": variant === "elevated",
            "shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.4)]": variant === "elevated",
            "hover:bg-white/12 hover:border-white/25": variant === "elevated",
            
            // Glow effect with neon accent
            "bg-white/5 backdrop-blur-sm border border-[#A8FF00]/20": variant === "glow",
            "shadow-[0_4px_20px_rgba(168,255,0,0.1)] hover:shadow-[0_8px_32px_rgba(168,255,0,0.2)]": variant === "glow",
            "hover:bg-white/8 hover:border-[#A8FF00]/30": variant === "glow",
            
            // Minimal transparent
            "bg-transparent border border-white/5": variant === "minimal",
            "hover:bg-white/3 hover:border-white/10": variant === "minimal",
          },
          
          // Hover animations
          animated && "hover:scale-[1.02] hover:translate-y-[-2px]",
          
          className
        )}
        {...props}
      >
        {/* Animated background gradient */}
        {variant === "glow" && (
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-conic from-[#A8FF00]/5 via-transparent via-50% to-[#00D4FF]/5 animate-spin animation-duration-[20s]" />
          </div>
        )}
        
        {/* Shimmer effect */}
        {animated && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />
        )}
        
        {/* Content */}
        <div className="relative z-10">
          {children}
        </div>
      </div>
    );
  }
);

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-col space-y-1.5 pb-3", className)}
      {...props}
    />
  )
);

const CardTitle = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-lg font-semibold leading-none tracking-tight text-white", className)}
      {...props}
    />
  )
);

const CardDescription = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-sm text-white/70", className)}
      {...props}
    />
  )
);

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("text-white/90", className)}
      {...props}
    />
  )
);

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex items-center pt-3", className)}
      {...props}
    />
  )
);

// Specialized card variants
export const GlassCard = React.forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
  (props, ref) => <Card ref={ref} variant="glass" {...props} />
);

export const GlowCard = React.forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
  (props, ref) => <Card ref={ref} variant="glow" {...props} />
);

export const ElevatedCard = React.forwardRef<HTMLDivElement, Omit<CardProps, "variant">>(
  (props, ref) => <Card ref={ref} variant="elevated" {...props} />
);

Card.displayName = "Card";
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
};