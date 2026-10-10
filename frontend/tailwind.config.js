/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          white: '#FFFFFF',
          softGray: '#F5F6F8',
          graphite: '#17191F',
          graphiteLight: '#2A2F3D',
          muted: '#667085',
          border: '#E4E7EC',
          borderLight: '#F2F4F7',
          accent: '#6558D3',
          accentHover: '#5446C4',
          accentLight: '#8578E8',
          accentSubtle: '#EEEDFB',
          neonCyan: '#0EA5E9',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(101, 88, 211, 0.25)',
        'glow-md': '0 0 30px rgba(101, 88, 211, 0.35)',
        'card-soft': '0 1px 3px rgba(16, 24, 40, 0.06), 0 1px 2px rgba(16, 24, 40, 0.04)',
        'card-hover': '0 12px 24px -4px rgba(16, 24, 40, 0.08), 0 4px 8px -2px rgba(16, 24, 40, 0.04)',
      },
    },
  },
  plugins: [],
};
