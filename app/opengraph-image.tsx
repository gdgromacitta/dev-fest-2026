import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "DevFest Roma 2026 — 10 ottobre 2026, Roma";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const logo = await readFile(join(process.cwd(), "public/logos/devfest-roma-horizontal.svg"), "base64");

  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#f7f9fc",
        color: "#202124",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "center",
        padding: "68px 76px",
        position: "relative",
        width: "100%"
      }}
    >
      <img
        alt=""
        src={`data:image/svg+xml;base64,${logo}`}
        style={{ height: 124, objectFit: "contain", width: 967 }}
      />

      <div
        style={{
          alignItems: "center",
          bottom: 68,
          display: "flex",
          fontSize: 28,
          fontWeight: 700,
          justifyContent: "space-between",
          left: 76,
          position: "absolute",
          right: 76
        }}
      >
        <div style={{ display: "flex" }}>10 OTTOBRE 2026</div>
        <div style={{ color: "#5f6368", display: "flex" }}>ROMA, ITALIA</div>
      </div>
    </div>,
    size
  );
}
