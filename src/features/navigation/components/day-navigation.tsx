"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [{ href: "/today", label: "Hoy", glyph: "□" }, { href: "/week", label: "Semana", glyph: "◇" }];
export function DayNavigation({ mobile = false }: { mobile?: boolean }) {
  const pathname = usePathname();
  return <nav aria-label={mobile ? "Navegación móvil" : "Vistas principales"} className={mobile ? "fixed inset-x-0 bottom-0 z-30 flex border-t border-paper-mid bg-paper md:hidden" : "mt-10 grid gap-1"}>
    {items.map(({ href, label, glyph }) => { const active = pathname === href; return <Link aria-current={active ? "page" : undefined} className={mobile ? `flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs ${active ? "bg-vermilion-deep text-paper" : "text-sumi"}` : `flex min-h-11 items-center gap-3 border px-3 text-left ${active ? "border-paper/20 bg-vermilion-deep" : "border-transparent hover:bg-vermilion-deep/20"}`} href={href} key={href}><span aria-hidden="true" className="grid size-6 place-items-center border border-current">{glyph}</span>{label}</Link>; })}
  </nav>;
}
