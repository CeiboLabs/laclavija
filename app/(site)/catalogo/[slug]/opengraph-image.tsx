import { ImageResponse } from "next/og";
import { getAllSlugs, getGuitarBySlug } from "@/lib/queries";
import { formatPrimaryPrice, guitarTypeLabel, statusLabel } from "@/lib/format";

export const alt = "Guitarra en La Clavija";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export async function generateStaticParams() {
  return await getAllSlugs();
}

const CREMA = "#F0E8DA";
const DARK = "#0A0A0A";
const ACCENT = "#CBA35C";
const MUTED = "#C9C2B5";

/** Baja una version chica de la foto desde el render endpoint de Supabase y la
 *  devuelve como data URL. Si falla, null (la tarjeta cae al layout sin foto). */
async function fetchPhotoDataUrl(url: string): Promise<string | null> {
  try {
    const render = url.replace(
      "/storage/v1/object/public/",
      "/storage/v1/render/image/public/",
    );
    const res = await fetch(`${render}?width=640&height=630&resize=cover&quality=80`);
    if (!res.ok) return null;
    const type = res.headers.get("content-type") ?? "image/jpeg";
    const buf = Buffer.from(await res.arrayBuffer());
    return `data:${type};base64,${buf.toString("base64")}`;
  } catch {
    return null;
  }
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guitar = await getGuitarBySlug(slug);

  if (!guitar) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: DARK,
            color: CREMA,
            fontSize: 64,
            fontWeight: 700,
          }}
        >
          La Clavija
        </div>
      ),
      size,
    );
  }

  const name = `${guitar.brand} ${guitar.model}`;
  const price = formatPrimaryPrice({ usd: guitar.price_usd, uyu: guitar.price_uyu });
  const photo = guitar.images[0] ? await fetchPhotoDataUrl(guitar.images[0]) : null;
  const isAvailable = guitar.status === "available";

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: DARK }}>
        {/* Panel de texto */}
        <div
          style={{
            width: 600,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 64,
            background: DARK,
            color: CREMA,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 24,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: ACCENT,
              }}
            >
              {guitar.year
                ? `${guitarTypeLabel(guitar.type)} · ${guitar.year}`
                : guitarTypeLabel(guitar.type)}
            </div>
            <div style={{ fontSize: 68, lineHeight: 1.05, marginTop: 20, fontWeight: 700 }}>
              {name}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            {!isAvailable ? (
              <div
                style={{
                  display: "flex",
                  alignSelf: "flex-start",
                  marginBottom: 20,
                  padding: "8px 20px",
                  borderRadius: 999,
                  border: `2px solid ${ACCENT}`,
                  color: ACCENT,
                  fontSize: 22,
                  letterSpacing: 4,
                  textTransform: "uppercase",
                }}
              >
                {statusLabel(guitar.status)}
              </div>
            ) : null}
            <div style={{ fontSize: 52, fontWeight: 700 }}>{price}</div>
            <div style={{ fontSize: 26, marginTop: 28, color: MUTED }}>
              La Clavija · Montevideo
            </div>
          </div>
        </div>

        {/* Foto */}
        <div style={{ width: 600, height: "100%", display: "flex", background: "#1a1a1a" }}>
          {photo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={photo}
              alt=""
              width={600}
              height={630}
              style={{ width: 600, height: 630, objectFit: "cover" }}
            />
          ) : null}
        </div>
      </div>
    ),
    size,
  );
}
