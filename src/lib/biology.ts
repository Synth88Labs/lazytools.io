/**
 * Biology & Lab compute library — pure, deterministic, staleness-proof functions.
 * Sequence operations, dilution/molarity, primer Tm, molecular weight, genetics
 * (Punnett, Hardy–Weinberg) and growth. No external data; the only reference
 * constants (genetic code, nucleotide masses, A260 factors) are fixed physical
 * values that do not change. Node-tested in test/biology.test.mjs.
 */

// ───────────────────────── sequences ─────────────────────────

/** Standard genetic code (DNA codons, T not U). '*' = stop. */
export const CODON_TABLE: Record<string, string> = {
  TTT: 'F', TTC: 'F', TTA: 'L', TTG: 'L', CTT: 'L', CTC: 'L', CTA: 'L', CTG: 'L',
  ATT: 'I', ATC: 'I', ATA: 'I', ATG: 'M', GTT: 'V', GTC: 'V', GTA: 'V', GTG: 'V',
  TCT: 'S', TCC: 'S', TCA: 'S', TCG: 'S', CCT: 'P', CCC: 'P', CCA: 'P', CCG: 'P',
  ACT: 'T', ACC: 'T', ACA: 'T', ACG: 'T', GCT: 'A', GCC: 'A', GCA: 'A', GCG: 'A',
  TAT: 'Y', TAC: 'Y', TAA: '*', TAG: '*', CAT: 'H', CAC: 'H', CAA: 'Q', CAG: 'Q',
  AAT: 'N', AAC: 'N', AAA: 'K', AAG: 'K', GAT: 'D', GAC: 'D', GAA: 'E', GAG: 'E',
  TGT: 'C', TGC: 'C', TGA: '*', TGG: 'W', CGT: 'R', CGC: 'R', CGA: 'R', CGG: 'R',
  AGT: 'S', AGC: 'S', AGA: 'R', AGG: 'R', GGT: 'G', GGC: 'G', GGA: 'G', GGG: 'G',
};

/** Three-letter + full amino-acid names, keyed by one-letter code. */
export const AA_NAMES: Record<string, [string, string]> = {
  A: ['Ala', 'Alanine'], R: ['Arg', 'Arginine'], N: ['Asn', 'Asparagine'], D: ['Asp', 'Aspartate'],
  C: ['Cys', 'Cysteine'], E: ['Glu', 'Glutamate'], Q: ['Gln', 'Glutamine'], G: ['Gly', 'Glycine'],
  H: ['His', 'Histidine'], I: ['Ile', 'Isoleucine'], L: ['Leu', 'Leucine'], K: ['Lys', 'Lysine'],
  M: ['Met', 'Methionine'], F: ['Phe', 'Phenylalanine'], P: ['Pro', 'Proline'], S: ['Ser', 'Serine'],
  T: ['Thr', 'Threonine'], W: ['Trp', 'Tryptophan'], Y: ['Tyr', 'Tyrosine'], V: ['Val', 'Valine'],
  '*': ['Stop', 'Stop codon'],
};

const COMPLEMENT: Record<string, string> = {
  A: 'T', T: 'A', U: 'A', G: 'C', C: 'G',
  R: 'Y', Y: 'R', S: 'S', W: 'W', K: 'M', M: 'K',
  B: 'V', V: 'B', D: 'H', H: 'D', N: 'N',
};

/** Strip FASTA headers, whitespace and numbers; uppercase. Returns clean letters only. */
export function cleanSeq(raw: string): string {
  return raw
    .split('\n')
    .filter((l) => !l.trim().startsWith('>'))
    .join('')
    .toUpperCase()
    .replace(/[^A-Z]/g, '');
}

/** True if the sequence contains U (RNA) and no T. */
export const isRNA = (s: string) => s.includes('U') && !s.includes('T');

/** Reverse complement, preserving 5'→3'. RNA output uses U. */
export function reverseComplement(seq: string, asRNA = false): string {
  let out = '';
  for (let i = seq.length - 1; i >= 0; i--) {
    let c = COMPLEMENT[seq[i]] ?? 'N';
    if (asRNA && c === 'T') c = 'U';
    out += c;
  }
  return out;
}

/** Plain complement (not reversed). */
export function complement(seq: string, asRNA = false): string {
  return [...seq].map((b) => { let c = COMPLEMENT[b] ?? 'N'; if (asRNA && c === 'T') c = 'U'; return c; }).join('');
}

/** Transcribe a coding-strand DNA sequence to mRNA (T→U). */
export function transcribe(dna: string): string {
  return dna.replace(/T/g, 'U');
}

/** Translate a nucleotide sequence (DNA or RNA) from a reading frame (0,1,2). */
export function translate(seq: string, frame = 0): { protein: string; stops: number } {
  const dna = seq.replace(/U/g, 'T');
  let protein = '', stops = 0;
  for (let i = frame; i + 3 <= dna.length; i += 3) {
    const codon = dna.slice(i, i + 3);
    const aa = CODON_TABLE[codon] ?? 'X';
    if (aa === '*') { protein += '*'; stops++; } else protein += aa;
  }
  return { protein, stops };
}

