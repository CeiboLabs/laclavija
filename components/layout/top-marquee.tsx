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
    <div className="border-b border-dashed border-border/60 bg-card/30">
      <Marquee ariaLabel="Últimos ingresos">
        <span className="mono-meta text-accent">Últimos ingresos</span>
        <span aria-hidden className="text-muted-foreground/50">·</span>
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
  );
}
