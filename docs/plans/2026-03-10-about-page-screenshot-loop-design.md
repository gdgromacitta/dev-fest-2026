# About Page Screenshot Loop Design

**Scope:** Rebuild the About page body to visually match the provided desktop reference screenshot while explicitly excluding shared header and footer parity work.

## Target Outcome

The About page body should align with the reference screenshot in three areas:

1. A hero section with community badge, large two-line title, supporting copy, two CTAs, and a right-aligned event visual.
2. An organizers section with centered heading, short supporting copy, and an 8-card grid.
3. A values section with three evenly spaced icon-led columns on a light neutral background.

## Constraints

- Do not redesign shared header or footer components in this loop.
- Keep the implementation local to the About page and supporting content/components where possible.
- Use local assets/CSS only; no new remote dependencies.
- Generate loop screenshots into `docs/screenshots/about-us-loop` and keep only the last image.

## Delivery Approach

- Expand the About content model so the page can render the organizer grid and values row from structured data.
- Add a targeted About page test covering the reference-driven structure.
- Rebuild `app/about/page.tsx` and `src/components/about/team-card.tsx` for screenshot parity within the scoped body.
- Build the app and capture desktop screenshots from a local static/dev server, retaining only the final capture.
