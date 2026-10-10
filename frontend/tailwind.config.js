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
          dark: '#0A0D14',
          surface: '#121722',
          surfaceLight: '#1E2536',
          card: '#151C2A',
          border: '#2A3449',
          borderLight: '#3B4864',
          silver: '#CBD5E1',
          silverLight: '#F1F5F9',
          silverMuted: '#94A3B8',
          accent: '#8B5CF6',
          accentHover: '#7C3AED',
          accentLight: '#A78BFA',
          accentGlow: '#C084FC',
          neonCyan: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(139, 92, 246, 0.25)',
        'glow-md': '0 0 30px rgba(139, 92, 246, 0.35)',
        'glow-lg': '0 0 50px rgba(139, 92, 246, 0.45)',
        'silver-card': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 1px 1px rgba(255, 255, 255, 0.08)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
