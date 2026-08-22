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
    f.coordination = f.category === 'privacy'
      ? 'Manager: needs an owner decision (remove third-party script). Auditor to re-verify once the tag is gone.'
      : 'Manager: beyond safe auto-fix — routing to owner/AI for a hand fix; Auditor to re-verify next sweep.';
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

// ── current tasks for the dashboard ──────────────────────────────────────────
const autoQueue = findings.filter((f) => f.status === 'open' && String(f.fixType || '').startsWith('auto:')).length;
const nextAudit = ((ledger.auditedTools || []).length % (ledger.catalogueSize || 1));
const rating = (v) => ({ value: v, stars: v });

ledger.agents = {
  manager: {
    role: 'Governance — SLAs, timelines, assessment, ratings',
    status: overdue > 0 || challengedToAssess > 0 ? 'reconciling' : 'nominal',
    task: challengedToAssess > 0
      ? `Assessing ${challengedToAssess} challenged item(s) with Auditor + Fixer; reconciling ${overdue} overdue.`
      : overdue > 0 ? `Reconciling ${overdue} overdue recommendation(s) against SLA.`
        : 'All recommendations within SLA. Monitoring.',
    kpis: { overdue, onTrack, slaPct, challengedToAssess },
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
    role: 'Execution — safe auto-fixes, compile the rest',
    status: autoQueue > 0 ? 'fixing' : challengedCount > 0 ? 'blocked' : 'standby',
    task: autoQueue > 0
      ? `Applying ${autoQueue} auto-fix(es) next run (build-gated).`
      : `No auto-fixable work; ${openCount} manual item(s) compiled for owner/AI.`,
    kpis: { open: openCount, verifying: verifyingCount, completed: completeCount, slaPct, appliedToday, completedToday },
    score: { daily: fixerDaily, weekly: wkAvg('fixer') },
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
md += `---\n_Segregation of duties: Auditor finds & verifies · Fixer executes safe fixes · Manager estimates, reconciles & rates. See docs/AUDIT-SYSTEM.md._\n`;
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
