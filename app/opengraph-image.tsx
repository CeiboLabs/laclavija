import { ImageResponse } from "next/og";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { BUSINESS } from "@/lib/constants";

export const alt = `${BUSINESS.name} — Guitarras en Montevideo`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Logo embebido como data URL: render offline, sin depender de la red.
const logoData = readFileSync(
  join(process.cwd(), "public/brand/la-clavija-logo.png"),
);
const logoSrc = `data:image/png;base64,${logoData.toString("base64")}`;

export default function OpengraphImage() {
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
