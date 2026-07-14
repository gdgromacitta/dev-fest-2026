import { redirect } from "next/navigation";
import { routing } from "@/i18n/routing";

// True app root (sibling to app/layout.tsx, outside app/[locale]/).
// With routing.localePrefix set to "always" there is no unprefixed
// content route, and there is no middleware under output: "export"
// (no server/edge runtime on GitHub Pages) to rewrite "/" to the
// default locale. This page is Next's static-export equivalent:
// redirect() bakes into a static out/index.html that client-side
// navigates to the default locale on load, and works identically
// under `next dev` and a served `next build` output.
export default function RootPage() {
  redirect(`/${routing.defaultLocale}`);
}
