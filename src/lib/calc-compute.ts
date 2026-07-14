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
    const annual = n(v.annual);
    const rows: ResultRow[] = [
      { label: 'Weekly', value: fmt(weekly), hint: `${fmt(rate)} × ${fmt(hours)} hours` },
      { label: 'Monthly', value: fmt((weekly * 52) / 12), hint: '52 weeks ÷ 12 months' },
      { label: 'Annual', value: fmt(weekly * 52), hint: '52 paid weeks' },
    ];
    if (Number.isFinite(annual) && annual > 0) {
      rows.push({ label: `Reverse: ${fmt(annual)}/yr as hourly`, value: fmt(annual / (hours * 52), 2), hint: `${fmt(annual)} ÷ (${fmt(hours)} h × 52 wk)` });
    }
    return rows;
  },

  // ---------- health & fitness ----------
  tdee: (v) => {
    const metric = (v.units ?? 'metric') === 'metric';
    let w = n(v.weight), h = n(v.height);
    const age = n(v.age);
    if (!Number.isFinite(w) || !Number.isFinite(h) || !Number.isFinite(age) || w <= 0 || h <= 0 || age <= 0) return null;
    if (!metric) { w = w * 0.45359237; h = h * 2.54; }
    const male = (v.sex ?? 'male') === 'male';
    const bmr = 10 * w + 6.25 * h - 5 * age + (male ? 5 : -161);
    const factors: Record<string, [string, number]> = {
      sedentary: ['sedentary', 1.2],
      light: ['light', 1.375],
      moderate: ['moderate', 1.55],
      active: ['active', 1.725],
      veryactive: ['very active', 1.9],
    };
    const [actLabel, factor] = factors[v.activity ?? 'moderate'] ?? factors.moderate!;
    const tdee = bmr * factor;
    return [
      { label: 'TDEE — maintenance calories', value: `${fmt(tdee, 0)} kcal/day`, hint: `BMR ${fmt(bmr, 0)} × ${factor} (${actLabel})` },
      { label: 'BMR (at complete rest)', value: `${fmt(bmr, 0)} kcal/day`, hint: 'Mifflin–St Jeor equation' },
      { label: 'Mild loss (−0.25 kg/wk)', value: `${fmt(tdee - 250, 0)} kcal/day`, hint: '≈ 250 kcal deficit' },
      { label: 'Weight loss (−0.5 kg/wk)', value: `${fmt(tdee - 500, 0)} kcal/day`, hint: '≈ 500 kcal deficit' },
      { label: 'Weight gain (+0.5 kg/wk)', value: `${fmt(tdee + 500, 0)} kcal/day`, hint: '≈ 500 kcal surplus' },
    ];
  },

  bodyFat: (v) => {
    const metric = (v.units ?? 'metric') === 'metric';
    const male = (v.sex ?? 'male') === 'male';
    let h = n(v.height), neck = n(v.neck), waist = n(v.waist), hip = n(v.hip);
    if (!Number.isFinite(h) || !Number.isFinite(neck) || !Number.isFinite(waist)) return null;
    if (!metric) { h *= 2.54; neck *= 2.54; waist *= 2.54; hip *= 2.54; }
    let bf: number;
    if (male) {
      if (waist - neck <= 0) return null;
      bf = 495 / (1.0324 - 0.19077 * Math.log10(waist - neck) + 0.15456 * Math.log10(h)) - 450;
    } else {
      if (!Number.isFinite(hip) || waist + hip - neck <= 0) return null;
      bf = 495 / (1.29579 - 0.35004 * Math.log10(waist + hip - neck) + 0.221 * Math.log10(h)) - 450;
    }
    const cat = bf < (male ? 6 : 14) ? 'essential fat' : bf < (male ? 14 : 21) ? 'athletes' : bf < (male ? 18 : 25) ? 'fitness' : bf < (male ? 25 : 32) ? 'average' : 'above average';
    return [
      { label: 'Body fat', value: `${fmt(bf, 1)}%`, hint: `U.S. Navy circumference method (${cat})` },
      { label: 'Category', value: cat },
    ];
  },

  idealWeight: (v) => {
    const metric = (v.units ?? 'metric') === 'metric';
    const male = (v.sex ?? 'male') === 'male';
    let hIn = n(v.height);
    if (!Number.isFinite(hIn) || hIn <= 0) return null;
    if (metric) hIn /= 2.54;
    const over5ft = hIn - 60;
    const base = male ? { dev: 50, rob: 52, mil: 56.2, ham: 48 } : { dev: 45.5, rob: 49, mil: 53.1, ham: 45.5 };
    const perIn = male ? { dev: 2.3, rob: 1.9, mil: 1.41, ham: 2.7 } : { dev: 2.3, rob: 1.7, mil: 1.36, ham: 2.2 };
    const kg = (b: number, p: number) => b + p * over5ft;
    const disp = (x: number) => metric ? `${fmt(x, 1)} kg` : `${fmt(x / 0.45359237, 1)} lb`;
    const hm = hIn * 0.0254;
    return [
      { label: 'Devine formula', value: disp(kg(base.dev, perIn.dev)), hint: 'the clinical standard (used for drug dosing)' },
      { label: 'Robinson (1983)', value: disp(kg(base.rob, perIn.rob)) },
      { label: 'Miller (1983)', value: disp(kg(base.mil, perIn.mil)) },
      { label: 'Hamwi (1964)', value: disp(kg(base.ham, perIn.ham)) },
      { label: 'Healthy BMI range (18.5–24.9)', value: `${disp(18.5 * hm * hm)} – ${disp(24.9 * hm * hm)}`, hint: 'often more useful than a single "ideal" number' },
    ];
  },

  macro: (v) => {
    const cal = n(v.calories);
    if (!Number.isFinite(cal) || cal <= 0) return null;
    const splits: Record<string, [string, number, number, number]> = {
      balanced: ['balanced', 0.3, 0.4, 0.3],
      lowcarb: ['low-carb', 0.4, 0.2, 0.4],
      highprotein: ['high-protein', 0.4, 0.35, 0.25],
      keto: ['keto', 0.25, 0.05, 0.7],
    };
    const [, pP, pC, pF] = splits[v.split ?? 'balanced'] ?? splits.balanced!;
    return [
      { label: `Protein (${fmt(pP * 100, 0)}%)`, value: `${fmt((cal * pP) / 4, 0)} g`, hint: `${fmt(cal * pP, 0)} kcal ÷ 4 kcal/g` },
      { label: `Carbs (${fmt(pC * 100, 0)}%)`, value: `${fmt((cal * pC) / 4, 0)} g`, hint: `${fmt(cal * pC, 0)} kcal ÷ 4 kcal/g` },
      { label: `Fat (${fmt(pF * 100, 0)}%)`, value: `${fmt((cal * pF) / 9, 0)} g`, hint: `${fmt(cal * pF, 0)} kcal ÷ 9 kcal/g` },
    ];
  },

  dueDate: (v) => {
    const lmp = v.lmp;
    if (!lmp || !/^\d{4}-\d{2}-\d{2}$/.test(lmp)) return null;
    const cycle = n(v.cycle) || 28;
    const start = new Date(lmp + 'T00:00:00');
    if (isNaN(start.getTime())) return null;
    const due = new Date(start.getTime() + (280 + (cycle - 28)) * 86400000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const daysPreg = Math.floor((today.getTime() - start.getTime()) / 86400000);
    const weeks = Math.floor(daysPreg / 7), days = daysPreg % 7;
    const tri = weeks < 13 ? 'First trimester' : weeks < 27 ? 'Second trimester' : weeks <= 42 ? 'Third trimester' : '—';
    const dueStr = due.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const rows: ResultRow[] = [
      { label: 'Estimated due date', value: dueStr, hint: `LMP + 280 days${cycle !== 28 ? `, adjusted ${cycle > 28 ? '+' : ''}${cycle - 28} for a ${cycle}-day cycle` : " (Naegele's rule)"}` },
    ];
    if (daysPreg >= 0 && weeks <= 43) {
      rows.push({ label: 'Current gestational age', value: `${weeks} weeks, ${days} days`, hint: tri });
    }
    return rows;
  },

  // ---------- finance ----------
  autoLoan: (v) => {
    const price = n(v.price), down = n(v.down) || 0, tradeIn = n(v.tradein) || 0, taxRate = n(v.taxrate) || 0, annual = n(v.rate), months = n(v.months);
    if (!Number.isFinite(price) || !Number.isFinite(annual) || !Number.isFinite(months) || price <= 0 || months <= 0) return null;
    const tax = Math.max(0, price - tradeIn) * taxRate / 100;
    const financed = Math.max(0, price + tax - down - tradeIn);
    const r = annual / 12 / 100;
    const pay = r === 0 ? financed / months : (financed * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
    const total = pay * months;
    return [
      { label: 'Monthly payment', value: fmt(pay), hint: `on ${fmt(financed)} financed over ${fmt(months, 0)} months` },
      { label: 'Amount financed', value: fmt(financed), hint: `price ${fmt(price)}${tax ? ` + tax ${fmt(tax)}` : ''} − down ${fmt(down)}${tradeIn ? ` − trade-in ${fmt(tradeIn)}` : ''}` },
      { label: 'Total interest', value: fmt(total - financed) },
      { label: 'Total of payments', value: fmt(total) },
    ];
  },

  markupMargin: (v) => {
    const cost = n(v.cost), price = n(v.price);
    if (!Number.isFinite(cost) || !Number.isFinite(price) || cost < 0 || price < 0) return null;
    const profit = price - cost;
    const markup = cost > 0 ? (profit / cost) * 100 : NaN;
    const margin = price > 0 ? (profit / price) * 100 : NaN;
    return [
      { label: 'Profit per unit', value: fmt(profit), hint: `price ${fmt(price)} − cost ${fmt(cost)}` },
      { label: 'Markup (on cost)', value: Number.isFinite(markup) ? `${fmt(markup, 1)}%` : '—', hint: 'profit ÷ cost — what you add on top of cost' },
      { label: 'Margin (on price)', value: Number.isFinite(margin) ? `${fmt(margin, 1)}%` : '—', hint: 'profit ÷ price — the share of revenue you keep' },
    ];
  },

  salesTax: (v) => {
    const amount = n(v.amount), rate = n(v.rate);
    if (!Number.isFinite(amount) || !Number.isFinite(rate) || amount < 0) return null;
    const tax = amount * rate / 100;
    return [
      { label: 'Tax amount', value: fmt(tax), hint: `${fmt(amount)} × ${fmt(rate)}%` },
      { label: 'Total (tax added)', value: fmt(amount + tax), hint: 'if the amount was pre-tax' },
      { label: 'Pre-tax amount (reverse)', value: fmt(amount / (1 + rate / 100)), hint: `if ${fmt(amount)} already includes ${fmt(rate)}% tax` },
    ];
  },

  fuelCost: (v) => {
    const distance = n(v.distance), eff = n(v.efficiency), pricePer = n(v.price);
    if (!Number.isFinite(distance) || !Number.isFinite(eff) || !Number.isFinite(pricePer) || eff <= 0) return null;
    const mode = v.units ?? 'mpg-us';
    let fuelUsed: number, unitLabel: string;
    if (mode === 'l100km') { fuelUsed = distance * eff / 100; unitLabel = 'litres'; }
    else if (mode === 'kmpl') { fuelUsed = distance / eff; unitLabel = 'litres'; }
    else if (mode === 'mpg-uk') { fuelUsed = distance / eff; unitLabel = 'imperial gallons'; }
    else { fuelUsed = distance / eff; unitLabel = 'US gallons'; }
    const cost = fuelUsed * pricePer;
    return [
      { label: 'Total fuel cost', value: fmt(cost), hint: `${fmt(fuelUsed, 2)} ${unitLabel} × ${fmt(pricePer)}/unit` },
      { label: 'Fuel used', value: `${fmt(fuelUsed, 2)} ${unitLabel}` },
      { label: 'Cost per unit distance', value: fmt(distance > 0 ? cost / distance : 0, 3), hint: 'per mile / km travelled' },
    ];
  },

  testGrade: (v) => {
    const correct = n(v.correct), total = n(v.total);
    if (!Number.isFinite(correct) || !Number.isFinite(total) || total <= 0 || correct < 0) return null;
    const pct = (correct / total) * 100;
    const wrong = Math.max(0, total - correct);
    const letter = pct >= 97 ? 'A+' : pct >= 93 ? 'A' : pct >= 90 ? 'A−' : pct >= 87 ? 'B+' : pct >= 83 ? 'B' : pct >= 80 ? 'B−'
      : pct >= 77 ? 'C+' : pct >= 73 ? 'C' : pct >= 70 ? 'C−' : pct >= 67 ? 'D+' : pct >= 63 ? 'D' : pct >= 60 ? 'D−' : 'F';
    return [
      { label: 'Score', value: `${fmt(pct)}%`, hint: `${fmt(correct, 0)} correct out of ${fmt(total, 0)}` },
      { label: 'Letter grade', value: letter, hint: 'standard US grading scale' },
      { label: 'Wrong answers', value: fmt(wrong, 0), hint: total > 0 ? `${fmt((wrong / total) * 100)}% missed` : '' },
    ];
  },

  unitPrice: (v) => {
    const pA = n(v.priceA), qA = n(v.qtyA), pB = n(v.priceB), qB = n(v.qtyB);
    if (!Number.isFinite(pA) || !Number.isFinite(qA) || qA <= 0) return null;
    const uA = pA / qA;
    const rows: ResultRow[] = [{ label: 'Item A — price per unit', value: fmt(uA, 4), hint: `${fmt(pA)} ÷ ${fmt(qA)}` }];
    if (Number.isFinite(pB) && Number.isFinite(qB) && qB > 0) {
      const uB = pB / qB;
      rows.push({ label: 'Item B — price per unit', value: fmt(uB, 4), hint: `${fmt(pB)} ÷ ${fmt(qB)}` });
      const save = (Math.abs(uA - uB) / Math.max(uA, uB)) * 100;
      rows.push({ label: 'Better value', value: uA === uB ? 'Same price' : `Item ${uA < uB ? 'A' : 'B'}`, hint: uA === uB ? '' : `${fmt(save)}% cheaper per unit` });
    }
    return rows;
  },

  overtimePay: (v) => {
    const rate = n(v.rate), reg = n(v.regHours), ot = n(v.otHours);
    const mult = Number.isFinite(n(v.multiplier)) ? n(v.multiplier) : 1.5;
    if (!Number.isFinite(rate) || rate < 0) return null;
    const regH = Number.isFinite(reg) ? reg : 0, otH = Number.isFinite(ot) ? ot : 0;
    const regPay = rate * regH, otPay = rate * mult * otH;
    return [
      { label: 'Regular pay', value: fmt(regPay), hint: `${fmt(regH)} h × ${fmt(rate)}` },
      { label: 'Overtime pay', value: fmt(otPay), hint: `${fmt(otH)} h × ${fmt(rate)} × ${fmt(mult)}` },
      { label: 'Total pay', value: fmt(regPay + otPay), hint: `${fmt(regH + otH)} h total` },
    ];
  },

  squareFootage: (v) => {
    const len = n(v.length), wid = n(v.width);
    const qty = Number.isFinite(n(v.quantity)) && n(v.quantity) > 0 ? n(v.quantity) : 1;
    const unit = v.unit === 'm' ? 'm' : 'ft';
    if (!Number.isFinite(len) || !Number.isFinite(wid) || len <= 0 || wid <= 0) return null;
    const areaOne = len * wid;
    const total = areaOne * qty;
    // 1 ft² = 0.09290304 m² exactly; 1 m² = 10.7639104167 ft².
    const toSqm = unit === 'ft' ? 0.09290304 : 1;
    const toSqft = unit === 'ft' ? 1 : 10.7639104167;
    const label = unit === 'ft' ? 'ft²' : 'm²';
    const rows: ResultRow[] = [
      { label: `Area ${qty > 1 ? 'per unit' : ''}`.trim(), value: `${fmt(areaOne, 3)} ${label}`, hint: `${fmt(len, 3)} × ${fmt(wid, 3)} ${unit}` },
    ];
    if (qty > 1) rows.push({ label: `Total area (${fmt(qty, 0)} units)`, value: `${fmt(total, 3)} ${label}`, hint: `${fmt(areaOne, 3)} × ${fmt(qty, 0)}` });
    rows.push({ label: 'In square feet', value: `${fmt(total * toSqft, 3)} ft²`, hint: unit === 'm' ? '× 10.7639' : '' });
    rows.push({ label: 'In square metres', value: `${fmt(total * toSqm, 3)} m²`, hint: unit === 'ft' ? '× 0.092903' : '' });
    return rows;
  },

  costPerArea: (v) => {
    const price = n(v.price), area = n(v.area);
    const unit = v.unit === 'm2' ? 'm2' : 'ft2';
    if (!Number.isFinite(price) || !Number.isFinite(area) || area <= 0) return null;
    const per = price / area;
    // convert per-unit-area price to the other unit
    const perSqft = unit === 'ft2' ? per : per * 0.09290304; // $/m² × 0.0929 = $/ft²
    const perSqm = unit === 'ft2' ? per / 0.09290304 : per;
    return [
      { label: unit === 'ft2' ? 'Cost per square foot' : 'Cost per square metre', value: fmt(per, 2), hint: `${fmt(price)} ÷ ${fmt(area, 2)}` },
      { label: 'Cost per square foot', value: fmt(perSqft, 2), hint: unit === 'm2' ? 'converted from /m²' : '' },
      { label: 'Cost per square metre', value: fmt(perSqm, 2), hint: unit === 'ft2' ? 'converted from /ft²' : '' },
    ];
  },

  mixRatio: (v) => {
    // Ratio 1:N (one part concentrate to N parts diluent) for a target total volume.
    const parts = n(v.parts), total = n(v.total);
    if (!Number.isFinite(parts) || parts < 0 || !Number.isFinite(total) || total <= 0) return null;
    const totalParts = 1 + parts;
    const concentrate = total / totalParts;
    const diluent = total * parts / totalParts;
    const unit = v.unit || 'mL';
    return [
      { label: 'Concentrate needed', value: `${fmt(concentrate, 3)} ${unit}`, hint: `${fmt(total, 2)} ÷ ${fmt(totalParts, 2)} parts` },
      { label: 'Water / diluent needed', value: `${fmt(diluent, 3)} ${unit}`, hint: `${fmt(concentrate, 3)} × ${fmt(parts, 2)}` },
      { label: 'Mixing ratio', value: `1 : ${fmt(parts, 2)}`, hint: `${fmt(100 / totalParts, 2)}% concentrate by volume` },
    ];
  },
};
