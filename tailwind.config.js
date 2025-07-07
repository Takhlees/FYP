// /** @type {import('tailwindcss').Config} */
// export const content = [
//   "./pages/**/*.{js,ts,jsx,tsx,mdx}",
//   "./components/**/*.{js,ts,jsx,tsx,mdx}",
//   "./app/**/*.{js,ts,jsx,tsx,mdx}",
// ];
// export const theme = {
//   extend: {
//     colors: {
//       background: "var(--background)",
//       foreground: "var(--foreground)",
//     },
//   },
// };
// export const plugins = [];

// export const darkMode = 'class'



// tailwind.config.js
export const darkMode = 'class'; // ✅ Perfect - this is correct
export const content = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    animation: {
      bubble: 'bubble 20s infinite',
      'fade-in': 'fadeIn 0.5s ease-in-out',
      'slide-in': 'slideIn 0.3s ease-out',
    },
    keyframes: {
      bubble: {
        '0%': { transform: 'translateY(0) scale(1)' },
        '50%': { transform: 'translateY(-100px) scale(1.1)' },
        '100%': { transform: 'translateY(0) scale(1)' },
      },
      fadeIn: {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' },
      },
      slideIn: {
        '0%': { transform: 'translateY(-10px)', opacity: '0' },
        '100%': { transform: 'translateY(0)', opacity: '1' },
      },
    },
    colors: {
      // Your existing brand colors (keep these)
      dark: "rgb(0, 35, 38)",
      primary: "rgb(0, 61, 67)",  
      accent: "rgb(0, 85, 93)",
      secondary: "rgb(101, 117, 138)", 
      deep: "rgb(243, 243, 244)",
      mid: "rgb(31,70, 152)",
      light: "rgb(41, 95, 223)",
      
      // Additional semantic theme colors for better dark mode support
      'theme': {
        'text': {
          'primary': 'rgb(var(--color-text-primary, 0 0 0) / <alpha-value>)',
          'secondary': 'rgb(var(--color-text-secondary, 107 114 128) / <alpha-value>)',
          'muted': 'rgb(var(--color-text-muted, 156 163 175) / <alpha-value>)',
        },
        'bg': {
          'primary': 'rgb(var(--color-bg-primary, 255 255 255) / <alpha-value>)',
          'secondary': 'rgb(var(--color-bg-secondary, 249 250 251) / <alpha-value>)',
          'tertiary': 'rgb(var(--color-bg-tertiary, 243 244 246) / <alpha-value>)',
        },
        'border': {
          'primary': 'rgb(var(--color-border, 209 213 219) / <alpha-value>)',
          'secondary': 'rgb(var(--color-border-light, 229 231 235) / <alpha-value>)',
        }
      },
      
      // Shorthand aliases for quick use
      'surface': 'rgb(var(--color-bg-primary, 255 255 255) / <alpha-value>)',
      'surface-2': 'rgb(var(--color-bg-secondary, 249 250 251) / <alpha-value>)',
      'on-surface': 'rgb(var(--color-text-primary, 0 0 0) / <alpha-value>)',
      'on-surface-variant': 'rgb(var(--color-text-secondary, 107 114 128) / <alpha-value>)',
    },
    transitionProperty: {
      'colors': 'color, background-color, border-color, text-decoration-color, fill, stroke',
      'theme': 'color, background-color, border-color, opacity, transform',
    }
  },
  plugins: [],
};