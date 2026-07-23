"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_LINKS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Wordmark } from "@/components/brand/wordmark";
import { CommandPalette } from "@/components/layout/command-palette";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let lastY = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Solo escondemos despues de pasar el header y al hacer scroll-down con cierto delta.
      const delta = y - lastY;
      if (y > 80 && delta > 4) setHidden(true);
      else if (delta < -4) setHidden(false);
      lastY = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Si el menu mobile esta abierto, no escondemos.
  const shouldHide = hidden && !open;

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[transform,background-color,border-color] duration-300 ease-out will-change-transform",
        shouldHide && "-translate-y-full",
        scrolled
          ? "bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-(--container-2xl) items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label="La Clavija — Home"
          className="transition-colors hover:text-accent"
        >
          <Wordmark size="md" />
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className={cn(
                  "nav-link-underline text-sm uppercase tracking-widest transition-colors",
                  active ? "text-accent" : "text-muted-foreground hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1">
          <CommandPalette />
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Abrir menú">
                <Menu className="size-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle asChild>
                <span>
                  <Wordmark size="lg" stacked />
                </span>
              </SheetTitle>
              <nav className="mt-10 flex flex-col gap-1">
                {NAV_LINKS.map((link) => {
                  const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "py-3 text-base uppercase tracking-widest border-b border-border/60 transition-colors",
                        active ? "text-accent" : "text-foreground/80 hover:text-foreground",
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
