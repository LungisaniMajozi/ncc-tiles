/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#1e40af", // Blue
        secondary: "#0f172a", // Dark slate
        accent: "#10b981", // Green
        tile: {
          light: "#f1f5f9",
          border: "#cbd5e1",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      screens: {
        xs: "475px", // Extra small phones
      },
    },
  },
  plugins: [],
};
