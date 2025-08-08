// tailwind.config.js
module.exports = {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './app.vue',
  ],
  theme: {
    extend: {
      colors: {
        'pnw-evergreen': '#2E4A3D',
        'pnw-orange': '#F28C38',
        'pnw-yellow': '#E8B923',
        'pnw-gray': '#4A5568',
      },
      fontFamily: {
        sans: ['Montserrat', 'Open Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
};