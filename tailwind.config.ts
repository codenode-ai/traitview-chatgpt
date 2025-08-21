import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Cores Dark
        'dark-bg': '#1a1a2e',
        'dark-card': '#16213e',
        'dark-sidebar': '#0f3460',
        'dark-text': '#e6e6e6',
        'dark-text-secondary': '#a0a0a0',
        
        // Cores Vibrantes
        'vibrant-blue': '#4a90e2',
        'vibrant-green': '#7ed321',
        'vibrant-yellow': '#f8e71c',
        'vibrant-purple': '#9013fe',
        'vibrant-red': '#d0021b',
        'vibrant-pink': '#ff6b6b',
        
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)"
      },
      borderRadius: {
        xl: "var(--radius)",
        "2xl": "calc(var(--radius) + 0.25rem)"
      }
    },
  },
  plugins: [],
} satisfies Config;
