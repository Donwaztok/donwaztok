## 1. Privacy policy

- [x] 1.1 Create `content/policies/lifelink/privacy.md` by adapting `content/policies/tic-tac-toe/privacy.md` and verify the file exists with English body text
- [x] 1.2 Set frontmatter `appName: LifeLink`, `appPackage: com.Donwaztok.lifelink`, `updated: 2026-09-15` and verify those fields parse in the YAML header
- [x] 1.3 Expand section 3 to mention saved GameState (player display names, life totals, play/commander counters, table layout) and verify those items appear in the published markdown
- [x] 1.4 Insert section 7 **Local network (Room Mode)** covering optional LAN TCP sync, no Donwaztok relay, game-data payload, and share-code join risk, then renumber Children/Changes/Rights to 8–10 and verify all 10 sections are present

## 2. Site registry

- [x] 2.1 Add a LifeLink entry to `lib/mobile-apps.ts` with `privacyPolicyPath: "lifelink/privacy"` and verify TypeScript still type-checks
- [x] 2.2 Set `packageId` and `iosBundleId` to `com.Donwaztok.lifelink`, plus `platforms`, `stack`, and `updated` per design.md, omit `repoUrl` / store URLs, and verify the catalog object matches those fields

## 3. Verification

- [x] 3.1 Run the local dev server and confirm `/lifelink/privacy/` renders the correct title, app name, package id, and last-updated date
- [x] 3.2 Confirm the LifeLink privacy policy appears on `/policies/`
- [x] 3.3 Remove `content/policies/lifelink/terms.md` and drop terms from this change’s artifacts; verify `/lifelink/terms/` is no longer listed
- [ ] 3.4 After deploy, paste the canonical URL (`/lifelink/privacy/`) into Google Play Console and App Store Connect
