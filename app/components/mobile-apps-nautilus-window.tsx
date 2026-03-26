"use client";

import type { MobileApp } from "@/lib/mobile-apps";
import { mobileApps } from "@/lib/mobile-apps";
import type {
  EnrichedMobileApp,
  MobileAppsStorePayload,
} from "@/lib/mobile-store-types";
import { useEffect, useState } from "react";
import {
  IconCalendar,
  IconCode,
  IconDownload,
  IconExternal,
  IconLayers,
  IconSmartphone,
  IconStar,
  IconTag,
} from "./nautilus-list-icons";
import { NautilusRowMeta } from "./nautilus-row-meta";
import { NautilusWindow } from "./nautilus-window";

function formatPlayUpdated(ts: number | null) {
  if (ts == null) return null;
  try {
    return new Date(ts).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function StoreIcon({
  src,
  alt,
}: {
  src: string | null | undefined;
  alt: string;
}) {
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      className="h-8 w-8 shrink-0 rounded-lg border border-white/10 bg-white/5 object-cover ring-1 ring-white/10"
      width={32}
      height={32}
      loading="lazy"
      decoding="async"
    />
  );
}

function PlaceholderAppIcon() {
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-[var(--pq-accent)] ring-1 ring-white/10">
      <IconSmartphone className="h-[14px] w-[14px]" />
    </span>
  );
}

