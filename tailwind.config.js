/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── Digital Bloom brand palette ─────────────────────────────
        // Navy (background hierarchy)
        'navy':          '#0c1f3f',   // base background
        'navy-2':        '#152b4d',   // secondary sections
        'navy-3':        '#1a3560',   // card surfaces

        // Rose gold (primary accent)
        'rose-gold':     '#C9857A',
        'rose-gold-light': '#E8B4AD',

        // Warm gold (special / Dearly Departed accent)
        'warm-gold':     '#C9A84C',

        // Text
        'bloom-cream':   '#FAF0EC',   // primary text on navy
        'bloom-champ':   '#F0DDD0',   // secondary text

        // ── Legacy colors (kept for backward compatibility) ─────────
        primary: {
          50:  '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
        },
        'obsidian':       '#FFFFFF',
        'pure-gold':      '#D4AF37',
        'champagne':      '#F5F5F7',
        'rose-red':       '#ff1744',
        'rose-pink':      '#ff80ab',
        'deep-purple':    '#4a148c',
        'gold':           '#D4AF37',
        'cream':          '#FAFAFA',
        'dark-bg':        '#FFFFFF',
        'dark-secondary': '#F5F5F7',
        'brand-white':    '#1D1D1F',
        'brand-gold':     '#D4AF37',
        // Apple-style
        'apple-white':     '#FFFFFF',
        'apple-gray':      '#FAFAFA',
        'apple-text':      '#1D1D1F',
        'apple-secondary': '#6E6E73',
        'apple-border':    '#D2D2D7',
        'apple-accent':    '#D4AF37',
      },
      fontFamily: {
        'playfair':   ['"Playfair Display"', 'serif'],
        'poppins':    ['Poppins', 'sans-serif'],
        'cormorant':  ['"Cormorant Garamond"', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'sf': [
          '-apple-system', 'BlinkMacSystemFont', '"SF Pro Display"',
          '"Segoe UI"', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'
        ],
      },
      animation: {
        'float':          'float 15s infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
        'fade-in':        'fadeIn 1s ease-out',
        'slide-up':       'slideUp 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'pulse-slow':     'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)', opacity: '0' },
          '10%':       { opacity: '1' },
          '90%':       { opacity: '1' },
          '100%':      { transform: 'translateY(-100vh) translateX(50px)', opacity: '0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideUp: {
          from: { transform: 'translateY(30px)', opacity: '0' },
          to:   { transform: 'translateY(0)',    opacity: '1' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.5' },
        },
      },
    },
  },
  plugins: [],
};
