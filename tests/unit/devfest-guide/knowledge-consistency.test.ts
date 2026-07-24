import knowledge from "@/services/devfest-guide-api/data/devfest-knowledge.json";
import itMessages from "@/messages/it.json";
import enMessages from "@/messages/en.json";
import { features } from "@/src/content/features";
import { team } from "@/src/content/team";
import { venue } from "@/src/content/venue";

test("guide knowledge matches public event and venue facts", () => {
  expect(knowledge.event.date).toBe("2026-10-10");
  expect(itMessages.home.eventDate).toContain("10 Ottobre 2026");
  expect(enMessages.home.eventDate).toContain("October 10, 2026");
  expect(knowledge.venue.name).toBe(venue.name);
  expect(knowledge.venue.address).toContain("Via Vito Volterra, 60");
  expect(venue.address).toContain("Via Vito Volterra, 60");
});

test("guide knowledge contains the same public organizer ids", () => {
  const guideOrganizerIds = knowledge.organizers
    .filter((organizer) => organizer.published)
    .map((organizer) => organizer.id)
    .sort();
  const siteOrganizerIds = team.map((organizer) => organizer.id).sort();

  expect(guideOrganizerIds).toEqual(siteOrganizerIds);
});

test("disabled placeholder program content is not exposed", () => {
  expect(features.agenda).toBe(false);
  expect(features.speakers).toBe(false);
  expect(knowledge.sessions).toEqual([]);
  expect(knowledge.speakers).toEqual([]);
});
