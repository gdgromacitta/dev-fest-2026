import { useSyncExternalStore } from "react";
import type { Session } from "@/src/types/content";

// Client-side store of saved ("bookmarked") session ids. The site is a static
// export with no backend, so persistence is localStorage. Every card bookmark
// and the Saved tab read the same store, so they stay in sync.

export const SAVED_SESSIONS_STORAGE_KEY = "devfest-2026:saved-sessions";

const EMPTY: readonly string[] = Object.freeze([]);

type Listener = () => void;

const listeners = new Set<Listener>();
let snapshot: readonly string[] = EMPTY;
let loaded = false;
let storageListening = false;

function getStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    // Accessing localStorage itself can throw (blocked cookies, sandboxing).
    return null;
  }
}

function parseIds(raw: string | null): readonly string[] {
  if (!raw) {
    return EMPTY;
  }
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return EMPTY;
    }
    const ids = parsed.filter((item): item is string => typeof item === "string");
    return ids.length > 0 ? Array.from(new Set(ids)) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function readFromStorage(): readonly string[] {
  try {
    return parseIds(getStorage()?.getItem(SAVED_SESSIONS_STORAGE_KEY) ?? null);
  } catch {
    return EMPTY;
  }
}

function writeToStorage(ids: readonly string[]) {
  try {
    getStorage()?.setItem(SAVED_SESSIONS_STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // Quota exceeded or storage unavailable (e.g. Safari private mode). The
    // in-memory snapshot still reflects the change for this page view.
  }
}

function sameIds(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((id, index) => id === b[index]);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function handleStorageEvent(event: StorageEvent) {
  // key === null means storage was cleared.
  if (event.key !== null && event.key !== SAVED_SESSIONS_STORAGE_KEY) {
    return;
  }
  const next = readFromStorage();
  // Keep the cached reference when nothing changed so React skips re-renders.
  if (!sameIds(next, snapshot)) {
    snapshot = next;
    emit();
  }
}

function setSnapshot(next: readonly string[]) {
  snapshot = next.length > 0 ? next : EMPTY;
  writeToStorage(snapshot);
  emit();
}

function ensureLoaded() {
  if (!loaded) {
    loaded = true;
    snapshot = readFromStorage();
  }
}

export function getSavedSessionIds(): readonly string[] {
  ensureLoaded();
  return snapshot;
}

export function getServerSnapshot(): readonly string[] {
  return EMPTY;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  if (!storageListening && typeof window !== "undefined") {
    window.addEventListener("storage", handleStorageEvent);
    storageListening = true;
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0 && storageListening && typeof window !== "undefined") {
      window.removeEventListener("storage", handleStorageEvent);
      storageListening = false;
    }
  };
}

export function isSaved(id: string): boolean {
  return getSavedSessionIds().includes(id);
}

export function saveSession(id: string) {
  const current = getSavedSessionIds();
  if (!current.includes(id)) {
    setSnapshot([...current, id]);
  }
}

export function unsaveSession(id: string) {
  const current = getSavedSessionIds();
  if (current.includes(id)) {
    setSnapshot(current.filter((savedId) => savedId !== id));
  }
}

export function toggleSession(id: string) {
  if (isSaved(id)) {
    unsaveSession(id);
  } else {
    saveSession(id);
  }
}

// Saved ids that match no current session (e.g. a session dropped from the
// schedule) are ignored here but deliberately left in storage, so they come
// back if the session reappears.
export function selectSavedSessions(
  sessions: readonly Session[],
  savedIds: readonly string[]
): Session[] {
  const saved = new Set(savedIds);
  return sessions.filter((session) => saved.has(session.id));
}

export function useSavedSessionIds(): readonly string[] {
  return useSyncExternalStore(subscribe, getSavedSessionIds, getServerSnapshot);
}

// Test-only: drop cached state so each test starts from storage.
export function resetSavedSessionsStoreForTests() {
  listeners.clear();
  if (storageListening && typeof window !== "undefined") {
    window.removeEventListener("storage", handleStorageEvent);
  }
  storageListening = false;
  loaded = false;
  snapshot = EMPTY;
}
