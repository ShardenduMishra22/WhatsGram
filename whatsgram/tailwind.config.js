/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // Ensure React components are included
  ],
  theme: {
    extend: {},
  },
  plugins: [
    'daisyui',
  ],
}
