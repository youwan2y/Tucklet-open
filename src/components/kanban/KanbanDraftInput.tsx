"use client";

import { useEffect, useRef, useState, type InputHTMLAttributes } from "react";

// Keep the same DOM input across saves so focus, selection and native text undo
// survive updates to another card/column property.
export function KanbanDraftInput({ value, onCommit, ...props }: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange" | "onBlur"> & {
  value: string;
  onCommit: (value: string) => void;
}) {
  const [draft, setDraft] = useState(value);
  const pendingCommitRef = useRef<{ value: string; commit: (value: string) => void } | null>(null);

  useEffect(() => {
    const pending = pendingCommitRef.current;
    // A matching echo acknowledges this draft. A different remote value must
    // not replace its text or the callback carrying its original read receipt.
    if (pending && pending.value !== value) return;
    pendingCommitRef.current = null;
    setDraft(value);
  }, [value]);

  return <input
    {...props}
    value={draft}
    onChange={(event) => {
      const next = event.currentTarget.value;
      if (next === value) pendingCommitRef.current = null;
      else if (pendingCommitRef.current) pendingCommitRef.current.value = next;
      else pendingCommitRef.current = { value: next, commit: onCommit };
      setDraft(next);
    }}
    onBlur={(event) => pendingCommitRef.current?.commit(event.currentTarget.value)}
    onKeyDown={(event) => {
      props.onKeyDown?.(event);
      if (!event.defaultPrevented && event.key === "Enter" && !event.nativeEvent.isComposing) {
        event.currentTarget.blur();
      }
    }}
  />;
}
