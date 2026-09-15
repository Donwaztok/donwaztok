## ADDED Requirements

### Requirement: LifeLink privacy policy is published

The system SHALL host a privacy policy for **LifeLink** at `content/policies/lifelink/privacy.md`, served at the public URL path `/lifelink/privacy/`.

The document MUST include YAML frontmatter with at least: `title`, `description`, `updated`, `appName` (`LifeLink`), and `appPackage` (`com.Donwaztok.lifelink`).

The policy content MUST cover, at minimum: data controller contact, absence of user registration, locally stored data (theme, language, purchase state, and saved game state such as player display names, life totals, and play counters), Google AdMob advertising, in-app purchases via Google Play / App Store, Expo Updates, local-network Room Mode sync (peer-to-peer on the same Wi-Fi; not relayed through Donwaztok servers), children (under 13), policy changes, and user rights (LGPD / GDPR reference).

#### Scenario: Privacy policy page is reachable

- **WHEN** a visitor navigates to `/lifelink/privacy/`
- **THEN** the page renders the privacy policy with correct title, app name, package id, and last-updated date from frontmatter

#### Scenario: Privacy policy appears in index

- **WHEN** a visitor navigates to `/policies/`
- **THEN** the LifeLink privacy policy is listed with its app name or title

#### Scenario: Room Mode LAN sync is disclosed

- **WHEN** a visitor reads the LifeLink privacy policy
- **THEN** the document states that Room Mode may exchange game data (including player display names and life totals) with other devices on the same local network, and that this traffic is not sent to Donwaztok servers

### Requirement: LifeLink is registered in mobile apps catalog

The system SHALL include an entry for LifeLink in `lib/mobile-apps.ts` with `privacyPolicyPath` set to `lifelink/privacy`.

#### Scenario: Mobile app entry references privacy policy

- **WHEN** the site reads the mobile apps catalog
- **THEN** the LifeLink entry includes `packageId: "com.Donwaztok.lifelink"` and `privacyPolicyPath: "lifelink/privacy"`

### Requirement: LifeLink legal documents follow established format

New legal documents for LifeLink MUST follow the same markdown structure and frontmatter conventions as existing policies in `content/policies/pocket-flow/privacy.md` and `content/policies/tic-tac-toe/privacy.md`.

Content MUST be written in English (consistent with existing policies).

The privacy policy MUST add a dedicated Room Mode / local-network section that the PocketFlow and tic-tac-toe templates do not have; remaining shared sections MUST keep the same numbering style and tone as those templates.

#### Scenario: Frontmatter is parseable

- **WHEN** the policy loader reads `lifelink/privacy.md`
- **THEN** frontmatter fields `title`, `description`, `updated`, `appName`, and `appPackage` are extracted without error
