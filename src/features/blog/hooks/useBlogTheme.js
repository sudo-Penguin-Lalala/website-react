import { useState, useEffect } from "preact/hooks";

const STORAGE_KEY = "nnt:blog_reading_theme";

export function useBlogTheme() {
  const [theme, setTheme] = useState(() => {
    try {
      const urlParam = new URLSearchParams(window.location.search).get("theme");
      if (urlParam === "light" || urlParam === "dark") return urlParam;
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "light" || saved === "dark") return saved;
      return window.matchMedia?.("(prefers-color-scheme: light)").matches
        ? "light"
        : "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // Ignore storage errors in restricted contexts
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return {
    theme,
    toggleTheme,
    isDark: theme === "dark",
  };
}
