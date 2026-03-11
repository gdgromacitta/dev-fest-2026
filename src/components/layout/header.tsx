"use client";

import Link from "next/link";
import { useState } from "react";
import { MobileNav } from "@/src/components/layout/mobile-nav";

const links = [
  { href: "/about", label: "About" },
  { href: "/agenda", label: "Agenda" },
  { href: "/speakers", label: "Speakers" },
  { href: "/venue", label: "Venue" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header role="banner" className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="focus-ring rounded-md px-2 py-1 text-lg font-semibold text-gblue">
          DevFest
        </Link>
        <button
          type="button"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label="Menu"
          className="focus-ring rounded-md border border-slate-300 px-3 py-2 text-sm font-medium md:hidden"
          onClick={() => setOpen((current) => !current)}
        >
          Menu
        </button>
        <nav aria-label="Main" className="hidden md:block">
          <ul className="m-0 flex list-none gap-2 p-0">
            {links.map((link) => (
              <li key={link.href}>
                <Link className="focus-ring rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100" href={link.href}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="mx-auto w-full max-w-6xl px-4 pb-3">
        <MobileNav open={open} />
      </div>
    </header>
  );
}
