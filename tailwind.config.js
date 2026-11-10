/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tint: "var(--tint)",
        neutral: { 50:"#f3f6f5",100:"#e6ecea",200:"#d3dcd9",300:"#aebbb6",400:"#8ba3ad",500:"#5d727b",600:"#475b63",700:"#2f434d",800:"#1c3342",900:"#0d2431",950:"#001e2b" },
      },
      screens: { md: "700px" },
    },
  },
  plugins: [],
}