# Content Management

## Update Team
- Edit [`src/content/team.ts`](C:\Users\Giorgio\Desktop\projects\dev-fest\src\content\team.ts)
- Keep `name`, `role`, `bioShort`, `photo`, `links` populated.

## Update Speakers
- Edit [`src/content/speakers.ts`](C:\Users\Giorgio\Desktop\projects\dev-fest\src\content\speakers.ts)
- Each speaker `id` must be unique and referenced by sessions.

## Update Agenda
- Edit [`src/content/sessions.ts`](C:\Users\Giorgio\Desktop\projects\dev-fest\src\content\sessions.ts)
- Use ISO datetime strings for `start`/`end`.
- Ensure every `speakerIds[]` entry exists in speakers data.

## Update Venue
- Edit [`src/content/venue.ts`](C:\Users\Giorgio\Desktop\projects\dev-fest\src\content\venue.ts)
- Keep `mapsLinkUrl` and `directions` always available as fallback.
