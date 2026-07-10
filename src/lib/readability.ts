/**
 * Readability scoring — deterministic, staleness-proof text formulas.
 * Flesch Reading Ease, Flesch–Kincaid Grade, Gunning Fog, SMOG, Coleman–Liau, ARI.
 * All are standard published formulas; the only heuristic is syllable counting,
 * which every readability tool approximates the same way. Node-tested.
 */

/** Count syllables in a single word with the standard vowel-group heuristic. */
export function countSyllables(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!w) return 0;
  if (w.length <= 3) return 1;
  const s = w
    .replace(/(?:[^laeiouytd]es|[^td]ed|[^laeiouy]e)$/, '') // silent e / -ed (not -ted/-ded) / -es
    .replace(/^y/, '')
    .match(/[aeiouy]+/g); // each contiguous vowel group = one syllable
  return s ? s.length : 1;
}

export interface TextStats {
  words: number;
  sentences: number;
  syllables: number;
  characters: number;      // letters only
  complexWords: number;    // 3+ syllables (Gunning Fog)
  polysyllables: number;   // 3+ syllables (SMOG) — same set, named per formula
}

export function analyzeText(text: string): TextStats {
  const words = text.match(/[A-Za-z0-9']+/g) || [];
  const sentences = Math.max(1, (text.match(/[.!?]+(?:\s|$)/g) || []).length);
  const characters = (text.match(/[A-Za-z]/g) || []).length;
  let syllables = 0, complex = 0;
  for (const w of words) {
    const s = countSyllables(w);
    syllables += s;
    if (s >= 3) complex++;
  }
  return {
    words: words.length,
    sentences,
    syllables,
    characters,
    complexWords: complex,
    polysyllables: complex,
  };
}

export interface ReadabilityScores {
  fleschReadingEase: number;   // 0–100, higher = easier
  fleschKincaidGrade: number;  // US grade level
  gunningFog: number;          // years of education
  smog: number;                // years of education
  colemanLiau: number;         // US grade level
  ari: number;                 // US grade level
  /** average of the grade-level indices */
  averageGrade: number;
}

/** Compute all six readability scores. Returns null for empty/too-short text. */
export function readability(text: string): { stats: TextStats; scores: ReadabilityScores } | null {
  const st = analyzeText(text);
  if (st.words < 1) return null;
  const wps = st.words / st.sentences;        // words per sentence
  const spw = st.syllables / st.words;        // syllables per word
  const L = (st.characters / st.words) * 100; // letters per 100 words
  const S = (st.sentences / st.words) * 100;  // sentences per 100 words

  const fleschReadingEase = 206.835 - 1.015 * wps - 84.6 * spw;
  const fleschKincaidGrade = 0.39 * wps + 11.8 * spw - 15.59;
  const gunningFog = 0.4 * (wps + 100 * (st.complexWords / st.words));
  const smog = 1.0430 * Math.sqrt(st.polysyllables * (30 / st.sentences)) + 3.1291;
  const colemanLiau = 0.0588 * L - 0.296 * S - 15.8;
  const ari = 4.71 * (st.characters / st.words) + 0.5 * wps - 21.43;

  const grades = [fleschKincaidGrade, gunningFog, smog, colemanLiau, ari];
  const averageGrade = grades.reduce((a, b) => a + b, 0) / grades.length;

  return {
    stats: st,
    scores: { fleschReadingEase, fleschKincaidGrade, gunningFog, smog, colemanLiau, ari, averageGrade },
  };
}

/** Plain-English band for a Flesch Reading Ease score. */
export function fleschBand(score: number): { label: string; note: string } {
  if (score >= 90) return { label: 'Very easy', note: '5th grade — easily understood by an 11-year-old' };
  if (score >= 80) return { label: 'Easy', note: '6th grade — conversational English' };
  if (score >= 70) return { label: 'Fairly easy', note: '7th grade' };
  if (score >= 60) return { label: 'Standard', note: '8th–9th grade — plain English' };
  if (score >= 50) return { label: 'Fairly difficult', note: '10th–12th grade' };
  if (score >= 30) return { label: 'Difficult', note: 'College level' };
  return { label: 'Very difficult', note: 'College graduate / professional' };
}

/** Grade number → a rough US reading-level label. */
export function gradeLabel(grade: number): string {
  const g = Math.round(grade);
  if (g <= 5) return 'Elementary';
  if (g <= 8) return 'Middle school';
  if (g <= 12) return 'High school';
  if (g <= 16) return 'College';
  return 'Postgraduate';
}
