import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        xs: "0px 1px 2px 0px rgba(16, 24, 40, 0.05)",
        "skeumorphic-inner": "0px -2px 0px 0px rgba(16, 24, 40, 0.05)",
        "skeumorphic-inner-border": "0px 0px 0px 1px rgba(16, 24, 40, 0.18)",
      },
      screens: {
        smx: "420px",
        lp: "960px",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
      },
      animation: {
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      colors: {
        gray: {
          900: "#101828",
          700: "#344054",
          600: "#475467",
          500: "#667085",
          400: "#98A2B3",
          300: "#D0D5DD",
          200: "#E4E7EC",
        },
        brand: {
          800: "#53389E",
          700: "#6941C6",
          600: "#7F56D9",
          500: "#9E77ED",
          300: "#D6BBFB",
          100: "#F4EBFF",
          50: "#F9F5FF",
        },
        green: {
          400: "#32D583",
        },
        success: "#17B26A",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
