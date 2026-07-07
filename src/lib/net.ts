/** Shared IPv4 / IPv6 / MAC / cron math for the Network & IT tools. All pure functions. */

// ---------------- IPv4 ----------------

/** Parse dotted-quad IPv4 to unsigned 32-bit int, or null. */
export function parseIpv4(s: string): number | null {
  const m = s.trim().match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!m) return null;
  const parts = m.slice(1).map(Number);
  if (parts.some((p) => p > 255)) return null;
  return ((parts[0]! << 24) | (parts[1]! << 16) | (parts[2]! << 8) | parts[3]!) >>> 0;
}

export function ipv4ToString(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.');
}

export function prefixToMask(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

/** Contiguous mask → prefix length, or null if non-contiguous. */
export function maskToPrefix(mask: number): number | null {
  let seenZero = false;
  let prefix = 0;
  for (let i = 31; i >= 0; i--) {
    const bit = (mask >>> i) & 1;
    if (bit === 1) {
      if (seenZero) return null;
      prefix++;
    } else seenZero = true;
  }
  return prefix;
}

export function ipv4ToBinary(n: number): string {
  return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255]
    .map((o) => o.toString(2).padStart(8, '0'))
    .join('.');
}

export function ipv4Class(n: number): string {
  const first = (n >>> 24) & 255;
  if (first < 128) return 'A';
  if (first < 192) return 'B';
  if (first < 224) return 'C';
  if (first < 240) return 'D (multicast)';
  return 'E (experimental)';
}

/** RFC 1918 / special-use classification for display. */
export function ipv4Scope(n: number): string {
  const a = (n >>> 24) & 255;
  const b = (n >>> 16) & 255;
  if (a === 10) return 'Private (RFC 1918)';
  if (a === 172 && b >= 16 && b <= 31) return 'Private (RFC 1918)';
  if (a === 192 && b === 168) return 'Private (RFC 1918)';
  if (a === 127) return 'Loopback';
  if (a === 169 && b === 254) return 'Link-local (APIPA)';
  if (a === 100 && b >= 64 && b <= 127) return 'Carrier-grade NAT (RFC 6598)';
  if (a >= 224 && a <= 239) return 'Multicast';
  if (a >= 240) return 'Reserved';
  return 'Public';
}

export interface SubnetInfo {
  network: number;
  broadcast: number;
  firstHost: number | null;
  lastHost: number | null;
  hostCount: number;
  mask: number;
  wildcard: number;
  prefix: number;
}

export function subnetInfo(ip: number, prefix: number): SubnetInfo {
  const mask = prefixToMask(prefix);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = prefix >= 31 ? (prefix === 31 ? 2 : 1) : broadcast - network + 1;
  // /31 (RFC 3021 point-to-point) and /32 have no separate network/broadcast host split
  const hostCount = prefix >= 31 ? total : total - 2;
  const firstHost = prefix >= 31 ? network : network + 1;
  const lastHost = prefix >= 31 ? broadcast : broadcast - 1;
  return { network, broadcast, firstHost, lastHost, hostCount, mask, wildcard: ~mask >>> 0, prefix };
}

/** Minimal CIDR set covering an inclusive IPv4 range (classic alignment algorithm). */
export function rangeToCidrs(start: number, end: number): { base: number; prefix: number }[] {
  const out: { base: number; prefix: number }[] = [];
  let s = start >>> 0;
  const e = end >>> 0;
  while (s <= e) {
    // largest block aligned at s
    let maxBits = 32;
    while (maxBits > 0) {
      const size = 2 ** (32 - (maxBits - 1));
      if (s % size !== 0 || s + size - 1 > e) break;
      maxBits--;
    }
    const size = 2 ** (32 - maxBits);
    out.push({ base: s, prefix: maxBits });
    if (s + size > 0xffffffff) break;
    s += size;
  }
  return out;
}

// ---------------- IPv6 ----------------

/** Parse an IPv6 string (with optional embedded IPv4 tail) to a 128-bit BigInt, or null. */
export function parseIpv6(input: string): bigint | null {
  let s = input.trim().toLowerCase();
  if (!s || /[^0-9a-f:.]/.test(s)) return null;
  // embedded IPv4 tail → two hex groups
  const v4m = s.match(/^(.*:)(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})$/);
  if (v4m) {
    const v4 = parseIpv4(v4m[2]!);
    if (v4 === null) return null;
    s = v4m[1]! + ((v4 >>> 16) & 0xffff).toString(16) + ':' + (v4 & 0xffff).toString(16);
  }
  const dbl = s.split('::');
  if (dbl.length > 2) return null;
  const parseGroups = (part: string): number[] | null => {
    if (part === '') return [];
    const gs = part.split(':');
    const out: number[] = [];
    for (const g of gs) {
      if (!/^[0-9a-f]{1,4}$/.test(g)) return null;
      out.push(parseInt(g, 16));
    }
    return out;
  };
  let groups: number[];
  if (dbl.length === 2) {
    const left = parseGroups(dbl[0]!);
    const right = parseGroups(dbl[1]!);
    if (!left || !right || left.length + right.length > 7) return null;
    groups = [...left, ...Array(8 - left.length - right.length).fill(0), ...right];
  } else {
    const g = parseGroups(s);
    if (!g || g.length !== 8) return null;
    groups = g;
  }
  let n = 0n;
  for (const g of groups) n = (n << 16n) | BigInt(g);
  return n;
}

