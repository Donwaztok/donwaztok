"use client";

import { useState, type ReactNode } from "react";
import { GithubReposNautilusWindow } from "./github-repos-nautilus-window";
import { MobileAppsNautilusWindow } from "./mobile-apps-nautilus-window";
import { PoliciesNautilusWindow } from "./policies-nautilus-window";

type Win = null | "apps" | "policies" | "repos";

function DesktopShortcut({
  label,
  onOpen,
  active,
  children,
}: {
  label: string;
  onOpen: () => void;
  /** Highlight tile (e.g. profile panel open). */
  active?: boolean;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-pressed={active === undefined ? undefined : active}
      className="group flex w-[5.25rem] shrink-0 flex-col items-center gap-1 rounded-xl p-1.5 text-center transition-colors hover:bg-black/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd75f]/80 sm:w-[5.5rem] sm:gap-1.5 sm:p-2"
    >
      <span
        className={`flex h-[3.25rem] w-[3.25rem] items-center justify-center rounded-xl border bg-black/40 text-white/95 shadow-lg backdrop-blur-sm transition-colors group-hover:border-[#ffd75f]/35 group-hover:bg-black/50 ${
          active
            ? "border-[#ffd75f]/55 ring-2 ring-[#ffd75f]/35"
            : "border-white/15"
        }`}
      >
        {children}
      </span>
      <span className="max-w-full truncate px-0.5 text-[11px] font-semibold leading-tight text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
        {label}
      </span>
    </button>
  );
}

export function DesktopWorkspaceLaunchers({
  profileOpen,
  onToggleProfile,
}: {
  profileOpen: boolean;
  onToggleProfile: () => void;
}) {
  const [win, setWin] = useState<Win>(null);
  const close = () => setWin(null);

  return (
    <>
      <div
        className="pointer-events-auto absolute left-3 top-3 bottom-3 z-30 flex w-max flex-col flex-wrap content-start items-start gap-x-2 gap-y-3 sm:left-5 sm:top-5 sm:bottom-5 sm:gap-x-4 sm:gap-y-4 md:left-6 md:top-6 md:bottom-6"
        aria-label="Desktop shortcuts"
      >
        <DesktopShortcut
          label="About me"
          active={profileOpen}
          onOpen={onToggleProfile}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
          </svg>
        </DesktopShortcut>
        <DesktopShortcut
          label="Mobile apps"
          onOpen={() => setWin("apps")}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden
          >
            <rect x="7" y="3" width="10" height="18" rx="2" />
            <path d="M10 17h4" strokeLinecap="round" />
          </svg>
        </DesktopShortcut>
        <DesktopShortcut
          label="Privacy policies"
          onOpen={() => setWin("policies")}
        >
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
            aria-hidden
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" />
          </svg>
        </DesktopShortcut>
        <DesktopShortcut
          label="Repositories"
          onOpen={() => setWin("repos")}
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden
          >
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
          </svg>
        </DesktopShortcut>
      </div>

      <MobileAppsNautilusWindow
        open={win === "apps"}
        onClose={close}
      />
      <PoliciesNautilusWindow
        open={win === "policies"}
        onClose={close}
      />
      <GithubReposNautilusWindow
        open={win === "repos"}
        onClose={close}
      />
    </>
  );
}
