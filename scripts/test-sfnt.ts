import { parseFont } from '../src/lib/sfnt.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- Build a minimal but valid sfnt in memory (no font licensing needed) ----
const u16 = (n: number) => [(n >> 8) & 0xff, n & 0xff];
const u32 = (n: number) => [(n >>> 24) & 0xff, (n >>> 16) & 0xff, (n >>> 8) & 0xff, n & 0xff];
const utf16be = (s: string) => { const o: number[] = []; for (const c of s) o.push(...u16(c.charCodeAt(0))); return o; };

// head: unitsPerEm@18, created@20 (8-byte seconds since 1904), modified@28
const SFNT_EPOCH = Date.UTC(1904, 0, 1);
const createdSec = (Date.UTC(2020, 0, 15, 12, 0, 0) - SFNT_EPOCH) / 1000;
const head: number[] = new Array(54).fill(0);
head.splice(18, 2, ...u16(1000)); // unitsPerEm
head.splice(20, 8, ...u32(Math.floor(createdSec / 0x100000000)), ...u32(createdSec >>> 0)); // created
head.splice(28, 8, ...u32(Math.floor(createdSec / 0x100000000)), ...u32(createdSec >>> 0)); // modified

// maxp: numGlyphs@4
const maxp: number[] = [...u32(0x00010000), ...u16(1234), ...new Array(20).fill(0)];

// OS/2: usWeightClass@4, usWidthClass@6, fsType@8
const os2: number[] = [...u16(4), ...u16(0), ...u16(700), ...u16(5), ...u16(0x0002), ...new Array(20).fill(0)];

// name: two records (family=1, fullName=4), Windows/UCS-2/en-US
const family = utf16be('LazyTools Sans');
const full = utf16be('LazyTools Sans Bold');
const strings = [...family, ...full];
const rec = (nameId: number, len: number, off: number) => [...u16(3), ...u16(1), ...u16(0x409), ...u16(nameId), ...u16(len), ...u16(off)];
const nameHeaderLen = 6 + 2 * 12;
const nameTable: number[] = [
  ...u16(0), ...u16(2), ...u16(nameHeaderLen), // format, count, stringOffset
  ...rec(1, family.length, 0),
  ...rec(4, full.length, family.length),
  ...strings,
];

const glyf: number[] = []; // presence marks TrueType outlines

const tableDefs: [string, number[]][] = [['OS/2', os2], ['glyf', glyf], ['head', head], ['maxp', maxp], ['name', nameTable]];
const numTables = tableDefs.length;
const dirLen = 12 + numTables * 16;
let offset = dirLen;
const dir: number[] = [...u32(0x00010000), ...u16(numTables), ...u16(0), ...u16(0), ...u16(0)];
const body: number[] = [];
for (const [tag, data] of tableDefs) {
  dir.push(tag.charCodeAt(0), tag.charCodeAt(1), tag.charCodeAt(2), tag.charCodeAt(3));
  dir.push(...u32(0), ...u32(offset), ...u32(data.length));
  body.push(...data);
  offset += data.length;
  while (offset % 4 !== 0) { body.push(0); offset++; } // 4-byte alignment
}
const font = Uint8Array.from([...dir, ...body]);

// ---- Parse and assert ----
const info = parseFont(font);
ok('format TrueType', info.format === 'TrueType');
ok('outlines glyf', info.outlines === 'TrueType (glyf)');
ok('numTables', info.numTables === 5);
ok('family', info.family === 'LazyTools Sans');
ok('fullName', info.fullName === 'LazyTools Sans Bold');
ok('unitsPerEm 1000', info.unitsPerEm === 1000);
ok('numGlyphs 1234', info.numGlyphs === 1234);
ok('weightClass 700', info.weightClass === 700);
ok('widthClass 5', info.widthClass === 5);
ok('created 2020-01-15', info.created === '2020-01-15T12:00:00Z');
ok('fsType restricted', info.embeddable === 'Restricted — no embedding allowed');
ok('name records include family', info.names.some((n) => n.nameId === 1 && n.value === 'LazyTools Sans'));
ok('tables sorted list has head', info.tables.includes('head') && info.tables.includes('name'));

// ---- Rejections ----
const reject = (bytes: number[], label: string) => { let t = false; try { parseFont(Uint8Array.from(bytes)); } catch { t = true; } ok(label, t); };
reject([...utf16be('wOFF'), 0, 0], 'rejects WOFF');
reject([0x77, 0x4f, 0x46, 0x32, 0, 0], 'rejects WOFF2');
reject([0x25, 0x50, 0x44, 0x46, 0, 0], 'rejects non-font (%PDF)');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
