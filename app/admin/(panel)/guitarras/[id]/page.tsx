import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ExternalLink } from "lucide-react";
import { GuitarForm } from "@/components/admin/guitar-form";
import { GuitarImages } from "@/components/admin/guitar-images";
import { DeleteGuitarButton } from "@/components/admin/guitar-delete-button";
import { PostCreateToast } from "@/components/admin/post-create-toast";
import { getAdminGuitarById } from "@/lib/admin/queries";
import { updateGuitarAction } from "../actions";

type Search = Record<string, string | string[] | undefined>;

export default async function EditGuitarPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Search>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const justCreated = sp.created === "1";
  const guitar = await getAdminGuitarById(id);
  if (!guitar) notFound();

  const updateBound = updateGuitarAction.bind(null, id);

  return (
    <div className="px-4 sm:px-8 py-10 max-w-3xl">
      <Link
        href="/admin/guitarras"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground mb-6"
      >
        <ChevronLeft className="size-3" />
        Volver al listado
      </Link>

      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-accent">Editar</p>
          <h1 className="mt-3 font-serif text-4xl tracking-tight">
            {guitar.brand} {guitar.model}
          </h1>
        </div>
        <Link
          href={`/catalogo/${guitar.slug}`}
          className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1"
        >
          Ver en el sitio <ExternalLink className="size-3" />
        </Link>
      </div>

      <PostCreateToast created={justCreated} />
      {justCreated ? (
        <div className="my-6 rounded-md border border-accent/30 bg-accent/5 p-3 text-sm text-foreground/90">
          Guitarra creada. Si querés sumar más fotos, abajo tenés el bloque.
        </div>
      ) : null}

      <section className="mt-10">
        <h2 className="font-serif text-2xl tracking-tight mb-5">Datos</h2>
        <GuitarForm
          action={updateBound}
          initial={guitar}
          submitLabel="Guardar cambios"
          mode="edit"
        />
      </section>

      <section className="mt-16">
        <h2 className="font-serif text-2xl tracking-tight mb-5">Fotos</h2>
        <GuitarImages guitarId={id} images={guitar.images} />
      </section>

      <section className="mt-16 pt-8 border-t border-border">
        <h2 className="font-serif text-2xl tracking-tight mb-3 text-destructive">Zona peligrosa</h2>
        <p className="text-sm text-muted-foreground mb-5">
          Borra la guitarra y todas sus fotos del Storage. No se puede deshacer.
        </p>
        <DeleteGuitarButton id={id} label={`${guitar.brand} ${guitar.model}`} />
      </section>
    </div>
  );
}
