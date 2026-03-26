"use client";

import type { PolicyIndexEntry } from "@/lib/policies";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  IconAppBadge,
  IconCalendar,
  IconChevronRight,
  IconCode,
  IconDocument,
} from "./nautilus-list-icons";
import { NautilusRowMeta } from "./nautilus-row-meta";
import { NautilusWindow } from "./nautilus-window";

export function PoliciesNautilusWindow({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [policies, setPolicies] = useState<PolicyIndexEntry[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setError(null);
    fetch("/api/policies-list/")
      .then((r) => r.json())
      .then((d: { ok?: boolean; policies?: PolicyIndexEntry[] }) => {
        if (cancelled) return;
        if (d.ok && Array.isArray(d.policies)) setPolicies(d.policies);
        else setError("Could not load policies.");
      })
      .catch(() => {
        if (!cancelled) setError("Could not load policies.");
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <NautilusWindow
      open={open}
      onClose={onClose}
      title="Privacy policies"
      pathLabel="Privacy policies"
    >
      {error ? (
        <p className="px-3 py-4 text-sm text-red-300 sm:px-3.5">{error}</p>
      ) : policies === null ? (
        <p className="px-3 py-4 text-sm text-white/50 sm:px-3.5">Loading…</p>
      ) : policies.length === 0 ? (
        <p className="px-3 py-4 text-sm text-white/50 sm:px-3.5">
          No policy files in{" "}
          <code className="rounded bg-white/[0.08] px-1 text-xs text-white/80">
            content/policies/
          </code>
          .
        </p>
      ) : (
        <ul className="divide-y divide-white/[0.08]">
          {policies.map((p) => (
            <li
              key={`${p.project}/${p.policy}`}
              className="px-3 py-2 hover:bg-white/[0.04] sm:px-3.5 sm:py-2"
            >
              <div className="flex items-start gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[var(--pq-accent)] ring-1 ring-white/10">
                  <IconDocument />
                </span>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/${p.project}/${p.policy}/`}
                    className="group inline-flex items-center gap-1 text-[13px] font-semibold leading-tight text-[var(--pq-accent)] hover:text-[#ffe08a] hover:underline"
                  >
                    {p.title ?? `${p.project} / ${p.policy}`}
                    <IconChevronRight className="shrink-0 text-white/35 transition-colors group-hover:text-[var(--pq-accent)]" />
                  </Link>
                  <p className="mt-px font-mono text-[11px] leading-tight text-white/38">
                    /{p.project}/{p.policy}/
                  </p>
                  {p.description ? (
                    <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/65">
                      {p.description}
                    </p>
                  ) : null}
                  <NautilusRowMeta compact>
                    {p.appName ? (
                      <span className="inline-flex items-center gap-1">
                        <IconAppBadge className="shrink-0 text-[var(--pq-accent)]/75" />
                        <span className="text-white/45">App</span> {p.appName}
                      </span>
                    ) : null}
                    {p.appPackage ? (
                      <span className="inline-flex items-center gap-1">
                        <IconCode className="shrink-0 text-[var(--pq-accent)]/75" />
                        <span className="text-white/45">Package</span>{" "}
                        <code className="rounded bg-white/[0.08] px-1 text-[11px] text-white/85">
                          {p.appPackage}
                        </code>
                      </span>
                    ) : null}
                    {p.updated ? (
                      <span className="inline-flex items-center gap-1">
                        <IconCalendar className="shrink-0 text-[var(--pq-accent)]/75" />
                        <span className="text-white/45">Document date</span>{" "}
                        {p.updated}
                      </span>
                    ) : null}
                  </NautilusRowMeta>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </NautilusWindow>
  );
}
