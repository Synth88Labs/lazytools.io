/**
 * BOT 3 — the Manager. Runs daily AFTER the Auditor and Fixer, token-free.
 *
 * Segregation of duties (no overlap, no conflict):
 *   • Auditor  — owns the TRUTH: finds issues, opens/verifies/closes findings,
 *                records run coverage & scores. Never edits source.
 *   • Fixer    — owns EXECUTION: applies safe auto-fixes (build-gated), marks
 *                them verifying, compiles manual work. Never scores anyone.
 *   • Manager  — owns GOVERNANCE: estimates effort/ETA per recommendation,
 *                sets SLAs & due dates, reconciles timelines, assesses items
 *                the Fixer can't do (coordinating a common ground with the
 *                Auditor), and rates the Auditor & Fixer daily + weekly. The
 *                Manager never changes a finding's technical STATUS and never
 *                edits source — it only adds governance fields.
 *
 * Writes governance fields onto each finding (eta/effort/dueBy/assignedTo/sla/
 * coordination) and ledger.agents + ledger.scores, then a manager report.
 */
import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);
const LEDGER_PATH = new URL('audits/ledger.json', ROOT);
const today = new Date().toISOString().slice(0, 10);

const ledger = JSON.parse(await readFile(LEDGER_PATH, 'utf8'));
ledger.findings ||= {};
const findings = Object.values(ledger.findings);

// ── deterministic effort & SLA model ────────────────────────────────────────
const EFFORT_HOURS = { seo: 4, content: 8, a11y: 6, privacy: 12, functionality: 10, io: 8, perf: 5, mobile: 4 };
const SLA_DAYS = { critical: 1, high: 2, medium: 5, low: 10 };

const addDays = (ymd, n) => { const d = new Date(ymd + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); };
const daysBetween = (a, b) => Math.round((new Date(b + 'T00:00:00Z') - new Date(a + 'T00:00:00Z')) / 86400000);

function effortHours(f) {
  if (String(f.fixType || '').startsWith('auto:')) return 2;
  return EFFORT_HOURS[f.category] || 6;
}
function etaText(hours) {
  if (hours <= 2) return 'next run (~1 day)';
  if (hours <= 6) return `~${hours}h (1 day)`;
  const d = Math.ceil(hours / 8);
  return `~${hours}h (${d} day${d > 1 ? 's' : ''})`;
}

// ── govern each open/verifying/challenged finding ────────────────────────────
let overdue = 0, onTrack = 0, challengedToAssess = 0;
for (const f of findings) {
  if (!['open', 'verifying', 'fixed', 'challenged'].includes(f.status)) {
    // resolved items keep whatever they had; clear active governance
    continue;
  }
  const eff = effortHours(f);
  const sla = SLA_DAYS[f.severity] || 6;
  const due = addDays(f.firstSeen || today, sla);
  const isOverdue = daysBetween(due, today) > 0;
  f.effortHours = eff;
  f.eta = etaText(eff);
  f.dueBy = due;
  f.sla = isOverdue ? 'overdue' : 'on-track';
  f.assignedTo = String(f.fixType || '').startsWith('auto:') ? 'fixer'
    : f.status === 'challenged' ? 'manager' : 'fixer';

  if (isOverdue) overdue++; else onTrack++;

  // Coordination: the Fixer couldn't do it -> Manager assesses & sets a path,
  // reconciling Auditor (what's required) with Fixer (what's feasible).
  if (f.status === 'challenged') {
    challengedToAssess++;
    f.coordination = 'Manager: fix attempted and failed — routing to owner/AI for a hand fix; Auditor to re-verify next sweep.';
  } else if (/unexpected external requests/i.test(f.check)) {
    f.assignedTo = 'owner';
    f.coordination = 'SYSTEMIC — OWNER DECISION: third-party ad script (grow.me / Unified-ID) is your ad revenue (Mediavine Grow). One removal clears all of these, but it cuts income — a bot must not auto-decide. Keep for ads, or say the word to remove for full privacy.';
  } else if (/axe violations|contrast/i.test(f.check)) {
    f.assignedTo = 'owner';
    f.coordination = 'SYSTEMIC — DESIGN: global colour-contrast; one design-token change fixes many pages. Needs a quick design decision.';
  } else if (/open graph/i.test(f.check)) {
    f.assignedTo = 'developer';
    f.coordination = 'SYSTEMIC — TEMPLATE: missing og:image; one site-wide OG-image generator fixes all. Queued as a build task, not a per-tool edit.';
  } else if (f.fixType === 'manual' && isOverdue) {
    f.coordination = 'Manager: past SLA — escalated to owner/AI; deterministic Fixer cannot action prose/logic safely.';
  } else {
    delete f.coordination;
  }
}

