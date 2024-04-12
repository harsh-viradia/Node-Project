/* eslint-disable global-require */
/* eslint-disable unicorn/prefer-module */
module.exports = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx}",
    "./widgets/**/*.{js,ts,jsx,tsx}",
    "./shared/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./hook/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        foreground: "#626262",
        primary: "#40B5E8",
        "primary-light": "#f5fbfe",
        "dark-primary": "#11a6e6",
        "primary-border": "#d5d5d5",
        blue: "#02A2FF",
        secondary: "#F2F6F9",
        "light-gray": "#dfdfdf",
        label: "#CECECE",
        green: "#00ca6d",
        "dark-green": "#01af5f",
        "light-green": "#35DF91",
        yellow: "#fbae14",
        "light-yellow": "#FAC762",
        red: "#ff3939",
        "light-pink": "#FFDAE1",
        pink: "#FF0030",
        "dark-gray": "#313A46",
        "thin-gray": "#e5e7eb",
        "disabled-gray": "#f2f2f2",
      },
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/line-clamp"),
  ],
}
