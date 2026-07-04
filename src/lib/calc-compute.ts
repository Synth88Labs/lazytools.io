/**
 * Pure compute functions for every calculator, keyed by computeId.
 * Bundled into the client widget — everything runs in the browser.
 */

export interface ResultRow {
  label: string;
  value: string;
  hint?: string;
}

type Values = Record<string, string>;

const n = (v: string | undefined): number => {
  const x = parseFloat(v ?? '');
  return Number.isFinite(x) ? x : NaN;
};

export function fmt(x: number, digits = 2): string {
  if (!Number.isFinite(x)) return '—';
  return x.toLocaleString('en-US', { maximumFractionDigits: digits, minimumFractionDigits: 0 });
}

export const COMPUTE: Record<string, (v: Values) => ResultRow[] | null> = {
  percentage: (v) => {
    const p = n(v.percent), of = n(v.of);
    if (!Number.isFinite(p) || !Number.isFinite(of)) return null;
    const result = (p / 100) * of;
    return [
      { label: `${fmt(p)}% of ${fmt(of)}`, value: fmt(result, 6), hint: `${fmt(of)} × ${fmt(p / 100, 6)} = ${fmt(result, 6)}` },
      { label: 'As a fraction of the whole', value: fmt(p / 100, 6), hint: `${fmt(p)}% means ${fmt(p)} per 100` },
    ];
  },

  percentageChange: (v) => {
    const from = n(v.from), to = n(v.to);
    if (!Number.isFinite(from) || !Number.isFinite(to) || from === 0) return null;
    const change = ((to - from) / Math.abs(from)) * 100;
    const dir = change >= 0 ? 'increase' : 'decrease';
    return [
      { label: `Percentage ${dir}`, value: `${fmt(Math.abs(change))}%`, hint: `(${fmt(to)} − ${fmt(from)}) ÷ ${fmt(Math.abs(from))} × 100` },
      { label: 'Absolute change', value: fmt(to - from, 6) },
    ];
  },

  emi: (v) => {
    const P = n(v.principal), annual = n(v.rate), months = n(v.months);
    if (!Number.isFinite(P) || !Number.isFinite(annual) || !Number.isFinite(months) || P <= 0 || months <= 0) return null;
    const r = annual / 12 / 100;
    const emi = r === 0 ? P / months : (P * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const total = emi * months;
    return [
      { label: 'Monthly payment (EMI)', value: fmt(emi), hint: `at ${fmt(annual)}% yearly = ${fmt(r * 100, 4)}% monthly` },
      { label: 'Total interest paid', value: fmt(total - P), hint: `over ${fmt(months, 0)} months` },
      { label: 'Total amount paid', value: fmt(total), hint: `principal ${fmt(P)} + interest ${fmt(total - P)}` },
    ];
  },

  bmi: (v) => {
    const h = n(v.height) / 100, w = n(v.weight);
    if (!Number.isFinite(h) || !Number.isFinite(w) || h <= 0 || w <= 0) return null;
    const bmi = w / (h * h);
    const cat = bmi < 18.5 ? 'Underweight' : bmi < 25 ? 'Normal weight' : bmi < 30 ? 'Overweight' : 'Obesity range';
    const lo = 18.5 * h * h, hi = 24.9 * h * h;
    return [
      { label: 'BMI', value: fmt(bmi, 1), hint: `${fmt(w)} ÷ ${fmt(h, 2)}² — WHO adult scale` },
      { label: 'Category (WHO)', value: cat },
      { label: 'Normal-BMI weight range for your height', value: `${fmt(lo, 1)}–${fmt(hi, 1)} kg` },
    ];
  },

  age: (v) => {
    if (!v.dob) return null;
    const dob = new Date(v.dob + 'T00:00:00');
    const now = new Date();
    if (isNaN(dob.getTime()) || dob > now) return null;
    let years = now.getFullYear() - dob.getFullYear();
    let months = now.getMonth() - dob.getMonth();
    let days = now.getDate() - dob.getDate();
    if (days < 0) {
      months -= 1;
      days += new Date(now.getFullYear(), now.getMonth(), 0).getDate();
    }
    if (months < 0) {
      years -= 1;
      months += 12;
    }
    const totalDays = Math.floor((now.getTime() - dob.getTime()) / 86400000);
    return [
      { label: 'Age', value: `${years} years, ${months} months, ${days} days` },
      { label: 'In months', value: fmt(years * 12 + months, 0), hint: 'completed months' },
      { label: 'In days', value: fmt(totalDays, 0), hint: `≈ ${fmt(totalDays / 7, 0)} weeks` },
    ];
  },

  tip: (v) => {
    const bill = n(v.bill), pct = n(v.percent), split = Math.max(1, n(v.split) || 1);
    if (!Number.isFinite(bill) || !Number.isFinite(pct) || bill < 0) return null;
    const tip = (pct / 100) * bill;
    const total = bill + tip;
    return [
      { label: 'Tip amount', value: fmt(tip), hint: `${fmt(pct)}% of ${fmt(bill)}` },
      { label: 'Total with tip', value: fmt(total) },
      ...(split > 1 ? [{ label: `Per person (${fmt(split, 0)} people)`, value: fmt(total / split) }] : []),
    ];
  },

  discount: (v) => {
    const price = n(v.price), pct = n(v.percent);
    if (!Number.isFinite(price) || !Number.isFinite(pct)) return null;
    const off = (pct / 100) * price;
    return [
      { label: 'You save', value: fmt(off), hint: `${fmt(pct)}% of ${fmt(price)}` },
      { label: 'Final price', value: fmt(price - off), hint: `${fmt(price)} × ${fmt(1 - pct / 100, 4)}` },
    ];
  },

  compoundInterest: (v) => {
    const P = n(v.principal), rate = n(v.rate), years = n(v.years), freq = n(v.freq) || 1;
    if (!Number.isFinite(P) || !Number.isFinite(rate) || !Number.isFinite(years) || P <= 0 || years <= 0) return null;
    const fv = P * Math.pow(1 + rate / 100 / freq, freq * years);
    return [
      { label: 'Future value', value: fmt(fv), hint: `${fmt(P)} × (1 + ${fmt(rate)}%/${fmt(freq, 0)})^(${fmt(freq, 0)}×${fmt(years)})` },
      { label: 'Interest earned', value: fmt(fv - P) },
      { label: 'Growth multiple', value: `${fmt(fv / P, 3)}×`, hint: 'future value ÷ principal' },
    ];
  },

  simpleInterest: (v) => {
    const P = n(v.principal), rate = n(v.rate), years = n(v.years);
    if (!Number.isFinite(P) || !Number.isFinite(rate) || !Number.isFinite(years)) return null;
    const interest = (P * rate * years) / 100;
    return [
      { label: 'Interest', value: fmt(interest), hint: `${fmt(P)} × ${fmt(rate)}% × ${fmt(years)} years` },
      { label: 'Total amount', value: fmt(P + interest) },
    ];
  },

  hourlyToSalary: (v) => {
    const rate = n(v.rate), hours = n(v.hours) || 40;
    if (!Number.isFinite(rate) || rate < 0) return null;
    const weekly = rate * hours;
    return [
      { label: 'Weekly', value: fmt(weekly), hint: `${fmt(rate)} × ${fmt(hours)} hours` },
      { label: 'Monthly', value: fmt((weekly * 52) / 12), hint: '52 weeks ÷ 12 months' },
      { label: 'Annual', value: fmt(weekly * 52), hint: '52 paid weeks' },
    ];
  },
};
