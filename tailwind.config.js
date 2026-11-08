/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deck: {
          bg: '#121110',
          felt: '#1A1816',
          card: '#EBE6DF',
          cardDark: '#22201D',
          gold: '#C5A059'
        }
      }
    },
  },
  plugins: [],
}