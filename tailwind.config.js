/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tarot: {
          dark: '#0F0E0C',
          card: '#F4EBE1',
          gold: '#C5A059',
          goldDark: '#9A7B39',
          crimson: '#6B1D1D',
          border: '#3A332A'
        }
      }
    },
  },
  plugins: [],
}