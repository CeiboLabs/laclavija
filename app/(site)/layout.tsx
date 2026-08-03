import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PromoModal } from "@/components/promo/promo-modal";
import { JsonLd } from "@/components/seo/json-ld";
import { getPromoConfig } from "@/lib/queries";
import { localBusinessSchema, websiteSchema } from "@/lib/seo";
import { publicImageUrl } from "@/lib/supabase/storage";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  // Debug logs para diagnosticar 500 en Cloudflare — quitar después de deploy exitoso
  console.log("[SiteLayout] env check", {
    hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasSupabaseAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
  });

  let promo: Awaited<ReturnType<typeof getPromoConfig>> = null;
  try {
    promo = await getPromoConfig();
  } catch (err) {
    console.error("[SiteLayout] getPromoConfig threw:", err);
  }

  const showPromo =
    promo?.active &&
    (promo.title || promo.message) &&
    (!promo.expires_at || new Date(promo.expires_at).getTime() > Date.now());

  return (
    <div className="flex min-h-dvh flex-col">
      <JsonLd data={[localBusinessSchema(), websiteSchema()]} />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      {showPromo && promo ? (
        <PromoModal
          version={promo.updated_at}
          title={promo.title}
          message={promo.message}
          ctaLabel={promo.cta_label}
          ctaUrl={promo.cta_url}
          imageUrl={promo.image_path ? publicImageUrl(promo.image_path) : null}
        />
      ) : null}
    </div>
  );
}
