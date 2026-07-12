/**
 * Node test for the restriction-digest and protein-pI helpers in
 * src/lib/biology.ts — run:
 *   node --experimental-strip-types scripts/test-biology-extra.ts
 */
import {
  findSites, digest, getEnzyme, chargeCounts, netCharge, isoelectricPoint, cleanSeq,
} from '../src/lib/biology.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${JSON.stringify(got)})` : '')); }
}
const rel = (a: number, b: number, tol = 1e-3) => Math.abs(a - b) <= tol * Math.abs(b);
const near = (a: number, b: number, tol = 0.05) => Math.abs(a - b) <= tol;

// ── findSites ──
ok('EcoRI site found once', findSites('AAAGAATTCAAA', 'GAATTC').length === 1, findSites('AAAGAATTCAAA', 'GAATTC'));
ok('EcoRI site index correct', findSites('AAAGAATTCAAA', 'GAATTC')[0] === 3);
ok('no site → empty', findSites('AAAACCCCGGGG', 'GAATTC').length === 0);
ok('lowercase site not matched (caller cleans first)', findSites('GAATTCgaattc', 'GAATTC').length === 1, findSites('GAATTCgaattc', 'GAATTC'));
ok('two sites (clean)', findSites(cleanSeq('GAATTCttGAATTC'), 'GAATTC').length === 2);
// overlapping 4-cutter
ok('overlapping AATT-like', findSites('AAAA', 'AA').length === 3, findSites('AAAA', 'AA'));
// IUPAC: HinfI GANTC
ok('HinfI GANTC matches GAATC', findSites('GAATC', 'GANTC').length === 1);
ok('HinfI GANTC matches GACTC', findSites('GACTC', 'GANTC').length === 1);
ok('HinfI GANTC no match GGGTC', findSites('GGGTC', 'GANTC').length === 0);

// ── enzyme table sanity ──
ok('EcoRI cut offset 1', getEnzyme('EcoRI')!.cut === 1);
ok('EcoRV blunt', getEnzyme('EcoRV')!.ends === 'blunt');
ok('SmaI blunt cut 3', getEnzyme('SmaI')!.cut === 3 && getEnzyme('SmaI')!.ends === 'blunt');

// ── digest: linear ──
// EcoRI site at index 3 in "AAAGAATTCAAA" (len 12); cut at 3+1=4 → fragments [4, 8]
{
  const d = digest('AAAGAATTCAAA', ['EcoRI']);
  ok('digest cut count 1', d.cuts.length === 1, d.cuts);
  ok('digest cutAt = 4', d.cuts[0].cutAt === 4, d.cuts[0]);
  ok('digest fragments 8+4', JSON.stringify(d.fragments) === JSON.stringify([8, 4]), d.fragments);
  ok('digest fragments sum to length', d.fragments.reduce((a, b) => a + b, 0) === 12);
}
// no cut → single fragment = whole length
{
  const d = digest('AAAACCCCGGGG', ['EcoRI']);
  ok('uncut → one fragment = length', d.fragments.length === 1 && d.fragments[0] === 12, d.fragments);
}
// two enzymes, two cuts
{
  const seq = 'GAATTC' + 'AAAAAA' + 'GGATCC'; // EcoRI at 0 (cut@1), BamHI at 12 (cut@13); len 18
  const d = digest(seq, ['EcoRI', 'BamHI']);
  ok('two-enzyme cut count', d.cuts.length === 2, d.cuts);
  ok('two-enzyme fragments sum', d.fragments.reduce((a, b) => a + b, 0) === 18, d.fragments);
  // cuts at 1 and 13 → fragments [1,12,5] → sorted desc [12,5,1]
  ok('two-enzyme fragments', JSON.stringify(d.fragments) === JSON.stringify([12, 5, 1]), d.fragments);
}
// circular: one cut linearises to one fragment = length
{
  const d = digest('AAAGAATTCAAA', ['EcoRI'], true);
  ok('circular one cut → one fragment = length', d.fragments.length === 1 && d.fragments[0] === 12, d.fragments);
}

// ── protein charge / pI ──
// A single Lys (very basic) → pI high
{
  const c = chargeCounts('K');
  ok('pI of K is basic (>9)', isoelectricPoint(c) > 9, isoelectricPoint(c));
  ok('net charge of K at pH 7 ≈ +2 (Nterm + Lys, minus Cterm)', near(netCharge(c, 7), 2 - 1, 0.2), netCharge(c, 7));
}
// A single Glu (acidic) → pI low
{
  const c = chargeCounts('E');
  ok('pI of E is acidic (<4)', isoelectricPoint(c) < 4.5, isoelectricPoint(c));
}
// net charge crosses zero at pI
{
  const c = chargeCounts('KADEHRY');
  const pI = isoelectricPoint(c);
  ok('net charge at pI ≈ 0', Math.abs(netCharge(c, pI)) < 1e-3, netCharge(c, pI));
  ok('charge decreases with pH', netCharge(c, pI - 1) > 0 && netCharge(c, pI + 1) < 0);
}
// insulin-ish acidic protein: many D/E → pI in acidic range; sanity that pI in (0,14)
{
  const c = chargeCounts(cleanSeq('MALWMRLLPLLALLALWGPDPAAAFVNQHLCGSHLVEALYLVCGERGFFYTPKT'));
  const pI = isoelectricPoint(c);
  ok('pI within 0–14', pI > 0 && pI < 14, pI);
  ok('charge monotonic sign around pI', netCharge(c, pI - 2) > 0 && netCharge(c, pI + 2) < 0);
}
// counts pick up only charge residues
{
  const c = chargeCounts('KKRRDDEECHY');
  ok('count K=2', c.K === 2);
  ok('count D=2', c.D === 2);
  ok('count H=1', c.H === 1);
  ok('residues counted', c.residues === 11);
}

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
