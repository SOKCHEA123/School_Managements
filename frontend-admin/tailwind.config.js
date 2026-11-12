const path = require('path');

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', 
  content: [
    path.join(__dirname, 'public/index.html'),
    path.join(__dirname, 'index.html'),
    path.join(__dirname, 'src/**/*.{js,jsx,ts,tsx}'),
    './src/**/*.{js,jsx,ts,tsx}',
    './public/index.html',
    './index.html',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          DEFAULT: '#2563eb', 
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        // ✅ ប្តូរមកប្រើ 'Inter' វិញ ព្រោះវាស្អាតជាង Times New Roman ច្រើនសម្រាប់ UI
        sans: ['Inter', 'Kantumruy Pro', 'sans-serif'],
        
        // ✅ ប្តូរមកប្រើ 'Kantumruy Pro' ដែលជា Font ខ្មែរទំនើប និងអានងាយ
        khmer: ['Kantumruy Pro', 'Battambang', 'sans-serif'],
        
        // អ្នកអាចបន្ថែម class ផ្សេងៗទៀតបានតាមចិត្ត
        // display: ['Poppins', 'sans-serif'], 
      },
      animation: {
        marquee: 'marquee 30s linear infinite',
        'text-ping-pong': 'pingPong 4s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pingPong: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(-15px)' },
        },
      },
    },
  },
  plugins: [],
}