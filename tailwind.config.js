/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        sanctum: {
          bg: '#0A0908',
          card: '#F4EBE1',
          dark: '#1A1815',
          gold: '#C5A059',
          border: '#3D3226'
        }
      }
    },
  },
  plugins: [],
}