#!/usr/bin/env python3
"""Run the mutation lists in groups, in parallel, each in its own copy of the repo, each against only the test files that exercise it.

usage (from the repo root):  python3 test/mutation/groups.py [OUT_DIR] [PARALLEL]

The working tree is never mutated. Each copy checks its baseline is green first. A survivor here may still be killed by a test
outside its group: re-run survivors against the full suite (see the last lines of this script's output) before believing them.
The test timeout is long on purpose: under load a timeout would be miscounted as a "kill".
"""
import os, pathlib, re, shutil, subprocess, sys, threading

ROOT = pathlib.Path.cwd()
OUT = pathlib.Path(sys.argv[1] if len(sys.argv) > 1 else "/tmp/mutation-groups")
PARALLEL = int(sys.argv[2]) if len(sys.argv) > 2 else 6

# (name, list file, name prefixes, vitest file filters)
GROUPS = [
    ("limits", "mutants", ["address:", "limit:", "body:"], ["test/lib/client-address.test.ts", "test/lib/rate-limit.test.ts", "test/lib/read-limited.test.ts"]),
    ("explain", "mutants", ["explain:", "groq:", "client:"], ["test/lib/explain.test.ts", "test/lib/concepts.test.ts", "test/lib/groq.test.ts", "test/lib/explain-client.test.ts"]),
    ("route", "mutants", ["route:"], ["test/api", "test/security"]),
]

EXCLUDE = ["node_modules", ".next", ".git", ".local-db", "coverage", "test-results", "playwright-report"]
semaphore = threading.Semaphore(PARALLEL)
results = {}


def run(group):
    name, lst, prefixes, targets = group
    with semaphore:
        copy = OUT / name
        if copy.exists():
            shutil.rmtree(copy)
        subprocess.run(["rsync", "-a", *sum((["--exclude", e] for e in EXCLUDE), []), f"{ROOT}/", f"{copy}/"], check=True)
        os.symlink(ROOT / "node_modules", copy / "node_modules")
        (copy / "test/mutation/slice.py").write_text(
            f'ns = {{}}\nexec(open("test/mutation/{lst}.py").read(), ns)\n'
            f"PREFIXES = {prefixes!r}\nM = [m for m in ns['M'] if any(m[0].startswith(p) for p in PREFIXES)]\n"
        )
        cmd = ["python3", "test/mutation/mutate.py", "test/mutation/slice.py", "--", "npx", "vitest", "run", "--bail", "1", "--testTimeout", "30000", "--maxWorkers", "2", *targets]
        done = subprocess.run(cmd, cwd=copy, capture_output=True, text=True)
        (OUT / f"{name}.out").write_text(done.stdout + done.stderr)
        results[name] = done.stdout + done.stderr


OUT.mkdir(parents=True, exist_ok=True)
threads = [threading.Thread(target=run, args=(g,)) for g in GROUPS]
for t in threads:
    t.start()
for t in threads:
    t.join()

survivors, total, killed = [], 0, 0
for name, _, _, _ in GROUPS:
    text = results[name]
    summary = re.search(r"(\d+)/(\d+) killed", text)
    print(f"{name:16} {summary.group(0) if summary else 'NO SUMMARY (baseline red?): ' + text[-300:]}")
    if summary:
        killed += int(summary.group(1)); total += int(summary.group(2))
    survivors += re.findall(r"^(?:SURVIVED|PATTERN\?[^\n]*?\)) (.*)$", text, re.M) + [m for m in re.findall(r"^PATTERN\? .*$", text, re.M)]
    if "BASELINE FAILS" in text:
        print("  !! BASELINE FAILS in", name)
print(f"TOTAL {killed}/{total} killed")
for s in survivors:
    print("  survivor:", s)
