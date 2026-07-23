import { FilterForm } from "./filter-form";

export function FilterSidebar({ brands }: { brands: string[] }) {
  return (
    <aside className="hidden lg:block w-64 shrink-0 sticky top-24 self-start max-h-[calc(100dvh-7rem)] overflow-y-auto pr-2">
      <p className="text-xs uppercase tracking-[0.3em] text-accent mb-6">Filtros</p>
      <FilterForm brands={brands} />
    </aside>
  );
}
