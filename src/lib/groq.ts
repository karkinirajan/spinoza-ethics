/**
 * Groq API call. SERVER ONLY: it reads the API key, so nothing that runs in the browser may import this file (a test checks that).
 * The key is GROQ_API_KEY. It used to be a NEXT_PUBLIC_ variable (those are inlined into the JavaScript every visitor downloads), and
 * this file was imported by client components, so the key was shipped to every visitor's browser and the Groq account could be
 * used by anyone who opened the developer tools.
 */
import type { Message } from "@/lib/explain";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const MODEL = "llama-3.3-70b-versatile";
export const TIMEOUT_MS = 20_000;

export type GroqFailure = "unconfigured" | "rate_limited" | "unavailable" | "bad_response";

/** A failure the route can turn into a status code. The message is for the server log; it is never sent to the browser. */
export class GroqError extends Error {
  constructor(
    readonly kind: GroqFailure,
    detail = "",
  ) {
    super(detail ? `${kind}: ${detail}` : kind);
  }
}

type Options = { apiKey?: string | undefined; fetchImpl?: typeof fetch; timeoutMs?: number };

export async function askGroq(messages: Message[], options: Options = {}): Promise<string> {
  const apiKey = (options.apiKey ?? process.env.GROQ_API_KEY ?? "").trim();
  if (!apiKey) throw new GroqError("unconfigured");
  const fetchImpl = options.fetchImpl ?? fetch;

  let response: Response;
  try {
    response = await fetchImpl(GROQ_API_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: MODEL, messages, temperature: 0.7, max_tokens: 1024, top_p: 1, stream: false }),
      signal: AbortSignal.timeout(options.timeoutMs ?? TIMEOUT_MS),
    });
  } catch (error) {
    throw new GroqError("unavailable", error instanceof Error ? error.name : "network");
  }

  if (response.status === 429) throw new GroqError("rate_limited");
  // 401 and 403 are our own misconfiguration (a bad key), which the visitor can do nothing about: they see "unavailable".
  if (!response.ok) throw new GroqError("unavailable", `HTTP ${response.status}`);

  const data: unknown = await response.json().catch(() => null);
  const content = (data as { choices?: { message?: { content?: unknown } }[] } | null)?.choices?.[0]?.message?.content;
  if (typeof content !== "string" || content.trim() === "") throw new GroqError("bad_response");
  return content;
}
