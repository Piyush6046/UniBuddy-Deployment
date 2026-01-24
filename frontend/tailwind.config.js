/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Nebula Design System Colors
        nebula: {
          void: '#0a0b10',
          deep: '#12141d',
          surface: '#1a1d2e',
          elevated: '#242842',
          muted: '#363b5c',
        },
        primary: {
          50: '#f3f0ff',
          100: '#e5deff',
          200: '#cdbfff',
          300: '#a991ff',
          400: '#8b5cf6',
          500: '#6b3fa0',
          600: '#5b2d91',
          700: '#4c2578',
          800: '#3d1e5f',
          900: '#2e174a',
        },
        secondary: {
          50: '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#2dd4bf',
          500: '#14b8a6',
          600: '#0d9488',
          700: '#0f766e',
          800: '#115e59',
          900: '#134e4a',
        },
        accent: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        // Legacy colors (backward compatibility)
        richblack: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
        },
        vjti: {
          red: "#6b3fa0",      // Updated to primary
          gold: "#f59e0b",     // Updated to accent
          dark: "#0a0b10",
          light: "#EDF2F7",
          accent: "#8b5cf6",
        },
      },
      fontFamily: {
        display: ['Outfit', 'system-ui', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        inter: ['Plus Jakarta Sans', 'sans-serif'], // Legacy support
      },
      screens: {
        'custom-lg': '1100px',
      },
      borderRadius: {
        'nebula-sm': '0.375rem',
        'nebula-md': '0.5rem',
        'nebula-lg': '0.75rem',
        'nebula-xl': '1rem',
        'nebula-2xl': '1.5rem',
        'nebula-3xl': '2rem',
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(107, 63, 160, 0.4), 0 0 40px rgba(107, 63, 160, 0.2)',
        'glow-secondary': '0 0 20px rgba(20, 184, 166, 0.4), 0 0 40px rgba(20, 184, 166, 0.2)',
        'glow-accent': '0 0 20px rgba(245, 158, 11, 0.4), 0 0 40px rgba(245, 158, 11, 0.2)',
        'nebula-sm': '0 2px 4px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.4)',
        'nebula-md': '0 4px 8px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.4)',
        'nebula-lg': '0 8px 16px rgba(0, 0, 0, 0.3), 0 4px 8px rgba(0, 0, 0, 0.3)',
        'nebula-xl': '0 16px 32px rgba(0, 0, 0, 0.35), 0 8px 16px rgba(0, 0, 0, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(107, 63, 160, 0.4)' },
          '50%': { boxShadow: '0 0 30px rgba(107, 63, 160, 0.6), 0 0 60px rgba(107, 63, 160, 0.3)' },
        },
      },
    },
  },
  plugins: [],
}
