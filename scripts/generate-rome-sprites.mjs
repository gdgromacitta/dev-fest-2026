#!/usr/bin/env node
// Generates the Rome-themed sprite atlases for the 404 runner game.
//
//   npm run generate:sprites
//
// Writes (all deterministic, byte-identical between runs):
//   public/game/images/default_100_percent/100-offline-sprite.png  1233x68
//   public/game/images/default_200_percent/200-offline-sprite.png  2441x130
//   public/game/sprite-preview.png  every frame at 4x, on a checkerboard
//
// FRAME LAYOUT. The game draws every sprite from one atlas per density. Each
// group's origin and each frame's size are fixed by upstream
// https://github.com/devfolioco/t-rex-runner-game/blob/5c438cf67ce26ea4ef355545c5d1d700067b9863/resources/dino_game/offline-sprite-definitions.js
// (`spriteDefinitionByType.original`, LDPI and HDPI), plus the per-frame sizes
// in trex.js, obstacle.js, cloud.js, night_mode.js, distance_meter.js,
// game_over_panel.js and horizon_line.js at the same SHA. The game reads a
// frame at HDPI origin + 2 * (local offset), so the 2x atlas is the 1x art
// scaled 2x per group, NOT one uniform 2x of the whole sheet (the group
// origins differ slightly, which is why the 2x atlas is 2441 wide, not 2466).
//
// DEVIATION to flag for the wiring issue: upstream lists RESTART at LDPI
// (2, 68) / HDPI (2, 130) with an 8-frame spin animation, but its own atlas is
// only 68/130 px tall, so that rectangle is outside the image. The atlas
// really has the single restart icon at (2, 2), so that is where it is
// drawn here (36x32 at 1x, 72x64 at 2x). The wiring issue should point the
// game's RESTART sprite position at (2, 2).
//
// ART. Everything here is original pixel art drawn from code; none of Google's
// T-Rex / cactus / pterodactyl artwork is used. Only TEXT_SPRITE (digits and
// "GAME OVER") is reproduced as-is from an embedded bitmap, as the issue asks.
//
// PALETTE. Google brand colours as accents, plus neutrals. Accents must reach
// 3:1 contrast against the game canvas #f7f7f7 (checked in the unit test):
//   blue   #4285F4 Google blue   (3.33:1)  tunic
//   red    #EA4335 Google red    (3.66:1)  crest, shield
//   yellow #B98300 darkened      (3.11:1)  shield boss / belt / eagle. Pure
//                                          #FBBC05 is only 1.6:1, so it is
//                                          darkened to a brand-derived gold.
//   green  #1E8E3E darkened      (3.93:1)  ivy. Pure #34A853 is 2.85:1.
//   terracotta #C0562F           (4.25:1)  amphorae (red/yellow blend)
// Neutrals: outline #535353 (upstream's grey), steel, marble, skin, sandal.
// It is unverified whether GDG/Google brand guidelines allow brand colours on
// custom artwork; that question is raised in the PR.

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { encodePng } from "./lib/png.mjs";
import { TEXT_SPRITE_ROWS } from "./lib/text-sprite-bitmap.mjs";

export const CANVAS_BACKGROUND = "#f7f7f7";

export const ACCENTS = {
  blue: "#4285F4",
  red: "#EA4335",
  gold: "#B98300",
  green: "#1E8E3E",
  terracotta: "#C0562F",
};

export const NEUTRALS = {
  outline: "#535353",
  steel: "#9aa1a8",
  steelDark: "#6f767d",
  skin: "#e0aa84",
  skinShade: "#c48a63",
  sandal: "#7a5230",
  marble: "#dcdcdf",
  marbleShade: "#b6b7bd",
  cream: "#f1e8d0",
  cloud: "#e4e4e4",
  cloudEdge: "#c8c8c8",
  moon: "#d6d6d6",
  ground: "#535353",
  arcade: "#cfcfcf",
  arcadeShade: "#bdbdbd",
};

const C = { ...ACCENTS, ...NEUTRALS };

// ---------------------------------------------------------------------------
// Tiny raster toolkit

function hexToRgba(hex) {
  return [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)).concat(255);
}

