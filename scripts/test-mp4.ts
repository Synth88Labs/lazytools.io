import { parseMp4, flattenBoxes } from '../src/lib/mp4.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number) => Math.abs(a - b) < 0.01;

const A = (s: string) => [...s].map((c) => c.charCodeAt(0));
const u32 = (n: number) => [(n >>> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];

/** Build a box: size + type + payload. */
function box(type: string, payload: number[]): number[] {
  const size = 8 + payload.length;
  return [...u32(size), ...A(type), ...payload];
}

// ftyp: major "isom", minor 512, compatible isom,mp42
const ftyp = box('ftyp', [...A('isom'), ...u32(512), ...A('isom'), ...A('mp42')]);

// mvhd v0: version/flags(4) + created(4) + modified(4) + timescale(4) + duration(4) + ...rest
const timescale = 1000, duration = 5000; // 5.0 s
const mvhd = box('mvhd', [0, 0, 0, 0, ...u32(0), ...u32(0), ...u32(timescale), ...u32(duration), ...new Array(80).fill(0)]);

// hdlr: version/flags(4) + predefined(4) + handler_type(4)='vide' + rest
const hdlr = box('hdlr', [0, 0, 0, 0, ...u32(0), ...A('vide'), ...new Array(12).fill(0)]);
const mdia = box('mdia', hdlr);
const trak = box('trak', mdia);
const moov = box('moov', [...mvhd, ...trak]);

const mp4 = Uint8Array.from([...ftyp, ...moov]);
const info = parseMp4(mp4);

ok('major brand isom', info.majorBrand === 'isom');
ok('compatible brands', info.compatibleBrands.includes('mp42') && info.compatibleBrands.includes('isom'));
ok('timescale 1000', info.timescale === 1000);
ok('duration 5.0s', near(info.durationSec!, 5));
ok('handler vide', info.handlers.includes('vide'));

// top-level boxes: ftyp, moov
ok('2 top boxes', info.boxes.length === 2 && info.boxes[0]!.type === 'ftyp' && info.boxes[1]!.type === 'moov');
ok('moov is container', Array.isArray(info.boxes[1]!.children));
ok('moov has mvhd + trak', info.boxes[1]!.children!.some((b) => b.type === 'mvhd') && info.boxes[1]!.children!.some((b) => b.type === 'trak'));

// nested: moov>trak>mdia>hdlr
const flat = flattenBoxes(info.boxes);
const hdlrEntry = flat.find((x) => x.box.type === 'hdlr');
ok('hdlr nested at depth 3', hdlrEntry !== undefined && hdlrEntry.depth === 3);
ok('hdlr info decoded', hdlrEntry!.box.info === 'handler vide (Video)');
ok('ftyp info decoded', info.boxes[0]!.info!.startsWith('brand isom'));
ok('box offsets correct', info.boxes[1]!.offset === ftyp.length);

// 64-bit size box (size==1 → largesize)
const big = [...u32(1), ...A('free'), ...u32(0), ...u32(16), 0, 0, 0, 0]; // 64-bit size = 16
const mp4big = Uint8Array.from([...ftyp, ...big]);
const ib = parseMp4(mp4big);
ok('64-bit size box parsed', ib.boxes[1]!.type === 'free' && ib.boxes[1]!.size === 16 && ib.boxes[1]!.headerSize === 16);

// ---- rejections ----
let threw = false; try { parseMp4(Uint8Array.from(A('nope'))); } catch { threw = true; }
ok('rejects tiny non-mp4', threw);
let threw2 = false; try { parseMp4(Uint8Array.from([0, 0, 0, 0, ...A('####'), 0, 0])); } catch { threw2 = true; }
ok('rejects garbage header', threw2);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
