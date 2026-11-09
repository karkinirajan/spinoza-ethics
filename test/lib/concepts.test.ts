import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { CONCEPTS, isKnownConcept } from "@/lib/concepts";

function sources(dir: string): { path: string; text: string }[] {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sources(path);
    return name.endsWith(".tsx") ? [{ path, text: readFileSync(path, "utf8") }] : [];
  });
}

const files = sources("src/components");
const CALL = /handleNodeClick\(\s*"((?:[^"\\]|\\.)*)"\s*,\s*"((?:[^"\\]|\\.)*)"\s*\)/g;

describe("CONCEPTS agrees with the diagrams", () => {
  const inDiagrams = [...new Set(files.flatMap((f) => [...f.text.matchAll(CALL)].map((m) => `${m[1]}\u0000${m[2]}`)))].sort();
  const listed = CONCEPTS.map(([title, context]) => `${title}\u0000${context}`);

  it("lists exactly the nodes the diagrams pass to their click handler (regenerate src/lib/concepts.ts if this fails)", () => {
    expect([...new Set(listed)].sort()).toEqual(inDiagrams);
  });
  it("has no duplicates and is not empty", () => {
    expect(new Set(listed).size).toBe(listed.length);
    expect(listed.length).toBeGreaterThan(50);
  });
  it("every diagram click handler is called with two string literals (so the list can be read from the source)", () => {
    for (const f of files) {
      const calls = [...f.text.matchAll(/handleNodeClick\(/g)].length;
      const literal = [...f.text.matchAll(CALL)].length;
      expect(calls, f.path).toBe(literal);
    }
  });
  it("isKnownConcept is exact", () => {
    for (const [title, context] of CONCEPTS) expect(isKnownConcept(title, context)).toBe(true);
    expect(isKnownConcept("Substance", "Part III")).toBe(false);
    expect(isKnownConcept("Substance ", "God or Nature")).toBe(false);
    expect(isKnownConcept("", "")).toBe(false);
  });
});