class Grid {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.data = new Uint8Array(width * height * 4);
  }

  get(x, y) {
    const i = (y * this.width + x) * 4;
    return this.data.subarray(i, i + 4);
  }

  isSet(x, y) {
    return x >= 0 && y >= 0 && x < this.width && y < this.height && this.data[(y * this.width + x) * 4 + 3] > 0;
  }

  px(x, y, color) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) return;
    this.data.set(hexToRgba(color), (y * this.width + x) * 4);
  }

  rect(x, y, w, h, color) {
    for (let j = 0; j < h; j += 1) for (let i = 0; i < w; i += 1) this.px(x + i, y + j, color);
  }

  ellipse(cx, cy, rx, ry, color) {
    for (let y = Math.floor(cy - ry); y <= Math.ceil(cy + ry); y += 1) {
      for (let x = Math.floor(cx - rx); x <= Math.ceil(cx + rx); x += 1) {
        const dx = (x + 0.5 - cx) / rx;
        const dy = (y + 0.5 - cy) / ry;
        if (dx * dx + dy * dy <= 1) this.px(x, y, color);
      }
    }
  }

  // Even-odd scanline polygon fill, sampled at pixel centres.
  poly(points, color) {
    const ys = points.map((p) => p[1]);
    for (let y = Math.floor(Math.min(...ys)); y <= Math.ceil(Math.max(...ys)); y += 1) {
      const xs = [];
      for (let i = 0; i < points.length; i += 1) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[(i + 1) % points.length];
        const sy = y + 0.5;
        if ((y0 <= sy && y1 > sy) || (y1 <= sy && y0 > sy)) {
          xs.push(x0 + ((sy - y0) / (y1 - y0)) * (x1 - x0));
        }
      }
      xs.sort((a, b) => a - b);
      for (let k = 0; k + 1 < xs.length; k += 2) {
        for (let x = Math.round(xs[k]); x < Math.round(xs[k + 1]); x += 1) this.px(x, y, color);
      }
    }
  }

  // Thick line drawn by stamping t x t squares.
  line(x0, y0, x1, y1, t, color) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0), 1);
    for (let s = 0; s <= steps; s += 1) {
      const x = Math.round(x0 + ((x1 - x0) * s) / steps);
      const y = Math.round(y0 + ((y1 - y0) * s) / steps);
      this.rect(x - Math.floor(t / 2), y - Math.floor(t / 2), t, t, color);
    }
  }

  // Adds a 1px outline on transparent pixels 4-adjacent to a filled pixel.
  outline(color) {
    const add = [];
    for (let y = 0; y < this.height; y += 1) {
      for (let x = 0; x < this.width; x += 1) {
        if (this.isSet(x, y)) continue;
        if (this.isSet(x - 1, y) || this.isSet(x + 1, y) || this.isSet(x, y - 1) || this.isSet(x, y + 1)) {
          add.push([x, y]);
        }
      }
    }
    for (const [x, y] of add) this.px(x, y, color);
  }

  blit(src, dx, dy) {
    for (let y = 0; y < src.height; y += 1) {
      for (let x = 0; x < src.width; x += 1) {
        const p = src.get(x, y);
        if (p[3] === 0) continue;
        const tx = dx + x;
        const ty = dy + y;
        if (tx < 0 || ty < 0 || tx >= this.width || ty >= this.height) continue;
        this.data.set(p, (ty * this.width + tx) * 4);
      }
    }
  }
}

// ---------------------------------------------------------------------------
// Legionary (TREX group). 44x47 running/standing frames, 59x47 ducking frames
// whose art sits in the bottom 25 rows (upstream's HEIGHT_DUCK).

function drawLegs(g, pose) {
  const leg = (hx, hy, kx, ky, fx, fy, back) => {
    const skin = back ? C.skinShade : C.skin;
    g.line(hx, hy, kx, ky, 3, skin);
    g.line(kx, ky, fx, fy, 3, skin);
    // Sandal
    g.rect(fx - 1, fy + 1, 5, 2, C.sandal);
  };
  if (pose === "stand") {
    leg(17, 32, 17, 38, 17, 42, true);
    leg(23, 32, 23, 38, 23, 42, false);
  } else if (pose === "runA") {
    leg(17, 32, 13, 38, 10, 42, true); // back leg planted behind
    leg(22, 32, 27, 36, 30, 40, false); // front leg reaching forward, lifted
  } else if (pose === "runB") {
    leg(17, 32, 12, 35, 9, 39, true); // back leg kicked up
    leg(23, 32, 24, 38, 25, 42, false); // front leg planted
  } else if (pose === "crash") {
    leg(16, 32, 13, 38, 10, 42, true);
    leg(24, 32, 28, 38, 31, 42, false);
  }
}

