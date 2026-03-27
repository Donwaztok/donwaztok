/**
 * Policy markdown is bundled via import.meta.glob so it is available on Vercel
 * (serverless bundles do not include arbitrary repo paths like content/policies/).
 */
const policySources = import.meta.glob("../content/policies/*/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

export type PolicyFrontmatter = {
  title?: string;
  description?: string;
  updated?: string;
  appName?: string;
  appPackage?: string;
};

function isValidSlug(segment: string): boolean {
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(segment) && !segment.includes("..");
}

function slugsFromModuleKey(key: string): { project: string; policy: string } | null {
  const normalized = key.replace(/\\/g, "/");
  const match = normalized.match(/content\/policies\/([^/]+)\/([^/]+)\.md$/);
  if (!match) return null;
  const project = match[1];
  const policy = match[2];
  if (!isValidSlug(project) || !isValidSlug(policy)) return null;
  return { project, policy };
}

const POLICY_BY_KEY = new Map<string, string>();

for (const [moduleKey, raw] of Object.entries(policySources)) {
  const slugs = slugsFromModuleKey(moduleKey);
  if (!slugs) continue;
  POLICY_BY_KEY.set(`${slugs.project}/${slugs.policy}`, raw);
}

/**
 * Minimal YAML frontmatter parser (key: value lines only).
 */
export function parsePolicyFile(raw: string): {
  data: PolicyFrontmatter;
  content: string;
} {
  const trimmed = raw.replace(/^\uFEFF/, "").trim();
  if (!trimmed.startsWith("---")) {
    return { data: {}, content: trimmed };
  }
  const end = trimmed.indexOf("\n---", 3);
  if (end === -1) {
    return { data: {}, content: trimmed };
  }
  const yamlBlock = trimmed.slice(3, end).trim();
  const content = trimmed.slice(end + 4).trim();
  const data: PolicyFrontmatter = {};
  for (const line of yamlBlock.split(/\r?\n/)) {
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim() as keyof PolicyFrontmatter;
    let val = line.slice(idx + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (key && val) {
      (data as Record<string, string>)[key] = val;
    }
  }
  return { data, content };
}

export async function loadPolicy(
  project: string,
  policy: string
): Promise<{ data: PolicyFrontmatter; content: string } | null> {
  if (!isValidSlug(project) || !isValidSlug(policy)) {
    return null;
  }
  const raw = POLICY_BY_KEY.get(`${project}/${policy}`);
  if (raw === undefined) {
    return null;
  }
  return parsePolicyFile(raw);
}

export type PolicyIndexEntry = {
  project: string;
  policy: string;
  title?: string;
  description?: string;
  updated?: string;
  appName?: string;
  appPackage?: string;
};

/**
 * Lists all policy files for generateStaticParams / index page.
 */
export async function listAllPolicies(): Promise<PolicyIndexEntry[]> {
  const entries: PolicyIndexEntry[] = [];
  for (const [key, raw] of POLICY_BY_KEY) {
    const slash = key.indexOf("/");
    if (slash === -1) continue;
    const project = key.slice(0, slash);
    const policy = key.slice(slash + 1);
    const { data } = parsePolicyFile(raw);
    entries.push({
      project,
      policy,
      title: data.title,
      description: data.description,
      updated: data.updated,
      appName: data.appName,
      appPackage: data.appPackage,
    });
  }
  entries.sort((a, b) => {
    const pa = `${a.project}/${a.policy}`;
    const pb = `${b.project}/${b.policy}`;
    return pa.localeCompare(pb);
  });
  return entries;
}
