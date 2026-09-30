// @vitest-environment jsdom
import React, { act } from "react";
import { createRoot } from "react-dom/client";
import type { Root } from "react-dom/client";
import { NextIntlClientProvider } from "next-intl";
import { Dialog } from "@/src/components/ui/dialog";
import en from "@/messages/en.json";
import it from "@/messages/it.json";

globalThis.React = React;
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

// jsdom does not implement showModal/close reliably; stub them with the
// native semantics that matter here: toggle `open`, fire `close` on close().
beforeAll(() => {
  HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
    if (!this.hasAttribute("open")) return;
    this.removeAttribute("open");
    this.dispatchEvent(new Event("close"));
  };
});

let container: HTMLDivElement;
let root: Root;
let trigger: HTMLButtonElement;
const onClose = vi.fn();

function render(open: boolean, messages: object = en) {
  act(() => {
    root.render(
      React.createElement(NextIntlClientProvider, {
        locale: "en",
        messages,
        children: React.createElement(Dialog, { open, onClose, title: "Hello", children: React.createElement("p", { id: "body" }, "Body") })
      })
    );
  });
}

beforeEach(() => {
  onClose.mockClear();
  container = document.createElement("div");
  document.body.append(container);
  trigger = document.createElement("button");
  document.body.append(trigger);
  trigger.focus();
  root = createRoot(container);
});

afterEach(() => {
  act(() => root.unmount());
  container.remove();
  trigger.remove();
});

const dialogEl = () => container.querySelector("dialog") as HTMLDialogElement;

describe("Dialog", () => {
  test("opens via showModal and is labelled by its heading", () => {
    render(false);
    expect(dialogEl().open).toBe(false);
    render(true);
    expect(dialogEl().open).toBe(true);
    const heading = container.querySelector("h2") as HTMLElement;
    expect(heading.textContent).toBe("Hello");
    expect(dialogEl().getAttribute("aria-labelledby")).toBe(heading.id);
  });

  test("close button has a translated accessible name in both locales", () => {
    render(true);
    expect(container.querySelector("button")?.textContent).toBe(en.dialog.close);
    act(() => root.unmount());
    root = createRoot(container);
    render(true, it);
    expect(container.querySelector("button")?.textContent).toBe(it.dialog.close);
  });

  test("close button closes and fires onClose once", () => {
    render(true);
    act(() => (container.querySelector("button") as HTMLButtonElement).click());
    expect(dialogEl().open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("Escape (native close event) fires onClose once", () => {
    render(true);
    act(() => {
      // Browsers close the dialog on Escape, which dispatches `close`.
      dialogEl().close();
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("backdrop click closes; content click does not", () => {
    render(true);
    act(() => (container.querySelector("#body") as HTMLElement).click());
    expect(dialogEl().open).toBe(true);
    expect(onClose).not.toHaveBeenCalled();
    act(() => dialogEl().click());
    expect(dialogEl().open).toBe(false);
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("restores focus to the previously focused element on close", () => {
    render(true);
    (container.querySelector("button") as HTMLButtonElement).focus();
    expect(document.activeElement).not.toBe(trigger);
    act(() => (container.querySelector("button") as HTMLButtonElement).click());
    expect(document.activeElement).toBe(trigger);
  });

  test("parent-driven close does not fire onClose", () => {
    render(true);
    render(false);
    expect(dialogEl().open).toBe(false);
    expect(onClose).not.toHaveBeenCalled();
  });
});
