import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { features } from "@/src/content/features";
import { AgendaPageContent } from "@/src/components/agenda/agenda-page-content";

export const metadata: Metadata = {
  title: "Agenda | DevFest Roma",
  description: "The DevFest Roma 2026 schedule — browse sessions by room, track, and level."
};

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AgendaPage({ params }: Props) {
  if (!features.agenda) notFound();
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main>
      <AgendaPageContent />
    </main>
  );
}
