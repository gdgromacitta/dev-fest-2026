# dev-fest-2026

## Agenda/speaker data (Sessionize)

`npm run build` runs `scripts/fetch-sessionize.mjs` first (via the `prebuild`
npm lifecycle hook) to regenerate `src/content/sessions.ts`,
`src/content/speakers.ts`, and the `sessions`/`speakers` entries in
`messages/en.json` / `messages/it.json` from the Sessionize API. It reads the
event's "All" view from `SESSIONIZE_API_URL`
(`https://sessionize.com/api/v2/{eventId}/view/All`).

- **Local dev**: set `SESSIONIZE_API_URL` in a `.env.local` file (gitignored).
- **CI**: set the `SESSIONIZE_API_URL` repository secret (used by
  `.github/workflows/nextjs.yml`).
- If the env var is unset, the fetch fails, or Sessionize returns zero
  scheduled sessions, the script warns and leaves the existing committed
  content untouched — the build never fails because of this.
- Run it standalone with `npm run fetch:content`. A successful fetch leaves
  the regenerated files showing as modified in `git status` — only commit
  them if you mean to update the checked-in content.

### Category titles

Sessionize has no first-class track/level/tag concept — they come from
Category titles the organizer types into the Sessionize dashboard, and they
differ per event. The script matches a list of candidates case-insensitively
(`Track`/`Topic`/`Argomento` for tracks, `Level`/`Level of the Talk`/`Livello`
for levels, `Tags`/`Tag` for tags) and falls back to the track when no tags
category exists.

If this event uses different titles, override them with comma-separated lists:

| Variable | Default candidates |
| --- | --- |
| `SESSIONIZE_TRACK_CATEGORY` | `Track,Topic,Argomento` |
| `SESSIONIZE_LEVEL_CATEGORY` | `Level,Level of the Talk,Livello` |
| `SESSIONIZE_TAGS_CATEGORY` | `Tags,Tag` |

When no session matches the track category the script warns and prints the
titles the event actually has — without that, a title mismatch silently
produces an agenda where every session has no track, no tags, and a
defaulted `intermediate` level.

### What the sync does and doesn't keep

- Sessions with no `startsAt`/`endsAt` (still being scheduled) are dropped and
  the count is reported. `Session.start` is typed `string`, so emitting `null`
  would fail the build's type check.
- The `sessions` and `speakers` namespaces in `messages/*.json` are *replaced*,
  not merged, so entries for deleted or renamed sessions don't linger. Every
  other namespace in those files is left untouched.
- Both locales get the same fetched text — Sessionize stores one language, so
  `messages/it.json` will hold whatever the organizer wrote.