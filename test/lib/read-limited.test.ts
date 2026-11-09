import { describe, expect, it } from "vitest";
import { PayloadTooLargeError, readTextLimited } from "@/lib/read-limited";

const post = (body: BodyInit | null, headers: Record<string, string> = {}) => new Request("http://localhost/x", { method: "POST", body, headers });

describe("readTextLimited", () => {
  it("reads a small body", async () => expect(await readTextLimited(post("hello"), 100)).toBe("hello"));
  it("reads a body of exactly the limit", async () => expect(await readTextLimited(post("x".repeat(100)), 100)).toHaveLength(100));
  it("refuses a body one byte over", async () => await expect(readTextLimited(post("x".repeat(101)), 100)).rejects.toBeInstanceOf(PayloadTooLargeError));
  it("returns an empty string for no body", async () => expect(await readTextLimited(new Request("http://localhost/x"), 100)).toBe(""));
  it("refuses on a Content-Length that already says too much, without reading", async () => {
    await expect(readTextLimited(post("x", { "content-length": "999999" }), 100)).rejects.toBeInstanceOf(PayloadTooLargeError);
  });
  it("counts the bytes that actually arrive when there is no Content-Length (a chunked body)", async () => {
    const chunked = new ReadableStream<Uint8Array>({
      start(controller) {
        for (let i = 0; i < 20; i++) controller.enqueue(new TextEncoder().encode("x".repeat(10)));
        controller.close();
      },
    });
    const request = new Request("http://localhost/x", { method: "POST", body: chunked, duplex: "half" } as RequestInit);
    await expect(readTextLimited(request, 100)).rejects.toBeInstanceOf(PayloadTooLargeError);
  });
  it("counts bytes, not characters", async () => {
    await expect(readTextLimited(post("é".repeat(60)), 100)).rejects.toBeInstanceOf(PayloadTooLargeError); // 120 bytes
  });
  it("joins chunks in order", async () => {
    const parts = ["he", "llo ", "wor", "ld"];
    const stream = new ReadableStream<Uint8Array>({ start(c) { for (const p of parts) c.enqueue(new TextEncoder().encode(p)); c.close(); } });
    expect(await readTextLimited(new Request("http://localhost/x", { method: "POST", body: stream, duplex: "half" } as RequestInit), 100)).toBe("hello world");
  });
});
