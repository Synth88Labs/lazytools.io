import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

/** E-invoice viewer: XRechnung / ZUGFeRD / Factur-X — UBL & CII XML, plus PDF-embedded XML. */

interface LineItem {
  name: string;
  qty: string;
  unitPrice: string;
  total: string;
}
interface Parsed {
  syntax: 'UBL' | 'CII';
  profile: string;
  profileUrn: string;
  profileWarning: string;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string;
  currency: string;
  seller: string;
  sellerVat: string;
  buyer: string;
  netTotal: string;
  taxTotal: string;
  grossTotal: string;
  duePayable: string;
  iban: string;
  paymentReference: string;
  lines: LineItem[];
  taxes: { rate: string; amount: string }[];
}

/** Namespace-agnostic descent: first element matching each localName in sequence. */
function el(root: Element | null, ...path: string[]): Element | null {
  let cur: Element | null = root;
  for (const name of path) {
    if (!cur) return null;
    cur = Array.from(cur.children).find((c) => c.localName === name) ?? null;
  }
  return cur;
}
const txt = (root: Element | null, ...path: string[]) => el(root, ...path)?.textContent?.trim() ?? '';
const all = (root: Element | null, name: string) => (root ? Array.from(root.children).filter((c) => c.localName === name) : []);

/** CII date format 102: YYYYMMDD → YYYY-MM-DD. */
function ciiDate(s: string): string {
  return /^\d{8}$/.test(s) ? `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6)}` : s;
}

/** Map a guideline URN (CII) or CustomizationID (UBL) to a friendly profile name + caveat. */
function detectProfile(urn: string): { profile: string; warning: string } {
  const u = urn.toLowerCase();
  if (!u) return { profile: '', warning: '' };
  if (u.includes('xrechnung') || u.includes('xeinkauf')) return { profile: 'XRechnung', warning: '' };
  if (u.includes('peppol')) return { profile: 'Peppol BIS Billing 3.0', warning: '' };
  if (u.includes('minimum'))
    return {
      profile: 'Factur-X / ZUGFeRD — MINIMUM',
      warning:
        'The MINIMUM profile carries only header data (parties, totals, VAT) — no line items. It is not a complete EN 16931 structured invoice; the full detail exists only in the human-readable PDF layer.',
    };
  if (u.includes('basicwl'))
    return {
      profile: 'Factur-X / ZUGFeRD — BASIC WL',
      warning:
        'The BASIC WL (without lines) profile omits line items by design — the structured data covers header and totals only; item detail exists only in the PDF layer.',
    };
  if (u.includes('extended')) return { profile: 'Factur-X / ZUGFeRD — EXTENDED', warning: '' };
  if (u.includes('basic')) return { profile: 'Factur-X / ZUGFeRD — BASIC', warning: '' };
  if (u.includes('en16931') || u.includes('en 16931')) return { profile: 'Factur-X / ZUGFeRD — EN 16931 (Comfort)', warning: '' };
  return { profile: '', warning: '' };
}

function parseCii(root: Element): Parsed {
  const profileUrn = txt(el(root, 'ExchangedDocumentContext', 'GuidelineSpecifiedDocumentContextParameter'), 'ID');
  const { profile, warning } = detectProfile(profileUrn);
  const doc = el(root, 'ExchangedDocument');
  const trans = el(root, 'SupplyChainTradeTransaction');
  const agreement = el(trans, 'ApplicableHeaderTradeAgreement');
  const settlement = el(trans, 'ApplicableHeaderTradeSettlement');
  const summation = el(settlement, 'SpecifiedTradeSettlementHeaderMonetarySummation');
  const seller = el(agreement, 'SellerTradeParty');
  const sellerVat = all(seller, 'SpecifiedTaxRegistration')
    .map((r) => txt(r, 'ID'))
    .filter(Boolean)
    .join(', ');
  const payment = el(settlement, 'SpecifiedTradeSettlementPaymentMeans');
  const dueDate = ciiDate(txt(el(settlement, 'SpecifiedTradePaymentTerms'), 'DueDateDateTime', 'DateTimeString'));

  const lines: LineItem[] = (trans ? all(trans, 'IncludedSupplyChainTradeLineItem') : []).map((li) => ({
    name: txt(el(li, 'SpecifiedTradeProduct'), 'Name'),
    qty: txt(el(li, 'SpecifiedLineTradeDelivery'), 'BilledQuantity'),
    unitPrice: txt(el(li, 'SpecifiedLineTradeAgreement', 'NetPriceProductTradePrice'), 'ChargeAmount'),
    total: txt(el(li, 'SpecifiedLineTradeSettlement', 'SpecifiedTradeSettlementLineMonetarySummation'), 'LineTotalAmount'),
  }));

  const taxes = (settlement ? all(settlement, 'ApplicableTradeTax') : []).map((t) => ({
    rate: txt(t, 'RateApplicablePercent'),
    amount: txt(t, 'CalculatedAmount'),
  }));

  return {
    syntax: 'CII',
    profile,
    profileUrn,
    profileWarning: warning,
    invoiceNumber: txt(doc, 'ID'),
    issueDate: ciiDate(txt(doc, 'IssueDateTime', 'DateTimeString')),
    dueDate,
    currency: txt(settlement, 'InvoiceCurrencyCode'),
    seller: txt(seller, 'Name'),
    sellerVat,
    buyer: txt(el(agreement, 'BuyerTradeParty'), 'Name'),
    netTotal: txt(summation, 'LineTotalAmount'),
    taxTotal: txt(summation, 'TaxTotalAmount'),
    grossTotal: txt(summation, 'GrandTotalAmount'),
    duePayable: txt(summation, 'DuePayableAmount'),
    iban: txt(el(payment, 'PayeePartyCreditorFinancialAccount'), 'IBANID'),
    paymentReference: txt(settlement, 'PaymentReference'),
    lines,
    taxes,
  };
}

