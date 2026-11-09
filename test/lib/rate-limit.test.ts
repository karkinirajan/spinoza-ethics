import { beforeEach, describe, expect, it } from "vitest";
import { limiterKey, memoryBucketCount, memoryRateLimit, resetMemoryRateLimits } from "@/lib/rate-limit";

beforeEach(() => resetMemoryRateLimits());

describe("limiterKey", () => {
  it("hashes the subject: the key never contains it", () => {
    const key = limiterKey("contact", "203.0.113.7");
    expect(key).toMatch(/^contact:[0-9a-f]{32}$/);
    expect(key).not.toContain("203");
  });
  it("is stable, and different per scope and per subject", () => {
    expect(limiterKey("a", "x")).toBe(limiterKey("a", "x"));
    expect(limiterKey("a", "x")).not.toBe(limiterKey("b", "x"));
    expect(limiterKey("a", "x")).not.toBe(limiterKey("a", "y"));
  });
});

describe("memoryRateLimit", () => {
  const cfg = { limit: 3, windowMs: 60_000 };
  it("allows up to the limit, then refuses, saying how long to wait", () => {
    const results = [0, 1, 2, 3, 4].map(() => memoryRateLimit("k", cfg, 1_000));
    expect(results.map((r) => r.ok)).toEqual([true, true, true, false, false]);
    expect(results.map((r) => r.remaining)).toEqual([2, 1, 0, 0, 0]);
    expect(results[0]?.retryAfter).toBe(0);
    expect(results[3]?.retryAfter).toBe(60);
  });
  it("rounds retryAfter up", () => {
    memoryRateLimit("r", { limit: 1, windowMs: 10_000 }, 0);
    expect(memoryRateLimit("r", { limit: 1, windowMs: 10_000 }, 4_500).retryAfter).toBe(6);
  });
  it("starts a new window when the old one ends", () => {
    for (let i = 0; i < 4; i++) memoryRateLimit("w", cfg, 0);
    expect(memoryRateLimit("w", cfg, 59_999).ok).toBe(false);
    expect(memoryRateLimit("w", cfg, 60_000).ok).toBe(true);
  });
  it("keeps keys apart", () => {
    for (let i = 0; i < 4; i++) memoryRateLimit("a", cfg, 0);
    expect(memoryRateLimit("b", cfg, 0).ok).toBe(true);
  });
  it("never forgets everyone at once when full: a flood of new keys cannot reset a caller who is over the limit", () => {
    for (let i = 0; i < 4; i++) memoryRateLimit("victim", cfg, 0);
    for (let i = 0; i < 6_000; i++) memoryRateLimit(`other-${i}`, cfg, 1 + i);
    expect(memoryRateLimit("victim", cfg, 6_001).ok).toBe(false);
  });
  it("holds a bounded number of callers however many keys arrive", () => {
    for (let i = 0; i < 20_000; i++) memoryRateLimit(`flood-${i}`, cfg, 1_000);
    expect(memoryBucketCount()).toBeLessThanOrEqual(5_000);
  });
  it("drops expired callers before anyone else when it needs room", () => {
    for (let i = 0; i < 4_999; i++) memoryRateLimit(`old-${i}`, { limit: 1, windowMs: 1_000 }, 0);
    for (let i = 0; i < 4; i++) memoryRateLimit("busy", cfg, 0); // the 5,000th key, and over its limit
    memoryRateLimit("new", cfg, 2_000); // full now; the 4,999 short windows have all expired
    expect(memoryBucketCount()).toBe(2); // busy (still in its window) and new
    expect(memoryRateLimit("busy", cfg, 2_001).ok).toBe(false);
  });
});
