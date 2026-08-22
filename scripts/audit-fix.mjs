/**
 * BOT 2 — the Fixer. Runs daily after the Auditor, token-free.
 *
 * Reads the shared ledger (audits/ledger.json), takes up to 10 OPEN findings
 * that are deterministically fixable (fixType "auto:*"), and applies safe,
 * targeted source edits. After editing it runs a FULL BUILD as a safety gate:
 * if the build fails, the change is reverted and the finding is flagged as a
 * challenge instead. Applied fixes are marked "verifying" and handed back to
 * Bot 1, which re-audits the live tool next run to confirm (→ complete) or log
 * a challenge with reasoning.
 *
 * Findings that need human/AI judgement (fixType "manual" — content quality,
 * functionality bugs, most a11y) are NOT touched; they are compiled into
 * audits/recommendations.md with reasoning. (Open-ended fixing would need an
 * LLM, which this token-free bot deliberately avoids.)
 *
 * Output: sets `changed=true` when source was modified so the workflow commits
 * and redeploys; otherwise `changed=false`.
 */
import { readFile, writeFile, appendFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const ROOT = new URL('../', import.meta.url);
const LEDGER_PATH = new URL('audits/ledger.json', ROOT);
const today = new Date().toISOString().slice(0, 10);
const MAX_FIXES = Math.max(1, Number(process.env.FIX_COUNT || 10));

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
const dataFileFor = (slug) => { const p = PREFIX_FILE[slug.split('/')[0]]; return p ? new URL(`src/data/${p}/index.ts`, ROOT) : null; };

const ledger = JSON.parse(await readFile(LEDGER_PATH, 'utf8'));
ledger.findings ||= {};

// ── Fixer: shorten an over-length meta description to <=157 chars (word boundary) ──
function trimMetaDescription(fileText, slugTail) {
  const anchor = `slug: '${slugTail}'`;
  const idx = fileText.indexOf(anchor);
  if (idx < 0) return null;
  const nextIdx = fileText.indexOf("slug: '", idx + anchor.length);
  const end = nextIdx < 0 ? Math.min(fileText.length, idx + 4000) : nextIdx;
  const seg = fileText.slice(idx, end);
  const m = seg.match(/description:\s*\n?\s*'((?:[^'\\]|\\.)*)'/); // simple single-quoted only
  if (!m) return null;                              // complex literal -> leave for manual
  const text = m[1].replace(/\\'/g, "'").replace(/\\\\/g, '\\');
  if (text.length <= 160) return null;             // already fine
  let short = text.slice(0, 157).replace(/\s+\S*$/, '').trim().replace(/[.,;:—-]+$/, '');
  short = short + '…';
  const escShort = short.replace(/\\/g, '\\\\').replace(/'/g, "\\'");
  const newSeg = seg.replace(m[0], m[0].replace(`'${m[1]}'`, `'${escShort}'`));
  return { text: fileText.slice(0, idx) + newSeg + fileText.slice(end), note: `shortened meta description ${text.length}→${short.length} chars` };
}

const FIXERS = { 'trim-meta-description': trimMetaDescription };

// pick open, auto-fixable findings
const open = Object.values(ledger.findings)
  .filter((f) => f.status === 'open' && f.fixType.startsWith('auto:'))
  .sort((a, b) => ({ critical: 4, high: 3, medium: 2, low: 1 }[b.severity] - { critical: 4, high: 3, medium: 2, low: 1 }[a.severity]))
  .slice(0, MAX_FIXES);

const changedFiles = new Set();
const applied = [];      // findings tentatively fixed (pending build gate)
const skipped = [];
for (const f of open) {
  const fixerName = f.fixType.slice('auto:'.length);
  const fixer = FIXERS[fixerName];
  const file = dataFileFor(f.tool);
  if (!fixer || !file) { skipped.push({ f, why: 'no fixer/file mapping' }); continue; }
  try {
    const src = await readFile(file, 'utf8');
    const out = fixer(src, f.tool.split('/').slice(1).join('/'));
    if (!out) { skipped.push({ f, why: 'not safely auto-fixable (left for manual)' }); f.fixType = 'manual'; (f.history ||= []).push({ date: today, event: 'auto-fix-declined', note: 'not a simple case; reclassified manual' }); continue; }
    await writeFile(file, out.text);
    changedFiles.add(file.pathname);
    applied.push({ f, note: out.note, file: file.pathname });
  } catch (e) { skipped.push({ f, why: String(e).slice(0, 120) }); }
}

// ── safety gate: build; revert everything if it breaks ──
let buildOk = true, changed = applied.length > 0;
if (changed) {
  try {
    execSync('npm run build', { cwd: ROOT, stdio: 'ignore', timeout: 600000 });
  } catch {
    buildOk = false;
    try { execSync('git checkout -- ' + [...changedFiles].map((p) => `"${p}"`).join(' '), { cwd: ROOT, stdio: 'ignore' }); } catch {}
    changed = false;
  }
}

for (const a of applied) {
  if (buildOk) {
    a.f.status = 'verifying'; a.f.attempts = 0; a.f.fixedOn = today;
    (a.f.history ||= []).push({ date: today, event: 'auto-fixed', note: a.note });
  } else {
    a.f.status = 'challenged';
    (a.f.history ||= []).push({ date: today, event: 'auto-fix-reverted', note: 'auto-fix broke the build; reverted for human review' });
  }
}

ledger.updated = today;
await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');

// ── rolling recommendations file for humans/AI (manual findings) ──
const manual = Object.values(ledger.findings).filter((f) => f.status === 'open' && f.fixType === 'manual');
const bySeverity = { critical: [], high: [], medium: [], low: [] };
for (const f of manual) (bySeverity[f.severity] ||= []).push(f);
let recs = `# Open recommendations (need human or AI judgement)\n\n`;
recs += `_Updated ${today}. These findings can't be safely auto-fixed by the token-free Fixer bot (they need written content or code changes). ${manual.length} open._\n\n`;
for (const s of ['critical', 'high', 'medium', 'low']) {
  if (!bySeverity[s].length) continue;
  recs += `## ${s} (${bySeverity[s].length})\n\n`;
  for (const f of bySeverity[s]) recs += `- **${f.tool}** — ${f.category}: ${f.check}${f.detail ? ` — ${f.detail}` : ''}  \n  <${f.url}> · first seen ${f.firstSeen}\n`;
  recs += `\n`;
}
await writeFile(new URL('audits/recommendations.md', ROOT), recs);

// ── fixes report ──
let md = `# Fixer bot report — ${today}\n\n`;
md += `Considered ${open.length} auto-fixable finding(s); applied ${buildOk ? applied.length : 0}, skipped ${skipped.length}. Build gate: ${changed ? 'passed ✅' : applied.length && !buildOk ? 'FAILED — reverted ⛔' : 'n/a'}.\n\n`;
if (applied.length && buildOk) { md += `## Applied (now awaiting re-audit)\n\n`; for (const a of applied) md += `- **${a.f.tool}** — ${a.f.check}: ${a.note}\n`; md += `\n`; }
if (skipped.length) { md += `## Skipped / reclassified manual\n\n`; for (const s of skipped) md += `- **${s.f.tool}** — ${s.f.check}: ${s.why}\n`; md += `\n`; }
md += `Manual recommendations compiled in [recommendations.md](../recommendations.md) (${manual.length} open).\n`;
await writeFile(new URL(`audits/reports/${today}-fixes.md`, ROOT), md);

// ── DASHBOARD.md — always-current single-glance progress (no email needed) ──
const all = Object.values(ledger.findings);
const by = (s) => all.filter((f) => f.status === s);
const complete = by('complete'), openAll = by('open'), verifying = [...by('verifying'), ...by('fixed')], challengedAll = by('challenged');
const runs = ledger.runs || [];
const last = runs[runs.length - 1] || {};
const coverage = ledger.catalogueSize ? Math.round(((ledger.auditedTools || []).length / ledger.catalogueSize) * 100) : 0;
const recent = (arr, key) => arr.slice().sort((a, b) => String(b[key] || '').localeCompare(String(a[key] || ''))).slice(0, 8);
const dnorm = (s) => String(s).replace(/\|/g, '\\|');
let dash = `# 📊 LazyTools audit dashboard\n\n`;
dash += `_Auto-generated by the audit bot. Last run: **${today}**._\n\n`;
dash += `| ✅ Completed | 🟡 Open | 🔧 Awaiting verify | ⚠️ Challenged | Coverage |\n|---|---|---|---|---|\n`;
dash += `| ${complete.length} | ${openAll.length} | ${verifying.length} | ${challengedAll.length} | ${(ledger.auditedTools || []).length}/${ledger.catalogueSize || '?'} tools (${coverage}%) |\n\n`;
dash += `Latest run: **${last.avg ?? '—'}% avg** over ${last.tools ?? 0} tools · ${last.issues ?? 0} issues · ${last.opened ?? 0} new, ${last.resolved ?? 0} resolved, ${last.challenged ?? 0} challenged.\n\n`;
if (runs.length > 1) {
  dash += `### Score trend (last ${Math.min(14, runs.length)} runs)\n\n| Date | Avg | Tools | Issues | Resolved |\n|---|---|---|---|---|\n`;
  for (const r of runs.slice(-14).reverse()) dash += `| ${r.date} | ${r.avg}% | ${r.tools} | ${r.issues} | ${r.resolved || 0} |\n`;
  dash += `\n`;
}
if (challengedAll.length) {
  dash += `### ⚠️ Challenged — need attention (fix attempted, still failing)\n\n`;
  for (const f of challengedAll.slice(0, 12)) dash += `- **${f.tool}** — ${f.check}: ${dnorm(f.history?.slice(-1)[0]?.note || f.detail)}  <${f.url}>\n`;
  dash += `\n`;
}
if (verifying.length) {
  dash += `### 🔧 Fixed, awaiting next-day verification\n\n`;
  for (const f of verifying.slice(0, 12)) dash += `- **${f.tool}** — ${f.check} (fixed ${f.fixedOn || '?'})\n`;
  dash += `\n`;
}
if (complete.length) {
  dash += `### ✅ Recently completed\n\n`;
  for (const f of recent(complete, 'resolvedOn')) dash += `- **${f.tool}** — ${f.check} (done ${f.resolvedOn || '?'})\n`;
  dash += `\n`;
}
dash += `### 🟡 Top open findings\n\n`;
if (!openAll.length) dash += `_None._\n\n`;
else {
  dash += `| Severity | Tool | Finding | Fixable | Detail |\n|---|---|---|---|---|\n`;
  const rank = { critical: 4, high: 3, medium: 2, low: 1 };
  for (const f of openAll.slice().sort((a, b) => rank[b.severity] - rank[a.severity]).slice(0, 20)) {
    dash += `| ${f.severity} | ${f.tool} | ${dnorm(f.check)} | ${f.fixType.startsWith('auto:') ? '🤖' : '✍️'} | ${dnorm(f.detail)} |\n`;
  }
  dash += `\n`;
}
dash += `---\nFull detail: [today's report](reports/${today}.md) · [recommendations](recommendations.md) · [ledger](ledger.json) · [how it works](../docs/AUDIT-SYSTEM.md)\n`;
await writeFile(new URL('audits/DASHBOARD.md', ROOT), dash);
// Note: the visual command-deck dashboard.html is regenerated by the Manager
// (Bot 3), which runs after this and adds governance data (ETAs, ratings).

const summary = `Fixer: applied ${buildOk ? applied.length : 0}, skipped ${skipped.length}, ${manual.length} manual recs. Build ${changed ? 'ok' : (applied.length ? 'reverted' : 'unchanged')}.`;
console.log(summary);
if (process.env.GITHUB_OUTPUT) await appendFile(process.env.GITHUB_OUTPUT, `changed=${changed}\nfix_summary=${summary}\n`);
