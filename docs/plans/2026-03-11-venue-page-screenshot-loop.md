# Venue Page Screenshot Loop Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Venue page body to match the provided desktop reference screenshot within the agreed scope, excluding the map fidelity.

**Architecture:** Keep shared header/footer out of scope and treat the map area as a non-authoritative block for this iteration. Focus on the hero text, venue address card, date/time cards, and transport/accessibility information panel so the page structure matches the reference while avoiding placeholder imagery.

**Tech Stack:** Next.js App Router, TypeScript, Tailwind CSS, Vitest, local browser screenshot capture

---

### Task 1: Add a regression test for the screenshot-scoped venue body

**Files:**
- Create: `tests/unit/venue-page-content.test.ts`

**Step 1: Write the failing test**

Assert that the page renders:
- the `Venue & Location` heading
- the `Venue Address` and `How to get here` section headings
- the venue address card with `Innovation Hub Main Hall`
- the date and time cards

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/venue-page-content.test.ts`

**Step 3: Write minimal implementation**

Update the venue page and data until the structure matches.

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/venue-page-content.test.ts`
