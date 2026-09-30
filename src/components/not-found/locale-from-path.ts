export type NotFoundLocale = "it" | "en";

// Maps the first URL path segment to a locale. Only "en" selects English;
// "it", unknown segments and "/" all fall back to Italian (the default).
export function localeFromPath(pathname: string): NotFoundLocale {
  const first = pathname.split("/").filter(Boolean)[0];
  return first === "en" ? "en" : "it";
}
