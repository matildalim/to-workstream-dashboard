/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // covers general source files
    './app/**/*.{js,ts,jsx,tsx}', // (if you have /app directly)
    './src/app/(frontend)/**/*.{ts,tsx}', // <-- this is the key fix
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
