/**
 * ISO 8601 duration parsing/formatting (PnYnMnWnDTnHnMnS ↔ seconds ↔ HH:MM:SS
 * ↔ human-readable). Pure and deterministic, so Node-tested.
 *
 * NOTE on years/months: a duration has no fixed anchor date, so calendar years
 * and months are ambiguous. This uses the common convention of 1 year = 365
 * days and 1 month = 30 days for those components, surfaced to the user.
 */

const YEAR = 365 * 86400;
const MONTH = 30 * 86400;
const WEEK = 7 * 86400;
const DAY = 86400;

const ISO_RE =
  /^P(?!$)(?:(\d+(?:\.\d+)?)Y)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)W)?(?:(\d+(?:\.\d+)?)D)?(?:T(?!$)(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/;

/** Parse an ISO 8601 duration to total seconds, or null if invalid. */
export function parseIso8601Duration(input: string): number | null {
  const s = input.trim().toUpperCase();
  if (s === 'P' || s === 'PT') return null;
  const m = s.match(ISO_RE);
  if (!m) return null;
  // Reject "PT" with nothing after T (regex allows T then nothing via optional groups).
  if (/T$/.test(s)) return null;
  const [, y, mo, w, d, h, mi, se] = m.map((x) => (x ? parseFloat(x) : 0));
  return y * YEAR + mo * MONTH + w * WEEK + d * DAY + h * 3600 + mi * 60 + se;
}

/** Format total seconds as an ISO 8601 duration (days + time; no months/years). */
export function secondsToIso8601(totalSeconds: number): string {
  let s = Math.max(0, totalSeconds);
  const d = Math.floor(s / DAY);
  s -= d * DAY;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const mi = Math.floor(s / 60);
  s -= mi * 60;
  const se = Math.round(s * 1000) / 1000;
  let out = 'P';
  if (d) out += `${d}D`;
  const t = `${h ? `${h}H` : ''}${mi ? `${mi}M` : ''}${se ? `${se}S` : ''}`;
  if (t) out += `T${t}`;
  return out === 'P' ? 'PT0S' : out;
}

/** Format total seconds as HH:MM:SS (or D:HH:MM:SS when ≥ 1 day). */
export function secondsToHms(totalSeconds: number): string {
  let s = Math.max(0, Math.floor(totalSeconds));
  const d = Math.floor(s / DAY);
  s -= d * DAY;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const mi = Math.floor(s / 60);
  const se = s - mi * 60;
  const p2 = (x: number) => String(x).padStart(2, '0');
  const core = `${p2(h)}:${p2(mi)}:${p2(se)}`;
  return d ? `${d}:${core}` : core;
}

/** Human-readable, e.g. "1d 2h 30m 5s". */
export function secondsToHuman(totalSeconds: number): string {
  let s = Math.max(0, Math.floor(totalSeconds));
  const d = Math.floor(s / DAY);
  s -= d * DAY;
  const h = Math.floor(s / 3600);
  s -= h * 3600;
  const mi = Math.floor(s / 60);
  const se = s - mi * 60;
  const parts = [
    d ? `${d}d` : '',
    h ? `${h}h` : '',
    mi ? `${mi}m` : '',
    se ? `${se}s` : '',
  ].filter(Boolean);
  return parts.length ? parts.join(' ') : '0s';
}
