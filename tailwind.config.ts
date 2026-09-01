import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // The warm plaster wall
        plaster: {
          DEFAULT: "#EAE1CE",
          deep: "#E1D6BE",
          shadow: "#CDBE9F",
        },
        // Paper for polaroid frames and notes
        paper: {
          DEFAULT: "#FBF7EC",
          aged: "#F3ECD9",
          edge: "#E6DBC0",
        },
        // Warm ink for text
        ink: {
          DEFAULT: "#3B3327",
          soft: "#7A6E5B",
          faint: "#A99C85",
        },
        // Accents drawn from the moodboard palette
        terracotta: "#C67B54",
        peach: "#E6B295",
        mustard: "#D4A24A",
        olive: "#7B8A54",
        dusk: "#8BA6B6",
        navy: "#34506B",
        clay: "#8A5A38",
        // Washi tape
        tape: "#EFE6CE",
      },
      fontFamily: {
        hand: ["var(--font-hand)", "cursive"],
        serif: ["var(--font-serif)", "Georgia", "serif"],
        type: ["var(--font-type)", "monospace"],
      },
      boxShadow: {
        // Flat, matte "paper on paper" drops — never realistic lighting.
        paper: "2px 4px 0 rgba(74,58,40,0.08)",
        "paper-lift": "3px 6px 0 rgba(74,58,40,0.12)",
        modal: "4px 8px 0 rgba(74,58,40,0.12)",
      },
      transitionTimingFunction: {
        settle: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
