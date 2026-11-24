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
    } catch (err) {
      console.warn("Storage or URL access restricted in useBlogTheme:", err);
      return "dark";
    }
  });

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.style.colorScheme = theme;
    }
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (err) {
      console.warn("LocalStorage save failed for blog theme:", err);
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
