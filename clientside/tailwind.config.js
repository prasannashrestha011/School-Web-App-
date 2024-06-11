/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        'custom-black': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.25)',
      },
      fontFamily:{
        modeseven:['VT323'],
        basicmanual:['BasicManual']
      }
    },
  },
  plugins: [],
}

