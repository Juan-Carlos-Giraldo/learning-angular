/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        customGrey: '#6AC1CD',
        customElementsDark:'#57c2c6'
      },
    },
  },
  plugins: []
};