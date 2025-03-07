/** @type {import('tailwindcss').Config} */
export const content = [
  "./pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./components/**/*.{js,ts,jsx,tsx,mdx}",
  "./app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    colors: {
      primary: "#00474E",  
      secondary: "#006D77", 
      mid: "#1E7D84",
      dark: "#532B88",
      accent: "#9B72CF", 
      deep: "#C8B1E4",
      purple: "#E1D3F0",
      light: "#F4EFFA", 
    }
  }
};
export const plugins = [];
