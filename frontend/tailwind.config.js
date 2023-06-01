/** @type {import('tailwindcss').Config} */
// tailwind.config.js
module.exports = {
  mode: 'jit', // enable Just-In-Time compiler
  prefix: '', // add your preferred prefix here
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

