# “DevFest” Website (GDG)

## Context and Goal

Build a public website for a **DevFest organized by a GDG (Google Developer Group)**. The UI must follow **flat design principles**, be visually light (not cluttered), modern, and highly **accessible**.

The website should clearly present information about the organizing team, agenda, speakers, and venue, and must work flawlessly on mobile devices.

---

## Design Principles (Flat + Lightweight UI)

* **Flat design**: clean surfaces, solid colors, no skeuomorphism, minimal and consistent shadows (if used).
* Clear typographic hierarchy with generous spacing and breathable layouts.
* Simple components: cards, badges, tags, dividers, accordions.
* Avoid heavy animations or complex transitions.
* Minimalist layout with strong visual clarity.
* Icons must be consistent and minimal.
* **Color palette must follow Google brand colors** (Google Blue, Red, Yellow, Green) with proper accessible contrast handling.
* Maximum of 4–6 core colors (including neutrals) + semantic states (success, warning, error).
* Light mode required; dark mode optional but appreciated.

---

## Accessibility (Non-Negotiable Requirement)

* Target: **WCAG 2.2 AA** compliance (or at least WCAG 2.1 AA).
* Full keyboard navigation support with visible focus states.
* Proper color contrast ratios.
* Correct semantic HTML structure (landmarks, logical heading order).
* Alt text for images.
* Accessible interactive components (proper ARIA usage where needed).
* Respect `prefers-reduced-motion`.
* Document language set correctly (`lang="en"` or `lang="it"` depending on final language choice).

---

## Performance & SEO

* Lighthouse targets (indicative):

  * Performance: 90+
  * Accessibility: 95+
  * Best Practices: 90+
  * SEO: 90+
* Optimized images with lazy loading where appropriate.
* SEO basics per page: title, meta description, Open Graph, Twitter cards.
* Sitemap and robots.txt.
* Clean URL structure.

---

# Required Pages

## 1) “About Us”

Purpose: Present the organizing GDG and its team.

Content:

* Short description of the GDG (mission, activities, community impact).
* “Meet the Team” section with:

  * Name
  * Role
  * Short bio
  * Photo
  * Optional social links (LinkedIn, GitHub, X)
* Optional CTA: Contact email or contact form.
* Links to GDG social channels.

UI:

* Responsive grid of team cards.
* Must not rely solely on hover interactions.

---

## 2) “Agenda”

Purpose: Display the event schedule clearly and efficiently.

Content:

* Event date(s) and time.
* Tracks (if multiple).
* Sessions including:

  * Title
  * Short abstract
  * Start/end time
  * Track/room
  * Speaker(s)
  * Level (beginner/intermediate/advanced)
  * Tags (AI, Web, Cloud, etc.)

Desired Features:

* Timeline view or structured table (prioritize readability).
* Filters by track/room, level, and tags.
* Text search.
* Cross-linking between sessions and speakers.
* Accordion or collapsible grouping if agenda is long.

---

## 3) “Speakers”

Purpose: Highlight event speakers and their talks.

Content:

* Speaker list including:

  * Photo
  * Name
  * Job title/company
  * Short bio
  * Social links
* Speaker detail (modal or dedicated page):

  * Extended bio
  * Associated sessions (linked to agenda)

Sorting:

* Alphabetical and/or keynote prioritization.

UI:

* Clean grid layout.
* Consistent card heights.
* Accessible fallback if image missing.

---

## 4) “Venue” (with Map)

Purpose: Make it easy to locate the event.

Content:

* Venue name
* Full address
* Practical info (transportation, parking, accessibility, check-in details)
* Embedded map (e.g., Google Maps)

Accessibility & Performance:

* Provide fallback:

  * “Open in Maps” link
  * Text-based directions
* Load map responsibly (lazy load or after consent if required).

---

# Global Layout & Navigation

* Header with DevFest logo + navigation:

  * About
  * Agenda
  * Speakers
  * Venue
* Footer including:

  * GDG credits
  * Social links
  * Contact email
  * Privacy/cookie policy (if required)
  * Optional sponsor section

Mobile-first approach:

* Accessible hamburger menu (proper ARIA attributes and focus handling).

---

# Suggested Data Model

Content should be manageable via JSON, Markdown/MDX, or lightweight CMS.

Recommended structures:

```
teamMember: {
  name,
  role,
  bioShort,
  photo,
  links[]
}

speaker: {
  id,
  name,
  title,
  company,
  bioShort,
  bioLong,
  photo,
  links[],
  sessions[]
}

session: {
  id,
  title,
  abstract,
  start,
  end,
  track,
  room,
  level,
  tags[],
  speakerIds[]
}

venue: {
  name,
  address,
  city,
  mapEmbedUrl,
  mapsLinkUrl,
  notes[],
  accessibilityInfo[]
}
```

---

# Technical Considerations

* Suggested stack (if SSR/SEO needed): **Next.js** or equivalent.
* Styling: Tailwind CSS or modular CSS with a simple design system.
* Component library only if lightweight and accessibility-first.
* i18n not required but architecture should allow future expansion.

---

# Deliverables

1. Minimal design system (colors, typography, spacing, components).
2. Fully implemented 4 required pages + global layout.
3. Mock content data for team, speakers, and agenda.
4. Short documentation:

   * How to update content
   * How to deploy
   * Accessibility checklist

---

# Acceptance Criteria

* Fully responsive.
* Fully keyboard navigable.
* No critical information available only via hover.
* Accessible color contrast.
* Agenda is filterable and searchable.
* Proper cross-linking between speakers and sessions.
* Venue includes embedded map + fallback link + written directions.
* Lighthouse scores near targets.

