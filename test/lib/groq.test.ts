import { describe, expect, it, vi } from "vitest";
import { GroqError, MODEL, TIMEOUT_MS, askGroq } from "@/lib/groq";

const messages = [{ role: "system" as const, content: "sys" }, { role: "user" as const, content: "hi" }];
const ok = (content: unknown) => new Response(JSON.stringify({ choices: [{ message: { content } }] }), { status: 200 });

describe("askGroq", () => {
  it("sends the key as a bearer token and the messages as given, with the model and a token cap", async () => {
    const fetchImpl = vi.fn(async () => ok("an answer"));
    expect(await askGroq(messages, { apiKey: "test-key-123", fetchImpl })).toBe("an answer");
    const [url, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.groq.com/openai/v1/chat/completions");
    expect(init.method).toBe("POST");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-key-123");
    expect(JSON.parse(String(init.body))).toEqual({ model: MODEL, messages, temperature: 0.7, max_tokens: 1024, top_p: 1, stream: false });
  });
  it("gives the request a timeout, so a hung provider cannot hold the function open", async () => {
    const fetchImpl = vi.fn(async () => ok("x"));
    await askGroq(messages, { apiKey: "k", fetchImpl });
    const init = (fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1];
    expect(init.signal).toBeInstanceOf(AbortSignal);
    expect(TIMEOUT_MS).toBeGreaterThan(0);
    expect(TIMEOUT_MS).toBeLessThanOrEqual(30_000);
  });
  it("reads the key from GROQ_API_KEY, not from a NEXT_PUBLIC variable", async () => {
    const fetchImpl = vi.fn(async () => ok("x"));
    vi.stubEnv("GROQ_API_KEY", "server-key");
    vi.stubEnv("GROQ_API_KEY", "public-key");
    await askGroq(messages, { fetchImpl });
    expect(((fetchImpl.mock.calls[0] as unknown as [string, RequestInit])[1].headers as Record<string, string>).Authorization).toBe("Bearer server-key");
    vi.unstubAllEnvs();
  });
  it.each(["", "   ", undefined])("says it is unconfigured for the key %j, without calling out", async (apiKey) => {
    vi.stubEnv("GROQ_API_KEY", "");
    const fetchImpl = vi.fn();
    await expect(askGroq(messages, { apiKey, fetchImpl: fetchImpl as never })).rejects.toMatchObject({ kind: "unconfigured" });
    expect(fetchImpl).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });
  it("maps 429 to rate_limited", async () => {
    await expect(askGroq(messages, { apiKey: "k", fetchImpl: async () => new Response("{}", { status: 429 }) })).rejects.toMatchObject({ kind: "rate_limited" });
  });
  it.each([400, 401, 403, 404, 500, 502, 503])("maps %i to unavailable, and keeps the provider's text out of the message", async (status) => {
    const error = await askGroq(messages, { apiKey: "k", fetchImpl: async () => new Response(JSON.stringify({ error: { message: "Invalid API key: gsk_secret" } }), { status }) }).catch((e: unknown) => e);
    expect(error).toBeInstanceOf(GroqError);
    expect((error as GroqError).kind).toBe("unavailable");
    expect((error as GroqError).message).not.toContain("gsk_secret");
  });
  it("maps a network failure or timeout to unavailable, keeping the original message (which can name hosts) out of the error", async () => {
    const error = await askGroq(messages, { apiKey: "k", fetchImpl: async () => { throw new TypeError("fetch failed: ECONNREFUSED 10.0.0.5:443"); } }).catch((e: unknown) => e);
    expect(error).toMatchObject({ kind: "unavailable" });
    expect((error as Error).message).not.toMatch(/ECONNREFUSED|10\.0\.0\.5|fetch failed/);
  });
  it.each([null, "not json", {}, { choices: [] }, { choices: [{}] }, { choices: [{ message: {} }] }, { choices: [{ message: { content: "" } }] }, { choices: [{ message: { content: "   " } }] }, { choices: [{ message: { content: 5 } }] }])("maps the answer %j to bad_response", async (data) => {
    const body = typeof data === "string" ? data : JSON.stringify(data);
    await expect(askGroq(messages, { apiKey: "k", fetchImpl: async () => new Response(body, { status: 200 }) })).rejects.toMatchObject({ kind: "bad_response" });
  });
});
