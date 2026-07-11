/**
 * Chemistry compute — formula parsing, molar mass, percent composition,
 * exact chemical-equation balancing (BigInt rational nullspace), and
 * stoichiometry / solution helpers. Deterministic, no floating-point balancing.
 */

import { BY_SYMBOL } from '../data/chemistry/atomic-weights.ts';

export type ElementCount = Record<string, number>;

// ---------- formula parser (nested groups, hydrates, greedy 2-letter symbols) ----------

/** Parse a chemical formula into element→count. Throws on unknown element or bad syntax. */
export function parseFormula(formula: string): ElementCount {
  // normalise hydrate dots and whitespace
  const s = formula.replace(/[·⋅*]/g, '.').replace(/\s+/g, '');
  if (!s) throw new Error('Empty formula');

  // split hydrate segments on '.', each may have a leading multiplier (e.g. 5H2O)
  const segments = s.split('.');
  const total: ElementCount = {};
  for (const seg of segments) {
    const m = seg.match(/^(\d+)(.*)$/);
    const mult = m ? parseInt(m[1]!, 10) : 1;
    const body = m ? m[2]! : seg;
    const counts = parseGroup(body);
    for (const [el, n] of Object.entries(counts)) total[el] = (total[el] ?? 0) + n * mult;
  }
  return total;
}

function parseGroup(str: string): ElementCount {
  const counts: ElementCount = {};
  let i = 0;
  const add = (el: string, n: number) => { counts[el] = (counts[el] ?? 0) + n; };

  while (i < str.length) {
    const ch = str[i]!;
    if (ch === '(' || ch === '[' || ch === '{') {
      const close = ch === '(' ? ')' : ch === '[' ? ']' : '}';
      let depth = 1, j = i + 1;
      while (j < str.length && depth > 0) {
        if (str[j] === ch) depth++;
        else if (str[j] === close) depth--;
        if (depth === 0) break;
        j++;
      }
      if (depth !== 0) throw new Error('Unbalanced parentheses');
      const inner = parseGroup(str.slice(i + 1, j));
      i = j + 1;
      const num = readNumber(str, i);
      i = num.next;
      for (const [el, n] of Object.entries(inner)) add(el, n * num.value);
    } else if (/[A-Z]/.test(ch)) {
      // greedy two-letter symbol
      let sym = ch;
      if (i + 1 < str.length && /[a-z]/.test(str[i + 1]!)) {
        const two = ch + str[i + 1]!;
        if (BY_SYMBOL.has(two)) { sym = two; i++; }
        else if (!BY_SYMBOL.has(ch)) { sym = two; i++; } // let error surface below
      }
      if (!BY_SYMBOL.has(sym)) throw new Error(`Unknown element: ${sym}`);
      i++;
      const num = readNumber(str, i);
      i = num.next;
      add(sym, num.value);
    } else {
      throw new Error(`Unexpected character: ${ch}`);
    }
  }
  return counts;
}

function readNumber(str: string, i: number): { value: number; next: number } {
  let j = i;
  while (j < str.length && /[0-9]/.test(str[j]!)) j++;
  if (j === i) return { value: 1, next: i };
  return { value: parseInt(str.slice(i, j), 10), next: j };
}

// ---------- molar mass + percent composition ----------

export interface MolarMassResult {
  formula: string;
  molarMass: number;
  breakdown: { symbol: string; name: string; atomicWeight: number; count: number; mass: number; percent: number }[];
}

export function molarMass(formula: string): MolarMassResult {
  const counts = parseFormula(formula);
  let total = 0;
  const rows = Object.entries(counts).map(([symbol, count]) => {
    const el = BY_SYMBOL.get(symbol)!;
    const mass = el.weight * count;
    total += mass;
    return { symbol, name: el.name, atomicWeight: el.weight, count, mass };
  });
  return {
    formula,
    molarMass: total,
    breakdown: rows
      .map((r) => ({ ...r, percent: (r.mass / total) * 100 }))
      .sort((a, b) => b.mass - a.mass),
  };
}

// ---------- BigInt rational arithmetic ----------

function gcd(a: bigint, b: bigint): bigint { a = a < 0n ? -a : a; b = b < 0n ? -b : b; while (b) { [a, b] = [b, a % b]; } return a; }

interface Frac { n: bigint; d: bigint }
const fr = (n: bigint, d: bigint = 1n): Frac => {
  if (d === 0n) throw new Error('division by zero');
  if (d < 0n) { n = -n; d = -d; }
  const g = gcd(n, d) || 1n;
  return { n: n / g, d: d / g };
};
const fAdd = (a: Frac, b: Frac): Frac => fr(a.n * b.d + b.n * a.d, a.d * b.d);
const fSub = (a: Frac, b: Frac): Frac => fr(a.n * b.d - b.n * a.d, a.d * b.d);
const fMul = (a: Frac, b: Frac): Frac => fr(a.n * b.n, a.d * b.d);
const fDiv = (a: Frac, b: Frac): Frac => fr(a.n * b.d, a.d * b.n);
const fIsZero = (a: Frac) => a.n === 0n;

// ---------- equation balancer ----------

export interface Species { formula: string; counts: ElementCount }
export interface BalanceResult {
  reactants: { formula: string; coef: number }[];
  products: { formula: string; coef: number }[];
  balancedString: string;
}

