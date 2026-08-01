import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GuitarForm } from "@/components/admin/guitar-form";
import { createGuitarAction } from "../actions";

export default function NewGuitarPage() {
  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl">
      <Link
        href="/admin/guitarras"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="size-3" />
        Volver
      </Link>
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Nuevo producto</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight mb-2">Crear</h1>
      <p className="text-sm text-muted-foreground mb-10">
        Elegí la categoría y cargá los datos básicos. Una vez creado vas a poder subir fotos.
      </p>
      <GuitarForm action={createGuitarAction} submitLabel="Crear" mode="create" />
    </div>
  );
}
