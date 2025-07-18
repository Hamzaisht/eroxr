
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
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['Playfair Display', 'Georgia', 'serif'],
        mono: ['SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', 'monospace']
      },
      fontSize: {
        xs: ['var(--font-size-xs)', { lineHeight: 'var(--line-height-normal)' }],
        sm: ['var(--font-size-sm)', { lineHeight: 'var(--line-height-normal)' }],
        base: ['var(--font-size-base)', { lineHeight: 'var(--line-height-normal)' }],
        lg: ['var(--font-size-lg)', { lineHeight: 'var(--line-height-relaxed)' }],
        xl: ['var(--font-size-xl)', { lineHeight: 'var(--line-height-normal)' }],
        '2xl': ['var(--font-size-2xl)', { lineHeight: 'var(--line-height-normal)' }],
        '3xl': ['var(--font-size-3xl)', { lineHeight: 'var(--line-height-snug)' }],
        '4xl': ['var(--font-size-4xl)', { lineHeight: 'var(--line-height-snug)' }],
        '5xl': ['var(--font-size-5xl)', { lineHeight: 'var(--line-height-tight)' }],
        '6xl': ['var(--font-size-6xl)', { lineHeight: 'var(--line-height-tight)' }],
      },
      letterSpacing: {
        tighter: 'var(--letter-spacing-tighter)',
        tight: 'var(--letter-spacing-tight)',
        normal: 'var(--letter-spacing-normal)',
        wide: 'var(--letter-spacing-wide)',
        wider: 'var(--letter-spacing-wider)',
        widest: 'var(--letter-spacing-widest)',
      },
      lineHeight: {
        tight: 'var(--line-height-tight)',
        snug: 'var(--line-height-snug)',
        normal: 'var(--line-height-normal)',
        relaxed: 'var(--line-height-relaxed)',
        loose: 'var(--line-height-loose)',
      },
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
        '18': '4.5rem',
        '112': '28rem',
        '128': '32rem',
        '144': '36rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, var(--tw-colors-luxury-dark) 0%, var(--tw-colors-luxury-darker) 100%)',
        'button-gradient': 'linear-gradient(90deg, var(--tw-colors-luxury-primary) 0%, var(--tw-colors-luxury-secondary) 100%)',
        'hover-gradient': 'linear-gradient(90deg, var(--tw-colors-luxury-secondary) 0%, var(--tw-colors-luxury-primary) 100%)',
        'neon-glow': 'linear-gradient(90deg, rgba(155,135,245,0.15) 0%, rgba(217,70,239,0.15) 100%)',
        'premium-gradient': 'linear-gradient(225deg, rgba(155,135,245,0.15) 0%, rgba(217,70,239,0.35) 50%, rgba(155,135,245,0.15) 100%)',
        'cta-gradient': 'linear-gradient(135deg, rgba(155,135,245,0.85) 0%, rgba(217,70,239,0.85) 100%)'
      },
      boxShadow: {
        'luxury': '0 0 20px rgba(155, 135, 245, 0.15)',
        'luxury-hover': '0 0 30px rgba(155, 135, 245, 0.25)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
        'premium': '0 0 30px rgba(155, 135, 245, 0.3)',
        'button': '0 8px 16px -4px rgba(155, 135, 245, 0.25)',
        'button-hover': '0 12px 24px -6px rgba(155, 135, 245, 0.35)',
        'glow': '0 0 15px rgba(217, 70, 239, 0.5)',
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
        "shine": {
          "to": {
            backgroundPosition: "200% center"
          }
        },
        "breathe": {
          "0%, 100%": { 
            transform: "scale(1)",
            opacity: "0.8"
          },
          "50%": { 
            transform: "scale(1.1)",
            opacity: "1"
          }
        },
        "orbit": {
          "0%": { 
            transform: "rotate(0deg) translateX(10px) rotate(0deg)" 
          },
          "100%": { 
            transform: "rotate(360deg) translateX(10px) rotate(-360deg)" 
          }
        },
        "typewriter": {
          "from": { width: "0" },
          "to": { width: "100%" }
        },
        "blink": {
          "50%": { borderColor: "transparent" }
        },
        "gradient-x": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" }
        },
        "shimmer": {
          "0%": { backgroundPositionX: "-100%" },
          "100%": { backgroundPositionX: "200%" }
        },
        "magnetic-move": {
          "0%, 100%": { transform: "translate(0px, 0px)" },
          "50%": { transform: "translate(var(--x, 0), var(--y, 0))" }
        }
      },
      animation: {
        "logo-spin": "logo-spin 1.5s ease-in-out",
        "fade-up": "fade-up 0.5s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-ring": "pulse-ring 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "neon-glow": "neon-pulse 2s ease-in-out infinite",
        "shine": "shine 2s linear infinite",
        "breathe": "breathe 5s ease-in-out infinite",
        "orbit": "orbit 12s linear infinite",
        "typewriter": "typewriter 4s steps(40) forwards",
        "cursor-blink": "blink 0.7s infinite",
        "gradient-x": "gradient-x 10s ease infinite",
        "shimmer": "shimmer 2s infinite",
        "magnetic": "magnetic-move 0.3s ease"
      },
      clipPath: {
        hexagon: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      },
      backdropBlur: {
        'xs': '2px',
        'xxl': '40px',
      },
      transitionTimingFunction: {
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'out-expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      backgroundSize: {
        '300%': '300% 300%',
        '400%': '400% 400%',
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require('tailwind-scrollbar-hide'),
    require('@tailwindcss/aspect-ratio'),
  ],
} satisfies Config;
