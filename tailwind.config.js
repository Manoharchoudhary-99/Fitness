/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#F7F7F2',
        panel: '#FFFFFF',
        stone: '#EAECE5',
        ink: '#171916',
        muted: '#5E655E',
        border: '#E4E5DF',
        accent: '#456B50',
        accentSoft: '#DCE7DD',
      },
      boxShadow: {
        soft: '0 8px 25px rgba(23, 25, 22, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
