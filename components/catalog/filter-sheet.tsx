"use client";

import * as React from "react";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { FilterForm } from "./filter-form";

export function FilterSheet({ brands, activeCount }: { brands: string[]; activeCount: number }) {
  const [open, setOpen] = React.useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden gap-2">
          <SlidersHorizontal className="size-4" />
          Filtros
          {activeCount > 0 ? (
            <span className="ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1.5 text-xs text-accent-foreground">
              {activeCount}
            </span>
          ) : null}
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[88dvh]">
        <DrawerHeader className="border-b border-border/60">
          <DrawerTitle className="font-serif text-2xl">Filtros</DrawerTitle>
        </DrawerHeader>
        <div className="overflow-y-auto px-5 pb-8 pt-6">
          <FilterForm brands={brands} onApply={() => setOpen(false)} />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
