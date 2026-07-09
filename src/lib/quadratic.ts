import { Rat, gcdB, absB, isqrt, extractSquare } from './mathx.ts';

export interface Solved {
  aI: bigint; bI: bigint; cI: bigint; // integerized coefficients
  D: bigint;
  kind: 'rational' | 'irrational' | 'complex' | 'double';
  roots: string[]; // exact display
  approx: string[];
  vertex: string;
  /** integer factored form, present when roots are rational: e.g. "2(2x − 5)(x + 1)" */
  factored?: string;
}

/** Linear factor (qx − p) from a root p/q in lowest terms, with sign folded in. */
function linFactor(rootNum: bigint, rootDen: bigint): { text: string; q: bigint } {
  const r = new Rat(rootNum, rootDen);
  const p = r.n, q = r.d;
  const inner = p === 0n ? (q === 1n ? 'x' : `${q}x`) : `${q === 1n ? '' : q}x ${p > 0n ? '−' : '+'} ${absB(p)}`;
  return { text: `(${inner})`, q };
}

/** Solve with integerized coefficients for exact surd output. */
export function solveQuadratic(aS: string, bS: string, cS: string): Solved {
  const a = Rat.parse(aS), b = Rat.parse(bS), c = Rat.parse(cS);
  if (a.isZero()) throw new Error('a must be non-zero for a quadratic (otherwise it is linear).');
  // scale to integers: multiply by lcm of denominators
  const l = (x: bigint, y: bigint) => (x / gcdB(x, y)) * y;
  const L = l(l(a.d, b.d), c.d);
  let aI = a.n * (L / a.d), bI = b.n * (L / b.d), cI = c.n * (L / c.d);
  const g = gcdB(gcdB(aI, bI), cI) || 1n;
  aI /= g; bI /= g; cI /= g;
  if (aI < 0n) { aI = -aI; bI = -bI; cI = -cI; }

  const D = bI * bI - 4n * aI * cI;
  const two_a = 2n * aI;
  const fmtRat = (n: bigint, d: bigint) => new Rat(n, d).toFrac();
  const vertexX = new Rat(-bI, two_a);
  const vertexY = new Rat(4n * aI * cI - bI * bI, 4n * aI);
  const vertex = `(${vertexX.toFrac()}, ${vertexY.toFrac()})`;

  if (D === 0n) {
    const r = fmtRat(-bI, two_a);
    const f = linFactor(-bI, two_a);
    const kf = aI / (f.q * f.q);
    return {
      aI, bI, cI, D, kind: 'double', roots: [r], approx: [new Rat(-bI, two_a).toDecimal(8).text], vertex,
      factored: `${kf === 1n ? '' : kf}${f.text}²`,
    };
  }

  const [k, m] = extractSquare(absB(D));
  if (D > 0n && m === 1n) {
    // rational roots
    const s = isqrt(D);
    const r1 = fmtRat(-bI + s, two_a), r2 = fmtRat(-bI - s, two_a);
    const f1 = linFactor(-bI + s, two_a), f2 = linFactor(-bI - s, two_a);
    const kf = aI / (f1.q * f2.q);
    return {
      aI, bI, cI, D, kind: 'rational',
      roots: [r1, r2],
      approx: [new Rat(-bI + s, two_a).toDecimal(8).text, new Rat(-bI - s, two_a).toDecimal(8).text],
      vertex,
      factored: `${kf === 1n ? '' : kf}${f1.text}${f2.text}`,
    };
  }

  // surd form: (-b ± k√m) / 2a, reduced by gcd(b, k, 2a)
  const gg = gcdB(gcdB(absB(bI), k), absB(two_a)) || 1n;
  const nb = -bI / gg, kk = k / gg, den = two_a / gg;
  const denS = den === 1n ? '' : ` / ${den}`;
  const nbS = nb === 0n ? '' : `${nb} `;
  const kS = kk === 1n ? '' : String(kk);
  if (D > 0n) {
    const surd = `${kS}√${m}`;
    const rootStr = (sign: string) => `(${nbS}${nb === 0n ? (sign === '−' ? '−' : '') : `${sign} `}${surd})${denS}`.replace('( ', '(');
    const sqrtD = Math.sqrt(Number(D));
    const ap = (s: number) => ((Number(-bI) + s * sqrtD) / Number(two_a)).toFixed(6);
    return { aI, bI, cI, D, kind: 'irrational', roots: [rootStr('+'), rootStr('−')], approx: [ap(1), ap(-1)], vertex };
  }
  // complex
  const surd = m === 1n ? `${kS}i` : `${kS}√${m}·i`;
  const re = new Rat(-bI, two_a);
  const imNum = Math.sqrt(Number(absB(D))) / Number(two_a);
  const rootStr = (sign: string) => `(${nbS}${nb === 0n ? (sign === '−' ? '−' : '') : `${sign} `}${surd})${denS}`.replace('( ', '(');
  return {
    aI, bI, cI, D, kind: 'complex',
    roots: [rootStr('+'), rootStr('−')],
    approx: [`${re.toDecimal(6).text} + ${imNum.toFixed(6)}i`, `${re.toDecimal(6).text} − ${imNum.toFixed(6)}i`],
    vertex,
  };
}

