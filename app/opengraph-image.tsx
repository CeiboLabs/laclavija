import { ImageResponse } from "next/og";
import { BUSINESS } from "@/lib/constants";

export const alt = `${BUSINESS.name} — Guitarras en Montevideo`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Logo embebido como data URL: render offline, sin depender de la red.
// IMPORTANTE: lazy — hacer readFileSync a nivel de módulo rompe el import
// del módulo en Cloudflare Workers (no hay filesystem en runtime), y como
// Next importa este módulo al resolver metadata de cualquier página dinámica,
// hace que TODAS las rutas dinámicas tiren "Server Components render" error.
async function getLogoSrc() {
  const { readFileSync } = await import("node:fs");
  const { join } = await import("node:path");
  const logoData = readFileSync(join(process.cwd(), "public/brand/la-clavija-logo.png"));
  return `data:image/png;base64,${logoData.toString("base64")}`;
}

export default async function OpengraphImage() {
  const logoSrc = await getLogoSrc();
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          gap: 56,
          padding: "0 96px",
          background: "#0A0A0A",
          color: "#F0E8DA",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoSrc}
          alt=""
          width={300}
          height={300}
          style={{ borderRadius: 24 }}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              fontSize: 28,
              letterSpacing: 8,
              textTransform: "uppercase",
              color: "#CBA35C",
            }}
          >
            Montevideo · Uruguay
          </div>
          <div
            style={{
              fontSize: 116,
              lineHeight: 1,
              marginTop: 16,
              fontWeight: 700,
            }}
          >
            La Clavija
          </div>
          <div
            style={{
              fontSize: 34,
              marginTop: 28,
              color: "#C9C2B5",
              maxWidth: 560,
            }}
          >
            Compra, venta y permuta de guitarras seleccionadas.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
