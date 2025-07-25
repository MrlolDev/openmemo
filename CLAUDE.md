# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OpenMemo is a ChatGPT memory integration tool with two main applications:
- **Web app** (`apps/web`): Next.js application with React 19 and Turbopack
- **Extension** (`apps/extension`): Vite-based React application for browser extension

This is a Turborepo monorepo using Bun as the package manager.

## Development Commands

### Root Level (affects all apps)
- `bun dev` - Start development servers for all apps
- `bun build` - Build all apps for production
- `bun lint` - Run ESLint across all apps
- `bun check-types` - Run TypeScript type checking across all apps
- `bun format` - Format code with Prettier

### Extension App (`apps/extension`)
- `cd apps/extension && bun dev` - Start Vite dev server
- `cd apps/extension && bun build` - Build extension (runs `tsc -b && vite build`)
- `cd apps/extension && bun lint` - Run ESLint
- `cd apps/extension && bun preview` - Preview production build

### API App (`apps/api`)
- `cd apps/api && bun dev` - Start Express development server with hot reload
- `cd apps/api && bun build` - Build TypeScript to JavaScript
- `cd apps/api && bun start` - Start production server
- `cd apps/api && bun db:generate` - Generate Prisma client
- `cd apps/api && bun db:push` - Push schema to database
- `cd apps/api && bun db:studio` - Open Prisma Studio

### Web App (`apps/web`)
- `cd apps/web && bun dev` - Start Next.js dev server with Turbopack on port 3000
- `cd apps/web && bun build` - Build Next.js app
- `cd apps/web && bun start` - Start production server
- `cd apps/web && bun lint` - Run Next.js linting with zero warnings tolerance
- `cd apps/web && bun check-types` - Run TypeScript checking without emitting

## Architecture

### Monorepo Structure
- **apps/**: Contains the main applications (web and extension)
- **packages/**: Shared packages and configurations
  - `packages/ui/`: Shared React components library
  - `packages/eslint-config/`: ESLint configurations (base, Next.js, React)
  - `packages/typescript-config/`: TypeScript configurations (base, Next.js, React library)

### Tech Stack
- **Build System**: Turborepo for monorepo management, Bun as package manager
- **Web App**: Next.js 15 with React 19, TypeScript, Turbopack for fast dev builds
- **Extension**: Vite with React 19, TypeScript, SWC for fast compilation
- **API**: Express.js with Prisma ORM, SQLite database, GitHub OAuth, Groq AI integration
- **Shared UI**: Custom component library with "use client" directives for Next.js compatibility
- **Linting**: ESLint 9 with TypeScript integration, zero warnings policy for production

### Key Patterns
- All packages use TypeScript with strict configurations
- Shared UI components require an `appName` prop for contextual behavior
- Extension uses standard Vite React template structure
- Web app follows Next.js app router conventions
- Both apps target React 19 with modern patterns

## Design System

OpenMemo follows a sleek, dark aesthetic that mirrors the logo's black backdrop and vibrant neon droplet. The interface creates a futuristic, high-tech feeling while maintaining usability.

### Color Palette
- **Base Background**: Matte black (#0d0d0d) - Primary background color
- **Primary Accent**: Neon lime green (#A8FF00) - Key actions, highlights, interactive states
- **Secondary Accents**: Electric blue (#00D4FF), Teal (#00FFB3) - Supporting colors for variety
- **Text Colors**: 
  - Primary text: #FFFFFF (white)
  - Secondary text: #CCCCCC (light gray)
  - Muted text: #888888 (medium gray)
- **Container Colors**:
  - Surface: #1a1a1a (dark gray)
  - Elevated surface: #262626 (medium dark gray)
  - Border: rgba(168, 255, 0, 0.2) (neon green with opacity)

### Typography
- **Font Family**: Poppins, Manrope, or Space Grotesk (rounded sans-serif)
- **Weights**: Medium (500) to Bold (700) for clarity and energy
- **Sizes**: 
  - Headings: 24px, 20px, 18px
  - Body: 14px, 16px
  - Small: 12px
  - Button text: 14px medium/bold

### UI Elements
- **Border Radius**: 24px for containers, 12px for buttons, 8px for small elements
- **Shadows**: Soft glows using neon colors with blur
- **Button States**:
  - Default: Solid neon accent with subtle glow
  - Hover: Increased glow intensity
  - Active: Slight scale transform (0.98)
- **Containers**: Glass-morphism style with luminous borders and subtle blur backdrop

### Animations
- **Micro-interactions**: Smooth 200-300ms transitions
- **Button effects**: Ripple effects on taps, glowing hover states
- **Loading states**: Lightning flash effects or pulsing neon
- **Page transitions**: Fluid slide/fade combinations
- **Hover effects**: Scale transforms, glow intensity changes

### Implementation Notes
- Use CSS custom properties for consistent color theming
- Implement smooth animations with CSS transitions or Framer Motion
- Apply backdrop-filter: blur() for glass effects
- Use box-shadow with neon colors for glowing elements
- Ensure high contrast ratios for accessibility while maintaining the dark aesthetic

## Shared UI Package

The `@repo/ui` package provides a complete design system used by both web and extension apps:

### Available Components
- **Button** (5 variants): WaterDropButton, GhostButton, GlassButton, etc.
- **Card** (4 variants): GlassCard, GlowCard, ElevatedCard, MinimalCard
- **Input/Textarea** (3 variants): NeonInput, GlassInput, MinimalInput
- **Select/Dropdown**: Styled dropdowns with neon focus and icon support
- **Search**: Debounced search with autocomplete and clear functionality
- **Loading** (4 variants): LoadingScreen, SpinnerLoading, DotsLoading, etc.
- **Tabs** (4 variants): PillTabs, UnderlineTabs, ButtonTabs
- **Tooltip** (3 variants): NeonTooltip, MinimalTooltip with positioning
- **Modal** (4 variants): NeonModal, GlassModal with hooks (useModal, useConfirmModal)
- **Animations**: WaterDrop, BackgroundEffect, FadeIn, StaggerContainer

### Usage
All components follow TypeScript patterns with proper prop interfaces, support both controlled/uncontrolled usage, and implement the OpenMemo design system consistently across web and extension applications.