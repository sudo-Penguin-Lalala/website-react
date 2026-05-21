import { useEffect, useMemo, useState } from "react";
import { I18nContext } from "./I18nContext";
import { dictionary, supportedLanguages } from "./strings";

const STORAGE_KEY = "nnt:lang";

function detectInitialLang() {
  if (typeof window === "undefined") return "en";

  // 1. User's explicit prior choice always wins.
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored && supportedLanguages.includes(stored)) return stored;

  // 2. Walk the browser's full language preference list, in order.
  //    A user with ["vi-VN", "en-US"] expects Vietnamese; ["en-US", "vi-VN"] expects English.
  const candidates = [];
  if (navigator.languages && navigator.languages.length) {
    candidates.push(...navigator.languages);
  } else if (navigator.language) {
    candidates.push(navigator.language);
  } else if (navigator.userLanguage) {
    candidates.push(navigator.userLanguage);
  }

  for (const tag of candidates) {
    const lower = tag.toLowerCase();
    if (lower.startsWith("vi")) return "vi";
    if (lower.startsWith("en")) return "en";
  }

  // 3. Fallback if no English/Vietnamese in their list.
  return "en";
}

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(detectInitialLang);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", lang);
    }
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, lang);
    }
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      t: dictionary[lang],
      setLang,
      toggle: () => setLang((prev) => (prev === "en" ? "vi" : "en")),
    }),
    [lang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}
