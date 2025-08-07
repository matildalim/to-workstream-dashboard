module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",  // if your components live in /src
    './components/**/*.{js,ts,jsx,tsx}',  // if your components live in /components
    "./app/**/*.{js,ts,jsx,tsx}",  // if using App Router (which you are)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
