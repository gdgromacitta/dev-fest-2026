// Hand-maintained: sessions.ts is regenerated from Sessionize on every build,
// so per-session overrides live here, keyed by session id. Listed logos replace
// the speaker photos on the agenda card and in the session dialog — useful for
// workshops run by an organisation, with or without a named speaker.
export type SessionLogo = { src: string; alt: string };

const romaElis: SessionLogo[] = [
  { src: "/logos/42-roma.png", alt: "42 Roma" },
  { src: "/logos/elis-innovation-hub.svg", alt: "ELIS Innovation Hub" }
];

export const sessionLogos: Record<string, SessionLogo[]> = {
  // Blind Trust: Caccia alle Vulnerabilità nel Codice Generato da IA – Master ICT
  "1349344": romaElis,
  // AGENT IN TRASFERTA – Ingegneria Digitale
  "1349347": romaElis,
  // Build it. Break it. Explain it. — 42 Roma ELIS
  "1349348": romaElis
};
