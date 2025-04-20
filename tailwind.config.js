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


export const darkMode = 'class';
export const content = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    animation: {
      bubble: 'bubble 20s infinite',
    },
    keyframes: {
      bubble: {
        '0%': { transform: 'translateY(0) scale(1)' },
        '50%': { transform: 'translateY(-100px) scale(1.1)' },
        '100%': { transform: 'translateY(0) scale(1)' },
      },
    },
    colors: {
      dark: "rgb(0, 35, 38)" ,
      primary: "rgb(0, 61, 67)",  
      accent: "rgb(0, 85, 93)" ,
      secondary: "rgb(101, 117, 138)", 
      deep: "rgb(243, 243, 244)",
      mid: "rgb(31,70, 152)",
      light: "rgb(41, 95, 223)"
    }
  },
  plugins: [],
};

