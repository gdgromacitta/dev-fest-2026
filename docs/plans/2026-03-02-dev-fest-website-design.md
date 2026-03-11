# DevFest Website Design

## Scope
- Build a public DevFest website for GDG with static export.
- Implement four pages: About, Agenda, Speakers, Venue.
- Use screenshot-driven visual matching against:
  - `docs/about-us.png`
  - `docs/agenda.png`
  - `docs/speakers.png`
  - `docs/venue.png`

## Product Decisions
- Primary language: English.
- Deployment mode: static export (no server runtime dependency).
- Design source of truth: screenshots in `docs/` (not direct Figma MCP access for now).

## Architecture
- Framework: Next.js (App Router) with static export configuration.
- Language: TypeScript.
- Styling: Tailwind CSS with a small internal design-token layer for colors, spacing, typography, and focus states.
- Data layer: typed local content modules for team, speakers, sessions, and venue.
- Routing:
  - `/about`
  - `/agenda`
  - `/speakers`
  - `/venue`
- Shared app shell:
  - Header with desktop + mobile navigation
  - Footer with credits, social links, contact, policy links

## Component Model
- Global primitives:
  - `Header`, `MobileNav`, `Footer`
  - `Card`, `Badge`, `Tag`, `Divider`
  - `Accordion`, `SearchInput`, `FilterChip`
- Page-level composition:
  - About: GDG intro + responsive team card grid
  - Agenda: toolbar (search + filters) + readable grouped session list/table
  - Speakers: grid with speaker metadata + accessible details surface
  - Venue: practical info + lazy map embed + text fallback and maps link

## Data Model
- `teamMember`: `name`, `role`, `bioShort`, `photo`, `links[]`
- `speaker`: `id`, `name`, `title`, `company`, `bioShort`, `bioLong`, `photo`, `links[]`, `sessions[]`
- `session`: `id`, `title`, `abstract`, `start`, `end`, `track`, `room`, `level`, `tags[]`, `speakerIds[]`
- `venue`: `name`, `address`, `city`, `mapEmbedUrl`, `mapsLinkUrl`, `notes[]`, `accessibilityInfo[]`

## Cross-Linking Rules
- Agenda sessions link to speaker profiles through `speakerIds[]`.
- Speakers expose associated sessions via normalized IDs.
- Broken references must fail safely (no dead links rendered).

## Accessibility Design
- Target WCAG 2.2 AA (minimum WCAG 2.1 AA behavior).
- Semantic landmarks and logical heading order.
- Keyboard support for all interactive controls.
- Visible focus states on all focusable elements.
- No critical interaction only on hover.
- Alt text for all meaningful images; robust missing-image fallback.
- Respect `prefers-reduced-motion`.

## Performance and SEO
- Static output with optimized/lazy images where appropriate.
- Per-page metadata: title, description, OG/Twitter.
- `sitemap.xml` and `robots.txt`.
- Keep motion/light effects minimal to preserve performance and flat style clarity.

## Visual Matching Workflow
- Build each page against its screenshot reference.
- Compare spacing, typography scale, alignment, icon sizing, and card rhythm.
- Prefer fixes in shared primitives/tokens before page-specific overrides.
- Iterate until close visual match is achieved across desktop and mobile.

## Error and Fallback Behavior
- Missing image: render placeholder with descriptive text fallback.
- Map blocked/unavailable: keep actionable fallback (`Open in Maps` + text directions).
- Missing speaker/session relation: show neutral metadata text; no broken links.

## Validation Strategy
- Unit tests for:
  - data normalization and cross-links
  - agenda filtering/search logic
- Component tests for accessibility-critical interactions.
- Manual visual review against screenshot files.
- Lighthouse checks near target thresholds:
  - Performance 90+
  - Accessibility 95+
  - Best Practices 90+
  - SEO 90+
