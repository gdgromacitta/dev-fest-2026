import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "DevFest Roma 2026 — 10 ottobre 2026, Roma";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "stretch",
        background: "#f7f9fc",
        color: "#202124",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: "68px 76px",
        position: "relative",
        width: "100%"
      }}
    >
      <div style={{ display: "flex", gap: 12 }}>
        {[
          ["#4285f4", 156],
          ["#ea4335", 92],
          ["#f9ab00", 128],
          ["#34a853", 72]
        ].map(([color, width]) => (
          <div key={color} style={{ background: color, borderRadius: 8, height: 14, width }} />
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ color: "#5f6368", display: "flex", fontSize: 26, fontWeight: 700, letterSpacing: 3 }}>
          GDG ROMA CITTÀ
        </div>
        <div style={{ display: "flex", fontSize: 88, fontWeight: 800, letterSpacing: -4, marginTop: 18 }}>
          DevFest Roma
        </div>
        <div style={{ color: "#4285f4", display: "flex", fontSize: 112, fontWeight: 800, letterSpacing: -5 }}>
          2026
        </div>
      </div>

      <div style={{ alignItems: "center", display: "flex", fontSize: 28, fontWeight: 700, justifyContent: "space-between" }}>
        <div style={{ display: "flex" }}>10 OTTOBRE 2026</div>
        <div style={{ color: "#5f6368", display: "flex" }}>ROMA, ITALIA</div>
      </div>
    </div>,
    size
  );
}
