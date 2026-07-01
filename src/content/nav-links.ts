// Pre-launch: only publicly accessible routes are exposed.
// Restore /about, /agenda, /speakers when those pages go live.
export const navLinks: { href: string; label: string; key: string }[] = [
  { href: "/", label: "Home", key: "home" },
  { href: "/venue", label: "Venue", key: "venue" }
];
