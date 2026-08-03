"use client";

import * as React from "react";
import { MessageCircle, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { track } from "@/lib/track";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { whatsappLink } from "@/lib/constants";

const MAX = { name: 120, guitar: 160, issue: 1500 } as const;

function buildMessage({
  name,
  guitar,
  issue,
}: {
  name: string;
  guitar: string;
  issue: string;
}): string {
  const lines: string[] = [];
  lines.push(
    name ? `Hola, soy ${name}. Necesito reparar una guitarra.` : "Hola, necesito reparar una guitarra.",
  );

  const data: string[] = [];
  if (guitar) data.push(`Guitarra: ${guitar}`);
  if (issue) data.push(`Lo que necesito: ${issue}`);

  if (data.length > 0) {
    lines.push("");
    lines.push(...data);
  }

  return lines.join("\n");
}

export function RepairForm() {
  const [name, setName] = React.useState("");
  const [guitar, setGuitar] = React.useState("");
  const [issue, setIssue] = React.useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const message = buildMessage({ name, guitar, issue });
    track("repair_form_submit", {
      hasGuitar: guitar.length > 0,
      hasIssue: issue.length > 0,
    });
    const url = whatsappLink(message);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (win) {
      toast.success("Abriendo WhatsApp", {
        description: "Sumá fotos del problema antes de enviar.",
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

      <div className="grid gap-2">
        <Label htmlFor="guitar">Qué guitarra es</Label>
        <Input
          id="guitar"
          name="guitar"
          maxLength={MAX.guitar}
          placeholder="Ej: Fender Stratocaster 1998"
          value={guitar}
          onChange={(e) => setGuitar(e.target.value)}
        />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="issue">Qué le pasa o qué necesitás</Label>
        <Textarea
          id="issue"
          name="issue"
          rows={5}
          maxLength={MAX.issue}
          placeholder="Ej: Zumba en los primeros trastes y se desafina rápido. Hace 2 años que no la sacaba del estuche."
          value={issue}
          onChange={(e) => setIssue(e.target.value)}
        />
      </div>

      <div className="grid gap-4 pt-2">
        <div className="flex items-start gap-3 rounded-md border border-border bg-card/40 px-4 py-3">
          <Paperclip className="size-4 mt-0.5 text-accent shrink-0" />
          <p className="text-sm text-muted-foreground leading-relaxed">
            Cuando se abra WhatsApp, sumá fotos desde el clip antes de enviar el mensaje.
            Mostranos la zona del problema y, si podés, frente, dorso y clavijero.
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
