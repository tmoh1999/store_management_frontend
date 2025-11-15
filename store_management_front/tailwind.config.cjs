/** @type {import('tailwindcss').Config} */
module.exports = {
  experimental : {
  compile: 'swc' ,
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [],
};