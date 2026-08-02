/**
 * vCard (.vcf, RFC 6350) ↔ CSV conversion for contact migration. Pure and
 * deterministic. Parses the common fields (FN, N, EMAIL, TEL, ORG, TITLE) from
 * one or many vCards, and builds vCards back from CSV rows with proper value
 * escaping. Reuses the RFC 4180 CSV parser from sql-gen.
 */
import { parseCsv } from './sql-gen.ts';

export interface Contact {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  organization: string;
  title: string;
}

const FIELDS: { key: keyof Contact; label: string }[] = [
  { key: 'fullName', label: 'Full Name' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
  { key: 'organization', label: 'Organization' },
  { key: 'title', label: 'Title' },
];

/** Unescape a vCard TEXT value (\, \; \n \\). */
function unescapeVcf(s: string): string {
  return s.replace(/\\n/gi, '\n').replace(/\\,/g, ',').replace(/\\;/g, ';').replace(/\\\\/g, '\\');
}
/** Escape a value for a vCard TEXT field. */
function escapeVcf(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');
}

/** Strip the "TYPE=...;" parameters from a property name, returning the base (e.g. "EMAIL"). */
function propBase(name: string): string {
  return name.split(';')[0].toUpperCase();
}

/** Parse one or more vCards into Contact rows. */
export function parseVcards(vcf: string): Contact[] {
  // Unfold folded lines (RFC 6350: a line beginning with space/tab continues the previous).
  const unfolded = vcf.replace(/\r\n|\r|\n/g, '\n').replace(/\n[ \t]/g, '');
  const blocks = unfolded.split(/BEGIN:VCARD/i).slice(1);
  const contacts: Contact[] = [];
  for (const block of blocks) {
    const body = block.split(/END:VCARD/i)[0];
    const c: Contact = { fullName: '', firstName: '', lastName: '', email: '', phone: '', organization: '', title: '' };
    for (const raw of body.split('\n')) {
      const line = raw.trim();
      if (!line) continue;
      const idx = line.indexOf(':');
      if (idx < 0) continue;
      const name = propBase(line.slice(0, idx));
      const value = unescapeVcf(line.slice(idx + 1).trim());
      if (name === 'FN') c.fullName = value;
      else if (name === 'N') {
        const parts = value.split(';');
        c.lastName = parts[0] || '';
        c.firstName = parts[1] || '';
      } else if (name === 'EMAIL' && !c.email) c.email = value;
      else if (name === 'TEL' && !c.phone) c.phone = value;
      else if (name === 'ORG' && !c.organization) c.organization = value.split(';')[0];
      else if (name === 'TITLE' && !c.title) c.title = value;
    }
    if (!c.fullName && (c.firstName || c.lastName)) c.fullName = `${c.firstName} ${c.lastName}`.trim();
    contacts.push(c);
  }
  return contacts;
}

function csvCell(v: string): string {
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

/** vCard(s) → CSV string. */
export function vcardsToCsv(vcf: string): { output: string; count: number } {
  const contacts = parseVcards(vcf);
  if (!contacts.length) throw new Error('No vCards found (each contact starts with BEGIN:VCARD).');
  const header = FIELDS.map((f) => f.label).join(',');
  const rows = contacts.map((c) => FIELDS.map((f) => csvCell(c[f.key])).join(','));
  return { output: [header, ...rows].join('\n'), count: contacts.length };
}

/** CSV (header row) → vCard(s). Header names are matched loosely to fields. */
export function csvToVcards(csv: string): { output: string; count: number } {
  const rows = parseCsv(csv);
  if (rows.length < 2) throw new Error('Need a header row and at least one contact row.');
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const col = (aliases: string[]) => header.findIndex((h) => aliases.some((a) => h === a || h.includes(a)));
  // Full-name must match exactly so "First Name"/"Last Name" don't get grabbed by a bare "name".
  const iFull = header.findIndex((h) => ['full name', 'display name', 'name', 'fn'].includes(h));
  const iFirst = col(['first name', 'first', 'given']);
  const iLast = col(['last name', 'last', 'surname', 'family']);
  const iEmail = col(['email', 'e-mail']);
  const iPhone = col(['phone', 'tel', 'mobile']);
  const iOrg = col(['organization', 'organisation', 'company', 'org']);
  const iTitle = col(['title', 'job title', 'role']);
  const get = (row: string[], i: number) => (i >= 0 ? (row[i] ?? '').trim() : '');

  const cards: string[] = [];
  for (const row of rows.slice(1)) {
    const first = get(row, iFirst), last = get(row, iLast);
    let full = get(row, iFull);
    if (!full) full = `${first} ${last}`.trim();
    if (!full && !get(row, iEmail)) continue; // skip empty rows
    const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
    lines.push(`N:${escapeVcf(last)};${escapeVcf(first)};;;`);
    lines.push(`FN:${escapeVcf(full || `${first} ${last}`.trim())}`);
    const org = get(row, iOrg); if (org) lines.push(`ORG:${escapeVcf(org)}`);
    const title = get(row, iTitle); if (title) lines.push(`TITLE:${escapeVcf(title)}`);
    const email = get(row, iEmail); if (email) lines.push(`EMAIL;TYPE=INTERNET:${escapeVcf(email)}`);
    const phone = get(row, iPhone); if (phone) lines.push(`TEL:${escapeVcf(phone)}`);
    lines.push('END:VCARD');
    cards.push(lines.join('\r\n'));
  }
  if (!cards.length) throw new Error('No contact rows found.');
  return { output: cards.join('\r\n') + '\r\n', count: cards.length };
}
