import type { Venue } from "@/src/types/content";

export const venue: Venue = {
  name: "Università degli Studi Roma Tre",
  address: "Dip. Ing. Civile, Informatica e Tecnologie Aeronautiche — Via Vito Volterra, 60",
  city: "Roma, Italy",
  mapEmbedUrl:
    "https://maps.google.com/maps?q=Via+Vito+Volterra+60+Roma&output=embed",
  mapsLinkUrl: "https://maps.google.com/?q=Via+Vito+Volterra+60,+Roma,+Italia",
  notes: [
    "Oct 24-25, 2024",
    "9:00 AM - 6:00 PM"
  ],
  accessibilityInfo: [
    "The venue is fully wheelchair accessible. Ramps are located at the North and South entrances. All floors are reachable via large elevators.",
    "Dedicated quiet zones and assistive listening devices are available upon request at the information desk."
  ],
  directions: [
    "Take Metro Line 1 (Blue) to 'Tech Park' station. From the exit, follow the signs for Innovation Hub. Bus 42 stops directly in front of the main entrance every 15 minutes.",
    "Free parking is available in Lot B for all DevFest attendees. Please present your digital ticket at the gate. Carpooling is highly encouraged to minimize environmental impact."
  ]
};
