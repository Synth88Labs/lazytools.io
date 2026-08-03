import { parseAudio, formatDuration } from '../src/lib/audio-meta.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const near = (a: number, b: number) => Math.abs(a - b) < 1e-6;

const A = (s: string) => [...s].map((c) => c.charCodeAt(0));
const u16le = (n: number) => [n & 0xff, (n >> 8) & 0xff];
const u32le = (n: number) => [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >>> 24) & 0xff];
const u16be = (n: number) => [(n >> 8) & 0xff, n & 0xff];
const u32be = (n: number) => [(n >>> 24) & 0xff, (n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];

// ---- Canonical 44.1 kHz / 16-bit / stereo PCM WAV with a LIST/INFO title ----
const sampleRate = 44100, channels = 2, bits = 16;
const blockAlign = channels * bits / 8;         // 4
const byteRate = sampleRate * blockAlign;        // 176400
const dataLen = byteRate;                        // exactly 1 second
const title = A('Test Tone\0');                  // even length (10)
const info = [...A('LIST'), ...u32le(4 + 8 + title.length), ...A('INFO'), ...A('INAM'), ...u32le(title.length), ...title];
const fmt = [...A('fmt '), ...u32le(16), ...u16le(1), ...u16le(channels), ...u32le(sampleRate), ...u32le(byteRate), ...u16le(blockAlign), ...u16le(bits)];
const data = [...A('data'), ...u32le(dataLen), ...new Array(dataLen).fill(0)];
const wavBody = [...A('WAVE'), ...fmt, ...data, ...info];
const wav = Uint8Array.from([...A('RIFF'), ...u32le(wavBody.length), ...wavBody]);

const w = parseAudio(wav);
ok('wav container', w.container === 'WAV (RIFF)');
ok('wav codec PCM', w.codec === 'PCM');
ok('wav channels 2', w.channels === 2);
ok('wav sampleRate 44100', w.sampleRate === 44100);
ok('wav bits 16', w.bitsPerSample === 16);
ok('wav byteRate', w.byteRate === 176400);
ok('wav bitrate', w.bitrate === 176400 * 8);
ok('wav duration 1.0s', near(w.durationSec!, 1));
ok('wav data bytes', w.dataBytes === dataLen);
ok('wav has fmt+data chunks', w.chunks.includes('fmt') && w.chunks.includes('data'));
ok('wav INFO title tag', w.tags.some((t) => t.label === 'Title' && t.value === 'Test Tone'));
ok('duration format', formatDuration(1) === '1:01.000' || formatDuration(65) === '1:05.000');

// ---- IEEE-float WAV (format 3) ----
const fmtF = [...A('fmt '), ...u32le(16), ...u16le(3), ...u16le(1), ...u32le(48000), ...u32le(48000 * 4), ...u16le(4), ...u16le(32)];
const dataF = [...A('data'), ...u32le(48000 * 4), ...new Array(48000 * 4).fill(0)];
const wavF = Uint8Array.from([...A('RIFF'), ...u32le(4 + fmtF.length + dataF.length), ...A('WAVE'), ...fmtF, ...dataF]);
const wf = parseAudio(wavF);
ok('wav float codec', wf.codec === 'IEEE float');
ok('wav float 48k mono 32bit', wf.sampleRate === 48000 && wf.channels === 1 && wf.bitsPerSample === 32);
ok('wav float duration 1s', near(wf.durationSec!, 1));

// ---- AIFF: COMM with the canonical 80-bit extended for 44100 Hz ----
const ext44100 = [0x40, 0x0e, 0xac, 0x44, 0, 0, 0, 0, 0, 0]; // 44100 Hz
const numFrames = 22050; // 0.5 s
const comm = [...A('COMM'), ...u32be(18), ...u16be(1), ...u32be(numFrames), ...u16be(16), ...ext44100];
const ssnd = [...A('SSND'), ...u32be(8), ...u32be(0), ...u32be(0)];
const nameChunk = [...A('NAME'), ...u32be(4), ...A('Song')];
const aiffBody = [...A('AIFF'), ...comm, ...ssnd, ...nameChunk];
const aiff = Uint8Array.from([...A('FORM'), ...u32be(aiffBody.length), ...aiffBody]);
const af = parseAudio(aiff);
ok('aiff container', af.container === 'AIFF');
ok('aiff channels 1', af.channels === 1);
ok('aiff sampleRate 44100 (80-bit)', af.sampleRate === 44100);
ok('aiff bits 16', af.bitsPerSample === 16);
ok('aiff duration 0.5s', near(af.durationSec!, 0.5));
ok('aiff name tag', af.tags.some((t) => t.value === 'Song'));

// ---- AIFF-C with sowt codec ----
const commC = [...A('COMM'), ...u32be(24), ...u16be(2), ...u32be(1000), ...u16be(16), ...ext44100, ...A('sowt'), 0, 0];
const aifcBody = [...A('AIFC'), ...commC];
const aifc = Uint8Array.from([...A('FORM'), ...u32be(aifcBody.length), ...aifcBody]);
const cf = parseAudio(aifc);
ok('aifc container', cf.container === 'AIFF-C');
ok('aifc sowt codec', cf.codec === 'PCM (little-endian)');

// ---- rejections ----
const reject = (bytes: number[], label: string) => { let t = false; try { parseAudio(Uint8Array.from(bytes)); } catch { t = true; } ok(label, t); };
reject(A('%PDF-1.7'), 'rejects PDF');
reject([...A('RIFF'), 0, 0, 0, 0, ...A('AVI ')], 'rejects RIFF non-WAVE');

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
