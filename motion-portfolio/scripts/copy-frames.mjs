#!/usr/bin/env node
import { mkdir, copyFile, stat, readdir } from "node:fs/promises";
import { existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");
const SOURCE_DIR = resolve(PROJECT_ROOT, "..", "source-video", "webp");
const DEST_DIR = resolve(PROJECT_ROOT, "public", "frames");
const TOTAL_FRAMES = 162;

if (!existsSync(SOURCE_DIR)) {
  console.error(`[copy-frames] source directory not found: ${SOURCE_DIR}`);
  process.exit(1);
}

await mkdir(DEST_DIR, { recursive: true });

const existing = new Set(await readdir(DEST_DIR).catch(() => []));

let copied = 0;
let skipped = 0;

for (let i = 1; i <= TOTAL_FRAMES; i++) {
  const name = `frame_${String(i).padStart(4, "0")}.webp`;
  const src = join(SOURCE_DIR, name);
  const dst = join(DEST_DIR, name);

  if (existing.has(name)) {
    // Skip if destination is newer-or-equal to source.
    try {
      const [s, d] = await Promise.all([stat(src), stat(dst)]);
      if (d.mtimeMs >= s.mtimeMs && d.size === s.size) {
        skipped++;
        continue;
      }
    } catch {
      // Fall through to copy.
    }
  }

  await copyFile(src, dst);
  copied++;
}

console.log(
  `[copy-frames] ${copied} copied, ${skipped} up-to-date → public/frames/`,
);