// ── daily activity (for scoring) ─────────────────────────────────────────────
const runs = ledger.runs || [];
const lastRun = runs[runs.length - 1] || {};
const runIsToday = lastRun.date === today;
const appliedToday = findings.filter((f) => f.fixedOn === today).length;
const completedToday = findings.filter((f) => f.resolvedOn === today).length;
const challengedToday = findings.filter((f) => (f.history || []).some((h) => h.date === today && h.event === 'challenged')).length;

const active = findings.filter((f) => ['open', 'verifying', 'fixed', 'challenged'].includes(f.status));
const slaPct = active.length ? Math.round((active.filter((f) => f.sla === 'on-track').length / active.length) * 100) : 100;
const openCount = findings.filter((f) => f.status === 'open').length;
const verifyingCount = findings.filter((f) => ['verifying', 'fixed'].includes(f.status)).length;
const completeCount = findings.filter((f) => f.status === 'complete').length;
const challengedCount = findings.filter((f) => f.status === 'challenged').length;

const clamp = (x) => Math.max(1, Math.min(5, x));
const round1 = (x) => Math.round(x * 10) / 10;

// Auditor rubric (out of 5): coverage momentum, diligence, verification.
function scoreAuditor() {
  let s = 3.0;
  const tools = runIsToday ? (lastRun.tools || 0) : 0;
  s += tools >= 10 ? 0.8 : tools * 0.08;
  const activity = (runIsToday ? (lastRun.opened || 0) + (lastRun.resolved || 0) : 0);
  s += activity >= 5 ? 0.6 : activity * 0.12;
  if (runIsToday && (lastRun.resolved || 0) > 0) s += 0.6;
  return round1(clamp(s));
}
// Fixer rubric (out of 5): throughput, completions, SLA adherence, overdue penalty.
function scoreFixer() {
  let s = 3.0;
  s += appliedToday > 0 ? 0.6 : 0.2;              // acted when there was auto-work (fair when none)
  if (completedToday > 0) s += 0.7;
  s += (slaPct / 100) * 0.8;                       // 0..0.8 for keeping the backlog on-track
  s -= Math.min(0.8, overdue * 0.1);               // penalty for overdue items
  if (challengedToday > 0) s -= 0.3;               // a build-gate revert today
  return round1(clamp(s));
}
const auditorDaily = scoreAuditor();
const fixerDaily = scoreFixer();

