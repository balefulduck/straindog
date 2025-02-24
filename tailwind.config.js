/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        encode: ['Encode Sans', 'sans-serif'],
        'homemade-apple': ['var(--font-homemade-apple)', 'cursive'],
        'dancing-script': ['var(--font-dancing-script)', 'cursive'],
      },
    },
  },
  plugins: [],
}