function legionaryBody(g, { eye, crest }) {
  const cy = crest === "low" ? 1 : 0;
  // Red crest (transverse plume) and its tail
  g.rect(15, 1 + cy, 14, 3, C.red);
  g.poly([[15, 2 + cy], [10, 5 + cy], [10, 10], [13, 8], [15, 6]], C.red);
  // Helmet dome, neck guard, cheek plate
  g.rect(16, 4 + cy, 13, 5 - cy, C.steel);
  g.rect(14, 8, 3, 4, C.steel);
  g.rect(21, 9, 3, 5, C.steel);
  g.rect(16, 8, 5, 1, C.steelDark);
  // Face
  g.rect(24, 9, 6, 6, C.skin);
  g.px(30, 12, C.skin);
  // Neck
  g.rect(20, 14, 4, 3, C.skin);
  // Torso: segmented steel armour + blue tunic skirt
  g.rect(14, 16, 12, 10, C.steel);
  for (const y of [18, 20, 22, 24]) g.rect(14, y, 12, 1, C.steelDark);
  g.rect(14, 26, 14, 6, C.blue);
  g.rect(14, 26, 14, 1, C.gold); // belt
  g.rect(20, 26, 2, 1, C.cream);
  for (const x of [17, 20, 23, 26]) g.rect(x, 28, 1, 4, C.steelDark); // pteruges gaps
  // Gladius on the hip
  g.line(12, 27, 10, 33, 2, C.steel);
  g.rect(11, 25, 3, 2, C.gold);
  // Forearm reaching the shield
  g.rect(21, 19, 6, 3, C.skin);
  // Scutum: gold rim, red field, gold boss
  g.rect(26, 15, 11, 19, C.gold);
  g.rect(27, 16, 9, 17, C.red);
  g.ellipse(31.5, 24.5, 2.5, 2.5, C.gold);
  g.px(31, 24, C.cream);
  // Eye
  if (eye === "open") g.rect(27, 10, 2, 2, C.outline);
  else if (eye === "blink") g.rect(26, 11, 3, 1, C.outline);
  else if (eye === "x") {
    g.px(26, 10, C.outline); g.px(28, 10, C.outline); g.px(27, 11, C.outline);
    g.px(26, 12, C.outline); g.px(28, 12, C.outline);
    g.rect(27, 14, 3, 1, C.outline); // open mouth
  }
}

function legionary({ legs, eye, crest = "high" }) {
  const g = new Grid(44, 47);
  drawLegs(g, legs);
  legionaryBody(g, { eye, crest });
  g.outline(C.outline);
  return g;
}

function legionaryDuck(legPhase) {
  const g = new Grid(59, 47);
  // Legs (drawn first, they tuck under the torso)
  const leg = (hx, hy, kx, ky, fx, fy, shade) => {
    g.line(hx, hy, kx, ky, 3, shade ? C.skinShade : C.skin);
    g.line(kx, ky, fx, fy, 3, shade ? C.skinShade : C.skin);
    g.rect(fx - 1, fy + 1, 5, 2, C.sandal);
  };
  if (legPhase === 0) {
    leg(20, 38, 15, 41, 12, 43, true);
    leg(34, 38, 39, 40, 42, 42, false);
  } else {
    leg(20, 38, 22, 42, 22, 43, true);
    leg(34, 38, 32, 41, 30, 43, false);
  }
  // Red cloak streaming behind
  g.poly([[13, 29], [3, 33], [1, 38], [10, 38], [14, 37]], C.red);
  // Torso: steel armour on top of a blue tunic
  g.rect(12, 30, 28, 5, C.steel);
  for (const x of [16, 20, 24, 28, 32, 36]) g.rect(x, 30, 1, 5, C.steelDark);
  g.rect(12, 35, 26, 4, C.blue);
  g.rect(12, 35, 26, 1, C.gold);
  // Shield slung on the back (clipeus): fits here, unlike a front scutum
  g.ellipse(19, 32, 5, 5, C.gold);
  g.ellipse(19, 32, 4, 4, C.red);
  g.ellipse(19, 32, 1.5, 1.5, C.gold);
  // Head thrust forward: crest, helmet, face
  g.rect(40, 23, 12, 3, C.red);
  g.poly([[40, 24], [36, 26], [36, 31], [39, 29], [40, 28]], C.red);
  g.rect(40, 26, 11, 4, C.steel);
  g.rect(38, 29, 3, 3, C.steel);
  g.rect(46, 30, 6, 5, C.skin);
  g.px(52, 32, C.skin);
  g.rect(48, 30, 2, 2, C.outline);
  g.rect(40, 31, 6, 4, C.steel);
  g.rect(38, 33, 3, 3, C.skin); // neck
  g.outline(C.outline);
  return g;
}

