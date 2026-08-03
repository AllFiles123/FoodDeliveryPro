/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "#FF6B00",
        secondary: "#0F172A",
        accent: "#22C55E",
        background: "#F8FAFC",
        dark: "#020617",
        card: "#FFFFFF",
      },

      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },

      borderRadius: {
        xl2: "20px",
      },

      boxShadow: {
        soft: "0 10px 25px rgba(0,0,0,.08)",
      },
    },
  },

  plugins: [],
};