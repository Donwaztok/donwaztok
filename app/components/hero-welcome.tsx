"use client";

import { Button, Card, Text } from "@heroui/react";
import Link from "next/link";
import { ThemeSwitch } from "./theme-switch";

export function HeroWelcome() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-200/80 bg-background/80 px-4 py-3 backdrop-blur-md dark:border-zinc-800/80">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
          <span className="text-sm font-semibold tracking-tight text-foreground">
            Donwaztok
          </span>
          <ThemeSwitch />
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-16">
        <Card className="w-full max-w-lg shadow-lg">
          <Card.Header>
            <Card.Title className="text-2xl">Next.js + HeroUI v3</Card.Title>
            <Card.Description>
              React 19, Tailwind CSS v4, and accessible components from HeroUI.
            </Card.Description>
          </Card.Header>
          <Card.Content className="flex flex-col gap-4">
            <Text size="sm" variant="muted">
              Theme follows your system by default (
              <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
                prefers-color-scheme
              </code>
              ), matching HeroUI&apos;s{" "}
              <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
                data-theme
              </code>{" "}
              pattern. After you use the switch, your choice is saved in this
              browser.
            </Text>
            <Text size="sm" variant="muted">
              Políticas dos apps:{" "}
              <Link
                className="font-medium text-foreground underline underline-offset-2 hover:text-foreground/80"
                href="/politicas/"
              >
                /politicas/
              </Link>{" "}
              (URLs públicas no padrão{" "}
              <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
                /projeto/politica/
              </code>
              ).
            </Text>
          </Card.Content>
          <Card.Footer className="flex flex-wrap gap-3">
            <Button
              variant="primary"
              onPress={() =>
                window.open("https://v3.heroui.com/docs/react/getting-started", "_blank")
              }
            >
              HeroUI docs
            </Button>
            <Button
              variant="secondary"
              onPress={() => window.open("https://nextjs.org/docs", "_blank")}
            >
              Next.js docs
            </Button>
          </Card.Footer>
        </Card>
      </main>
    </div>
  );
}
