/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./AISite/**/*.{html,js,cshtml}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        secondary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
          950: '#082f49',
        },
        dark: {
          100: '#1e1f24',
          200: '#18191e',
          300: '#121318',
          400: '#0c0d12',
          500: '#06070c',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        'message': '0 2px 5px rgba(0, 0, 0, 0.1)',
        'input': '0 2px 10px rgba(0, 0, 0, 0.1)',
        'card': '0 4px 15px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-short': 'bounce 1s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-dots': 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
      },
      backgroundSize: {
        'dots-sm': '20px 20px',
        'dots-md': '30px 30px',
        'dots-lg': '40px 40px',
      },
    },
  },
  plugins: [],
}
