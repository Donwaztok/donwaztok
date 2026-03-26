/** Subset of GitHub repo JSON for the desktop “Nautilus” window. */
export type GitHubRepoItem = {
  name: string;
  full_name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  updated_at: string;
  homepage: string | null;
  topics: string[];
  archived: boolean;
  fork: boolean;
};

export type GitHubReposPayload =
  | { ok: true; repos: GitHubRepoItem[] }
  | { ok: false; status: number };