/** GC content as a percentage (0–100), counting only G/C/A/T/U. */
export function gcContent(seq: string): { gc: number; at: number; gcPct: number; length: number } {
  let g = 0, c = 0, a = 0, t = 0;
  for (const b of seq) {
    if (b === 'G') g++; else if (b === 'C') c++;
    else if (b === 'A') a++; else if (b === 'T' || b === 'U') t++;
  }
  const counted = g + c + a + t;
  return { gc: g + c, at: a + t, gcPct: counted ? ((g + c) / counted) * 100 : 0, length: seq.length };
}

// ───────────────────────── melting temperature ─────────────────────────

/** Base counts for A,T(+U),G,C. */
export function baseCounts(seq: string) {
  let a = 0, t = 0, g = 0, c = 0;
  for (const b of seq) { if (b === 'A') a++; else if (b === 'T' || b === 'U') t++; else if (b === 'G') g++; else if (b === 'C') c++; }
  return { a, t, g, c };
}

/**
 * Melting temperature. Wallace rule 2(A+T)+4(G+C) for short oligos (<14 nt);
 * salt-adjusted GC formula 64.9 + 41(G+C−16.4)/N for longer. Returns the value
 * and which method applied.
 */
export function meltingTemp(seq: string): { tm: number; method: string } {
  const { a, t, g, c } = baseCounts(seq);
  const n = a + t + g + c;
  if (n === 0) return { tm: 0, method: '—' };
  if (n < 14) return { tm: 2 * (a + t) + 4 * (g + c), method: 'Wallace rule (2·AT + 4·GC)' };
  return { tm: 64.9 + (41 * (g + c - 16.4)) / n, method: 'Salt-adjusted GC (Marmur–Doty)' };
}

// ───────────────────────── molecular weight & mass↔mole ─────────────────────────

const DNA_MP: Record<string, number> = { A: 313.21, T: 304.2, C: 289.18, G: 329.21 };
const RNA_MP: Record<string, number> = { A: 329.21, U: 306.17, C: 305.18, G: 345.21 };

/** Anhydrous molecular weight (g/mol) of a single-stranded oligo (IDT/BioMath formula). */
export function ssMolecularWeight(seq: string, rna = false): number {
  const map = rna ? RNA_MP : DNA_MP;
  let mw = 0, n = 0;
  for (const b of seq) { const key = rna && b === 'T' ? 'U' : b; if (map[key] != null) { mw += map[key]; n++; } }
  return n ? mw - 61.96 : 0;
}

/** dsDNA molecular weight = sum of both strand MWs. */
export function dsMolecularWeight(seq: string): number {
  return ssMolecularWeight(seq) + ssMolecularWeight(reverseComplement(seq));
}

/** ng ↔ pmol via MW. pmol = ng·1000 / MW. */
export const ngToPmol = (ng: number, mw: number) => (mw > 0 ? (ng * 1000) / mw : 0);
export const pmolToNg = (pmol: number, mw: number) => (pmol * mw) / 1000;
/** Molecule copies from moles. */
export const molesToCopies = (mol: number) => mol * 6.02214076e23;

/** Nucleic-acid concentration from A260. Factor: dsDNA 50, ssDNA 33, RNA 40 (ng/µL per A260). */
export function concFromA260(a260: number, factor: number, dilution = 1): number {
  return a260 * factor * dilution;
}

// ───────────────────────── dilution & molarity ─────────────────────────

/** Solve C1·V1 = C2·V2 for the one missing value (pass null for the unknown). */
export function solveDilution(c1: number | null, v1: number | null, c2: number | null, v2: number | null): number | null {
  if (c1 == null && v1 != null && c2 != null && v2 != null) return v1 !== 0 ? (c2 * v2) / v1 : null;
  if (v1 == null && c1 != null && c2 != null && v2 != null) return c1 !== 0 ? (c2 * v2) / c1 : null;
  if (c2 == null && c1 != null && v1 != null && v2 != null) return v2 !== 0 ? (c1 * v1) / v2 : null;
  if (v2 == null && c1 != null && v1 != null && c2 != null) return c2 !== 0 ? (c1 * v1) / c2 : null;
  return null;
}

/** Serial dilution plan: N tubes each diluted `fold`× from the previous, final volume V per tube. */
export function serialDilution(stock: number, fold: number, tubes: number, volPerTube: number) {
  const rows = [];
  let conc = stock;
  for (let i = 1; i <= tubes; i++) {
    conc = i === 1 ? stock / fold : conc / fold;
    const transfer = volPerTube / (fold - 1);
    rows.push({ tube: i, conc, transfer, diluent: volPerTube - transfer, cumulativeFold: Math.pow(fold, i) });
  }
  return rows;
}

/** Molarity relations: moles = mass/MW; molarity = moles/volL. Solve for the null field. */
export function solveMolarity(massG: number | null, mw: number, molarity: number | null, volL: number | null) {
  if (massG == null && molarity != null && volL != null) return { value: molarity * volL * mw, unit: 'g' };
  if (molarity == null && massG != null && volL != null && volL !== 0) return { value: massG / mw / volL, unit: 'mol/L' };
  if (volL == null && massG != null && molarity != null && molarity !== 0) return { value: massG / mw / molarity, unit: 'L' };
  return null;
}

