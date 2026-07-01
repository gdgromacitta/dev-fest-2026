"use client";

import { useEffect } from "react";

/**
 * Registers /sw.js on mount. Degrades gracefully on browsers that do not
 * support the Service Worker API — no crash, no broken UI.
 */
export function ServiceWorkerRegistration() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        // Registration failure is non-fatal; the site works without it.
      });
    }
  }, []);

  return null;
}
