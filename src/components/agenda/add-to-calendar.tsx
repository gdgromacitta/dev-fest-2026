"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useLocale, useMessages, useTranslations } from "next-intl";
import type { Session } from "@/src/types/content";
import { speakers } from "@/src/content/speakers";
import { venue } from "@/src/content/venue";
import { buildGoogleCalendarUrl } from "@/src/lib/calendar-events";
import {
  buildSessionCalendarEvent,
  icsPath,
  type CalendarMessages
} from "@/src/lib/session-calendar-event";

// One popup at a time: opening announces its id, every other instance closes.
const OPEN_EVENT = "add-to-calendar:open";

const optionClass =
  "focus-ring block rounded-lg px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100";

type CalendarPopupProps = { id: string; googleUrl: string; icsHref: string; onSelect?: () => void };

/** The popup body; split out so its links can be rendered in isolation. */
export function CalendarPopup({ id, googleUrl, icsHref, onSelect }: CalendarPopupProps) {
  const t = useTranslations("agenda");
  return (
    <div
      id={id}
      // max-w keeps the panel inside a 360px viewport; it opens from the
      // trigger's left edge, which sits at the card's left.
      className="absolute left-0 top-full z-20 mt-1 w-max max-w-[calc(100vw-3rem)] rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
    >
      <a href={googleUrl} target="_blank" rel="noopener noreferrer" onClick={onSelect} className={optionClass}>
        {t("addToGoogleCalendar")}
      </a>
      <a href={icsHref} download onClick={onSelect} className={optionClass}>
        {t("downloadIcs")}
      </a>
    </div>
  );
}

/** Escape closes the popup; kept pure so it can be tested without a DOM. */
export const isCloseKey = (key: string) => key === "Escape";

type AddToCalendarProps = { session: Session; title: string };

/**
 * Disclosure popup with two links. Disclosure (not role="menu") because the
 * options are plain links: Tab moves through them, Escape closes and returns
 * focus to the trigger, outside click and selecting an option also close.
 */
export function AddToCalendar({ session, title }: AddToCalendarProps) {
  const t = useTranslations("agenda");
  const locale = useLocale();
  const messages = useMessages() as CalendarMessages;
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isCloseKey(event.key)) return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    const onOtherOpen = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== panelId) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    window.addEventListener(OPEN_EVENT, onOtherOpen);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
      window.removeEventListener(OPEN_EVENT, onOtherOpen);
    };
  }, [open, panelId]);

  const toggle = () => {
    if (!open) window.dispatchEvent(new CustomEvent(OPEN_EVENT, { detail: panelId }));
    setOpen(!open);
  };

  // Only built while open, so closed cards do no calendar work.
  const googleUrl = open
    ? buildGoogleCalendarUrl(buildSessionCalendarEvent(session, { locale, messages, speakers, venue }))
    : "";
  const close = () => setOpen(false);

  return (
    <div ref={rootRef} className="relative inline-block" data-add-to-calendar={session.id}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        aria-label={t("addToCalendarAriaLabel", { title })}
        onClick={toggle}
        className="focus-ring inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-semibold text-[#2b6cd4] hover:bg-[#e7f0ff]"
      >
        <svg aria-hidden="true" viewBox="0 0 20 20" className="h-4 w-4 fill-none stroke-current" strokeWidth="1.5">
          <rect x="3" y="4" width="14" height="13" rx="2" />
          <path d="M3 8h14M7 2.5v3M13 2.5v3" strokeLinecap="round" />
        </svg>
        {t("addToCalendar")}
      </button>
      {open ? (
        <CalendarPopup id={panelId} googleUrl={googleUrl} icsHref={icsPath(session.id, locale)} onSelect={close} />
      ) : null}
    </div>
  );
}
