import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        signal: {
          DEFAULT: "#F5D547",
          dark: "#E3C22E",
          deep: "#C9A61F",
        },
        charcoal: {
          DEFAULT: "#1F1F1F",
          soft: "#2A2A2A",
        },
        ink: "#111111",
        mist: "#F7F7F7",
      },
      fontFamily: {
        display: ["var(--font-sora)", "sans-serif"],
        body: ["var(--font-inter)", "sans-serif"],
      },
      boxShadow: {
        soft: "0 10px 40px -12px rgba(17,17,17,0.12)",
        card: "0 2px 8px rgba(17,17,17,0.04), 0 20px 40px -20px rgba(17,17,17,0.12)",
      },
      borderRadius: {
        xl2: "1.25rem",
        xl3: "1.75rem",
      },
    },
  },
  plugins: [],
};

export default config;
