/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
      serif: ['Libre Baskerville', 'serif'],
      sans: ['Inter', 'sans-serif'],
    },
    colors: {
      'luxury-bg': '#fbf7f2',
      'luxury-bg-secondary': '#f0ede6',
      'luxury-border': '#b8a085',
      'luxury-text': '#3b3b3b',
      'luxury-text-primary': '#3b3b3b',
      'luxury-text-secondary': '#666',
      'luxury-accent': '#9c7c3a',
      'luxury-accent-light': '#b8914a',
    },
    },
  },
  plugins: [],
}
