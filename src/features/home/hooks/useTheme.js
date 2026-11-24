import { useState, useEffect, useCallback, useMemo } from "preact/hooks";

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
    } catch (err) {
      console.warn("LocalStorage read failed for theme:", err);
    }
    return "nord";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (err) {
      console.warn("LocalStorage write failed for theme:", err);
    }
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme((prev) => (prev === "nord" ? "everforest" : "nord"));
  }, []);

  const currentTheme = useMemo(
    () => THEMES.find((t) => t.id === theme) || THEMES[0],
    [theme]
  );

  return {
    theme,
    setTheme,
    cycleTheme,
    currentTheme,
    THEMES,
  };
};
