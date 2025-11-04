import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // PRIMARY: Deep Electric Blue (Main brand color)
        // More saturated and modern than standard blue
        // Perfect for tech/recruitment positioning
        primary: {
          50: "#eff6ff", // Very light blue (backgrounds)
          100: "#dbeafe", // Light blue (hover states)
          200: "#bfdbfe", // Soft blue
          300: "#93c5fd", // Medium blue
          400: "#60a5fa", // Bright blue
          500: "#3b82f6", // Standard blue
          600: "#1d4ed8", // MAIN BRAND COLOR - Deep electric blue ⭐
          700: "#1e40af", // Dark blue (text, headings)
          800: "#1e3a8a", // Very dark blue
          900: "#172554", // Almost black blue
          950: "#0f1729", // Deep navy (darkest)
        },

        // SECONDARY: Sophisticated Charcoal (Neutral with blue undertones)
        // Professional, modern, replaces boring gray
        secondary: {
          50: "#f8fafc", // Almost white (backgrounds)
          100: "#f1f5f9", // Very light gray
          200: "#e2e8f0", // Light gray (borders)
          300: "#cbd5e1", // Medium gray
          400: "#94a3b8", // Darker gray (placeholders)
          500: "#64748b", // Standard gray (body text)
          600: "#475569", // Dark gray
          700: "#334155", // Darker gray (headings)
          800: "#1e293b", // Very dark gray
          900: "#0f172a", // Almost black (premium dark)
          950: "#020617", // Pure dark
        },

        // ACCENT: Electric Cyan (Innovation, Technology, Skills)
        // Represents precision, skills verification, tech expertise
        // Much better than purple for B2B tech
        accent: {
          50: "#ecfeff", // Very light cyan
          100: "#cffafe", // Light cyan
          200: "#a5f3fc", // Soft cyan
          300: "#67e8f9", // Medium cyan
          400: "#22d3ee", // Bright cyan
          500: "#06b6d4", // MAIN ACCENT COLOR - Electric cyan ⭐
          600: "#0891b2", // Deep cyan
          700: "#0e7490", // Dark cyan
          800: "#155e75", // Very dark cyan
          900: "#164e63", // Almost black cyan
          950: "#083344", // Deep teal
        },

        // SUCCESS: Modern Emerald (Verification, Achievement, Growth)
        // Perfect for "verified" badges and success states
        success: {
          50: "#ecfdf5", // Very light green
          100: "#d1fae5", // Light green
          200: "#a7f3d0", // Soft green
          300: "#6ee7b7", // Medium green
          400: "#34d399", // Bright green
          500: "#10b981", // MAIN SUCCESS - Emerald ⭐
          600: "#059669", // Deep emerald
          700: "#047857", // Dark emerald
          800: "#065f46", // Very dark green
          900: "#064e3b", // Almost black green
          950: "#022c22", // Deep forest
        },

        // WARNING: Warm Amber (Attention, Premium, Important)
        // Better than yellow - more premium feel
        warning: {
          50: "#fffbeb", // Very light amber
          100: "#fef3c7", // Light amber
          200: "#fde68a", // Soft amber
          300: "#fcd34d", // Medium amber
          400: "#fbbf24", // Bright amber
          500: "#f59e0b", // MAIN WARNING - Warm amber ⭐
          600: "#d97706", // Deep amber
          700: "#b45309", // Dark amber
          800: "#92400e", // Very dark amber
          900: "#78350f", // Almost black amber
          950: "#451a03", // Deep brown
        },

        // DANGER: Vibrant Red (Errors, Critical, Urgent)
        danger: {
          50: "#fef2f2", // Very light red
          100: "#fee2e2", // Light red
          200: "#fecaca", // Soft red
          300: "#fca5a5", // Medium red
          400: "#f87171", // Bright red
          500: "#ef4444", // MAIN DANGER - Vibrant red ⭐
          600: "#dc2626", // Deep red
          700: "#b91c1c", // Dark red
          800: "#991b1b", // Very dark red
          900: "#7f1d1d", // Almost black red
          950: "#450a0a", // Deep crimson
        },

        // INFO: Cool Sky Blue (Information, Neutral actions)
        // Optional additional color for information states
        info: {
          50: "#f0f9ff",
          100: "#e0f2fe",
          200: "#bae6fd",
          300: "#7dd3fc",
          400: "#38bdf8",
          500: "#0ea5e9", // MAIN INFO - Sky blue ⭐
          600: "#0284c7",
          700: "#0369a1",
          800: "#075985",
          900: "#0c4a6e",
          950: "#082f49",
        },
      },

      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },

      // Modern gradients
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",

        // Branded gradients
        "gradient-primary": "linear-gradient(135deg, #1d4ed8 0%, #0891b2 100%)",
        "gradient-accent": "linear-gradient(135deg, #06b6d4 0%, #10b981 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #eff6ff 0%, #ecfeff 50%, #ecfdf5 100%)",
        "gradient-dark": "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
      },

      // Modern shadows
      boxShadow: {
        soft: "0 2px 8px rgba(0, 0, 0, 0.04)",
        medium: "0 4px 16px rgba(0, 0, 0, 0.08)",
        strong: "0 8px 24px rgba(0, 0, 0, 0.12)",
        "glow-primary": "0 0 20px rgba(29, 78, 216, 0.3)",
        "glow-accent": "0 0 20px rgba(6, 182, 212, 0.3)",
        "glow-success": "0 0 20px rgba(16, 185, 129, 0.3)",
      },

      // Modern animations
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "slide-down": {
          "0%": { opacity: "0", transform: "translateY(-10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        "gradient-x": {
          "0%, 100%": {
            "background-size": "200% 200%",
            "background-position": "left center",
          },
          "50%": {
            "background-size": "200% 200%",
            "background-position": "right center",
          },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        "pulse-slow": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.8" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.3s ease-out",
        "slide-up": "slide-up 0.3s ease-out",
        "slide-down": "slide-down 0.3s ease-out",
        "scale-in": "scale-in 0.3s ease-out",
        "gradient-x": "gradient-x 3s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};

export default config;
