/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'normal': ['Sour Gummy', 'serif'],
      },
    },
  },
  plugins: [],
};