import { aboutProfile } from "@/lib/about-me";
import type { GitHubRepoItem } from "@/lib/github-repo-public";
import { fetchWithNext } from "@/lib/vinext-fetch";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const login =
    request.nextUrl.searchParams.get("login") ?? aboutProfile.githubLogin;

  const res = await fetchWithNext(
    `https://api.github.com/users/${encodeURIComponent(login)}/repos?per_page=100&sort=updated&type=public`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "donwaztok-site/1.0 (+https://github.com/donwaztok/donwaztok)",
      },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    return NextResponse.json(
      { ok: false as const, status: res.status },
      { status: res.status === 403 ? 403 : 502 },
    );
  }

  const raw = (await res.json()) as Record<string, unknown>[];

  const repos: GitHubRepoItem[] = raw.map((j) => ({
    name: String(j.name ?? ""),
    full_name: String(j.full_name ?? ""),
    description: (j.description as string | null) ?? null,
    html_url: String(j.html_url ?? ""),
    language: (j.language as string | null) ?? null,
    stargazers_count: Number(j.stargazers_count ?? 0),
    forks_count: Number(j.forks_count ?? 0),
    updated_at: String(j.updated_at ?? ""),
    homepage: (j.homepage as string | null) ?? null,
    topics: Array.isArray(j.topics) ? (j.topics as string[]) : [],
    archived: Boolean(j.archived),
    fork: Boolean(j.fork),
  }));

  return NextResponse.json(
    { ok: true as const, repos },
    {
      headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=3600" },
    },
  );
}
