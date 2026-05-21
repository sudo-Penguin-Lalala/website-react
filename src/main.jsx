import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./styles/tokens.css";
import "./styles/low-perf.css";
import "./index.css";
import App from "./App.jsx";
import { loadAnalytics } from "./lib/analytics";
import { applyDeviceTier } from "./lib/deviceTier";

applyDeviceTier();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);

loadAnalytics();

// Unregister any previously installed service worker and purge its caches.
// We removed the SW because aggressive caching was serving stale builds.
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.getRegistrations().then((regs) => {
    regs.forEach((reg) => reg.unregister());
  });
  if ("caches" in window) {
    caches.keys().then((keys) => keys.forEach((key) => caches.delete(key)));
  }
}
