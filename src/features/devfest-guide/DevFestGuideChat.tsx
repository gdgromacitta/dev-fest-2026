"use client";

import { FormEvent, KeyboardEvent, useEffect, useMemo, useRef, useState } from "react";
import { useTranslations } from "next-intl";

import { GuideApiError, getGuideApiUrl, streamGuide } from "./api-client";
import styles from "./devfest-guide.module.css";
import type { GuideLocale, GuideMessage, GuideState } from "./types";
import { WolfMascot } from "./WolfMascot";

type DevFestGuideChatProps = {
  locale: GuideLocale;
};

const MAX_USER_TURNS = 6;

function makeId() {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function clamp(value: number) {
  return Math.max(-1, Math.min(1, value));
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6L18 18M18 6L6 18" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 3L10 14M21 3L14 21L10 14L3 10Z" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>
  );
}

export function DevFestGuideChat({ locale }: DevFestGuideChatProps) {
  const t = useTranslations("devfestGuide");
  const endpoint = getGuideApiUrl();
  const initialMessage = useMemo<GuideMessage>(
    () => ({
      id: "devfest-guide-intro",
      role: "assistant",
      localOnly: true,
      content: t("intro")
    }),
    [t]
  );
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [messages, setMessages] = useState<GuideMessage[]>([initialMessage]);
  const [draft, setDraft] = useState("");
  const [requestState, setRequestState] = useState<
    "idle" | "thinking" | "speaking" | "success" | "error"
  >("idle");
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [announcement, setAnnouncement] = useState("");
  const mascotButtonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isBusy = requestState === "thinking" || requestState === "speaking";
  const userTurns = messages.filter(
    (message) => message.role === "user" && !message.localOnly
  ).length;
  const reachedLimit = userTurns >= MAX_USER_TURNS;

  const guideState: GuideState = useMemo(() => {
    if (requestState !== "idle") {
      return requestState;
    }
    return isHovered ? "hover" : "idle";
  }, [isHovered, requestState]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ block: "nearest" });
  }, [messages, requestState]);

  useEffect(() => {
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;

    const onPointerMove = (event: PointerEvent) => {
      if (motionQuery.matches || event.pointerType === "touch") {
        return;
      }
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = mascotButtonRef.current?.getBoundingClientRect();
        if (!rect) {
          return;
        }
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height * 0.45;
        setPointer({
          x: clamp((event.clientX - centerX) / 260),
          y: clamp((event.clientY - centerY) / 180)
        });
      });
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
      }
    };
  }, []);

  async function sendMessage() {
    const content = draft.trim();
    if (!content || isBusy || reachedLimit) {
      return;
    }

    const userMessage: GuideMessage = { id: makeId(), role: "user", content };
    const nextMessages = [...messages, userMessage];
    const responseMessageId = makeId();
    const requestMessages = nextMessages
      .filter((message) => !message.localOnly)
      .map(({ role, content: messageContent }) => ({ role, content: messageContent }));

    setDraft("");
    setMessages([...nextMessages, { id: responseMessageId, role: "assistant", content: "" }]);
    setRequestState("thinking");
    setAnnouncement(t("thinkingAnnouncement"));

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const completeText = await streamGuide({
        locale,
        messages: requestMessages,
        endpoint,
        signal: controller.signal,
        onDelta(text) {
          setRequestState("speaking");
          setMessages((current) =>
            current.map((message) =>
              message.id === responseMessageId
                ? { ...message, content: message.content + text }
                : message
            )
          );
        }
      });
      setRequestState("success");
      setAnnouncement(t("responseAnnouncement", { response: completeText }));
      successTimerRef.current = setTimeout(() => setRequestState("idle"), 900);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }
      const message =
        error instanceof GuideApiError && !error.message.includes("not configured")
          ? error.message
          : t("errors.unavailable");
      setMessages((current) =>
        current.map((item) =>
          item.id === responseMessageId ? { ...item, content: message } : item
        )
      );
      setRequestState("error");
      setAnnouncement(message);
    } finally {
      abortRef.current = null;
    }
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage();
  }

  function onDraftKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void sendMessage();
    }
  }

  function stopRequest() {
    abortRef.current?.abort();
    setRequestState("idle");
    setAnnouncement(t("stoppedAnnouncement"));
    setMessages((current) => current.filter((message) => message.content.length > 0));
  }

  if (!endpoint) {
    return null;
  }

  return (
    <aside className={styles.overlay}>
      {isOpen ? (
        <section
          id="devfest-guide-panel"
          role="dialog"
          aria-labelledby="devfest-guide-title"
          className={styles.panel}
        >
          <header className={styles.panelHeader}>
            <div>
              <p className={styles.eyebrow}>{t("eyebrow")}</p>
              <h2 id="devfest-guide-title" className={styles.title}>
                {t("title")}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className={styles.iconButton}
              aria-label={t("close")}
            >
              <CloseIcon />
            </button>
          </header>

          <div className={styles.messages}>
            {messages.map((message) => (
              <div
                key={message.id}
                className={
                  message.role === "user"
                    ? `${styles.message} ${styles.userMessage}`
                    : `${styles.message} ${styles.assistantMessage}`
                }
              >
                {message.content || (requestState === "thinking" ? t("thinking") : "…")}
              </div>
            ))}
            {reachedLimit ? <p className={styles.limit}>{t("limitReached")}</p> : null}
            <div ref={messagesEndRef} />
          </div>

          <p className={styles.srOnly} aria-live="polite">
            {announcement}
          </p>

          <form onSubmit={onSubmit} className={styles.form}>
            <label htmlFor="devfest-guide-message" className={styles.srOnly}>
              {t("inputLabel")}
            </label>
            <div className={styles.composer}>
              <textarea
                ref={inputRef}
                id="devfest-guide-message"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={onDraftKeyDown}
                rows={2}
                maxLength={1200}
                disabled={isBusy || reachedLimit}
                placeholder={reachedLimit ? t("conversationComplete") : t("placeholder")}
                className={styles.textarea}
              />
              {isBusy ? (
                <button
                  type="button"
                  onClick={stopRequest}
                  className={`${styles.actionButton} ${styles.stopButton}`}
                  aria-label={t("stop")}
                >
                  <StopIcon />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!draft.trim() || reachedLimit}
                  className={`${styles.actionButton} ${styles.sendButton}`}
                  aria-label={t("send")}
                >
                  <SendIcon />
                </button>
              )}
            </div>
            <p className={styles.privacy}>{t("privacy")}</p>
          </form>
        </section>
      ) : null}

      <button
        ref={mascotButtonRef}
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        aria-expanded={isOpen}
        aria-controls="devfest-guide-panel"
        aria-label={isOpen ? t("close") : t("open")}
        className={styles.launcher}
      >
        <WolfMascot state={guideState} pointerX={pointer.x} pointerY={pointer.y} />
        {!isOpen ? <span className={styles.launcherLabel}>{t("launcherLabel")}</span> : null}
      </button>
    </aside>
  );
}
