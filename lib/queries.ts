import { createPublicSupabase } from "./supabase/public";
import { publicImageUrl } from "./supabase/storage";
import type { Guitar, GuitarSpecs, GuitarStatus, GuitarType, ProductCategory } from "./types";

export type CatalogSort =
  | "recent"
  | "price-asc"
  | "price-desc"
  | "year-desc"
  | "year-asc";

export type CatalogFilters = {
  category?: ProductCategory;
  type?: GuitarType;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  minYear?: number;
  maxYear?: number;
  status?: GuitarStatus;
  q?: string;
  sort?: CatalogSort;
};

type GuitarRow = {
  id: string;
  slug: string;
  brand: string;
  model: string;
  year: number | null;
  category: ProductCategory;
  type: GuitarType | null;
  price_usd: number | null;
  price_uyu: number | null;
  discount_percent: number | null;
  status: GuitarStatus;
  featured: boolean;
  short_description: string;
  long_description: string;
  specs: GuitarSpecs;
  created_at: string;
  guitar_images: { storage_path: string; position: number }[];
};

function rowToGuitar(row: GuitarRow): Guitar {
  const images = [...row.guitar_images]
    .sort((a, b) => a.position - b.position)
    .map((i) => publicImageUrl(i.storage_path));
  return {
    id: row.id,
    slug: row.slug,
    brand: row.brand,
    model: row.model,
    year: row.year,
    category: row.category ?? "guitar",
    type: row.type,
    price_usd: row.price_usd,
    price_uyu: row.price_uyu,
    discount_percent: row.discount_percent,
    status: row.status,
    featured: row.featured,
    short_description: row.short_description,
    long_description: row.long_description,
    specs: row.specs,
    images,
    created_at: row.created_at,
  };
}

const SELECT_GUITAR = `
  id, slug, brand, model, year, category, type, price_usd, price_uyu, discount_percent, status, featured,
  short_description, long_description, specs, created_at,
  guitar_images ( storage_path, position )
`;

/** Últimos productos ingresados (cualquier categoría). Se usa para el marquee del header. */
export async function getLatestProducts(limit = 8): Promise<Guitar[]> {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("guitars")
    .select(SELECT_GUITAR)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[getLatestProducts]", error.message);
    return [];
  }
  return (data as unknown as GuitarRow[]).map(rowToGuitar);
}

/** Últimas vendidas — para el marquee del footer ("recién vendidas"). */
export async function getRecentlySold(limit = 6): Promise<Guitar[]> {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("guitars")
    .select(SELECT_GUITAR)
    .eq("status", "sold")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[getRecentlySold]", error.message);
    return [];
  }
  return (data as unknown as GuitarRow[]).map(rowToGuitar);
}

export async function getFeaturedGuitars(limit = 4): Promise<Guitar[]> {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("guitars")
    .select(SELECT_GUITAR)
    .eq("featured", true)
    .eq("status", "available")
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[getFeaturedGuitars]", error.message);
    return [];
  }
  return (data as unknown as GuitarRow[]).map(rowToGuitar);
}

export async function getCatalog(filters: CatalogFilters = {}): Promise<Guitar[]> {
  const supabase = createPublicSupabase();
  let q = supabase.from("guitars").select(SELECT_GUITAR);

  if (filters.category) q = q.eq("category", filters.category);
  if (filters.type) q = q.eq("type", filters.type);
  if (filters.status) q = q.eq("status", filters.status);
  if (filters.brand) q = q.ilike("brand", filters.brand);
  if (typeof filters.minPrice === "number") q = q.gte("price_usd", filters.minPrice);
  if (typeof filters.maxPrice === "number") q = q.lte("price_usd", filters.maxPrice);
  if (typeof filters.minYear === "number") q = q.gte("year", filters.minYear);
  if (typeof filters.maxYear === "number") q = q.lte("year", filters.maxYear);
  if (filters.q) {
    const escaped = filters.q.replace(/[%,]/g, " ");
    q = q.or(`brand.ilike.%${escaped}%,model.ilike.%${escaped}%`);
  }

  const sort = filters.sort ?? "recent";
  let sorted;
  if (sort === "price-asc") sorted = q.order("price_usd", { ascending: true, nullsFirst: false });
  else if (sort === "price-desc") sorted = q.order("price_usd", { ascending: false, nullsFirst: false });
  else if (sort === "year-desc") sorted = q.order("year", { ascending: false, nullsFirst: false });
  else if (sort === "year-asc") sorted = q.order("year", { ascending: true, nullsFirst: false });
  else sorted = q;
  sorted = sorted.order("created_at", { ascending: false });

  const { data, error } = await sorted;
  if (error) {
    console.error("[getCatalog]", error.message);
    return [];
  }
  return (data as unknown as GuitarRow[]).map(rowToGuitar);
}

export async function getAllBrands(): Promise<string[]> {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase.from("guitars").select("brand");
  if (error) {
    console.error("[getAllBrands]", error.message);
    return [];
  }
  const set = new Set((data ?? []).map((r) => r.brand as string));
  return Array.from(set).sort((a, b) => a.localeCompare(b));
}

export async function getGuitarBySlug(slug: string): Promise<Guitar | null> {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("guitars")
    .select(SELECT_GUITAR)
    .eq("slug", slug)
    .maybeSingle();
  if (error) {
    console.error("[getGuitarBySlug]", error.message);
    return null;
  }
  if (!data) return null;
  return rowToGuitar(data as unknown as GuitarRow);
}

export async function getAllSlugs(): Promise<{ slug: string }[]> {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase.from("guitars").select("slug");
  if (error) {
    console.error("[getAllSlugs]", error.message);
    return [];
  }
  return (data ?? []).map((r) => ({ slug: r.slug as string }));
}

export async function getSimilarGuitars(guitar: Guitar, limit = 3): Promise<Guitar[]> {
  const supabase = createPublicSupabase();
  let q = supabase
    .from("guitars")
    .select(SELECT_GUITAR)
    .eq("category", guitar.category)
    .eq("status", "available")
    .neq("id", guitar.id);
  if (guitar.category === "guitar" && guitar.type) q = q.eq("type", guitar.type);
  const { data, error } = await q
    .order("created_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.error("[getSimilarGuitars]", error.message);
    return [];
  }
  return (data as unknown as GuitarRow[]).map(rowToGuitar);
}

// Promo modal
export type PromoConfig = {
  active: boolean;
  title: string;
  message: string;
  cta_label: string | null;
  cta_url: string | null;
  expires_at: string | null;
  image_path: string | null;
  updated_at: string;
};

export async function getPromoConfig(): Promise<PromoConfig | null> {
  const supabase = createPublicSupabase();
  const { data, error } = await supabase
    .from("promo_config")
    .select("active, title, message, cta_label, cta_url, expires_at, image_path, updated_at")
    .eq("id", 1)
    .maybeSingle();
  if (error) {
    console.error("[getPromoConfig]", error.message);
    return null;
  }
  return (data as PromoConfig | null) ?? null;
}
