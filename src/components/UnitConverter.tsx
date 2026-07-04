import { useEffect, useMemo, useState } from 'preact/hooks';

interface UnitDto {
  id: string;
  name: string;
  plural: string;
  symbol: string;
  factor: number;
  offset?: number;
}

interface Props {
  units: UnitDto[];
  initialFromId: string;
  initialToId: string;
  initialValue?: number;
}

function convert(value: number, from: UnitDto, to: UnitDto): number {
  const base = value * from.factor + (from.offset ?? 0);
  return (base - (to.offset ?? 0)) / to.factor;
}

function format(value: number, sig: number): string {
  if (!Number.isFinite(value)) return '';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1e15 || abs < 1e-9) return value.toExponential(Math.min(sig - 1, 8));
  return String(Number(value.toPrecision(sig)));
}

export default function UnitConverter({ units, initialFromId, initialToId, initialValue = 1 }: Props) {
  const [fromId, setFromId] = useState(initialFromId);
  const [toId, setToId] = useState(initialToId);
  const [fromText, setFromText] = useState(String(initialValue));
  const [toText, setToText] = useState(() => {
    const f = units.find((u) => u.id === initialFromId)!;
    const t = units.find((u) => u.id === initialToId)!;
    return format(convert(initialValue, f, t), 8);
  });
  /** which side the user last typed in — the other side is derived */
  const [lastEdited, setLastEdited] = useState<'from' | 'to'>('from');
  const [sig, setSig] = useState(8);
  const [copied, setCopied] = useState(false);

  const from = useMemo(() => units.find((u) => u.id === fromId)!, [units, fromId]);
  const to = useMemo(() => units.find((u) => u.id === toId)!, [units, toId]);

  // Allow deep links from search: /units/kg-to-lbs/?v=70
  useEffect(() => {
    const v = new URLSearchParams(window.location.search).get('v');
    if (v !== null && Number.isFinite(parseFloat(v))) {
      const num = parseFloat(v);
      setFromText(String(num));
      setLastEdited('from');
      setToText(format(convert(num, from, to), sig));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function recompute(fromValue: string, toValue: string, edited: 'from' | 'to', f: UnitDto, t: UnitDto) {
    if (edited === 'from') {
      const v = parseFloat(fromValue);
      setToText(Number.isFinite(v) ? format(convert(v, f, t), sig) : '');
    } else {
      const v = parseFloat(toValue);
      setFromText(Number.isFinite(v) ? format(convert(v, t, f), sig) : '');
    }
  }

  function onFromInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    setFromText(v);
    setLastEdited('from');
    recompute(v, toText, 'from', from, to);
  }

  function onToInput(e: Event) {
    const v = (e.target as HTMLInputElement).value;
    setToText(v);
    setLastEdited('to');
    recompute(fromText, v, 'to', from, to);
  }

  function onFromUnit(e: Event) {
    const id = (e.target as HTMLSelectElement).value;
    const f = units.find((u) => u.id === id)!;
    setFromId(id);
    recompute(fromText, toText, lastEdited, f, to);
  }

  function onToUnit(e: Event) {
    const id = (e.target as HTMLSelectElement).value;
    const t = units.find((u) => u.id === id)!;
    setToId(id);
    recompute(fromText, toText, lastEdited, from, t);
  }

  function swap() {
    const f = fromId;
    setFromId(toId);
    setToId(f);
    setFromText(toText);
    setToText(fromText);
  }

  function onPrecision(e: Event) {
    const s = parseInt((e.target as HTMLSelectElement).value, 10);
    setSig(s);
    if (lastEdited === 'from') {
      const v = parseFloat(fromText);
      if (Number.isFinite(v)) setToText(format(convert(v, from, to), s));
    } else {
      const v = parseFloat(toText);
      if (Number.isFinite(v)) setFromText(format(convert(v, to, from), s));
    }
  }

  async function copyResult() {
    const result = lastEdited === 'from' ? toText : fromText;
    const unit = lastEdited === 'from' ? to.symbol : from.symbol;
    try {
      await navigator.clipboard.writeText(`${result} ${unit}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  const factorLine = useMemo(() => {
    const one = convert(1, from, to);
    if (!from.offset && !to.offset) {
      return `1 ${from.symbol} = ${format(one, 10)} ${to.symbol}`;
    }
    return `${fromText || '…'} ${from.symbol} = ${toText || '…'} ${to.symbol}`;
  }, [from, to, fromText, toText]);

  /**
   * Human explanation of the current result. Any unit pair reduces to a
   * single linear step: to = from × m + c, where m = a1/a2 and c = (b1−b2)/a2.
   */
  const explainer = useMemo(() => {
    const src = lastEdited === 'from' ? from : to;
    const dst = lastEdited === 'from' ? to : from;
    const srcText = lastEdited === 'from' ? fromText : toText;
    const dstText = lastEdited === 'from' ? toText : fromText;
    const v = parseFloat(srcText);
    if (!Number.isFinite(v) || dstText === '') return null;

    const m = src.factor / dst.factor;
    const c = ((src.offset ?? 0) - (dst.offset ?? 0)) / dst.factor;
    const hasOffset = Math.abs(c) > 1e-12;

    const mF = format(m, 6);
    const cF = format(Math.abs(c), 6);
    const math = hasOffset
      ? `${format(v, 8)} × ${mF} ${c >= 0 ? '+' : '−'} ${cF} = ${dstText}`
      : `${format(v, 8)} × ${mF} = ${dstText}`;
    const why = hasOffset
      ? `These scales have different zero points, so the conversion multiplies by ${mF} and then shifts by ${c >= 0 ? '+' : '−'}${cF}.`
      : `1 ${src.symbol} equals ${mF} ${dst.symbol}, so multiplying by ${mF} converts the value. The result describes the exact same quantity — only the measuring stick changes.`;

    return { math, why, src, dst, srcVal: format(v, 8), dstVal: dstText };
  }, [from, to, fromText, toText, lastEdited]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
        <div>
          <label for="uc-from" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            From
          </label>
          <input
            id="uc-from"
            type="number"
            inputMode="decimal"
            step="any"
            value={fromText}
            onInput={onFromInput}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label={`Value in ${from.plural}`}
          />
          <select
            value={fromId}
            onChange={onFromUnit}
            class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
            aria-label="From unit"
          >
            {units.map((u) => (
              <option value={u.id}>{`${u.name} (${u.symbol})`}</option>
            ))}
          </select>
        </div>

        <button
          type="button"
          onClick={swap}
          title="Swap units"
          aria-label="Swap units"
          class="mx-auto mb-10 hidden h-11 w-11 items-center justify-center rounded-full border border-slate-300 bg-white text-lg text-slate-600 shadow-sm transition hover:border-brand-400 hover:text-brand-600 sm:flex"
        >
          ⇄
        </button>

        <div>
          <label for="uc-to" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            To
          </label>
          <input
            id="uc-to"
            type="number"
            inputMode="decimal"
            step="any"
            value={toText}
            onInput={onToInput}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-lg font-semibold text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
            aria-label={`Value in ${to.plural}`}
          />
          <select
            value={toId}
            onChange={onToUnit}
            class="mt-2 w-full rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm text-slate-700 focus:border-brand-500 focus:outline-none"
            aria-label="To unit"
          >
            {units.map((u) => (
              <option value={u.id}>{`${u.name} (${u.symbol})`}</option>
            ))}
          </select>
        </div>
      </div>

      <div class="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 text-sm">
        <p class="font-medium text-slate-600">{factorLine}</p>
        <div class="flex items-center gap-2">
          <button
            type="button"
            onClick={swap}
            class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-slate-600 hover:border-brand-400 hover:text-brand-600 sm:hidden"
          >
            ⇄ Swap
          </button>
          <label class="flex items-center gap-1.5 text-slate-500">
            Precision
            <select
              value={String(sig)}
              onChange={onPrecision}
              class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-700 focus:outline-none"
            >
              <option value="4">4 digits</option>
              <option value="6">6 digits</option>
              <option value="8">8 digits</option>
              <option value="12">12 digits</option>
            </select>
          </label>
          <button
            type="button"
            onClick={copyResult}
            class="rounded-lg bg-brand-600 px-3 py-1.5 font-medium text-white transition hover:bg-brand-700"
          >
            {copied ? '✓ Copied' : 'Copy result'}
          </button>
        </div>
      </div>

      {explainer && (
        <div class="mt-3 rounded-xl border border-brand-100 bg-white p-4 text-sm">
          <p class="font-semibold text-slate-900">
            {explainer.srcVal} {explainer.src.plural} = {explainer.dstVal} {explainer.dst.plural}
          </p>
          <p class="mt-1 font-mono text-xs text-slate-500">{explainer.math}</p>
          <p class="mt-2 leading-relaxed text-slate-600">{explainer.why}</p>
        </div>
      )}
    </div>
  );
}
