"use client";

import * as React from "react";
import { cn } from "./utils";

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  delay?: number;
  disabled?: boolean;
  variant?: "default" | "neon" | "minimal";
  size?: "sm" | "md" | "lg";
}

const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  ({
    content,
    children,
    side = "top",
    align = "center",
    delay = 500,
    disabled = false,
    variant = "default",
    size = "md",
  }, ref) => {
    const [isVisible, setIsVisible] = React.useState(false);
    const [timeoutId, setTimeoutId] = React.useState<NodeJS.Timeout | null>(null);
    const triggerRef = React.useRef<HTMLDivElement>(null);
    const tooltipRef = React.useRef<HTMLDivElement>(null);

    const showTooltip = React.useCallback(() => {
      if (disabled) return;
      
      const id = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      setTimeoutId(id);
    }, [delay, disabled]);

    const hideTooltip = React.useCallback(() => {
      if (timeoutId) {
        clearTimeout(timeoutId);
        setTimeoutId(null);
      }
      setIsVisible(false);
    }, [timeoutId]);

    // Position calculations
    const getPositionClasses = () => {
      const positions = {
        top: {
          start: "bottom-full mb-2 left-0",
          center: "bottom-full mb-2 left-1/2 transform -translate-x-1/2",
          end: "bottom-full mb-2 right-0",
        },
        bottom: {
          start: "top-full mt-2 left-0",
          center: "top-full mt-2 left-1/2 transform -translate-x-1/2",
          end: "top-full mt-2 right-0",
        },
        left: {
          start: "right-full mr-2 top-0",
          center: "right-full mr-2 top-1/2 transform -translate-y-1/2",
          end: "right-full mr-2 bottom-0",
        },
        right: {
          start: "left-full ml-2 top-0",
          center: "left-full ml-2 top-1/2 transform -translate-y-1/2",
          end: "left-full ml-2 bottom-0",
        },
      };

      return positions[side][align];
    };

    // Arrow positioning
    const getArrowClasses = () => {
      const arrowSize = size === "sm" ? "border-4" : size === "lg" ? "border-6" : "border-5";
      
      const arrows = {
        top: {
          start: `top-full left-4 ${arrowSize} border-l-transparent border-r-transparent border-b-transparent`,
          center: `top-full left-1/2 transform -translate-x-1/2 ${arrowSize} border-l-transparent border-r-transparent border-b-transparent`,
          end: `top-full right-4 ${arrowSize} border-l-transparent border-r-transparent border-b-transparent`,
        },
        bottom: {
          start: `bottom-full left-4 ${arrowSize} border-l-transparent border-r-transparent border-t-transparent`,
          center: `bottom-full left-1/2 transform -translate-x-1/2 ${arrowSize} border-l-transparent border-r-transparent border-t-transparent`,
          end: `bottom-full right-4 ${arrowSize} border-l-transparent border-r-transparent border-t-transparent`,
        },
        left: {
          start: `left-full top-4 ${arrowSize} border-t-transparent border-b-transparent border-r-transparent`,
          center: `left-full top-1/2 transform -translate-y-1/2 ${arrowSize} border-t-transparent border-b-transparent border-r-transparent`,
          end: `left-full bottom-4 ${arrowSize} border-t-transparent border-b-transparent border-r-transparent`,
        },
        right: {
          start: `right-full top-4 ${arrowSize} border-t-transparent border-b-transparent border-l-transparent`,
          center: `right-full top-1/2 transform -translate-y-1/2 ${arrowSize} border-t-transparent border-b-transparent border-l-transparent`,
          end: `right-full bottom-4 ${arrowSize} border-t-transparent border-b-transparent border-l-transparent`,
        },
      };

      return arrows[side][align];
    };

    // Arrow border colors based on variant
    const getArrowBorderColor = () => {
      switch (variant) {
        case "neon":
          return {
            top: "border-t-[#0d0d0d]",
            bottom: "border-b-[#0d0d0d]",
            left: "border-l-[#0d0d0d]",
            right: "border-r-[#0d0d0d]",
          }[side];
        case "minimal":
          return {
            top: "border-t-white/20",
            bottom: "border-b-white/20", 
            left: "border-l-white/20",
            right: "border-r-white/20",
          }[side];
        default:
          return {
            top: "border-t-[#1a1a1a]",
            bottom: "border-b-[#1a1a1a]",
            left: "border-l-[#1a1a1a]",
            right: "border-r-[#1a1a1a]",
          }[side];
      }
    };

    React.useEffect(() => {
      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [timeoutId]);

    return (
      <div
        ref={ref}
        className="relative inline-block"
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
      >
        <div ref={triggerRef}>
          {children}
        </div>
        
        {isVisible && !disabled && (
          <div
            ref={tooltipRef}
            className={cn(
              "absolute z-50 pointer-events-none",
              getPositionClasses(),
              // Animation
              "openmemo-animate-fade-in-scale"
            )}
          >
            <div
              className={cn(
                "relative rounded-lg shadow-2xl backdrop-blur-md border font-medium whitespace-nowrap max-w-xs",
                
                // Size variations
                {
                  "px-2 py-1 text-xs": size === "sm",
                  "px-3 py-2 text-sm": size === "md",
                  "px-4 py-3 text-base": size === "lg",
                },

                // Variant styles
                {
                  // Default - glass morphism
                  "bg-[#1a1a1a]/95 border-white/10 text-white": variant === "default",
                  
                  // Neon - glowing accent
                  "bg-[#0d0d0d]/95 border-[#A8FF00]/30 text-white shadow-[0_0_20px_rgba(168,255,0,0.3)]": variant === "neon",
                  
                  // Minimal - subtle
                  "bg-white/5 border-white/20 text-white/90": variant === "minimal",
                }
              )}
            >
              {content}
              
              {/* Arrow */}
              <div
                className={cn(
                  "absolute w-0 h-0",
                  getArrowClasses(),
                  getArrowBorderColor()
                )}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
);

// Tooltip hook for programmatic usage
export const useTooltip = (content: React.ReactNode, options?: Partial<TooltipProps>) => {
  const [isVisible, setIsVisible] = React.useState(false);
  
  const show = React.useCallback(() => setIsVisible(true), []);
  const hide = React.useCallback(() => setIsVisible(false), []);
  const toggle = React.useCallback(() => setIsVisible(prev => !prev), []);

  const TooltipComponent = React.useCallback(({ children }: { children: React.ReactNode }) => (
    <Tooltip
      content={content}
      {...options}
      disabled={!isVisible}
    >
      {children}
    </Tooltip>
  ), [content, options, isVisible]);

  return {
    isVisible,
    show,
    hide,
    toggle,
    TooltipComponent,
  };
};

// Specialized tooltip variants
export const NeonTooltip = React.forwardRef<HTMLDivElement, Omit<TooltipProps, "variant">>(
  (props, ref) => <Tooltip ref={ref} variant="neon" {...props} />
);

export const MinimalTooltip = React.forwardRef<HTMLDivElement, Omit<TooltipProps, "variant">>(
  (props, ref) => <Tooltip ref={ref} variant="minimal" {...props} />
);

Tooltip.displayName = "Tooltip";
NeonTooltip.displayName = "NeonTooltip";
MinimalTooltip.displayName = "MinimalTooltip";

export { Tooltip };