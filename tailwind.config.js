/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        eco: {
          50: '#eefcf5',
          100: '#d5f6e6',
          500: '#22c55e',
          700: '#15803d'
        }
      }
    }
  },
  plugins: [],
};
