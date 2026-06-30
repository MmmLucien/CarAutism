/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          red: '#E8000D',
          dark: '#0A0A0A',
          card: '#1C1C1E',
          line: '#2C2C2E',
          muted: '#8E8E93',
          gold: '#FFD700',
          green: '#30D158',
        }
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'sans-serif']
      }
    }
  },
  plugins: []
}
