/**
 * CORE DEVELOPER — the fifth agent. Weekly, LLM-powered.
 *
 * Takes the Manager-APPROVED tools from the research queue and, for each,
 * produces a complete, build-ready implementation proposal that follows the
 * repo's conventions (data-driven tool entry or component + Node test + registry
 * wiring + unique editorial for the AdSense bar). Proposals are written to
 * audits/dev-queue/<slug>.md for owner review — NOT auto-committed to src, so a
 * live, monetised site is never changed by an unattended LLM. Approve a proposal
 * and it gets implemented + deployed through the normal build.
 *
 * Token-optimized: one call per tool, capped per run. Requires ANTHROPIC_API_KEY
 * and respects the Manager's daily token budget.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { callClaude, logTokens, budgetStatus, haveKey } from './lib/anthropic.mjs';

const ROOT = new URL('../', import.meta.url);
const LEDGER_PATH = new URL('audits/ledger.json', ROOT);
const today = new Date().toISOString().slice(0, 10);
const MODEL = process.env.DEV_MODEL || 'claude-sonnet-5';
const PER_RUN = Number(process.env.DEV_PER_RUN || 2); // build proposals per weekly run

const ledger = JSON.parse(await readFile(LEDGER_PATH, 'utf8'));

if (!haveKey()) { console.log('Developer: ANTHROPIC_API_KEY not set — skipping.'); process.exit(0); }
const research = ledger.research || { items: [] };
const queue = (research.items || []).filter((it) => it.status === 'approved').slice(0, PER_RUN);
if (!queue.length) { console.log('Developer: no approved tools in the queue.'); process.exit(0); }

const system = `You are the Core Developer for LazyTools.io — a senior full-stack engineer who ships privacy-first, 100% client-side browser tools built with Astro 5 + Preact islands + TypeScript, output as static files.

Conventions you follow:
- Pure client-side: no backend, no network, deterministic or well-sourced logic. Cite any real-world constants/sources.
- Tools live under src/data/<category>/index.ts (data-driven: computeId + widget) OR as a Preact component in src/components/<category>/ with a route branch; pick whichever fits.
- Ship a Node test (scripts/test-*.ts) that asserts the maths against known reference values.
- Every tool page needs UNIQUE editorial to clear Google AdSense's thin-content bar: a lead paragraph, "how it works", a note, and 4–8 FAQs — all specific to this tool, no boilerplate.
- No duplicate of an existing tool.

Produce a COMPLETE, build-ready implementation proposal a developer can follow without further questions.`;

await mkdir(new URL('audits/dev-queue/', ROOT), { recursive: true });
let built = 0;
for (const it of queue) {
  const budget = budgetStatus(ledger);
  if (!budget.ok) { console.log(`Developer: token budget reached (${budget.used}/${budget.cap}) — stopping.`); break; }
  const user = `Build a proposal for this Manager-approved tool:
name: ${it.name}
slug: ${it.slug}
category: ${it.category}
description: ${it.description}
why valuable: ${it.whyValuable}
effort: ${it.effort}

Deliver, in markdown:
1. **Approach** — the exact formula/logic (with any sourced constants + citation) and inputs/outputs.
2. **Implementation** — the concrete code: the data entry or component, wired for the site; keep it idiomatic and complete.
3. **Test** — a Node test with 2–3 reference cases and expected values.
4. **Editorial** — lead paragraph, how-it-works, a note, and 5 FAQs (unique to this tool).
Be precise and buildable.`;

  try {
    const { text, usage } = await callClaude({ system, user, model: MODEL, maxTokens: 14000 });
    logTokens(ledger, 'developer', usage);
    const md = `# 🧑‍💻 Dev proposal — ${it.name}\n\n\`${it.slug}\` · category ${it.category} · proposed ${today} · model ${MODEL}\n\n> Manager-approved (rating ${it.managerRating}/5). **Review, then implement + deploy through the normal build.** Not auto-committed.\n\n---\n\n${text}\n`;
    await writeFile(new URL(`audits/dev-queue/${it.slug.replace(/\//g, '__')}.md`, ROOT), md);
    it.status = 'proposed-build';
    it.proposalOn = today;
    built++;
    console.log(`Developer: proposal written for ${it.name}.`);
  } catch (e) {
    console.error(`Developer failed on ${it.name}:`, e.message);
  }
}

ledger.research = research;
await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');
console.log(`Developer: ${built} proposal(s) written to audits/dev-queue/ for review.`);
if (process.env.GITHUB_OUTPUT) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_OUTPUT, `dev_built=${built}\n`);
}
