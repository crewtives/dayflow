"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavigationItem } from "./day-navigation/navigation-item";

const items = [{ href: "/today", label: "Hoy", glyph: "□" }, { href: "/week", label: "Semana", glyph: "◇" }];
export function DayNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return <nav aria-label={mobile ? "Navegación móvil" : "Vistas principales"} className={mobile ? "fixed inset-x-0 bottom-0 z-30 flex border-t border-paper-mid bg-paper md:hidden" : "mt-10 grid gap-1"}>
    {items.map((item) => <NavigationItem active={pathname === item.href} key={item.href} mobile={mobile} {...item} />)}
  </nav>;
}
