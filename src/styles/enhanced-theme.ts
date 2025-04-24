/**
 * Enhanced animations and visual effects for the notes app
 */

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

// Decorative element SVGs
export const paperClipSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="48" viewBox="0 0 32 48" fill="none">
  <path d="M9.5 6C9.5 3.23858 11.7386 1 14.5 1H16.5C19.2614 1 21.5 3.23858 21.5 6V28C21.5 32.4183 17.9183 36 13.5 36H12.5C8.08172 36 4.5 32.4183 4.5 28V8" stroke="#888" stroke-width="2" stroke-linecap="round"/>
</svg>`;

export const pushPinSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="32" viewBox="0 0 24 32" fill="none">
  <circle cx="12" cy="8" r="7" fill="#f87171"/>
  <circle cx="12" cy="8" r="5" fill="#fca5a5"/>
  <rect x="11" y="15" width="2" height="16" rx="1" fill="#888"/>
</svg>`;

export const tapeSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="60" height="24" viewBox="0 0 60 24" fill="none">
  <rect width="60" height="24" rx="3" fill="rgba(255, 255, 255, 0.5)" />
  <rect width="60" height="24" rx="3" fill="rgba(250, 240, 210, 0.5)" />
  <line x1="10" y1="6" x2="50" y2="6" stroke="rgba(0,0,0,0.07)" />
  <line x1="10" y1="12" x2="50" y2="12" stroke="rgba(0,0,0,0.07)" />
  <line x1="10" y1="18" x2="50" y2="18" stroke="rgba(0,0,0,0.07)" />
</svg>`;
