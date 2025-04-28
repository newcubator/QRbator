/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        "corp-teal": "#1BD3C5",
        "corp-dark-teal": "#00A092",
        "corp-yellow": "#F5C35F",
        "corp-purple": "#876CDA",
        "corp-red": "#E45848",
        "corp-dark-red": "#C0392B",
        "corp-grey": "#50505E",
        "corp-mid-grey": "#979797",
        "corp-light-grey": "#F3F3F3",
        "corp-white": "#FFFFFF",
      },
    },
  },
  plugins: [],
};
