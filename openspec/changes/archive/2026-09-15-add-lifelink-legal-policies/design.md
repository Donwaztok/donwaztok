## Context

The donwaztok site already serves privacy policies from `content/policies/{project}/{policy}.md` via `import.meta.glob`, static generation at `app/[project]/[policy]/page.tsx`, and an index at `/policies/`. Published policies today: PocketFlow, app-template, and tic-tac-toe (`privacy.md` only). Scope is privacy only — no terms of use.

LifeLink (sibling Expo app, slug `lifelink`, package `com.Donwaztok.lifelink`) shares AdMob, expo-iap, Expo Updates, AsyncStorage, and SecureStore with those apps. It also syncs Room Mode over LAN TCP (`HOST_IP:PORT#ROOMCODE`) without a Donwaztok backend.

See `proposal.md` for motivation (store submission). See the delta spec for required disclosures.

## Goals / Non-Goals

**Goals:**

- Publish the LifeLink privacy policy using the existing policy pipeline (no routing or loader changes).
- Keep shared sections aligned with `content/policies/tic-tac-toe/privacy.md`.
- Disclose Room Mode LAN sync as a dedicated privacy section.
- Register the app in `lib/mobile-apps.ts` for site discovery.
- Provide the canonical privacy URL for Google Play / App Store console fields.

**Non-Goals:**

- Translating policies to other languages (English only, as today).
- Adding in-app policy links inside the LifeLink mobile app (separate change in the lifelink repo).
- Legal review by a lawyer; documents follow the established Donwaztok template plus the LAN disclosure.
- Publishing terms of use (privacy only, same as PocketFlow and tic-tac-toe).
- Changing LifeLink networking, ads, or persistence behavior.

## Decisions

### Project slug: `lifelink`

Use `lifelink` as the `{project}` segment. Matches the Expo slug and the kebab-case convention (`pocket-flow`, `tic-tac-toe`).

**Alternatives considered:** `life-link` (less consistent with the Expo slug); `com-donwaztok-lifelink` (package-derived, less readable).

### Package id casing

Use `com.Donwaztok.lifelink` exactly as in LifeLink `app.json` (`android.package` and `ios.bundleIdentifier`). Do not lowercase to `com.donwaztok.lifelink`.

**Alternatives considered:** normalize to lowercase like PocketFlow / tic-tac-toe. Rejected: store consoles and the binary use the mixed-case id.

### Privacy policy: clone template, insert LAN section

Copy structure and tone from `content/policies/tic-tac-toe/privacy.md`. Frontmatter:

| Field | Value |
|-------|-------|
| `title` | Privacy Policy |
| `description` | Privacy policy for LifeLink (com.Donwaztok.lifelink). |
| `updated` | 2026-09-15 |
| `appName` | LifeLink |
| `appPackage` | com.Donwaztok.lifelink |

Section order (10 sections):

1. Data controller (unchanged)
2. Data we do not collect directly (unchanged)
3. Data stored on your device — add saved GameState (player display names, life totals, play/commander counters, table layout)
4. Advertising (Google AdMob) (unchanged)
5. In-app purchases (unchanged)
6. App updates (Expo / EAS Update) (unchanged)
7. **Local network (Room Mode)** — new
8. Children (was 7)
9. Changes (was 8)
10. Your rights (was 9)

Room Mode section MUST state:

- Sync is optional and only when the user creates or joins a LAN room.
- Traffic stays on the local Wi-Fi (TCP); it is not relayed through Donwaztok servers.
- Shared payload is game data: display names, life totals, counters, roster — not account credentials.
- The share code includes a local IP, port, and room code; anyone on that LAN with the code can join.
- iOS may show a local-network permission prompt; Android uses the Advertising ID permission for ads (already covered in section 4).

**Alternatives considered:** fold LAN into section 3 only (too easy to miss for store reviewers); claim “no network data” (false).

### Mobile app registry entry

Add to `lib/mobile-apps.ts`:

```typescript
{
  id: "lifelink",
  name: "LifeLink",
  shortDescription:
    "Commander life tracker with table layouts, play counters, AdMob, and optional LAN room sync.",
  packageId: "com.Donwaztok.lifelink",
  iosBundleId: "com.Donwaztok.lifelink",
  platforms: ["Android", "iOS"],
  stack: "Expo · React Native · TypeScript",
  updated: "2026-09-15",
  privacyPolicyPath: "lifelink/privacy",
}
```

Store listing URLs and `repoUrl` omitted until published / confirmed public.

### No code changes to policy loader

The existing glob `../content/policies/*/*.md` automatically picks up new files. No changes to `lib/policies.ts`, routes, or components.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Template policies may not cover all store-specific Data safety fields | Follow PocketFlow/tic-tac-toe sections (already used for Play) plus an explicit LAN section; review Play Console / App Store Connect prompts during submission |
| English-only may limit some locales | Consistent with existing policies; add locales later if needed |
| Package id casing differs from other apps | Document as-is from `app.json`; do not “fix” casing in the policy |
| Documents are not lawyer-reviewed | Same as existing policies; labeled as template-based |

## Migration Plan

1. Add markdown files under `content/policies/lifelink/`.
2. Update `lib/mobile-apps.ts`.
3. Deploy donwaztok site (Vercel) — static pages regenerate via `generateStaticParams`.
4. Verify URLs live before pasting into Play Console / App Store Connect.
5. Rollback: remove files and registry entry; redeploy.

## Open Questions

- Confirm public GitHub repo URL for `repoUrl` (omit if private).
- Play Store / App Store listing URLs — add to the `mobileApps` entry after first publish.