// ---------------------------------------------------------------------------
// Obstacles

function brokenColumn() {
  const g = new Grid(17, 35);
  // Base plinth and torus
  g.rect(1, 31, 15, 3, C.marble);
  g.rect(2, 29, 13, 2, C.marbleShade);
  // Fluted shaft: light body, darker flutes every third column
  g.rect(3, 11, 11, 18, C.marble);
  for (const x of [5, 8, 11]) g.rect(x, 11, 1, 18, C.marbleShade);
  // Jagged, slanted break at the top
  g.poly([[3, 11], [3, 8], [5, 6], [6, 8], [8, 3], [10, 6], [11, 2], [13, 5], [14, 8], [14, 11]], C.marble);
  for (const x of [5, 8, 11]) {
    const top = x === 5 ? 8 : x === 8 ? 5 : 5;
    g.rect(x, top, 1, 11 - top, C.marbleShade);
  }
  // Shadow side
  g.rect(13, 11, 1, 18, C.marbleShade);
  // Ivy creeping up the shaft
  for (const [x, y] of [[3, 27], [4, 26], [4, 24], [5, 23], [4, 21], [3, 20], [3, 18], [4, 17]]) g.px(x, y, C.green);
  g.rect(2, 27, 2, 2, C.green);
  g.px(5, 22, C.green);
  g.outline(C.outline);
  return g;
}

function amphora(g, cx, top, height, width) {
  const bodyTop = top + Math.round(height * 0.25);
  const bodyH = Math.round(height * 0.6);
  const rx = width / 2;
  // Tapering foot first, so the belly overlaps it
  g.poly([[cx - 3, bodyTop + bodyH - 3], [cx + 3, bodyTop + bodyH - 3], [cx + 1, top + height], [cx - 1, top + height]], C.terracotta);
  // Neck, lip and single-pixel handles
  g.rect(cx - 1, top + 2, 3, bodyTop - top + 2, C.terracotta);
  g.rect(cx - 2, top, 5, 2, C.gold);
  g.rect(cx - 3, top + 3, 1, 5, C.terracotta);
  g.rect(cx + 3, top + 3, 1, 5, C.terracotta);
  // Belly
  g.ellipse(cx + 0.5, bodyTop + bodyH / 2 - 1, rx, bodyH / 2, C.terracotta);
  // Decorative band
  g.rect(Math.round(cx - rx + 1), bodyTop + Math.round(bodyH * 0.3), Math.round(width - 1), 2, C.gold);
}

function amphoraStack() {
  const g = new Grid(25, 50);
  // Back amphora: tallest, in the middle
  amphora(g, 12, 1, 44, 10);
  g.outline(C.outline);
  // Two front amphorae, drawn on top with their own outline
  const front = new Grid(25, 50);
  amphora(front, 6, 14, 36, 11);
  front.outline(C.outline);
  g.blit(front, 0, 0);
  const front2 = new Grid(25, 50);
  amphora(front2, 19, 14, 36, 11);
  front2.outline(C.outline);
  g.blit(front2, 0, 0);
  return g;
}

function eagle(wingsUp) {
  const g = new Grid(46, 40);
  // Feathered wing, fingers pointing away from the body
  const up = [[22, 18], [20, 9], [22, 3], [25, 9], [27, 1], [30, 8], [33, 3], [35, 10], [39, 6], [36, 19]];
  const wing = wingsUp ? up : up.map(([x, y]) => [x, 40 - y]);
  // Tail feathers
  g.poly([[35, 19], [45, 17], [45, 26], [36, 25]], C.gold);
  g.rect(39, 19, 6, 1, C.outline);
  g.rect(38, 22, 7, 1, C.outline);
  // Talons
  g.rect(23, 26, 2, 5, C.gold);
  g.rect(29, 26, 2, 5, C.gold);
  g.rect(21, 31, 4, 1, C.outline);
  g.rect(28, 31, 4, 1, C.outline);
  // Body and head
  g.ellipse(27, 21, 10, 5.5, C.gold);
  g.ellipse(13, 15, 5, 5, C.cream);
  g.rect(15, 15, 6, 6, C.gold);
  // Hooked beak, eye
  g.poly([[8, 13], [2, 15], [2, 19], [4, 18], [8, 17]], C.gold);
  g.px(3, 19, C.outline);
  g.rect(10, 12, 2, 2, C.outline);
  // Wing on top of the body, with a shaded lower edge
  g.poly(wing, C.gold);
  g.rect(24, wingsUp ? 14 : 24, 11, 1, C.outline);
  g.outline(C.outline);
  return g;
}

