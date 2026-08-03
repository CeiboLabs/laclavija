import type { MetadataRoute } from "next";
import { getAllBlogSlugs, getAllBrands, getAllSlugs } from "@/lib/queries";
import { brandToSlug } from "@/lib/brand-slug";
import { SITE_URL } from "@/lib/constants";
import { TYPE_SLUGS } from "@/lib/type-slugs";

// Dinamico — el sitemap incluye guitarras/blogs/marcas de la DB. Con
// staticAssetsIncrementalCache read-only, si es SSG queda pegado al
// snapshot de contenido al momento del build. Dynamic pega a Supabase
// en cada request y refleja lo cargado desde el admin sin re-deploy.
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/vender`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    // Reparaciones desactivado temporalmente — descomentar cuando se reactive
    // { url: `${SITE_URL}/reparaciones`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/nosotros`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/vendidas`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.7 },
  ];

  const [slugs, brands, blogSlugs] = await Promise.all([
    getAllSlugs(),
    getAllBrands(),
    getAllBlogSlugs(),
  ]);

  const guitarRoutes: MetadataRoute.Sitemap = slugs.map((r) => ({
    url: `${SITE_URL}/catalogo/${r.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const brandRoutes: MetadataRoute.Sitemap = brands.map((brand) => ({
    url: `${SITE_URL}/marca/${brandToSlug(brand)}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const typeRoutes: MetadataRoute.Sitemap = TYPE_SLUGS.map((slug) => ({
    url: `${SITE_URL}/tipo/${slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticRoutes, ...typeRoutes, ...brandRoutes, ...guitarRoutes, ...blogRoutes];
}
