/**
 * Personal profile copy for the desktop “Quick settings” panel. Edit as needed.
 */
export type AboutFact = {
  label: string;
  value: string;
};

export type ProfileShortcut = {
  id: string;
  label: string;
  href: string;
  /** Shown in the HeroUI tooltip (e.g. site name or purpose) */
  tooltipTitle: string;
  /** Shown under the title (e.g. hostname or path) */
  tooltipDescription: string;
  highlight?: boolean;
  icon: "github" | "linkedin" | "ducke";
};

export const aboutProfile = {
  /** Public API: https://api.github.com/users/{login} */
  githubLogin: "donwaztok",
  displayName: "Donwaztok",
  tagline: "Developer · open source and the web",
  initials: "D",
  bio: "",
  osLabel: "CachyOS · Hyprland · Quickshell",
  deviceName: "donwaztok",
  facts: [] as AboutFact[],
};

export const profileShortcuts = [
  {
    id: "github",
    label: "GitHub",
    href: "https://github.com/donwaztok",
    tooltipTitle: "GitHub",
    tooltipDescription: "github.com/donwaztok — code and open source",
    highlight: true,
    icon: "github",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/martinsigor/",
    tooltipTitle: "LinkedIn",
    tooltipDescription: "linkedin.com/in/martinsigor",
    icon: "linkedin",
  },
  {
    id: "ducke",
    label: "Ducke",
    href: "https://ducke.com.br",
    tooltipTitle: "Ducke",
    tooltipDescription: "ducke.com.br",
    icon: "ducke",
  },
] satisfies ProfileShortcut[];
