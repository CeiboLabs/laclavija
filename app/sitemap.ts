import type { MetadataRoute } from "next";
import { getAllBrands, getAllSlugs } from "@/lib/queries";
import { brandToSlug } from "@/lib/brand-slug";
import { SITE_URL } from "@/lib/constants";
import { TYPE_SLUGS } from "@/lib/type-slugs";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/catalogo`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/vender`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/reparaciones`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/nosotros`, lastModified: now, changeFrequency: "yearly", priority: 0.6 },
    { url: `${SITE_URL}/vendidas`, lastModified: now, changeFrequency: "weekly", priority: 0.5 },
  ];

  const [slugs, brands] = await Promise.all([getAllSlugs(), getAllBrands()]);

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

  return [...staticRoutes, ...typeRoutes, ...brandRoutes, ...guitarRoutes];
}
