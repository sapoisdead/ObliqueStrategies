/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        occult: {
          bg: '#0A0908',
          card: '#12100E',
          parchment: '#1C1815',
          gold: '#C5A059',
          crimson: '#7A1C1C',
          border: '#3D3226'
        }
      }
    },
  },
  plugins: [],
}