function parseUbl(root: Element): Parsed {
  const profileUrn = txt(root, 'CustomizationID');
  const { profile, warning } = detectProfile(profileUrn);
  const supplier = el(root, 'AccountingSupplierParty', 'Party');
  const customer = el(root, 'AccountingCustomerParty', 'Party');
  const partyName = (p: Element | null) => txt(p, 'PartyLegalEntity', 'RegistrationName') || txt(p, 'PartyName', 'Name');
  const totals = el(root, 'LegalMonetaryTotal');

  const lines: LineItem[] = all(root, 'InvoiceLine').map((li) => ({
    name: txt(el(li, 'Item'), 'Name'),
    qty: txt(li, 'InvoicedQuantity'),
    unitPrice: txt(el(li, 'Price'), 'PriceAmount'),
    total: txt(li, 'LineExtensionAmount'),
  }));

  const taxes = all(el(root, 'TaxTotal'), 'TaxSubtotal').map((t) => ({
    rate: txt(el(t, 'TaxCategory'), 'Percent'),
    amount: txt(t, 'TaxAmount'),
  }));

  return {
    syntax: 'UBL',
    profile,
    profileUrn,
    profileWarning: warning,
    invoiceNumber: txt(root, 'ID'),
    issueDate: txt(root, 'IssueDate'),
    dueDate: txt(root, 'DueDate'),
    currency: txt(root, 'DocumentCurrencyCode'),
    seller: partyName(supplier),
    sellerVat: txt(supplier, 'PartyTaxScheme', 'CompanyID'),
    buyer: partyName(customer),
    netTotal: txt(totals, 'LineExtensionAmount'),
    taxTotal: txt(el(root, 'TaxTotal'), 'TaxAmount'),
    grossTotal: txt(totals, 'TaxInclusiveAmount'),
    duePayable: txt(totals, 'PayableAmount'),
    iban: txt(el(root, 'PaymentMeans', 'PayeeFinancialAccount'), 'ID'),
    paymentReference: txt(el(root, 'PaymentMeans'), 'PaymentID'),
    lines,
    taxes,
  };
}

function parseXml(xml: string): Parsed {
  const dom = new DOMParser().parseFromString(xml, 'application/xml');
  if (dom.querySelector('parsererror')) throw new Error('Not well-formed XML — the file could not be parsed.');
  const root = dom.documentElement;
  if (root.localName === 'CrossIndustryInvoice') return parseCii(root);
  if (root.localName === 'Invoice' || root.localName === 'CreditNote') return parseUbl(root);
  if (root.localName === 'Faktura')
    throw new Error('This is a Polish KSeF structured invoice (FA schema) — open it in the dedicated KSeF viewer at /file/ksef-viewer/.');
  throw new Error(`Unrecognized root element <${root.localName}> — expected a UBL Invoice or UN/CEFACT CrossIndustryInvoice.`);
}

/** Pull embedded XML (factur-x.xml / zugferd / xrechnung) out of a PDF's EmbeddedFiles tree. */
async function extractXmlFromPdf(bytes: ArrayBuffer): Promise<string> {
  const { PDFDocument, PDFDict, PDFName, PDFArray, PDFRawStream, decodePDFRawStream, PDFString, PDFHexString } = await import('pdf-lib');
  const doc = await PDFDocument.load(bytes, { ignoreEncryption: true });
  const found: { name: string; bytes: Uint8Array }[] = [];

  const collect = (namesDict: PDFDict | undefined) => {
    if (!namesDict) return;
    const names = namesDict.lookupMaybe(PDFName.of('Names'), PDFArray);
    if (names) {
      for (let i = 0; i + 1 < names.size(); i += 2) {
        const rawName = names.lookup(i);
        const spec = names.lookupMaybe(i + 1, PDFDict);
        const ef = spec?.lookupMaybe(PDFName.of('EF'), PDFDict);
        const stream = ef?.lookupMaybe(PDFName.of('F'), PDFRawStream) ?? ef?.lookupMaybe(PDFName.of('UF'), PDFRawStream);
        if (stream) {
          const name = rawName instanceof PDFString || rawName instanceof PDFHexString ? rawName.decodeText() : String(rawName);
          found.push({ name, bytes: decodePDFRawStream(stream).decode() });
        }
      }
    }
    const kids = namesDict.lookupMaybe(PDFName.of('Kids'), PDFArray);
    if (kids) for (let i = 0; i < kids.size(); i++) collect(kids.lookupMaybe(i, PDFDict));
  };

  const catalogNames = doc.catalog.lookupMaybe(PDFName.of('Names'), PDFDict);
  collect(catalogNames?.lookupMaybe(PDFName.of('EmbeddedFiles'), PDFDict));

  if (!found.length) throw new Error('No embedded files in this PDF — it is not a ZUGFeRD/Factur-X hybrid invoice (plain scanned/printed PDFs carry no machine-readable data).');
  const xmlFile = found.find((f) => /\.xml$/i.test(f.name)) ?? found[0]!;
  return new TextDecoder('utf-8').decode(xmlFile.bytes);
}

