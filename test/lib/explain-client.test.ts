import { describe, expect, it, vi } from "vitest";
import { requestExplanation } from "@/lib/explain-client";

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status });
const request = { kind: "advisor", query: "hello" } as const;

describe("requestExplanation", () => {
  it("posts to our own endpoint and returns the text", async () => {
    const fetchImpl = vi.fn(async () => json({ success: true, text: "Proposition I" }));
    expect(await requestExplanation(request, fetchImpl)).toBe("Proposition I");
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/explain");
    expect(init.method).toBe("POST");
    expect(JSON.parse(String(init.body))).toEqual(request);
  });
  it("sends nothing but the request: no key, no prompt", async () => {
    const fetchImpl = vi.fn(async () => json({ text: "x" }));
    await requestExplanation({ kind: "concept", title: "T", context: "C" }, fetchImpl);
    const init = (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(JSON.stringify(init)).not.toMatch(/authorization|systemPrompt|apikey/i);
  });
  it("tells a 429 apart", async () => {
    await expect(requestExplanation(request, async () => json({ error: "x" }, 429))).rejects.toThrow(/Too many requests/);
  });
  it("shows the server's message for a 400, which it chose itself", async () => {
    await expect(requestExplanation(request, async () => json({ error: "Write a question of up to 1000 characters." }, 400))).rejects.toThrow("Write a question of up to 1000 characters.");
  });
  it.each([500, 502, 503, 403, 413])("shows a generic sentence for %i, whatever the body says", async (status) => {
    const error = await requestExplanation(request, async () => json({ error: "internal secret detail" }, status)).catch((e: Error) => e);
    expect((error as Error).message).toMatch(/unavailable right now/);
    expect((error as Error).message).not.toContain("secret");
  });
  it("copes with a body that is not JSON and with a 200 that has no text", async () => {
    await expect(requestExplanation(request, async () => new Response("<html>", { status: 502 }))).rejects.toThrow(/unavailable/);
    await expect(requestExplanation(request, async () => json({ success: true }))).rejects.toThrow(/unavailable/);
    await expect(requestExplanation(request, async () => json({ text: "" }))).rejects.toThrow(/unavailable/);
  });
  it("says so when the network fails", async () => {
    await expect(requestExplanation(request, async () => { throw new TypeError("Failed to fetch"); })).rejects.toThrow(/Could not reach the server/);
  });
});
