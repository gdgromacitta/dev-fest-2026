#!/usr/bin/env node
// Fetches agenda/speaker data from Sessionize at build time and regenerates
// src/content/sessions.ts, src/content/speakers.ts, and the `sessions`/
// `speakers` namespaces in messages/{en,it}.json in place.
//
// ponytail: this overwrites tracked source files rather than writing to a
// gitignored generated/*.json read by a runtime loader — sessions.ts is
// imported by a "use client" component, so a loader would need `fs` in the
// browser bundle. Overwriting means there's always exactly one valid file;
// if the fetch can't run, nothing changes and whatever's already committed
// stays (satisfies "fall back to seed data" literally). Trade-off: a
// successful `npm run build` leaves these files modified in git — don't
// commit unless you mean to regenerate. Upgrade to gitignored JSON + loader
// once features.agenda/speakers flip and this runs on every deploy.
//
// Never fails the build: any missing config, network error, or empty
// response just warns and leaves existing files untouched (exit 0).

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { mapAll } from "./lib/sessionize-mapper.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

try {
  process.loadEnvFile(path.join(ROOT, ".env.local"));
} catch {
  // .env.local is optional
}

function serializeArray(typeName, importPath, headerComment, items) {
  const body = JSON.stringify(items, null, 2)
    .split("\n")
    .map((line, i) => (i === 0 ? line : "  " + line))
    .join("\n");
  return `import type { ${typeName} } from "${importPath}";\n\n${headerComment}\nexport const ${typeName.toLowerCase()}s: ${typeName}[] = ${body};\n`;
}

async function writeSessionsFile(sessions) {
  const content = serializeArray(
    "Session",
    "@/src/types/content",
    '// `title` and `abstract` are translated content and live in\n' +
      "// messages/{locale}.json under the `sessions.<id>.*` namespace, keyed by `id`.\n" +
      "// Regenerated at build time by scripts/fetch-sessionize.mjs — see that file\n" +
      "// before hand-editing.",
    sessions
  );
  await writeFile(path.join(ROOT, "src/content/sessions.ts"), content);
}

async function writeSpeakersFile(speakers) {
  const content = serializeArray(
    "Speaker",
    "@/src/types/content",
    '// `bioShort` and `bioLong` are translated content and live in\n' +
      "// messages/{locale}.json under the `speakers.<id>.*` namespace, keyed by `id`.\n" +
      "// Regenerated at build time by scripts/fetch-sessionize.mjs — see that file\n" +
      "// before hand-editing.",
    speakers
  );
  await writeFile(path.join(ROOT, "src/content/speakers.ts"), content);
}

async function mergeMessages(locale, key, entries) {
  const filePath = path.join(ROOT, `messages/${locale}.json`);
  const raw = await readFile(filePath, "utf-8");
  const messages = JSON.parse(raw);
  messages[key] = { ...messages[key], ...entries };
  await writeFile(filePath, JSON.stringify(messages, null, 2) + "\n");
}

async function main() {
  const apiUrl = process.env.SESSIONIZE_API_URL;
  if (!apiUrl) {
    console.warn("[fetch-sessionize] SESSIONIZE_API_URL not set — skipping, keeping existing content.");
    return;
  }

  let apiResponse;
  try {
    const response = await fetch(apiUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    apiResponse = await response.json();
  } catch (err) {
    console.warn(`[fetch-sessionize] fetch failed (${err.message}) — skipping, keeping existing content.`);
    return;
  }

  const { sessions, speakers, sessionMessages, speakerMessages } = mapAll(apiResponse);

  if (sessions.length === 0) {
    console.warn("[fetch-sessionize] no sessions in response — skipping, keeping existing content.");
    return;
  }

  await writeSessionsFile(sessions);
  await writeSpeakersFile(speakers);
  await mergeMessages("en", "sessions", sessionMessages);
  await mergeMessages("it", "sessions", sessionMessages);
  await mergeMessages("en", "speakers", speakerMessages);
  await mergeMessages("it", "speakers", speakerMessages);

  console.log(`[fetch-sessionize] wrote ${sessions.length} sessions, ${speakers.length} speakers.`);
}

await main();
