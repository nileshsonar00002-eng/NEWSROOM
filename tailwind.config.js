/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // NEWSORA Editorial Palette
        navy: {
          50: '#F4F6F9',
          100: '#E5EAF0',
          200: '#C7D2E0',
          300: '#9FB3C8',
          400: '#64748B',
          500: '#475569',
          600: '#334155',
          700: '#1E293B',
          800: '#0F1E36',
          900: '#0B1528',
          950: '#060B14'
        },
        brand: {
          50: '#FFF5F0',
          100: '#FFE8DC',
          200: '#FFD1BA',
          300: '#FFA77B',
          400: '#FF7A42',
          500: '#FF5722', // Subtle energetic orange
          600: '#E64A19',
          700: '#C83B10',
          800: '#9E2E0D',
          900: '#7A240A'
        },
        // Editorial paper neutrals
        paper: {
          light: '#FFFFFF',
          subtle: '#F8FAFC',
          card: '#FFFFFF',
          dark: '#080E1A',
          darkCard: '#0F1829',
          darkBorder: '#1E293B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        headline: ['Outfit', 'Inter', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif']
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.03)',
        'card-hover': '0 10px 25px -5px rgba(0, 0, 0, 0.08), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        'elevated': '0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 10px 10px -5px rgba(15, 23, 42, 0.04)',
      }
    },
  },
  plugins: [],
};
