/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        subtitle: "#f9eee2",
        "content-text-grey": "#616161",
      },
      borderColor: {
        "content-text-grey": "#D0D0D0",
      },
      fontFamily: {
        kalam: ["Kalam", "cursive"],
        ubunutu_sans_mono: ["Ubuntu Sans Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
