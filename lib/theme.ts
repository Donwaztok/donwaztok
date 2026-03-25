export const THEME_STORAGE_KEY = "donwaztok-theme";

/** Saved preference: follow OS, or forced light/dark after the user toggles. */
export type ThemePreference = "system" | "light" | "dark";

export function themeInitScript(): string {
  return `(()=>{try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k);var dark;if(t==="light")dark=false;else if(t==="dark")dark=true;else dark=window.matchMedia("(prefers-color-scheme: dark)").matches;var r=document.documentElement;r.classList.toggle("dark",dark);r.classList.toggle("light",!dark);r.setAttribute("data-theme",dark?"dark":"light");r.style.colorScheme=dark?"dark":"light";}catch(e){var d=typeof matchMedia!=="undefined"&&matchMedia("(prefers-color-scheme: dark)").matches;var x=document.documentElement;x.classList.toggle("dark",d);x.classList.toggle("light",!d);x.setAttribute("data-theme",d?"dark":"light");x.style.colorScheme=d?"dark":"light";}})();`;
}

export function getStoredPreference(): ThemePreference {
  if (typeof window === "undefined") {
    return "system";
  }
  const t = localStorage.getItem(THEME_STORAGE_KEY);
  if (t === "light" || t === "dark") {
    return t;
  }
  return "system";
}

export function getSystemIsDark(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

export function applyResolvedTheme(isDark: boolean) {
  const root = document.documentElement;
  root.classList.toggle("dark", isDark);
  root.classList.toggle("light", !isDark);
  root.setAttribute("data-theme", isDark ? "dark" : "light");
  root.style.colorScheme = isDark ? "dark" : "light";
}

/** Persists an explicit light/dark choice (leaves system mode). */
export function setExplicitTheme(isDark: boolean) {
  const mode: ThemePreference = isDark ? "dark" : "light";
  localStorage.setItem(THEME_STORAGE_KEY, mode);
  applyResolvedTheme(isDark);
}

export function readEffectiveIsDarkFromDom(): boolean {
  if (typeof document === "undefined") {
    return false;
  }
  return document.documentElement.classList.contains("dark");
}
