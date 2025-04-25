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
      padding: {
        DEFAULT: '1rem',
        sm: '2rem',
        lg: '4rem',
        xl: '5rem',
        '2xl': '6rem',
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
    },
    extend: {
      colors: {
        luxury: {
          dark: "#0D1117",
          darker: "#161B22",
          primary: "#9b87f5",
          secondary: "#7E69AB",
          accent: "#D946EF",
          neutral: "#E5DEFF",
          muted: "#A8B3CF",
          softgray: "#2D3748",
          success: "rgba(76, 175, 80, 0.9)",
          warning: "rgba(255, 167, 38, 0.9)",
          error: "rgba(239, 83, 80, 0.9)",
          info: "rgba(66, 165, 245, 0.9)",
          'gradient-from': "#0D1117",
          'gradient-via': "#1A1F2C",
          'gradient-to': "#161B22",
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
      spacing: {
        DEFAULT: '1rem',
        sm: '0.5rem',
        md: '1rem',
        lg: '1.5rem',
        xl: '2rem',
        '2xl': '2.5rem',
        '3xl': '3rem',
        '4xl': '4rem',
        '5xl': '5rem',
        '6xl': '6rem',
        '7xl': '7rem',
        '8xl': '8rem',
        '9xl': '9rem',
      },
      maxWidth: {
        DEFAULT: '100%',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3840px',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, var(--tw-colors-luxury-dark) 0%, var(--tw-colors-luxury-darker) 100%)',
        'button-gradient': 'linear-gradient(90deg, var(--tw-colors-luxury-primary) 0%, var(--tw-colors-luxury-secondary) 100%)',
        'hover-gradient': 'linear-gradient(90deg, var(--tw-colors-luxury-secondary) 0%, var(--tw-colors-luxury-primary) 100%)',
        'neon-glow': 'linear-gradient(90deg, rgba(155,135,245,0.15) 0%, rgba(217,70,239,0.15) 100%)',
        'radial-gradient': 'radial-gradient(circle, var(--tw-gradient-from) 0%, var(--tw-gradient-via) 50%, var(--tw-gradient-to) 100%)',
      },
      boxShadow: {
        DEFAULT: '0 0 0 1px hsl(var(--border))',
        sm: '0 1px 2px rgba(0,0,0,0.05)',
        md: '0 4px 8px rgba(0,0,0,0.1)',
        lg: '0 16px 32px rgba(0,0,0,0.2)',
        xl: '0 32px 64px rgba(0,0,0,0.3)',
        '2xl': '0 64px 128px rgba(0,0,0,0.4)',
        '3xl': '0 128px 256px rgba(0,0,0,0.5)',
        '4xl': '0 256px 512px rgba(0,0,0,0.6)',
        '5xl': '0 512px 1024px rgba(0,0,0,0.7)',
        '6xl': '0 1024px 2048px rgba(0,0,0,0.8)',
        '7xl': '0 2048px 4096px rgba(0,0,0,0.9)',
        '8xl': '0 4096px 8192px rgba(0,0,0,1)',
        '9xl': '0 8192px 16384px rgba(0,0,0,1)',
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
      clipPath: {
        "circle": "circle(50% at 50% 50%)",
        "ellipse": "ellipse(50% at 50% 50%)",
        "polygon": "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
        "inset": "inset(0 0 0 0)",
        "none": "none",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
  ],
} satisfies Config;
