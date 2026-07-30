import { parseTimestamp, formatTimestamp, parseCues, srtToVtt, vttToSrt, isVtt, shiftSubtitles } from '../src/lib/subtitles.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// ---- parseTimestamp / formatTimestamp ----
ok('srt time → ms', parseTimestamp('00:00:01,500') === 1500);
ok('vtt time → ms', parseTimestamp('01:02:03.250') === 3723250);
ok('mm:ss.mmm form', parseTimestamp('02:05.000') === 125000);
ok('short ms padded (,5 → 500)', parseTimestamp('00:00:00,5') === 500);
ok('format srt', formatTimestamp(3723250, ',') === '01:02:03,250');
ok('format vtt', formatTimestamp(1500, '.') === '00:00:01.500');
ok('format clamps negative', formatTimestamp(-100, ',') === '00:00:00,000');

const SRT = `1
00:00:01,000 --> 00:00:04,000
Hello world

2
00:00:05,500 --> 00:00:06,500
Second line
across two rows`;

const VTT = `WEBVTT

00:00:01.000 --> 00:00:04.000 align:start
Hello world

00:00:05.500 --> 00:00:06.500
Second line
across two rows`;

// ---- parseCues ----
const cs = parseCues(SRT);
ok('srt parses 2 cues', cs.length === 2);
ok('cue0 start', cs[0].start === 1000 && cs[0].end === 4000);
ok('cue0 text', cs[0].text === 'Hello world');
ok('cue1 multiline text', cs[1].text === 'Second line\nacross two rows');

const cv = parseCues(VTT);
ok('vtt parses 2 cues (skips WEBVTT header)', cv.length === 2);
ok('vtt drops cue settings after end time', cv[0].end === 4000);
ok('vtt cue0 text', cv[0].text === 'Hello world');

// NOTE / STYLE blocks are skipped.
const vttNote = `WEBVTT

NOTE this is a comment

STYLE
::cue { color: yellow }

00:00:02.000 --> 00:00:03.000
Only cue`;
ok('vtt skips NOTE and STYLE blocks', parseCues(vttNote).length === 1 && parseCues(vttNote)[0].text === 'Only cue');

// ---- srtToVtt ----
const vttOut = srtToVtt(SRT);
ok('srtToVtt starts with WEBVTT', vttOut.startsWith('WEBVTT\n\n'));
ok('srtToVtt uses dot separator', vttOut.includes('00:00:01.000 --> 00:00:04.000'));
ok('srtToVtt drops indices', !/\n1\n/.test('\n' + vttOut));
ok('srtToVtt keeps both cues', (vttOut.match(/-->/g) || []).length === 2);

// ---- vttToSrt ----
const srtOut = vttToSrt(VTT);
ok('vttToSrt uses comma separator', srtOut.includes('00:00:01,000 --> 00:00:04,000'));
ok('vttToSrt numbers cues 1,2', srtOut.startsWith('1\n') && srtOut.includes('\n\n2\n'));
ok('vttToSrt has no WEBVTT header', !srtOut.includes('WEBVTT'));

// ---- round trip ----
ok('srt → vtt → srt preserves cue count', parseCues(vttToSrt(srtToVtt(SRT))).length === 2);
ok('round trip preserves times', parseCues(vttToSrt(srtToVtt(SRT)))[1].start === 5500);

// ---- isVtt ----
ok('detects vtt', isVtt(VTT) === true);
ok('detects srt (not vtt)', isVtt(SRT) === false);

// ---- shiftSubtitles ----
const shifted = shiftSubtitles(SRT, 2000);
const sc = parseCues(shifted);
ok('shift +2s moves start', sc[0].start === 3000 && sc[0].end === 6000);
ok('shift keeps srt format', shifted.includes(',') && !shifted.startsWith('WEBVTT'));
const back = shiftSubtitles(SRT, -2000);
ok('shift -2s clamps at 0 (1000-2000 → 0)', parseCues(back)[0].start === 0);
const shiftedVtt = shiftSubtitles(VTT, 1000);
ok('shift keeps vtt format', shiftedVtt.startsWith('WEBVTT') && shiftedVtt.includes('00:00:02.000'));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
