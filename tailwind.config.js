/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        subtitle: "#f9eee2",
      },
      fontFamily: {
        kalam: ["Kalam", "cursive"],
      },
    },
  },
  plugins: [],
};