export function ipv6Groups(n: bigint): number[] {
  const out: number[] = [];
  for (let i = 7; i >= 0; i--) out.push(Number((n >> BigInt(i * 16)) & 0xffffn));
  return out;
}

/** Full uncompressed form: eight 4-digit groups. */
export function ipv6Expand(n: bigint): string {
  return ipv6Groups(n).map((g) => g.toString(16).padStart(4, '0')).join(':');
}

/** RFC 5952 canonical compression: lowercase, longest zero-run (≥2 groups, leftmost) → :: */
export function ipv6Compress(n: bigint): string {
  const groups = ipv6Groups(n);
  let bestStart = -1, bestLen = 0, curStart = -1, curLen = 0;
  for (let i = 0; i < 8; i++) {
    if (groups[i] === 0) {
      if (curStart === -1) curStart = i;
      curLen++;
      if (curLen > bestLen) { bestLen = curLen; bestStart = curStart; }
    } else { curStart = -1; curLen = 0; }
  }
  const hex = groups.map((g) => g.toString(16));
  if (bestLen < 2) return hex.join(':');
  const left = hex.slice(0, bestStart).join(':');
  const right = hex.slice(bestStart + bestLen).join(':');
  return `${left}::${right}`;
}

export function ipv6NetworkStart(n: bigint, prefix: number): bigint {
  const host = 128n - BigInt(prefix);
  return (n >> host) << host;
}

export function ipv6NetworkEnd(n: bigint, prefix: number): bigint {
  const host = 128n - BigInt(prefix);
  return ((n >> host) << host) | ((1n << host) - 1n);
}

