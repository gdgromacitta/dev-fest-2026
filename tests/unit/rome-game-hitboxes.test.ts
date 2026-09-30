import { readFileSync } from "node:fs";
import path from "node:path";
import { decodePng } from "../../scripts/lib/png.mjs";
import { buildFrames } from "../../scripts/generate-rome-sprites.mjs";
import { spriteDefinitionByType } from "../../public/game/offline-sprite-definitions.js";

type Box = { x: number; y: number; width: number; height: number };

const atlas = decodePng(
  readFileSync(path.join(process.cwd(), "public/game/images/default_100_percent/100-offline-sprite.png")),
);

const original = spriteDefinitionByType.original;
const frames = buildFrames();

// Where each frame group starts in the 1x atlas (LDPI origins used by the game).
const groupOrigin: Record<string, { x: number; y: number }> = {
  TREX: original.LDPI.TREX,
  CACTUS_SMALL: original.LDPI.CACTUS_SMALL,
  CACTUS_LARGE: original.LDPI.CACTUS_LARGE,
  PTERODACTYL: original.LDPI.PTERODACTYL,
};

function frameOrigin(name: string) {
  const f = frames.find((frame) => frame.name === name);
  if (!f) throw new Error(`unknown frame ${name}`);
  const origin = groupOrigin[f.group];
  return { x: origin.x + f.x, y: origin.y + f.y, w: f.w, h: f.h };
}

/** Bounding box of the opaque pixels of one frame in the generated 1x atlas, in frame coordinates. */
function opaqueBounds(name: string) {
  const { x: ox, y: oy, w, h } = frameOrigin(name);
  let minX = w;
  let minY = h;
  let maxX = -1;
  let maxY = -1;
  for (let y = 0; y < h; y += 1) {
    for (let x = 0; x < w; x += 1) {
      if (atlas.data[((oy + y) * atlas.width + ox + x) * 4 + 3] > 0) {
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }
  return { minX, minY, maxX, maxY };
}

function opaqueCount(name: string, box: { x0: number; y0: number; x1: number; y1: number }) {
  const { x: ox, y: oy } = frameOrigin(name);
  let count = 0;
  for (let y = box.y0; y <= box.y1; y += 1) {
    for (let x = box.x0; x <= box.x1; x += 1) {
      if (atlas.data[((oy + y) * atlas.width + ox + x) * 4 + 3] > 0) count += 1;
    }
  }
  return count;
}

/**
 * checkForCollision positions a box relative to the sprite box, which is inset
 * by 1px, so the first pixel a box covers is (x + 1, y + 1).
 */
function pixelSpan(box: Box) {
  return { x0: box.x + 1, y0: box.y + 1, x1: box.x + box.width, y1: box.y + box.height };
}

const obstacle = (type: string) => {
  const found = original.OBSTACLES.find((o: { type: string }) => o.type === type);
  if (!found) throw new Error(`unknown obstacle ${type}`);
  return found;
};

const cases: { label: string; frame: string; boxes: Box[] }[] = [
  ...["WAITING_2_JUMPING", "WAITING_1", "RUNNING_1", "RUNNING_2"].map((frame) => ({
    label: `runner standing (${frame})`,
    frame,
    boxes: original.TREX.COLLISION_BOXES,
  })),
  ...["DUCKING_1", "DUCKING_2"].map((frame) => ({
    label: `runner ducking (${frame})`,
    frame,
    boxes: original.TREX.DUCKING_COLLISION_BOXES,
  })),
  { label: "small obstacle (column)", frame: "COLUMN_1_0", boxes: obstacle("CACTUS_SMALL").collisionBoxes },
  { label: "large obstacle (amphorae)", frame: "AMPHORAE_1_0", boxes: obstacle("CACTUS_LARGE").collisionBoxes },
  { label: "eagle, wings up", frame: "EAGLE_WINGS_UP", boxes: obstacle("PTERODACTYL").collisionBoxes },
  { label: "eagle, wings down", frame: "EAGLE_WINGS_DOWN", boxes: obstacle("PTERODACTYL").collisionBoxes },
];

describe("game collision boxes", () => {
  it("has boxes for every case", () => {
    for (const c of cases) expect(c.boxes.length).toBeGreaterThan(0);
  });

  for (const { label, frame, boxes } of cases) {
    it(`keeps every ${label} box inside the opaque pixels of its frame`, () => {
      const bounds = opaqueBounds(frame);
      expect(bounds.maxX).toBeGreaterThanOrEqual(0);
      boxes.forEach((box) => {
        const span = pixelSpan(box);
        expect(span.x0).toBeGreaterThanOrEqual(bounds.minX);
        expect(span.y0).toBeGreaterThanOrEqual(bounds.minY);
        expect(span.x1).toBeLessThanOrEqual(bounds.maxX);
        expect(span.y1).toBeLessThanOrEqual(bounds.maxY);
        // A box over empty pixels would be a phantom hitbox.
        expect(opaqueCount(frame, span)).toBeGreaterThan(0);
      });
    });
  }

  it("points the restart button at the icon in the atlas", () => {
    for (const dpi of ["LDPI", "HDPI"] as const) {
      expect(original[dpi].RESTART).toEqual({ x: 2, y: 2 });
    }
    const restart = { x0: 0, y0: 0, x1: 35, y1: 31 };
    const at = original.LDPI.RESTART;
    let opaque = 0;
    for (let y = restart.y0; y <= restart.y1; y += 1) {
      for (let x = restart.x0; x <= restart.x1; x += 1) {
        if (atlas.data[((at.y + y) * atlas.width + at.x + x) * 4 + 3] > 0) opaque += 1;
      }
    }
    expect(opaque).toBeGreaterThan(0);
  });
});
