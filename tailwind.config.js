/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0F0E0C',
        card: '#16140F',
        accent: {
          DEFAULT: '#F5C200',
          glow: 'rgba(245,194,0,0.25)',
          muted: 'rgba(245,194,0,0.08)',
        },
        text: {
          primary: '#F2EDE2',
          secondary: 'rgba(242,237,226,0.65)',
          muted: 'rgba(242,237,226,0.35)',
        },
        border: 'rgba(242,237,226,0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Playfair Display', 'Georgia', 'serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease forwards',
        'fade-up': 'fadeUp 0.7s ease forwards',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'count-up': 'countUp 0.4s ease forwards',
        'number': 'numberPop 0.35s ease forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(24px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(245,194,0,0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(245,194,0,0.6)' },
        },
        countUp: {
          from: { opacity: '0', transform: 'scale(0.95)' },
          to: { opacity: '1', transform: 'scale(1)' },
        },
        numberPop: {
          '0%': { opacity: '0', transform: 'translateY(-4px) scale(0.97)' },
          '60%': { opacity: '1', transform: 'translateY(1px) scale(1.01)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

