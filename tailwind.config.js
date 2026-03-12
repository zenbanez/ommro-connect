/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ommro: {
          green: {
            100: '#dcfce7',
            600: '#16a34a',
            800: '#166534',
          },
          earth: '#92400e',
          sky: '#0ea5e9',
          sunset: '#f97316',
        }
      },
      fontFamily: {
        sans: ['Inter', 'Montserrat', 'sans-serif'],
        body: ['Open Sans', 'Roboto', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      }
    },
  },
  plugins: [],
}
