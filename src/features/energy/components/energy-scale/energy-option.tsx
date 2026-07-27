import type { KeyboardEvent } from "react";

import type { EnergyValue } from "@/domain/dayflow";

type EnergyOptionProps = {
  id: string;
  index: number;
  label: string;
  selected: boolean;
  tabIndex: number;
  onSelect: (value: EnergyValue) => void;
  onMove: (index: number, delta: number) => void;
};

export function EnergyOption({ id, index, label, selected, tabIndex, onSelect, onMove }: EnergyOptionProps) {
  const value = (index + 1) as EnergyValue;

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (["ArrowRight", "ArrowDown"].includes(event.key)) {
      event.preventDefault();
      onMove(index, 1);
    }
    if (["ArrowLeft", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      onMove(index, -1);
    }
  };

  return <button aria-checked={selected} className="grid min-h-11 justify-items-center gap-1 text-[.68rem] leading-tight" id={id} onClick={() => onSelect(value)} onKeyDown={handleKeyDown} role="radio" tabIndex={tabIndex}><span className={`grid size-7 place-items-center rounded-full border ${selected ? "border-gold bg-gold text-sumi shadow-[0_0_0_3px_rgba(247,243,238,.9)]" : "border-current"}`}>{value}</span><small>{label}</small></button>;
}
