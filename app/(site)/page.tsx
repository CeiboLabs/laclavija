import type { Metadata } from "next";
import { HeroV2 } from "@/components/home/hero-v2";
import { LatestArrivals } from "@/components/home/latest-arrivals";
import { WorkshopNote } from "@/components/home/workshop-note";
import { TopMarquee } from "@/components/layout/top-marquee";
import { getLatestProducts } from "@/lib/queries";
import { BUSINESS } from "@/lib/constants";

// TODO: cuando se resuelva el BAILOUT_TO_CLIENT_SIDE_RENDERING de la home
// (algun componente hijo hace bailout del SSG y rompe el prerender),
// podemos volver a SSG con revalidate=60 y aprovechar el KV cache.
// Por ahora dynamic para que TopMarquee/LatestArrivals rendericen server-side.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  description: BUSINESS.description,
  keywords: [
    "guitarras Montevideo",
    "guitarras Uruguay",
    "comprar guitarra Montevideo",
    "vender guitarra Uruguay",
    "permuta de guitarras",
    "guitarras usadas",
    // "reparación de guitarras",  // Reparaciones desactivadas temporalmente
    "amplificadores Uruguay",
  ],
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const latest = await getLatestProducts(3);

  return (
    <>
      <HeroV2 />
      <TopMarquee />
      <LatestArrivals products={latest} />
      <WorkshopNote />
    </>
  );
}
