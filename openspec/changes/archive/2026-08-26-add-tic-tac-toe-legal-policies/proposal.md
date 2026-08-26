## Why

**Don's Tic Tac Toe** (`com.donwaztok.tictactoeinfinite`) is ready for store submission and requires publicly hosted legal documents — privacy policy and terms of use — as mandated by Google Play and the App Store. The donwaztok site already hosts policies for PocketFlow and the app template; tic-tac-toe needs the same treatment before listing.

## What Changes

- Add **privacy policy** markdown at `content/policies/tic-tac-toe/privacy.md`, following the existing PocketFlow / app-template structure and frontmatter.
- Add **terms of use** markdown at `content/policies/tic-tac-toe/terms.md`, using the same frontmatter convention and a parallel section layout appropriate for a free mobile game with AdMob, in-app purchases, and Expo Updates.
- Register the app in `lib/mobile-apps.ts` with `privacyPolicyPath: "tic-tac-toe/privacy"` (and note terms URL in listing metadata where applicable).
- Document canonical public URLs for store console fields (`/tic-tac-toe/privacy/`, `/tic-tac-toe/terms/`).

## Capabilities

### New Capabilities

- `app-legal-policies`: Hosted legal documents (privacy policy and terms of use) for Donwaztok mobile apps, discoverable via the existing `/policies/` index and `/{project}/{policy}/` routes.

### Modified Capabilities

- (none)

## Impact

- **Content:** `content/policies/tic-tac-toe/privacy.md`, `content/policies/tic-tac-toe/terms.md` (new).
- **Site registry:** `lib/mobile-apps.ts` — new entry for Don's Tic Tac Toe.
- **Routing / rendering:** no code changes required; existing `lib/policies.ts` glob and `app/[project]/[policy]/page.tsx` pick up new files automatically.
- **Mobile app (tic-tac-toe):** optional in-app links to policy URLs for settings/about screen and store metadata; out of scope for donwaztok repo unless added as a follow-up in the tic-tac-toe repo.
- **Dependencies:** none.
