import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  SAVED_SESSIONS_STORAGE_KEY as KEY,
  getSavedSessionIds,
  getServerSnapshot,
  isSaved,
  resetSavedSessionsStoreForTests,
  saveSession,
  selectSavedSessions,
  subscribe,
  toggleSession,
  unsaveSession
} from "@/src/lib/saved-sessions";
import type { Session } from "@/src/types/content";

function memoryStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    data
  };
}

describe("saved-sessions store", () => {
  beforeEach(() => {
    resetSavedSessionsStoreForTests();
    vi.stubGlobal("localStorage", memoryStorage());
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("saves, unsaves and toggles", () => {
    saveSession("a");
    saveSession("a");
    saveSession("b");
    expect(getSavedSessionIds()).toEqual(["a", "b"]);
    unsaveSession("a");
    expect(isSaved("a")).toBe(false);
    toggleSession("a");
    expect(isSaved("a")).toBe(true);
    toggleSession("a");
    expect(isSaved("a")).toBe(false);
  });

  it("returns a stable snapshot between changes and an empty server snapshot", () => {
    saveSession("a");
    const first = getSavedSessionIds();
    expect(getSavedSessionIds()).toBe(first);
    saveSession("a");
    expect(getSavedSessionIds()).toBe(first);
    expect(getServerSnapshot()).toEqual([]);
  });

  it("notifies subscribers directly and stops after unsubscribe", () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);
    saveSession("a");
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    saveSession("b");
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it("round-trips through storage", () => {
    saveSession("a");
    saveSession("b");
    const stored = (localStorage as unknown as ReturnType<typeof memoryStorage>).data.get(KEY);
    expect(JSON.parse(stored as string)).toEqual(["a", "b"]);
    resetSavedSessionsStoreForTests();
    expect(getSavedSessionIds()).toEqual(["a", "b"]);
  });

  it("degrades to empty on corrupt or wrongly shaped data", () => {
    for (const raw of ["{not json", '{"a":1}', "null", "42"]) {
      resetSavedSessionsStoreForTests();
      vi.stubGlobal("localStorage", memoryStorage({ [KEY]: raw }));
      expect(getSavedSessionIds()).toEqual([]);
    }
    resetSavedSessionsStoreForTests();
    vi.stubGlobal("localStorage", memoryStorage({ [KEY]: '["a",1,null,"a","b"]' }));
    expect(getSavedSessionIds()).toEqual(["a", "b"]);
  });

  it("never throws when storage is unavailable", () => {
    const throwing = {
      getItem: () => {
        throw new Error("denied");
      },
      setItem: () => {
        throw new Error("quota");
      }
    };
    vi.stubGlobal("localStorage", throwing);
    expect(getSavedSessionIds()).toEqual([]);
    expect(() => saveSession("a")).not.toThrow();
    expect(isSaved("a")).toBe(true);

    resetSavedSessionsStoreForTests();
    vi.stubGlobal("localStorage", undefined);
    expect(() => toggleSession("x")).not.toThrow();
  });

  it("updates from the storage event of another tab", () => {
    const listeners = new Map<string, (event: unknown) => void>();
    vi.stubGlobal("window", {
      addEventListener: (type: string, fn: (event: unknown) => void) => listeners.set(type, fn),
      removeEventListener: (type: string) => listeners.delete(type)
    });
    const storage = memoryStorage();
    vi.stubGlobal("localStorage", storage);
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);
    expect(getSavedSessionIds()).toEqual([]);

    storage.data.set(KEY, '["z"]');
    listeners.get("storage")?.({ key: KEY });
    expect(getSavedSessionIds()).toEqual(["z"]);
    expect(listener).toHaveBeenCalledTimes(1);

    listeners.get("storage")?.({ key: "other" });
    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
    expect(listeners.has("storage")).toBe(false);
  });

  it("ignores unknown ids in selection but keeps them in storage", () => {
    saveSession("gone");
    saveSession("s1");
    const sessions = [{ id: "s1" }, { id: "s2" }] as Session[];
    expect(selectSavedSessions(sessions, getSavedSessionIds()).map((s) => s.id)).toEqual(["s1"]);
    unsaveSession("s1");
    expect(getSavedSessionIds()).toEqual(["gone"]);
  });
});
