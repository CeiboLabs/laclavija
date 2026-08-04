import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { PromoModal } from "@/components/promo/promo-modal";
import { JsonLd } from "@/components/seo/json-ld";
import { getPromoConfig } from "@/lib/queries";
import { localBusinessSchema, websiteSchema } from "@/lib/seo";
import { publicImageUrl } from "@/lib/supabase/storage";

// TODO: cuando se resuelva el BAILOUT del SSG, volver a SSG normal para
// aprovechar el KV cache. Por ahora dynamic para que Footer.marquee
// (getRecentlySold) refleje cambios de la DB en cada request.
export const dynamic = "force-dynamic";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const promo = await getPromoConfig();

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
