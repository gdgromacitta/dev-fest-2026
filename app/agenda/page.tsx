import type { Metadata } from "next";
import { AgendaPageContent } from "@/src/components/agenda/agenda-page-content";

export const metadata: Metadata = {
  title: "Agenda | DevFest by GDG",
  description: "Browse the DevFest schedule with filters and search."
};

export default function AgendaPage() {
  return (
    <main>
      <AgendaPageContent />
    </main>
  );
}
