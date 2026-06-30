import type { Metadata } from "next";
import { venue } from "@/src/content/venue";

export const metadata: Metadata = {
  title: "Venue | DevFest Roma",
  description: "Find venue details, map, transport, and accessibility information for DevFest Roma 2026."
};

export default function VenuePage() {
  return (
    <main className="rounded-[2.5rem] bg-[#f3f4f6]">
      <div className="mx-auto max-w-6xl space-y-8 px-4 py-6 md:px-6">
        <section className="space-y-4">
          <h1 className="m-0 text-[3.5rem] font-semibold leading-[1.02] tracking-[-0.05em] text-slate-950">Venue &amp; Location</h1>
          <p className="m-0 max-w-3xl text-xl leading-8 text-slate-500">
            Join us at the heart of innovation for DevFest Roma. Find all the details you need to reach the venue and navigate the
            space comfortably.
          </p>
        </section>

        <section
          aria-label="Map area"
          className="overflow-hidden rounded-[2.5rem] border border-slate-200"
        >
          <iframe
            src={venue.mapEmbedUrl}
            className="h-[20rem] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="DevFest Roma 2026 — Università degli Studi Roma Tre"
            allowFullScreen
          />
        </section>

        <section className="grid gap-8 md:grid-cols-[1fr_1fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="text-[#4d8cff]">•</span>
              <span>Venue Address</span>
            </div>
            <div className="rounded-[2.5rem] bg-white p-6 shadow-[0_1px_0_rgba(15,23,42,0.05)]">
              <div className="space-y-3">
                <h2 className="m-0 text-[2rem] font-semibold leading-tight tracking-[-0.04em] text-slate-900">{venue.name}</h2>
                <p className="m-0 text-lg leading-8 text-slate-500">
                  {venue.address}
                  <br />
                  {venue.city}
                </p>
              </div>
              <a
                href={venue.mapsLinkUrl}
                target="_blank"
                rel="noreferrer"
                className="focus-ring mt-6 inline-flex rounded-xl bg-[#eef4ff] px-5 py-3 text-sm font-semibold text-[#4d8cff]"
              >
                Open in Google Maps
              </a>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[2.5rem] border border-slate-200 bg-[#f5f6f8] p-5">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Date</p>
                <p className="mt-3 mb-0 text-lg font-semibold text-slate-800">{venue.notes[0]}</p>
              </div>
              <div className="rounded-[2.5rem] border border-slate-200 bg-[#f5f6f8] p-5">
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Time</p>
                <p className="mt-3 mb-0 text-lg font-semibold text-slate-800">{venue.notes[1]}</p>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <div className="flex items-center gap-3 text-lg font-semibold text-slate-900">
              <span className="text-[#4d8cff]">•</span>
              <span>How to get here</span>
            </div>
            <div className="space-y-6">
              <article className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4ff] text-[#4d8cff]">T</div>
                <div className="space-y-2">
                  <h3 className="m-0 text-xl font-semibold text-slate-900">Public Transport</h3>
                  <p className="m-0 text-lg leading-8 text-slate-500">{venue.directions[0]}</p>
                </div>
              </article>
              <article className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4ff] text-[#4d8cff]">P</div>
                <div className="space-y-2">
                  <h3 className="m-0 text-xl font-semibold text-slate-900">Parking &amp; Driving</h3>
                  <p className="m-0 text-lg leading-8 text-slate-500">{venue.directions[1]}</p>
                </div>
              </article>
              <article className="grid grid-cols-[3rem_minmax(0,1fr)] gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4ff] text-[#4d8cff]">A</div>
                <div className="space-y-2">
                  <h3 className="m-0 text-xl font-semibold text-slate-900">Accessibility</h3>
                  <p className="m-0 text-lg leading-8 text-slate-500">{venue.accessibilityInfo.join(" ")}</p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
