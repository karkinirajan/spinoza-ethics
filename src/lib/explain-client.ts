import type { ExplainRequest } from "@/lib/explain";

/** Browser side: asks our own /api/explain, which holds the key. Throws an Error whose message is safe to show. */
export async function requestExplanation(request: ExplainRequest, fetchImpl: typeof fetch = fetch): Promise<string> {
  let response: Response;
  try {
    response = await fetchImpl("/api/explain", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(request),
    });
  } catch {
    throw new Error("Could not reach the server. Check your connection and try again.");
  }

  const body: unknown = await response.json().catch(() => null);
  const data = (typeof body === "object" && body !== null ? body : {}) as { text?: unknown; error?: unknown };

  if (response.ok && typeof data.text === "string" && data.text !== "") return data.text;
  if (response.status === 429) throw new Error("Too many requests. Please wait a moment and try again.");
  if (response.status === 400 && typeof data.error === "string") throw new Error(data.error);
  throw new Error("The advisor is unavailable right now. Please try again in a little while.");
}
