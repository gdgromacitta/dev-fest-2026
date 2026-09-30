// Minimal PNG encoder/decoder built on Node's zlib only (no dependencies).
//
// encodePng writes 8-bit RGBA, non-interlaced, one IDAT with filter 0 on every
// row, so the output is fully deterministic. decodePng reads non-interlaced
// 8-bit PNGs of colour type 0, 2, 3, 4 or 6 (tRNS honoured for 0, 2 and 3)
// and always returns RGBA.

import { deflateSync, inflateSync } from "node:zlib";

const SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(buffer) {
  let c = 0xffffffff;
  for (const byte of buffer) {
    c = CRC_TABLE[(c ^ byte) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeAndData = Buffer.concat([Buffer.from(type, "ascii"), data]);
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(typeAndData));
  return Buffer.concat([length, typeAndData, crc]);
}

/**
 * @param {{ width: number, height: number, data: Uint8Array }} image RGBA pixels
 * @returns {Buffer}
 */
export function encodePng({ width, height, data }) {
  if (data.length !== width * height * 4) {
    throw new Error("encodePng: data length does not match width*height*4");
  }
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // bit depth
  header[9] = 6; // colour type: RGBA
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    raw[y * (stride + 1)] = 0; // filter: none
    Buffer.from(data.buffer, data.byteOffset + y * stride, stride).copy(
      raw,
      y * (stride + 1) + 1,
    );
  }
  return Buffer.concat([
    SIGNATURE,
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(raw, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}

/**
 * @param {Uint8Array} buffer
 * @returns {{ width: number, height: number, data: Uint8Array }} RGBA pixels
 */
export function decodePng(buffer) {
  const png = Buffer.from(buffer);
  if (!png.subarray(0, 8).equals(SIGNATURE)) {
    throw new Error("decodePng: not a PNG file");
  }
  let width = 0;
  let height = 0;
  let colorType = 0;
  let palette = null;
  let transparency = null;
  const idat = [];
  let offset = 8;
  while (offset < png.length) {
    const length = png.readUInt32BE(offset);
    const type = png.toString("ascii", offset + 4, offset + 8);
    const body = png.subarray(offset + 8, offset + 8 + length);
    const expected = png.readUInt32BE(offset + 8 + length);
    if (crc32(png.subarray(offset + 4, offset + 8 + length)) !== expected) {
      throw new Error(`decodePng: bad CRC in ${type} chunk`);
    }
    if (type === "IHDR") {
      width = body.readUInt32BE(0);
      height = body.readUInt32BE(4);
      colorType = body[9];
      if (body[8] !== 8 || body[12] !== 0) {
        throw new Error("decodePng: only 8-bit non-interlaced PNGs supported");
      }
    } else if (type === "PLTE") {
      palette = body;
    } else if (type === "tRNS") {
      transparency = body;
    } else if (type === "IDAT") {
      idat.push(body);
    } else if (type === "IEND") {
      break;
    }
    offset += 12 + length;
  }

  const channels = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[colorType];
  if (!channels) throw new Error(`decodePng: unsupported colour type ${colorType}`);
  const raw = inflateSync(Buffer.concat(idat));
  const stride = width * channels;
  const pixels = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y += 1) {
    const filter = raw[y * (stride + 1)];
    for (let x = 0; x < stride; x += 1) {
      const value = raw[y * (stride + 1) + 1 + x];
      const left = x >= channels ? pixels[y * stride + x - channels] : 0;
      const up = y > 0 ? pixels[(y - 1) * stride + x] : 0;
      const upLeft = y > 0 && x >= channels ? pixels[(y - 1) * stride + x - channels] : 0;
      let predictor = 0;
      if (filter === 1) predictor = left;
      else if (filter === 2) predictor = up;
      else if (filter === 3) predictor = (left + up) >> 1;
      else if (filter === 4) predictor = paeth(left, up, upLeft);
      pixels[y * stride + x] = (value + predictor) & 0xff;
    }
  }

  const data = new Uint8Array(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const s = i * channels;
    let r;
    let g;
    let b;
    let a = 255;
    if (colorType === 6) {
      [r, g, b, a] = [pixels[s], pixels[s + 1], pixels[s + 2], pixels[s + 3]];
    } else if (colorType === 2) {
      [r, g, b] = [pixels[s], pixels[s + 1], pixels[s + 2]];
      if (transparency && r === transparency[1] && g === transparency[3] && b === transparency[5]) a = 0;
    } else if (colorType === 0) {
      r = g = b = pixels[s];
      if (transparency && r === transparency[1]) a = 0;
    } else if (colorType === 4) {
      r = g = b = pixels[s];
      a = pixels[s + 1];
    } else {
      const index = pixels[s];
      if (!palette) throw new Error("decodePng: missing PLTE");
      [r, g, b] = [palette[index * 3], palette[index * 3 + 1], palette[index * 3 + 2]];
      if (transparency && index < transparency.length) a = transparency[index];
    }
    data.set([r, g, b, a], i * 4);
  }
  return { width, height, data };
}
