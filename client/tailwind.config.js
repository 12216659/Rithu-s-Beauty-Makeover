/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brandBlack: '#0d0d0d',
        brandRoseGold: '#d4a373',
        brandSoftGold: '#f5d7b2',
        brandPink: '#FA2A74',
        brandLightPink: '#FFF0F5',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
