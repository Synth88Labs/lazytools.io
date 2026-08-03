import { parseMp3 } from '../src/lib/id3.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number) => Math.abs(a - b) < 0.05;

const A = (s: string) => [...s].map((c) => c.charCodeAt(0));
const u32be = (n: number) => [(n >>> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
const synch = (n: number) => [(n >> 21) & 0x7f, (n >> 14) & 0x7f, (n >> 7) & 0x7f, n & 0x7f];

// A latin1 text frame (encoding byte 0).
function textFrame(id: string, text: string): number[] {
  const body = [0, ...A(text)];
  return [...A(id), ...u32be(body.length), 0, 0, ...body];
}

// ---- ID3v2.3 tag with Title/Artist/Album/Genre + one MPEG-1 LIII frame ----
const frames = [
  ...textFrame('TIT2', 'Midnight Drive'),
  ...textFrame('TPE1', 'The Analogs'),
  ...textFrame('TALB', 'Neon Nights'),
  ...textFrame('TCON', '(17)'),      // → Rock
  ...textFrame('TRCK', '3/12'),
];
const tag = [...A('ID3'), 3, 0, 0, ...synch(frames.length), ...frames];
// MPEG-1 Layer III, 128 kbps, 44100 Hz, stereo: FF FB 90 00
const frameHeader = [0xff, 0xfb, 0x90, 0x00];
const audio = [...frameHeader, ...new Array(16000 - 4).fill(0)]; // ~1 s at 128 kbps CBR
const mp3 = Uint8Array.from([...tag, ...audio]);

const info = parseMp3(mp3);
const tagVal = (label: string) => info.tags.find((t) => t.label === label)?.value;
ok('id3 version 2.3', info.id3Version === 'ID3v2.3.0');
ok('title', tagVal('Title') === 'Midnight Drive');
ok('artist', tagVal('Artist') === 'The Analogs');
ok('album', tagVal('Album') === 'Neon Nights');
ok('genre resolved from (17)', tagVal('Genre') === 'Rock');
ok('track', tagVal('Track') === '3/12');
ok('mpeg version 1', info.mpegVersion === 'MPEG-1');
ok('layer III', info.layer === 'Layer III');
ok('bitrate 128', info.bitrate === 128);
ok('sampleRate 44100', info.sampleRate === 44100);
ok('channel stereo', info.channelMode === 'Stereo');
ok('cbr not vbr', info.vbr === false);
ok('cbr duration ~1s', near(info.durationSec!, 1));

// ---- UTF-16 (encoding 1, with BOM) text frame ----
const utf16 = (s: string) => { const o = [0xff, 0xfe]; for (const c of s) o.push(c.charCodeAt(0) & 0xff, (c.charCodeAt(0) >> 8) & 0xff); return o; };
const uframeBody = [1, ...utf16('Café Éclair')];
const uframe = [...A('TIT2'), ...u32be(uframeBody.length), 0, 0, ...uframeBody];
const utag = [...A('ID3'), 3, 0, 0, ...synch(uframe.length), ...uframe];
const um3 = Uint8Array.from([...utag, 0xff, 0xfb, 0x90, 0x00]);
ok('utf-16 title decoded', parseMp3(um3).tags.find((t) => t.label === 'Title')?.value === 'Café Éclair');

// ---- ID3v1-only file ----
const v1 = new Array(128).fill(0);
const put = (s: string, off: number) => { for (let i = 0; i < s.length; i++) v1[off + i] = s.charCodeAt(i); };
v1[0] = 0x54; v1[1] = 0x41; v1[2] = 0x47; // TAG
put('Old Song', 3); put('Legacy Band', 33); put('Tape Era', 63); put('1985', 93);
v1[127] = 13; // Pop
const v1mp3 = Uint8Array.from([0xff, 0xfb, 0x90, 0x00, ...new Array(100).fill(0), ...v1]);
const iv1 = parseMp3(v1mp3);
ok('id3v1 detected', iv1.id3Version === 'ID3v1');
ok('id3v1 title', iv1.tags.find((t) => t.label === 'Title')?.value === 'Old Song');
ok('id3v1 genre Pop', iv1.tags.find((t) => t.label === 'Genre')?.value === 'Pop');

// ---- MPEG-2 Layer III bitrate table (FF F3 = MPEG2 LIII) ----
// FF F3: b1=0xF3=11110011 → ver=10(MPEG2), layer=01(III). b2=0x50=01010000 → brIndex=5(=40kbps MPEG2), srIndex=00(=22050)
const m2 = Uint8Array.from([0xff, 0xf3, 0x50, 0x00, ...new Array(500).fill(0)]);
const i2 = parseMp3(m2);
ok('mpeg2 version', i2.mpegVersion === 'MPEG-2');
ok('mpeg2 bitrate 40', i2.bitrate === 40);
ok('mpeg2 sampleRate 22050', i2.sampleRate === 22050);

// ---- rejection ----
let threw = false; try { parseMp3(Uint8Array.from(A('just plain text not audio'))); } catch { threw = true; }
ok('rejects non-mp3', threw);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
