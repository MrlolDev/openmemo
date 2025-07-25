/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'neon-green': '#A8FF00',
        'electric-blue': '#00D4FF',
        'neon-teal': '#00FFB3',
        'dark-bg': '#0d0d0d',
        'surface': '#1a1a1a',
        'elevated': '#262626',
      },
      fontFamily: {
        sans: ['Poppins', 'Manrope', 'Space Grotesk', 'sans-serif'],
      },
      borderRadius: {
        'xl': '24px',
      },
    },
  },
  plugins: [],
}