/** Normaliza un nombre de marca a slug URL-safe: "Music Man" -> "music-man". */
export function brandToSlug(brand: string): string {
  return brand
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Devuelve la marca original a partir del slug, buscando en la lista provista. */
export function slugToBrand(slug: string, allBrands: string[]): string | null {
  const target = slug.toLowerCase();
  for (const brand of allBrands) {
    if (brandToSlug(brand) === target) return brand;
  }
  return null;
}