export default function EInvoiceTool() {
  const [fileName, setFileName] = useState('');
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(`${f.name} (${fmtSize(f.size)})`);
    setError('');
    setParsed(null);
    setBusy(true);
    try {
      let xml: string;
      if (/\.pdf$/i.test(f.name)) xml = await extractXmlFromPdf(await f.arrayBuffer());
      else xml = await f.text();
      setParsed(parseXml(xml));
    } catch (err) {
      setError((err as Error).message);
    }
    setBusy(false);
  }

  const money = (v: string) => (v ? `${v} ${parsed?.currency ?? ''}`.trim() : '—');
  const row = (label: string, value: string) =>
    value ? (
      <div class="flex justify-between gap-3 border-b border-slate-100 py-1.5 last:border-0">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span class="text-right text-sm font-semibold text-slate-900">{value}</span>
      </div>
    ) : null;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept=".xml,.pdf,application/xml,text/xml,application/pdf" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose an e-invoice (.xml or .pdf)'}</span>
        <span class="mt-1 block text-xs text-slate-500">XRechnung XML · ZUGFeRD / Factur-X PDF — read entirely on your device</span>
      </label>

      {busy && <p class="mt-3 text-sm text-slate-600">Reading…</p>}
      {error && <p class="mt-3 text-sm font-medium text-red-700" aria-live="polite">✗ {error}</p>}

      {parsed && (
        <div class="mt-4 space-y-4" aria-live="polite">
          <div class="rounded-xl border border-brand-100 bg-white p-4">
            <p class="text-xs font-bold uppercase tracking-wide text-brand-700">Invoice {parsed.invoiceNumber || '(no number)'} · {parsed.syntax === 'CII' ? 'UN/CEFACT CII syntax (ZUGFeRD/XRechnung)' : 'UBL syntax (XRechnung/Peppol)'}</p>
            {parsed.profile && (
              <p class="mt-1 text-sm font-semibold text-slate-700" title={parsed.profileUrn}>
                Profile: <span class="rounded bg-brand-50 px-1.5 py-0.5 text-brand-800">{parsed.profile}</span>
              </p>
            )}
            {parsed.profileWarning && (
              <p class="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">⚠ {parsed.profileWarning}</p>
            )}
            <div class="mt-3 grid gap-x-8 sm:grid-cols-2">
              <div>
                {row('Seller', parsed.seller)}
                {row('Seller VAT ID', parsed.sellerVat)}
                {row('Buyer', parsed.buyer)}
                {row('Issue date', parsed.issueDate)}
                {row('Due date', parsed.dueDate)}
              </div>
              <div>
                {row('Net total', money(parsed.netTotal))}
                {row('Tax', money(parsed.taxTotal))}
                {row('Gross total', money(parsed.grossTotal))}
                {row('Amount due', money(parsed.duePayable))}
                {row('IBAN', parsed.iban)}
                {row('Payment reference', parsed.paymentReference)}
              </div>
            </div>
          </div>

          {parsed.lines.length > 0 && (
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th class="px-4 py-2">Item</th>
                    <th class="px-4 py-2 text-right">Qty</th>
                    <th class="px-4 py-2 text-right">Unit price</th>
                    <th class="px-4 py-2 text-right">Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.lines.map((l) => (
                    <tr class="border-b border-slate-100 last:border-0">
                      <td class="px-4 py-2 font-medium text-slate-900">{l.name || '—'}</td>
                      <td class="px-4 py-2 text-right text-slate-700">{l.qty || '—'}</td>
                      <td class="px-4 py-2 text-right text-slate-700">{l.unitPrice || '—'}</td>
                      <td class="px-4 py-2 text-right font-semibold text-slate-900">{l.total || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {parsed.taxes.length > 0 && (
            <p class="text-sm text-slate-600">
              VAT breakdown: {parsed.taxes.map((t) => `${t.rate || '?'}% → ${money(t.amount)}`).join(' · ')}
            </p>
          )}
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">Invoices are parsed with your browser's XML engine — financial data never leaves your device.</p>
    </div>
  );
}
