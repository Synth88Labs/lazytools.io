/**
 * SENIOR FIXER (LLM) — autonomous, build-gated fixes for MANUAL findings.
 *
 * Runs "all the time" (continuous cron). For each safe manual finding it asks
 * Claude for a precise edit to the tool's registry entry, APPLIES it, then runs
 * the full production build as a safety gate: build passes -> keep the fix and
 * mark it `verifying` (the Auditor re-checks the live page next cycle); build
 * fails or the edit can't be located -> revert and count an attempt (challenged
 * after 3). So the live site is only ever changed by a build-passing edit, and
 * everything is in git (reversible).
 *
 * Deliberately scoped: only per-tool registry string fixes (SEO title/meta) are
 * auto-applied. Systemic issues (the third-party ad tracker = your revenue
 * decision; global colour-contrast) are left for the owner — the Manager flags
 * them. Findings whose source isn't a simple registry entry get a proposal in
 * audits/fix-queue/ instead.
 *
 * Requires ANTHROPIC_API_KEY; respects the Manager's daily token budget.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execSync } from 'node:child_process';
import { callClaude, parseJson, logTokens, budgetStatus, haveKey } from './lib/anthropic.mjs';

const ROOT = new URL('../', import.meta.url);
const LEDGER_PATH = new URL('audits/ledger.json', ROOT);
const today = new Date().toISOString().slice(0, 10);
const MODEL = process.env.FIXER_MODEL || 'claude-sonnet-5';
const PER_RUN = Number(process.env.FIXER_PER_RUN || 4);

const PREFIX_FILE = {
  units: 'units', calc: 'calc', size: 'size', text: 'text', color: 'color', file: 'file', dev: 'dev',
  generate: 'generate', time: 'time', security: 'security', image: 'image', pdf: 'pdf', video: 'video',
  calendar: 'calendar', charts: 'charts', fonts: 'fonts', cipher: 'cipher', productivity: 'productivity',
  network: 'network', math: 'math', photo: 'photo', biology: 'biology', statistics: 'statistics',
  chemistry: 'chemistry', physics: 'physics', home: 'home', finance: 'finance', cooking: 'cooking',
  automotive: 'automotive', fitness: 'fitness', pets: 'pets', garden: 'garden', music: 'music',
  weather: 'weather', astronomy: 'astronomy', photography: 'photography', electronics: 'electronics',
  travel: 'travel', '3d-printing': 'printing3d', solar: 'solar', brewing: 'brewing',
};
const dataFileFor = (slug) => { const p = PREFIX_FILE[slug.split('/')[0]]; return p ? `src/data/${p}/index.ts` : null; };
const AUTO_CATEGORIES = new Set((process.env.FIXER_AUTO || 'seo').split(','));

const ledger = JSON.parse(await readFile(LEDGER_PATH, 'utf8'));
if (!haveKey()) { console.log('Fixer(LLM): ANTHROPIC_API_KEY not set — skipping.'); process.exit(0); }

const findings = Object.values(ledger.findings || {});
const rank = { critical: 4, high: 3, medium: 2, low: 1 };
// Only auto-apply the genuinely safe, per-tool class: over-length titles in a
// data-driven registry. og:image (needs a generated asset), colour-contrast
// (global CSS) and the ad-tracker (owner revenue decision) are systemic and are
// left for the owner — the Manager flags them, and they can get fix-queue drafts.
const AUTO_APPLY = /title present/i;
const queue = findings
  .filter((f) => f.status === 'open' && f.fixType === 'manual' && !f.fixProposal && AUTO_CATEGORIES.has(f.category) && AUTO_APPLY.test(f.check) && dataFileFor(f.tool))
  .sort((a, b) => (rank[b.severity] || 0) - (rank[a.severity] || 0))
  .slice(0, PER_RUN);

if (!queue.length) { console.log('Fixer(LLM): no auto-applicable manual findings this run.'); process.exit(0); }

// Tightly bound the segment to the TARGET tool's own entry (between the
// surrounding `},` separators) so the model can never edit a neighbouring entry.
function entrySegment(fileText, slug) {
  const tail = slug.split('/').slice(1).join('/');
  const anchor = `slug: '${tail}'`;
  const idx = fileText.indexOf(anchor);
  if (idx < 0) return null;
  const prevSep = fileText.lastIndexOf('},', idx);
  const start = prevSep < 0 ? Math.max(0, fileText.lastIndexOf('{', idx)) : prevSep + 2;
  const nextSep = fileText.indexOf('},', idx);
  const end = nextSep < 0 ? Math.min(fileText.length, idx + 1200) : nextSep + 1;
  return { start, end, text: fileText.slice(start, end) };
}

const system = `You are a senior developer fixing a data-driven tool registry entry in a TypeScript file for LazyTools.io.
You are given ONE tool's registry entry text and a finding to fix. Return STRICT JSON only:
{"old":"<an EXACT substring copied verbatim from the entry>", "new":"<the replacement>"}
Rules: 'old' must appear exactly once in the provided entry text and be copied character-for-character. Keep valid TypeScript and matching quotes. Make the smallest change that fixes the finding by editing an EXISTING string value only — never add a new field/key, never touch another tool. For an over-length <title>, shorten the entry's own name/title string so the rendered title (a " — Free & Private | LazyTools" style suffix is appended) stays ≤ 60 chars while remaining descriptive; 'new' must be SHORTER than 'old'.`;

const applied = []; // {f, file}
const changedFiles = new Map(); // path -> new text (in-memory)
const fileCache = new Map();
async function readFileCached(rel) {
  if (fileCache.has(rel)) return fileCache.get(rel);
  const t = await readFile(new URL(rel, ROOT), 'utf8'); fileCache.set(rel, t); return t;
}

for (const f of queue) {
  const budget = budgetStatus(ledger);
  if (!budget.ok) { console.log(`Fixer(LLM): token budget reached (${budget.used}/${budget.cap}) — stopping.`); break; }
  const rel = dataFileFor(f.tool);
  let fileText = changedFiles.get(rel) || await readFileCached(rel);
  const seg = entrySegment(fileText, f.tool);
  if (!seg) { console.log(`Fixer(LLM): couldn't locate ${f.tool} entry — skipping.`); continue; }

  try {
    const { text, usage } = await callClaude({
      system, model: MODEL, maxTokens: 2500,
      user: `Finding (${f.category}/${f.severity}): ${f.check}\nDetail: ${f.detail || '—'}\n\nEntry text:\n${seg.text}`,
    });
    logTokens(ledger, 'fixer', usage);
    const patch = parseJson(text);
    if (!patch || typeof patch.old !== 'string' || typeof patch.new !== 'string' || patch.old.length < 3) { console.log(`Fixer(LLM): no usable patch for ${f.tool}.`); continue; }
    // validate: 'old' is inside the TARGET entry segment and unique in the whole file
    if (seg.text.indexOf(patch.old) < 0) { console.log(`Fixer(LLM): patch.old not in ${f.tool}'s own entry — skipping.`); continue; }
    if (/title|60 chars/i.test(f.check) && patch.new.length >= patch.old.length) { console.log(`Fixer(LLM): title patch for ${f.tool} isn't shorter — skipping.`); continue; }
    if (patch.new.split(':').length > patch.old.split(':').length) { console.log(`Fixer(LLM): patch for ${f.tool} looks like it adds a field — skipping.`); continue; }
    const occurrences = fileText.split(patch.old).length - 1;
    if (occurrences !== 1) { console.log(`Fixer(LLM): patch.old not unique (${occurrences}) in ${rel} — skipping.`); continue; }
    fileText = fileText.replace(patch.old, patch.new);
    changedFiles.set(rel, fileText);
    applied.push({ f, file: rel, note: `${patch.old.slice(0, 40)}… → ${patch.new.slice(0, 40)}…` });
    console.log(`Fixer(LLM): staged fix for ${f.tool} — ${f.check}`);
  } catch (e) {
    console.error(`Fixer(LLM) failed on ${f.tool}:`, e.message);
  }
}

let buildOk = false;
if (applied.length) {
  for (const [rel, txt] of changedFiles) await writeFile(new URL(rel, ROOT), txt);
  try {
    console.log('Fixer(LLM): running build gate…');
    execSync('npm run build', { cwd: new URL('.', ROOT), stdio: 'inherit' });
    buildOk = true;
  } catch { buildOk = false; }

  if (buildOk) {
    for (const a of applied) { a.f.status = 'verifying'; a.f.fixedOn = today; a.f.attempts = 0; (a.f.history ||= []).push({ date: today, event: 'llm-fixed', note: a.note }); }
    console.log(`Fixer(LLM): build passed — ${applied.length} fix(es) applied, marked verifying.`);
  } else {
    // revert every changed file, count attempts
    for (const rel of changedFiles.keys()) { try { execSync(`git checkout -- ${rel}`, { cwd: new URL('.', ROOT) }); } catch {} }
    for (const a of applied) {
      a.f.attempts = (a.f.attempts || 0) + 1;
      if (a.f.attempts >= 3) { a.f.status = 'challenged'; (a.f.history ||= []).push({ date: today, event: 'challenged', note: 'LLM fix broke the build 3× — needs a human' }); }
      else (a.f.history ||= []).push({ date: today, event: 'llm-fix-reverted', note: 'build failed; reverted' });
    }
    console.log(`Fixer(LLM): build FAILED — reverted ${applied.length} change(s).`);
  }
}

await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');
const changed = buildOk && applied.length > 0;
console.log(`Fixer(LLM): ${changed ? applied.length : 0} applied, build ${applied.length ? (buildOk ? 'passed' : 'reverted') : 'n/a'}.`);
if (process.env.GITHUB_OUTPUT) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_OUTPUT, `fixes_applied=${changed ? applied.length : 0}\nchanged=${changed}\n`);
}
