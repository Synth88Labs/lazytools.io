import { useMemo, useState } from 'preact/hooks';
import { encodeFloat, decodeBits, type FloatFormat } from '../../lib/ieee754';

const catColor: Record<string, string> = {
  normal: 'text-slate-800', subnormal: 'text-amber-700', zero: 'text-slate-500',
  infinity: 'text-blue-700', nan: 'text-rose-700',
};

function FormatCard({ f }: { f: FloatFormat }) {
  const [sBit, eBits, mBits] = f.binary.split(' ');
  return (
    <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
      <div class="mb-2 flex items-center justify-between">
        <p class="text-sm font-bold text-slate-800">{f.name}</p>
        <span class="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-500">{f.category}</span>
      </div>
      <p class="break-all font-mono text-sm">
        <span class="rounded bg-rose-100 px-0.5 text-rose-700" title="sign">{sBit}</span>{' '}
        <span class="rounded bg-sky-100 px-0.5 text-sky-700" title="exponent">{eBits}</span>{' '}
        <span class="rounded bg-emerald-100 px-0.5 text-emerald-700" title="mantissa">{mBits}</span>
      </p>
      <div class="mt-2 grid grid-cols-2 gap-x-4 gap-y-0.5 text-xs text-slate-600">
        <span>Hex: <span class="font-mono text-slate-800">{f.hex}</span></span>
        <span>Sign: <span class="font-mono">{f.sign}</span> ({f.sign ? '−' : '+'})</span>
        <span>Exponent: <span class="font-mono">{f.exponentRaw}</span>{f.exponentUnbiased !== null && <span class="text-slate-400"> (bias {f.bias} → {f.exponentUnbiased >= 0 ? '+' : ''}{f.exponentUnbiased})</span>}</span>
        <span>Mantissa: <span class="font-mono">{f.mantissaHex}</span></span>
      </div>
      <div class="mt-2 border-t border-slate-100 pt-2 text-sm">
        <span class="text-slate-500">Stored value: </span>
        <span class={`font-mono font-semibold ${catColor[f.category]}`}>{Number.isNaN(f.stored) ? 'NaN' : f.stored}</span>
        {f.error !== 0 && <span class="text-slate-400"> · error {f.error > 0 ? '+' : ''}{f.error.toExponential(3)}</span>}
      </div>
    </div>
  );
}

export default function Ieee754Tool() {
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');
  const [num, setNum] = useState('3.14159');
  const [bits, setBits] = useState('0x40490fdb');
  const [width, setWidth] = useState<16 | 32 | 64>(32);

  const parseNum = (s: string): number | null => {
    const t = s.trim().toLowerCase();
    if (t === 'infinity' || t === 'inf' || t === '+inf') return Infinity;
    if (t === '-infinity' || t === '-inf') return -Infinity;
    if (t === 'nan') return NaN;
    if (t === '') return null;
    const v = Number(t);
    return Number.isNaN(v) && t !== 'nan' ? null : v;
  };

  const encoded = useMemo(() => (mode === 'encode' ? (() => {
    const v = parseNum(num);
    if (v === null) return { formats: null, error: 'Enter a number (or Infinity / -Infinity / NaN).' };
    return { formats: encodeFloat(v), error: null as string | null };
  })() : null), [mode, num]);

  const decoded = useMemo(() => (mode === 'decode' ? (() => {
    if (!bits.trim()) return { format: null, error: null as string | null };
    try { return { format: decodeBits(bits, width), error: null }; }
    catch (e) { return { format: null, error: e instanceof Error ? e.message : 'Could not decode' }; }
  })() : null), [mode, bits, width]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 inline-flex rounded-xl bg-slate-200 p-1 text-sm font-semibold">
        <button onClick={() => setMode('encode')} class={`rounded-lg px-3 py-1 ${mode === 'encode' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Number → bits</button>
        <button onClick={() => setMode('decode')} class={`rounded-lg px-3 py-1 ${mode === 'decode' ? 'bg-white text-brand-800 shadow' : 'text-slate-600'}`}>Bits → number</button>
      </div>

      {mode === 'encode' ? (
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Decimal number</span>
          <input class={inp} value={num} onInput={(e) => setNum((e.target as HTMLInputElement).value)} placeholder="3.14159 · 0.1 · 1e10 · Infinity · NaN" />
        </label>
      ) : (
        <div class="flex flex-wrap items-end gap-3">
          <label class="flex-1"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Bit pattern (hex or binary)</span>
            <input class={inp} value={bits} onInput={(e) => setBits((e.target as HTMLInputElement).value)} placeholder="0x40490fdb" />
          </label>
          <label class="text-sm text-slate-600">Width
            <select class="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" value={String(width)} onChange={(e) => setWidth(Number((e.target as HTMLSelectElement).value) as 16 | 32 | 64)}>
              <option value="16">16-bit (half)</option>
              <option value="32">32-bit (single)</option>
              <option value="64">64-bit (double)</option>
            </select>
          </label>
        </div>
      )}

      {(encoded?.error || decoded?.error) && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {encoded?.error || decoded?.error}</p>}

      {encoded?.formats && <div class="mt-4 space-y-3">{encoded.formats.map((f) => <FormatCard f={f} />)}</div>}
      {decoded?.format && <div class="mt-4"><FormatCard f={decoded.format} /></div>}

      <p class="mt-4 text-xs text-slate-500">Convert a decimal number to its IEEE 754 half (16-bit), single (32-bit) and double (64-bit) representations — or paste a raw bit pattern to decode it. Each result breaks out the <span class="text-rose-700">sign</span>, <span class="text-sky-700">exponent</span> and <span class="text-emerald-700">mantissa</span> fields, the hex, the exact value that gets stored, and the rounding error versus your input (this is why 0.1 isn&#39;t exactly 0.1 in a computer). Single and double are byte-exact; everything runs in your browser. 🔒</p>
    </div>
  );
}
