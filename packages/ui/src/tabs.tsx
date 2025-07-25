"use client";

import * as React from "react";
import { cn } from "./utils";

export interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  badge?: string | number;
}

export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TabItem[];
  value: string;
  onValueChange: (value: string) => void;
  variant?: "default" | "pills" | "underline" | "buttons";
  size?: "sm" | "md" | "lg";
  orientation?: "horizontal" | "vertical";
  animated?: boolean;
  fullWidth?: boolean;
}

const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  ({
    className,
    items,
    value,
    onValueChange,
    variant = "default",
    size = "md",
    orientation = "horizontal",
    animated = true,
    fullWidth = false,
    ...props
  }, ref) => {
    const [indicatorStyle, setIndicatorStyle] = React.useState<React.CSSProperties>({});
    const tabsRef = React.useRef<HTMLDivElement>(null);

    // Update indicator position when active tab changes
    React.useEffect(() => {
      if (!animated || variant === "buttons") return;

      const activeTab = tabsRef.current?.querySelector(`[data-value="${value}"]`) as HTMLElement;
      if (activeTab && tabsRef.current) {
        const tabsRect = tabsRef.current.getBoundingClientRect();
        const activeRect = activeTab.getBoundingClientRect();

        if (orientation === "horizontal") {
          setIndicatorStyle({
            left: activeRect.left - tabsRect.left,
            width: activeRect.width,
            height: variant === "underline" ? 2 : activeRect.height,
            top: variant === "underline" ? "auto" : activeRect.top - tabsRect.top,
            bottom: variant === "underline" ? 0 : "auto",
          });
        } else {
          setIndicatorStyle({
            top: activeRect.top - tabsRect.top,
            height: activeRect.height,
            width: variant === "underline" ? 2 : activeRect.width,
            left: variant === "underline" ? 0 : activeRect.left - tabsRect.left,
            right: variant === "underline" ? "auto" : "auto",
          });
        }
      }
    }, [value, animated, variant, orientation]);

    return (
      <div
        ref={ref}
        className={cn("relative", className)}
        {...props}
      >
        <div
          ref={tabsRef}
          className={cn(
            "relative flex",
            {
              "flex-col": orientation === "vertical",
              "flex-row": orientation === "horizontal",
              "overflow-x-auto overflow-y-hidden": orientation === "horizontal",
              "overflow-y-auto overflow-x-hidden": orientation === "vertical",
            }
          )}
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {/* Animated indicator */}
          {animated && variant !== "buttons" && (
            <div
              className={cn(
                "absolute transition-all duration-300 ease-out pointer-events-none z-10",
                {
                  "bg-gradient-to-r from-[#A8FF00] to-[#85CC00] rounded-full": variant === "pills",
                  "bg-[#A8FF00]": variant === "underline",
                  "bg-white/5 backdrop-blur-sm border border-white/20 rounded-lg": variant === "default",
                }
              )}
              style={indicatorStyle}
            />
          )}

          {items.map((item) => {
            const isActive = value === item.value;
            
            return (
              <button
                key={item.value}
                data-value={item.value}
                onClick={() => !item.disabled && onValueChange(item.value)}
                disabled={item.disabled}
                className={cn(
                  "relative z-20 flex items-center gap-2 transition-all duration-300 ease-out font-medium outline-none focus:outline-none",
                  "disabled:opacity-50 disabled:cursor-not-allowed",
                  
                  // Size variations
                  {
                    "px-2 py-1 text-xs": size === "sm",
                    "px-3 py-2 text-sm": size === "md",
                    "px-4 py-3 text-base": size === "lg",
                  },

                  // Full width
                  fullWidth && "flex-1",

                  // Variant styles
                  {
                    // Default - glass morphism tabs
                    "text-white/70 hover:text-white hover:bg-white/5": variant === "default" && !isActive,
                    "text-white bg-transparent": variant === "default" && isActive,
                    "rounded-lg": variant === "default",

                    // Pills - rounded background
                    "text-white/70 hover:text-white hover:bg-white/10": variant === "pills" && !isActive,
                    "text-black font-semibold": variant === "pills" && isActive,
                    "rounded-full": variant === "pills",

                    // Underline - minimal with bottom border
                    "text-white/70 hover:text-white border-b-2 border-transparent": variant === "underline" && !isActive,
                    "text-white border-b-2 border-[#A8FF00]": variant === "underline" && isActive,
                    "pb-2": variant === "underline",

                    // Buttons - separate button style
                    "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10": variant === "buttons" && !isActive,
                    "bg-gradient-to-r from-[#A8FF00] to-[#85CC00] text-black font-semibold border border-transparent": variant === "buttons" && isActive,
                    "rounded-xl": variant === "buttons",
                    "hover:scale-105 active:scale-95": variant === "buttons",
                  },

                  // Hover effects (except for buttons which have their own)
                  variant !== "buttons" && "hover:scale-105 active:scale-95",

                  // Spacing
                  orientation === "horizontal" && "flex-shrink-0",
                  orientation === "vertical" && "w-full justify-start"
                )}
              >
                {/* Icon */}
                {item.icon && (
                  <span className="flex-shrink-0">
                    {item.icon}
                  </span>
                )}

                {/* Label */}
                <span className="whitespace-nowrap">
                  {item.label}
                </span>

                {/* Badge */}
                {item.badge && (
                  <span className={cn(
                    "ml-1 px-1.5 py-0.5 text-xs rounded-full",
                    {
                      "bg-[#A8FF00]/20 text-[#A8FF00]": !isActive,
                      "bg-black/20 text-black": isActive && (variant === "pills" || variant === "buttons"),
                      "bg-[#A8FF00] text-black": isActive && variant !== "pills" && variant !== "buttons",
                    }
                  )}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    );
  }
);

// Specialized tab variants
export const PillTabs = React.forwardRef<HTMLDivElement, Omit<TabsProps, "variant">>(
  (props, ref) => <Tabs ref={ref} variant="pills" {...props} />
);

export const UnderlineTabs = React.forwardRef<HTMLDivElement, Omit<TabsProps, "variant">>(
  (props, ref) => <Tabs ref={ref} variant="underline" {...props} />
);

export const ButtonTabs = React.forwardRef<HTMLDivElement, Omit<TabsProps, "variant">>(
  (props, ref) => <Tabs ref={ref} variant="buttons" {...props} />
);

Tabs.displayName = "Tabs";
PillTabs.displayName = "PillTabs";
UnderlineTabs.displayName = "UnderlineTabs";
ButtonTabs.displayName = "ButtonTabs";

export { Tabs };