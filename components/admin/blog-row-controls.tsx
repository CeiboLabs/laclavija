"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { ConfirmActionButton } from "@/components/ui/confirm-dialog";
import { togglePublishedAction, deleteBlogPostAction } from "@/app/admin/(panel)/blog/actions";

export function PublishToggle({ id, value }: { id: string; value: boolean }) {
  const [pending, startTransition] = React.useTransition();
  const router = useRouter();
  return (
    <button
      type="button"
      onClick={() => {
        const next = !value;
        startTransition(async () => {
          await togglePublishedAction(id, next);
          router.refresh();
          toast.success(next ? "Publicado." : "Movido a borrador.");
        });
      }}
      disabled={pending}
      className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest transition-colors hover:text-foreground disabled:opacity-50"
      aria-label={value ? "Despublicar" : "Publicar"}
    >
      {value ? <Eye className="size-3.5 text-accent" /> : <EyeOff className="size-3.5 text-muted-foreground" />}
      <span className={value ? "text-accent" : "text-muted-foreground"}>
        {value ? "Publicado" : "Borrador"}
      </span>
    </button>
  );
}

export function DeletePostButton({ id, title }: { id: string; title: string }) {
  return (
    <ConfirmActionButton
      title="¿Eliminar este post?"
      description={`Se va a borrar "${title}" y su imagen de portada. Esto no se puede deshacer.`}
      confirmLabel="Eliminar"
      destructive
      variant="ghost"
      size="sm"
      className="text-muted-foreground hover:text-destructive"
      onConfirm={async () => {
        await deleteBlogPostAction(id);
      }}
    >
      <Trash2 className="size-3.5" />
    </ConfirmActionButton>
  );
}
