import React from "react";
import RootPage from "@/app/page";

globalThis.React = React;

describe("root page", () => {
  test("redirects to /about", () => {
    try {
      RootPage();
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect((error as Error).message).toContain("NEXT_REDIRECT");
      expect(String((error as Error & { digest?: string }).digest)).toContain("/about");
      return;
    }

    throw new Error("Expected root page to redirect");
  });
});
