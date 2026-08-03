"use client";

import * as React from "react";
import { useActionState } from "react";
import { toast } from "sonner";
import { KeyRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePasswordAction, type ChangePasswordState } from "@/app/admin/(panel)/cuenta/actions";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState<ChangePasswordState | null, FormData>(
    changePasswordAction,
    null,
  );
  const formRef = React.useRef<HTMLFormElement>(null);
  const lastSeen = React.useRef<ChangePasswordState | null>(null);

  React.useEffect(() => {
    if (!state || state === lastSeen.current) return;
    lastSeen.current = state;
    if (state.ok) {
      toast.success("Contraseña actualizada.");
      formRef.current?.reset();
    } else if (state.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="current_password">Contraseña actual</Label>
        <Input
          id="current_password"
          name="current_password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="new_password">Contraseña nueva</Label>
        <Input
          id="new_password"
          name="new_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
        <p className="text-xs text-muted-foreground">Mínimo 8 caracteres.</p>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="confirm_password">Confirmar contraseña nueva</Label>
        <Input
          id="confirm_password"
          name="confirm_password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
        />
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-dashed border-border">
        <Button type="submit" variant="accent" disabled={pending}>
          <KeyRound className="size-4" />
          {pending ? "Guardando…" : "Cambiar contraseña"}
        </Button>
        {state?.error ? <p className="text-sm text-destructive">{state.error}</p> : null}
      </div>
    </form>
  );
}
