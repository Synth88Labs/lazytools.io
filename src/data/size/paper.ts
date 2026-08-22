/** Paper size reference table + unit conversions (all client-side). */

export interface PaperSize {
  id: string;
  name: string;
  group: 'ISO A' | 'ISO B' | 'ISO C / envelopes' | 'North American' | 'ANSI' | 'Architectural';
  /** portrait width × height, in millimetres */
  w: number;
  h: number;
}

// Dimensions are the official standard sizes (ISO 216 / ISO 269 / ANSI/ASME Y14.1).
export const PAPER_SIZES: PaperSize[] = [
  { id: 'a0', name: 'A0', group: 'ISO A', w: 841, h: 1189 },
  { id: 'a1', name: 'A1', group: 'ISO A', w: 594, h: 841 },
  { id: 'a2', name: 'A2', group: 'ISO A', w: 420, h: 594 },
  { id: 'a3', name: 'A3', group: 'ISO A', w: 297, h: 420 },
  { id: 'a4', name: 'A4', group: 'ISO A', w: 210, h: 297 },
  { id: 'a5', name: 'A5', group: 'ISO A', w: 148, h: 210 },
  { id: 'a6', name: 'A6', group: 'ISO A', w: 105, h: 148 },
  { id: 'a7', name: 'A7', group: 'ISO A', w: 74, h: 105 },
  { id: 'a8', name: 'A8', group: 'ISO A', w: 52, h: 74 },
  { id: 'b0', name: 'B0', group: 'ISO B', w: 1000, h: 1414 },
  { id: 'b1', name: 'B1', group: 'ISO B', w: 707, h: 1000 },
  { id: 'b2', name: 'B2', group: 'ISO B', w: 500, h: 707 },
  { id: 'b3', name: 'B3', group: 'ISO B', w: 353, h: 500 },
  { id: 'b4', name: 'B4', group: 'ISO B', w: 250, h: 353 },
  { id: 'b5', name: 'B5', group: 'ISO B', w: 176, h: 250 },
  { id: 'b6', name: 'B6', group: 'ISO B', w: 125, h: 176 },
  { id: 'c4', name: 'C4 (envelope)', group: 'ISO C / envelopes', w: 229, h: 324 },
  { id: 'c5', name: 'C5 (envelope)', group: 'ISO C / envelopes', w: 162, h: 229 },
  { id: 'c6', name: 'C6 (envelope)', group: 'ISO C / envelopes', w: 114, h: 162 },
  { id: 'dl', name: 'DL (envelope)', group: 'ISO C / envelopes', w: 110, h: 220 },
  { id: 'letter', name: 'Letter', group: 'North American', w: 215.9, h: 279.4 },
  { id: 'legal', name: 'Legal', group: 'North American', w: 215.9, h: 355.6 },
  { id: 'tabloid', name: 'Tabloid / Ledger', group: 'North American', w: 279.4, h: 431.8 },
  { id: 'half-letter', name: 'Half Letter', group: 'North American', w: 139.7, h: 215.9 },
  { id: 'junior-legal', name: 'Junior Legal', group: 'North American', w: 127, h: 203.2 },
  { id: 'executive', name: 'Executive', group: 'North American', w: 184.15, h: 266.7 },
  { id: 'ansi-a', name: 'ANSI A', group: 'ANSI', w: 215.9, h: 279.4 },
  { id: 'ansi-b', name: 'ANSI B', group: 'ANSI', w: 279.4, h: 431.8 },
  { id: 'ansi-c', name: 'ANSI C', group: 'ANSI', w: 431.8, h: 558.8 },
  { id: 'ansi-d', name: 'ANSI D', group: 'ANSI', w: 558.8, h: 863.6 },
  { id: 'ansi-e', name: 'ANSI E', group: 'ANSI', w: 863.6, h: 1117.6 },
  { id: 'arch-a', name: 'Arch A', group: 'Architectural', w: 228.6, h: 304.8 },
  { id: 'arch-b', name: 'Arch B', group: 'Architectural', w: 304.8, h: 457.2 },
  { id: 'arch-c', name: 'Arch C', group: 'Architectural', w: 457.2, h: 609.6 },
  { id: 'arch-d', name: 'Arch D', group: 'Architectural', w: 609.6, h: 914.4 },
  { id: 'arch-e', name: 'Arch E', group: 'Architectural', w: 762, h: 1016 },
];

export interface PaperDims {
  mm: [number, number];
  cm: [number, number];
  in: [number, number];
  pt: [number, number];
  px: [number, number];
}

const round = (v: number, d = 2) => Math.round(v * 10 ** d) / 10 ** d;

/** Convert a paper size (mm) into every common unit, at the given orientation and DPI. */
export function paperDims(p: PaperSize, orientation: 'portrait' | 'landscape', dpi: number): PaperDims {
  let w = p.w, h = p.h;
  if (orientation === 'landscape') [w, h] = [h, w];
  const toIn = (mm: number) => mm / 25.4;
  return {
    mm: [round(w, 1), round(h, 1)],
    cm: [round(w / 10, 2), round(h / 10, 2)],
    in: [round(toIn(w), 2), round(toIn(h), 2)],
    pt: [Math.round(toIn(w) * 72), Math.round(toIn(h) * 72)],
    px: [Math.round(toIn(w) * dpi), Math.round(toIn(h) * dpi)],
  };
}

export const paperById = (id: string) => PAPER_SIZES.find((p) => p.id === id) ?? null;
