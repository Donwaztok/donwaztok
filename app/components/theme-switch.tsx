"use client";

import { Switch } from "@heroui/react";
import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import {
  applyResolvedTheme,
  getStoredPreference,
  readEffectiveIsDarkFromDom,
  setExplicitTheme,
} from "@/lib/theme";

function SunIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
    </svg>
  );
}

function MoonIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />
    </svg>
  );
}

function subscribeToTheme(onChange: () => void) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const onMq = () => {
    if (getStoredPreference() === "system") {
      applyResolvedTheme(mq.matches);
      onChange();
    }
  };
  mq.addEventListener("change", onMq);
  window.addEventListener("storage", onChange);
  return () => {
    mq.removeEventListener("change", onMq);
    window.removeEventListener("storage", onChange);
  };
}

function getThemeSnapshot() {
  return readEffectiveIsDarkFromDom();
}

function getServerThemeSnapshot() {
  return false;
}

export function ThemeSwitch() {
  const [mounted, setMounted] = useState(false);

  const isDark = useSyncExternalStore(
    subscribeToTheme,
    getThemeSnapshot,
    getServerThemeSnapshot,
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleChange = useCallback((selected: boolean) => {
    setExplicitTheme(selected);
  }, []);

  if (!mounted) {
    return (
      <div
        className="inline-flex h-8 w-[5.75rem] shrink-0 items-center gap-2"
        aria-hidden
      />
    );
  }

  return (
    <div className="inline-flex items-center gap-2">
      <SunIcon
        className={
          isDark
            ? "size-4 shrink-0 text-zinc-400 opacity-45 dark:text-zinc-500"
            : "size-4 shrink-0 text-amber-500 opacity-100"
        }
      />
      <Switch
        size="sm"
        isSelected={isDark}
        onChange={handleChange}
        aria-label="Toggle light or dark color theme"
      >
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
      </Switch>
      <MoonIcon
        className={
          isDark
            ? "size-4 shrink-0 text-indigo-200"
            : "size-4 shrink-0 text-zinc-400 opacity-45 dark:text-zinc-500"
        }
      />
    </div>
  );
}
