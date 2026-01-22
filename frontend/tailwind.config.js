/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        richblack: {
          50: "#F8FAFC",       // Slate-50
          100: "#F1F5F9",      // Slate-100
          200: "#E2E8F0",      // Slate-200
          300: "#CBD5E1",      // Slate-300
          400: "#94A3B8",      // Slate-400
          500: "#64748B",      // Slate-500
          600: "#475569",      // Slate-600
          700: "#334155",      // Slate-700
          800: "#1E293B",      // Slate-800
          900: "#0F172A",      // Slate-900 (Main Dark BG)
        },
        vjti: {
          red: "#800000",      // Primary Branding (Maroon)
          gold: "#D4AF37",     // Secondary Branding (Gold)
          dark: "#1A202C",     // Deep dark
          light: "#EDF2F7",
          accent: "#E53E3E",   // Brighter red for buttons
        },
      },
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      screens: {
        'custom-lg': '1100px',
      },
    },
  },
  plugins: [],
}