// ---------------------------------------------------------------------------
// Neutral scenery

function cloud() {
  const g = new Grid(46, 14);
  g.ellipse(10, 9, 8, 4, C.cloud);
  g.ellipse(20, 6, 8, 5, C.cloud);
  g.ellipse(31, 7, 9, 5, C.cloud);
  g.ellipse(38, 9, 7, 4, C.cloud);
  g.rect(8, 8, 30, 5, C.cloud);
  g.outline(C.cloudEdge);
  return g;
}

// Moon phases: 20x40 half-moons (waxing at x=100..140, waning at x=0..40) and a
// 40x40 full moon at x=60, as upstream's NightMode.phases expect.
function moonPhase(kind, terminator) {
  const width = kind === "full" ? 40 : 20;
  const g = new Grid(width, 40);
  const cx = kind === "full" ? 20 : kind === "left" ? 20 : 0;
  for (let y = 0; y < 40; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const dx = x + 0.5 - cx;
      const dy = y + 0.5 - 20;
      if (dx * dx + dy * dy > 19.5 * 19.5) continue;
      if (kind !== "full" && terminator > 0 && (dx / terminator) ** 2 + (dy / 20) ** 2 < 1) continue;
      g.px(x, y, C.moon);
    }
  }
  return g;
}

function star() {
  const g = new Grid(9, 18);
  for (const oy of [0, 9]) {
    g.rect(4, oy + 1, 1, 7, C.moon);
    g.rect(1, oy + 4, 7, 1, C.moon);
    g.rect(3, oy + 3, 3, 3, C.moon);
  }
  return g;
}

function restartIcon() {
  const g = new Grid(36, 32);
  // Circular arrow: ring with a gap at the upper right and an arrow head.
  for (let y = 0; y < 32; y += 1) {
    for (let x = 0; x < 36; x += 1) {
      const dx = x + 0.5 - 18;
      const dy = y + 0.5 - 16;
      const r = Math.hypot(dx, dy);
      const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
      const inGap = angle > -70 && angle < -15;
      if (r <= 12.5 && r >= 8 && !inGap) g.px(x, y, C.outline);
    }
  }
  g.poly([[19, 1], [31, 4], [23, 13]], C.outline);
  return g;
}

function textSprite() {
  const g = new Grid(191, 24);
  TEXT_SPRITE_ROWS.forEach((row, y) => {
    for (let x = 0; x < row.length; x += 1) if (row[x] === "#") g.px(x, y, C.ground);
  });
  return g;
}

// HORIZON: two 600px segments (the game picks either at random, so each must
// start and end on the same column). Ground line on top, a shallow arcade
// (Colosseum tiers / aqueduct arches) in low-contrast grey beneath it.
function horizonSegment(kind) {
  const W = 600;
  const g = new Grid(W, 12);
  const pitch = kind === "colosseum" ? 12 : 20;
  const pier = 3; // same in both, so the two segments also join each other
  const archTop = kind === "colosseum" ? 4 : 3;
  for (let x = 0; x < W; x += 1) {
    g.px(x, 0, C.ground);
    g.px(x, 1, C.arcade);
    const p = x % pitch;
    const isPier = p < pier;
    for (let y = 2; y < 12; y += 1) {
      if (isPier) g.px(x, y, C.arcade);
      else if (kind === "colosseum") {
        // Two tiers of arches; arch heads are rounded by trimming corners.
        const upper = y >= 2 && y <= 5;
        const lower = y >= 7 && y <= 11;
        const corner = (p === pier || p === pitch - 1) && (y === 2 || y === 7);
        if (!(upper || lower) || corner) g.px(x, y, C.arcade);
        else if (y === 4 && (p === pier || p === pitch - 1)) g.px(x, y, C.arcadeShade);
      } else {
        const rounded = (p === pier || p === pitch - 1) && y === archTop + 1;
        if (y < archTop + (rounded ? 1 : 0)) g.px(x, y, C.arcade);
        else if (y === 11) g.px(x, y, C.arcadeShade);
      }
    }
  }
  // Ledge line between the two Colosseum tiers
  if (kind === "colosseum") for (let x = pier; x < W; x += 1) if (x % pitch >= pier) g.px(x, 6, C.arcadeShade);
  // Seamless: last column mirrors the first (a pier column).
  for (let y = 0; y < 12; y += 1) {
    const first = g.get(0, y);
    g.data.set(first, (y * W + (W - 1)) * 4);
  }
  return g;
}

