/**
 * Datos del negocio. Cambiar acá una vez y se propaga al sitio.
 */
export const BUSINESS = {
  name: "La Clavija",
  tagline: "Guitarras seleccionadas. Compra, venta y permuta en Montevideo.",
  // Descripción larga para structured data / meta description del home.
  description:
    "La Clavija: compra, venta y permuta de guitarras eléctricas, acústicas, clásicas, bajos y amplificadores en Montevideo, Uruguay. Instrumentos seleccionados, tasación rápida y pago en efectivo o transferencia. Coordinamos entrega en Montevideo y hacemos envíos a todo el país.",
  city: "Montevideo, Uruguay",
  address: "Por consulta — coordinar entrega",
  // El negocio no tiene local: se coordina entrega. areaServed para SEO local.
  areaServed: ["Montevideo", "Uruguay"],
  addressLocality: "Montevideo",
  addressRegion: "Montevideo",
  country: "UY",
  instagram: "https://instagram.com/laclavijauy",
  // Sin + ni espacios. Ejemplo válido: 59899123456
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "59898125667",
  // Coordenadas placeholder (Centro de Montevideo). Reemplazar por la real.
  location: { lat: -34.9011, lng: -56.1645 },
  yearsInBusiness: 12,
};

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export function whatsappLink(message?: string) {
  const base = `https://wa.me/${BUSINESS.whatsappNumber}`;
  if (!message) return base;
  return `${base}?text=${encodeURIComponent(message)}`;
}

export const NAV_LINKS = [
  { href: "/catalogo", label: "Catálogo" },
  { href: "/vender", label: "Vender" },
  // Reparaciones desactivado temporalmente (2026-08-02). Descomentar para reactivar
  // + renombrar `app/(site)/_reparaciones` a `reparaciones` + reactivar en sitemap,
  // command-palette, workshop-note, robots.ts (sacar disallow), keywords home.
  // { href: "/reparaciones", label: "Reparaciones" },
  { href: "/blog", label: "Blog" },
  { href: "/nosotros", label: "Nosotros" },
] as const;
