/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1D4F91',
        secondary: '#F77222',
        sky: '#00AEEF'
      }
    }
  },
  plugins: []
}

