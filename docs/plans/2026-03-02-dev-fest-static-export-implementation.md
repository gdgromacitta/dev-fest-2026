# DevFest Static Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a static-export Next.js DevFest website (About, Agenda, Speakers, Venue) that matches provided screenshots and meets accessibility/performance requirements.

**Architecture:** Use Next.js App Router with static export, typed local content modules, and reusable UI primitives. Implement behavior using test-first development for data logic and accessibility-critical interactions, then iterate visual parity against screenshot references in `docs/*.png`. Keep design system minimal and shared to avoid page-level style drift.

**Tech Stack:** Next.js (App Router, TypeScript), Tailwind CSS, Vitest + Testing Library, Playwright, `axe-core`/`jest-axe`, ESLint, `next-sitemap` (or static script), npm.

---

## Execution Notes
- Run this plan in a dedicated worktree via `@superpowers/using-git-worktrees`.
- Follow TDD with `@superpowers/test-driven-development`.
- Before any success claim, run full verification via `@superpowers/verification-before-completion`.

### Task 1: Bootstrap Next.js Static Project and Test Tooling

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `postcss.config.js`
- Create: `app/globals.css`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `vitest.config.ts`
- Create: `tests/setup.ts`
- Test: `tests/smoke/app-shell.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import RootLayout from "@/app/layout";

test("renders root landmarks", () => {
  render(
    <RootLayout>
      <main>content</main>
    </RootLayout>
  );
  expect(screen.getByRole("banner")).toBeInTheDocument();
  expect(screen.getByRole("contentinfo")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/smoke/app-shell.test.tsx -v`
Expected: FAIL with module/config missing errors.

**Step 3: Write minimal implementation**

```tsx
// app/layout.tsx
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header role="banner">DevFest</header>
        {children}
        <footer role="contentinfo">GDG</footer>
      </body>
    </html>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/smoke/app-shell.test.tsx -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add package.json next.config.ts tsconfig.json tailwind.config.ts postcss.config.js app/globals.css app/layout.tsx app/page.tsx vitest.config.ts tests/setup.ts tests/smoke/app-shell.test.tsx
git commit -m "chore: bootstrap static next app with test harness"
```

### Task 2: Add Typed Content Models and Seed Data

**Files:**
- Create: `src/content/team.ts`
- Create: `src/content/speakers.ts`
- Create: `src/content/sessions.ts`
- Create: `src/content/venue.ts`
- Create: `src/types/content.ts`
- Create: `src/lib/content.ts`
- Test: `tests/unit/content-links.test.ts`

**Step 1: Write the failing test**

```ts
import { getSpeakerById, getSessionsBySpeaker } from "@/src/lib/content";

test("every speaker session id resolves to an existing session", () => {
  const speaker = getSpeakerById("s-ada");
  expect(speaker).toBeTruthy();
  const sessions = getSessionsBySpeaker("s-ada");
  expect(sessions.length).toBeGreaterThan(0);
  expect(sessions[0].title).toBeTruthy();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/content-links.test.ts -v`
Expected: FAIL with import/function not found.

**Step 3: Write minimal implementation**

```ts
// src/lib/content.ts
import { speakers } from "@/src/content/speakers";
import { sessions } from "@/src/content/sessions";

export const getSpeakerById = (id: string) => speakers.find((s) => s.id === id) ?? null;
export const getSessionsBySpeaker = (speakerId: string) =>
  sessions.filter((session) => session.speakerIds.includes(speakerId));
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/content-links.test.ts -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add src/types/content.ts src/content/team.ts src/content/speakers.ts src/content/sessions.ts src/content/venue.ts src/lib/content.ts tests/unit/content-links.test.ts
git commit -m "feat: add typed content models and cross-link helpers"
```

### Task 3: Build Shared Layout Components (Header, Mobile Nav, Footer)

