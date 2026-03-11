# Speakers Page Screenshot Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Speakers page body so it matches the provided desktop reference screenshot and verify it with a screenshot loop.

**Architecture:** Keep shared header and footer out of scope and implement the speakers page body as three sections: a dark hero banner, a speakers card wall with category tabs, and a featured speaker detail panel. Use page-local showcase data so the screenshot-driven layout can evolve without breaking agenda/content link behavior elsewhere.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Vitest, local browser screenshot capture

---

### Task 1: Add a regression test for the screenshot-scoped speakers body

**Files:**
- Create: `tests/unit/speakers-page-content.test.ts`

**Step 1: Write the failing test**

Assert that the page renders:
- the `Meet our Featured Speakers` hero heading
- category tabs
- eight showcase speaker cards
- a featured speaker detail panel for `Charlie Davis`

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/speakers-page-content.test.ts`

**Step 3: Write minimal implementation**

Update the speakers page until the reference-driven structure is present.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/speakers-page-content.test.ts`

### Task 2: Rebuild the speakers body

**Files:**
- Modify: `app/speakers/page.tsx`
- Modify: `src/components/speakers/speakers-page-content.tsx`
- Create: `src/content/speaker-showcase.ts`

**Step 1: Implement the hero banner**

Add the dark photographic-style hero block with heading and intro text.

**Step 2: Implement tabs and card grid**

Render eight speaker cards matching the reference proportions and card metadata.

**Step 3: Implement the featured speaker panel**

Render the selected speaker summary and scheduled sessions list.

### Task 3: Build and run the screenshot loop

**Files:**
- Create: `docs/screenshots/speakers-loop/`

**Step 1: Build**

Run: `npm run build`

**Step 2: Capture**

Capture the speakers page into `docs/screenshots/speakers-loop`.

**Step 3: Keep final screenshot**

Delete intermediate captures unless needed for analysis.