// ───────────────────────── growth ─────────────────────────

/** Doubling time from two counts/OD readings over an interval. */
export function doublingTime(n1: number, n2: number, dt: number) {
  if (n1 <= 0 || n2 <= 0 || dt <= 0) return null;
  const mu = Math.log(n2 / n1) / dt;                 // specific growth rate (per time)
  const td = mu !== 0 ? Math.LN2 / mu : Infinity;    // doubling time
  const generations = Math.log2(n2 / n1);
  return { mu, td, generations };
}

/** Exponential and logistic population size at time t. */
export const expGrowth = (n0: number, r: number, t: number) => n0 * Math.exp(r * t);
export const logisticGrowth = (n0: number, r: number, t: number, k: number) =>
  k / (1 + ((k - n0) / n0) * Math.exp(-r * t));

/** OD600 → cells/mL using an organism factor (E. coli ≈ 8e8, yeast ≈ 3e7 per OD). */
export const od600Cells = (od: number, factor: number, dilution = 1) => od * factor * dilution;

// ───────────────────────── genetics: Hardy–Weinberg ─────────────────────────

/**
 * Hardy–Weinberg from genotype counts. Returns allele freqs, expected counts,
 * χ² goodness-of-fit (df=1), and a p-value via the caller-supplied chi-square CDF.
 */
export function hardyWeinberg(aa: number, ab: number, bb: number, chiSqCdf: (x: number, df: number) => number) {
  const total = aa + ab + bb;
  if (total <= 0) return null;
  const p = (2 * aa + ab) / (2 * total);   // freq of allele A
  const q = 1 - p;                          // freq of allele a
  const exp = { aa: p * p * total, ab: 2 * p * q * total, bb: q * q * total };
  const chi = ((aa - exp.aa) ** 2) / (exp.aa || 1) + ((ab - exp.ab) ** 2) / (exp.ab || 1) + ((bb - exp.bb) ** 2) / (exp.bb || 1);
  const df = 1;
  const pValue = 1 - chiSqCdf(chi, df);
  return { total, p, q, expected: exp, chi, df, pValue, inEquilibrium: pValue > 0.05 };
}

// ───────────────────────── genetics: Punnett ─────────────────────────

/** Split a genotype string like "AaBb" into per-gene allele pairs [["A","a"],["B","b"]]. */
export function parseGenotype(g: string): string[][] {
  const letters = g.replace(/[^A-Za-z]/g, '');
  const genes: string[][] = [];
  for (let i = 0; i < letters.length; i += 2) genes.push([letters[i], letters[i + 1] ?? letters[i]]);
  return genes;
}

/** All gametes for a genotype = cartesian product of one allele per gene. */
export function gametes(genes: string[][]): string[] {
  return genes.reduce<string[]>((acc, pair) => acc.flatMap((g) => pair.map((a) => g + a)), ['']);
}

/** Canonicalise a genotype: dominant (uppercase) allele first, per gene. */
export function canonGenotype(alleles: string): string {
  const pairs: string[] = [];
  for (let i = 0; i < alleles.length; i += 2) {
    const two = [alleles[i], alleles[i + 1]].sort((a, b) =>
      a.toLowerCase() === b.toLowerCase() ? (a < b ? -1 : 1) : a.toLowerCase() < b.toLowerCase() ? -1 : 1);
    pairs.push(two.join(''));
  }
  return pairs.join('');
}

/** Phenotype label: dominant if any uppercase allele for a gene, else recessive. */
export function phenotype(genotype: string): string {
  let out = '';
  for (let i = 0; i < genotype.length; i += 2) {
    const a = genotype[i], b = genotype[i + 1];
    out += a === a.toUpperCase() || b === b.toUpperCase() ? a.toUpperCase() : a.toLowerCase() + a.toLowerCase();
  }
  return out;
}

/** Full Punnett cross: grid of offspring genotypes + genotype/phenotype ratio tallies. */
export function punnett(p1: string, p2: string) {
  const g1 = gametes(parseGenotype(p1));
  const g2 = gametes(parseGenotype(p2));
  const grid: string[][] = [];
  const genoTally: Record<string, number> = {};
  const phenoTally: Record<string, number> = {};
  for (const a of g1) {
    const row: string[] = [];
    for (const b of g2) {
      // combine gene-by-gene, canonicalise
      let combined = '';
      for (let gene = 0; gene < a.length; gene++) combined += canonGenotype(a[gene] + b[gene]);
      row.push(combined);
      genoTally[combined] = (genoTally[combined] || 0) + 1;
      const ph = phenotype(combined);
      phenoTally[ph] = (phenoTally[ph] || 0) + 1;
    }
    grid.push(row);
  }
  return { gametes1: g1, gametes2: g2, grid, genoTally, phenoTally, total: g1.length * g2.length };
}
