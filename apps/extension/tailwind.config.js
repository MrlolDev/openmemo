/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./popup.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // OpenMemo Design System Colors
        openmemo: {
          // Base Background
          'bg-primary': '#0d0d0d',
          // Primary Accent
          'primary': '#A8FF00',
          'primary-dark': '#85CC00',
          // Secondary Accents  
          'secondary-blue': '#00D4FF',
          'secondary-teal': '#00FFB3',
          // Text Colors
          'text-primary': '#FFFFFF',
          'text-secondary': '#CCCCCC', 
          'text-muted': '#888888',
          // Container Colors
          'surface': '#1a1a1a',
          'surface-elevated': '#262626',
        }
      },
      fontFamily: {
        'openmemo': ['Poppins', 'Manrope', 'Space Grotesk', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'openmemo': {
          'container': '24px',
          'button': '12px', 
          'small': '8px',
        }
      },
      boxShadow: {
        'glow-green': '0 0 20px rgba(168, 255, 0, 0.3)',
        'glow-green-sm': '0 0 10px rgba(168, 255, 0, 0.2)',
        'glow-blue': '0 0 20px rgba(0, 212, 255, 0.3)',
        'glow-blue-sm': '0 0 10px rgba(0, 212, 255, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'glow-pulse': 'glowPulse 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(168, 255, 0, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(168, 255, 0, 0.4)' },
        }
      }
    },
  },
  plugins: [],
}