module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ["Inter", "sans-serif"],
    },
    extend: {
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
