"use client";

import type { GitHubRepoItem, GitHubReposPayload } from "@/lib/github-repo-public";
import { Tooltip } from "@heroui/react";
import { useEffect, useState } from "react";
import { Link } from "react-aria-components";
import {
  IconArchive,
  IconCalendar,
  IconCode,
  IconExternal,
  IconFork,
  IconGlobe,
  IconRepo,
  IconStar,
  IconTag,
} from "./nautilus-list-icons";
import { NautilusRowMeta } from "./nautilus-row-meta";
import { NautilusWindow } from "./nautilus-window";

function normalizeHomepageUrl(raw: string): URL | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
  } catch {
    return null;
  }
}

function HomepageLinkButton({
  repoName,
  homepage,
}: {
  repoName: string;
  homepage: string;
}) {
  const parsed = normalizeHomepageUrl(homepage);
  const href = parsed?.href ?? homepage.trim();
  const hostname = parsed?.hostname ?? homepage.trim();
  const protocolLabel = parsed
    ? parsed.protocol.replace(":", "").toUpperCase()
    : "—";

  const portalContainer =
    typeof document !== "undefined" ? document.body : undefined;

  return (
    <Tooltip delay={0} closeDelay={0}>
      {/*
        RAC TooltipTrigger needs a trigger that forwards refs and event props (e.g. Link).
        A plain <a> breaks hover/focus wiring so the tooltip never opens.
      */}
      <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-[color-mix(in_oklab,var(--pq-accent)_55%,transparent)] bg-[color-mix(in_oklab,var(--pq-accent)_20%,transparent)] text-[var(--pq-accent)] no-underline outline-none transition-colors hover:border-[color-mix(in_oklab,var(--pq-accent)_75%,transparent)] hover:bg-[color-mix(in_oklab,var(--pq-accent)_32%,transparent)] hover:text-[#ffe08a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--pq-accent)]"
        aria-label={`Open project website for ${repoName}`}
      >
        <IconGlobe />
      </Link>
      <Tooltip.Content
        placement="top"
        showArrow
        offset={8}
        shouldFlip
        containerPadding={12}
        UNSTABLE_portalContainer={portalContainer}
        className="z-[9999] max-w-[min(100vw-2rem,18rem)] border border-white/10 bg-zinc-900/98 text-white shadow-xl backdrop-blur-md"
      >
        <Tooltip.Arrow />
        <div className="px-1 py-0.5">
          <p className="text-sm font-semibold text-white">Project website</p>
          <p className="mt-0.5 break-all font-mono text-[11px] leading-snug text-[var(--pq-accent)]">
            {href}
          </p>
          <p className="mt-1.5 text-xs leading-snug text-white/65">
            <span className="text-white/80">{hostname}</span>
            {parsed ? (
              <>
                <span className="text-white/35" aria-hidden>
                  {" · "}
                </span>
                <span>{protocolLabel}</span>
              </>
            ) : null}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-white/45">
            Opens in a new tab. This is an external site — check the address
            before entering data.
          </p>
        </div>
      </Tooltip.Content>
    </Tooltip>
  );
}

export function GithubReposNautilusWindow({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [repos, setRepos] = useState<GitHubRepoItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);
    fetch("/api/github-repos/")
      .then((r) => r.json())
      .then((d: GitHubReposPayload) => {
        if (cancelled) return;
        if (d.ok) setRepos(d.repos);
        else setError("Could not load repositories.");
      })
      .catch(() => {
        if (!cancelled) setError("Could not load repositories.");
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <NautilusWindow
      open={open}
      onClose={onClose}
      title="Public repositories"
      pathLabel="GitHub / Repositories"
    >
      {error ? (
        <p className="px-3.5 py-6 text-sm text-red-300 sm:px-4">{error}</p>
      ) : repos === null ? (
        <p className="px-3.5 py-6 text-sm text-white/50 sm:px-4">Loading…</p>
      ) : repos.length === 0 ? (
        <p className="px-3.5 py-6 text-sm text-white/50 sm:px-4">
          No public repositories.
        </p>
      ) : (
        <ul className="divide-y divide-white/[0.08]">
          {repos.map((r) => (
            <li
              key={r.full_name}
              className="px-3 py-2 hover:bg-white/[0.04] sm:px-3.5 sm:py-2"
            >
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white/65 ring-1 ring-white/10">
                  <IconRepo />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <a
                      href={r.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1 text-[13px] font-semibold leading-tight text-[var(--pq-accent)] hover:text-[#ffe08a] hover:underline"
                    >
                      {r.name}
                      <IconExternal className="shrink-0 text-white/35 transition-colors group-hover:text-[var(--pq-accent)]" />
                    </a>
                    {r.fork ? (
                      <span className="inline-flex items-center gap-0.5 rounded bg-white/[0.08] px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-white/55">
                        <IconFork className="text-white/45" />
                        Fork
                      </span>
                    ) : null}
                    {r.archived ? (
                      <span className="inline-flex items-center gap-0.5 rounded bg-amber-900/45 px-1 py-px text-[9px] font-semibold uppercase tracking-wide text-amber-100">
                        <IconArchive className="text-amber-200/90" />
                        Archived
                      </span>
                    ) : null}
                  </div>
                  {r.description ? (
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/65">
                      {r.description}
                    </p>
                  ) : null}
                  <NautilusRowMeta compact>
                    {r.language ? (
                      <span className="inline-flex items-center gap-1">
                        <IconCode className="shrink-0 text-[var(--pq-accent)]/75" />
                        <span className="text-white/45">Language</span>{" "}
                        {r.language}
                      </span>
                    ) : null}
                    <span className="inline-flex items-center gap-1">
                      <IconStar className="shrink-0 text-[var(--pq-accent)]/75" />
                      <span className="text-white/45">Stars</span>{" "}
                      {r.stargazers_count}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <IconFork className="shrink-0 text-[var(--pq-accent)]/75" />
                      <span className="text-white/45">Forks</span>{" "}
                      {r.forks_count}
                    </span>
                    {r.updated_at ? (
                      <span className="inline-flex items-center gap-1">
                        <IconCalendar className="shrink-0 text-[var(--pq-accent)]/75" />
                        <span className="text-white/45">Updated</span>{" "}
                        {new Date(r.updated_at).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    ) : null}
                  </NautilusRowMeta>
                  {r.topics.length > 0 ? (
                    <div className="mt-1 flex flex-wrap items-center gap-1">
                      <IconTag className="shrink-0 text-white/35" />
                      {r.topics.slice(0, 8).map((t) => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-0.5 rounded-full border border-[color-mix(in_oklab,var(--pq-accent)_40%,transparent)] bg-[color-mix(in_oklab,var(--pq-accent)_14%,transparent)] px-1.5 py-px text-[10px] font-medium text-[var(--pq-accent)]"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                  ) : null}
                </div>
                {r.homepage ? (
                  <HomepageLinkButton
                    repoName={r.name}
                    homepage={r.homepage}
                  />
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}
    </NautilusWindow>
  );
}
