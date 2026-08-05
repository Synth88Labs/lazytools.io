import { parseFlac } from '../src/lib/flac.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number) => Math.abs(a - b) < 0.01;

const enc = new TextEncoder();
const u32be = (n: number) => [(n >>> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
const u24be = (n: number) => [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
const u32le = (n: number) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff];

// ---- STREAMINFO packed section: sampleRate 44100 (20b), channels 2 (3b: value 1),
//      bitsPerSample 16 (5b: value 15), totalSamples 132300 (36b) = 3.0 s ----
const sr = 44100, chVal = 2 - 1, bpsVal = 16 - 1, total = 132300;
const packed = new Array(8).fill(0);
// sampleRate: 20 bits across bytes 0,1, top nibble of 2
packed[0] = (sr >> 12) & 0xff;
packed[1] = (sr >> 4) & 0xff;
packed[2] = ((sr & 0xf) << 4) | ((chVal & 0x7) << 1) | ((bpsVal >> 4) & 0x1);
packed[3] = ((bpsVal & 0xf) << 4) | ((Math.floor(total / 0x100000000)) & 0xf);
packed[4] = (total >>> 24) & 0xff; packed[5] = (total >> 16) & 0xff; packed[6] = (total >> 8) & 0xff; packed[7] = total & 0xff;
const md5 = Array.from({ length: 16 }, (_, i) => i + 1);
const streaminfo = [...new Array(10).fill(0), ...packed, ...md5]; // 34 bytes
const siBlock = [0x00, ...u24be(streaminfo.length), ...streaminfo]; // type 0, not last

// ---- VORBIS_COMMENT ----
const vendor = enc.encode('reference libFLAC 1.4.3');
const comments = ['TITLE=Nightfall', 'ARTIST=The Analogs', 'ALBUM=Neon Nights', 'DATE=2024', 'TRACKNUMBER=5'].map((c) => enc.encode(c));
const vc: number[] = [...u32le(vendor.length), ...vendor, ...u32le(comments.length)];
for (const c of comments) vc.push(...u32le(c.length), ...c);
const vcBlock = [0x84, ...u24be(vc.length), ...vc]; // type 4, last-block flag (0x80|4)

const flac = Uint8Array.from([0x66, 0x4c, 0x61, 0x43, ...siBlock, ...vcBlock]);

const info = parseFlac(flac);
ok('sample rate 44100', info.sampleRate === 44100);
ok('channels 2', info.channels === 2);
ok('bits per sample 16', info.bitsPerSample === 16);
ok('total samples', info.totalSamples === 132300);
ok('duration 3.0s', near(info.durationSec, 3));
ok('md5 hex', info.md5 === '0102030405060708090a0b0c0d0e0f10');
ok('vendor', info.vendor === 'reference libFLAC 1.4.3');
ok('5 tags', info.tags.length === 5);
ok('title tag', info.tags.find((t) => t.key === 'TITLE')?.value === 'Nightfall');
ok('artist tag', info.tags.find((t) => t.key === 'ARTIST')?.value === 'The Analogs');
ok('date tag', info.tags.find((t) => t.key === 'DATE')?.value === '2024');
ok('key uppercased', info.tags.every((t) => t.key === t.key.toUpperCase()));
ok('2 blocks', info.blocks.length === 2 && info.blocks[0]!.type === 'STREAMINFO' && info.blocks[1]!.type === 'VORBIS_COMMENT');
ok('no picture', info.hasPicture === false);

// ---- picture block presence ----
const picBlock = [0x86, ...u24be(4), 1, 2, 3, 4]; // type 6, last
const flac2 = Uint8Array.from([0x66, 0x4c, 0x61, 0x43, 0x00, ...u24be(streaminfo.length), ...streaminfo, ...picBlock]);
const i2 = parseFlac(flac2);
ok('detects picture', i2.hasPicture === true && i2.pictureBytes === 4);

// ---- rejections ----
let threw = false; try { parseFlac(enc.encode('ID3 not a flac file here padding')); } catch { threw = true; }
ok('rejects non-flac', threw);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
