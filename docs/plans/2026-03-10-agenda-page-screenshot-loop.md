# Agenda Page Screenshot Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Agenda page body so it matches the provided desktop reference screenshot and verify it with a screenshot loop.

**Architecture:** Keep shared header and footer out of scope and concentrate changes in the Agenda page body, agenda content data, and agenda components. Preserve the existing filtering behavior where practical, but express it through the screenshot-matched chip/timeline UI instead of generic form controls.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Vitest, local browser screenshot capture

---

### Task 1: Add a regression test for the screenshot-scoped agenda body

**Files:**
- Create: `tests/unit/agenda-page-content.test.ts`

**Step 1: Write the failing test**

Assert that the Agenda page body renders:
- the `Event Agenda` heading
- chip-style tracks and levels labels
- timeline times from the reference
- the lunch break row
- five visible agenda session cards

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/agenda-page-content.test.ts`
Expected: FAIL because the current agenda page is a generic filters + list layout.

**Step 3: Write minimal implementation**

Update agenda content/components until the page satisfies the test.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/agenda-page-content.test.ts`
Expected: PASS.

### Task 2: Rebuild the agenda body into the screenshot-matched timeline layout

**Files:**
- Modify: `app/agenda/page.tsx`
- Modify: `src/components/agenda/agenda-page-content.tsx`
- Modify: `src/components/agenda/filter-toolbar.tsx`
- Modify: `src/components/agenda/session-list.tsx`
- Modify: `src/content/sessions.ts`

**Step 1: Implement chip-based track and level controls**

Replace generic form controls with compact track and level chips that align with the reference.

**Step 2: Implement the timeline layout**

Render the left time rail, session cards, and lunch break separator row.

**Step 3: Align session content with the reference**

Use realistic session titles/speaker text matching the screenshot’s structure and time slots.

**Step 4: Re-run the agenda page test**

Run: `npm run test -- tests/unit/agenda-page-content.test.ts`
Expected: PASS.

### Task 3: Build and run the agenda screenshot loop

**Files:**
- Create: `docs/screenshots/agenda-loop/`

**Step 1: Build the app**

Run: `npm run build`

**Step 2: Serve the local render target and capture screenshots**

Capture the Agenda page into `docs/screenshots/agenda-loop`.

**Step 3: Keep only the final screenshot**

Delete intermediate captures unless needed for analysis.

### Task 4: Verify final state

**Step 1: Run relevant tests**

Run: `npm run test -- tests/unit/agenda-page-content.test.ts tests/unit/agenda-filters.test.ts`

**Step 2: Re-run build**

Run: `npm run build`