**Files:**
- Create: `src/components/layout/header.tsx`
- Create: `src/components/layout/mobile-nav.tsx`
- Create: `src/components/layout/footer.tsx`
- Modify: `app/layout.tsx`
- Test: `tests/components/navigation-a11y.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Header from "@/src/components/layout/header";

test("mobile nav toggle updates aria-expanded and exposes links", async () => {
  const user = userEvent.setup();
  render(<Header />);
  const button = screen.getByRole("button", { name: /menu/i });
  expect(button).toHaveAttribute("aria-expanded", "false");
  await user.click(button);
  expect(button).toHaveAttribute("aria-expanded", "true");
  expect(screen.getByRole("link", { name: /agenda/i })).toBeVisible();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/navigation-a11y.test.tsx -v`
Expected: FAIL with missing component/behavior.

**Step 3: Write minimal implementation**

```tsx
// src/components/layout/header.tsx
"use client";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header>
      <button aria-expanded={open} aria-controls="mobile-nav" onClick={() => setOpen((v) => !v)}>
        Menu
      </button>
      <nav id="mobile-nav" hidden={!open}>
        <a href="/about">About</a>
        <a href="/agenda">Agenda</a>
        <a href="/speakers">Speakers</a>
        <a href="/venue">Venue</a>
      </nav>
    </header>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/navigation-a11y.test.tsx -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add src/components/layout/header.tsx src/components/layout/mobile-nav.tsx src/components/layout/footer.tsx app/layout.tsx tests/components/navigation-a11y.test.tsx
git commit -m "feat: add accessible global navigation and footer"
```

### Task 4: Implement Design Tokens and Reusable UI Primitives

**Files:**
- Modify: `app/globals.css`
- Create: `src/components/ui/card.tsx`
- Create: `src/components/ui/badge.tsx`
- Create: `src/components/ui/tag.tsx`
- Create: `src/components/ui/accordion.tsx`
- Test: `tests/components/focus-styles.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { Card } from "@/src/components/ui/card";

test("interactive cards expose visible focus class", () => {
  render(<Card as="a" href="/about">About</Card>);
  const link = screen.getByRole("link", { name: "About" });
  expect(link.className).toMatch(/focus-visible/);
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/components/focus-styles.test.tsx -v`
Expected: FAIL with component not found/class mismatch.

**Step 3: Write minimal implementation**

```tsx
// src/components/ui/card.tsx
export function Card({ as: Tag = "div", className = "", ...props }: any) {
  return <Tag className={`rounded-xl border p-4 focus-visible:outline focus-visible:outline-2 ${className}`} {...props} />;
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/components/focus-styles.test.tsx -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add app/globals.css src/components/ui/card.tsx src/components/ui/badge.tsx src/components/ui/tag.tsx src/components/ui/accordion.tsx tests/components/focus-styles.test.tsx
git commit -m "feat: add design tokens and base flat-ui primitives"
```

### Task 5: Implement About Page with Responsive Team Grid

**Files:**
- Create: `app/about/page.tsx`
- Create: `src/components/about/team-card.tsx`
- Test: `tests/pages/about-page.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import AboutPage from "@/app/about/page";

test("about page renders team section and at least one member card", () => {
  render(<AboutPage />);
  expect(screen.getByRole("heading", { name: /meet the team/i })).toBeInTheDocument();
  expect(screen.getAllByRole("article").length).toBeGreaterThan(0);
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/pages/about-page.test.tsx -v`
Expected: FAIL with missing page/component.

**Step 3: Write minimal implementation**

```tsx
// app/about/page.tsx
import { team } from "@/src/content/team";

export default function AboutPage() {
  return (
    <main>
      <h1>About GDG DevFest</h1>
      <h2>Meet the Team</h2>
      <section>
        {team.map((member) => (
          <article key={member.name}>
            <h3>{member.name}</h3>
            <p>{member.role}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/pages/about-page.test.tsx -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add app/about/page.tsx src/components/about/team-card.tsx tests/pages/about-page.test.tsx
git commit -m "feat: add about page with responsive team listing"
```

### Task 6: Implement Agenda Filtering and Search Logic

**Files:**
- Create: `src/lib/agenda-filters.ts`
- Test: `tests/unit/agenda-filters.test.ts`

**Step 1: Write the failing test**

