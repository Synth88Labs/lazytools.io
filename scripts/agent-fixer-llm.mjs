/**
 * SENIOR FIXER (LLM) — the Fixer's brain for MANUAL findings.
 *
 * The deterministic Fixer (audit-fix.mjs) handles safe auto-fixes. This module
 * is the senior full-stack developer that tackles the MANUAL findings the
 * deterministic pass can't touch — thin content, missing FAQs, meta/title
 * quality, accessible-text issues. It drafts a concrete, best-practice fix for
 * each and writes it to audits/fix-queue/ for owner review, then the change
 * goes in through the normal build. It deliberately SKIPS categories that need
 * a human decision (privacy/third-party scripts) or risky logic changes
 * (functionality), so an unattended LLM never rewrites app logic on a live site.
 *
 * Runs frequently ("24/7" via cron), token-budgeted by the Manager.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { callClaude, logTokens, budgetStatus, haveKey } from './lib/anthropic.mjs';

const ROOT = new URL('../', import.meta.url);
const LEDGER_PATH = new URL('audits/ledger.json', ROOT);
const today = new Date().toISOString().slice(0, 10);
const MODEL = process.env.FIXER_MODEL || 'claude-sonnet-5';
const PER_RUN = Number(process.env.FIXER_PER_RUN || 4);
const SAFE = new Set((process.env.FIXER_SAFE || 'content,seo,a11y').split(','));

const ledger = JSON.parse(await readFile(LEDGER_PATH, 'utf8'));
if (!haveKey()) { console.log('Fixer(LLM): ANTHROPIC_API_KEY not set — skipping.'); process.exit(0); }

const findings = Object.values(ledger.findings || {});
const queue = findings
  .filter((f) => f.status === 'open' && f.fixType === 'manual' && SAFE.has(f.category) && !f.fixProposal)
  .sort((a, b) => ({ critical: 4, high: 3, medium: 2, low: 1 }[b.severity] || 0) - ({ critical: 4, high: 3, medium: 2, low: 1 }[a.severity] || 0))
  .slice(0, PER_RUN);
if (!queue.length) { console.log('Fixer(LLM): no safe manual findings to draft.'); process.exit(0); }

const system = `You are a senior full-stack developer fixing pages on LazyTools.io (Astro 5 + Preact + TypeScript, privacy-first, 100% client-side).
For the given finding, produce a precise, best-practice fix a developer can apply directly:
- For content/thin-content: write the actual new editorial (lead paragraph, how-it-works, note, and FAQs) — specific to the tool, no boilerplate, to clear Google's helpful-content / AdSense bar.
- For SEO meta/title: give the exact improved <title> (≤60 chars) and meta description (70–160 chars).
- For accessibility: give the exact markup/ARIA/label change.
Keep it minimal, correct, and copy-pasteable. Do not touch app logic or third-party scripts.`;

await mkdir(new URL('audits/fix-queue/', ROOT), { recursive: true });
let drafted = 0;
for (const f of queue) {
  const budget = budgetStatus(ledger);
  if (!budget.ok) { console.log(`Fixer(LLM): token budget reached (${budget.used}/${budget.cap}) — stopping.`); break; }
  const user = `Tool: ${f.tool}\nURL: ${f.url}\nFinding (${f.category}, ${f.severity}): ${f.check}\nDetail: ${f.detail || '—'}\n\nDraft the exact fix.`;
  try {
    const { text, usage } = await callClaude({ system, user, model: MODEL, maxTokens: 6000 });
    logTokens(ledger, 'fixer', usage);
    const md = `# 🛠️ Fix proposal — ${f.tool}\n\n**${f.check}** (${f.category}/${f.severity}) · ${f.url} · drafted ${today} · model ${MODEL}\n\n> Senior-Fixer draft. **Review, then apply + deploy through the normal build.** Not auto-committed.\n\n---\n\n${text}\n`;
    await writeFile(new URL(`audits/fix-queue/${f.tool.replace(/\//g, '__')}__${f.check.replace(/[^a-z0-9]+/gi, '-').slice(0, 40)}.md`, ROOT), md);
    f.fixProposal = today;
    drafted++;
    console.log(`Fixer(LLM): drafted fix for ${f.tool} — ${f.check}`);
  } catch (e) {
    console.error(`Fixer(LLM) failed on ${f.tool}:`, e.message);
  }
}

await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');
console.log(`Fixer(LLM): ${drafted} fix proposal(s) written to audits/fix-queue/ for review.`);
if (process.env.GITHUB_OUTPUT) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_OUTPUT, `fixes_drafted=${drafted}\n`);
}
