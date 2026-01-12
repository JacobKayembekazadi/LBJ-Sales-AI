/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Cormorant Garamond', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          forest: '#1B3022',
          sage: '#7C9082',
          stone: '#E5E1D8',
          gold: '#BFA181',
          charcoal: '#2C2C2C',
        }
      }
    }
  },
  plugins: [],
}
