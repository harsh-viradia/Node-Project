const defaultTheme = require("tailwindcss/defaultTheme")

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./widgets/**/*.{js,ts,jsx,tsx}",
    "./icons/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "#626262",
        primary: "#40B5E8",
        "primary-light": "#C6E9F8",
        "primary-max-light": "#ecf8fd",
        "dark-primary": "#11a6e6",
        "primary-border": "#eee",
        "dark-border": "#e5e5e5",
        blue: "#02A2FF",
        secondary: "#F2F6F9",
        "light-gray": "#ddd",
        label: "#CECECE",
        green: "#00ca6d",
        "dark-green": "#01af5f",
        "light-green": "#35DF91",
        yellow: "#F0B826",
        "light-yellow": "#FAC762",
        red: "#ff3939",
        "light-pink": "#FFDAE1",
        pink: "#FF0030",
        "dark-gray": "#666666",
        "thin-gray": "#222222",
        "disabled-gray": "#f2f2f2",
        orange: "#FE9000",
      },
    },
  },
  plugins: [
    require("@tailwindcss/line-clamp"),
    require("@tailwindcss/typography"),
    // ...
  ],
}
