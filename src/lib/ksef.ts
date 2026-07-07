/**
 * KSeF FA(2)/FA(3) structured-invoice parsing + rule-based pre-checks.
 * Namespace-agnostic (schema namespaces differ per FA variant); pure functions.
 */

export function elK(root: Element | null, ...path: string[]): Element | null {
  let cur: Element | null = root;
  for (const name of path) {
    if (!cur) return null;
    cur = Array.from(cur.children).find((c) => c.localName === name) ?? null;
  }
  return cur;
}
export const txtK = (root: Element | null, ...path: string[]) => elK(root, ...path)?.textContent?.trim() ?? '';
export const allK = (root: Element | null, name: string) => (root ? Array.from(root.children).filter((c) => c.localName === name) : []);

/** Polish NIP mod-11 checksum (weights 6,5,7,2,3,4,5,6,7 over the first 9 digits). */
export function nipValid(nip: string): boolean {
  const d = nip.replace(/[\s-]/g, '');
  if (!/^\d{10}$/.test(d)) return false;
  const w = [6, 5, 7, 2, 3, 4, 5, 6, 7];
  const sum = w.reduce((acc, wi, i) => acc + wi * parseInt(d[i]!, 10), 0);
  const check = sum % 11;
  return check !== 10 && check === parseInt(d[9]!, 10);
}

export interface KsefLine {
  nr: string;
  name: string;
  unit: string;
  qty: string;
  unitPrice: string;
  net: string;
  vatRate: string;
}

export interface KsefParty {
  nip: string;
  name: string;
  country: string;
  address: string;
}

export interface KsefParsed {
  variant: string; // 'FA (2)' | 'FA (3)' | raw
  created: string;
  systemInfo: string;
  invoiceNumber: string; // P_2
  issueDate: string; // P_1
  saleDate: string; // P_6
  currency: string;
  invoiceType: string; // RodzajFaktury
  seller: KsefParty;
  buyer: KsefParty;
  total: string; // P_15
  vatGroups: { group: string; net: string; vat: string }[]; // P_13_x / P_14_x
  paymentDue: string;
  bankAccount: string;
  lines: KsefLine[];
}

function party(el: Element | null): KsefParty {
  const id = elK(el, 'DaneIdentyfikacyjne');
  const adres = elK(el, 'Adres');
  const addressParts = adres
    ? Array.from(adres.children)
        .filter((c) => c.localName !== 'KodKraju')
        .map((c) => c.textContent?.trim())
        .filter(Boolean)
    : [];
  return {
    nip: txtK(id, 'NIP'),
    name: txtK(id, 'Nazwa') || txtK(id, 'ImiePierwsze') + ' ' + txtK(id, 'Nazwisko'),
    country: txtK(adres, 'KodKraju'),
    address: addressParts.join(', '),
  };
}

export function parseKsef(root: Element): KsefParsed {
  const nag = elK(root, 'Naglowek');
  const kod = elK(nag, 'KodFormularza');
  const fa = elK(root, 'Fa');

  // VAT summary: any P_13_* / P_14_* pairs present on Fa
  const vatGroups: { group: string; net: string; vat: string }[] = [];
  if (fa) {
    for (const c of Array.from(fa.children)) {
      const m = c.localName.match(/^P_13_(\w+)$/);
      if (m) {
        const suffix = m[1]!;
        vatGroups.push({ group: suffix, net: c.textContent?.trim() ?? '', vat: txtK(fa, `P_14_${suffix}`) });
      }
    }
  }

  const lines: KsefLine[] = (fa ? allK(fa, 'FaWiersz') : []).map((w) => ({
    nr: txtK(w, 'NrWierszaFa'),
    name: txtK(w, 'P_7'),
    unit: txtK(w, 'P_8A'),
    qty: txtK(w, 'P_8B'),
    unitPrice: txtK(w, 'P_9A'),
    net: txtK(w, 'P_11') || txtK(w, 'P_11A') || txtK(w, 'P_10'),
    vatRate: txtK(w, 'P_12'),
  }));

  const platnosc = elK(fa, 'Platnosc');

  return {
    variant: kod?.getAttribute('kodSystemowy') ?? (txtK(nag, 'WariantFormularza') ? `FA (${txtK(nag, 'WariantFormularza')})` : ''),
    created: txtK(nag, 'DataWytworzeniaFa'),
    systemInfo: txtK(nag, 'SystemInfo'),
    invoiceNumber: txtK(fa, 'P_2'),
    issueDate: txtK(fa, 'P_1'),
    saleDate: txtK(fa, 'P_6'),
    currency: txtK(fa, 'KodWaluty'),
    invoiceType: txtK(fa, 'RodzajFaktury'),
    seller: party(elK(root, 'Podmiot1')),
    buyer: party(elK(root, 'Podmiot2')),
    total: txtK(fa, 'P_15'),
    vatGroups,
    paymentDue: txtK(platnosc, 'TerminPlatnosci', 'Termin') || txtK(platnosc, 'TerminPlatnosci'),
    bankAccount: txtK(elK(platnosc, 'RachunekBankowy'), 'NrRB'),
    lines,
  };
}

