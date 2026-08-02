import { useMemo, useState } from 'preact/hooks';
import { validateImei, luhnValid, luhnCheckDigit } from '../../lib/checkdigits';

export default function ImeiValidatorTool() {
  const [mode, setMode] = useState<'imei' | 'luhn'>('imei');
  const [input, setInput] = useState('490154203237518');
  const [luhnInput, setLuhnInput] = useState('4532015112830366');

  const imei = useMemo(() => (mode === 'imei' ? validateImei(input) : null), [mode, input]);
  const imeiLenBad = mode === 'imei' && input.replace(/[\s-]/g, '') !== '' && !imei;

  const luhn = useMemo(() => {
    if (mode !== 'luhn') return null;
    const d = luhnInput.replace(/[\s-]/g, '');
    if (!/^\d{2,}$/.test(d)) return null;
    return { valid: luhnValid(d), len: d.length, nextCheck: luhnCheckDigit(d) };
  }, [mode, luhnInput]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const badge = (valid: boolean) => (
    <span class={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-sm font-bold ${valid ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'}`}>{valid ? '✓ Passes checksum' : '✕ Fails checksum'}</span>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setMode('imei')} class={`rounded-lg px-3 py-1 ${mode === 'imei' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>IMEI (15 digits)</button>
        <button onClick={() => setMode('luhn')} class={`rounded-lg px-3 py-1 ${mode === 'luhn' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Luhn number</button>
      </div>

      {mode === 'imei' ? (
        <>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">IMEI</span>
            <input class={inp} value={input} onInput={(e) => setInput((e.target as HTMLInputElement).value)} placeholder="490154203237518" />
          </label>
          {imei && (
            <div class={`mt-4 rounded-xl bg-white p-4 ring-2 ${imei.valid ? 'ring-emerald-200' : 'ring-rose-200'}`}>
              <div class="flex items-center justify-between"><p class="font-semibold text-slate-800">15-digit IMEI</p>{badge(imei.valid)}</div>
              <div class="mt-3 grid gap-2 sm:grid-cols-3 text-sm">
                <div class="rounded-lg bg-slate-50 p-2"><p class="text-xs uppercase tracking-wide text-slate-500">TAC (model)</p><p class="font-mono font-semibold text-slate-800">{imei.tac}</p></div>
                <div class="rounded-lg bg-slate-50 p-2"><p class="text-xs uppercase tracking-wide text-slate-500">Serial</p><p class="font-mono font-semibold text-slate-800">{imei.serial}</p></div>
                <div class="rounded-lg bg-slate-50 p-2"><p class="text-xs uppercase tracking-wide text-slate-500">Check digit</p><p class="font-mono font-semibold text-slate-800">{imei.checkDigit} (should be {imei.expectedCheckDigit})</p></div>
              </div>
              <p class="mt-2 text-xs text-slate-500">The TAC (Type Allocation Code) identifies the model; the checksum only verifies the number is well-formed, not that a device exists.</p>
            </div>
          )}
          {imeiLenBad && <p class="mt-4 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-600">An IMEI is exactly 15 digits. Enter all 15 (IMEISV with a 16th software-version digit isn't checked here).</p>}
        </>
      ) : (
        <>
          <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Number (credit-card format, IMEI, etc.)</span>
            <input class={inp} value={luhnInput} onInput={(e) => setLuhnInput((e.target as HTMLInputElement).value)} placeholder="4532 0151 1283 0366" />
          </label>
          {luhn && (
            <div class={`mt-4 rounded-xl bg-white p-4 ring-2 ${luhn.valid ? 'ring-emerald-200' : 'ring-rose-200'}`}>
              <div class="flex items-center justify-between"><p class="font-semibold text-slate-800">{luhn.len}-digit number</p>{badge(luhn.valid)}</div>
              <p class="mt-1 text-sm text-slate-600">{luhn.valid ? 'The Luhn checksum is satisfied — the number is well-formed.' : `The Luhn checksum fails. To make these digits valid, the check digit should be ${luhn.nextCheck}.`}</p>
            </div>
          )}
        </>
      )}

      <p class="mt-4 text-xs text-slate-500">Checks the Luhn checksum — the same formula that guards credit-card numbers, IMEIs, and many ID numbers: doubling every second digit from the right (subtracting 9 if over 9) and confirming the total is a multiple of 10. It catches most single-digit typos and adjacent transpositions. Note a passing checksum only means the number is <em>well-formed</em>, not that it's real, active or issued. 🔒 Computed in your browser — nothing is sent anywhere.</p>
    </div>
  );
}
