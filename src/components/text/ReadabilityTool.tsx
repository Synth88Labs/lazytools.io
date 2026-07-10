import { useMemo, useState } from 'preact/hooks';
import { readability, fleschBand, gradeLabel } from '../../lib/readability';

const ta = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
const SAMPLE = 'The quick brown fox jumps over the lazy dog. This sentence is short and simple, so it reads easily. Longer sentences with sophisticated, polysyllabic vocabulary inevitably elevate the requisite comprehension threshold considerably.';

export default function ReadabilityTool() {
  const [text, setText] = useState(SAMPLE);
  const r = useMemo(() => readability(text), [text]);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block">
        <span class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Paste your text</span>
        <textarea class={ta} rows={7} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />
      </label>

      {!r ? <p class="mt-4 text-sm text-slate-500">Enter some text to score its readability.</p> : (
        <>
          <div class="mt-4 grid gap-3 sm:grid-cols-2">
            <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Flesch Reading Ease</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{Math.max(0, Math.min(100, r.scores.fleschReadingEase)).toFixed(1)}<span class="text-lg text-slate-400">/100</span></p>
              <p class="mt-1 text-sm font-semibold text-slate-700">{fleschBand(r.scores.fleschReadingEase).label} <span class="font-normal text-slate-500">— {fleschBand(r.scores.fleschReadingEase).note}</span></p>
            </div>
            <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Average grade level</p>
              <p class="mt-1 text-3xl font-extrabold text-brand-800">{r.scores.averageGrade.toFixed(1)}</p>
              <p class="mt-1 text-sm font-semibold text-slate-700">{gradeLabel(r.scores.averageGrade)}</p>
            </div>
          </div>

          <div class="mt-3 overflow-auto rounded-xl border border-slate-200 bg-white">
            <table class="w-full text-right text-sm">
              <thead class="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500"><tr><th class="px-3 py-2 text-left">Index</th><th class="px-3 py-2">Score</th><th class="px-3 py-2 text-left">Meaning</th></tr></thead>
              <tbody class="divide-y divide-slate-100 font-mono">
                <tr><td class="px-3 py-1.5 text-left">Flesch–Kincaid Grade</td><td class="px-3 py-1.5 font-semibold">{r.scores.fleschKincaidGrade.toFixed(1)}</td><td class="px-3 py-1.5 text-left text-slate-500">US grade level</td></tr>
                <tr><td class="px-3 py-1.5 text-left">Gunning Fog</td><td class="px-3 py-1.5 font-semibold">{r.scores.gunningFog.toFixed(1)}</td><td class="px-3 py-1.5 text-left text-slate-500">years of education</td></tr>
                <tr><td class="px-3 py-1.5 text-left">SMOG</td><td class="px-3 py-1.5 font-semibold">{r.scores.smog.toFixed(1)}</td><td class="px-3 py-1.5 text-left text-slate-500">years of education</td></tr>
                <tr><td class="px-3 py-1.5 text-left">Coleman–Liau</td><td class="px-3 py-1.5 font-semibold">{r.scores.colemanLiau.toFixed(1)}</td><td class="px-3 py-1.5 text-left text-slate-500">US grade level</td></tr>
                <tr><td class="px-3 py-1.5 text-left">Automated Readability (ARI)</td><td class="px-3 py-1.5 font-semibold">{r.scores.ari.toFixed(1)}</td><td class="px-3 py-1.5 text-left text-slate-500">US grade level</td></tr>
              </tbody>
            </table>
          </div>
          <p class="mt-2 font-mono text-xs text-slate-400">{r.stats.words} words · {r.stats.sentences} sentences · {r.stats.syllables} syllables · {r.stats.complexWords} complex (3+ syllable) words</p>
        </>
      )}
      <p class="mt-3 text-xs text-slate-500">Six standard formulas, computed exactly in your browser. Aim for Flesch Reading Ease 60+ (grade 8–9) for general audiences. 🔒 Your text is never uploaded.</p>
    </div>
  );
}
