/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        leaf: "#1f7a45",
        earth: "#8a5a36",
        cream: "#f7f5ec",
        ink: "#173022"
      },
      boxShadow: {
        soft: "0 12px 35px rgba(28, 65, 43, .10)"
      }
    }
  },
  plugins: []
}
