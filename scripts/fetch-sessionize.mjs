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
import { DEFAULT_CATEGORY_TITLES, mapAll } from "./lib/sessionize-mapper.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const LOCALES = ["en", "it"];

try {
  process.loadEnvFile(path.join(ROOT, ".env.local"));
} catch {
  // .env.local is optional
}

// Sessionize category titles are free text per event. Override the defaults
// with a comma-separated list, e.g. SESSIONIZE_TRACK_CATEGORY="Topic,Track".
function categoryTitlesFromEnv() {
  const fromEnv = (name, fallback) => {
    const raw = process.env[name];
    if (!raw) return fallback;
    const titles = raw.split(",").map((t) => t.trim()).filter(Boolean);
    return titles.length ? titles : fallback;
  };
  return {
    track: fromEnv("SESSIONIZE_TRACK_CATEGORY", DEFAULT_CATEGORY_TITLES.track),
    level: fromEnv("SESSIONIZE_LEVEL_CATEGORY", DEFAULT_CATEGORY_TITLES.level),
    tags: fromEnv("SESSIONIZE_TAGS_CATEGORY", DEFAULT_CATEGORY_TITLES.tags)
  };
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

// Replaces the namespace rather than merging into it: these namespaces hold
// nothing but one entry per Sessionize id, so merging would leave entries for
// sessions the organizer has since deleted or renamed (and the original seed
// content) lingering forever.
async function replaceMessagesNamespace(locale, key, entries) {
  const filePath = path.join(ROOT, `messages/${locale}.json`);
  const messages = JSON.parse(await readFile(filePath, "utf-8"));
  messages[key] = entries;
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

  const categoryTitles = categoryTitlesFromEnv();
  const { sessions, speakers, sessionMessages, speakerMessages, skippedUnscheduled } = mapAll(apiResponse, {
    categoryTitles
  });

  if (sessions.length === 0) {
    console.warn("[fetch-sessionize] no scheduled sessions in response — skipping, keeping existing content.");
    return;
  }

  if (skippedUnscheduled > 0) {
    console.warn(`[fetch-sessionize] skipped ${skippedUnscheduled} session(s) with no start/end time.`);
  }

  // A category title that matches nothing yields empty tracks/levels for every
  // session, which silently guts the agenda filters — the failure this script
  // is most likely to hit, since the titles are per-event free text.
  const withoutTrack = sessions.filter((s) => !s.track).length;
  if (withoutTrack === sessions.length) {
    const seen = (apiResponse.categories ?? []).map((c) => c.title).join(", ");
    console.warn(
      `[fetch-sessionize] no session matched a track category (tried: ${categoryTitles.track.join(", ")}; ` +
        `event has: ${seen || "none"}). Set SESSIONIZE_TRACK_CATEGORY to the right title.`
    );
  }

  await writeSessionsFile(sessions);
  await writeSpeakersFile(speakers);
  for (const locale of LOCALES) {
    await replaceMessagesNamespace(locale, "sessions", sessionMessages);
    await replaceMessagesNamespace(locale, "speakers", speakerMessages);
  }

  console.log(`[fetch-sessionize] wrote ${sessions.length} sessions, ${speakers.length} speakers.`);
}

await main();
