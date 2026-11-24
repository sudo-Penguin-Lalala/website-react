import { render } from "preact";
import App from "./App.jsx";
import { loadAnalytics } from "./lib/analytics";

render(<App />, document.getElementById("root"));

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
    }).catch((err) => {
      console.warn("ServiceWorker unregistration failed:", err);
    });
  } catch (err) {
    console.warn("ServiceWorker getRegistrations failed:", err);
  }
}

if (typeof window !== "undefined" && "caches" in window) {
  try {
    caches.keys().then((keys) => {
      keys.forEach((key) => caches.delete(key));
    }).catch((err) => {
      console.warn("Cache deletion failed:", err);
    });
  } catch (err) {
    console.warn("Cache access failed:", err);
  }
}
