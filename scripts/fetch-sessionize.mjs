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

import { readFile, rename, unlink, writeFile } from "node:fs/promises";
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

const SESSIONS_HEADER =
  "// `title` and `abstract` are translated content and live in\n" +
  "// messages/{locale}.json under the `sessions.<id>.*` namespace, keyed by `id`.\n" +
  "// Regenerated at build time by scripts/fetch-sessionize.mjs — see that file\n" +
  "// before hand-editing.";

const SPEAKERS_HEADER =
  "// `bioShort` and `bioLong` are translated content and live in\n" +
  "// messages/{locale}.json under the `speakers.<id>.*` namespace, keyed by `id`.\n" +
  "// Regenerated at build time by scripts/fetch-sessionize.mjs — see that file\n" +
  "// before hand-editing.";

const serializeSessions = (sessions) =>
  serializeArray("Session", "@/src/types/content", SESSIONS_HEADER, sessions);

const serializeSpeakers = (speakers) =>
  serializeArray("Speaker", "@/src/types/content", SPEAKERS_HEADER, speakers);

// Replaces each namespace rather than merging into it: they hold nothing but
// one entry per Sessionize id, so merging would leave entries for sessions the
// organizer has since deleted or renamed (and the original seed content)
// lingering forever. Hand-authored namespaces in the same file are untouched.
//
// Both namespaces are applied in one pass — rendering them separately would
// make the second write clobber the first.
async function renderMessages(locale, namespaces) {
  const filePath = path.join(ROOT, `messages/${locale}.json`);
  const messages = JSON.parse(await readFile(filePath, "utf-8"));
  for (const [key, entries] of Object.entries(namespaces)) {
    messages[key] = entries;
  }
  return [filePath, `${JSON.stringify(messages, null, 2)}\n`];
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

  // Everything past the fetch is inside the same guard: the contract at the
  // top of this file is that a bad response can never fail the build, and a
  // 200 with an unexpected body (maintenance page, `sessions` not an array)
  // makes mapAll throw just as readily as the network does.
  try {
    const { sessions, speakers, sessionMessages, speakerMessages, skippedUnscheduled } = mapAll(apiResponse, {
      categoryTitles
    });

    if (sessions.length === 0 || speakers.length === 0) {
      console.warn(
        `[fetch-sessionize] response has ${sessions.length} scheduled session(s) and ${speakers.length} ` +
          "speaker(s) — skipping, keeping existing content."
      );
      return;
    }

    if (skippedUnscheduled > 0) {
      console.warn(`[fetch-sessionize] skipped ${skippedUnscheduled} session(s) with no start/end time.`);
    }

    // A category title that matches nothing yields empty tracks/levels for
    // every session, which silently guts the agenda filters — the failure this
    // script is most likely to hit, since the titles are per-event free text.
    const withoutTrack = sessions.filter((s) => !s.track).length;
    if (withoutTrack === sessions.length) {
      const seen = (apiResponse.categories ?? []).map((c) => c.title).join(", ");
      console.warn(
        `[fetch-sessionize] no session matched a track category (tried: ${categoryTitles.track.join(", ")}; ` +
          `event has: ${seen || "none"}). Set SESSIONIZE_TRACK_CATEGORY to the right title.`
      );
    }

    const withoutRoom = sessions.filter((s) => !s.room && !s.isBreak).length;
    if (withoutRoom > 0) {
      console.warn(
        `[fetch-sessionize] ${withoutRoom} session(s) have no room assigned — they render under "Unassigned".`
      );
    }

    // Serialize every file before writing any of them. sessions.ts and the
    // messages namespaces have to agree — a half-written pair leaves the repo
    // with sessions whose `sessions.<id>.title` key is missing, which fails
    // the Next build rather than falling back cleanly.
    const files = [
      [path.join(ROOT, "src/content/sessions.ts"), serializeSessions(sessions)],
      [path.join(ROOT, "src/content/speakers.ts"), serializeSpeakers(speakers)],
      ...(await Promise.all(
        LOCALES.map((locale) =>
          renderMessages(locale, { sessions: sessionMessages, speakers: speakerMessages })
        )
      ))
    ];

    // Rename is atomic per file, but four files can't be swapped in one step.
    // So snapshot the current contents first and roll them back if any rename
    // fails: leaving sessions.ts on new ids while the message files still hold
    // the old ones is the one outcome that breaks the next `next build`.
    const previous = new Map(
      await Promise.all(files.map(async ([filePath]) => [filePath, await readFile(filePath, "utf-8")]))
    );

    const staged = [];
    const applied = [];
    try {
      for (const [filePath, contents] of files) {
        const tempPath = `${filePath}.tmp-fetch-sessionize`;
        // Registered before the write, so a partial write still gets cleaned up.
        staged.push([tempPath, filePath]);
        await writeFile(tempPath, contents);
      }
      // Shift only after the rename resolves — dropping the entry first would
      // leak the temp file when the rename throws (EPERM, EXDEV, read-only).
      while (staged.length) {
        const [tempPath, filePath] = staged[0];
        await rename(tempPath, filePath);
        staged.shift();
        applied.push(filePath);
      }
    } catch (err) {
      await Promise.all(applied.map((filePath) => writeFile(filePath, previous.get(filePath)).catch(() => {})));
      throw err;
    } finally {
      await Promise.all(staged.map(([tempPath]) => unlink(tempPath).catch(() => {})));
    }

    console.log(`[fetch-sessionize] wrote ${sessions.length} sessions, ${speakers.length} speakers.`);
  } catch (err) {
    console.warn(`[fetch-sessionize] could not apply response (${err.message}) — keeping existing content.`);
  }
}

await main();