/** Split an equation string into reactant/product species. Accepts -> => = + separators. */
export function parseEquation(eq: string): { reactants: string[]; products: string[] } {
  const sides = eq.split(/->|=>|→|⟶|=/);
  if (sides.length !== 2) throw new Error('Use one arrow (->) or = between reactants and products');
  const split = (s: string) => s.split('+').map((x) => x.trim()).filter(Boolean);
  const reactants = split(sides[0]!), products = split(sides[1]!);
  if (!reactants.length || !products.length) throw new Error('Both sides need at least one species');
  return { reactants, products };
}

/** Balance a chemical equation exactly. Returns integer coefficients. */
export function balanceEquation(eq: string): BalanceResult {
  const { reactants, products } = parseEquation(eq);
  const speciesStr = [...reactants, ...products];
  const parsed: Species[] = speciesStr.map((f) => ({ formula: f, counts: parseFormula(f) }));
  const elements = [...new Set(parsed.flatMap((s) => Object.keys(s.counts)))];
  const nSpecies = parsed.length;

  // matrix A: rows = elements, cols = species; products negated
  const A: Frac[][] = elements.map((el) =>
    parsed.map((s, j) => {
      const v = s.counts[el] ?? 0;
      return fr(BigInt(j < reactants.length ? v : -v));
    })
  );

  // Gaussian elimination to reduced row echelon form
  const rows = A.length, cols = nSpecies;
  let pivotRow = 0;
  const pivotCols: number[] = [];
  for (let col = 0; col < cols && pivotRow < rows; col++) {
    let sel = -1;
    for (let r = pivotRow; r < rows; r++) if (!fIsZero(A[r]![col]!)) { sel = r; break; }
    if (sel === -1) continue;
    [A[pivotRow], A[sel]] = [A[sel]!, A[pivotRow]!];
    const pv = A[pivotRow]![col]!;
    for (let c = 0; c < cols; c++) A[pivotRow]![c] = fDiv(A[pivotRow]![c]!, pv);
    for (let r = 0; r < rows; r++) {
      if (r === pivotRow) continue;
      const factor = A[r]![col]!;
      if (fIsZero(factor)) continue;
      for (let c = 0; c < cols; c++) A[r]![c] = fSub(A[r]![c]!, fMul(factor, A[pivotRow]![c]!));
    }
    pivotCols.push(col);
    pivotRow++;
  }

  const freeCols = [...Array(cols).keys()].filter((c) => !pivotCols.includes(c));
  if (freeCols.length === 0) throw new Error('No solution — equation cannot be balanced');
  if (freeCols.length > 1) throw new Error('Underdetermined — multiple independent balances exist');

  // set the single free variable = 1, solve pivots
  const free = freeCols[0]!;
  const x: Frac[] = new Array(cols).fill(null).map(() => fr(0n));
  x[free] = fr(1n);
  for (let p = 0; p < pivotCols.length; p++) {
    const col = pivotCols[p]!;
    // pivot row p: x[col] + sum(A[p][free]*x[free]) = 0 → x[col] = -A[p][free]*1
    x[col] = fSub(fr(0n), fMul(A[p]![free]!, x[free]!));
  }

  // scale to smallest positive integers: multiply by LCM of denominators, divide by GCD
  let lcm = 1n;
  for (const f of x) lcm = (lcm / gcd(lcm, f.d)) * f.d;
  let ints = x.map((f) => (f.n * lcm) / f.d);
  // make all positive (flip sign if needed)
  if (ints.some((v) => v < 0n) && ints.every((v) => v <= 0n)) ints = ints.map((v) => -v);
  // if mixed signs, the free-var choice was wrong direction — flip whole vector to make reactants positive
  if (ints.some((v) => v < 0n)) ints = ints.map((v) => -v);
  let g = 0n;
  for (const v of ints) g = gcd(g, v);
  if (g > 1n) ints = ints.map((v) => v / g);
  if (ints.some((v) => v <= 0n)) throw new Error('No valid positive integer balance found');

  const coefs = ints.map((v) => Number(v));
  const rc = reactants.map((f, i) => ({ formula: f, coef: coefs[i]! }));
  const pc = products.map((f, i) => ({ formula: f, coef: coefs[reactants.length + i]! }));
  const fmt = (arr: { formula: string; coef: number }[]) =>
    arr.map((s) => (s.coef === 1 ? '' : s.coef) + s.formula).join(' + ');
  return { reactants: rc, products: pc, balancedString: `${fmt(rc)} → ${fmt(pc)}` };
}

// ---------- constants + solution/gas helpers ----------

export const AVOGADRO = 6.02214076e23;
export const R_GAS = 0.082057; // L·atm·K⁻¹·mol⁻¹

/** Solve molarity M = n/V with n = mass/MW. Provide any 3 of {mass, molarMass, volumeL, molarity}. */
export function solveMolarity(v: { mass?: number; molarMass?: number; volumeL?: number; molarity?: number }): number | null {
  const { mass, molarMass: mw, volumeL, molarity } = v;
  if (mass != null && mw != null && volumeL != null && mw > 0 && volumeL > 0) return mass / mw / volumeL;
  if (molarity != null && mw != null && volumeL != null) return molarity * volumeL * mw; // returns mass
  if (molarity != null && mw != null && mass != null && molarity > 0 && mw > 0) return mass / mw / molarity; // returns volume
  if (molarity != null && volumeL != null && mass != null && molarity > 0 && volumeL > 0) return mass / (molarity * volumeL); // returns MW
  return null;
}
