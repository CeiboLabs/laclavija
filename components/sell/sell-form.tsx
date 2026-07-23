"use client";

import * as React from "react";
import { MessageCircle, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { track } from "@vercel/analytics";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { whatsappLink } from "@/lib/constants";

const MAX = { name: 120, brandModel: 120, year: 10, details: 1000 } as const;

function buildMessage({
  name,
  brandModel,
  year,
  details,
}: {
  name: string;
  brandModel: string;
  year: string;
  details: string;
}): string {
  const lines: string[] = [];
  lines.push(name ? `Hola, soy ${name}. Quiero tasar mi guitarra.` : "Hola, quiero tasar mi guitarra.");

  const data: string[] = [];
  if (brandModel) data.push(`Marca y modelo: ${brandModel}`);
  if (year) data.push(`Año: ${year}`);
  if (details) data.push(`Detalles: ${details}`);

  if (data.length > 0) {
    lines.push("");
    lines.push(...data);
  }

  return lines.join("\n");
}

export function SellForm() {
  const [name, setName] = React.useState("");
  const [brandModel, setBrandModel] = React.useState("");
  const [year, setYear] = React.useState("");
  const [details, setDetails] = React.useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = buildMessage({ name, brandModel, year, details });
    track("sell_form_submit", {
      hasBrandModel: brandModel.length > 0,
      hasYear: year.length > 0,
      hasDetails: details.length > 0,
    });
    const url = whatsappLink(message);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (win) {
      toast.success("Abriendo WhatsApp", {
        description: "Sumá las fotos desde el clip antes de enviar.",
      });
    } else {
      toast.error("No se pudo abrir WhatsApp", {
        description: "Tu navegador bloqueó la ventana emergente.",
        action: { label: "Abrir", onClick: () => window.location.assign(url) },
        duration: 10000,
      });
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5">
      <div className="grid gap-2">
        <Label htmlFor="name">
          Nombre <span className="text-muted-foreground font-normal">(opcional)</span>
        </Label>
        <Input
          id="name"
          name="name"
          autoComplete="name"
          maxLength={MAX.name}
          placeholder="Cómo te llamás"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        <div className="grid gap-2">
          <Label htmlFor="brandModel">Marca y modelo</Label>
          <Input
            id="brandModel"
            name="brandModel"
            maxLength={MAX.brandModel}
            placeholder="Ej: Fender Stratocaster"
            value={brandModel}
            onChange={(e) => setBrandModel(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="year">Año aproximado</Label>
          <Input
            id="year"
            name="year"
            inputMode="numeric"
            maxLength={MAX.year}
            placeholder="Ej: 1998"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="details">Estado, accesorios, lo que sea relevante</Label>
        <Textarea
          id="details"
          name="details"
          rows={5}
          maxLength={MAX.details}
          placeholder="Ej: excelente estado, viene con caso original, sin marcas en el cuerpo."
          value={details}
          onChange={(e) => setDetails(e.target.value)}
        />
      </div>

      <div className="grid gap-4 pt-2">
        <div className="flex items-start gap-3 rounded-md border border-border bg-card/40 px-4 py-3">
          <Paperclip className="size-4 mt-0.5 text-accent shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cuando se abra WhatsApp, sumá las fotos desde el clip antes de enviar el mensaje.
            Frente, dorso, clavijero, traste 12 y marcas visibles si las hay.
          </p>
        </div>
        <Button type="submit" size="lg" variant="accent" className="gap-2 justify-self-start">
          <MessageCircle className="size-4" />
          Continuar por WhatsApp
        </Button>
      </div>
    </form>
  );
}
