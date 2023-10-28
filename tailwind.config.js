/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{tsx,html,jsx}"],
  darkMode: "media",
  mode: "jit",
  theme: {
    spacing: Array.from({ length: 375 }).reduce((map, _, index) => {
      map[index] = `${index}px`;
      return map;
    }, {}),
  },
}
