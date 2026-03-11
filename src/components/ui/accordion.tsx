"use client";

import { useId, useState, type ReactNode } from "react";

type AccordionProps = {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
};

export function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <section className="flat-card">
      <h3 className="m-0">
        <button
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          className="focus-ring flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-sm font-semibold"
          onClick={() => setOpen((current) => !current)}
        >
          {title}
          <span aria-hidden>{open ? "−" : "+"}</span>
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="px-4 pb-4 text-sm text-slate-700">
        {children}
      </div>
    </section>
  );
}
