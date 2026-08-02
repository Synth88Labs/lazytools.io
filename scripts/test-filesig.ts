import { identifyBytes, identifyFile, hexToBytes, toHex, SIGNATURES } from '../src/lib/file-signatures.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const bytes = (...b: number[]) => new Uint8Array(b);

// ---- basic image signatures ----
ok('PNG', identifyBytes(bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a))[0].name === 'PNG image');
ok('JPEG', identifyBytes(bytes(0xff, 0xd8, 0xff, 0xe0))[0].mime === 'image/jpeg');
ok('GIF', identifyBytes(bytes(0x47, 0x49, 0x46, 0x38, 0x39, 0x61))[0].name === 'GIF image');
ok('PDF', identifyBytes(bytes(0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37))[0].mime === 'application/pdf');
ok('ZIP/docx', identifyBytes(bytes(0x50, 0x4b, 0x03, 0x04))[0].ext.includes('docx'));

// ---- offset-based ----
// WebP: RIFF at 0, WEBP at 8
const webp = new Uint8Array(16);
webp.set([0x52, 0x49, 0x46, 0x46], 0); webp.set([0x57, 0x45, 0x42, 0x50], 8);
ok('WebP (RIFF+WEBP)', identifyBytes(webp)[0].name === 'WebP image');
// WAV vs WebP disambiguation (same RIFF prefix, different form)
const wav = new Uint8Array(16);
wav.set([0x52, 0x49, 0x46, 0x46], 0); wav.set([0x57, 0x41, 0x56, 0x45], 8);
ok('WAV (RIFF+WAVE)', identifyBytes(wav)[0].name === 'WAV audio');
// MP4: ftyp at offset 4
const mp4 = new Uint8Array(12);
mp4.set([0x00, 0x00, 0x00, 0x18, 0x66, 0x74, 0x79, 0x70], 0);
ok('MP4 (ftyp@4)', identifyBytes(mp4)[0].mime === 'video/mp4');
// TAR: "ustar" at 257
const tar = new Uint8Array(300);
tar.set([0x75, 0x73, 0x74, 0x61, 0x72], 257);
ok('TAR (ustar@257)', identifyBytes(tar)[0].name === 'TAR archive');

// ---- no match ----
ok('random bytes → no match', identifyBytes(bytes(0x01, 0x02, 0x03, 0x04)).length === 0);
ok('too short for offset sig', identifyBytes(bytes(0x52, 0x49, 0x46, 0x46)).length === 0); // RIFF but no form at 8

// ---- extension spoof detection ----
const png = bytes(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a);
const r1 = identifyFile(png, 'photo.png');
ok('ext matches true type', r1.extensionMatches === true && r1.claimedExt === 'png');
const r2 = identifyFile(png, 'invoice.pdf'); // PNG bytes but .pdf name → spoof
ok('spoof detected (png bytes, .pdf name)', r2.extensionMatches === false && r2.detected?.name === 'PNG image');
const r3 = identifyFile(png); // no filename
ok('no filename → null match', r3.extensionMatches === null);
const r4 = identifyFile(bytes(0xff, 0xd8, 0xff), 'pic.jpeg');
ok('jpeg ext alias matches', r4.extensionMatches === true);

// ---- hex helpers ----
ok('hexToBytes', Array.from(hexToBytes('89 50 4E 47')).join(',') === '137,80,78,71');
ok('hexToBytes 0x + commas', Array.from(hexToBytes('0x25,0x50')).join(',') === '37,80');
ok('toHex', toHex(bytes(0x89, 0x50, 0x4e, 0x47), 4) === '89 50 4E 47');
let threw = false; try { hexToBytes('ABC'); } catch { threw = true; }
ok('hexToBytes rejects odd length', threw);

// identify from pasted hex
ok('identify from hex', identifyBytes(hexToBytes('FFD8FFE0'))[0].mime === 'image/jpeg');

// signature table sanity
ok('table has 25+ signatures', SIGNATURES.length >= 25);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
