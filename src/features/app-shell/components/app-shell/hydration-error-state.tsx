import { Button } from "@/shared/ui";

export function HydrationErrorState() {
  return <main className="grid min-h-screen place-items-center bg-paper p-6 text-sumi"><section className="max-w-md border border-paper-mid bg-paper-bright p-6" role="alert"><p className="font-label text-xs tracking-[.14em] text-vermilion-deep">DATOS SINCRONIZADOS PENDIENTES</p><h1 className="mt-2 text-2xl">No pudimos cargar los cambios guardados.</h1><p className="mt-3 text-sm text-sumi-soft">Tus datos se han conservado. Recarga la página para volver a intentarlo.</p><Button className="mt-5" onClick={() => window.location.reload()} type="button">Reintentar</Button></section></main>;
}
