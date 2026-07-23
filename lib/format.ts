const priceFormatter = new Intl.NumberFormat("es-UY", {
  maximumFractionDigits: 0,
});

export function formatUsd(amount: number) {
  return `USD ${priceFormatter.format(amount)}`;
}

export function formatUyu(amount: number) {
  return `$U ${priceFormatter.format(amount)}`;
}

/** Aplica un descuento porcentual (1-99). Si percent es null/0/inválido, devuelve el precio sin tocar. */
export function applyDiscount(price: number | null | undefined, percent: number | null | undefined): number | null {
  if (typeof price !== "number") return null;
  if (typeof percent !== "number" || percent <= 0 || percent >= 100) return price;
  return Math.round(price * (1 - percent / 100));
}

/**
 * Devuelve el precio listo para mostrar en una sola línea.
 * Si están cargados los dos, UYU va primero (es la moneda principal) y
 * USD aparece como referencia secundaria. Si no hay ninguno, "Consultar".
 */
export function formatPrice(opts: {
  usd?: number | null;
  uyu?: number | null;
}): string {
  const parts: string[] = [];
  if (typeof opts.uyu === "number") parts.push(formatUyu(opts.uyu));
  if (typeof opts.usd === "number") parts.push(formatUsd(opts.usd));
  return parts.length ? parts.join(" · ") : "Consultar";
}

/**
 * Devuelve el precio "principal" (el que se muestra en el catálogo).
 * Prioriza UYU si está cargado; si no, USD; si no hay nada, "Consultar".
 */
export function formatPrimaryPrice(opts: {
  usd?: number | null;
  uyu?: number | null;
}): string {
  if (typeof opts.uyu === "number") return formatUyu(opts.uyu);
  if (typeof opts.usd === "number") return formatUsd(opts.usd);
  return "Consultar";
}

/**
 * Devuelve el precio secundario (el otro), o null si no hay dos cargados.
 */
export function formatSecondaryPrice(opts: {
  usd?: number | null;
  uyu?: number | null;
}): string | null {
  if (typeof opts.uyu === "number" && typeof opts.usd === "number") {
    return formatUsd(opts.usd);
  }
  return null;
}

const GUITAR_TYPE_LABELS: Record<string, string> = {
  electric: "Eléctrica",
  acoustic: "Acústica",
  classical: "Clásica",
  bass: "Bajo",
};

export function guitarTypeLabel(type: string) {
  return GUITAR_TYPE_LABELS[type] ?? type;
}

const STATUS_LABELS: Record<string, string> = {
  available: "Disponible",
  reserved: "Reservada",
  sold: "Vendida",
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}
