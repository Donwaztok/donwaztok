import type { MobileApp } from "@/lib/mobile-apps";

/** Trimmed Google Play listing (from google-play-scraper). */
export type PlayStoreListing = {
  title: string;
  summary: string;
  description: string;
  score: number | null;
  ratings: number | null;
  installs: string | null;
  icon: string | null;
  url: string;
  developer: string;
  genre: string | null;
  version: string | null;
  released: string | null;
  updated: number | null;
  contentRating: string | null;
  free: boolean;
  offersIAP: boolean;
};

/** Trimmed iTunes / App Store lookup (official Apple JSON API). */
export type AppStoreListing = {
  trackName: string;
  description: string;
  artworkUrl512: string;
  averageUserRating: number | null;
  userRatingCount: number | null;
  sellerName: string;
  trackViewUrl: string;
  version: string;
  bundleId: string;
  primaryGenreName: string | null;
  currentVersionReleaseDate: string | null;
};

export type EnrichedMobileApp = MobileApp & {
  store: {
    play: PlayStoreListing | null;
    appStore: AppStoreListing | null;
    /** Human-readable when a store fetch failed (app unpublished, wrong id, etc.) */
    playError?: string;
    appStoreError?: string;
  };
};

export type MobileAppsStorePayload = {
  ok: true;
  apps: EnrichedMobileApp[];
};
