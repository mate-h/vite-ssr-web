/** @type {import("@types/tailwindcss/tailwind-config").TailwindConfig } */
module.exports = {
  mode: "jit", // Just in time compilation
  purge: {
    content: ["./src/**/*.html", "./index.html", "./src/**/*.ts"],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf7e2",
          100: "#faeab5",
          200: "#f7dd86",
          300: "#f5d058",
          400: "#f3c539", // main
          500: "#f1bc29",
          600: "#f1ae24",
          700: "#f09d20",
          800: "#ee8d1d",
          900: "#ed7015",
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [require("@tailwindcss/forms")],
};
