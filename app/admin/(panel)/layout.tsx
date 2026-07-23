import { AdminNav, AdminMobileTopbar } from "@/components/admin/admin-nav";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdmin();
  const email = user.email ?? "";
  return (
    <div className="flex min-h-dvh">
      <AdminNav email={email} />
      <div className="flex-1 min-w-0 flex flex-col">
        <AdminMobileTopbar email={email} />
        <main className="flex-1 overflow-x-auto">{children}</main>
      </div>
    </div>
  );
}
