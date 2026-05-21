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

if ("serviceWorker" in navigator && import.meta.env.PROD) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}
