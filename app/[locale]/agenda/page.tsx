import type { Metadata } from "next";
import { AgendaPageContent } from "@/src/components/agenda/agenda-page-content";

export const metadata: Metadata = {
  title: "Agenda | DevFest Roma",
  description: "Browse the DevFest Roma schedule with filters and search."
};

export default function AgendaPage() {
  return (
    <main>
      <AgendaPageContent />
    </main>
  );
}
