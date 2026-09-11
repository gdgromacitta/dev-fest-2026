import { afterEach, describe, expect, test, vi } from "vitest";

import {
  GuideApiError,
  parseSseBlock,
  streamGuide
} from "@/src/features/devfest-guide/api-client";

afterEach(() => {
  vi.unstubAllGlobals();
});

test("parses SSE data blocks", () => {
  expect(parseSseBlock('data: {"type":"delta","text":"Ciao"}')).toEqual({
    type: "delta",
    text: "Ciao"
  });
  expect(parseSseBlock(": keepalive")).toBeNull();
});

test("sends locale and full history while streaming deltas", async () => {
  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encoder.encode('data: {"type":"delta","text":"Ciao"}\n\n'));
      controller.enqueue(encoder.encode('data: {"type":"delta","text":"!"}\n\n'));
      controller.enqueue(encoder.encode('data: {"type":"done"}\n\n'));
      controller.close();
    }
  });
  const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
    expect(JSON.parse(String(init?.body))).toEqual({
      locale: "it",
      messages: [
        { role: "user", content: "Quando?" },
        { role: "assistant", content: "Il 10 ottobre." },
        { role: "user", content: "Dove?" }
      ]
    });
    return new Response(stream, {
      status: 200,
      headers: { "Content-Type": "text/event-stream" }
    });
  });
  vi.stubGlobal("fetch", fetchMock);
  const deltas: string[] = [];

  const result = await streamGuide({
    locale: "it",
    endpoint: "https://guide.example.test/api/guide",
    messages: [
      { role: "user", content: "Quando?" },
      { role: "assistant", content: "Il 10 ottobre." },
      { role: "user", content: "Dove?" }
    ],
    signal: new AbortController().signal,
    onDelta: (text) => deltas.push(text)
  });

  expect(result).toBe("Ciao!");
  expect(deltas).toEqual(["Ciao", "!"]);
  expect(fetchMock).toHaveBeenCalledOnce();
});

describe("stream errors", () => {
  test("surfaces a server SSE error", async () => {
    const stream = new ReadableStream<Uint8Array>({
      start(controller) {
        controller.enqueue(
          new TextEncoder().encode(
            'data: {"type":"error","message":"Riprova più tardi"}\n\n'
          )
        );
        controller.close();
      }
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(stream, { status: 200 }))
    );

    await expect(
      streamGuide({
        locale: "it",
        endpoint: "https://guide.example.test/api/guide",
        messages: [{ role: "user", content: "Ciao" }],
        signal: new AbortController().signal,
        onDelta: () => {}
      })
    ).rejects.toEqual(new GuideApiError("Riprova più tardi"));
  });
});
