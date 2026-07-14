// Restyling design (turn 2): Agenda and Speakers are live with TBA
// placeholder content; FAQ links to the home-page FAQ section.
import { features } from "@/src/content/features";

const allNavLinks: { href: string; label: string; key: string }[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/venue", label: "Venue", key: "venue" },
  { href: "/agenda", label: "Agenda", key: "agenda" },
  { href: "/speakers", label: "Speakers", key: "speakers" },
  { href: "/sponsors", label: "Sponsors", key: "sponsors" },
  { href: "/#faq", label: "FAQ", key: "faq" }
];

// Links without a matching feature flag (e.g. "home") always show.
export const navLinks = allNavLinks.filter(
  (link) => features[link.key as keyof typeof features] ?? true
);

/** Register CTA target — shared by header and page CTAs. */
export const registerUrl =
  "https://gdg.community.dev/events/details/google-gdg-roma-citta-presents-devfest-roma-2026/";

/** Call for Papers submission target. */
export const cfpUrl = "https://sessionize.com/devfest-roma-2026/";

/** Sponsor enquiries — shared by footer and sponsor-page CTAs. */
export const sponsorEmail = "gdgroma.citta@gmail.com";
