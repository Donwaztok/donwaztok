/** Successful GET /api/github-profile JSON body. */
export type GitHubPublicProfile = {
  ok: true;
  login: string;
  name: string | null;
  bio: string | null;
  avatar_url: string;
  html_url: string;
  public_repos: number;
  followers: number;
  following: number;
};

/** Parsed JSON from GET /api/github-profile (success or upstream GitHub error). */
export type GitHubPublicProfilePayload =
  | GitHubPublicProfile
  | { ok: false; status: number };
