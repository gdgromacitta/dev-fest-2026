import type { TeamMember } from "@/src/types/content";

// `role` and `bioShort` are translated content and live in
// messages/{locale}.json under the `team.<id>.*` namespace, keyed by `id`.
export const team: TeamMember[] = [
  {
    id: "davide-passafaro",
    name: "Davide Passafaro",
    photo: "/team/davide_passafaro.webp",
    links: [],
    accentColor: "#75a7f3"
  },
  {
    id: "giorgio-galassi",
    name: "Giorgio Galassi",
    photo: "/team/giorgio_galassi.webp",
    links: [],
    accentColor: "#f58b7f"
  },
  {
    id: "eleonora-biancone",
    name: "Eleonora Biancone",
    photo: "/team/eleonora_biancone.webp",
    links: [],
    accentColor: "#d4b16a"
  },
  {
    id: "ryan-jherome-burgos",
    name: "Ryan Jherome Burgos",
    photo: "/team/ryan_jherome_burgos.webp",
    links: [],
    accentColor: "#7fbf8d"
  },
  {
    id: "giulio-alfieri",
    name: "Giulio Alfieri",
    photo: "/team/giulio_alfieri.webp",
    links: [],
    accentColor: "#86a8f4"
  }
];
