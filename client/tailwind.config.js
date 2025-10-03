/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'romantic': {
          50: '#fef7f7',
          100: '#fdeaea',
          200: '#fbd5d5',
          300: '#f7b3b3',
          400: '#f18a8a',
          500: '#e85d5d',
          600: '#d63d3d',
          700: '#b32b2b',
          800: '#952525',
          900: '#7c2323',
        },
        'lavender': {
          50: '#faf7ff',
          100: '#f3edff',
          200: '#e9d8ff',
          300: '#d8b4fe',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          800: '#6b21a8',
          900: '#581c87',
        },
        'cream': {
          50: '#fffef7',
          100: '#fffceb',
          200: '#fff7d1',
          300: '#ffefb3',
          400: '#ffe066',
          500: '#ffd700',
          600: '#e6c200',
          700: '#cc9900',
          800: '#b38600',
          900: '#997300',
        }
      },
      fontFamily: {
        'pacifico': ['Pacifico', 'cursive'],
        'nunito': ['Nunito', 'sans-serif'],
        'handwriting': ['Kalam', 'cursive'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'sparkle': 'sparkle 2s linear infinite',
        'bounce-gentle': 'bounce-gentle 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(232, 93, 93, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(232, 93, 93, 0.8)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1', transform: 'scale(1)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        }
      },
      backgroundImage: {
        'gradient-romantic': 'linear-gradient(135deg, #fef7f7 0%, #fdeaea 50%, #fbd5d5 100%)',
        'gradient-lavender': 'linear-gradient(135deg, #faf7ff 0%, #f3edff 50%, #e9d8ff 100%)',
        'gradient-hearts': 'radial-gradient(circle at 20% 80%, #fdeaea 0%, transparent 50%), radial-gradient(circle at 80% 20%, #fbd5d5 0%, transparent 50%)',
      }
    },
  },
  plugins: [],
}