export interface KsefCheck {
  level: 'pass' | 'fail' | 'warn';
  name: string;
  detail: string;
}

/** Rule-based pre-checks — explicitly NOT official KSeF/MF validation. */
export function checkKsef(root: Element, parsed: KsefParsed): KsefCheck[] {
  const out: KsefCheck[] = [];
  const add = (level: KsefCheck['level'], name: string, detail: string) => out.push({ level, name, detail });

  if (root.localName === 'Faktura') add('pass', 'Root element', '<Faktura> — a KSeF structured invoice');
  else add('fail', 'Root element', `<${root.localName}> — expected <Faktura>`);

  const nag = elK(root, 'Naglowek');
  if (!nag) add('fail', 'Naglowek (header)', 'missing — required element');
  else {
    const variant = parsed.variant || '(none)';
    if (/FA \(3\)/.test(variant) || txtK(nag, 'WariantFormularza') === '3') add('pass', 'Schema variant', `${variant} — the current FA(3) structure (mandatory since 1 Feb 2026)`);
    else if (/FA \(2\)/.test(variant) || txtK(nag, 'WariantFormularza') === '2') add('warn', 'Schema variant', `${variant} — the older FA(2) structure; KSeF 2.0 requires FA(3)`);
    else add('warn', 'Schema variant', `unrecognized: ${variant}`);
  }

  // parties
  if (!elK(root, 'Podmiot1')) add('fail', 'Podmiot1 (seller)', 'missing — required element');
  else {
    if (!parsed.seller.name) add('warn', 'Seller name', 'Podmiot1 has no Nazwa');
    if (!parsed.seller.nip) add('fail', 'Seller NIP', 'missing — Podmiot1 must carry the seller’s NIP');
    else if (nipValid(parsed.seller.nip)) add('pass', 'Seller NIP checksum', `${parsed.seller.nip} — valid mod-11 check digit`);
    else add('fail', 'Seller NIP checksum', `${parsed.seller.nip} — check digit does not match (typo?)`);
  }
  if (!elK(root, 'Podmiot2')) add('fail', 'Podmiot2 (buyer)', 'missing — required element');
  else if (parsed.buyer.nip) {
    if (nipValid(parsed.buyer.nip)) add('pass', 'Buyer NIP checksum', `${parsed.buyer.nip} — valid mod-11 check digit`);
    else add('fail', 'Buyer NIP checksum', `${parsed.buyer.nip} — check digit does not match`);
  } else add('warn', 'Buyer NIP', 'not present (allowed for some buyer types, e.g. consumers/foreign entities)');

  // Fa essentials
  const fa = elK(root, 'Fa');
  if (!fa) add('fail', 'Fa (invoice data)', 'missing — required element');
  else {
    if (/^\d{4}-\d{2}-\d{2}$/.test(parsed.issueDate)) add('pass', 'P_1 issue date', parsed.issueDate);
    else add('fail', 'P_1 issue date', parsed.issueDate ? `"${parsed.issueDate}" — expected YYYY-MM-DD` : 'missing');
    if (parsed.invoiceNumber) add('pass', 'P_2 invoice number', parsed.invoiceNumber);
    else add('fail', 'P_2 invoice number', 'missing');
    if (/^[A-Z]{3}$/.test(parsed.currency)) add('pass', 'KodWaluty currency', parsed.currency);
    else add('fail', 'KodWaluty currency', parsed.currency ? `"${parsed.currency}" — expected a 3-letter ISO code` : 'missing');
    if (parsed.total && !isNaN(Number(parsed.total))) add('pass', 'P_15 total due', `${parsed.total} ${parsed.currency}`);
    else add('fail', 'P_15 total due', parsed.total ? `"${parsed.total}" — not numeric` : 'missing');
    if (parsed.lines.length > 0) add('pass', 'FaWiersz line items', `${parsed.lines.length} line${parsed.lines.length > 1 ? 's' : ''}`);
    else add('warn', 'FaWiersz line items', 'none found — unusual except for some correction invoices');

    // consistency: sum of line nets vs P_13_* sum (informational)
    const lineSum = parsed.lines.reduce((a, l) => a + (Number(l.net) || 0), 0);
    const p13Sum = parsed.vatGroups.reduce((a, g) => a + (Number(g.net) || 0), 0);
    if (parsed.lines.length && parsed.vatGroups.length) {
      if (Math.abs(lineSum - p13Sum) < 0.02) add('pass', 'Net totals consistency', `line nets (${lineSum.toFixed(2)}) match P_13_* sum (${p13Sum.toFixed(2)})`);
      else add('warn', 'Net totals consistency', `line nets sum to ${lineSum.toFixed(2)} but P_13_* fields sum to ${p13Sum.toFixed(2)} — worth checking (rounding or correction invoices can explain small gaps)`);
    }
  }
  return out;
}
