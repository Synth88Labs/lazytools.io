import { paperById, paperDims } from '../src/data/size/paper.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// A4 portrait — the canonical reference values
const a4 = paperById('a4')!;
const a4p = paperDims(a4, 'portrait', 96);
ok('A4 mm 210×297', a4p.mm[0] === 210 && a4p.mm[1] === 297);
ok('A4 cm 21×29.7', a4p.cm[0] === 21 && a4p.cm[1] === 29.7);
ok('A4 in 8.27×11.69', a4p.in[0] === 8.27 && a4p.in[1] === 11.69);
ok('A4 pt 595×842', a4p.pt[0] === 595 && a4p.pt[1] === 842);
ok('A4 px@96 = 794×1123', a4p.px[0] === 794 && a4p.px[1] === 1123);
ok('A4 px@300 = 2480×3508', (() => { const d = paperDims(a4, 'portrait', 300); return d.px[0] === 2480 && d.px[1] === 3508; })());

// A4 landscape swaps w/h
const a4l = paperDims(a4, 'landscape', 96);
ok('A4 landscape 297×210', a4l.mm[0] === 297 && a4l.mm[1] === 210);

// US Letter
const letter = paperById('letter')!;
const lp = paperDims(letter, 'portrait', 96);
ok('Letter mm 215.9×279.4', lp.mm[0] === 215.9 && lp.mm[1] === 279.4);
ok('Letter in 8.5×11', lp.in[0] === 8.5 && lp.in[1] === 11);
ok('Letter pt 612×792', lp.pt[0] === 612 && lp.pt[1] === 792);

// ISO 1:√2 halving: A4 folded = A5
const a5 = paperById('a5')!;
ok('A5 = A4 halved (width)', a5.w === a4.h / 2 || Math.abs(a5.w - a4.h / 2) <= 1);

console.log(`paper-size: ${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
