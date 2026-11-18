"use client";

import { useEffect, useId, useRef, useState } from "react";
const FONT_SIZE_OPTIONS = [13, 14, 15, 16, 17, 18, 19, 20, 22, 24, 26, 28, 30] as const;
import { ControlIcon as AppIcon } from "./ControlIcon";

export function NoteFontSizeControl({ value, onChange }: {
  value: number;
  onChange: (size: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panelId = useId();
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", dismiss);
    return () => document.removeEventListener("pointerdown", dismiss);
  }, [open]);
  const min = FONT_SIZE_OPTIONS[0];
  const max = FONT_SIZE_OPTIONS[FONT_SIZE_OPTIONS.length - 1];
  return (
    <div ref={root} className="note-font-size-picker" data-no-drag="true"
      onMouseDown={(event) => event.stopPropagation()}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false); }}
      onKeyDown={(event) => {
        if (event.key === "Escape" && open) {
          event.stopPropagation(); setOpen(false); trigger.current?.focus();
        }
      }}>
      <button ref={trigger} type="button" className="note-font-size-trigger" aria-label="调整笔记字号"
        title="调整字号" aria-expanded={open} aria-controls={open ? panelId : undefined}
        onClick={() => setOpen((value) => !value)}><AppIcon name="font-size" /></button>
      {open && <div id={panelId} className="note-font-size-control" role="group" aria-label="笔记字号">
      <button type="button" disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))} aria-label="减小笔记字号" title="减小字号（所有笔记）"><AppIcon name="minus" /></button>
      <output aria-live="polite" aria-label="当前字号">{value}</output>
      <button type="button" disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))} aria-label="增大笔记字号" title="增大字号（所有笔记）"><AppIcon name="plus" /></button>
      </div>}
    </div>
  );
}
