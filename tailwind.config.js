/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211b',
        lawn: '#246b45',
        mint: '#dff4e8',
        blush: '#f7c8c1',
        butter: '#f7d56f',
        sky: '#cbe7f8',
        cream: '#fff8ef',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 80px rgba(23, 33, 27, 0.12)',
      },
    },
  },
  plugins: [],
};

