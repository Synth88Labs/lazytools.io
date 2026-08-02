/**
 * Build an RFC 5545 iCalendar (.ics) VEVENT from structured event fields.
 * Pure and deterministic. Handles the parts hand-writing gets wrong: TEXT
 * escaping (\\ ; , newline), 75-octet line folding with CRLF + space, correct
 * DTSTART/DTEND value forms (all-day DATE vs floating vs UTC), and RRULE.
 */

export interface IcsEvent {
  title: string;
  start: string;        // 'YYYY-MM-DDTHH:MM' (from datetime-local) or 'YYYY-MM-DD' for all-day
  end?: string;         // same shape; optional
  allDay?: boolean;
  location?: string;
  description?: string;
  url?: string;
  /** 'none' | 'daily' | 'weekly' | 'monthly' | 'yearly' */
  recurrence?: string;
  /** number of occurrences (RRULE COUNT); 0/undefined = no count limit */
  count?: number;
  /** injected for deterministic output (tests); browser fills these in */
  uid?: string;
  dtstamp?: string;     // 'YYYYMMDDTHHMMSSZ'
}

/** Escape a TEXT value per RFC 5545 §3.3.11. */
export function escapeIcsText(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\r\n|\r|\n/g, '\\n');
}

/** Fold a content line to <=75 octets, continuation lines start with a space. */
export function foldLine(line: string): string {
  // Fold on octet boundaries (approximate with UTF-8 byte length).
  const bytes = (str: string) => new TextEncoder().encode(str).length;
  if (bytes(line) <= 75) return line;
  let out = '';
  let cur = '';
  for (const ch of line) {
    if (bytes(cur + ch) > 75) { out += (out ? '\r\n ' : '') + cur; cur = ch; }
    else cur += ch;
  }
  out += (out ? '\r\n ' : '') + cur;
  return out;
}

/** 'YYYY-MM-DDTHH:MM' → 'YYYYMMDDTHHMMSS' (floating local); 'YYYY-MM-DD' → 'YYYYMMDD'. */
function fmtDate(v: string, allDay: boolean): string {
  const clean = v.replace(/[-:]/g, '');
  if (allDay) return clean.slice(0, 8);
  // ensure seconds present
  const base = clean.slice(0, 15); // YYYYMMDDTHHMM(SS?)
  const t = base.includes('T') ? base : base.slice(0, 8) + 'T' + base.slice(8);
  return t.length === 13 ? t + '00' : t.padEnd(15, '0');
}

/** Add one day to a 'YYYY-MM-DD' string (for all-day DTEND, which is exclusive). */
function addDay(dateOnly: string): string {
  const d = new Date(dateOnly + 'T00:00:00Z');
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

const FREQ: Record<string, string> = { daily: 'DAILY', weekly: 'WEEKLY', monthly: 'MONTHLY', yearly: 'YEARLY' };

export function buildIcs(ev: IcsEvent): string {
  if (!ev.title || !ev.start) throw new Error('Event needs at least a title and a start date/time.');
  const allDay = !!ev.allDay;
  const uid = ev.uid || 'lazytools-event';
  const dtstamp = ev.dtstamp || '19700101T000000Z';

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//LazyTools//ICS Generator//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
  ];

  if (allDay) {
    lines.push(`DTSTART;VALUE=DATE:${fmtDate(ev.start, true)}`);
    const endDate = ev.end ? ev.end.slice(0, 10) : ev.start.slice(0, 10);
    lines.push(`DTEND;VALUE=DATE:${fmtDate(addDay(endDate), true)}`); // DTEND is exclusive
  } else {
    lines.push(`DTSTART:${fmtDate(ev.start, false)}`);
    if (ev.end) lines.push(`DTEND:${fmtDate(ev.end, false)}`);
  }

  lines.push(`SUMMARY:${escapeIcsText(ev.title)}`);
  if (ev.location) lines.push(`LOCATION:${escapeIcsText(ev.location)}`);
  if (ev.description) lines.push(`DESCRIPTION:${escapeIcsText(ev.description)}`);
  if (ev.url) lines.push(`URL:${escapeIcsText(ev.url)}`);

  const freq = ev.recurrence && FREQ[ev.recurrence];
  if (freq) {
    let rrule = `RRULE:FREQ=${freq}`;
    if (ev.count && ev.count > 0) rrule += `;COUNT=${Math.floor(ev.count)}`;
    lines.push(rrule);
  }

  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.map(foldLine).join('\r\n') + '\r\n';
}
