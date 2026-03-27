import { aboutProfile } from "@/lib/about-me";
import type { GitHubPublicProfile } from "@/lib/github-public-profile";
import { fetchWithNext } from "@/lib/vinext-fetch";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const login =
    request.nextUrl.searchParams.get("login") ?? aboutProfile.githubLogin;

  const res = await fetchWithNext(
    `https://api.github.com/users/${encodeURIComponent(login)}`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "donwaztok-site/1.0 (+https://github.com/donwaztok/donwaztok)",
      },
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    return Response.json(
      { ok: false as const, status: res.status },
      { status: res.status === 403 ? 403 : 502 },
    );
  }

  const j = (await res.json()) as Record<string, unknown>;

  const payload: GitHubPublicProfile = {
    ok: true,
    login: String(j.login ?? login),
    name: (j.name as string | null) ?? null,
    bio: (j.bio as string | null) ?? null,
    avatar_url: String(j.avatar_url ?? ""),
    html_url: String(
      j.html_url ?? `https://github.com/${encodeURIComponent(login)}`,
    ),
    public_repos: Number(j.public_repos ?? 0),
    followers: Number(j.followers ?? 0),
    following: Number(j.following ?? 0),
  };

  return Response.json(payload);
}
