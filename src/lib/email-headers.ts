/**
 * Parse raw email headers (or a pasted .eml) into a readable analysis: the
 * Received-hop delivery timeline with per-hop delays, the authentication
 * results (SPF / DKIM / DMARC) that are ALREADY present in the headers, and the
 * key identity headers. Strictly parse-only — it reads what the mail servers
 * wrote; it performs no live DNS lookups (SPF/DKIM/DMARC records aren't
 * checked, only the results the receiving server recorded). Pure and
 * deterministic apart from Date string parsing.
 */

export interface Header { name: string; value: string; }

export interface Hop {
  index: number;            // 1 = first (oldest) hop
  from?: string;
  by?: string;
  with?: string;
  id?: string;
  for?: string;
  dateText?: string;
  epoch: number | null;
  delaySec: number | null;  // delay from the previous (older) hop
}

export interface EmailAnalysis {
  headers: Header[];
  from?: string; to?: string; cc?: string; subject?: string; date?: string;
  messageId?: string; returnPath?: string; replyTo?: string; mailer?: string; contentType?: string;
  hops: Hop[];
  totalTransitSec: number | null;
  auth: { spf?: string; dkim?: string; dmarc?: string; compauth?: string };
  receivedSpf?: string;
  dkimSignatures: { domain?: string; selector?: string }[];
}

/** Split a raw message into unfolded headers (stops at the first blank line). */
export function parseHeaders(raw: string): Header[] {
  const text = raw.replace(/\r\n/g, '\n');
  const end = text.indexOf('\n\n');
  const block = end === -1 ? text : text.slice(0, end);
  const lines = block.split('\n');
  const out: Header[] = [];
  for (const line of lines) {
    if (/^[ \t]/.test(line) && out.length) {
      out[out.length - 1]!.value += ' ' + line.trim();
    } else {
      const c = line.indexOf(':');
      if (c > 0) out.push({ name: line.slice(0, c).trim(), value: line.slice(c + 1).trim() });
    }
  }
  return out;
}

const get = (h: Header[], name: string) => h.find((x) => x.name.toLowerCase() === name.toLowerCase())?.value;
const getAll = (h: Header[], name: string) => h.filter((x) => x.name.toLowerCase() === name.toLowerCase()).map((x) => x.value);

function parseReceived(value: string): Omit<Hop, 'index' | 'delaySec'> {
  const semi = value.lastIndexOf(';');
  const dateText = semi >= 0 ? value.slice(semi + 1).trim() : undefined;
  const meta = semi >= 0 ? value.slice(0, semi) : value;
  const m = (re: RegExp) => meta.match(re)?.[1];
  const cleanDate = dateText?.replace(/\s*\([^)]*\)\s*$/, '').trim(); // strip "(PDT)" comment
  const epoch = cleanDate ? Date.parse(cleanDate) : NaN;
  return {
    from: m(/\bfrom\s+([^\s;]+)/i),
    by: m(/\bby\s+([^\s;]+)/i),
    with: m(/\bwith\s+([^\s;()]+)/i),
    id: m(/\bid\s+([^\s;]+)/i),
    for: m(/\bfor\s+<?([^\s;<>]+)>?/i),
    dateText,
    epoch: Number.isNaN(epoch) ? null : epoch,
  };
}

/** Pull the mechanism results out of an Authentication-Results value. */
function parseAuthResults(value: string): { spf?: string; dkim?: string; dmarc?: string; compauth?: string } {
  const grab = (mech: string) => value.match(new RegExp(`\\b${mech}=([a-z]+)`, 'i'))?.[1]?.toLowerCase();
  return { spf: grab('spf'), dkim: grab('dkim'), dmarc: grab('dmarc'), compauth: grab('compauth') };
}

export function analyzeEmail(raw: string): EmailAnalysis {
  const headers = parseHeaders(raw);
  if (headers.length === 0) throw new Error('No email headers found — paste the full headers (or a .eml file).');

  // Received headers are listed newest-first; reverse for a chronological path.
  const received = getAll(headers, 'Received').map(parseReceived).reverse();
  const hops: Hop[] = received.map((r, i) => {
    const prev = i > 0 ? received[i - 1]! : null;
    const delaySec = prev && prev.epoch !== null && r.epoch !== null ? (r.epoch - prev.epoch) / 1000 : null;
    return { index: i + 1, ...r, delaySec };
  });

  const epochs = hops.map((h) => h.epoch).filter((e): e is number => e !== null);
  const totalTransitSec = epochs.length >= 2 ? (Math.max(...epochs) - Math.min(...epochs)) / 1000 : null;

  const authHeader = getAll(headers, 'Authentication-Results').join('; ');
  const auth = authHeader ? parseAuthResults(authHeader) : {};

  const dkimSignatures = getAll(headers, 'DKIM-Signature').map((v) => ({
    domain: v.match(/\bd=([^;\s]+)/)?.[1],
    selector: v.match(/\bs=([^;\s]+)/)?.[1],
  }));

  return {
    headers,
    from: get(headers, 'From'), to: get(headers, 'To'), cc: get(headers, 'Cc'),
    subject: get(headers, 'Subject'), date: get(headers, 'Date'),
    messageId: get(headers, 'Message-ID'), returnPath: get(headers, 'Return-Path'),
    replyTo: get(headers, 'Reply-To'), mailer: get(headers, 'X-Mailer') ?? get(headers, 'User-Agent'),
    contentType: get(headers, 'Content-Type'),
    hops, totalTransitSec, auth,
    receivedSpf: get(headers, 'Received-SPF'),
    dkimSignatures,
  };
}

export function formatDelay(sec: number | null): string {
  if (sec === null) return '—';
  if (sec < 0) return `${sec.toFixed(0)}s (clock skew)`;
  if (sec < 60) return `${sec.toFixed(0)}s`;
  if (sec < 3600) return `${Math.floor(sec / 60)}m ${Math.round(sec % 60)}s`;
  return `${Math.floor(sec / 3600)}h ${Math.round((sec % 3600) / 60)}m`;
}
