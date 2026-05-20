#!/usr/bin/env node
/**
 * Contract test: src/ must contain no `const C = {` palette blocks.
 *
 * Phases 8-11 removed every `const C` palette object from the source tree
 * in favor of CSS tokens (var(--cf-*)). This guard prevents the pattern from
 * sneaking back in via copy-paste from older code. Wired into prebuild so CI
 * fails before a build is shipped if reintroduced.
 *
 * Exits 0 on success, 1 with a file list on violation.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = new URL("../src/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const PATTERN = /\bconst\s+C\s*=\s*\{/;
const violations = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const st = statSync(full);
    if (st.isDirectory()) {
      walk(full);
    } else if (/\.(jsx?|tsx?)$/.test(entry)) {
      const content = readFileSync(full, "utf8");
      if (PATTERN.test(content)) violations.push(full);
    }
  }
}

walk(SRC);

if (violations.length > 0) {
  console.error("✗ const C palette objects found in:");
  for (const v of violations) console.error("  " + v);
  console.error("\nUse CSS tokens (var(--cf-*) in src/styles/tokens.css) instead.");
  process.exit(1);
}

console.log("✓ No `const C = {` palette objects in src/");