function horizonStrip() {
  const g = new Grid(1200, 12);
  g.blit(horizonSegment("colosseum"), 0, 0);
  g.blit(horizonSegment("aqueduct"), 600, 0);
  return g;
}

// ---------------------------------------------------------------------------
// Frame table. `local` is the offset inside the group in 1x pixels; the 1x
// atlas position is ldpi + local, the 2x atlas position is hdpi + 2 * local.

export const ATLAS_1X = { width: 1233, height: 68 };
export const ATLAS_2X = { width: 2441, height: 130 };

const GROUPS = {
  RESTART: { ldpi: [2, 2], hdpi: [2, 2] },
  CLOUD: { ldpi: [86, 2], hdpi: [166, 2] },
  PTERODACTYL: { ldpi: [134, 2], hdpi: [260, 2] },
  CACTUS_SMALL: { ldpi: [228, 2], hdpi: [446, 2] },
  CACTUS_LARGE: { ldpi: [332, 2], hdpi: [652, 2] },
  MOON: { ldpi: [484, 2], hdpi: [954, 2] },
  STAR: { ldpi: [645, 2], hdpi: [1276, 2] },
  TEXT_SPRITE: { ldpi: [655, 2], hdpi: [1294, 2] },
  TREX: { ldpi: [848, 2], hdpi: [1678, 2] },
  HORIZON: { ldpi: [2, 52], hdpi: [4, 104] },
};

const frame = (group, name, x, y, w, h, art, role) => ({ group, name, x, y, w, h, art, role });

/** All frames, in atlas-group order. Sizes are upstream's declared boxes. */
export function buildFrames() {
  const frames = [
    frame("RESTART", "RESTART", 0, 0, 36, 32, restartIcon(), "UI"),
    frame("CLOUD", "CLOUD", 0, 0, 46, 14, cloud(), "SCENERY"),
    frame("PTERODACTYL", "EAGLE_WINGS_UP", 0, 0, 46, 40, eagle(true), "EAGLE"),
    frame("PTERODACTYL", "EAGLE_WINGS_DOWN", 46, 0, 46, 40, eagle(false), "EAGLE"),
    // Multiple-obstacle strips: size 1 at 0, size 2 at w, size 3 at 3w (obstacle.js)
    ...[[0, 1], [17, 2], [51, 3]].flatMap(([ox, n]) =>
      Array.from({ length: n }, (_, i) =>
        frame("CACTUS_SMALL", `COLUMN_${n}_${i}`, ox + i * 17, 0, 17, 35, brokenColumn(), "COLUMN")),
    ),
    ...[[0, 1], [25, 2], [75, 3]].flatMap(([ox, n]) =>
      Array.from({ length: n }, (_, i) =>
        frame("CACTUS_LARGE", `AMPHORAE_${n}_${i}`, ox + i * 25, 0, 25, 50, amphoraStack(), "AMPHORAE")),
    ),
    frame("MOON", "MOON_PHASE_0", 0, 0, 20, 40, moonPhase("right", 16), "MOON"),
    frame("MOON", "MOON_PHASE_20", 20, 0, 20, 40, moonPhase("right", 8), "MOON"),
    frame("MOON", "MOON_PHASE_40", 40, 0, 20, 40, moonPhase("right", 0), "MOON"),
    frame("MOON", "MOON_FULL", 60, 0, 40, 40, moonPhase("full", 0), "MOON"),
    frame("MOON", "MOON_PHASE_100", 100, 0, 20, 40, moonPhase("left", 0), "MOON"),
    frame("MOON", "MOON_PHASE_120", 120, 0, 20, 40, moonPhase("left", 8), "MOON"),
    frame("MOON", "MOON_PHASE_140", 140, 0, 20, 40, moonPhase("left", 16), "MOON"),
    frame("STAR", "STAR", 0, 0, 9, 18, star(), "SCENERY"),
    frame("TEXT_SPRITE", "TEXT_SPRITE", 0, 0, 191, 24, textSprite(), "TEXT"),
    frame("TREX", "WAITING_2_JUMPING", 0, 0, 44, 47, legionary({ legs: "stand", eye: "open" }), "LEGIONARY"),
    frame("TREX", "WAITING_1", 44, 0, 44, 47, legionary({ legs: "stand", eye: "blink", crest: "low" }), "LEGIONARY"),
    frame("TREX", "RUNNING_1", 88, 0, 44, 47, legionary({ legs: "runA", eye: "open" }), "LEGIONARY"),
    frame("TREX", "RUNNING_2", 132, 0, 44, 47, legionary({ legs: "runB", eye: "open" }), "LEGIONARY"),
    frame("TREX", "CRASHED", 220, 0, 44, 47, legionary({ legs: "crash", eye: "x", crest: "low" }), "LEGIONARY"),
    frame("TREX", "DUCKING_1", 264, 0, 59, 47, legionaryDuck(0), "LEGIONARY"),
    frame("TREX", "DUCKING_2", 323, 0, 59, 47, legionaryDuck(1), "LEGIONARY"),
    frame("HORIZON", "HORIZON_COLOSSEUM", 0, 0, 600, 12, horizonStrip(), "HORIZON"),
  ];
  // The strip was drawn as one 1200x12 grid; split it into its two segments.
  const strip = frames.pop();
  for (const [name, ox] of [["HORIZON_COLOSSEUM", 0], ["HORIZON_AQUEDUCT", 600]]) {
    const seg = new Grid(600, 12);
    for (let y = 0; y < 12; y += 1) for (let x = 0; x < 600; x += 1) seg.data.set(strip.art.get(ox + x, y), (y * 600 + x) * 4);
    frames.push(frame("HORIZON", name, ox, 0, 600, 12, seg, "HORIZON"));
  }
  return frames;
}

