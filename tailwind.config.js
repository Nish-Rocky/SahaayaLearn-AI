/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          midnight: '#07111F',
          deep: '#0B1C35',
          surface: '#101F33',
          surfaceCard: '#13253E',
          surfaceElevated: '#172B47',
          cyan: '#24C8F4',
          blue: '#3478F6',
          violet: '#8275FF',
          white: '#EAF7FF',
          muted: '#A9B9CA',
          dim: '#637A92',
          border: 'rgba(36, 200, 244, 0.15)',
          borderSubtle: 'rgba(255, 255, 255, 0.08)',
          amber: '#F59E0B',
          amberSoft: 'rgba(245, 158, 11, 0.15)',
        },
        light: {
          bg: '#F5F9FD',
          surface: '#FFFFFF',
          card: '#F0F6FC',
          border: '#D9E6F2',
          text: '#0D1E33',
          muted: '#52687F',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Plus Jakarta Sans', 'Manrope', 'system-ui', 'sans-serif'],
        heading: ['Manrope', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 35px -5px rgba(36, 200, 244, 0.35)',
        'glow-blue': '0 0 35px -5px rgba(52, 120, 246, 0.35)',
        'glow-violet': '0 0 35px -5px rgba(130, 117, 255, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-light': '0 8px 24px 0 rgba(7, 17, 31, 0.06)',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        wavePulse: {
          '0%, 100%': { height: '8px' },
          '50%': { height: '36px' },
        }
      },
      animation: {
        'pulse-glow': 'pulseGlow 4s ease-in-out infinite',
        'float-slow': 'floatSlow 6s ease-in-out infinite',
        'wave': 'wavePulse 1.2s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}
