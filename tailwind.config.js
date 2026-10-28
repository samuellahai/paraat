/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fff4ec',
          100: '#ffe5cc',
          200: '#ffca99',
          300: '#ffaa66',
          400: '#ff8433',
          500: '#E05C00',
          600: '#b84d00',
          700: '#913c00',
          800: '#6b2c00',
          900: '#4a1d00',
        },
      },
    },
  },
  plugins: [],
}
