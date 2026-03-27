"use client";

import { aboutProfile, profileShortcuts, type ProfileShortcut } from "@/lib/about-me";
import type {
  GitHubPublicProfile,
  GitHubPublicProfilePayload,
} from "@/lib/github-public-profile";
import { Tooltip } from "@heroui/react";
import Image from "next/image";
import NextLink from "next/link";
import { useEffect, useState } from "react";
import { Link } from "react-aria-components";

const accent = "#ffd75f";

function ShortcutIcon({ icon }: { icon: ProfileShortcut["icon"] }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24" as const,
    fill: "currentColor" as const,
    "aria-hidden": true as const,
  };
  switch (icon) {
    case "github":
      return (
        <svg {...common}>
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg {...common}>
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "ducke":
      // vinext: `/_vinext/image` is only wired when `pages/` exists; skip optimizer for static public assets.
      return (
        <Image
          src="/ducke-logo-bordered.png"
          alt=""
          width={72}
          height={27}
          unoptimized
          className="h-[18px] w-auto max-w-[2.35rem] object-contain object-center"
        />
      );
    default:
      return null;
  }
}

function ShortcutTile({ item }: { item: ProfileShortcut }) {
  const highlighted = Boolean(item.highlight);
  const tileClass =
    "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border p-0 transition-colors";
  const style = highlighted
    ? "border-[color-mix(in_oklab,var(--pq-accent)_45%,transparent)] bg-[color-mix(in_oklab,var(--pq-accent)_18%,transparent)] text-[var(--pq-accent)]"
    : "border-white/10 bg-white/5 text-white/75 hover:border-white/20 hover:bg-white/10 hover:text-white";

  return (
    <Tooltip delay={0} closeDelay={0}>
      <Link
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.label}
        className={`${tileClass} ${style} min-h-11 min-w-11 max-h-11 max-w-11 rounded-xl no-underline outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffd75f]/70`}
        style={{ ["--pq-accent" as string]: accent }}
      >
        <ShortcutIcon icon={item.icon} />
      </Link>
      <Tooltip.Content
        placement="top"
        showArrow
        offset={8}
        className="z-[600] max-w-[min(100vw-2rem,16rem)] border border-white/10 bg-zinc-900/98 text-white shadow-xl backdrop-blur-md"
      >
        <Tooltip.Arrow />
        <div className="px-1 py-0.5">
          <p className="text-sm font-semibold text-white">{item.tooltipTitle}</p>
          <p className="mt-0.5 text-xs leading-snug text-white/65">
            {item.tooltipDescription}
          </p>
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
}

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ProfileQuickPanel({ open, onClose }: Props) {
  const [gh, setGh] = useState<GitHubPublicProfile | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const login = encodeURIComponent(aboutProfile.githubLogin);
    fetch(`/api/github-profile/?login=${login}`)
      .then((r) => r.json())
      .then((data: GitHubPublicProfilePayload) => {
        if (cancelled || !data || typeof data !== "object" || !("ok" in data))
          return;
        if (data.ok) setGh(data);
      })
      .catch(() => { });
    return () => {
      cancelled = true;
    };
  }, [open]);

  if (!open) return null;

  const displayName = gh?.name?.trim() || aboutProfile.displayName;
  const handle = gh?.login ?? aboutProfile.githubLogin;
  const profileUrl = gh?.html_url ?? `https://github.com/${aboutProfile.githubLogin}`;
  const bioText =
    (gh?.bio && gh.bio.trim()) || aboutProfile.bio;

  return (
    <aside
      className="pointer-events-auto absolute bottom-4 right-4 z-30 w-[min(100%,19rem)] sm:bottom-6 sm:right-6 sm:w-[20.5rem]"
      aria-label="Profile and shortcuts"
      style={{ ["--pq-accent" as string]: accent }}
    >
      <div className="overflow-hidden rounded-2xl border border-white/[0.12] bg-black/55 shadow-[0_20px_50px_rgba(0,0,0,0.55)] backdrop-blur-xl">
        <div className="border-b border-white/[0.08] p-3.5 sm:p-4">
          <div className="flex gap-3">
            <NextLink
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-white/10 ring-1 ring-white/10 transition-opacity hover:opacity-90"
              aria-label={`GitHub profile @${handle}`}
            >
              {gh?.avatar_url ? (
                <Image
                  src={gh.avatar_url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="44px"
                />
              ) : (
                <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-[var(--pq-accent)]">
                  {aboutProfile.initials}
                </span>
              )}
            </NextLink>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold leading-tight text-white">
                {displayName}
              </p>
              <p className="mt-0.5 text-xs leading-snug text-white/55">
                <span className="text-[var(--pq-accent)]">@{handle}</span>
                {gh ? (
                  <>
                    <span className="text-white/35" aria-hidden>
                      {" · "}
                    </span>
                    <span>
                      {gh.followers} followers · {gh.following} following ·{" "}
                      {gh.public_repos} repositories
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-white/35" aria-hidden>
                      {" · "}
                    </span>
                    <span>{aboutProfile.tagline}</span>
                  </>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close panel"
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
          </div>
          <p className="mt-3 text-xs leading-relaxed text-white/60">{bioText}</p>
        </div>

        <div className="px-3.5 py-3 sm:px-4">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.14em] text-white/40">
            Quick shortcuts
          </p>
          <div className="flex flex-wrap items-center gap-2">
            {profileShortcuts.map((item) => (
              <ShortcutTile key={item.id} item={item} />
            ))}
          </div>
        </div>

        <div className="border-t border-white/[0.08] px-3.5 py-3 sm:px-4">
          <dl className="space-y-2 text-xs">
            <div className="flex justify-between gap-3">
              <dt className="text-white/45">Device</dt>
              <dd className="text-right font-medium text-white/85">
                {aboutProfile.deviceName}
              </dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-white/45">System</dt>
              <dd className="text-right font-medium text-white/85">
                {aboutProfile.osLabel}
              </dd>
            </div>
            {aboutProfile.facts.map((row) => (
              <div key={row.label} className="flex justify-between gap-3">
                <dt className="text-white/45">{row.label}</dt>
                <dd className="max-w-[58%] text-right font-medium text-white/85">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </aside>
  );
}
