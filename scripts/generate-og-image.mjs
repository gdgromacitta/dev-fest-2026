#!/usr/bin/env node
// Renders the social share card to public/og.png.
//
// Why a script and not `app/opengraph-image.tsx`: the Next metadata file
// convention serves the image from an extensionless route (`/opengraph-image`).
// Under `output: "export"` that becomes a file literally named
// `out/opengraph-image`, and GitHub Pages serves extensionless files as
// `application/octet-stream` (verified against devfest2026.gdgromacitta.it).
// Facebook/WhatsApp/X fetch og:image and check Content-Type, so an
// octet-stream response is dropped and no preview renders. A real `.png` in
// public/ is served as `image/png` and works everywhere.
//
// Regenerate with `npm run generate:og` after changing the design, and commit
// the resulting public/og.png — the build reads the committed file rather than
// rendering at build time, so a broken render can never take the site down.

import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
// `next/og.js`, not `next/og`: the bare specifier is only resolvable inside
// the Next build, not from a plain node process.
import { ImageResponse } from "next/og.js";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const SIZE = { width: 1200, height: 630 };

const h = (type, props, ...children) => ({
  type,
  props: { ...props, ...(children.length ? { children: children.length === 1 ? children[0] : children } : {}) }
});

function card(logoBase64) {
  return h(
    "div",
    {
      style: {
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
      }
    },
    h("img", {
      alt: "",
      src: `data:image/svg+xml;base64,${logoBase64}`,
      style: { height: 124, objectFit: "contain", width: 967 }
    }),
    h(
      "div",
      {
        style: {
          alignItems: "center",
          bottom: 68,
          display: "flex",
          fontSize: 28,
          fontWeight: 700,
          justifyContent: "space-between",
          left: 76,
          position: "absolute",
          right: 76
        }
      },
      h("div", { style: { display: "flex" } }, "10 OTTOBRE 2026"),
      h("div", { style: { color: "#5f6368", display: "flex" } }, "ROMA, ITALIA")
    )
  );
}

const logo = await readFile(path.join(ROOT, "public/logos/devfest-roma-horizontal.svg"), "base64");
const png = Buffer.from(await new ImageResponse(card(logo), SIZE).arrayBuffer());

if (png.subarray(1, 4).toString() !== "PNG") {
  throw new Error("render did not produce a PNG");
}

await writeFile(path.join(ROOT, "public/og.png"), png);
console.log(`[generate-og-image] wrote public/og.png (${SIZE.width}x${SIZE.height}, ${png.length} bytes)`);
