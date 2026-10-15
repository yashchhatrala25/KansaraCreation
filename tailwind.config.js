/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#0B0B12",
          secondary: "#11111A",
          tertiary: "#161622",
        },
        surface: {
          DEFAULT: "#1A1A26",
          hover: "#222232",
          active: "#2A2A3E",
          border: "rgba(255, 255, 255, 0.08)",
          glass: "rgba(26, 26, 38, 0.65)",
        },
        brand: {
          violet: "#7C3AED",
          pink: "#EC4899",
          amber: "#F59E0B",
          purple: "#9333EA",
          rose: "#F43F5E",
        },
        content: {
          primary: "#F5F5F7",
          secondary: "#A1A1AA",
          muted: "#71717A",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Playfair Display", "Poppins", "serif"],
        body: ["var(--font-body)", "Inter", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 25px -5px rgba(124, 58, 237, 0.35)",
        "glow-pink": "0 0 25px -5px rgba(236, 72, 153, 0.35)",
        "glow-amber": "0 0 25px -5px rgba(245, 158, 11, 0.3)",
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "accent-gradient": "linear-gradient(135deg, #7C3AED 0%, #EC4899 50%, #F59E0B 100%)",
        "accent-gradient-hover": "linear-gradient(135deg, #6D28D9 0%, #DB2777 50%, #D97706 100%)",
        "card-gradient": "linear-gradient(180deg, rgba(26, 26, 38, 0.8) 0%, rgba(17, 17, 26, 0.95) 100%)",
      },
      animation: {
        "float-slow": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2.5s infinite linear",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-12px) rotate(2deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
