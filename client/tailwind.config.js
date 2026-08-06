/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],

  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",

        background: "var(--color-background)",
        surface: "var(--color-surface)",
        card: "var(--color-surface)",

        text: "var(--color-text)",
        textSecondary: "var(--color-text-secondary)",

        border: "var(--color-border)",

        success: "#16A34A",
        danger: "#DC2626",
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
