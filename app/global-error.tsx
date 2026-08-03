"use client";

import * as React from "react";

/**
 * Global error boundary — loguea a Cloudflare Observability el error real
 * (que Next.js oculta en prod). Corre en client pero también captura errores
 * de SSR que llegan al cliente vía server components.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[GlobalError] Full error:", {
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang="es">
      <body style={{ background: "#0A0A0A", color: "#F5F5F5", fontFamily: "system-ui", padding: "3rem" }}>
        <h1 style={{ fontSize: "2rem" }}>Algo falló</h1>
        <p style={{ marginTop: "1rem", opacity: 0.7 }}>
          Estamos revisando. Podés intentar recargar la página.
        </p>
        {error.digest ? (
          <p style={{ marginTop: "1rem", fontSize: "0.75rem", opacity: 0.5, fontFamily: "monospace" }}>
            digest: {error.digest}
          </p>
        ) : null}
        <button
          onClick={reset}
          style={{
            marginTop: "2rem",
            padding: "0.75rem 1.5rem",
            background: "#C8A15F",
            color: "#000",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Reintentar
        </button>
      </body>
    </html>
  );
}
