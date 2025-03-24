import { getPalette } from "tailwindcss-palette-generator"

const palettes = {
  "automining": {
    primary: "#000000",
    secondary: "#3B82F6"
  },
  "vale-verde": {
    primary: "#207353",
    secondary: "#C0A630"
  },
  "atlantic-nickel": {
    primary: "#09152E",
    secondary: "#D0A60F"
  },
  "appian": {
    primary: "#09152E",
    secondary: "#D0A60F"
  }
}
const generateFor = process.env.COMAPNY ?? "automining"
const palette = getPalette([
  {
    name: "primary",
    color: palettes[generateFor].primary
  },
  {
    name: "secondary",
    color: palettes[generateFor].secondary
  }
])

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: { extend: { colors: palette } },
  plugins: [],
}

