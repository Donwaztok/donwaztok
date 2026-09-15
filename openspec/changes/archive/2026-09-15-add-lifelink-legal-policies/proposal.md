## Why

**LifeLink** (`com.Donwaztok.lifelink`) is approaching store submission and needs a publicly hosted privacy policy, as required by Google Play and the App Store. The donwaztok site already publishes privacy policies for PocketFlow and Don's Tic Tac Toe; LifeLink needs the same treatment, plus a LAN Room Mode section that those apps do not have.

## What Changes

- Add a **privacy policy** at `content/policies/lifelink/privacy.md`, following the PocketFlow / tic-tac-toe structure and frontmatter, with an extra section for local-network Room Mode sync.
- Register LifeLink in `lib/mobile-apps.ts` with `privacyPolicyPath: "lifelink/privacy"`.
- Document the canonical public URL for store console fields (`/lifelink/privacy/`).

## Capabilities

### New Capabilities

- (none)

### Modified Capabilities

- `app-legal-policies`: Publish a hosted privacy policy for LifeLink, listed on `/policies/` and reachable at `/lifelink/privacy/`.

## Impact

- **Content:** `content/policies/lifelink/privacy.md` (new).
- **Site registry:** `lib/mobile-apps.ts` — new LifeLink entry.
- **Routing / rendering:** no code changes required; existing `lib/policies.ts` glob and `app/[project]/[policy]/page.tsx` pick up new files automatically.
- **Mobile app (lifelink repo):** optional in-app links to the policy URL for settings/about and store metadata; out of scope for this donwaztok change.
- **Dependencies:** none.
