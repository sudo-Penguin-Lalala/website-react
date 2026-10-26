import { useState, useEffect } from "preact/hooks";

export const THEMES = [
  { id: "nord", name: "Nord", icon: "🏔️" },
  { id: "everforest", name: "Forest", icon: "🌲" },
];

const THEME_KEY = "nnt:theme";

export const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      if (saved && THEMES.some((t) => t.id === saved)) {
        return saved;
      }
    } catch {
      // Ignore localStorage access restrictions
    }
    return "nord";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  const cycleTheme = () => {
    setTheme((prev) => (prev === "nord" ? "everforest" : "nord"));
  };

  const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];

  return {
    theme,
    setTheme,
    cycleTheme,
    currentTheme,
    THEMES,
  };
};
