"use client";

import Image from "next/image";
import type { CSSProperties } from "react";
import { useEffect, useState, type ReactNode } from "react";
import { DesktopWorkspaceLaunchers } from "./desktop-workspace-launchers";
import { ProfileQuickPanel } from "./profile-quick-panel";

/** Mirrors Quickshell `Border.qml`: hole insets use max(thickness, barExclusiveZone) per edge. */
const FRAME_PX = 8;
/** Bar width; must match `left` on the wallpaper hole. */
const BAR_W_REM = "2rem";
const HOLE_RADIUS_PX = 22;

/** Flat shell charcoal — same value on root + strip so the bar doesn’t look like another layer. */
const shellSurfaceClass =
  "bg-[#383838] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.055)]";

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

function DockIcon({
  children,
  label,
}: {
  children: ReactNode;
  label: string;
}) {
  return (
    <span
      className="flex h-7 w-full shrink-0 items-center justify-center text-white/[0.38] transition-colors hover:text-white/[0.88]"
      aria-hidden
      title={label}
    >
      {children}
    </span>
  );
}

export function LinuxDesktop() {
  const [now, setNow] = useState<Date | null>(null);
  const [profileOpen, setProfileOpen] = useState(true);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!now) {
    return (
      <div
        className="fixed inset-0 z-50 min-h-[100dvh] bg-[#383838]"
        aria-busy="true"
        aria-label="Loading desktop"
      />
    );
  }

  const h = now.getHours();
  const m = now.getMinutes();
  const parts = new Intl.DateTimeFormat("en-US", {
    month: "long",
    weekday: "long",
    day: "numeric",
  }).formatToParts(now);
  const month =
    parts.find((p) => p.type === "month")?.value.toUpperCase() ?? "";
  const dayNum = parts.find((p) => p.type === "day")?.value ?? "";
  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "";

  const shellStyle = {
    ["--desk-frame" as string]: `${FRAME_PX}px`,
    ["--desk-bar" as string]: BAR_W_REM,
    ["--desk-hole-r" as string]: `${HOLE_RADIUS_PX}px`,
  } satisfies CSSProperties;

  return (
    <div className="fixed inset-0 z-50 min-h-[100dvh] bg-[#383838] text-white">
      {/* No outer padding — shell fills the viewport so no black “bezel” in the browser. */}
      <div className="box-border flex h-[100dvh] w-full min-w-0 flex-col p-0">
        <div
          className={`relative h-full min-h-0 w-full min-w-0 flex-1 overflow-hidden rounded-none ${shellSurfaceClass}`}
          style={shellStyle}
        >
          {/* Wallpaper “hole”: left inset = max(frame, bar) so the bar meets the glass with no black seam */}
          <div
            className="absolute overflow-hidden bg-black shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
            style={{
              top: "var(--desk-frame)",
              right: "var(--desk-frame)",
              bottom: "var(--desk-frame)",
              left: `max(var(--desk-frame), ${BAR_W_REM})`,
              borderRadius: "var(--desk-hole-r)",
            }}
          >
            <div className="absolute inset-0">
              <Image
                src="/desktop-wallpaper.png"
                alt=""
                fill
                className="object-cover object-center"
                priority
                sizes="100vw"
                unoptimized
              />
            </div>
            <div
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/30"
              aria-hidden
            />

            <div
              className="pointer-events-none absolute right-3 top-3 z-10 flex items-stretch gap-2.5 sm:right-6 sm:top-6 sm:gap-4"
              aria-live="polite"
              aria-atomic="true"
            >
              <div className="flex items-baseline tabular-nums drop-shadow-[0_2px_14px_rgba(0,0,0,0.55)]">
                <span className="text-3xl font-bold tracking-tight text-[#ffd75f] sm:text-4xl md:text-5xl">
                  {pad(h)}
                </span>
                <span className="text-3xl font-bold tracking-tight text-white/80 sm:text-4xl md:text-5xl">
                  :{pad(m)}
                </span>
              </div>
              <div
                className="w-px shrink-0 self-stretch min-h-[2.5rem] bg-[#ffd75f]/90 shadow-[0_0_10px_rgba(255,215,95,0.35)] sm:min-h-[3.25rem]"
                aria-hidden
              />
              <div className="flex flex-col justify-center gap-1 text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.5)]">
                <span className="text-[0.6rem] font-medium tracking-[0.2em] text-white/90 sm:text-[0.65rem]">
                  {month} {dayNum}
                </span>
                <span className="text-xs font-medium capitalize text-white/78 sm:text-sm">
                  {weekday}
                </span>
              </div>
            </div>

            <ProfileQuickPanel
              open={profileOpen}
              onClose={() => setProfileOpen(false)}
            />

            <DesktopWorkspaceLaunchers
              profileOpen={profileOpen}
              onToggleProfile={() => setProfileOpen((v) => !v)}
            />
          </div>

          {/* Bar: same #383838 as shell — no inner card (avoids “second color”). */}
          <aside
            className="absolute left-0 top-0 bottom-0 z-30 flex flex-col items-center bg-transparent py-2 sm:py-2.5"
            style={{ width: BAR_W_REM }}
            aria-label="Side dock"
          >
            {/* Workspaces: yellow dash first, then 6 dots — uniform gap; dash ~3.5× dot height. */}
            <div
              className="flex flex-col items-center gap-[5px] pt-1"
              aria-label="Workspaces"
            >
              <span
                className="h-[26px] w-[5px] shrink-0 rounded-full bg-[#ffd75f]"
                aria-current="true"
                title="Active workspace"
              />
              {[0, 1, 2].map((i) => (
                <span
                  key={`ws-${i}`}
                  className="h-[5px] w-[5px] shrink-0 rounded-full bg-white/[0.52]"
                  aria-hidden
                />
              ))}
            </div>

            {/* Clock: stacked, same tone as tray */}
            <div
              className="flex flex-1 flex-col items-center justify-center gap-px py-3 font-sans text-[10px] font-semibold tabular-nums leading-none tracking-tight text-white/[0.82] sm:text-[11px]"
              aria-live="polite"
              aria-atomic="true"
            >
              <span>{pad(h)}</span>
              <span className="text-white/[0.76]">{pad(m)}</span>
            </div>

            {/* System tray (decorative); About me is the first desktop shortcut. */}
            <div
              className="mt-auto flex w-full flex-col items-center gap-px pb-1"
              aria-label="Status tray"
            >
              <DockIcon label="Hidden icons">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                >
                  <path d="m18 15-6-6-6 6" />
                </svg>
              </DockIcon>
              <DockIcon label="Wi‑Fi">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8 3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4 2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z" />
                </svg>
              </DockIcon>
              <DockIcon label="Wired network">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                >
                  <path d="M4 11h3v5H4zM9.5 7h3v9h-3zM15 4h3v12h-3z" />
                </svg>
              </DockIcon>
              <DockIcon label="Volume muted">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.85"
                  strokeLinecap="round"
                >
                  <path d="M11 5 6 9H3v6h3l5 4V5zM22 9l-6 6M16 9l6 6" />
                </svg>
              </DockIcon>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
