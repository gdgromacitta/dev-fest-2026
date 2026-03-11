# About Page Screenshot Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the About page body so it matches the provided desktop reference screenshot, then capture a screenshot loop and retain the final image.

**Architecture:** Keep shared header/footer out of scope and concentrate changes in the About page, its supporting content, and page-specific styling. Drive the page structure from local typed content so the screenshot-matching layout remains maintainable and testable.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Vitest, local browser headless screenshot capture

---

### Task 1: Add a regression test for the scoped About page structure

**Files:**
- Modify: `tests/unit/content-links.test.ts`
- Create: `tests/unit/about-page-content.test.tsx`

**Step 1: Write the failing test**

Write a test that renders the About page and asserts:
- the hero heading contains `About GDG DevFest`
- there are two CTA links/buttons in the hero area
- the organizers section renders 8 organizer cards
- the values section renders 3 value items

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/about-page-content.test.tsx`
Expected: FAIL because the current About page structure does not match the reference-driven assertions.

**Step 3: Write minimal implementation**

Add or update About page data/components until the page satisfies the scoped structure.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/about-page-content.test.tsx`
Expected: PASS.

### Task 2: Rebuild the About page body for screenshot parity

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `src/content/team.ts`
- Create: `src/content/about.ts`
- Modify: `src/components/about/team-card.tsx`

**Step 1: Implement the hero section**

Add badge, title, copy, CTAs, and right-side visual card matching the reference proportions.

**Step 2: Implement the organizers section**

Render centered heading/copy and an 8-card organizer grid with circular portraits, role color accents, and compact social links.

**Step 3: Implement the values section**

Render three value columns on a muted band with icon markers and short supporting text.

**Step 4: Re-run the About page test**

Run: `npm run test -- tests/unit/about-page-content.test.tsx`
Expected: PASS.

### Task 3: Build and run the screenshot loop

**Files:**
- Create: `docs/screenshots/about-us-loop/`

**Step 1: Build the app**

Run: `npm run build`
Expected: PASS with a static build.

**Step 2: Capture screenshots**

Serve the local app/export and capture one or more desktop screenshots of `/about`, writing them to `docs/screenshots/about-us-loop`.

**Step 3: Keep only the final capture**

Delete intermediate files and retain the last screenshot only.

### Task 4: Verify final state

**Step 1: Run relevant tests**

Run: `npm run test -- tests/unit/about-page-content.test.tsx tests/unit/content-links.test.ts`

**Step 2: Re-run build**

Run: `npm run build`

**Step 3: Inspect output artifacts**

Confirm the final screenshot exists in `docs/screenshots/about-us-loop`.
