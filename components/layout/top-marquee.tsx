import Link from "next/link";
import { Marquee } from "@/components/decor/marquee";
import { getLatestProducts } from "@/lib/queries";
import { categoryLabel, guitarTypeLabel } from "@/lib/format";

/**
 * Marquee ambient debajo del header con los últimos productos ingresados.
 * Server component — hidrata en SSR con la data de Supabase.
 */
export async function TopMarquee() {
  const items = await getLatestProducts(8);
  if (items.length === 0) return null;

  return (
    <div className="relative border-b border-dashed border-border/60 bg-card/30">
      {/* Label fijo a la izquierda — no entra al loop del marquee */}
      <div className="absolute inset-y-0 left-0 z-10 flex items-center pl-5 sm:pl-8 pr-4 bg-card/95 backdrop-blur">
        <span className="mono-meta text-accent">Últimos ingresos</span>
        <span aria-hidden className="ml-3 text-muted-foreground/50">·</span>
      </div>
      {/* Espaciador virtual para que el marquee arranque después del label */}
      <div className="pl-[10rem] sm:pl-[12rem]">
        <Marquee ariaLabel="Últimos ingresos">
          {items.map((g) => {
            const typeOrCat =
              g.category === "guitar" ? guitarTypeLabel(g.type) : categoryLabel(g.category);
            return (
              <Link
                key={g.id}
                href={`/catalogo/${g.slug}`}
                className="group inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <span className="text-foreground/90">
                  {g.brand} <span className="text-muted-foreground">{g.model}</span>
                </span>
                {typeOrCat ? (
                  <span className="mono-meta text-[0.6rem] opacity-70">{typeOrCat}</span>
                ) : null}
                <span aria-hidden className="text-muted-foreground/50">·</span>
              </Link>
            );
          })}
        </Marquee>
      </div>
    </div>
  );
}
