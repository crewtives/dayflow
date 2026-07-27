import { Button } from "@/shared/ui";

type TaskDrawerHeaderProps = {
  isEditing: boolean;
  onClose: () => void;
};

export function TaskDrawerHeader({ isEditing, onClose }: TaskDrawerHeaderProps) {
  return <header className="flex items-start justify-between border-b border-paper-mid pb-5"><div><p className="font-label text-xs tracking-[.14em] text-vermilion-deep">{isEditing ? "EDITAR EVENTO" : "NUEVO EVENTO"}</p><h2 className="mt-1 text-3xl tracking-tight" id="drawer-title">{isEditing ? "Editar evento" : "Nuevo evento"}</h2></div><Button aria-label="Cerrar formulario" onClick={onClose} tone="quiet" type="button">×</Button></header>;
}
