import { useState, useEffect } from "react";

export const THEMES = [
  { id: "nord", name: "Nordic Frost", icon: "❄️" },
  { id: "catppuccin", name: "Catppuccin", icon: "🌸" },
  { id: "everforest", name: "Everforest", icon: "🌲" },
  { id: "amber", name: "NetCheck", icon: "⚡" },
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
    setTheme((prev) => {
      const idx = THEMES.findIndex((t) => t.id === prev);
      const nextIdx = (idx + 1) % THEMES.length;
      return THEMES[nextIdx].id;
    });
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
