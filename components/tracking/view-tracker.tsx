"use client";

import * as React from "react";

/**
 * Registra una "view" del detalle de guitarra del lado del cliente.
 * Dedupe local: una view por guitarra por sesión de browser
 * (sessionStorage) — evita inflar contadores con refreshes seguidos.
 */
export function ViewTracker({ guitarId }: { guitarId: string }) {
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const key = `lc-viewed:${guitarId}`;
    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      // sessionStorage puede no estar disponible (modo privado estricto). Seguimos.
    }
    const url = "/api/track";
    const payload = JSON.stringify({ guitarId, kind: "view" });
    // sendBeacon es ideal: fire-and-forget, no cancela la navegación.
    if (navigator.sendBeacon) {
      const blob = new Blob([payload], { type: "application/json" });
      navigator.sendBeacon(url, blob);
      return;
    }
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  }, [guitarId]);

  return null;
}
