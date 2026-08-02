"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart3, FileText, Guitar, Megaphone, LogOut, Home, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOutAction } from "@/app/admin/login/actions";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const links = [
  { href: "/admin", label: "Inicio", icon: Home, exact: true },
  { href: "/admin/guitarras", label: "Guitarras", icon: Guitar },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/estadisticas", label: "Estadísticas", icon: BarChart3 },
  { href: "/admin/promo", label: "Promo modal", icon: Megaphone },
];

function NavBody({ email, onNavigate }: { email: string; onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      <div className="px-5 py-6 border-b border-border">
        <p className="text-xs uppercase tracking-[0.3em] text-accent">La Clavija</p>
        <p className="mt-1 font-serif text-lg tracking-tight">Panel</p>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map((link) => {
          const active = link.exact
            ? pathname === link.href
            : pathname === link.href || pathname.startsWith(`${link.href}/`);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-border p-3">
        <p className="px-2 pb-2 text-xs text-muted-foreground truncate" title={email}>
          {email}
        </p>
        <form action={signOutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <LogOut className="size-4" />
            Cerrar sesión
          </button>
        </form>
        <Link
          href="/"
          onClick={onNavigate}
          className="mt-1 block px-3 py-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          Ver sitio público →
        </Link>
      </div>
    </>
  );
}

export function AdminNav({ email }: { email: string }) {
  return (
    <aside className="hidden md:flex w-60 shrink-0 border-r border-border bg-card flex-col">
      <NavBody email={email} />
    </aside>
  );
}

export function AdminMobileTopbar({ email }: { email: string }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="md:hidden sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Abrir menú">
            <Menu className="size-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 p-0 flex flex-col">
          <SheetTitle className="sr-only">Menú del panel</SheetTitle>
          <NavBody email={email} onNavigate={() => setOpen(false)} />
        </SheetContent>
      </Sheet>
      <div className="text-right">
        <p className="text-[10px] uppercase tracking-[0.3em] text-accent leading-none">La Clavija</p>
        <p className="font-serif text-sm tracking-tight leading-tight">Panel</p>
      </div>
    </div>
  );
}
