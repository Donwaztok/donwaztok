import fs from "node:fs/promises";
import path from "node:path";

const POLICIES_ROOT = path.join(process.cwd(), "content", "policies");

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
  projeto: string,
  politica: string
): Promise<{ data: PolicyFrontmatter; content: string } | null> {
  if (!isValidSlug(projeto) || !isValidSlug(politica)) {
    return null;
  }
  const filePath = path.join(POLICIES_ROOT, projeto, `${politica}.md`);
  const resolved = path.resolve(filePath);
  if (!resolved.startsWith(path.resolve(POLICIES_ROOT))) {
    return null;
  }
  try {
    const raw = await fs.readFile(filePath, "utf8");
    return parsePolicyFile(raw);
  } catch {
    return null;
  }
}

export type PolicyIndexEntry = {
  projeto: string;
  politica: string;
  title?: string;
};

/**
 * Lists all policy files as { projeto, politica } for generateStaticParams / índice.
 */
export async function listAllPolicies(): Promise<PolicyIndexEntry[]> {
  const entries: PolicyIndexEntry[] = [];
  let projectDirs: string[];
  try {
    const dirents = await fs.readdir(POLICIES_ROOT, { withFileTypes: true });
    projectDirs = dirents.filter((d) => d.isDirectory()).map((d) => d.name);
  } catch {
    return entries;
  }
  for (const projeto of projectDirs) {
    if (!isValidSlug(projeto)) continue;
    const dir = path.join(POLICIES_ROOT, projeto);
    let files: string[];
    try {
      files = await fs.readdir(dir);
    } catch {
      continue;
    }
    for (const f of files) {
      if (!f.endsWith(".md")) continue;
      const politica = f.slice(0, -3);
      if (!isValidSlug(politica)) continue;
      const loaded = await loadPolicy(projeto, politica);
      entries.push({
        projeto,
        politica,
        title: loaded?.data.title,
      });
    }
  }
  return entries;
}