// ── persist daily + rolling weekly scores ────────────────────────────────────
function isoWeek(ymd) {
  const d = new Date(ymd + 'T00:00:00Z');
  const day = (d.getUTCDay() + 6) % 7;
  d.setUTCDate(d.getUTCDate() - day + 3);
  const firstThu = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const week = 1 + Math.round((d - firstThu) / 86400000 / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, '0')}`;
}
ledger.scores ||= { daily: [], weekly: [] };
ledger.scores.daily = (ledger.scores.daily || []).filter((r) => r.date !== today);
ledger.scores.daily.push({ date: today, auditor: auditorDaily, fixer: fixerDaily });
ledger.scores.daily = ledger.scores.daily.slice(-120);

const wk = isoWeek(today);
const wkDaily = ledger.scores.daily.filter((r) => isoWeek(r.date) === wk);
const wkAvg = (k) => round1(wkDaily.reduce((a, r) => a + r[k], 0) / (wkDaily.length || 1));
ledger.scores.weekly = (ledger.scores.weekly || []).filter((r) => r.week !== wk);
ledger.scores.weekly.push({ week: wk, auditor: wkAvg('auditor'), fixer: wkAvg('fixer'), days: wkDaily.length });
ledger.scores.weekly = ledger.scores.weekly.slice(-26);

// ── review & rate the Researcher's recommendations (Manager's weekly job) ─────
const research = ledger.research || { items: [] };
const rateRec = (it) => {
  if (it.privacyFit === false) return 1;
  let r = Number(it.impact) || 3;
  r += ({ high: 0.6, medium: 0, low: -0.6 })[it.searchDemand] || 0;
  r += ({ low: 0.5, medium: 0, high: -0.5 })[it.competition] || 0;
  r += ({ S: 0.3, M: 0, L: -0.3 })[it.effort] || 0;
  return Math.max(1, Math.min(5, round1(r)));
};
let researchAvg = 0;
if (research.items && research.items.length) {
  for (const it of research.items) {
    it.managerRating = rateRec(it);
    if (!['built', 'proposed-build'].includes(it.status)) it.status = it.managerRating >= 4 ? 'approved' : 'backlog';
  }
  researchAvg = round1(research.items.reduce((a, it) => a + it.managerRating, 0) / research.items.length);
  ledger.research = research;
}
const approvedTools = (research.items || []).filter((it) => it.status === 'approved');
const builtTools = (research.items || []).filter((it) => it.status === 'built');

// ── token governance (Manager monitors spend) ────────────────────────────────
const tokToday = (ledger.tokens?.daily || []).find((d) => d.date === today) || { input: 0, output: 0, calls: 0 };
const tokUsed = tokToday.input + tokToday.output;
const tokCap = Number(process.env.TOKEN_DAILY_CAP || 400000);
const tokCostUsd = Math.round(((tokToday.input / 1e6) * 3 + (tokToday.output / 1e6) * 15) * 100) / 100;
const tokPct = Math.min(100, Math.round((tokUsed / tokCap) * 100));

// ── current tasks for the dashboard ──────────────────────────────────────────
const autoQueue = findings.filter((f) => f.status === 'open' && String(f.fixType || '').startsWith('auto:')).length;
const manualQueue = findings.filter((f) => f.status === 'open' && f.fixType === 'manual').length;
const ownerFlagged = findings.filter((f) => f.status === 'open' && (f.assignedTo === 'owner' || f.assignedTo === 'developer')).length;
const fixerWorkable = findings.filter((f) => f.status === 'open' && /title present/i.test(f.check)).length; // the class the Fixer can auto-apply now
const nextAudit = ((ledger.auditedTools || []).length % (ledger.catalogueSize || 1));

ledger.agents = {
  manager: {
    role: 'Governance — SLAs, ratings, token budget',
    status: tokUsed >= tokCap ? 'throttling' : overdue > 0 || challengedToAssess > 0 ? 'reconciling' : 'nominal',
    task: tokUsed >= tokCap
      ? `Token budget reached (${tokUsed}/${tokCap}) — throttling LLM agents until reset.`
      : research.items && research.items.length
        ? `Reviewed ${research.items.length} research idea(s) (avg ${researchAvg}/5); approved ${approvedTools.length}. Tokens ${tokUsed}/${tokCap}.`
        : challengedToAssess > 0
          ? `Assessing ${challengedToAssess} challenged item(s); reconciling ${overdue} overdue. Tokens ${tokUsed}/${tokCap}.`
          : `All within SLA. Monitoring. Tokens ${tokUsed}/${tokCap}.`,
    kpis: { overdue, onTrack, slaPct, tokensToday: tokUsed, tokenCap: tokCap, costUsd: tokCostUsd },
  },
  auditor: {
    role: 'Truth — detect, verify, close findings',
    status: verifyingCount > 0 ? 'verifying' : 'sweeping',
    task: verifyingCount > 0
      ? `Re-verifying ${verifyingCount} fixed tool(s); next 10-tool sweep from index ${nextAudit}.`
      : `Sweeping the next 10 tools from index ${nextAudit} of ${ledger.catalogueSize || '?'}.`,
    kpis: { auditedTotal: (ledger.auditedTools || []).length, catalogue: ledger.catalogueSize || 0, lastAvg: runIsToday ? (lastRun.avg || 0) : (lastRun.avg || 0) },
    score: { daily: auditorDaily, weekly: wkAvg('auditor') },
  },
  fixer: {
    role: 'Senior dev — auto + LLM fixes, build-gated, 24/7',
    status: fixerWorkable > 0 ? 'fixing' : verifyingCount > 0 ? 'verifying' : 'standby',
    task: fixerWorkable > 0
      ? `Auto-fixing ${fixerWorkable} title item(s), build-gated. ${verifyingCount} awaiting re-verify. ${ownerFlagged} systemic → flagged to owner/dev.`
      : verifyingCount > 0
        ? `${verifyingCount} fix(es) awaiting the Auditor's re-verify. ${ownerFlagged} systemic items are owner/dev decisions, not mine.`
        : ownerFlagged > 0
          ? `Nothing I can safely auto-fix — the ${ownerFlagged} remaining are systemic (owner/dev decisions).`
          : `Backlog clear; standing by.`,
    kpis: { open: openCount, fixable: fixerWorkable, systemic: ownerFlagged, verifying: verifyingCount, completed: completeCount },
    score: { daily: fixerDaily, weekly: wkAvg('fixer') },
  },
  researcher: {
    role: 'Discovery — weekly research for new tools',
    status: (research.items || []).length ? 'reported' : 'standby',
    task: (research.items || []).length
      ? `${research.items.length} idea(s) proposed ${research.generatedOn || ''}; Manager approved ${approvedTools.length}.`
      : 'Next weekly research pending.',
    kpis: { proposed: (research.items || []).length, approved: approvedTools.length, avgRating: researchAvg },
    score: { daily: researchAvg, weekly: researchAvg }, // Manager rates the researcher = quality of its ideas
  },
  developer: {
    role: 'Full-stack — weekly, builds approved tools',
    status: approvedTools.length ? 'queued' : 'standby',
    task: approvedTools.length
      ? `${approvedTools.length} approved tool(s) queued: ${approvedTools.slice(0, 3).map((a) => a.name).join(', ')}${approvedTools.length > 3 ? '…' : ''}.`
      : 'No approved tools in the build queue.',
    kpis: { queued: approvedTools.length, built: builtTools.length },
    score: { daily: builtTools.length ? 5 : approvedTools.length ? 3 : 0, weekly: builtTools.length ? 5 : approvedTools.length ? 3 : 0 },
  },
};
ledger.updated = today;
await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');

