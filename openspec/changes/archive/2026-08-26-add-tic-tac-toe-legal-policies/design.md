## Context

The donwaztok site already serves legal documents from `content/policies/{project}/{policy}.md` via `import.meta.glob`, static generation at `app/[project]/[policy]/page.tsx`, and an index at `/policies/`. PocketFlow and app-template each have a `privacy.md`; there is no `terms.md` yet in the repo.

Don's Tic Tac Toe (`tic-tac-toe` repo) is an Expo / React Native game with AdMob, in-app purchases (expo-iap), Expo Updates, and local storage (AsyncStorage / SecureStore) — the same integration surface as the existing privacy templates.

See `proposal.md` for motivation (store submission requirements).

## Goals / Non-Goals

**Goals:**

- Publish privacy policy and terms of use for tic-tac-toe using the existing policy pipeline (no routing or loader changes).
- Match the content structure and frontmatter of `content/policies/pocket-flow/privacy.md`.
- Register the app in `lib/mobile-apps.ts` for site discovery.
- Provide canonical URLs for Google Play / App Store console fields.

**Non-Goals:**

- Translating policies to other languages (English only, as today).
- Adding in-app policy links inside the tic-tac-toe mobile app (can be a separate tic-tac-toe change).
- Legal review by a lawyer; documents follow the established Donwaztok template pattern.
- Adding `termsPolicyPath` to the `MobileApp` type (not needed yet; terms URL is derivable from the same slug pattern).

## Decisions

### Project slug: `tic-tac-toe`

Use `tic-tac-toe` as the `{project}` segment, consistent with kebab-case slugs (`pocket-flow`, `app-template`) and the Expo slug `dons-tic-tac-toe`.

**Alternatives considered:** `dons-tic-tac-toe` (longer, redundant with brand prefix); `tictactoeinfinite` (package-derived, less readable).

### Privacy policy: clone and adapt template

Copy the structure from `content/policies/pocket-flow/privacy.md` (9 sections) and update frontmatter:

| Field | Value |
|-------|-------|
| `title` | Privacy Policy |
| `description` | Privacy policy for Don's Tic Tac Toe (com.donwaztok.tictactoeinfinite). |
| `updated` | 2026-08-26 |
| `appName` | Don's Tic Tac Toe |
| `appPackage` | com.donwaztok.tictactoeinfinite |

Body text stays identical to the template except where game-specific wording is needed (none required — integrations are the same).

### Terms of use: new document, parallel structure

Create `content/policies/tic-tac-toe/terms.md` as the first terms document in the repo. Sections (proposed):

1. Acceptance of terms
2. License to use
3. In-app purchases and refunds
4. Advertising
5. Acceptable use
6. Disclaimer and limitation of liability
7. Changes to terms
8. Contact
9. Governing law

Same frontmatter keys as privacy; `title: Terms of Use`.

Tone and contact email match existing policies (`igordonwaztok@gmail.com`, **Donwaztok** as provider).

### Mobile app registry entry

Add to `lib/mobile-apps.ts`:

```typescript
{
  id: "tic-tac-toe",
  name: "Don's Tic Tac Toe",
  shortDescription: "Classic tic-tac-toe with themes, AdMob, and in-app purchases.",
  packageId: "com.donwaztok.tictactoeinfinite",
  platforms: ["Android", "iOS"],
  stack: "Expo · React Native · TypeScript",
  updated: "2026-08-26",
  privacyPolicyPath: "tic-tac-toe/privacy",
  repoUrl: "https://github.com/Donwaztok/tic-tac-toe", // if public; omit if private
}
```

Store URLs omitted until published.

### No code changes to policy loader

The existing glob `../content/policies/*/*.md` automatically picks up new files. No changes to `lib/policies.ts`, routes, or components.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Template policies may not cover all store-specific fields | Follow same sections as PocketFlow (already accepted for Play); review Play Console / App Store Connect prompts during submission |
| Terms document is new pattern (no prior example in repo) | Base on privacy template tone; keep sections standard for mobile games |
| English-only may limit some locales | Consistent with existing policies; add locales later if needed |

## Migration Plan

1. Add markdown files under `content/policies/tic-tac-toe/`.
2. Update `lib/mobile-apps.ts`.
3. Deploy donwaztok site (Vercel) — static pages regenerate via `generateStaticParams`.
4. Verify URLs live before pasting into Play Console / App Store Connect.
5. Rollback: remove files and registry entry; redeploy.

## Open Questions

- Confirm public GitHub repo URL for `repoUrl` field (omit if repo is private).
- Play Store / App Store listing URLs — add to `mobileApps` entry after first publish.