/** Format a huge address count like "18,446,744,073,709,551,616 (2^64)". */
export function bigCount(bits: number): string {
  const n = 1n << BigInt(bits);
  const s = n.toString();
  const grouped = s.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${grouped} (2^${bits})`;
}

// ---------------- MAC ----------------

/** Parse any common MAC format → 12 lowercase hex chars, or null. */
export function parseMac(s: string): string | null {
  const hex = s.trim().toLowerCase().replace(/[:\-.\s]/g, '');
  return /^[0-9a-f]{12}$/.test(hex) ? hex : null;
}

export function macFormats(hex: string) {
  const pairs = hex.match(/.{2}/g)!;
  const quads = hex.match(/.{4}/g)!;
  return {
    colon: pairs.join(':'),
    hyphen: pairs.join('-'),
    cisco: quads.join('.'),
    bare: hex,
  };
}

/** EUI-64 interface identifier from a 48-bit MAC (insert ff:fe, flip U/L bit). */
export function macToEui64(hex: string): string {
  const bytes = hex.match(/.{2}/g)!.map((b) => parseInt(b, 16));
  const flipped = bytes[0]! ^ 0x02;
  const eui = [flipped, bytes[1]!, bytes[2]!, 0xff, 0xfe, bytes[3]!, bytes[4]!, bytes[5]!];
  return eui.map((b) => b.toString(16).padStart(2, '0')).join('');
}

/** IPv6 link-local address (fe80::/64 + EUI-64), RFC 5952 compressed. */
export function macToLinkLocal(hex: string): string {
  const eui = macToEui64(hex);
  const n = (0xfe80n << 112n) | BigInt('0x' + eui);
  return ipv6Compress(n);
}

// ---------------- cron ----------------

const MONTH_NAMES = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
const DOW_NAMES = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DOW_FULL = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTH_FULL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export interface CronField {
  values: Set<number>;
  restricted: boolean; // false when the field is "*"
  text: string;
}

function parseCronField(raw: string, min: number, max: number, names?: string[]): CronField | null {
  let f = raw.toLowerCase();
  if (names) for (let i = 0; i < names.length; i++) f = f.replaceAll(names[i]!, String(min === 0 && names === DOW_NAMES ? i : i + 1));
  const values = new Set<number>();
  let restricted = true;
  for (const part of f.split(',')) {
    const m = part.match(/^(\*|\d+(?:-\d+)?)(?:\/(\d+))?$/);
    if (!m) return null;
    const [, rangeRaw, stepRaw] = m;
    const step = stepRaw ? parseInt(stepRaw, 10) : 1;
    if (step < 1) return null;
    let lo = min, hi = max;
    if (rangeRaw !== '*') {
      const [a, b] = rangeRaw!.split('-').map((x) => parseInt(x, 10));
      lo = a!;
      hi = b === undefined ? (stepRaw ? max : a!) : b;
      if (lo < min || hi > max + (names === DOW_NAMES ? 1 : 0) || lo > hi) return null;
    } else if (!stepRaw) restricted = restricted && f !== '*' ? restricted : f === '*' ? false : restricted;
    for (let v = lo; v <= hi; v += step) values.add(names === DOW_NAMES && v === 7 ? 0 : v);
  }
  if (f === '*') restricted = false;
  return { values, restricted, text: raw };
}

export interface ParsedCron {
  minute: CronField;
  hour: CronField;
  dom: CronField;
  month: CronField;
  dow: CronField;
}

export function parseCron(expr: string): ParsedCron | null {
  const fields = expr.trim().split(/\s+/);
  if (fields.length !== 5) return null;
  const minute = parseCronField(fields[0]!, 0, 59);
  const hour = parseCronField(fields[1]!, 0, 23);
  const dom = parseCronField(fields[2]!, 1, 31);
  const month = parseCronField(fields[3]!, 1, 12, MONTH_NAMES);
  const dow = parseCronField(fields[4]!, 0, 7, DOW_NAMES);
  if (!minute || !hour || !dom || !month || !dow) return null;
  return { minute, hour, dom, month, dow };
}

function matches(c: ParsedCron, d: Date): boolean {
  if (!c.minute.values.has(d.getMinutes()) && c.minute.restricted) return false;
  if (!c.hour.values.has(d.getHours()) && c.hour.restricted) return false;
  if (!c.month.values.has(d.getMonth() + 1) && c.month.restricted) return false;
  // standard cron: if BOTH dom and dow are restricted, either may match
  const domOk = !c.dom.restricted || c.dom.values.has(d.getDate());
  const dowOk = !c.dow.restricted || c.dow.values.has(d.getDay());
  if (c.dom.restricted && c.dow.restricted) return domOk || dowOk;
  return domOk && dowOk;
}

/** Next `count` run times after `from` (local time). Scans up to 5 years. */
export function cronNextRuns(c: ParsedCron, from: Date, count: number): Date[] {
  const out: Date[] = [];
  const d = new Date(from);
  d.setSeconds(0, 0);
  d.setMinutes(d.getMinutes() + 1);
  const limit = new Date(from);
  limit.setFullYear(limit.getFullYear() + 5);
  while (out.length < count && d < limit) {
    if (matches(c, d)) out.push(new Date(d));
    d.setMinutes(d.getMinutes() + 1);
  }
  return out;
}

function listOf(values: Set<number>, fmt: (n: number) => string): string {
  const sorted = [...values].sort((a, b) => a - b);
  const parts = sorted.map(fmt);
  if (parts.length === 1) return parts[0]!;
  return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1]!;
}

/** Plain-English description of a parsed cron expression. */
export function cronDescribe(c: ParsedCron): string {
  const two = (n: number) => String(n).padStart(2, '0');
  let time: string;
  const stepM = c.minute.text.match(/^\*\/(\d+)$/);
  if (!c.minute.restricted && !c.hour.restricted) time = 'Every minute';
  else if (stepM && !c.hour.restricted) time = `Every ${stepM[1]} minutes`;
  else if (stepM && c.hour.restricted) time = `Every ${stepM[1]} minutes during hour${c.hour.values.size > 1 ? 's' : ''} ${listOf(c.hour.values, String)}`;
  else if (!c.minute.restricted && c.hour.restricted) time = `Every minute during hour${c.hour.values.size > 1 ? 's' : ''} ${listOf(c.hour.values, String)}`;
  else if (c.hour.restricted) {
    const times: string[] = [];
    for (const h of [...c.hour.values].sort((a, b) => a - b))
      for (const m of [...c.minute.values].sort((a, b) => a - b)) times.push(`${two(h)}:${two(m)}`);
    time = times.length <= 6 ? `At ${times.slice(0, -1).join(', ')}${times.length > 1 ? ' and ' : ''}${times[times.length - 1]}` : `At ${times.length} times per day`;
  } else time = `At minute ${listOf(c.minute.values, String)} of every hour`;

  const parts: string[] = [time];
  if (c.dom.restricted && c.dow.restricted)
    parts.push(`on day ${listOf(c.dom.values, String)} of the month or on ${listOf(c.dow.values, (n) => DOW_FULL[n]!)}`);
  else if (c.dom.restricted) parts.push(`on day ${listOf(c.dom.values, String)} of the month`);
  else if (c.dow.restricted) parts.push(`on ${listOf(c.dow.values, (n) => DOW_FULL[n]!)}`);
  if (c.month.restricted) parts.push(`in ${listOf(c.month.values, (n) => MONTH_FULL[n - 1]!)}`);
  return parts.join(', ') + '.';
}
