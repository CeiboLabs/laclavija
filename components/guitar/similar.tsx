import { GuitarCard } from "@/components/catalog/guitar-card";
import type { Guitar, GuitarType, ProductCategory } from "@/lib/types";
import { guitarTypeLabel } from "@/lib/format";

export function Similar({
  guitars,
  type,
  category,
}: {
  guitars: Guitar[];
  type: GuitarType | null;
  category: ProductCategory;
}) {
  if (guitars.length === 0) return null;

  const heading =
    category === "amp"
      ? "Más amplificadores en stock"
      : type
        ? `Más ${guitarTypeLabel(type).toLowerCase()}s en stock`
        : "Más guitarras en stock";

  return (
    <section className="border-t border-border pt-16 md:pt-24">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Otras opciones</p>
      <h2 className="mt-3 font-serif text-3xl tracking-tight">{heading}</h2>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-12">
        {guitars.map((g) => (
          <GuitarCard
            key={g.id}
            guitar={g}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          />
        ))}
      </div>
    </section>
  );
}
