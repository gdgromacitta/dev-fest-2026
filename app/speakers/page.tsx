import type { Metadata } from "next";
import { SpeakersPageContent } from "@/src/components/speakers/speakers-page-content";

export const metadata: Metadata = {
  title: "Speakers | DevFest by GDG",
  description: "Meet DevFest speakers and see their sessions."
};

export default function SpeakersPage() {
  return (
    <main>
      <SpeakersPageContent />
    </main>
  );
}
