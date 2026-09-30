export type GuideLocale = "it" | "en";

export type GuideState = "idle" | "hover" | "thinking" | "speaking" | "success" | "error";

export type GuideMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  localOnly?: boolean;
};

export type GuideRequestMessage = Pick<GuideMessage, "role" | "content">;

export type GuideStreamEvent =
  | { type: "delta"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };
