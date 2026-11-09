import { createHash } from "node:crypto";

export type Limit = { limit: number; windowMs: number };
export type Verdict = { ok: boolean; remaining: number; retryAfter: number };

/** Hash of who is being counted: the counters never hold an address. */
export function limiterKey(scope: string, subject: string): string {
  return `${scope}:${createHash("sha256").update(subject).digest("hex").slice(0, 32)}`;
}

// ── in memory ──────────────────────────────────────────────────────────────────────────────────────────────────────────
// One process only: every serverless instance counts for itself and a cold start forgets. This app has no database to count in, so
// the limit on the AI endpoint is per instance: it bounds one caller's use of one instance, it is not a global cap.
const MAX_KEYS = 5_000;
const buckets = new Map<string, { count: number; resetAt: number }>();

export function memoryRateLimit(key: string, { limit, windowMs }: Limit, now = Date.now()): Verdict {
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    if (buckets.size >= MAX_KEYS) evict(now);
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  bucket.count += 1;
  const ok = bucket.count <= limit;
  return { ok, remaining: Math.max(0, limit - bucket.count), retryAfter: ok ? 0 : Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)) };
}

/**
 * Drop what has expired; if that was not enough, the callers who have used the least (then the oldest). Never everything at
 * once, and never first the callers who are over their limit: a flood of one-off keys must not be able to wash away the count of
 * a caller who is being refused.
 */
function evict(now: number): void {
  for (const [key, bucket] of buckets) if (bucket.resetAt <= now) buckets.delete(key);
  if (buckets.size < MAX_KEYS) return;
  const leastUsedFirst = [...buckets.entries()].sort((a, b) => a[1].count - b[1].count || a[1].resetAt - b[1].resetAt);
  for (const [key] of leastUsedFirst.slice(0, Math.ceil(MAX_KEYS / 10))) buckets.delete(key);
}

export function resetMemoryRateLimits(): void {
  buckets.clear();
}

/** For tests: how many callers the in-memory counters are holding. */
export function memoryBucketCount(): number {
  return buckets.size;
}
