import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";

/** Reads a dot-separated path (e.g. "home.hero.title") off a nested object. */
function getValueAtPath(source: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, part) => {
    if (acc && typeof acc === "object" && part in acc) {
      return (acc as Record<string, unknown>)[part];
    }
    return undefined;
  }, source);
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  // Fall back to default locale if the requested locale is not supported
  if (!locale || !(routing.locales as readonly string[]).includes(locale)) {
    locale = routing.defaultLocale;
  }

  const messages = (await import(`../messages/${locale}.json`)).default;

  // Loaded once per request so a missing key can fall back to the default
  // locale's value instead of crashing the render.
  const defaultLocaleMessages =
    locale === routing.defaultLocale
      ? messages
      : (await import(`../messages/${routing.defaultLocale}.json`)).default;

  return {
    locale,
    messages,
    timeZone: "Europe/Rome",
    onError(error) {
      // Missing translations are handled by `getMessageFallback` below and
      // shouldn't be noisy in the console. Anything else (formatting
      // errors, invalid messages, etc.) is still logged as usual.
      if (error.code !== "MISSING_MESSAGE") {
        console.error(error);
      }
    },
    getMessageFallback({ error, key, namespace }) {
      const path = [namespace, key].filter(Boolean).join(".");
      const fallbackValue = getValueAtPath(defaultLocaleMessages, path);

      if (typeof fallbackValue === "string") {
        return fallbackValue;
      }

      // No value in the default locale either - render a safe placeholder
      // instead of throwing so the page keeps rendering.
      return path || error.message;
    }
  };
});
