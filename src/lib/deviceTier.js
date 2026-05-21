const LOW_EFFECTIVE_TYPES = new Set(["slow-2g", "2g", "3g"]);

export function detectDeviceTier() {
  if (typeof window === "undefined") return "normal";

  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
    return "low";
  }

  const connection =
    navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  if (connection) {
    if (connection.saveData) return "low";
    if (LOW_EFFECTIVE_TYPES.has(connection.effectiveType)) return "low";
  }

  if (typeof navigator.deviceMemory === "number" && navigator.deviceMemory < 4) {
    return "low";
  }

  if (
    typeof navigator.hardwareConcurrency === "number" &&
    navigator.hardwareConcurrency > 0 &&
    navigator.hardwareConcurrency < 4
  ) {
    return "low";
  }

  return "normal";
}

export function applyDeviceTier() {
  const tier = detectDeviceTier();
  if (typeof document !== "undefined") {
    document.documentElement.setAttribute("data-tier", tier);
  }
  return tier;
}
