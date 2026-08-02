import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-(--container-2xl) px-5 sm:px-8 py-24 md:py-36 text-center">
      <div className="mx-auto inline-block overflow-hidden rounded-md ring-1 ring-border/40 shadow-2xl">
        <Image
          src="/brand/logo-512.webp"
          alt="La Clavija"
          width={1000}
          height={1000}
          className="block h-auto w-48 sm:w-56"
          sizes="(min-width: 640px) 224px, 192px"
        />
      </div>
      <p className="mt-10 text-xs uppercase tracking-[0.3em] text-accent">404</p>
      <h1 className="mt-5 font-serif text-5xl md:text-7xl tracking-tight">
        Esa guitarra
        <br />
        <span className="italic font-light text-muted-foreground">no está más.</span>
      </h1>
      <p className="mt-8 text-muted-foreground max-w-md mx-auto">
        Puede que se haya vendido o que el link no exista. Probá volver al catálogo a ver qué tenemos hoy.
      </p>
      <div className="mt-10 flex flex-wrap gap-3 justify-center">
        <Button asChild variant="accent">
          <Link href="/catalogo">
            Ir al catálogo
            <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Volver a la home</Link>
        </Button>
      </div>
    </section>
  );
}
