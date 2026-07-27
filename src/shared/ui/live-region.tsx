export function LiveRegion({ message }: { message: string }) {
  if (!message) return <p aria-atomic="true" aria-live="polite" className="sr-only" role="status" />;
  return <div aria-atomic="true" aria-live="polite" className="fixed bottom-20 right-4 z-[80] w-[min(380px,calc(100vw-2rem))] md:bottom-6" role="status"><div className="animate-[toast-fold_280ms_cubic-bezier(0.22,1,0.36,1)] flex items-start gap-3 border border-paper bg-sumi px-4 py-[15px] text-paper shadow-fold"><span aria-hidden="true" className="mt-[5px] size-2.5 shrink-0 rounded-full bg-gold" /><p className="m-0 text-sm">{message}</p></div></div>;
}
