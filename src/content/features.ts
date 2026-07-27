/** Build-time toggles — flip to false and rebuild to hide a page/section. */
export const features = {
  venue: true,
  agenda: false,
  speakers: false,
  sponsors: true,
  about: true,
  cfp: true,
  programTracks: false,
  speakersPreview: false,
  faq: true,
  team: true,
  devfestGuide:
    process.env.NODE_ENV === "development" ||
    process.env.NEXT_PUBLIC_DEVFEST_GUIDE_ENABLED === "true"
};
