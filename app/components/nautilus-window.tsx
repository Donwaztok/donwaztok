"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";

const accent = "#ffd75f";

type Props = {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Shown under the title (e.g. path or context), profile-panel subtitle style */
  pathLabel: string;
  children: ReactNode;
};

/** Modal shell matching `ProfileQuickPanel` (about-me): glass card, accent, close control. */
export function NautilusWindow({
  open,
  onClose,
  title,
  pathLabel,
  children,
}: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[45] flex items-center justify-center bg-black/55 p-4 backdrop-blur-none"
      role="presentation"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="nautilus-window-title"
        className="flex max-h-[min(85dvh,720px)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-white/[0.12] bg-black/55 text-white shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl"
        style={{ ["--pq-accent" as string]: accent }}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className="relative shrink-0 border-b border-white/[0.08] py-2 pl-2.5 pr-10 sm:py-2 sm:pl-3 sm:pr-11">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-1.5 top-1/2 z-10 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd75f]/70"
            aria-label="Close window"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-2">
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[var(--pq-accent)] ring-1 ring-white/10"
              aria-hidden
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-7l-2-2H5a2 2 0 0 0-2 2z" />
              </svg>
            </span>
            <div className="min-w-0 flex-1">
              <h2
                id="nautilus-window-title"
                className="truncate text-[13px] font-semibold leading-tight text-white"
              >
                {title}
              </h2>
              <p className="mt-px truncate text-[11px] leading-tight text-white/50">
                <span className="text-[var(--pq-accent)]">~</span>
                <span className="text-white/35" aria-hidden>
                  {" / "}
                </span>
                <span>{pathLabel}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
          {children}
        </div>
      </div>
    </div>
  );
}
