/**
 * What the AI endpoint accepts and the prompts it builds from it. The browser sends only the visitor's own words (a question, or
 * the name of a diagram node); the system prompt is fixed here, on the server's side of the line. (The endpoint used to take a
 * `systemPrompt` from the request, which made it a free, unauthenticated LLM proxy: anyone could send any instructions to the
 * model at the owner's expense.)
 */
export const LIMITS = { query: 1000, title: 120, context: 300 } as const;

export type ExplainRequest =
  | { kind: "advisor"; query: string }
  | { kind: "concept"; title: string; context: string };

export type Message = { role: "system" | "user"; content: string };
export type ParseResult = { ok: true; value: ExplainRequest } | { ok: false; error: string };

export const ADVISOR_SYSTEM_PROMPT = `You are Baruch Spinoza. You reply to personal problems NOT with generic advice, but by generating a specific 'Proposition', 'Demonstration', and 'Scholium' in the style of your book 'The Ethics'.
- Proposition: A concise statement of truth regarding the user's problem.
- Demonstration: A logical proof derived from reason.
- Scholium: A compassionate, practical comment on how to apply this.
Tone: Rational, geometric, yet deeply liberating.`;

export const CONCEPT_SYSTEM_PROMPT =
  "You are an expert on Baruch Spinoza's Ethics. Explain concepts clearly, concisely, and relate them to modern life. Use a calm, rational tone.";

/** Control characters other than tab and newline, which have no place in a question and can hide text. */
const CONTROL = new RegExp(`[${String.fromCharCode(0)}-${String.fromCharCode(8)}${String.fromCharCode(11)}${String.fromCharCode(12)}${String.fromCharCode(14)}-${String.fromCharCode(31)}${String.fromCharCode(127)}]`, "g");

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.replace(CONTROL, "").trim();
  return text.length >= 1 && text.length <= max ? text : null;
}

export function parseExplainRequest(body: unknown): ParseResult {
  if (typeof body !== "object" || body === null) return { ok: false, error: "Invalid request." };
  const input = body as Record<string, unknown>;
  if (input.kind === "advisor") {
    const query = cleanText(input.query, LIMITS.query);
    return query !== null ? { ok: true, value: { kind: "advisor", query } } : { ok: false, error: `Write a question of up to ${LIMITS.query} characters.` };
  }
  if (input.kind === "concept") {
    const title = cleanText(input.title, LIMITS.title);
    const context = cleanText(input.context, LIMITS.context);
    return title !== null && context !== null ? { ok: true, value: { kind: "concept", title, context } } : { ok: false, error: "Invalid request." };
  }
  return { ok: false, error: "Invalid request." };
}

export function buildMessages(request: ExplainRequest): Message[] {
  if (request.kind === "advisor") {
    return [
      { role: "system", content: ADVISOR_SYSTEM_PROMPT },
      { role: "user", content: `The user says: "${request.query}". Construct a geometric proof to help them.` },
    ];
  }
  return [
    { role: "system", content: CONCEPT_SYSTEM_PROMPT },
    {
      role: "user",
      content: `Explain the concept of "${request.title}" specifically in the context of "${request.context}" from Spinoza's Ethics.
1. Summarize the core philosophical argument.
2. Give a concrete, modern-day example of this concept in action.
Keep it under 150 words.`,
    },
  ];
}
