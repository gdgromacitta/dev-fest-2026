import { readFileSync } from "node:fs";
import path from "node:path";
import { decodePng } from "../../scripts/lib/png.mjs";
import {
  ACCENTS,
  ATLAS_1X,
  ATLAS_2X,
  CANVAS_BACKGROUND,
  buildAtlases,
} from "../../scripts/generate-rome-sprites.mjs";

const { atlas1, atlas2, frames } = buildAtlases();

function alphaAt(atlas: { width: number; data: Uint8Array }, x: number, y: number) {
  return atlas.data[(y * atlas.width + x) * 4 + 3];
}

function pixelAt(atlas: { width: number; data: Uint8Array }, x: number, y: number) {
  const i = (y * atlas.width + x) * 4;
  return Array.from(atlas.data.subarray(i, i + 4));
}

function luminance(hex: string) {
  const [r, g, b] = [1, 3, 5]
    .map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

describe("rome sprite atlases", () => {
  it("has the exact upstream atlas dimensions", () => {
    expect([atlas1.width, atlas1.height]).toEqual([1233, 68]);
    expect([atlas2.width, atlas2.height]).toEqual([2441, 130]);
    expect(ATLAS_1X).toEqual({ width: 1233, height: 68 });
    expect(ATLAS_2X).toEqual({ width: 2441, height: 130 });
  });

  it("keeps every non-transparent pixel inside a declared frame box", () => {
    for (const [atlas, key, scale] of [
      [atlas1, "at1", 1],
      [atlas2, "at2", 2],
    ] as const) {
      const covered = new Set<number>();
      for (const f of frames) {
        const at = f[key];
        for (let y = 0; y < f.h * scale; y += 1) {
          for (let x = 0; x < f.w * scale; x += 1) covered.add((at.y + y) * atlas.width + at.x + x);
        }
        // The frame's own art must fit its box exactly.
        expect([f.art.width, f.art.height]).toEqual([f.w, f.h]);
      }
      let stray = 0;
      for (let y = 0; y < atlas.height; y += 1) {
        for (let x = 0; x < atlas.width; x += 1) {
          if (alphaAt(atlas, x, y) > 0 && !covered.has(y * atlas.width + x)) stray += 1;
        }
      }
      expect(stray).toBe(0);
    }
  });

  it("draws every frame with some art", () => {
    for (const f of frames) {
      let opaque = 0;
      for (let y = 0; y < f.h; y += 1) for (let x = 0; x < f.w; x += 1) if (alphaAt(atlas1, f.at1.x + x, f.at1.y + y)) opaque += 1;
      expect(opaque, f.name).toBeGreaterThan(0);
    }
  });

  it("makes each 2x pixel block equal its 1x source pixel", () => {
    for (const f of frames) {
      for (let y = 0; y < f.h; y += 1) {
        for (let x = 0; x < f.w; x += 1) {
          const source = pixelAt(atlas1, f.at1.x + x, f.at1.y + y);
          for (let j = 0; j < 2; j += 1) {
            for (let i = 0; i < 2; i += 1) {
              expect(pixelAt(atlas2, f.at2.x + 2 * x + i, f.at2.y + 2 * y + j)).toEqual(source);
            }
          }
        }
      }
    }
  });

  it("tiles the horizon seamlessly", () => {
    const horizon = frames.filter((f) => f.group === "HORIZON");
    expect(horizon).toHaveLength(2);
    for (const f of horizon) {
      for (let y = 0; y < f.h; y += 1) {
        expect(pixelAt(atlas1, f.at1.x + f.w - 1, f.at1.y + y)).toEqual(pixelAt(atlas1, f.at1.x, f.at1.y + y));
      }
    }
    // The whole 1200px strip too.
    const first = horizon[0].at1.x;
    const last = horizon[1].at1.x + horizon[1].w - 1;
    for (let y = 0; y < 12; y += 1) {
      expect(pixelAt(atlas1, last, horizon[0].at1.y + y)).toEqual(pixelAt(atlas1, first, horizon[0].at1.y + y));
    }
  });

  it("keeps every accent colour at 3:1 or better against the canvas background", () => {
    const bg = luminance(CANVAS_BACKGROUND);
    for (const [name, hex] of Object.entries(ACCENTS) as [string, string][]) {
      const ratio = (bg + 0.05) / (luminance(hex) + 0.05);
      expect(ratio, name).toBeGreaterThanOrEqual(3);
    }
  });

  it("matches the committed PNGs (generator is deterministic)", () => {
    const root = path.resolve(__dirname, "../..");
    const one = decodePng(readFileSync(path.join(root, "public/game/images/default_100_percent/100-offline-sprite.png")));
    const two = decodePng(readFileSync(path.join(root, "public/game/images/default_200_percent/200-offline-sprite.png")));
    expect(Buffer.from(one.data).equals(Buffer.from(atlas1.data))).toBe(true);
    expect(Buffer.from(two.data).equals(Buffer.from(atlas2.data))).toBe(true);
  });
});