// ── manager report ───────────────────────────────────────────────────────────
const stars = (v) => '★'.repeat(Math.round(v)) + '☆'.repeat(5 - Math.round(v));
let md = `# 🧭 Manager report — ${today}\n\n`;
md += `**Team performance (out of 5)** — daily · weekly (${wk})\n\n`;
md += `| Agent | Daily | Weekly | Focus |\n|---|---|---|---|\n`;
md += `| Auditor | ${stars(auditorDaily)} ${auditorDaily} | ${stars(wkAvg('auditor'))} ${wkAvg('auditor')} | coverage, verification |\n`;
md += `| Fixer | ${stars(fixerDaily)} ${fixerDaily} | ${stars(wkAvg('fixer'))} ${wkAvg('fixer')} | throughput, SLA adherence |\n\n`;
md += `**SLA reconciliation:** ${onTrack} on-track · ${overdue} overdue · ${slaPct}% within SLA · ${challengedToAssess} challenged awaiting assessment.\n\n`;
const overdueList = active.filter((f) => f.sla === 'overdue').sort((a, b) => (SLA_DAYS[a.severity] || 6) - (SLA_DAYS[b.severity] || 6)).slice(0, 15);
if (overdueList.length) {
  md += `### ⏰ Overdue — need timeline reconciliation\n\n| Tool | Finding | Sev | Due | Owner |\n|---|---|---|---|---|\n`;
  for (const f of overdueList) md += `| ${f.tool} | ${f.check} | ${f.severity} | ${f.dueBy} | ${f.assignedTo} |\n`;
  md += `\n`;
}
const coord = active.filter((f) => f.coordination).slice(0, 15);
if (coord.length) {
  md += `### 🤝 Coordination log (Manager ⇄ Auditor ⇄ Fixer)\n\n`;
  for (const f of coord) md += `- **${f.tool}** — ${f.check}: ${f.coordination}\n`;
  md += `\n`;
}
if (research.items && research.items.length) {
  md += `### 🔬 Researcher review — rated ${research.items.length} idea(s), avg ${stars(researchAvg)} ${researchAvg}/5\n\n`;
  md += `| Rating | Tool | Category | Decision |\n|---|---|---|---|\n`;
  for (const it of research.items.slice().sort((a, b) => (b.managerRating || 0) - (a.managerRating || 0)))
    md += `| ${it.managerRating}/5 | **${it.name}** \`${it.slug}\` | ${it.category} | ${it.status === 'built' ? '✅ built' : it.status === 'approved' ? '👍 approved → dev queue' : '📋 backlog'} |\n`;
  md += `\n`;
}
md += `### 🔢 Token governance\n\nToday: **${tokUsed.toLocaleString()}** / ${tokCap.toLocaleString()} tokens (${tokPct}%) · ~$${tokCostUsd} · ${tokToday.calls || 0} call(s)${tokUsed >= tokCap ? ' · **budget reached — LLM agents throttled**' : ''}.\n\n`;
md += `---\n_Segregation of duties: Auditor finds & verifies · Fixer executes fixes (auto + LLM) · Researcher proposes tools · Developer builds approved tools · Manager estimates, reconciles, rates & guards the token budget. See docs/AUDIT-SYSTEM.md._\n`;
await writeFile(new URL(`audits/reports/${today}-manager.md`, ROOT), md);

// ── regenerate the visual command-deck dashboard with governance data ────────
try {
  const { execSync } = await import('node:child_process');
  execSync('node scripts/gen-dashboard.mjs', { cwd: new URL('../', import.meta.url), stdio: 'inherit' });
} catch (e) { console.error('dashboard.html generation failed (non-fatal):', e.message); }

const summary = `Manager: Auditor ${auditorDaily}/5, Fixer ${fixerDaily}/5 · ${onTrack} on-track, ${overdue} overdue, ${challengedToAssess} to assess.`;
console.log(summary);
if (process.env.GITHUB_OUTPUT) {
  const { appendFile } = await import('node:fs/promises');
  await appendFile(process.env.GITHUB_OUTPUT, `manager_summary=${summary}\n`);
}
