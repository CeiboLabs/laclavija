"use client";

import * as React from "react";
import Image from "next/image";
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
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full transition-[background-color,border-color] duration-300 ease-out",
        scrolled
          ? "bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 border-b border-border"
          : "bg-transparent",
      )}
    >
      <div className="mx-auto flex h-16 max-w-(--container-2xl) items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          aria-label="La Clavija — Home"
          className="group flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <span className="relative inline-block size-9 shrink-0 rounded-full overflow-hidden ring-1 ring-border">
            <Image
              src="/brand/la-clavija-logo.png"
              alt=""
              fill
              sizes="36px"
              className="object-cover"
              priority
            />
          </span>
          <span className="hidden sm:flex flex-col leading-none">
            <Wordmark size="sm" />
            <span className="mono-meta text-[0.55rem] mt-1 opacity-70">
              Montevideo, Uruguay
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                data-active={active}
                className={cn(
                  "nav-link-underline text-xs uppercase tracking-[0.22em] transition-colors",
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
                <span className="flex items-center gap-3">
                  <span className="relative inline-block size-12 shrink-0 rounded-full overflow-hidden ring-1 ring-border">
                    <Image
                      src="/brand/la-clavija-logo.png"
                      alt=""
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </span>
                  <span className="flex flex-col leading-none">
                    <Wordmark size="lg" />
                    <span className="mono-meta text-[0.6rem] mt-2 opacity-70">
                      Montevideo, Uruguay
                    </span>
                  </span>
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
                        "py-3 text-base uppercase tracking-widest border-b border-dashed border-border/60 transition-colors",
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
