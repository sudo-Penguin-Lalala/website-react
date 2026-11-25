function isSafeHttpsUrl(rawUrl) {
  try {
    const parsed = new URL(rawUrl, window.location.origin);
    return parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function loadAnalytics() {
  if (typeof document === "undefined") return;
  if (!import.meta.env.PROD) return;

  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const plausibleSrc = import.meta.env.VITE_PLAUSIBLE_SRC;
  if (plausibleDomain && plausibleSrc && isSafeHttpsUrl(plausibleSrc)) {
    const s = document.createElement("script");
    s.defer = true;
    s.dataset.domain = plausibleDomain;
    s.src = plausibleSrc;
    document.head.appendChild(s);
    return;
  }

  const umamiId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  const umamiSrc = import.meta.env.VITE_UMAMI_SRC;
  if (umamiId && umamiSrc && isSafeHttpsUrl(umamiSrc)) {
    const s = document.createElement("script");
    s.defer = true;
    s.dataset.websiteId = umamiId;
    s.src = umamiSrc;
    document.head.appendChild(s);
  }
}
