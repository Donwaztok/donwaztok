import { listAllPolicies } from "@/lib/policies";
import { NextResponse } from "next/server";

export async function GET() {
  const policies = await listAllPolicies();
  return NextResponse.json({ ok: true as const, policies }, {
    headers: { "Cache-Control": "s-maxage=300, stale-while-revalidate=3600" },
  });
}
