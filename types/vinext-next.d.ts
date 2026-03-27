/**
 * Do not map bare `next` in tsconfig paths — Vite then resolves `next/navigation`
 * as `metadata/navigation` and the RSC build fails.
 */
declare module "next" {
  export type { Metadata, Viewport } from "vinext/shims/metadata";
}