function MobileAppRow({
  app,
  store,
}: {
  app: MobileApp;
  store?: EnrichedMobileApp["store"];
}) {
  const play = store?.play ?? null;
  const appStore = store?.appStore ?? null;

  const displayTitle =
    play?.title || appStore?.trackName || app.name;
  const displayBlurb =
    play?.summary ||
    (appStore?.description
      ? appStore.description.split("\n")[0]?.slice(0, 220)
      : "") ||
    app.shortDescription;
  const iconSrc =
    play?.icon || (appStore?.artworkUrl512 ? appStore.artworkUrl512 : null);
  const playHref = play?.url ?? app.playStoreUrl;
  const iosHref = appStore?.trackViewUrl || app.appStoreUrl;

  return (
    <li className="px-3 py-2 hover:bg-white/[0.04] sm:px-3.5 sm:py-2">
      <div className="flex items-start gap-2">
        {iconSrc ? (
          <StoreIcon src={iconSrc} alt={displayTitle} />
        ) : (
          <PlaceholderAppIcon />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold leading-tight text-[var(--pq-accent)]">
            {displayTitle}
          </p>
          {displayBlurb ? (
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/65">
              {displayBlurb}
            </p>
          ) : null}
          {play?.description && play.description !== play.summary ? (
            <p className="mt-0.5 line-clamp-2 text-[11px] leading-snug text-white/55">
              {play.description}
            </p>
          ) : null}
          <NautilusRowMeta compact>
            {app.packageId ? (
              <span className="inline-flex items-center gap-1">
                <IconCode className="shrink-0 text-[var(--pq-accent)]/75" />
                <span className="text-white/45">Package</span>{" "}
                <code className="rounded bg-white/[0.08] px-1 text-[11px] text-white/85">
                  {app.packageId}
                </code>
              </span>
            ) : null}
            {app.iosBundleId ? (
              <span className="inline-flex items-center gap-1">
                <IconSmartphone className="shrink-0 text-[var(--pq-accent)]/75" />
                <span className="text-white/45">iOS bundle</span>{" "}
                <code className="rounded bg-white/[0.08] px-1 text-[11px] text-white/85">
                  {app.iosBundleId}
                </code>
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1">
              <IconLayers className="shrink-0 text-[var(--pq-accent)]/75" />
              <span className="text-white/45">Platforms</span>{" "}
              {app.platforms.join(" · ")}
            </span>
            {app.stack ? (
              <span className="inline-flex items-center gap-1">
                <IconCode className="shrink-0 text-[var(--pq-accent)]/75" />
                <span className="text-white/45">Stack</span> {app.stack}
              </span>
            ) : null}
            {app.updated ? (
              <span className="inline-flex items-center gap-1">
                <IconCalendar className="shrink-0 text-[var(--pq-accent)]/75" />
                <span className="text-white/45">
                  {store ? "Site note" : "Updated"}
                </span>{" "}
                {app.updated}
              </span>
            ) : null}
            {play ? (
              <>
                {play.score != null ? (
                  <span className="inline-flex items-center gap-1">
                    <IconStar className="shrink-0 text-[var(--pq-accent)]/75" />
                    <span className="text-white/45">Play</span> ★{" "}
                    {play.score.toFixed(1)}
                    {play.ratings != null
                      ? ` · ${play.ratings.toLocaleString("pt-BR")} avaliações`
                      : null}
                  </span>
                ) : null}
                {play.installs ? (
                  <span className="inline-flex items-center gap-1">
                    <IconDownload className="shrink-0 text-[var(--pq-accent)]/75" />
                    <span className="text-white/45">Installs</span> {play.installs}
                  </span>
                ) : null}
                {formatPlayUpdated(play.updated) ? (
                  <span className="inline-flex items-center gap-1">
                    <IconCalendar className="shrink-0 text-[var(--pq-accent)]/75" />
                    <span className="text-white/45">Play updated</span>{" "}
                    {formatPlayUpdated(play.updated)}
                  </span>
                ) : null}
                {play.version ? (
                  <span className="inline-flex items-center gap-1">
                    <IconTag className="shrink-0 text-[var(--pq-accent)]/75" />
                    <span className="text-white/45">Play version</span>{" "}
                    {play.version}
                  </span>
                ) : null}
              </>
            ) : null}
            {appStore ? (
              <>
                {appStore.averageUserRating != null ? (
                  <span className="inline-flex items-center gap-1">
                    <IconStar className="shrink-0 text-[var(--pq-accent)]/75" />
                    <span className="text-white/45">App Store</span> ★{" "}
                    {appStore.averageUserRating.toFixed(1)}
                    {appStore.userRatingCount != null
                      ? ` · ${appStore.userRatingCount.toLocaleString("pt-BR")} avaliações`
                      : null}
                  </span>
                ) : null}
                {appStore.version ? (
                  <span className="inline-flex items-center gap-1">
                    <IconTag className="shrink-0 text-[var(--pq-accent)]/75" />
                    <span className="text-white/45">iOS version</span>{" "}
                    {appStore.version}
                  </span>
                ) : null}
                {appStore.primaryGenreName ? (
                  <span className="inline-flex items-center gap-1">
                    <IconTag className="shrink-0 text-[var(--pq-accent)]/75" />
                    <span className="text-white/45">Genre</span>{" "}
                    {appStore.primaryGenreName}
                  </span>
                ) : null}
              </>
            ) : null}
          </NautilusRowMeta>
          {playHref || iosHref || app.repoUrl ? (
            <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
              {playHref ? (
                <a
                  href={playHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-[11px] font-medium text-[var(--pq-accent)] underline-offset-2 hover:text-[#ffe08a] hover:underline"
                >
                  Google Play
                  <IconExternal className="shrink-0 text-white/35 transition-colors group-hover:text-[var(--pq-accent)]" />
                </a>
              ) : null}
              {iosHref ? (
                <a
                  href={iosHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-[11px] font-medium text-[var(--pq-accent)] underline-offset-2 hover:text-[#ffe08a] hover:underline"
                >
                  App Store
                  <IconExternal className="shrink-0 text-white/35 transition-colors group-hover:text-[var(--pq-accent)]" />
                </a>
              ) : null}
              {app.repoUrl ? (
                <a
                  href={app.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 text-[11px] font-medium text-[var(--pq-accent)] underline-offset-2 hover:text-[#ffe08a] hover:underline"
                >
                  Repository
                  <IconExternal className="shrink-0 text-white/35 transition-colors group-hover:text-[var(--pq-accent)]" />
                </a>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export function MobileAppsNautilusWindow({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [storeApps, setStoreApps] = useState<EnrichedMobileApp[] | null>(null);
  const [appsErr, setAppsErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setAppsErr(null);
    fetch("/api/mobile-apps-store/")
      .then((r) => r.json())
      .then((d: MobileAppsStorePayload | { ok?: boolean }) => {
        if (cancelled) return;
        if (d.ok === true && "apps" in d && Array.isArray(d.apps)) {
          setStoreApps(d.apps);
        } else {
          setAppsErr("Could not load store listings.");
        }
      })
      .catch(() => {
        if (!cancelled) setAppsErr("Could not load store listings.");
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  return (
    <NautilusWindow
      open={open}
      onClose={onClose}
      title="Mobile apps"
      pathLabel="Mobile apps"
    >
      <div>
        {appsErr ? (
          <p className="border-b border-white/[0.08] bg-red-950/40 px-3 py-2 text-xs text-red-200/95 sm:px-3.5">
            {appsErr} — showing local list only.
          </p>
        ) : null}
        {storeApps === null && !appsErr ? (
          <p
            className="border-b border-white/[0.08] bg-white/[0.04] px-3 py-2 text-xs text-white/55 sm:px-3.5"
            aria-live="polite"
          >
            Carregando dados das lojas…
          </p>
        ) : null}
        {mobileApps.length === 0 ? (
          <p className="px-3 py-4 text-sm text-white/50 sm:px-3.5">
            No apps listed.
          </p>
        ) : (
          <ul className="divide-y divide-white/[0.08]">
            {mobileApps.map((app) => (
              <MobileAppRow
                key={app.id}
                app={app}
                store={storeApps?.find((e) => e.id === app.id)?.store}
              />
            ))}
          </ul>
        )}
      </div>
    </NautilusWindow>
  );
}
