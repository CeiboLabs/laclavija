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
 * Precio para mostrar en el sitio. Solo UYU es visible al público — USD queda
 * en la DB y en los helpers `formatUsd`/`applyDiscount` para uso interno.
 */
export function formatPrice(opts: {
  usd?: number | null;
  uyu?: number | null;
}): string {
  if (typeof opts.uyu === "number") return formatUyu(opts.uyu);
  return "Consultar";
}

/** Alias del precio principal — mantengo la firma para no romper call sites. */
export function formatPrimaryPrice(opts: {
  usd?: number | null;
  uyu?: number | null;
}): string {
  return formatPrice(opts);
}

/** No hay precio secundario visible (todo es UYU). */
export function formatSecondaryPrice(_opts: {
  usd?: number | null;
  uyu?: number | null;
}): string | null {
  return null;
}

const GUITAR_TYPE_LABELS: Record<string, string> = {
  electric: "Eléctrica",
  acoustic: "Acústica",
  classical: "Clásica",
  bass: "Bajo",
};

export function guitarTypeLabel(type: string | null | undefined) {
  if (!type) return "";
  return GUITAR_TYPE_LABELS[type] ?? type;
}

const CATEGORY_LABELS: Record<string, string> = {
  guitar: "Guitarra",
  amp: "Amplificador",
  accessory: "Accesorio",
};

export function categoryLabel(category: string) {
  return CATEGORY_LABELS[category] ?? category;
}

const STATUS_LABELS: Record<string, string> = {
  available: "Disponible",
  reserved: "Reservada",
  sold: "Vendida",
};

export function statusLabel(status: string) {
  return STATUS_LABELS[status] ?? status;
}

