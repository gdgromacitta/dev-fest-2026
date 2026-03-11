import type { Venue } from "@/src/types/content";

export const venue: Venue = {
  name: "Innovation Hub Main Hall",
  address: "123 Developer Lane",
  city: "Tech City, Silicon Valley, California, 94043",
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11187.249271457035!2d9.1899819!3d45.4642035",
  mapsLinkUrl: "https://maps.google.com/?q=123+Developer+Lane+Silicon+Valley",
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
