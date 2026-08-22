/**
 * RESEARCHER — the fourth agent. Weekly, LLM-powered.
 *
 * Understands the LazyTools.io catalogue and mission, then proposes NEW tools
 * that would genuinely help users: privacy-first, 100% client-side, real search
 * demand, doable competition, and NOT already in the catalogue. Reports the
 * recommendations to the Manager, who rates each one; the top-rated ones become
 * the Core Developer's build queue.
 *
 * Token-optimized: a single Claude call with a compact catalogue summary.
 * Requires ANTHROPIC_API_KEY (a GitHub repo secret in CI). Skips cleanly if the
 * key or token budget is unavailable.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { callClaude, parseJson, logTokens, budgetStatus, haveKey } from './lib/anthropic.mjs';

const ROOT = new URL('../', import.meta.url);
const LEDGER_PATH = new URL('audits/ledger.json', ROOT);
const today = new Date().toISOString().slice(0, 10);
const MODEL = process.env.RESEARCH_MODEL || 'claude-sonnet-5';
const COUNT = Number(process.env.RESEARCH_COUNT || 8);

const ledger = JSON.parse(await readFile(LEDGER_PATH, 'utf8'));

if (!haveKey()) { console.log('Researcher: ANTHROPIC_API_KEY not set — skipping (no tokens spent).'); process.exit(0); }
const budget = budgetStatus(ledger);
if (!budget.ok) { console.log(`Researcher: daily token budget reached (${budget.used}/${budget.cap}) — skipping.`); process.exit(0); }

let slugs = [];
try { slugs = JSON.parse(await readFile(new URL('api/tools-allowlist.json', ROOT), 'utf8')); } catch {}
const byCat = {};
for (const s of slugs) { const [c, t] = [s.split('/')[0], s.split('/').slice(1).join('/')]; (byCat[c] ||= []).push(t); }
const catSummary = Object.entries(byCat).sort((a, b) => b[1].length - a[1].length)
  .map(([c, ts]) => `${c} (${ts.length}): ${ts.slice(0, 40).join(', ')}${ts.length > 40 ? ', …' : ''}`).join('\n');
const existing = new Set(slugs.map((s) => s.toLowerCase().replace(/[^a-z0-9/]/g, '')));

const system = `You are the Researcher for LazyTools.io, a privacy-first library of free online tools.
Mission & hard constraints:
- Every tool runs 100% client-side in the browser (no uploads, no server compute). Reject any idea that needs a backend, login, paid API, or live/streaming data.
- Tools are calculators, converters, generators, formatters, and analyzers with deterministic or well-sourced logic.
- Must clear Google AdSense's thin-content bar: each tool page carries real editorial value.
- Prefer durable, "AI-resistant" utilities people return to (not one-off gimmicks a chatbot replaces).
- Do NOT propose anything that already exists in the catalogue.
You return STRICT JSON only — no prose, no markdown fences.`;

const user = `Existing catalogue (${slugs.length} tools) by category:
${catSummary}

Propose ${COUNT} NEW tools that are the most valuable additions and are NOT already present.
Favor underserved categories and genuine search demand with attainable competition.

Return a JSON array; each item:
{
 "name": "Human Title Case name",
 "slug": "category/kebab-tool-name",   // category MUST be an existing category above
 "category": "existing-category",
 "description": "one sentence, what it does",
 "whyValuable": "one sentence on user value + demand",
 "searchDemand": "high|medium|low",
 "competition": "low|medium|high",
 "effort": "S|M|L",                      // build effort
 "privacyFit": true,                     // must be true (client-side only)
 "impact": 1-5                           // your estimate of user impact
}`;

let items = null;
for (let attempt = 1; attempt <= 2 && !items; attempt++) {
  try {
    const u = attempt === 1 ? user : user + '\n\nReturn ONLY the JSON array — no prose, no markdown, valid JSON.';
    const { text, usage } = await callClaude({ system, user: u, model: MODEL, maxTokens: 8000 });
    logTokens(ledger, 'researcher', usage);
    const raw = parseJson(text);
    items = (Array.isArray(raw) ? raw : raw.tools || raw.items || []).filter(Boolean);
  } catch (e) {
    console.error(`Researcher attempt ${attempt} failed:`, e.message);
  }
}

if (!items) {
  // still persist the token spend even on a parse failure
  await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');
  console.log('Researcher: no usable result this run.');
  process.exitCode = 0;
} else {

// dedup vs existing catalogue + basic hygiene
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9/]/g, '');
const fresh = [];
for (const it of items) {
  if (!it.slug || !it.name) continue;
  if (existing.has(norm(it.slug))) continue;
  it.status = 'proposed';
  it.managerRating = null;
  it.proposedOn = today;
  fresh.push(it);
}

ledger.research = { generatedOn: today, model: MODEL, items: fresh };
await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');

await mkdir(new URL('audits/research/', ROOT), { recursive: true });
let md = `# 🔬 Researcher report — ${today}\n\n`;
md += `${fresh.length} new tool idea(s), privacy-first & client-side, deduped against the ${slugs.length}-tool catalogue. Awaiting Manager rating.\n\n`;
md += `| # | Tool | Category | Demand | Comp. | Effort | Impact | Why |\n|---|---|---|---|---|---|---|---|\n`;
fresh.forEach((it, i) => { md += `| ${i + 1} | **${it.name}** \`${it.slug}\` | ${it.category} | ${it.searchDemand} | ${it.competition} | ${it.effort} | ${it.impact} | ${it.whyValuable} |\n`; });
md += `\n_Reported to the Manager for rating; top-rated ideas enter the Core Developer's build queue._\n`;
await writeFile(new URL(`audits/research/${today}.md`, ROOT), md);

const totalToday = (ledger.tokens?.daily || []).find((d) => d.date === today);
console.log(`Researcher: ${fresh.length} fresh idea(s) proposed (${MODEL}). Tokens today: ${totalToday ? totalToday.input + totalToday.output : 0}.`);
if (process.env.GITHUB_OUTPUT) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_OUTPUT, `research_count=${fresh.length}\n`);
}

}
