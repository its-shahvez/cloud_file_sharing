// tailwind.config.js

/** @type {import('tailwindcss').Config} */
export default {
  // Yeh Tailwind ko batata hai ki aapki component files kahan hain
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // <-- Sabse zaroori line
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}