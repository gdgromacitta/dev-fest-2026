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
  sessions, the script warns and leaves the existing committed content
  untouched — the build never fails because of this.
- Run it standalone with `npm run fetch:content`. A successful fetch leaves
  the regenerated files showing as modified in `git status` — only commit
  them if you mean to update the checked-in content.