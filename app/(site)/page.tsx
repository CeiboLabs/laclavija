import type { Metadata } from "next";
import { Hero } from "@/components/home/hero";
import { FeaturedGrid } from "@/components/home/featured-grid";
import { HowWeWork } from "@/components/home/how-we-work";
import { SellCta } from "@/components/home/sell-cta";
import { AtmosphereStrip } from "@/components/decor/atmosphere-strip";
import { getFeaturedGuitars } from "@/lib/queries";
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
  ],
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const featured = await getFeaturedGuitars(4);
  const hero = featured[0] ?? null;

  return (
    <>
      <Hero guitar={hero} />
      <FeaturedGrid guitars={featured} />
      <AtmosphereStrip
        src="/decor/playing-dark.webp"
        alt="Guitarrista tocando una acústica"
        quote="Pasamos más tiempo escuchando guitarras que vendiéndolas."
        attribution="— Del taller"
        align="left"
      />
      <HowWeWork />
      <SellCta />
    </>
  );
}
