"use client";

import * as React from "react";
import { cn } from "./utils";

export interface LoadingProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "spinner" | "dots" | "pulse" | "bars";
  color?: "primary" | "white" | "muted";
  message?: string;
  submessage?: string;
}

const Loading = React.forwardRef<HTMLDivElement, LoadingProps>(
  ({
    className,
    size = "md",
    variant = "spinner",
    color = "primary",
    message,
    submessage,
    ...props
  }, ref) => {
    const renderSpinner = () => (
      <div className="relative">
        {/* Outer rotating ring */}
        <div className={cn(
          "border-4 border-t-transparent rounded-full animate-spin",
          {
            "w-8 h-8": size === "sm",
            "w-16 h-16": size === "md",
            "w-24 h-24": size === "lg",
            "w-32 h-32": size === "xl",
          },
          {
            "border-[#A8FF00]/20 border-t-[#A8FF00]": color === "primary",
            "border-white/20 border-t-white": color === "white",
            "border-white/10 border-t-white/40": color === "muted",
          }
        )} />
        
        {/* Inner pulsing dot */}
        <div className={cn(
          "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full opacity-80 animate-pulse",
          {
            "w-3 h-3": size === "sm",
            "w-6 h-6": size === "md",
            "w-9 h-9": size === "lg",
            "w-12 h-12": size === "xl",
          },
          {
            "bg-[#A8FF00]": color === "primary",
            "bg-white": color === "white",
            "bg-white/40": color === "muted",
          }
        )} />
        
        {/* Glow effect */}
        {color === "primary" && (
          <div className={cn(
            "absolute inset-0 rounded-full animate-pulse opacity-20",
            {
              "w-8 h-8": size === "sm",
              "w-16 h-16": size === "md",
              "w-24 h-24": size === "lg",
              "w-32 h-32": size === "xl",
            }
          )}
          style={{ 
            background: "radial-gradient(circle, rgba(168,255,0,0.3) 0%, transparent 70%)",
            filter: "blur(8px)"
          }} />
        )}
      </div>
    );

    const renderDots = () => (
      <div className="flex items-center space-x-1">
        {[0, 1, 2].map((index) => (
          <div
            key={index}
            className={cn(
              "rounded-full animate-bounce",
              {
                "w-2 h-2": size === "sm",
                "w-3 h-3": size === "md",
                "w-4 h-4": size === "lg",
                "w-5 h-5": size === "xl",
              },
              {
                "bg-[#A8FF00]/60": color === "primary",
                "bg-white/60": color === "white",
                "bg-white/30": color === "muted",
              }
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          />
        ))}
      </div>
    );

    const renderPulse = () => (
      <div className={cn(
        "rounded-full animate-pulse",
        {
          "w-8 h-8": size === "sm",
          "w-16 h-16": size === "md",
          "w-24 h-24": size === "lg",
          "w-32 h-32": size === "xl",
        },
        {
          "bg-[#A8FF00]/60": color === "primary",
          "bg-white/60": color === "white",
          "bg-white/30": color === "muted",
        }
      )} />
    );

    const renderBars = () => (
      <div className="flex items-end space-x-1">
        {[0, 1, 2, 3].map((index) => (
          <div
            key={index}
            className={cn(
              "animate-pulse rounded-sm",
              {
                "w-1": size === "sm",
                "w-2": size === "md",
                "w-3": size === "lg",
                "w-4": size === "xl",
              },
              {
                "bg-[#A8FF00]/60": color === "primary",
                "bg-white/60": color === "white",
                "bg-white/30": color === "muted",
              }
            )}
            style={{
              height: `${12 + index * 4}px`,
              animationDelay: `${index * 0.1}s`,
              animationDuration: "1s"
            }}
          />
        ))}
      </div>
    );

    const renderLoading = () => {
      switch (variant) {
        case "dots":
          return renderDots();
        case "pulse":
          return renderPulse();
        case "bars":
          return renderBars();
        default:
          return renderSpinner();
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center text-center",
          className
        )}
        {...props}
      >
        <div className="mb-4">
          {renderLoading()}
        </div>

        {/* Messages */}
        {message && (
          <div className={cn(
            "font-semibold animate-pulse mb-2",
            {
              "text-sm": size === "sm",
              "text-lg": size === "md",
              "text-xl": size === "lg",
              "text-2xl": size === "xl",
            },
            {
              "text-[#A8FF00]": color === "primary",
              "text-white": color === "white",
              "text-white/70": color === "muted",
            }
          )}>
            {message}
          </div>
        )}

        {submessage && (
          <div className={cn(
            "max-w-xs leading-relaxed",
            {
              "text-xs": size === "sm",
              "text-sm": size === "md",
              "text-base": size === "lg",
              "text-lg": size === "xl",
            },
            {
              "text-white/70": color === "primary" || color === "white",
              "text-white/50": color === "muted",
            }
          )}>
            {submessage}
          </div>
        )}
      </div>
    );
  }
);

// Loading Screen Component (full screen loading with background)
export interface LoadingScreenProps extends LoadingProps {
  fullScreen?: boolean;
  background?: boolean;
}

export const LoadingScreen = React.forwardRef<HTMLDivElement, LoadingScreenProps>(
  ({
    className,
    fullScreen = true,
    background = true,
    message = "Loading memories...",
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center",
          fullScreen && "w-full h-full min-h-screen",
          background && "bg-[#0d0d0d] relative overflow-hidden",
          className
        )}
      >
        {/* Enhanced Background matching main app */}
        {background && (
          <div className="absolute inset-0">
            {/* Main Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#A8FF00]/8 via-[#0d0d0d] via-40% to-[#A8FF00]/4 pointer-events-none" />

            {/* Strategic Water Drop Placement */}
            <div className="absolute top-12 right-16 w-14 h-18 water-drop-primary opacity-20 floating-drop" />
            <div
              className="absolute top-48 left-8 w-10 h-13 water-drop-primary opacity-15 floating-drop"
              style={{ animationDelay: "2s" }}
            />
            <div
              className="absolute bottom-20 right-12 w-16 h-20 water-drop-primary opacity-25 floating-drop"
              style={{ animationDelay: "4s" }}
            />

            {/* Subtle Light Rays */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-[#A8FF00]/20 to-transparent" />

            {/* Water surface effect at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-24 water-surface pointer-events-none" />
          </div>
        )}

        <div className="relative z-10 p-6">
          <Loading
            message={message}
            size="lg"
            variant="spinner"
            color="primary"
            {...props}
          />
        </div>
      </div>
    );
  }
);

// Specialized loading variants
export const SpinnerLoading = React.forwardRef<HTMLDivElement, Omit<LoadingProps, "variant">>(
  (props, ref) => <Loading ref={ref} variant="spinner" {...props} />
);

export const DotsLoading = React.forwardRef<HTMLDivElement, Omit<LoadingProps, "variant">>(
  (props, ref) => <Loading ref={ref} variant="dots" {...props} />
);

export const PulseLoading = React.forwardRef<HTMLDivElement, Omit<LoadingProps, "variant">>(
  (props, ref) => <Loading ref={ref} variant="pulse" {...props} />
);

export const BarsLoading = React.forwardRef<HTMLDivElement, Omit<LoadingProps, "variant">>(
  (props, ref) => <Loading ref={ref} variant="bars" {...props} />
);

Loading.displayName = "Loading";
LoadingScreen.displayName = "LoadingScreen";
SpinnerLoading.displayName = "SpinnerLoading";
DotsLoading.displayName = "DotsLoading";
PulseLoading.displayName = "PulseLoading";
BarsLoading.displayName = "BarsLoading";

export { Loading };