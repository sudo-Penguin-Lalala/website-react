export function loadAnalytics() {
  if (typeof document === "undefined") return;
  if (!import.meta.env.PROD) return;

  const plausibleDomain = import.meta.env.VITE_PLAUSIBLE_DOMAIN;
  const plausibleSrc = import.meta.env.VITE_PLAUSIBLE_SRC;
  if (plausibleDomain && plausibleSrc) {
    const s = document.createElement("script");
    s.defer = true;
    s.dataset.domain = plausibleDomain;
    s.src = plausibleSrc;
    document.head.appendChild(s);
    return;
  }

  const umamiId = import.meta.env.VITE_UMAMI_WEBSITE_ID;
  const umamiSrc = import.meta.env.VITE_UMAMI_SRC;
  if (umamiId && umamiSrc) {
    const s = document.createElement("script");
    s.defer = true;
    s.dataset.websiteId = umamiId;
    s.src = umamiSrc;
    document.head.appendChild(s);
  }
}
