/**
 * SRT ⇄ WebVTT parsing, conversion and time-shifting — pure string logic so it
 * can be Node-tested. Both formats are cue lists; they differ in the header
 * (VTT starts with `WEBVTT`), the millisecond separator (SRT uses a comma,
 * VTT a dot), and cue indices (required in SRT, optional in VTT).
 */

export interface Cue {
  /** start time, milliseconds */
  start: number;
  /** end time, milliseconds */
  end: number;
  /** cue body (may contain multiple lines) */
  text: string;
}

const TIME_RE = /(\d{1,2}):(\d{2}):(\d{2})[.,](\d{1,3})|(\d{1,2}):(\d{2})[.,](\d{1,3})/;

/** Parse one timestamp (HH:MM:SS,mmm / HH:MM:SS.mmm / MM:SS.mmm) to milliseconds, or null. */
export function parseTimestamp(s: string): number | null {
  const m = s.trim().match(TIME_RE);
  if (!m) return null;
  if (m[1] !== undefined) {
    const [, hh, mm, ss, ms] = m;
    return (+hh) * 3600000 + (+mm) * 60000 + (+ss) * 1000 + padMs(ms);
  }
  // MM:SS.mmm form (no hours)
  const mm = m[5], ss = m[6], ms = m[7];
  return (+mm) * 60000 + (+ss) * 1000 + padMs(ms);
}

function padMs(ms: string): number {
  // "5" → 500, "05" → 50, "050" → 50, "500" → 500
  return parseInt((ms + '000').slice(0, 3), 10);
}

/** Format milliseconds to HH:MM:SS<sep>mmm. sep is ',' for SRT, '.' for VTT. */
export function formatTimestamp(ms: number, sep: ',' | '.'): string {
  ms = Math.max(0, Math.round(ms));
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  const milli = ms % 1000;
  const p2 = (n: number) => String(n).padStart(2, '0');
  return `${p2(h)}:${p2(m)}:${p2(s)}${sep}${String(milli).padStart(3, '0')}`;
}

/**
 * Parse SRT or VTT text into cues. Blocks without a `-->` line (the WEBVTT
 * header, NOTE / STYLE / REGION blocks, stray text) are skipped. A leading cue
 * index or identifier line before the timing line is dropped. Trailing VTT cue
 * settings after the end timestamp (e.g. `align:start`) are ignored.
 */
export function parseCues(text: string): Cue[] {
  const normalized = text.replace(/\r\n?/g, '\n').replace(/^﻿/, '');
  const blocks = normalized.split(/\n{2,}/);
  const cues: Cue[] = [];
  for (const block of blocks) {
    const lines = block.split('\n');
    const arrowIdx = lines.findIndex((l) => l.includes('-->'));
    if (arrowIdx === -1) continue; // header / note / non-cue block
    const [startPart, endPart] = lines[arrowIdx].split('-->');
    const start = parseTimestamp(startPart);
    const end = parseTimestamp(endPart);
    if (start === null || end === null) continue;
    const body = lines.slice(arrowIdx + 1).join('\n').trim();
    cues.push({ start, end, text: body });
  }
  return cues;
}

function serialize(cues: Cue[], sep: ',' | '.', withIndex: boolean): string {
  return (
    cues
      .map((c, i) => {
        const time = `${formatTimestamp(c.start, sep)} --> ${formatTimestamp(c.end, sep)}`;
        const head = withIndex ? `${i + 1}\n` : '';
        return `${head}${time}\n${c.text}`;
      })
      .join('\n\n') + '\n'
  );
}

/** Convert SRT text to WebVTT. */
export function srtToVtt(srt: string): string {
  const cues = parseCues(srt);
  return 'WEBVTT\n\n' + serialize(cues, '.', false);
}

/** Convert WebVTT text to SRT. */
export function vttToSrt(vtt: string): string {
  const cues = parseCues(vtt);
  return serialize(cues, ',', true);
}

/** Does the text look like WebVTT (has the WEBVTT signature)? */
export function isVtt(text: string): boolean {
  return /^﻿?\s*WEBVTT/.test(text);
}

/**
 * Shift every cue by deltaMs (may be negative), clamping to 0, and re-serialize
 * in the SAME format the input was in (VTT if it had the WEBVTT header, else SRT).
 */
export function shiftSubtitles(text: string, deltaMs: number): string {
  const cues = parseCues(text).map((c) => ({
    start: Math.max(0, c.start + deltaMs),
    end: Math.max(0, c.end + deltaMs),
    text: c.text,
  }));
  return isVtt(text) ? 'WEBVTT\n\n' + serialize(cues, '.', false) : serialize(cues, ',', true);
}
