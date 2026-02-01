/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app.vue",
        "./pages/**/*.{vue,js,ts,jsx,tsx}",
        "./components/**/*.{vue,js,ts,jsx,tsx}",
        "./layouts/**/*.{vue,js,ts,jsx,tsx}",
        "./server/utils/**/*.{js,ts}",
        "./nuxt.config.{js,ts}",
    ],

    theme: {
        extend: {},
    },
    plugins: [require("daisyui")],
    daisyui: {
        themes: ["light", "dark", "cupcake"],
    },
}
