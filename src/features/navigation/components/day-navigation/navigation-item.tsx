import Link from "next/link";

type NavigationItemProps = {
  active: boolean;
  href: string;
  label: string;
  glyph: string;
  mobile: boolean;
};

export function NavigationItem({ active, href, label, glyph, mobile }: NavigationItemProps) {
  return <Link aria-current={active ? "page" : undefined} className={mobile ? `flex min-h-14 flex-1 flex-col items-center justify-center gap-1 text-xs ${active ? "bg-vermilion-deep text-paper" : "text-sumi"}` : `flex min-h-11 items-center gap-3 border px-3 text-left ${active ? "border-paper/20 bg-vermilion-deep" : "border-transparent hover:bg-vermilion-deep/20"}`} href={href}><span aria-hidden="true" className="grid size-6 place-items-center border border-current">{glyph}</span>{label}</Link>;
}
