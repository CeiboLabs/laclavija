import { NextResponse } from "next/server";
import { getCatalog } from "@/lib/queries";

export const revalidate = 60;

export async function GET() {
  const guitars = await getCatalog({ status: "available" });
  const items = guitars.map((g) => ({
    slug: g.slug,
    brand: g.brand,
    model: g.model,
    year: g.year,
    type: g.type,
    price_uyu: g.price_uyu,
    image: g.images[0] ?? null,
  }));
  return NextResponse.json({ items });
}
