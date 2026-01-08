import { useState, useEffect } from "react";

export type Theme = "light" | "dark" | "system";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") return "system";
    const stored = localStorage.getItem("theme") as Theme | null;
    return stored || "system";
  });

  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") return "light";
    
    const stored = localStorage.getItem("theme");
    if (stored === "dark" || stored === "light") {
      return stored;
    }
    
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
        const isDark = e.matches;
        setResolvedTheme(isDark ? "dark" : "light");
        root.style.transition = "color-scheme 0.3s ease, background-color 0.3s ease";
        root.classList.toggle("dark", isDark);
        setTimeout(() => {
          root.style.transition = "";
        }, 300);
      };
      
      updateTheme(mediaQuery);
      mediaQuery.addEventListener("change", updateTheme);
      
      return () => {
        mediaQuery.removeEventListener("change", updateTheme);
      };
    } else {
      const isDark = theme === "dark";
      setResolvedTheme(isDark ? "dark" : "light");
      root.style.transition = "color-scheme 0.3s ease, background-color 0.3s ease";
      root.classList.toggle("dark", isDark);
      setTimeout(() => {
        root.style.transition = "";
      }, 300);
    }
  }, [theme]);

  const setThemeWithTransition = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return {
    theme,
    resolvedTheme,
    setTheme: setThemeWithTransition,
  };
}






