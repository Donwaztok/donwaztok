## Purpose

Provide publicly accessible legal documents for Donwaztok mobile apps on the donwaztok site, using a consistent markdown format and URL structure for store compliance and user transparency.

## ADDED Requirements

### Requirement: Tic Tac Toe privacy policy is published

The system SHALL host a privacy policy for **Don's Tic Tac Toe** at `content/policies/tic-tac-toe/privacy.md`, served at the public URL path `/tic-tac-toe/privacy/`.

The document MUST include YAML frontmatter with at least: `title`, `description`, `updated`, `appName`, and `appPackage` (`com.donwaztok.tictactoeinfinite`).

The policy content MUST cover, at minimum: data controller contact, absence of user registration, locally stored data (theme, language, purchase state), Google AdMob advertising, in-app purchases via Google Play / App Store, Expo Updates, children (under 13), policy changes, and user rights (LGPD / GDPR reference).

#### Scenario: Privacy policy page is reachable

- **WHEN** a visitor navigates to `/tic-tac-toe/privacy/`
- **THEN** the page renders the privacy policy with correct title, app name, package id, and last-updated date from frontmatter

#### Scenario: Privacy policy appears in index

- **WHEN** a visitor navigates to `/policies/`
- **THEN** the tic-tac-toe privacy policy is listed with its app name or title

### Requirement: Tic Tac Toe terms of use are published

The system SHALL host terms of use for **Don's Tic Tac Toe** at `content/policies/tic-tac-toe/terms.md`, served at the public URL path `/tic-tac-toe/terms/`.

The document MUST include YAML frontmatter with at least: `title`, `description`, `updated`, `appName`, and `appPackage` (`com.donwaztok.tictactoeinfinite`).

The terms content MUST cover, at minimum: acceptance of terms, license to use the app, in-app purchases and refunds (store policies), advertising, acceptable use / prohibited conduct, disclaimer and limitation of liability, changes to terms, contact information, and governing law reference.

#### Scenario: Terms of use page is reachable

- **WHEN** a visitor navigates to `/tic-tac-toe/terms/`
- **THEN** the page renders the terms of use with correct title, app name, package id, and last-updated date from frontmatter

#### Scenario: Terms appear in index

- **WHEN** a visitor navigates to `/policies/`
- **THEN** the tic-tac-toe terms of use are listed alongside the privacy policy

### Requirement: Tic Tac Toe is registered in mobile apps catalog

The system SHALL include an entry for Don's Tic Tac Toe in `lib/mobile-apps.ts` with `privacyPolicyPath` set to `tic-tac-toe/privacy`.

#### Scenario: Mobile app entry references privacy policy

- **WHEN** the site reads the mobile apps catalog
- **THEN** the tic-tac-toe entry includes `packageId: "com.donwaztok.tictactoeinfinite"` and `privacyPolicyPath: "tic-tac-toe/privacy"`

### Requirement: Legal documents follow established format

New legal documents for tic-tac-toe MUST follow the same markdown structure and frontmatter conventions as existing policies in `content/policies/pocket-flow/privacy.md` and `content/policies/app-template/privacy.md`.

Content MUST be written in English (consistent with existing policies).

#### Scenario: Frontmatter is parseable

- **WHEN** the policy loader reads `tic-tac-toe/privacy.md` or `tic-tac-toe/terms.md`
- **THEN** frontmatter fields `title`, `description`, `updated`, `appName`, and `appPackage` are extracted without error
