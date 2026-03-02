/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          50: '#faf6ed',
          100: '#f5f0e8',
          200: '#e8dcc8',
          300: '#d4b88c',
          400: '#c4a87c',
          500: '#b09050',
          600: '#8a6a3a',
          700: '#6a5020',
          800: '#4a3728',
          900: '#3a2a1a',
        },
        dark: {
          50: '#e8e4de',
          100: '#b0a898',
          200: '#8a8278',
          300: '#6a6560',
          400: '#4a4540',
          500: '#3a3530',
          600: '#2a2520',
          700: '#1a1815',
          800: '#0f0e0c',
          900: '#080808',
        },
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
