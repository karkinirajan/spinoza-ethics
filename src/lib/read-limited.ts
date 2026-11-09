export class PayloadTooLargeError extends Error {
  constructor() {
    super("Payload too large");
  }
}

/**
 * Reads a request body as text, refusing to read more than `maxBytes`. A Content-Length header is only a claim (and a chunked
 * request has none), so the size is counted as the bytes arrive and reading stops at the limit.
 */
export async function readTextLimited(request: Request, maxBytes: number): Promise<string> {
  const claimed = Number(request.headers.get("content-length"));
  if (Number.isFinite(claimed) && claimed > maxBytes) throw new PayloadTooLargeError();
  if (!request.body) return "";
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > maxBytes) {
      await reader.cancel();
      throw new PayloadTooLargeError();
    }
    chunks.push(value);
  }
  const bytes = new Uint8Array(total);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return new TextDecoder().decode(bytes);
}
