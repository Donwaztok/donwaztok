import type { ReactNode } from "react";

export function NautilusRowMeta({
  children,
  compact,
}: {
  children: ReactNode;
  /** Tighter spacing and smaller type (e.g. dense list rows). */
  compact?: boolean;
}) {
  return (
    <div
      className={
        compact
          ? "mt-0.5 flex flex-wrap gap-x-2 gap-y-0 text-[11px] text-white/50"
          : "mt-1 flex flex-wrap gap-x-3 gap-y-0.5 text-[12px] text-white/50"
      }
    >
      {children}
    </div>
  );
}
