/**
 * Vinext/Next-style fetch cache hints (not part of standard RequestInit typings).
 */
export type FetchWithNextInit = RequestInit & {
  next?: { revalidate?: number; tags?: string[] };
};

export function fetchWithNext(
  input: RequestInfo | URL,
  init?: FetchWithNextInit,
): Promise<Response> {
  return fetch(input, init as RequestInit);
}
