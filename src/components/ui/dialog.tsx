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
  className?: string;
};

/**
 * Generic modal built on the native <dialog> element. The browser provides
 * focus containment, Escape handling, top-layer rendering and an inert
 * background. This component adds focus restore to the previously focused
 * element (the trigger), backdrop-click dismissal, and a labelled close button.
 */
export function Dialog({ open, onClose, title, children, className = "" }: DialogProps) {
  const t = useTranslations("dialog");
  const titleId = useId();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  const openRef = useRef(open);
  const onCloseRef = useRef(onClose);

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
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  // The native `close` event fires for every close path (Escape, close(),
  // form method=dialog), so focus restore and onClose live here only.
  function handleClose() {
    const opener = openerRef.current;
    openerRef.current = null;
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

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={handleClose}
      onClick={handleClick}
      className={`flat-card m-auto w-[calc(100%-2rem)] max-w-xl p-0 backdrop:bg-slate-900/35 ${className}`.trim()}
    >
      <div className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="m-0 text-xl font-semibold">
            {title}
          </h2>
          <button
            type="button"
            className="focus-ring rounded-md border border-slate-300 px-3 py-1 text-sm"
            onClick={() => dialogRef.current?.close()}
          >
            {t("close")}
          </button>
        </div>
        {children}
      </div>
    </dialog>
  );
}
