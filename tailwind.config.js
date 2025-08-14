/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'space-gray': '#232946',
        'cosmic-blue': '#3a6ea5',
        'aurora-purple': '#a259f7',
        'golden-blue': '#7ecfff', // Clear weather için
        'rain-blue': '#5c7fa3',   // Rain için
        'snow-ice': '#e0f7fa',    // Snow için
        'storm-purple': '#4b006e' // Thunderstorm için
      },
    },
  },
  plugins: [],
}

