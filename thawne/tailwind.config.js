/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: '#5c6ac4',
      }
    },
  },
  plugins: [
  require('tailwind-scrollbar'),
],
}