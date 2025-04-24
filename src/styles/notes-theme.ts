/**
 * Notes theme constants and styling utilities
 */

// Paper textures as data URLs - no external files needed
export const paperTextures = {
  // Subtle lined paper texture
  lined: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Cpattern id='pattern' patternUnits='userSpaceOnUse' width='100%25' height='24' x='0' y='0'%3E%3Cline x1='0' y1='24' x2='100%25' y2='24' stroke='%23888' stroke-opacity='0.1' stroke-width='1'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='%23fafafa' /%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)' /%3E%3C/svg%3E")`,

  // Grid paper texture
  grid: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Cpattern id='pattern' patternUnits='userSpaceOnUse' width='24' height='24' x='0' y='0'%3E%3Crect width='24' height='24' fill='none' stroke='%23888' stroke-opacity='0.1' stroke-width='1'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='%23fafafa' /%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)' /%3E%3C/svg%3E")`,

  // Dotted paper texture
  dots: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 100 100'%3E%3Cpattern id='pattern' patternUnits='userSpaceOnUse' width='16' height='16' x='0' y='0'%3E%3Ccircle cx='8' cy='8' r='1' fill='%23888' fill-opacity='0.2'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='%23fafafa' /%3E%3Crect width='100%25' height='100%25' fill='url(%23pattern)' /%3E%3C/svg%3E")`,

  // Aged paper texture
  aged: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cdefs%3E%3CradialGradient id='a' cx='400' cy='400' r='50%25' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ffffff'/%3E%3Cstop offset='1' stop-color='%23f8f4e8'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='400' cy='400' r='70%25' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ffffff'/%3E%3Cstop offset='1' stop-color='%23f8f1dd'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='800'/%3E%3Cg fill-opacity='0.04'%3E%3Cpath fill='%23957c3e' d='M769 229L1037 260.9M927 880L731 737 520 660 309 538 40 599 295 764 126.5 879.5 40 599-197 493 102 382-31 229 126.5 79.5-69-63'/%3E%3Cpath fill='%238f7e52' d='M-31 229L237 261 390 382 603 493 308.5 537.5 101.5 381.5M370 905L295 764'/%3E%3Cpath fill='%23a09066' d='M520 660L578 842 731 737 840 599 603 493 520 660 295 764 309 538 390 382 539 269 769 229 577.5 41.5 370 105 295 -36 126.5 79.5 237 261 102 382 40 599 -69 737 127 880'/%3E%3Cpath fill='%23a68d5b' d='M520-140L578.5 42.5 731-63M603 493L539 269 237 261 370 105M902 382L539 269M390 382L102 382'/%3E%3Cpath fill='%23aa8c47' d='M-222 42L126.5 79.5 370 105 539 269 577.5 41.5 927 80 769 229 902 382 603 493 731 737M295-36L577.5 41.5M578 842L295 764M40-201L127 80M102 382L-261 269'/%3E%3C/g%3E%3C/svg%3E")`,
};

// Paper-like colors
export const noteColors = {
  paper: {
    DEFAULT: "#fffdf7",
    cream: "#fffaeb",
    yellow: "#fffbe6",
    blue: "#f0f7ff",
    pink: "#fff0f7",
    green: "#f0fff4",
  },
  ink: {
    DEFAULT: "#2d3748",
    light: "#4a5568",
    faded: "#718096",
  },
  highlighter: {
    yellow: "rgba(255, 226, 102, 0.4)",
    green: "rgba(154, 230, 180, 0.4)",
    blue: "rgba(144, 205, 244, 0.4)",
    pink: "rgba(246, 173, 213, 0.4)",
  },
};

// CSS class helper function
export function noteCardStyle(
  type: "lined" | "grid" | "dots" | "aged" = "lined"
) {
  return {
    backgroundImage: paperTextures[type],
    backgroundSize: type === "aged" ? "cover" : "auto",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
  };
}

// Animation variants for Framer Motion
export const notesAnimations = {
  card: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    hover: {
      y: -3,
      boxShadow:
        "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
    },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  staggerContainer: {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.07 } },
  },
  listItem: {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  },
};

// Paper corner fold SVG
export const cornerFoldSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M32 0V32H0C0 14.3 14.3 0 32 0Z" fill="rgba(0,0,0,0.03)"/>
  <path d="M32 0V32H16C16 23.2 23.2 16 32 16V0Z" fill="rgba(0,0,0,0.02)"/>
</svg>`;

// Paper clip SVG for decoration
export const paperClipSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48" fill="none">
  <path d="M9.5 6C9.5 3.23858 11.7386 1 14.5 1H16.5C19.2614 1 21.5 3.23858 21.5 6V28C21.5 32.4183 17.9183 36 13.5 36H12.5C8.08172 36 4.5 32.4183 4.5 28V8" stroke="#888" stroke-width="2" stroke-linecap="round"/>
</svg>`;

// Pushpin SVG for decoration
export const pushPinSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32" fill="none">
  <circle cx="12" cy="8" r="7" fill="#f87171"/>
  <circle cx="12" cy="8" r="5" fill="#fca5a5"/>
  <rect x="11" y="15" width="2" height="16" rx="1" fill="#888"/>
</svg>`;

// Enhanced tape effect SVG
export const tapeSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="24" viewBox="0 0 60 24" fill="none">
  <rect width="60" height="24" rx="3" fill="rgba(255, 255, 255, 0.5)" />
  <rect width="60" height="24" rx="3" fill="rgba(250, 240, 210, 0.5)" />
  <line x1="10" y1="6" x2="50" y2="6" stroke="rgba(0,0,0,0.07)" />
  <line x1="10" y1="12" x2="50" y2="12" stroke="rgba(0,0,0,0.07)" />
  <line x1="10" y1="18" x2="50" y2="18" stroke="rgba(0,0,0,0.07)" />
</svg>`;

// More paper style variations
export const noteCardColors = {
  default: {
    light: "linear-gradient(to bottom, #ffffff, #fafafa)",
    dark: "linear-gradient(to bottom, #1a1a1a, #151515)",
  },
  yellow: {
    light: "linear-gradient(to bottom, #fffbe6, #fff8cc)",
    dark: "linear-gradient(to bottom, #2a2617, #1e1c14)",
  },
  blue: {
    light: "linear-gradient(to bottom, #f0f7ff, #e6f0ff)",
    dark: "linear-gradient(to bottom, #172331, #131c28)",
  },
  pink: {
    light: "linear-gradient(to bottom, #fff0f7, #ffe6f0)",
    dark: "linear-gradient(to bottom, #311727, #281320)",
  },
  green: {
    light: "linear-gradient(to bottom, #f0fff4, #e6ffe6)",
    dark: "linear-gradient(to bottom, #17312a, #132820)",
  },
};

// Enhanced animation variants
export const enhancedAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.3 },
  },
  popIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    transition: { type: "spring", stiffness: 400, damping: 17 },
  },
  slideIn: {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  noteAppear: {
    initial: { y: 20, opacity: 0, rotateZ: -1 },
    animate: { y: 0, opacity: 1, rotateZ: 0 },
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};
