## 1. Privacy policy

- [x] 1.1 Create `content/policies/tic-tac-toe/privacy.md` by adapting `content/policies/pocket-flow/privacy.md`
- [x] 1.2 Set frontmatter: `appName: Don's Tic Tac Toe`, `appPackage: com.donwaztok.tictactoeinfinite`, `updated: 2026-08-26`
- [x] 1.3 Verify all 9 sections are present (controller, no registration, local data, AdMob, IAP, Expo Updates, children, changes, rights)

## 2. Terms of use

- [x] 2.1 Create `content/policies/tic-tac-toe/terms.md` with matching frontmatter (`title: Terms of Use`)
- [x] 2.2 Write 9 sections: acceptance, license, IAP/refunds, advertising, acceptable use, disclaimer, changes, contact, governing law
- [x] 2.3 Use same provider contact (`igordonwaztok@gmail.com`) and Donwaztok branding as privacy policy

## 3. Site registry

- [x] 3.1 Add Don's Tic Tac Toe entry to `lib/mobile-apps.ts` with `privacyPolicyPath: "tic-tac-toe/privacy"`
- [x] 3.2 Set `packageId`, `platforms`, `stack`, and `updated` fields per design.md (omit `repoUrl` unless repo is public)

## 4. Verification

- [x] 4.1 Run local dev server and confirm `/tic-tac-toe/privacy/` and `/tic-tac-toe/terms/` render correctly
- [x] 4.2 Confirm both documents appear on `/policies/` index
- [ ] 4.3 After deploy, paste canonical URLs into Google Play Console and App Store Connect
