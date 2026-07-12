import { useMemo, useState } from 'preact/hooks';
import { chargeCounts, netCharge, isoelectricPoint } from '../../lib/biology';

function cleanProtein(raw: string): string {
  return raw.split('\n').filter((l) => !l.trim().startsWith('>')).join('').toUpperCase().replace(/[^A-Z]/g, '');
}

export default function ProteinPiTool() {
  const [raw, setRaw] = useState('MKWVTFISLLFLFSSAYSRGVFRRDTHKSEIAHRFKDLGEEHFKGLVLIAFSQYLQQCPFEDHVKLVNEVTEFAK');
  const [pH, setPH] = useState(7.0);

  const seq = useMemo(() => cleanProtein(raw), [raw]);
  const counts = useMemo(() => chargeCounts(seq), [seq]);
  const pI = useMemo(() => (counts.residues ? isoelectricPoint(counts) : 0), [counts]);
  const chargeAtPh = useMemo(() => (counts.residues ? netCharge(counts, pH) : 0), [counts, pH]);
  const chargeAt7 = useMemo(() => (counts.residues ? netCharge(counts, 7) : 0), [counts]);

  // titration curve points (pH 0..14)
  const curve = useMemo(() => {
    if (!counts.residues) return { path: '', maxAbs: 1 };
    const pts: [number, number][] = [];
    let maxAbs = 1;
    for (let p = 0; p <= 14; p += 0.25) { const q = netCharge(counts, p); pts.push([p, q]); maxAbs = Math.max(maxAbs, Math.abs(q)); }
    const W = 320, H = 120, padX = 8, padY = 8;
    const x = (p: number) => padX + (p / 14) * (W - 2 * padX);
    const y = (q: number) => H / 2 - (q / maxAbs) * (H / 2 - padY);
    const path = pts.map(([p, q], i) => `${i ? 'L' : 'M'}${x(p).toFixed(1)},${y(q).toFixed(1)}`).join(' ');
    return { path, maxAbs, x, y, W, H };
  }, [counts]);

  const cls = pI >= 7.5 ? { label: 'basic protein', color: 'text-blue-700' } : pI <= 6.5 ? { label: 'acidic protein', color: 'text-rose-700' } : { label: 'near-neutral protein', color: 'text-slate-700' };
  const chargeColor = (q: number) => (q > 0.05 ? 'text-blue-700' : q < -0.05 ? 'text-rose-700' : 'text-slate-700');
  const sign = (q: number) => (q >= 0 ? '+' : '') + q.toFixed(2);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Protein sequence (one-letter amino acids)</span>
        <textarea class="h-24 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          value={raw} spellcheck={false} onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)} />
      </label>

      {counts.residues ? (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-3">
            <div class="rounded-xl bg-white p-4 text-center ring-2 ring-brand-200">
              <p class="text-3xl font-extrabold text-brand-800">{pI.toFixed(2)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">isoelectric point (pI)</p>
              <p class={`mt-1 text-xs font-semibold ${cls.color}`}>{cls.label}</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class={`text-3xl font-extrabold ${chargeColor(chargeAt7)}`}>{sign(chargeAt7)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">net charge at pH 7.0</p>
            </div>
            <div class="rounded-xl bg-white p-4 text-center ring-1 ring-slate-200">
              <p class={`text-3xl font-extrabold ${chargeColor(chargeAtPh)}`}>{sign(chargeAtPh)}</p>
              <p class="mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500">net charge at pH {pH.toFixed(1)}</p>
            </div>
          </div>

          <label class="mt-4 block">
            <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Explore pH: {pH.toFixed(1)}</span>
            <input type="range" min="0" max="14" step="0.1" value={pH} onInput={(e) => setPH(Number((e.target as HTMLInputElement).value))} class="w-full" />
          </label>

          {curve.path && (
            <div class="mt-3 rounded-xl bg-white p-3 ring-1 ring-slate-200">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Net charge vs pH (titration curve)</p>
              <svg viewBox={`0 0 ${curve.W} ${curve.H}`} class="w-full" role="img" aria-label="Titration curve of net charge versus pH">
                <line x1={curve.x!(0)} y1={curve.H! / 2} x2={curve.x!(14)} y2={curve.H! / 2} stroke="#cbd5e1" stroke-width="1" />
                <line x1={curve.x!(pI)} y1="6" x2={curve.x!(pI)} y2={curve.H! - 6} stroke="#16a34a" stroke-width="1" stroke-dasharray="3 3" />
                <path d={curve.path} fill="none" stroke="#2563eb" stroke-width="2" />
                <circle cx={curve.x!(pH)} cy={curve.y!(chargeAtPh)} r="3.5" fill="#dc2626" />
                <text x={curve.x!(pI) + 3} y="14" font-size="9" fill="#16a34a">pI {pI.toFixed(1)}</text>
                <text x={curve.x!(0) + 2} y={curve.H! / 2 - 3} font-size="8" fill="#94a3b8">0</text>
              </svg>
              <div class="flex justify-between text-[10px] text-slate-400"><span>pH 0</span><span>7</span><span>14</span></div>
            </div>
          )}

          <div class="mt-3 flex flex-wrap gap-1.5 text-xs">
            {([['D', counts.D], ['E', counts.E], ['C', counts.C], ['Y', counts.Y], ['H', counts.H], ['K', counts.K], ['R', counts.R]] as [string, number][]).filter(([, n]) => n > 0).map(([a, n]) => (
              <span class="rounded-md bg-white px-2 py-1 font-mono text-slate-600 ring-1 ring-slate-200">{a}×{n}</span>
            ))}
            <span class="rounded-md bg-white px-2 py-1 text-slate-500 ring-1 ring-slate-200">{counts.residues} residues</span>
          </div>
        </>
      ) : (
        <p class="mt-4 text-sm text-slate-500">Paste a protein sequence to compute its isoelectric point and charge.</p>
      )}

      <p class="mt-4 text-xs text-slate-500">The pI is the pH where the protein's net charge is zero, found from the ionizable groups (N/C-termini and D, E, C, Y, H, K, R side chains) via Henderson–Hasselbalch. Uses the EMBOSS pKa set; other pKa sets shift the pI by ~0.1–0.3. Ignores modifications and 3D environment. 🔒 Computed in your browser.</p>
    </div>
  );
}
