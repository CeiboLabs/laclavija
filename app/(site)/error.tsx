"use client";

import * as React from "react";

/**
 * Error boundary del route group (site). Loguea el error real que Next.js
 * enmascara en prod. Reemplaza cualquier 500 dentro de /(site) con esta UI.
 */
export default function SiteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // eslint-disable-next-line no-console
    console.error("[SiteError] Full error:", {
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack?.split("\n").slice(0, 15).join("\n"),
    });
  }, [error]);

  return (
    <div style={{ padding: "4rem 2rem", background: "#0A0A0A", color: "#F5F5F5", minHeight: "100vh" }}>
      <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>Ups, algo se rompió</h1>
      <p style={{ opacity: 0.7, marginBottom: "2rem" }}>Estamos revisándolo.</p>
      {error.digest ? (
        <p style={{ fontSize: "0.7rem", opacity: 0.4, fontFamily: "monospace", marginBottom: "2rem" }}>
          digest: {error.digest}
        </p>
      ) : null}
      <button
        onClick={reset}
        style={{
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
    </div>
  );
}
