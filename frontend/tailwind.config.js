/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#2b5a9a",
          lighter: "#3b6aba",
          darker: "#1e40af",
        },
        secondary: {
          DEFAULT: "#1e40af",
          lighter: "#3b6aba",
        },
        accent: {
          DEFAULT: "#717fe0",
          glow: "rgba(113, 127, 224, 0.3)",
          vibrant: "#5a68ce",
        },
        'text-color': "#333333",
        'bg-color': "#f2f5f8",
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        'premium': '0 20px 50px rgba(0, 0, 0, 0.1)',
        'accent-glow': '0 0 20px 5px rgba(113, 127, 224, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slide-up': 'slideUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'reveal': 'reveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        reveal: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '60px',
      }
    },
  },
  plugins: [],
}

