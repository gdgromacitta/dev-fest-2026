import { vi } from "vitest";
import itMessages from "@/messages/it.json";

// `next-intl/server`'s `getRequestConfig` is only meaningfully implemented
// under the react-server runtime (outside of it, e.g. under Vitest, it
// resolves to a stub that throws). It's just an identity function at
// runtime (see next-intl's own source), so mock it as such to exercise the
// real config factory from `i18n/request.ts` in isolation.
vi.mock("next-intl/server", () => ({
  getRequestConfig: (
    createRequestConfig: (params: { requestLocale: Promise<string | undefined> }) => unknown
  ) => createRequestConfig
}));

import getConfig from "@/i18n/request";

describe("i18n/request — missing-translation fallback", () => {
  test("falls back to the default locale (it) value for a key missing from another locale", async () => {
    const config = await getConfig({ requestLocale: Promise.resolve("en") });

    // Simulate a key that exists in it.json but is missing for the current
    // ("en") request — regardless of whether en.json actually has it, the
    // fallback must resolve against the default locale's messages.
    const fallback = config.getMessageFallback?.({
      error: new Error("MISSING_MESSAGE: home.eventTitle (en)") as never,
      key: "eventTitle",
      namespace: "home"
    });

    expect(fallback).toBe(itMessages.home.eventTitle);
  });

  test("does not throw and returns a safe placeholder when the key is missing everywhere", async () => {
    const config = await getConfig({ requestLocale: Promise.resolve("en") });

    expect(() => {
      const fallback = config.getMessageFallback?.({
        error: new Error("MISSING_MESSAGE: home.totallyMissingKey (en)") as never,
        key: "totallyMissingKey",
        namespace: "home"
      });

      expect(fallback).toBe("home.totallyMissingKey");
    }).not.toThrow();
  });

  test("onError does not log to the console for missing-message errors", async () => {
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const config = await getConfig({ requestLocale: Promise.resolve("en") });

    const missingMessageError = Object.assign(new Error("MISSING_MESSAGE: home.eventTitle (en)"), {
      code: "MISSING_MESSAGE"
    });

    expect(() => config.onError?.(missingMessageError as never)).not.toThrow();
    expect(consoleSpy).not.toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  test("still falls back to the default locale for an unsupported requested locale", async () => {
    const config = await getConfig({ requestLocale: Promise.resolve("fr") });

    expect(config.locale).toBe("it");
  });
});
