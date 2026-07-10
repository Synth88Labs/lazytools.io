/** Declarative compute functions for the simple [S] biology tools (widget:'calc'). */
import { doublingTime, expGrowth, logisticGrowth, od600Cells } from './biology';

export interface BioRow { label: string; value: string; hint?: string }

const fmt = (x: number, d = 3) => {
  if (!Number.isFinite(x)) return '—';
  if (x !== 0 && (Math.abs(x) >= 1e6 || Math.abs(x) < 1e-3)) return x.toExponential(3);
  return x.toLocaleString('en-US', { maximumFractionDigits: d });
};

export const BIO_COMPUTE: Record<string, (v: Record<string, number>) => BioRow[]> = {
  doublingTime: ({ n1, n2, dt }) => {
    const r = doublingTime(n1, n2, dt);
    if (!r) return [{ label: 'Result', value: 'Enter N₂ > 0, N₁ > 0 and time > 0' }];
    return [
      { label: 'Doubling time', value: `${fmt(r.td)} (same unit as time)`, hint: 't_d = ln(2) / µ' },
      { label: 'Specific growth rate µ', value: `${fmt(r.mu)} per time`, hint: 'µ = ln(N₂/N₁) / Δt' },
      { label: 'Generations elapsed', value: fmt(r.generations), hint: 'log₂(N₂/N₁)' },
    ];
  },
  molarity: ({ mass, mw, vol }) => {
    if (mw <= 0 || vol <= 0) return [{ label: 'Result', value: 'Enter a molar mass and volume above 0' }];
    const moles = mass / mw;
    const molarity = moles / vol;
    return [
      { label: 'Molarity', value: `${fmt(molarity)} mol/L`, hint: 'molarity = (mass ÷ molar mass) ÷ volume' },
      { label: 'Moles of solute', value: `${fmt(moles)} mol`, hint: 'moles = mass ÷ molar mass' },
      { label: 'To make it', value: `weigh ${fmt(mass)} g into ${fmt(vol)} L`, hint: 'mass = molarity × volume × molar mass' },
    ];
  },
  od600: ({ od, factor, dilution }) => {
    const cells = od600Cells(od, factor * 1e8, dilution || 1);
    return [
      { label: 'Cell density', value: `${fmt(cells)} cells/mL`, hint: 'OD₆₀₀ × factor × dilution' },
      { label: 'Per litre', value: `${fmt(cells * 1000)} cells/L` },
    ];
  },
  hemocytometer: ({ count, squares, dilution, volume }) => {
    if (squares <= 0) return [{ label: 'Result', value: 'Enter the number of squares counted' }];
    const perMl = (count / squares) * 1e4 * (dilution || 1);
    const rows: BioRow[] = [
      { label: 'Cell density', value: `${fmt(perMl)} cells/mL`, hint: '(count ÷ squares) × 10⁴ × dilution' },
    ];
    if (volume > 0) rows.push({ label: 'Total cells', value: `${fmt(perMl * volume)} in ${fmt(volume)} mL`, hint: 'density × volume' });
    return rows;
  },
  michaelis: ({ vmax, km, s }) => {
    if (km + s <= 0) return [{ label: 'Result', value: 'Enter Km and [S]' }];
    const v = (vmax * s) / (km + s);
    return [
      { label: 'Reaction velocity v', value: fmt(v), hint: 'v = Vmax·[S] / (Km + [S])' },
      { label: 'Fraction of Vmax', value: `${fmt((v / vmax) * 100, 1)}%`, hint: 'at [S] = Km, v = ½·Vmax' },
    ];
  },
  qpcr: ({ slope }) => {
    if (slope >= 0) return [{ label: 'Result', value: 'Standard-curve slope is negative (e.g. −3.32)' }];
    const fold = Math.pow(10, -1 / slope);
    const eff = (fold - 1) * 100;
    return [
      { label: 'Amplification efficiency', value: `${fmt(eff, 1)}%`, hint: 'E = 10^(−1/slope) − 1' },
      { label: 'Fold change per cycle', value: `${fmt(fold, 3)}×`, hint: 'ideal is 2× (slope −3.32, 100%)' },
    ];
  },
  population: ({ n0, r, t, k }) => {
    const logistic = k > 0;
    const N = logistic ? logisticGrowth(n0, r, t, k) : expGrowth(n0, r, t);
    const rows: BioRow[] = [
      { label: logistic ? 'Population (logistic)' : 'Population (exponential)', value: fmt(Math.round(N)), hint: logistic ? 'N(t) = K / (1 + ((K−N₀)/N₀)·e^(−rt))' : 'N(t) = N₀·e^(rt)' },
    ];
    if (r > 0) rows.push({ label: 'Doubling time', value: `${fmt(Math.LN2 / r)} time units`, hint: 'ln(2) / r' });
    if (logistic) rows.push({ label: 'Carrying capacity K', value: fmt(k) });
    return rows;
  },
};
