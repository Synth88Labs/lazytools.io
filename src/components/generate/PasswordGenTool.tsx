import { useState } from 'preact/hooks';
import { generatePassword } from '../../lib/gen-compute';

export default function PasswordGenTool() {
  const [length, setLength] = useState(16);
  const [lower, setLower] = useState(true);
  const [upper, setUpper] = useState(true);
  const [digits, setDigits] = useState(true);
  const [symbols, setSymbols] = useState(true);
  const [noAmbiguous, setNoAmbiguous] = useState(false);
  const [result, setResult] = useState(() => generatePassword(16, { lower: true, upper: true, digits: true, symbols: true }, false));
  const [copied, setCopied] = useState(false);

  function regen(len = length, l = lower, u = upper, d = digits, s = symbols, na = noAmbiguous) {
    setResult(generatePassword(len, { lower: l, upper: u, digits: d, symbols: s }, na));
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(result.password);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* unavailable */ }
  }

  const strength =
    result.entropyBits >= 100 ? ['Excellent', 'bg-mint-600', 100] :
    result.entropyBits >= 80 ? ['Strong', 'bg-mint-500', 85] :
    result.entropyBits >= 60 ? ['Good', 'bg-amber-400', 65] :
    result.entropyBits >= 45 ? ['Fair', 'bg-amber-500', 45] : ['Weak', 'bg-red-500', 25];

  const check = (label: string, value: boolean, set: (v: boolean) => void, key: 'l' | 'u' | 'd' | 's' | 'na') => (
    <label class="flex items-center gap-2 text-sm font-medium text-slate-700">
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => {
          const v = (e.target as HTMLInputElement).checked;
          set(v);
          regen(length, key === 'l' ? v : lower, key === 'u' ? v : upper, key === 'd' ? v : digits, key === 's' ? v : symbols, key === 'na' ? v : noAmbiguous);
        }}
        class="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
      />
      {label}
    </label>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex flex-wrap items-center gap-3 rounded-xl border border-brand-100 bg-white p-4">
        <output class="min-w-0 flex-1 break-all font-mono text-xl font-bold text-slate-900" aria-live="polite">
          {result.password || '— pick at least one character set —'}
        </output>
        <div class="flex gap-2">
          <button type="button" onClick={() => regen()} class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700">
            🔄 New
          </button>
          <button type="button" onClick={copy} disabled={!result.password} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-brand-800 disabled:opacity-40">
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>

      <div class="mt-3 flex items-center gap-3">
        <span class="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
          <span class={`block h-full rounded-full ${strength[1]}`} style={`width:${strength[2]}%`} />
        </span>
        <span class="text-sm font-semibold text-slate-700">{strength[0]} · {result.entropyBits} bits</span>
      </div>

      <div class="mt-5">
        <label for="pw-length" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Length: {length} characters
        </label>
        <input
          id="pw-length"
          type="range"
          min={6}
          max={64}
          value={length}
          onInput={(e) => {
            const v = parseInt((e.target as HTMLInputElement).value, 10);
            setLength(v);
            regen(v);
          }}
          class="w-full accent-brand-600"
        />
      </div>

      <div class="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {check('Lowercase (a–z)', lower, setLower, 'l')}
        {check('Uppercase (A–Z)', upper, setUpper, 'u')}
        {check('Digits (0–9)', digits, setDigits, 'd')}
        {check('Symbols (!@#$…)', symbols, setSymbols, 's')}
        {check('Exclude ambiguous (l 1 I O 0)', noAmbiguous, setNoAmbiguous, 'na')}
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Generated with crypto.getRandomValues on your device — never transmitted, never stored. Entropy = length ×
        log₂(alphabet): each extra character beats any complexity rule.
      </p>
    </div>
  );
}
