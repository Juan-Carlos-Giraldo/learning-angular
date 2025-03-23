/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{html,js,mjs}", "./resources/**/*.{html,js,mjs,json}"],
    theme: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms')
    ]
}
