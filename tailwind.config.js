/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brown: {
          900: '#1A1412',
          800: '#2A201A',
          700: '#3D2F25',
          sugar: '#D4AF37', // Gold/Sugar color
        },
        glass: 'rgba(26, 20, 18, 0.45)',
        glassBorder: 'rgba(255, 255, 255, 0.08)'
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Outfit', 'sans-serif'],
      },
      backgroundImage: {
        'cafe-pattern': "url('/Images/bg.png')",
      }
    },
  },
  plugins: [],
}
