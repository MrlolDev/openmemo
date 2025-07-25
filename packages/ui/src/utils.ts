// Type definition for className values
type ClassValue = string | number | boolean | undefined | null | { [key: string]: any } | ClassValue[];

// Lightweight cn utility for className merging
export function cn(...inputs: ClassValue[]): string {
  const flatten = (input: ClassValue): string[] => {
    if (Array.isArray(input)) {
      return input.flatMap(flatten);
    }
    if (typeof input === 'object' && input !== null) {
      return Object.entries(input)
        .filter(([, value]) => Boolean(value))
        .map(([key]) => key);
    }
    return input ? [String(input)] : [];
  };

  return inputs
    .flatMap(flatten)
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

// Animation delay utilities
export function getStaggerDelay(index: number, baseDelay: number = 100): number {
  return index * baseDelay;
}

// Water drop shape utilities
export function getRandomWaterDropShape(): string {
  const shapes = [
    "50% 50% 50% 50% / 60% 60% 40% 40%",
    "45% 55% 52% 48% / 58% 62% 38% 42%", 
    "52% 48% 55% 45% / 62% 58% 42% 38%",
    "48% 52% 48% 52% / 58% 62% 42% 38%",
    "55% 45% 50% 50% / 65% 55% 45% 35%"
  ];
  const randomIndex = Math.floor(Math.random() * shapes.length);
  return shapes[randomIndex] || "50% 50% 50% 50% / 60% 60% 40% 40%";
}

// Color utilities for theming
export const colors = {
  primary: {
    main: "#A8FF00",
    dark: "#85CC00", 
    light: "#BFFF33"
  },
  secondary: {
    blue: "#00D4FF",
    teal: "#00FFB3"
  },
  surface: {
    primary: "#0d0d0d",
    elevated: "#1a1a1a",
    high: "#262626"
  },
  text: {
    primary: "#FFFFFF",
    secondary: "#CCCCCC", 
    muted: "#888888"
  }
} as const;

// Generate CSS custom properties
export function generateCSSVariables(prefix: string = "--openmemo"): Record<string, string> {
  return {
    [`${prefix}-primary`]: colors.primary.main,
    [`${prefix}-primary-dark`]: colors.primary.dark,
    [`${prefix}-primary-light`]: colors.primary.light,
    [`${prefix}-secondary-blue`]: colors.secondary.blue,
    [`${prefix}-secondary-teal`]: colors.secondary.teal,
    [`${prefix}-bg-primary`]: colors.surface.primary,
    [`${prefix}-bg-elevated`]: colors.surface.elevated,
    [`${prefix}-bg-high`]: colors.surface.high,
    [`${prefix}-text-primary`]: colors.text.primary,
    [`${prefix}-text-secondary`]: colors.text.secondary,
    [`${prefix}-text-muted`]: colors.text.muted
  };
}

// Debounce utility for performance
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// Format utilities
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K"; 
  }
  return num.toString();
}