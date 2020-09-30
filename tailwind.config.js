module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  purge: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./context/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      boxShadow: {
        solid: "0 0 0 2px currentColor",
      },
      spacing: {
        7: "1.75rem",
      },
    },
  },
  variants: {
    zIndex: ["responsive", "hover", "focus"],
  },
  plugins: [require("@tailwindcss/custom-forms")],
};
