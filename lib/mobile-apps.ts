/**
 * Published mobile apps — edit as you ship new apps.
 */
export type MobileApp = {
  id: string;
  name: string;
  shortDescription: string;
  /**
   * Google Play application id (same as Android package name).
   * Used with `google-play-scraper` on the server (unofficial; may break if Play changes HTML).
   */
  /** Required for Android / Play lookup; omit for iOS-only entries. */
  packageId?: string;
  platforms: ("Android" | "iOS")[];
  /** iOS bundle id for Apple’s public Lookup API (`itunes.apple.com/lookup?bundleId=`) */
  iosBundleId?: string;
  /** Numeric App Store id if you prefer lookup by id instead of bundle id */
  appStoreTrackId?: string;
  /** Tech / stack hint */
  stack?: string;
  /** Last meaningful release or store listing update */
  updated?: string;
  playStoreUrl?: string;
  appStoreUrl?: string;
  privacyPolicyPath?: string;
  repoUrl?: string;
  notes?: string;
};

export const mobileApps: MobileApp[] = [
  {
    id: "pocketflow",
    name: "PocketFlow",
    shortDescription:
      "PocketFlow — Android app with AdMob, in-app purchases, and Expo / EAS updates.",
    packageId: "com.donwaztok.pocketflow",
    platforms: ["Android"],
    stack: "Expo · React Native · TypeScript",
    updated: "2026-03-30",
    privacyPolicyPath: "pocket-flow/privacy",
  },
];
