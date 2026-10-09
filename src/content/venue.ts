import type { Venue } from "@/src/types/content";

// Maps queries use the bare street address: with the university's name in
// the query, Google resolves to Roma Tre's main listing instead of the street.
const mapsQuery = (address: string) => encodeURIComponent(`${address}, 00146 Roma`);

const entrance = (address: string) => ({
  address,
  mapEmbedUrl: `https://maps.google.com/maps?q=${mapsQuery(address)}&output=embed&z=17`,
  mapsLinkUrl: `https://maps.google.com/?q=${mapsQuery(address)}`
});

const department = "Dip. Ing. Civile, Informatica e Tecnologie Aeronautiche";

export const venue: Venue = {
  name: "Università degli Studi Roma Tre",
  department,
  // Calendar invites need a single location; entrances below are what pages show.
  address: `${department} — Via Vito Volterra, 60`,
  city: "Roma, Italy",
  // Both are equally valid ways in; neither is tied to particular rooms.
  entrances: [entrance("Via Vito Volterra 60"), entrance("Via della Vasca Navale 89")]
};
