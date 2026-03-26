import Link from "next/link";
import { notFound } from "next/navigation";
import { ThemeSwitch } from "@/app/components/theme-switch";
import { PolicyMarkdown } from "@/app/components/policy-markdown";
import { listAllPolicies, loadPolicy } from "@/lib/policies";
import type { Metadata } from "next";

type PageProps = {
  params: Promise<{ project: string; policy: string }>;
};

export async function generateStaticParams() {
  const list = await listAllPolicies();
  return list.map(({ project, policy }) => ({ project, policy }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { project, policy } = await params;
  const loaded = await loadPolicy(project, policy);
  if (!loaded) {
    return { title: "Policy not found" };
  }
  const { data } = loaded;
  const title = data.title ?? `${project} — ${policy}`;
  return {
    title: `${title} | Donwaztok`,
    description: data.description,
  };
}

export default async function PolicyPage({ params }: PageProps) {
  const { project, policy } = await params;
  const loaded = await loadPolicy(project, policy);
  if (!loaded) {
    notFound();
  }
  const { data, content } = loaded;

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-b border-zinc-200/80 bg-background/80 px-4 py-3 backdrop-blur-md dark:border-zinc-800/80">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
            <Link
              href="/"
              className="font-semibold tracking-tight text-foreground hover:underline"
            >
              Donwaztok
            </Link>
            <span className="text-foreground/40">/</span>
            <Link
              href="/policies/"
              className="text-foreground/70 hover:text-foreground hover:underline"
            >
              policies
            </Link>
            <span className="text-foreground/40">/</span>
            <span className="font-medium text-foreground">{project}</span>
            <span className="text-foreground/40">/</span>
            <span className="text-foreground/80">{policy}</span>
          </div>
          <ThemeSwitch />
        </div>
      </header>

      <main className="flex flex-1 flex-col px-4 py-10">
        <article className="mx-auto w-full max-w-2xl space-y-6">
          <div className="space-y-1 border-b border-zinc-200/80 pb-6 dark:border-zinc-800/80">
            {data.title ? (
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {data.title}
              </h1>
            ) : null}
            <div className="flex flex-col gap-1 text-sm text-foreground/60">
              {data.appName || data.appPackage ? (
                <p>
                  {data.appName ? (
                    <>
                      App: <span className="font-medium text-foreground/80">{data.appName}</span>
                    </>
                  ) : null}
                  {data.appName && data.appPackage ? " · " : null}
                  {data.appPackage ? (
                    <code className="rounded bg-zinc-200 px-1.5 py-0.5 text-xs dark:bg-zinc-800">
                      {data.appPackage}
                    </code>
                  ) : null}
                </p>
              ) : null}
              {data.updated ? (
                <p>
                  Last updated:{" "}
                  <time dateTime={data.updated}>{data.updated}</time>
                </p>
              ) : null}
            </div>
          </div>
          <div className="space-y-4">
            <PolicyMarkdown content={content} />
          </div>
        </article>
      </main>
    </div>
  );
}
