import type { Metadata } from "next";
import { HeroV2 } from "@/components/home/hero-v2";
import { LatestArrivals } from "@/components/home/latest-arrivals";
import { WorkshopNote } from "@/components/home/workshop-note";
import { TopMarquee } from "@/components/layout/top-marquee";
import { getLatestProducts } from "@/lib/queries";
import { BUSINESS } from "@/lib/constants";

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
  console.log("[HomePage] starting");
  let latest: Awaited<ReturnType<typeof getLatestProducts>> = [];
  try {
    latest = await getLatestProducts(3);
    console.log("[HomePage] fetched", { count: latest.length });
  } catch (err) {
    console.error("[HomePage] getLatestProducts threw:", err instanceof Error ? { name: err.name, message: err.message, stack: err.stack } : err);
  }

  return (
    <>
      <HeroV2 />
      <TopMarquee />
      <LatestArrivals products={latest} />
      <WorkshopNote />
    </>
  );
}
