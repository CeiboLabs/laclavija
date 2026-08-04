import type { Metadata } from "next";
import { HeroV2 } from "@/components/home/hero-v2";
import { LatestArrivals } from "@/components/home/latest-arrivals";
import { WorkshopNote } from "@/components/home/workshop-note";
import { TopMarquee } from "@/components/layout/top-marquee";
import { getLatestProducts } from "@/lib/queries";
import { BUSINESS } from "@/lib/constants";

// Revalida el HTML cacheado en KV cada 60s. Ademas, revalidatePath() desde
// server actions del admin invalida al instante cuando cambia contenido.
export const revalidate = 60;

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
