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
    colors: {
      dark: "rgb(0, 35, 38)" ,
      primary: "rgb(0, 61, 67)",  
      accent: "rgb(0, 85, 93)" ,
      secondary: "rgb(0, 109, 119)", 
      deep: "rgb(15, 117, 126)",
      mid: "rgb(30, 125, 132)",
      light: "rgb(73, 156, 164)"
    }
  }
};
export const plugins = [];
