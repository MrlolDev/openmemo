"use client";

import * as React from "react";
import { cn, getRandomWaterDropShape, getStaggerDelay } from "./utils";

// Water Drop Component
export interface WaterDropProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "secondary" | "tertiary";
  animated?: boolean;
  opacity?: number;
  floating?: boolean;
  delay?: number;
}

export const WaterDrop = React.forwardRef<HTMLDivElement, WaterDropProps>(
  ({ 
    className, 
    size = "md", 
    variant = "primary", 
    animated = true,
    opacity = 0.2,
    floating = true,
    delay = 0,
    style,
    ...props 
  }, ref) => {
    const [shape, setShape] = React.useState("50% 50% 50% 50% / 60% 60% 40% 40%");
    
    React.useEffect(() => {
      if (animated) {
        const interval = setInterval(() => {
          setShape(getRandomWaterDropShape());
        }, 3000 + Math.random() * 2000);
        
        return () => clearInterval(interval);
      }
    }, [animated]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden transition-all duration-1000 ease-in-out",
          
          // Size variations
          {
            "w-8 h-10": size === "sm",
            "w-12 h-15": size === "md", 
            "w-16 h-20": size === "lg",
            "w-20 h-25": size === "xl",
          },
          
          // Color variants
          {
            "bg-gradient-radial from-[#A8FF00] to-[#85CC00]": variant === "primary",
            "bg-gradient-radial from-[#00D4FF] to-[#0099CC]": variant === "secondary", 
            "bg-gradient-radial from-[#00FFB3] to-[#00CC99]": variant === "tertiary",
          },
          
          // Animations
          floating && "openmemo-animate-floating-drop",
          
          className
        )}
        style={{
          borderRadius: shape,
          opacity,
          animationDelay: `${delay}ms`,
          ...style,
        }}
        {...props}
      >
        {/* Inner highlight */}
        <div 
          className="absolute top-[15%] left-[25%] w-[35%] h-[35%] bg-white/30 rounded-full blur-sm"
        />
      </div>
    );
  }
);

// Background Effect Component
export interface BackgroundEffectProps {
  children: React.ReactNode;
  variant?: "water" | "neon" | "minimal";
  intensity?: "low" | "medium" | "high";
  animated?: boolean;
}

export const BackgroundEffect: React.FC<BackgroundEffectProps> = ({
  children,
  variant = "water",
  intensity = "medium",
  animated = true,
}) => {
  const dropCount = {
    low: 3,
    medium: 5,
    high: 8,
  }[intensity];

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Main Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#A8FF00]/8 via-[#0d0d0d] via-40% to-[#A8FF00]/4 pointer-events-none" />

      {/* Water Drop Effects */}
      {variant === "water" && (
        <>
          {Array.from({ length: dropCount }, (_, i) => (
            <WaterDrop
              key={i}
              size={["sm", "md", "lg"][Math.floor(Math.random() * 3)] as "sm" | "md" | "lg"}
              variant={["primary", "secondary", "tertiary"][Math.floor(Math.random() * 3)] as "primary" | "secondary" | "tertiary"}
              className="absolute pointer-events-none"
              style={{
                top: `${Math.random() * 80 + 10}%`,
                left: `${Math.random() * 80 + 10}%`,
              }}
              opacity={0.1 + Math.random() * 0.15}
              delay={getStaggerDelay(i, 1000)}
              animated={animated}
            />
          ))}
        </>
      )}

      {/* Neon Light Effects */}
      {variant === "neon" && (
        <>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1 h-32 bg-gradient-to-b from-[#A8FF00]/20 to-transparent" />
          <div className="absolute top-0 left-1/3 w-0.5 h-24 bg-gradient-to-b from-[#A8FF00]/15 to-transparent" />
          <div className="absolute top-0 right-1/3 w-0.5 h-20 bg-gradient-to-b from-[#A8FF00]/10 to-transparent" />
        </>
      )}

      {/* Water Surface Effect */}
      {variant === "water" && (
        <div className="absolute bottom-0 left-0 right-0 h-24 openmemo-water-surface pointer-events-none" />
      )}

      {/* Content */}
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </div>
  );
};

// Fade In Animation Component
export interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  delay = 0,
  duration = 500,
  direction = "up",
  className,
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setTimeout(() => setIsVisible(true), delay);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [delay]);

  const getTransform = () => {
    switch (direction) {
      case "up": return "translateY(20px)";
      case "down": return "translateY(-20px)";
      case "left": return "translateX(20px)";
      case "right": return "translateX(-20px)";
      default: return "none";
    }
  };

  return (
    <div
      ref={ref}
      className={cn("transition-all ease-out", className)}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "none" : getTransform(),
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};

// Stagger Animation Container
export interface StaggerContainerProps {
  children: React.ReactNode;
  staggerDelay?: number;
  className?: string;
}

export const StaggerContainer: React.FC<StaggerContainerProps> = ({
  children,
  staggerDelay = 100,
  className,
}) => {
  return (
    <div className={className}>
      {React.Children.map(children, (child, index) => (
        <FadeIn key={index} delay={getStaggerDelay(index, staggerDelay)}>
          {child}
        </FadeIn>
      ))}
    </div>
  );
};

// Ripple Effect Hook
export const useRipple = () => {
  const createRipple = React.useCallback((event: React.MouseEvent<HTMLElement>) => {
    const element = event.currentTarget;
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement("span");
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.className = "absolute rounded-full bg-white/30 pointer-events-none openmemo-animate-ripple";
    
    element.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }, []);

  return createRipple;
};

// Scroll-triggered animation hook
export const useScrollAnimation = (threshold: number = 0.1) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const ref = React.useRef<HTMLElement>(null);

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

WaterDrop.displayName = "WaterDrop";
BackgroundEffect.displayName = "BackgroundEffect";
FadeIn.displayName = "FadeIn";
StaggerContainer.displayName = "StaggerContainer";