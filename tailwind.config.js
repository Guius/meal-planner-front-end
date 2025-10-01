/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        subtitle: "#f9eee2",
        "content-text-grey": "#616161",
        button_bg: "#fdf4f3",
        button_bg_hover: "#f7e6e4",
        button_bg_active: "#f1d5d2",
        button_bg_focus: "#f9eae8",
        button_bg_disabled: "#f5f5f5",
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
