import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

/** Every source file under src/, with its text. */
function sources(dir = "src"): { path: string; text: string }[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return /\.(ts|tsx)$/.test(name) ? [{ path, text: readFileSync(path, "utf8") }] : [];
  });
}

describe("the Groq key never reaches the browser", () => {
  const files = sources();

  it("no source file reads a NEXT_PUBLIC_ variable for the key (those are inlined into the JavaScript every visitor downloads)", () => {
    const offenders = files.filter((f) => /NEXT_PUBLIC_\w*GROQ|NEXT_PUBLIC_\w*API_KEY/i.test(f.text)).map((f) => f.path);
    expect(offenders).toEqual([]);
  });

  it("only server code (no \"use client\" file, no client hook) imports the module that reads the key", () => {
    const importers = files.filter((f) => /from\s+["']@\/lib\/groq["']/.test(f.text));
    expect(importers.map((f) => f.path)).toEqual(["src/app/api/explain/route.ts"]);
    for (const f of importers) expect(f.text).not.toMatch(/^\s*["']use client["']/m);
  });

  it("the browser helper and the shared prompt module read no environment variable at all", () => {
    for (const path of ["src/lib/explain-client.ts", "src/lib/explain.ts"]) {
      expect(readFileSync(path, "utf8")).not.toMatch(/process\.env/);
    }
  });

  it("no client component calls Groq directly", () => {
    const clients = files.filter((f) => /^\s*["']use client["']/m.test(f.text));
    expect(clients.length).toBeGreaterThan(0);
    for (const f of clients) expect(f.text).not.toMatch(/api\.groq\.com|Bearer /);
  });
});