// Obstacle strips contain the same single sprite repeated; the frame table
// above lists one entry per repeated cell so tests can check every box.

/**
 * Renders both atlases. Returns RGBA grids plus the frame list with the
 * position of each frame in each atlas.
 */
export function buildAtlases() {
  const frames = buildFrames();
  const atlas1 = new Grid(ATLAS_1X.width, ATLAS_1X.height);
  const atlas2 = new Grid(ATLAS_2X.width, ATLAS_2X.height);
  const placed = frames.map((f) => {
    const { ldpi, hdpi } = GROUPS[f.group];
    const at1 = { x: ldpi[0] + f.x, y: ldpi[1] + f.y };
    const at2 = { x: hdpi[0] + 2 * f.x, y: hdpi[1] + 2 * f.y };
    atlas1.blit(f.art, at1.x, at1.y);
    for (let y = 0; y < f.h; y += 1) {
      for (let x = 0; x < f.w; x += 1) {
        const p = f.art.get(x, y);
        if (p[3] === 0) continue;
        for (let j = 0; j < 2; j += 1) {
          for (let i = 0; i < 2; i += 1) atlas2.data.set(p, ((at2.y + 2 * y + j) * atlas2.width + at2.x + 2 * x + i) * 4);
        }
      }
    }
    return { ...f, at1, at2 };
  });
  return { atlas1, atlas2, frames: placed };
}

// ---------------------------------------------------------------------------
// Preview: every frame at 4x on a checkerboard, labelled with a 3x5 font.

const FONT = {
  A: "010101111101101", B: "110101110101110", C: "011100100100011", D: "110101101101110",
  E: "111100110100111", F: "111100110100100", G: "011100101101011", H: "101101111101101",
  I: "111010010010111", J: "001001001101010", K: "101101110101101", L: "100100100100111",
  M: "101111111101101", N: "110101101101101", O: "010101101101010", P: "110101110100100",
  Q: "010101101111011", R: "110101110101101", S: "011100010001110", T: "111010010010010",
  U: "101101101101111", V: "101101101101010", W: "101101111111101", X: "101101010101101",
  Y: "101101010010010", Z: "111001010100111", 0: "111101101101111", 1: "010110010010111",
  2: "110001010100111", 3: "110001010001110", 4: "101101111001001", 5: "111100110001110",
  6: "011100111101111", 7: "111001010010010", 8: "111101111101111", 9: "111101111001110",
  "_": "000000000000111", "-": "000000111000000", ":": "000010000010000", "/": "001001010100100",
  "(": "010100100100010", ")": "010001001001010", ".": "000000000000010", " ": "000000000000000",
  "%": "101001010100101", "X_": "000000000000000",
};

