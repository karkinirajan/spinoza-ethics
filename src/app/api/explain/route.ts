/**
 * POST /api/explain: AI explanations about Spinoza's Ethics, through Groq.
 *
 * Body: { kind: "advisor", query } or { kind: "concept", title, context }. The prompts are built here (lib/explain.ts): the
 * request cannot supply a system prompt. The visitor is told only what they can act on; Groq's own error text never leaves the
 * server.
 */
import { NextRequest, NextResponse } from "next/server";
import { clientAddress } from "@/lib/client-address";
import { buildMessages, parseExplainRequest } from "@/lib/explain";
import { GroqError, askGroq } from "@/lib/groq";
import { limiterKey, memoryRateLimit } from "@/lib/rate-limit";
import { PayloadTooLargeError, readTextLimited } from "@/lib/read-limited";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const BURST = { limit: 6, windowMs: 60_000 } as const;
const HOURLY = { limit: 40, windowMs: 3_600_000 } as const;
const MAX_BODY_BYTES = 8_000;
const NO_STORE = { "Cache-Control": "no-store" };

function fail(status: number, error: string, headers: Record<string, string> = {}): NextResponse {
  return NextResponse.json({ success: false, error }, { status, headers: { ...NO_STORE, ...headers } });
}

/** A browser that sends an Origin header must be calling from this site: a page elsewhere cannot spend our quota. */
function crossSite(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  try {
    return new URL(origin).host !== request.headers.get("host");
  } catch {
    return true;
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  if (crossSite(request)) return fail(403, "Forbidden.");

  const caller = clientAddress(request.headers);
  for (const [scope, limit] of [["explain-burst", BURST], ["explain-hour", HOURLY]] as const) {
    const verdict = memoryRateLimit(limiterKey(scope, caller), limit);
    if (!verdict.ok) return fail(429, "Too many requests. Please wait a moment and try again.", { "Retry-After": String(verdict.retryAfter) });
  }

  let body: unknown;
  try {
    body = JSON.parse(await readTextLimited(request, MAX_BODY_BYTES));
  } catch (error) {
    return error instanceof PayloadTooLargeError ? fail(413, "That request is too large.") : fail(400, "Invalid request.");
  }

  const parsed = parseExplainRequest(body);
  if (!parsed.ok) return fail(400, parsed.error);

  try {
    const text = await askGroq(buildMessages(parsed.value));
    return NextResponse.json({ success: true, text }, { headers: NO_STORE });
  } catch (error) {
    const kind = error instanceof GroqError ? error.kind : "unavailable";
    console.error("[/api/explain] failed:", error instanceof Error ? error.message : kind);
    if (kind === "rate_limited") return fail(429, "The advisor is busy. Please wait a moment and try again.", { "Retry-After": "30" });
    return fail(503, "The advisor is unavailable right now. Please try again in a little while.");
  }
}
