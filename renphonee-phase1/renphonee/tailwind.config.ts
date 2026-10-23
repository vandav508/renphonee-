import type { Config } from "tailwindcss";
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: { brand: { DEFAULT: "#0A66FF", dark: "#0850C8", soft: "#EAF1FF" } },
      fontFamily: { sans: ["var(--font-jakarta)", "system-ui", "sans-serif"] },
    },
  },
  plugins: [],
} satisfies Config;
