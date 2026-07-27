"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

const focusable = 'button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export function Dialog({ open, titleId, onClose, returnFocusTo, children }: { open: boolean; titleId: string; onClose: () => void; returnFocusTo?: HTMLElement | null; children: ReactNode }) {
  const panel = useRef<HTMLElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  useEffect(() => { onCloseRef.current = onClose; }, [onClose]);
  useEffect(() => {
    if (!open) return;
    returnFocus.current = returnFocusTo ?? document.activeElement as HTMLElement;
    const timer = window.setTimeout(() => {
      const initialFocus = panel.current?.querySelector<HTMLElement>("[data-dialog-initial-focus]");
      (initialFocus ?? panel.current?.querySelector<HTMLElement>(focusable))?.focus();
    }, 0);
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); onCloseRef.current(); return; }
      if (event.key !== "Tab") return;
      const items = Array.from(panel.current?.querySelectorAll<HTMLElement>(focusable) ?? []);
      if (!items.length) return;
      const first = items[0]; const last = items.at(-1)!;
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener("keydown", keydown);
      const trigger = returnFocus.current;
      // WebKit drops a focus call while the dialog is still being unmounted.
      window.setTimeout(() => trigger?.focus(), 0);
    };
  }, [open, returnFocusTo]);
  if (!open) return null;
  return <div className="fixed inset-0 z-50"><button aria-label="Cerrar superposición" className="absolute inset-0 h-full w-full cursor-default bg-sumi/40" onClick={onClose} /><aside aria-labelledby={titleId} aria-modal="true" className="absolute inset-y-0 right-0 w-full max-w-[460px] overflow-auto border-l border-sumi bg-paper p-7 shadow-[-10px_0_28px_rgba(26,26,26,.12)]" ref={panel} role="dialog">{children}</aside></div>;
}
