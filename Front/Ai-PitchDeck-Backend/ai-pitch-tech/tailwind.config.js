/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",                 // ✅ Include this for Vite
    "./src/**/*.{js,jsx,ts,tsx}",   // ✅ React components
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
