import { type Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        luxury: {
          dark: "#1A1F2C",
          primary: "#9b87f5",
          secondary: "#7E69AB",
          accent: "#D946EF",
          neutral: "#E5DEFF",
          softgray: "#F1F0FB",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #1A1F2C 0%, #2A1F3D 50%, #1A1F2C 100%)',
        'button-gradient': 'linear-gradient(90deg, #9b87f5 0%, #7E69AB 100%)',
        'hover-gradient': 'linear-gradient(90deg, #7E69AB 0%, #9b87f5 100%)',
        'neon-glow': 'linear-gradient(90deg, rgba(155,135,245,0.5) 0%, rgba(217,70,239,0.5) 100%)',
      },
      keyframes: {
        "logo-spin": {
          "0%": { transform: "scale(0.95) rotate(0deg)" },
          "50%": { transform: "scale(1.05) rotate(180deg)" },
          "100%": { transform: "scale(0.95) rotate(360deg)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.5" },
          "100%": { transform: "scale(1.2)", opacity: "0" },
        },
        "neon-pulse": {
          "0%, 100%": { 
            boxShadow: "0 0 5px theme('colors.luxury.primary'), 0 0 20px theme('colors.luxury.primary')"
          },
          "50%": { 
            boxShadow: "0 0 10px theme('colors.luxury.accent'), 0 0 30px theme('colors.luxury.accent')"
          }
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" }
        },
        "pulse": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        "logo-spin": "logo-spin 1.5s ease-in-out",
        "fade-up": "fade-up 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "neon-glow": "neon-pulse 2s ease-in-out infinite",
        "spin-slow": "spin-slow 3s linear infinite",
        "pulse": "pulse 20s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
