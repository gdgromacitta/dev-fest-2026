"use client";

import { useEffect, useId, useRef } from "react";
import type { MouseEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";

type DialogProps = {
  /** Controlled state: true shows the dialog modally, false closes it. */
  open: boolean;
  /**
   * Fired exactly once when the user dismisses the dialog (Escape, close
   * button or backdrop click). Not fired when the parent closes it by setting
   * `open` to false. The parent should set `open` to false in response.
   */
  onClose: () => void;
  /** Heading content; rendered as an h2 that labels the dialog. */
  title: ReactNode;
  children?: ReactNode;
  /** Pinned below the scrolling body, like the heading above it. */
  footer?: ReactNode;
  className?: string;
};

/**
 * Generic modal built on the native <dialog> element. The browser provides
 * focus containment, Escape handling, top-layer rendering and an inert
 * background. This component adds focus restore to the previously focused
 * element (the trigger), backdrop-click dismissal, a labelled close button,
 * and a page scroll lock — the inert background still scrolls natively.
 */
export function Dialog({ open, onClose, title, children, footer, className = "" }: DialogProps) {
  const t = useTranslations("dialog");
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);
  // Inline `overflow` on <html> before we locked it; null while unlocked.
  const lockedOverflowRef = useRef<string | null>(null);

  function lockScroll() {
    if (lockedOverflowRef.current !== null) return;
    const root = document.documentElement;
    lockedOverflowRef.current = root.style.overflow;
    root.style.overflow = "hidden";
  }

  function unlockScroll() {
    if (lockedOverflowRef.current === null) return;
    document.documentElement.style.overflow = lockedOverflowRef.current;
    lockedOverflowRef.current = null;
  }

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    openRef.current = open;
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      openerRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      dialog.showModal();
      lockScroll();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // Unmounting while open fires no `close` event, so release the lock here.
  useEffect(() => unlockScroll, []);

  // The native `close` event fires for every close path (Escape, close(),
  // form method=dialog), so focus restore and onClose live here only.
  function handleClose() {
    const opener = openerRef.current;
    openerRef.current = null;
    unlockScroll();
    if (opener?.isConnected) opener.focus();
    if (openRef.current) {
      openRef.current = false;
      onCloseRef.current();
    }
  }

  function handleClick(event: MouseEvent<HTMLDialogElement>) {
    // Clicks inside the content bubble up with a different target; only a
    // click on the <dialog> element itself is a backdrop click.
    if (event.target === event.currentTarget) event.currentTarget.close();
  }

  // Fixed size so every dialog looks the same; only the body scrolls, keeping
  // the heading, close button and footer in view however long the content is.
  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleClose}
      onClick={handleClick}
      className={`flat-card m-auto h-[min(36rem,calc(100dvh-2rem))] w-[calc(100%-2rem)] max-w-xl overflow-hidden p-0 backdrop:bg-slate-900/35 ${className}`.trim()}
    >
      <div className="flex h-full flex-col">
        <div className="flex flex-none items-start justify-between gap-4 border-b border-slate-200 p-5">
          <h2 id={titleId} className="m-0 text-xl font-semibold">
            {title}
          </h2>
          <button
            type="button"
            className="focus-ring flex-none rounded-md border border-slate-300 px-3 py-1 text-sm"
            onClick={() => dialogRef.current?.close()}
          >
            {t("close")}
          </button>
        </div>
        <div data-dialog-body className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-5">
          {children}
        </div>
        {footer ? (
          <div data-dialog-footer className="flex-none border-t border-slate-200 p-5">
            {footer}
          </div>
        ) : null}
      </div>
    </dialog>
  );
}
