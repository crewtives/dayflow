import { useDroppable } from "@dnd-kit/core";

import { AGENDA_SLOT_MINUTES } from "@/domain/dayflow";

type AgendaSlotProps = { minute: number };

function clock(minute: number) {
  return `${String(Math.floor(minute / 60)).padStart(2, "0")}:${String(minute % 60).padStart(2, "0")}`;
}

export function AgendaSlot({ minute }: AgendaSlotProps) {
  const { setNodeRef, isOver } = useDroppable({ id: `slot-${minute}` });
  return <div className={`grid min-h-11 grid-cols-[64px_1fr] border-b border-paper-mid ${isOver ? "bg-vermilion-wash" : ""}`} ref={setNodeRef}><time className="pt-3 pr-3 text-right font-label text-xs text-sumi-soft">{minute % 60 === 0 ? clock(minute) : ""}</time><div /></div>;
}
