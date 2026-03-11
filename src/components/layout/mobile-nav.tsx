"use client";

import Link from "next/link";

type MobileNavProps = {
  open: boolean;
};

const links = [
  { href: "/about", label: "About" },
  { href: "/agenda", label: "Agenda" },
  { href: "/speakers", label: "Speakers" },
  { href: "/venue", label: "Venue" }
];

export function MobileNav({ open }: MobileNavProps) {
  return (
    <nav
      id="mobile-nav"
      aria-label="Mobile"
      className={`md:hidden ${open ? "block" : "hidden"} rounded-xl border border-slate-200 bg-white p-4`}
    >
      <ul className="m-0 flex list-none flex-col gap-2 p-0">
        {links.map((link) => (
          <li key={link.href}>
            <Link className="focus-ring block rounded-md px-3 py-2 text-sm font-medium hover:bg-slate-100" href={link.href}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
