import type { GuideLocale, GuideRequestMessage, GuideStreamEvent } from "./types";

type StreamGuideOptions = {
  locale: GuideLocale;
  messages: GuideRequestMessage[];
  signal: AbortSignal;
  onDelta: (text: string) => void;
  endpoint?: string | null;
};

export class GuideApiError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GuideApiError";
  }
}

export function getGuideApiUrl() {
  const configured = process.env.NEXT_PUBLIC_DEVFEST_GUIDE_API_URL?.trim();
  if (configured) {
    return configured;
  }
  return process.env.NODE_ENV === "development"
    ? "http://127.0.0.1:8000/api/guide"
    : null;
}

export function parseSseBlock(block: string): GuideStreamEvent | null {
  const data = block
    .split("\n")
    .filter((line) => line.startsWith("data:"))
    .map((line) => line.slice(5).trim())
    .join("");
  if (!data) {
    return null;
  }
  return JSON.parse(data) as GuideStreamEvent;
}

export async function streamGuide({
  locale,
  messages,
  signal,
  onDelta,
  endpoint = getGuideApiUrl()
}: StreamGuideOptions): Promise<string> {
  if (!endpoint) {
    throw new GuideApiError("Guide API is not configured");
  }

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream"
    },
    body: JSON.stringify({ locale, messages }),
    signal
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new GuideApiError(payload?.error ?? "Guide API is unavailable");
  }
  if (!response.body) {
    throw new GuideApiError("Guide API returned no stream");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let completeText = "";

  const consumeBlock = (block: string) => {
    const event = parseSseBlock(block);
    if (!event || event.type === "done") {
      return;
    }
    if (event.type === "error") {
      throw new GuideApiError(event.message);
    }
    completeText += event.text;
    onDelta(event.text);
  };

  while (true) {
    const { value, done } = await reader.read();
    buffer += decoder.decode(value, { stream: !done }).replaceAll("\r\n", "\n");
    const blocks = buffer.split("\n\n");
    buffer = blocks.pop() ?? "";
    blocks.forEach(consumeBlock);
    if (done) {
      if (buffer.trim()) {
        consumeBlock(buffer);
      }
      break;
    }
  }

  if (!completeText) {
    throw new GuideApiError("Guide API returned an empty answer");
  }
  return completeText;
}