function drawText(g, text, x, y, scale, color) {
  let cx = x;
  for (const ch of text.toUpperCase()) {
    const glyph = FONT[ch] ?? FONT[" "];
    for (let i = 0; i < 15; i += 1) {
      if (glyph[i] === "1") g.rect(cx + (i % 3) * scale, y + Math.floor(i / 3) * scale, scale, scale, color);
    }
    cx += 4 * scale;
  }
}

const textWidth = (text, scale) => text.length * 4 * scale;

export function buildPreview(placed) {
  const SCALE = 4;
  const WIDTH = 1500;
  const PAD = 12;
  const LABEL_H = 14;
  // Cells: [label, source grid, source rect, scale]
  const cells = [];
  for (const f of placed) {
    if (f.role === "HORIZON") {
      // Full 600px segment at 1x, then the first 150 columns at 4x.
      const crop = new Grid(150, 12);
      for (let y = 0; y < 12; y += 1) for (let x = 0; x < 150; x += 1) crop.data.set(f.art.get(x, y), (y * 150 + x) * 4);
      cells.push({ label: `${f.name} 1X (600X12)`, art: f.art, scale: 1, box: { w: f.w, h: f.h } });
      cells.push({ label: `${f.name} 4X (COLS 0-149)`, art: crop, scale: SCALE, box: { w: 150, h: 12 } });
      continue;
    }
    if (/^(COLUMN|AMPHORAE)_[23]_/.test(f.name)) continue; // repeats of the single sprite
    cells.push({ label: `${f.name} ${f.w}X${f.h}`, art: f.art, scale: SCALE, box: { w: f.w, h: f.h } });
  }
  // Flow layout
  const positions = [];
  let x = PAD;
  let y = PAD;
  let rowH = 0;
  for (const cell of cells) {
    const w = Math.max(cell.box.w * cell.scale, textWidth(cell.label, 2));
    const h = LABEL_H + cell.box.h * cell.scale;
    if (x + w + PAD > WIDTH) {
      x = PAD;
      y += rowH + PAD;
      rowH = 0;
    }
    positions.push({ x, y });
    x += w + PAD;
    rowH = Math.max(rowH, h);
  }
  const height = y + rowH + PAD;
  const out = new Grid(WIDTH, height);
  out.rect(0, 0, WIDTH, height, "#ffffff");
  cells.forEach((cell, i) => {
    const { x: cx, y: cy } = positions[i];
    drawText(out, cell.label, cx, cy, 2, "#202124");
    const ox = cx;
    const oy = cy + LABEL_H;
    const W = cell.box.w * cell.scale;
    const H = cell.box.h * cell.scale;
    for (let py = 0; py < H; py += 1) {
      for (let px = 0; px < W; px += 1) {
        const checker = (Math.floor(px / 8) + Math.floor(py / 8)) % 2 === 0;
        out.px(ox + px, oy + py, checker ? CANVAS_BACKGROUND : "#dedede");
      }
    }
    for (let py = 0; py < H; py += 1) {
      for (let px = 0; px < W; px += 1) {
        const p = cell.art.get(Math.floor(px / cell.scale), Math.floor(py / cell.scale));
        if (p[3] > 0) out.data.set(p, ((oy + py) * WIDTH + ox + px) * 4);
      }
    }
    // Declared frame box
    for (let px = -1; px <= W; px += 1) {
      out.px(ox + px, oy - 1, "#4285F4");
      out.px(ox + px, oy + H, "#4285F4");
    }
    for (let py = -1; py <= H; py += 1) {
      out.px(ox - 1, oy + py, "#4285F4");
      out.px(ox + W, oy + py, "#4285F4");
    }
  });
  return out;
}

async function main() {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  const { atlas1, atlas2, frames } = buildAtlases();
  const targets = [
    ["public/game/images/default_100_percent/100-offline-sprite.png", atlas1],
    ["public/game/images/default_200_percent/200-offline-sprite.png", atlas2],
    ["public/game/sprite-preview.png", buildPreview(frames)],
  ];
  for (const [relative, grid] of targets) {
    const file = path.join(root, relative);
    await mkdir(path.dirname(file), { recursive: true });
    await writeFile(file, encodePng(grid));
    console.log(`wrote ${relative} (${grid.width}x${grid.height})`);
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await main();
}
