import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/low-perf.css";
import "./index.css";
import App from "./App.jsx";
import { loadAnalytics } from "./lib/analytics";
import { applyDeviceTier } from "./lib/deviceTier";

try {
  applyDeviceTier();
} catch (e) {
  console.warn("Failed to apply device tier:", e);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

try {
  loadAnalytics();
} catch (e) {
  console.warn("Failed to load analytics:", e);
}

// Unregister any previously installed service worker and purge its caches.
// We removed the SW because aggressive caching was serving stale builds.
if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
  try {
    navigator.serviceWorker.getRegistrations().then((regs) => {
      regs.forEach((reg) => reg.unregister());
    }).catch(() => {
      /* ignore */
    });
  } catch {
    /* ignore */
  }
}

if (typeof window !== "undefined" && "caches" in window) {
  try {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    }).catch(() => {
      /* ignore */
    });
  } catch {
    /* ignore */
  }
}
