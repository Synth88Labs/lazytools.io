import { useState } from 'preact/hooks';
import { parseKsef, type KsefParsed } from '../../lib/ksef';

export default function KsefViewerTool() {
  const [fileName, setFileName] = useState('');
  const [parsed, setParsed] = useState<KsefParsed | null>(null);
  const [error, setError] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name);
    setError('');
    setParsed(null);
    try {
      const dom = new DOMParser().parseFromString(await f.text(), 'application/xml');
      if (dom.querySelector('parsererror')) throw new Error('Not well-formed XML — the file could not be parsed.');
      const root = dom.documentElement;
      if (root.localName !== 'Faktura') throw new Error(`Root element is <${root.localName}> — expected <Faktura>. For XRechnung/Factur-X/Peppol invoices, use the e-invoice viewer instead.`);
      setParsed(parseKsef(root));
    } catch (err) {
      setError((err as Error).message);
    }
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
        <input type="file" accept=".xml,application/xml,text/xml" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose a KSeF invoice (.xml)'}</span>
        <span class="mt-1 block text-xs text-slate-500">FA(2) / FA(3) faktura ustrukturyzowana — read entirely on your device</span>
      </label>

      {error && <p class="mt-3 text-sm font-medium text-red-700" aria-live="polite">✗ {error}</p>}

      {parsed && (
        <div class="mt-4 space-y-4" aria-live="polite">
          <div class="rounded-xl border border-brand-100 bg-white p-4">
            <p class="text-xs font-bold uppercase tracking-wide text-brand-700">
              Faktura {parsed.invoiceNumber || '(no number)'} · {parsed.variant || 'FA'}
              {parsed.invoiceType && <span class="ml-1 rounded bg-brand-50 px-1.5 py-0.5 text-brand-800">{parsed.invoiceType}</span>}
            </p>
            <div class="mt-3 grid gap-x-8 sm:grid-cols-2">
              <div>
                {row('Seller (Podmiot1)', parsed.seller.name)}
                {row('Seller NIP', parsed.seller.nip)}
                {row('Seller address', parsed.seller.address)}
                {row('Buyer (Podmiot2)', parsed.buyer.name)}
                {row('Buyer NIP', parsed.buyer.nip)}
              </div>
              <div>
                {row('Issue date (P_1)', parsed.issueDate)}
                {row('Sale date (P_6)', parsed.saleDate)}
                {row('Total due (P_15)', money(parsed.total))}
                {row('Payment due', parsed.paymentDue)}
                {row('Bank account (NrRB)', parsed.bankAccount)}
              </div>
            </div>
          </div>

          {parsed.lines.length > 0 && (
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-sm">
                <thead>
                  <tr class="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th class="px-3 py-2">#</th>
                    <th class="px-3 py-2">Item (P_7)</th>
                    <th class="px-3 py-2 text-right">Qty (P_8B)</th>
                    <th class="px-3 py-2 text-right">Unit price (P_9A)</th>
                    <th class="px-3 py-2 text-right">Net (P_11)</th>
                    <th class="px-3 py-2 text-right">VAT % (P_12)</th>
                  </tr>
                </thead>
                <tbody>
                  {parsed.lines.map((l) => (
                    <tr class="border-b border-slate-100 last:border-0">
                      <td class="px-3 py-2 text-slate-500">{l.nr || '—'}</td>
                      <td class="px-3 py-2 font-medium text-slate-900">{l.name || '—'}</td>
                      <td class="px-3 py-2 text-right text-slate-700">{l.qty ? `${l.qty} ${l.unit}`.trim() : '—'}</td>
                      <td class="px-3 py-2 text-right text-slate-700">{l.unitPrice || '—'}</td>
                      <td class="px-3 py-2 text-right font-semibold text-slate-900">{l.net || '—'}</td>
                      <td class="px-3 py-2 text-right text-slate-700">{l.vatRate || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {parsed.vatGroups.length > 0 && (
            <p class="text-sm text-slate-600">
              VAT summary (P_13/P_14 groups): {parsed.vatGroups.map((g) => `net ${g.net || '0'}${g.vat ? ` + VAT ${g.vat}` : ''} (group ${g.group})`).join(' · ')}
            </p>
          )}

          <div class="flex gap-2">
            <button type="button" onClick={() => window.print()} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:border-brand-400">
              🖨 Print / save as PDF
            </button>
          </div>
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">Parsed with your browser's XML engine — invoice data (parties, NIPs, amounts, bank account) never leaves your device.</p>
    </div>
  );
}
