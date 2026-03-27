import { mobileApps } from "@/lib/mobile-apps";
import type {
  AppStoreListing,
  EnrichedMobileApp,
  PlayStoreListing,
} from "@/lib/mobile-store-types";
import { fetchWithNext } from "@/lib/vinext-fetch";
import { NextResponse } from "next/server";
import gplay from "google-play-scraper";

const DESC_MAX = 2800;

function trimDesc(s: string) {
  if (s.length <= DESC_MAX) return s;
  return `${s.slice(0, DESC_MAX)}…`;
}

async function fetchPlay(appId: string): Promise<PlayStoreListing> {
  const d = await gplay.app({
    appId,
    country: "br",
    lang: "pt",
  });
  return {
    title: String(d.title ?? ""),
    summary: String(d.summary ?? ""),
    description: trimDesc(String(d.description ?? "")),
    score: typeof d.score === "number" ? d.score : null,
    ratings: typeof d.ratings === "number" ? d.ratings : null,
    installs: d.installs != null ? String(d.installs) : null,
    icon: d.icon != null ? String(d.icon) : null,
    url: `https://play.google.com/store/apps/details?id=${encodeURIComponent(appId)}`,
    developer: String(d.developer ?? ""),
    genre: d.genre != null ? String(d.genre) : null,
    version: d.version != null ? String(d.version) : null,
    released: d.released != null ? String(d.released) : null,
    updated: typeof d.updated === "number" ? d.updated : null,
    contentRating: d.contentRating != null ? String(d.contentRating) : null,
    free: Boolean(d.free),
    offersIAP: Boolean(d.offersIAP),
  };
}

async function fetchAppStore(
  bundleId?: string,
  trackId?: string,
): Promise<AppStoreListing | null> {
  const q = trackId
    ? `id=${encodeURIComponent(trackId)}`
    : bundleId
      ? `bundleId=${encodeURIComponent(bundleId)}`
      : null;
  if (!q) return null;

  const res = await fetchWithNext(
    `https://itunes.apple.com/lookup?${q}&country=br`,
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 3600 },
    },
  );
  if (!res.ok) return null;
  const j = (await res.json()) as {
    resultCount?: number;
    results?: Record<string, unknown>[];
  };
  const i = j.results?.[0];
  if (!i) return null;

  return {
    trackName: String(i.trackName ?? ""),
    description: trimDesc(String(i.description ?? "")),
    artworkUrl512: String(
      i.artworkUrl512 ?? i.artworkUrl100 ?? i.artworkUrl60 ?? "",
    ),
    averageUserRating:
      typeof i.averageUserRating === "number" ? i.averageUserRating : null,
    userRatingCount:
      typeof i.userRatingCount === "number" ? i.userRatingCount : null,
    sellerName: String(i.sellerName ?? ""),
    trackViewUrl: String(i.trackViewUrl ?? ""),
    version: String(i.version ?? ""),
    bundleId: String(i.bundleId ?? ""),
    primaryGenreName:
      i.primaryGenreName != null ? String(i.primaryGenreName) : null,
    currentVersionReleaseDate:
      i.currentVersionReleaseDate != null
        ? String(i.currentVersionReleaseDate)
        : null,
  };
}

export async function GET() {
  const apps: EnrichedMobileApp[] = [];

  for (const app of mobileApps) {
    const store: EnrichedMobileApp["store"] = {
      play: null,
      appStore: null,
    };

    const wantPlay =
      app.platforms.includes("Android") && Boolean(app.packageId?.trim());
    const wantIos =
      app.platforms.includes("iOS") &&
      (Boolean(app.iosBundleId?.trim()) || Boolean(app.appStoreTrackId?.trim()));

    if (wantPlay && app.packageId) {
      try {
        store.play = await fetchPlay(app.packageId.trim());
      } catch (e) {
        store.playError =
          e instanceof Error ? e.message : "Play Store lookup failed";
      }
    }

    if (wantIos) {
      try {
        const listing = await fetchAppStore(
          app.iosBundleId?.trim(),
          app.appStoreTrackId?.trim(),
        );
        store.appStore = listing;
        if (!listing) {
          store.appStoreError = "App not found in App Store lookup.";
        }
      } catch (e) {
        store.appStoreError =
          e instanceof Error ? e.message : "App Store lookup failed";
      }
    }

    apps.push({ ...app, store });
  }

  return NextResponse.json(
    { ok: true as const, apps },
    {
      headers: {
        "Cache-Control": "s-maxage=1800, stale-while-revalidate=3600",
      },
    },
  );
}
