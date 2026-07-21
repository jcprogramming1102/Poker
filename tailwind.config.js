/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'emerald-dark': '#052e1e',
        'emerald': '#065f46',
        'gold': '#d4af37',
        'gold-light': '#f4d03f',
      },
      fontFamily: {
        'serif': ['"Playfair Display"', 'serif'],
        'sans': ['"Noto Sans TC"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
