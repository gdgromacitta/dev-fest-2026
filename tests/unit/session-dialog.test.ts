// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { NextIntlClientProvider } from "next-intl";
import { SessionList } from "@/src/components/agenda/session-list";
import { resolveHashSession } from "@/src/components/agenda/session-dialog";
import { speakers } from "@/src/content/speakers";
import en from "@/messages/en.json";
import type { Session } from "@/src/types/content";

globalThis.React = React;
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

vi.mock("@/src/i18n/navigation", () => ({
  Link: ({ href, children, ...props }: { href: string; children?: React.ReactNode }) =>
    React.createElement("a", { href, ...props }, children)
}));

beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

const speaker = speakers[0]!;
const base = { start: "2026-10-10T10:00:00", end: "2026-10-10T10:30:00", track: "AI", room: "Maria", level: "beginner" as const, tags: ["AI", "LLM"] };
const withSpeaker: Session = { ...base, id: "s1", speakerIds: [speaker.id] };
const tba: Session = { ...base, id: "s2", speakerIds: [] };
const noAbstract: Session = { ...base, id: "s3", speakerIds: [] };
const lunch: Session = { ...base, id: "brk", track: "", room: "", tags: [], speakerIds: [], isBreak: true };
const sessions = [withSpeaker, tba, noAbstract, lunch];

const messages = {
  ...en,
  sessions: {
    s1: { title: "First talk", abstract: "Abstract one" },
    s2: { title: "Second talk", abstract: "Abstract two" },
    s3: { title: "Third talk" },
    brk: { title: "Lunch" }
  }
};

let container: HTMLDivElement;
let root: Root;

const mount = () =>
  act(() => {
    root.render(
      React.createElement(NextIntlClientProvider, {
        locale: "en",
        messages,
        timeZone: "Europe/Rome",
        children: React.createElement(SessionList, { sessions, rooms: ["Maria"] })
      })
    );
  });

const dialog = () => container.querySelector("dialog")!;
const trigger = (title: string) =>
  [...container.querySelectorAll<HTMLButtonElement>("h3 button")].find((b) => b.textContent === title)!;
const tick = () => act(() => new Promise<void>((resolve) => setTimeout(resolve, 20)));

beforeEach(() => {
  window.history.replaceState(null, "", "/agenda");
  container = document.createElement("div");
  document.body.appendChild(container);
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
});

describe("resolveHashSession", () => {
  test("resolves talks and ignores breaks, unknown ids and empty hashes", () => {
    expect(resolveHashSession("#s1", sessions)).toBe(withSpeaker);
    expect(resolveHashSession("#brk", sessions)).toBeNull();
    expect(resolveHashSession("#nonexistent", sessions)).toBeNull();
    expect(resolveHashSession("", sessions)).toBeNull();
    expect(resolveHashSession("#%E0%A4%A", sessions)).toBeNull();
  });
});

describe("trigger", () => {
  test("renders a title button for talks and none for breaks", () => {
    mount();
    expect(container.querySelectorAll("h3 button")).toHaveLength(3);
    expect(container.querySelector("[data-agenda-break] button")).toBeNull();
  });

  test("opens the modal with details, speaker link and abstract", () => {
    mount();
    act(() => trigger("First talk").click());
    expect(dialog().hasAttribute("open")).toBe(true);
    expect(dialog().textContent).toContain("Abstract one");
    expect(dialog().querySelector(`a[href="/speakers/${speaker.slug}"]`)).not.toBeNull();
    expect(window.location.hash).toBe("#s1");
  });

  test("TBA session shows the TBA label without a link", () => {
    mount();
    act(() => trigger("Second talk").click());
    expect(dialog().textContent).toContain(en.agenda.speakerTba);
    expect(dialog().querySelector("a[href^='/speakers']")).toBeNull();
  });

  test("omits the abstract block when the key is missing", () => {
    mount();
    act(() => trigger("Third talk").click());
    expect(dialog().hasAttribute("open")).toBe(true);
    expect(dialog().textContent).not.toContain("Abstract");
  });
});

describe("layout", () => {
  test("abstract scrolls in the body; speakers and actions stay pinned in the footer", () => {
    mount();
    act(() => trigger("First talk").click());
    const body = dialog().querySelector("[data-dialog-body]")!;
    const footer = dialog().querySelector("[data-dialog-footer]")!;
    expect(body.textContent).toContain("Abstract one");
    expect(body.textContent).not.toContain(speaker.name);
    expect(footer.textContent).toContain(speaker.name);
    expect(footer.querySelector("button[aria-pressed]")).not.toBeNull();
    expect(footer.querySelector(`[data-add-to-calendar="s1"]`)).not.toBeNull();
  });
});

describe("bookmark sync", () => {
  test("toggling in the modal updates the card", () => {
    mount();
    act(() => trigger("First talk").click());
    const cardButton = () => container.querySelector<HTMLButtonElement>('[data-agenda-session="s1"] button[aria-pressed]')!;
    const modalButton = dialog().querySelector<HTMLButtonElement>("button[aria-pressed]")!;
    expect(cardButton().getAttribute("aria-pressed")).toBe("false");
    act(() => modalButton.click());
    expect(cardButton().getAttribute("aria-pressed")).toBe("true");
    act(() => modalButton.click());
    expect(cardButton().getAttribute("aria-pressed")).toBe("false");
  });
});

describe("history sync", () => {
  test("closing after opening from the list goes back and removes the hash", async () => {
    const before = window.history.length;
    mount();
    act(() => trigger("First talk").click());
    expect(window.history.length).toBe(before + 1);
    const back = vi.spyOn(window.history, "back");
    act(() => dialog().close());
    expect(back).toHaveBeenCalledTimes(1);
    await tick();
    expect(window.location.hash).toBe("");
    expect(dialog().hasAttribute("open")).toBe(false);
    back.mockRestore();
  });

  test("Back (popstate) closes the modal", async () => {
    mount();
    act(() => trigger("First talk").click());
    act(() => window.history.back());
    await tick();
    expect(dialog().hasAttribute("open")).toBe(false);
    expect(window.location.hash).toBe("");
  });

  test("a deep link opens on mount and closes via replaceState, without history.back", () => {
    window.history.replaceState(null, "", "/agenda#s2");
    const length = window.history.length;
    const back = vi.spyOn(window.history, "back");
    mount();
    expect(dialog().hasAttribute("open")).toBe(true);
    act(() => dialog().close());
    expect(back).not.toHaveBeenCalled();
    expect(window.location.hash).toBe("");
    expect(window.location.pathname).toBe("/agenda");
    expect(window.history.length).toBe(length);
    back.mockRestore();
  });

  test.each(["#brk", "#nonexistent"])("hash %s opens nothing", (hash) => {
    window.history.replaceState(null, "", `/agenda${hash}`);
    expect(() => mount()).not.toThrow();
    expect(dialog().hasAttribute("open")).toBe(false);
  });
});
