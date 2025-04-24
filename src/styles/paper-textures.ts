/**
 * Paper textures and patterns for note backgrounds
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
  aged: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' viewBox='0 0 800 800'%3E%3Cdefs%3E%3CradialGradient id='a' cx='400' cy='400' r='50%25' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ffffff'/%3E%3Cstop offset='1' stop-color='%23f8f4e8'/%3E%3C/radialGradient%3E%3CradialGradient id='b' cx='400' cy='400' r='70%25' gradientUnits='userSpaceOnUse'%3E%3Cstop offset='0' stop-color='%23ffffff'/%3E%3Cstop offset='1' stop-color='%23f8f1dd'/%3E%3C/radialGradient%3E%3C/defs%3E%3Crect fill='url(%23a)' width='800' height='800'/%3E%3Cg fill-opacity='0.04'%3E%3Ccircle fill='%23815428' cx='267.5' cy='61' r='300'/%3E%3Ccircle fill='%23815428' cx='532.5' cy='61' r='300'/%3E%3Ccircle fill='%23815428' cx='400' cy='30' r='300'/%3E%3C/g%3E%3C/svg%3E")`,
};

// Paper color variations
export const paperColors = {
  default: "#fffdf7",
  cream: "#fffaeb",
  yellow: "#fffbe6",
  blue: "#f0f7ff",
  pink: "#fff0f7",
  green: "#f0fff4",
};

// Corner fold SVG for paper effect
export const cornerFoldSVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32" fill="none">
  <path d="M32 0V32H0C0 14.3 14.3 0 32 0Z" fill="rgba(0,0,0,0.03)"/>
  <path d="M32 0V32H16C16 23.2 23.2 16 32 16V0Z" fill="rgba(0,0,0,0.02)"/>
</svg>`;
