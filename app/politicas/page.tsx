import Link from "next/link";
import { ThemeSwitch } from "@/app/components/theme-switch";
import { listAllPolicies } from "@/lib/policies";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Políticas dos apps | Donwaztok",
  description: "Políticas de privacidade e documentos legais dos aplicativos Donwaztok.",
};

export default async function PoliticasIndexPage() {
  const policies = await listAllPolicies();

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-200/80 bg-background/80 px-4 py-3 backdrop-blur-md dark:border-zinc-800/80">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm">
            <Link
              href="/"
              className="font-semibold tracking-tight text-foreground hover:underline"
            >
              Donwaztok
            </Link>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground/80">políticas</span>
          </div>
          <ThemeSwitch />
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-10">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Políticas por projeto
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-foreground/70">
              Cada URL segue o padrão{" "}
              <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                /&#123;projeto&#125;/&#123;política&#125;/
              </code>
              . Use o link público no Google Play Console, App Store Connect, etc.
            </p>
          </div>

          {policies.length === 0 ? (
            <p className="text-sm text-foreground/60">
              Nenhuma política encontrada em{" "}
              <code className="rounded bg-zinc-200 px-1 py-0.5 text-xs dark:bg-zinc-800">
                content/policies/
              </code>
              .
            </p>
          ) : (
            <ul className="space-y-3">
              {policies.map(({ projeto, politica, title }) => (
                <li key={`${projeto}/${politica}`}>
                  <Link
                    href={`/${projeto}/${politica}/`}
                    className="group block rounded-lg border border-zinc-200/80 bg-background px-4 py-3 transition-colors hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:border-zinc-700 dark:hover:bg-zinc-900/50"
                  >
                    <span className="font-medium text-foreground group-hover:underline">
                      {title ?? `${projeto} / ${politica}`}
                    </span>
                    <p className="mt-0.5 font-mono text-xs text-foreground/50">
                      /{projeto}/{politica}/
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
    </div>
  );
}