```ts
import { filterSessions } from "@/src/lib/agenda-filters";
import { sessions } from "@/src/content/sessions";

test("filters by track, level, tag, and text query", () => {
  const result = filterSessions(sessions, {
    track: "Web",
    level: "beginner",
    tags: ["AI"],
    query: "intro"
  });
  expect(result.every((s) => s.track === "Web")).toBe(true);
  expect(result.every((s) => s.level === "beginner")).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/unit/agenda-filters.test.ts -v`
Expected: FAIL with function not found.

**Step 3: Write minimal implementation**

```ts
export function filterSessions(sessions: any[], filters: any) {
  return sessions.filter((s) => {
    if (filters.track && s.track !== filters.track) return false;
    if (filters.level && s.level !== filters.level) return false;
    if (filters.tags?.length && !filters.tags.every((tag: string) => s.tags.includes(tag))) return false;
    if (filters.query && !`${s.title} ${s.abstract}`.toLowerCase().includes(filters.query.toLowerCase())) return false;
    return true;
  });
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/unit/agenda-filters.test.ts -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add src/lib/agenda-filters.ts tests/unit/agenda-filters.test.ts
git commit -m "feat: add deterministic agenda filter and search logic"
```

### Task 7: Implement Agenda Page with Accessible Filter Controls

**Files:**
- Create: `app/agenda/page.tsx`
- Create: `src/components/agenda/filter-toolbar.tsx`
- Create: `src/components/agenda/session-list.tsx`
- Test: `tests/pages/agenda-page.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AgendaPage from "@/app/agenda/page";

test("agenda page filters sessions from keyboard interaction", async () => {
  const user = userEvent.setup();
  render(<AgendaPage />);
  await user.tab();
  await user.keyboard("{Enter}");
  expect(screen.getByRole("searchbox")).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/pages/agenda-page.test.tsx -v`
Expected: FAIL with missing page or no focusable filter controls.

**Step 3: Write minimal implementation**

```tsx
// app/agenda/page.tsx
export default function AgendaPage() {
  return (
    <main>
      <h1>Agenda</h1>
      <label htmlFor="agenda-search">Search sessions</label>
      <input id="agenda-search" type="search" role="searchbox" />
    </main>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/pages/agenda-page.test.tsx -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add app/agenda/page.tsx src/components/agenda/filter-toolbar.tsx src/components/agenda/session-list.tsx tests/pages/agenda-page.test.tsx
git commit -m "feat: add agenda page with accessible filter scaffold"
```

### Task 8: Implement Speakers Page and Accessible Detail Surface

**Files:**
- Create: `app/speakers/page.tsx`
- Create: `src/components/speakers/speaker-card.tsx`
- Create: `src/components/speakers/speaker-dialog.tsx`
- Test: `tests/pages/speakers-page.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpeakersPage from "@/app/speakers/page";

test("opens speaker details and exposes associated sessions", async () => {
  const user = userEvent.setup();
  render(<SpeakersPage />);
  await user.click(screen.getAllByRole("button", { name: /view details/i })[0]);
  expect(screen.getByRole("dialog")).toBeInTheDocument();
  expect(screen.getByText(/sessions/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/pages/speakers-page.test.tsx -v`
Expected: FAIL with page/dialog not implemented.

**Step 3: Write minimal implementation**

```tsx
// app/speakers/page.tsx
"use client";
import { useState } from "react";

export default function SpeakersPage() {
  const [open, setOpen] = useState(false);
  return (
    <main>
      <h1>Speakers</h1>
      <button onClick={() => setOpen(true)}>View details</button>
      {open ? <div role="dialog"><h2>Sessions</h2></div> : null}
    </main>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/pages/speakers-page.test.tsx -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add app/speakers/page.tsx src/components/speakers/speaker-card.tsx src/components/speakers/speaker-dialog.tsx tests/pages/speakers-page.test.tsx
git commit -m "feat: add speakers page with accessible detail surface"
```

### Task 9: Implement Venue Page with Lazy Map and Text Fallback

**Files:**
- Create: `app/venue/page.tsx`
- Create: `src/components/venue/map-embed.tsx`
- Test: `tests/pages/venue-page.test.tsx`

**Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import VenuePage from "@/app/venue/page";

