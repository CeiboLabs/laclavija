import { requireAdmin } from "@/lib/admin/auth";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const dynamic = "force-dynamic";

export default async function AccountPage() {
  const { user } = await requireAdmin();

  return (
    <div className="px-4 sm:px-8 py-10 max-w-xl">
      <p className="text-xs uppercase tracking-[0.3em] text-accent">Cuenta</p>
      <h1 className="mt-3 font-serif text-4xl tracking-tight mb-2">Mi cuenta</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Sesión iniciada como <span className="text-foreground">{user.email}</span>.
      </p>

      <div className="rounded-md border border-border bg-card/40 p-6">
        <h2 className="font-serif text-2xl tracking-tight mb-1">Cambiar contraseña</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Vas a necesitar ingresar la contraseña actual y una nueva.
        </p>
        <ChangePasswordForm />
      </div>
    </div>
  );
}
