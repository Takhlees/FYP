// components/Theme-provider.js
"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeProviderContext = createContext({
  theme: "light",
  setTheme: () => null,
});

export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "ui-theme",
  attribute = "class",
  enableSystem = true,
  ...props
}) {
  const [theme, setTheme] = useState(defaultTheme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    try {
      const storedTheme = localStorage.getItem(storageKey);
      
      if (storedTheme && (storedTheme === "light" || storedTheme === "dark")) {
        setTheme(storedTheme);
      } else if (enableSystem) {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        setTheme(systemTheme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  }, [storageKey, enableSystem]);

  useEffect(() => {
    if (!mounted) return;

    try {
      const root = window.document.documentElement;
      
      // Remove existing theme classes
      root.classList.remove("light", "dark");

      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
          ? "dark"
          : "light";
        root.classList.add(systemTheme);
        root.setAttribute("data-theme", systemTheme);
      } else {
        root.classList.add(theme);
        root.setAttribute("data-theme", theme);
      }

      localStorage.setItem(storageKey, theme);
    } catch (error) {
      console.error("Error applying theme:", error);
    }
  }, [theme, mounted, storageKey]);

  const value = {
    theme,
    setTheme: (newTheme) => {
      setTheme(newTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext);

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider");

  return context;
};