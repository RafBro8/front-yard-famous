/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#17211b',
        forest: '#123526',
        lawn: '#246b45',
        leaf: '#4f9a68',
        mint: '#dff4e8',
        blush: '#f7c8c1',
        coral: '#f26b5b',
        butter: '#f7d56f',
        sky: '#cbe7f8',
        cream: '#fff8ef',
        linen: '#fffdf8',
        lilac: '#d9d0ff',
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 80px rgba(23, 33, 27, 0.12)',
        glow: '0 28px 90px rgba(36, 107, 69, 0.18)',
      },
    },
  },
  plugins: [],
};
