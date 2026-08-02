import { useMemo, useState } from 'preact/hooks';
import { validateGtin, completeGtin, validateIsbn, validateIssn } from '../../lib/checkdigits';

export default function BarcodeValidatorTool() {
  const [input, setInput] = useState('4006381333931');

  const result = useMemo(() => {
    const raw = input.trim();
    if (!raw) return null;
    const digits = raw.replace(/[\s-]/g, '');
    // Try each validator; report the ones that apply.
    const gtin = validateGtin(raw);
    const isbn = validateIsbn(raw);
    const issn = validateIssn(raw);
    const complete = completeGtin(raw); // when they entered data digits only
    return { digits, gtin, isbn, issn, complete };
  }, [input]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  const badge = (valid: boolean) => (
    <span class={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-bold ${valid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>{valid ? '✓ Valid' : '✕ Invalid'}</span>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Barcode / ISBN / ISSN number</span>
        <input class={inp} value={input} onInput={(e) => setInput((e.target as HTMLInputElement).value)} placeholder="4006381333931" />
      </label>

      {result && (
        <div class="mt-4 space-y-3">
          {result.gtin && (
            <div class={`rounded-xl bg-white p-4 ring-2 ${result.gtin.valid ? 'ring-emerald-200' : 'ring-rose-200'}`}>
              <div class="flex items-center justify-between"><p class="font-semibold text-slate-800">{result.gtin.format}</p>{badge(result.gtin.valid)}</div>
              <p class="mt-1 text-sm text-slate-600">Check digit is <span class="font-mono font-semibold">{result.gtin.actualCheckDigit}</span>; the correct check digit for this number is <span class="font-mono font-semibold">{result.gtin.expectedCheckDigit}</span>.{!result.gtin.valid && ` So the barcode is mistyped or invalid.`}</p>
            </div>
          )}
          {result.isbn && (
            <div class={`rounded-xl bg-white p-4 ring-2 ${result.isbn.valid ? 'ring-emerald-200' : 'ring-rose-200'}`}>
              <div class="flex items-center justify-between"><p class="font-semibold text-slate-800">{result.isbn.type}</p>{badge(result.isbn.valid)}</div>
              <p class="mt-1 text-sm text-slate-600">Correct check digit: <span class="font-mono font-semibold">{result.isbn.expectedCheckDigit}</span>.</p>
            </div>
          )}
          {result.issn && (
            <div class={`rounded-xl bg-white p-4 ring-2 ${result.issn.valid ? 'ring-emerald-200' : 'ring-rose-200'}`}>
              <div class="flex items-center justify-between"><p class="font-semibold text-slate-800">ISSN</p>{badge(result.issn.valid)}</div>
              <p class="mt-1 text-sm text-slate-600">Correct check digit: <span class="font-mono font-semibold">{result.issn.expectedCheckDigit}</span>.</p>
            </div>
          )}
          {result.complete && !result.gtin && (
            <div class="rounded-xl bg-brand-50 p-4 ring-2 ring-brand-200">
              <p class="text-sm font-semibold text-brand-800">Looks like a barcode missing its check digit</p>
              <p class="mt-1 text-sm text-slate-700">The complete barcode would be <span class="font-mono text-base font-bold text-brand-800">{result.complete}</span> — the last digit is the calculated check digit.</p>
            </div>
          )}
          {!result.gtin && !result.isbn && !result.issn && !result.complete && (
            <p class="rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">Not a recognized barcode/ISBN/ISSN length. EAN-13, UPC-A (12), EAN-8, GTIN-14, ISBN-10/13 (10/13) and ISSN (8) are supported.</p>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Validates the check digit of EAN-13, UPC-A, EAN-8 and GTIN-14 barcodes, plus ISBN-10/13 and ISSN. The check digit is the last digit, computed from all the others by a fixed formula (GS1 mod-10, or mod-11 for ISBN-10/ISSN) — so a single mistyped or transposed digit almost always fails the check. Enter the digits without the check digit and the tool tells you the complete barcode. 🔒 All computed in your browser.</p>
    </div>
  );
}
