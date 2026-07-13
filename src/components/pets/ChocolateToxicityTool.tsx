import { useMemo, useState } from 'preact/hooks';
import { chocolateToxicity, THEOBROMINE_MG_PER_G, type ChocRisk } from '../../lib/pets';

const num = (s: string) => { const n = parseFloat(s); return isFinite(n) && n > 0 ? n : null; };
const fmt = (x: number, d = 0) => Number(x.toFixed(d)).toLocaleString();

const RISK: Record<ChocRisk, { label: string; ring: string; text: string; bg: string; msg: string }> = {
  none: { label: 'Low risk', ring: 'ring-emerald-300', text: 'text-emerald-800', bg: 'bg-emerald-50', msg: 'Below the ~20 mg/kg level where signs usually begin. Watch for vomiting or restlessness and keep water available — but still call your vet if you\'re worried or the dog is small.' },
  mild: { label: 'Mild toxicity', ring: 'ring-amber-300', text: 'text-amber-800', bg: 'bg-amber-50', msg: 'Enough for vomiting, diarrhoea, restlessness and increased thirst. Call your vet or a pet poison line now for advice.' },
  moderate: { label: 'Moderate — call your vet now', ring: 'ring-orange-400', text: 'text-orange-900', bg: 'bg-orange-50', msg: 'Risk of a racing heart, tremors and agitation. Contact your vet or emergency clinic immediately.' },
  severe: { label: 'Severe — emergency', ring: 'ring-rose-400', text: 'text-rose-900', bg: 'bg-rose-50', msg: 'Seizures and dangerous heart rhythms are possible. Get to an emergency vet right away.' },
  lethal: { label: 'Potentially fatal — emergency', ring: 'ring-red-500', text: 'text-red-900', bg: 'bg-red-100', msg: 'This dose can be fatal. Go to an emergency vet immediately — do not wait for symptoms.' },
};

export default function ChocolateToxicityTool() {
  const [type, setType] = useState('milk');
  const [unit, setUnit] = useState<'g' | 'oz'>('g');
  const [amount, setAmount] = useState('50');
  const [wUnit, setWUnit] = useState<'kg' | 'lb'>('kg');
  const [weight, setWeight] = useState('10');

  const r = useMemo(() => {
    const a = num(amount), w = num(weight);
    if (a == null || w == null) return null;
    const grams = unit === 'g' ? a : a * 28.349523125;
    const kg = wUnit === 'kg' ? w : w * 0.45359237;
    return chocolateToxicity(type, grams, kg);
  }, [type, unit, amount, wUnit, weight]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const sel = 'rounded-lg border border-slate-300 bg-white px-2 py-2 text-sm';
  const tog = (on: boolean) => `rounded-lg px-3 py-1.5 text-sm font-semibold transition ${on ? 'bg-brand-600 text-white shadow-sm' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:ring-brand-300'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-3 sm:grid-cols-3">
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Chocolate type</span>
          <select value={type} onChange={(e) => setType((e.target as HTMLSelectElement).value)} class={`${sel} w-full`}>
            {Object.entries(THEOBROMINE_MG_PER_G).map(([k, v]) => <option value={k}>{v.label}</option>)}
          </select></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Amount eaten</span>
          <div class="flex gap-1"><input type="number" step="any" value={amount} onInput={(e) => setAmount((e.target as HTMLInputElement).value)} class={inp} />
            <select value={unit} onChange={(e) => setUnit((e.target as HTMLSelectElement).value as 'g' | 'oz')} class={sel}><option value="g">g</option><option value="oz">oz</option></select></div></label>
        <label class="block"><span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Dog's weight</span>
          <div class="flex gap-1"><input type="number" step="any" value={weight} onInput={(e) => setWeight((e.target as HTMLInputElement).value)} class={inp} />
            <select value={wUnit} onChange={(e) => setWUnit((e.target as HTMLSelectElement).value as 'kg' | 'lb')} class={sel}><option value="kg">kg</option><option value="lb">lb</option></select></div></label>
      </div>

      {r ? (
        <div class={`mt-4 rounded-xl p-4 ring-2 ${RISK[r.risk].ring} ${RISK[r.risk].bg}`}>
          <p class={`text-lg font-extrabold ${RISK[r.risk].text}`}>{RISK[r.risk].label}</p>
          <p class="mt-1 text-sm text-slate-700">Estimated dose: <strong>{fmt(r.dosePerKg, 1)} mg/kg</strong> of theobromine ({fmt(r.theobromineMg)} mg total).</p>
          <p class={`mt-2 text-sm ${RISK[r.risk].text}`}>{RISK[r.risk].msg}</p>
        </div>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Enter the chocolate type, amount and your dog's weight.</p>
      )}

      <div class="mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-800 ring-1 ring-rose-200">⚠️ <strong>This is an estimate, not veterinary advice.</strong> Chocolate content varies and dogs differ. If your dog has eaten any chocolate, call your vet or a pet poison helpline (US: ASPCA Animal Poison Control 888-426-4435; UK: Animal PoisonLine 01202 509000). Don't wait for symptoms.</div>

      <p class="mt-3 text-xs text-slate-500">Theobromine (plus some caffeine) is what makes chocolate toxic to dogs; they metabolise it far more slowly than people. Dose is estimated from typical theobromine content per gram (Merck Veterinary Manual / Pet Poison Helpline) and banded by the usual thresholds — signs from ~20 mg/kg, serious effects ~40–60 mg/kg, potentially fatal ~100+ mg/kg. 🔒 In your browser.</p>
    </div>
  );
}
