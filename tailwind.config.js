/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        'rose-red': '#ff1744',
        'rose-pink': '#ff80ab',
        'deep-purple': '#4a148c',
        'gold': '#ffd700',
        'cream': '#fff8e1',
        'dark-bg': '#1a1a2e',
        'dark-secondary': '#16213e',
      },
      fontFamily: {
        'playfair': ['"Playfair Display"', 'serif'],
        'poppins': ['Poppins', 'sans-serif'],
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'float': 'float 15s infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'fade-in': 'fadeIn 0.3s ease',
        'slide-up': 'slideUp 0.4s ease',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '1' },
          '100%': { transform: 'translateY(-100vh) translateX(50px)', opacity: '0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        slideUp: {
          'from': { transform: 'translateY(50px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