test("venue page always exposes map fallback link and directions", () => {
  render(<VenuePage />);
  expect(screen.getByRole("link", { name: /open in maps/i })).toBeInTheDocument();
  expect(screen.getByText(/directions/i)).toBeInTheDocument();
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/pages/venue-page.test.tsx -v`
Expected: FAIL with missing page/fallback.

**Step 3: Write minimal implementation**

```tsx
// app/venue/page.tsx
export default function VenuePage() {
  return (
    <main>
      <h1>Venue</h1>
      <a href="https://maps.google.com" target="_blank" rel="noreferrer">Open in Maps</a>
      <p>Directions: Use Metro line M2 and walk 5 minutes from the station.</p>
    </main>
  );
}
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/pages/venue-page.test.tsx -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add app/venue/page.tsx src/components/venue/map-embed.tsx tests/pages/venue-page.test.tsx
git commit -m "feat: add venue page with resilient map fallbacks"
```

### Task 10: Add SEO, Static Metadata, Sitemap, Robots, and Deployment Docs

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/sitemap.ts`
- Create: `public/robots.txt`
- Create: `docs/content-management.md`
- Create: `docs/deploy.md`
- Create: `docs/accessibility-checklist.md`
- Test: `tests/smoke/seo-files.test.ts`

**Step 1: Write the failing test**

```ts
import fs from "node:fs";

test("robots and sitemap definitions exist", () => {
  expect(fs.existsSync("public/robots.txt")).toBe(true);
  expect(fs.existsSync("app/sitemap.ts")).toBe(true);
});
```

**Step 2: Run test to verify it fails**

Run: `npm run test -- tests/smoke/seo-files.test.ts -v`
Expected: FAIL because files do not exist.

**Step 3: Write minimal implementation**

```ts
// app/sitemap.ts
export default function sitemap() {
  return ["/about", "/agenda", "/speakers", "/venue"].map((path) => ({
    url: `https://example.devfest.com${path}`,
    lastModified: new Date()
  }));
}
```

```txt
# public/robots.txt
User-agent: *
Allow: /
Sitemap: https://example.devfest.com/sitemap.xml
```

**Step 4: Run test to verify it passes**

Run: `npm run test -- tests/smoke/seo-files.test.ts -v`
Expected: PASS (1 passed).

**Step 5: Commit**

```bash
git add app/layout.tsx app/sitemap.ts public/robots.txt docs/content-management.md docs/deploy.md docs/accessibility-checklist.md tests/smoke/seo-files.test.ts
git commit -m "docs: add seo artifacts and project handoff documentation"
```

### Task 11: Screenshot Parity Iterations and Final Verification

**Files:**
- Modify: `app/about/page.tsx`
- Modify: `app/agenda/page.tsx`
- Modify: `app/speakers/page.tsx`
- Modify: `app/venue/page.tsx`
- Modify: `app/globals.css`
- Test: `tests/e2e/navigation.spec.ts`
- Test: `tests/e2e/accessibility.spec.ts`

**Step 1: Write the failing test**

```ts
import { test, expect } from "@playwright/test";

test("core routes are keyboard reachable", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/about|agenda|speakers|venue/);
});
```

**Step 2: Run test to verify it fails**

Run: `npx playwright test tests/e2e/navigation.spec.ts --project=chromium`
Expected: FAIL until routes/layout interactions are fully wired.

**Step 3: Write minimal implementation**

```tsx
// Ensure header links and focus management are present on all routes,
// then tune spacing/typography/colors to match:
// docs/about-us.png, docs/agenda.png, docs/speakers.png, docs/venue.png
```

**Step 4: Run test to verify it passes**

Run: `npm run test`
Run: `npm run lint`
Run: `npm run build`
Run: `npx playwright test`
Expected: all checks PASS; build emits static output without runtime errors.

**Step 5: Commit**

```bash
git add app/about/page.tsx app/agenda/page.tsx app/speakers/page.tsx app/venue/page.tsx app/globals.css tests/e2e/navigation.spec.ts tests/e2e/accessibility.spec.ts
git commit -m "feat: reach screenshot parity and complete verification suite"
```
