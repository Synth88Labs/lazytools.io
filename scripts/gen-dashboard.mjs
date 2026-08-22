/**
 * Bot dashboard generator — writes a single self-contained audits/dashboard.html
 * that visualises everything the two autonomous bots are doing, plus the build
 * pipeline toward the tool target. Regenerated on every bot run (called at the
 * end of the Fixer) and committed to git, so the raw.githack link is always
 * current. 100% self-contained: inline CSS + server-rendered inline SVG charts,
 * no external requests, no JS dependency (works with scripts disabled).
 *
 * Run standalone:  node scripts/gen-dashboard.mjs
 */
import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);
const BUILD_TARGET = Number(process.env.BUILD_TARGET || 1500); // tools goal (memory: lazytools-build-backlog)

const esc = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ledger = JSON.parse(await readFile(new URL('audits/ledger.json', ROOT), 'utf8'));
ledger.findings ||= {};
let slugs = [];
try { slugs = JSON.parse(await readFile(new URL('api/tools-allowlist.json', ROOT), 'utf8')); } catch {}

// ── aggregate ──────────────────────────────────────────────────────────────
const all = Object.values(ledger.findings);
const by = (s) => all.filter((f) => f.status === s);
const complete = by('complete');
const openAll = by('open');
const verifying = [...by('verifying'), ...by('fixed')];
const challenged = by('challenged');
const runs = ledger.runs || [];
const last = runs[runs.length - 1] || {};

const toolCount = slugs.length || ledger.catalogueSize || 0;
const audited = (ledger.auditedTools || []).length;
const catalogue = ledger.catalogueSize || toolCount || 1;
const auditPct = Math.round((audited / catalogue) * 100);
const buildPct = Math.min(100, Math.round((toolCount / BUILD_TARGET) * 100));
const remaining = Math.max(0, BUILD_TARGET - toolCount);

// per-category tool counts (build pipeline)
const catCount = {};
for (const s of slugs) { const c = s.split('/')[0]; catCount[c] = (catCount[c] || 0) + 1; }
const topCats = Object.entries(catCount).sort((a, b) => b[1] - a[1]).slice(0, 12);

// open findings by severity + audit category
const sevRank = { critical: 4, high: 3, medium: 2, low: 1 };
const sevCount = { high: 0, medium: 0, low: 0 };
for (const f of openAll) { const k = f.severity === 'critical' ? 'high' : (f.severity || 'low'); sevCount[k] = (sevCount[k] || 0) + 1; }
const catFindings = {};
for (const f of openAll) catFindings[f.category || 'other'] = (catFindings[f.category || 'other'] || 0) + 1;
const catFindingRows = Object.entries(catFindings).sort((a, b) => b[1] - a[1]);

const resolvedTotal = complete.length;
const recent = (arr, key) => arr.slice().sort((a, b) => String(b[key] || '').localeCompare(String(a[key] || ''))).slice(0, 6);

// ── SVG helpers ──────────────────────────────────────────────────────────────
const COL = {
  accent: '#6366f1', accent2: '#8b5cf6', green: '#22c55e', amber: '#f59e0b',
  red: '#ef4444', blue: '#3b82f6', slate: '#64748b', teal: '#14b8a6',
};
const CATPAL = ['#6366f1', '#8b5cf6', '#0ea5e9', '#14b8a6', '#22c55e', '#eab308', '#f59e0b', '#ef4444', '#ec4899', '#64748b', '#3b82f6', '#a855f7'];

// donut chart from [{label,value,color}]
function donut(segs, { size = 150, thickness = 22, center } = {}) {
  const total = segs.reduce((a, s) => a + s.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const cx = size / 2;
  let off = 0;
  const rings = segs
    .filter((s) => s.value > 0)
    .map((s) => {
      const len = (s.value / total) * c;
      const el = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${thickness}" stroke-dasharray="${len.toFixed(2)} ${(c - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${cx} ${cx})"><title>${esc(s.label)}: ${s.value}</title></circle>`;
      off += len;
      return el;
    })
    .join('');
  const mid = center ?? String(total);
  return `<svg viewBox="0 0 ${size} ${size}" class="donut" role="img" aria-label="${esc(segs.map((s) => `${s.label} ${s.value}`).join(', '))}">
    <circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="var(--track)" stroke-width="${thickness}"/>
    ${rings}
    <text x="${cx}" y="${cx - 2}" text-anchor="middle" class="donut-num">${esc(mid)}</text>
    <text x="${cx}" y="${cx + 16}" text-anchor="middle" class="donut-cap">open</text>
  </svg>`;
}

// horizontal bar list from [{label,value,color?}]
function hbars(rows, { max, unit = '' } = {}) {
  const m = max ?? Math.max(1, ...rows.map((r) => r.value));
  return `<div class="hbars">${rows
    .map((r, i) => {
      const w = Math.max(2, Math.round((r.value / m) * 100));
      const col = r.color || CATPAL[i % CATPAL.length];
      return `<div class="hbar"><span class="hbar-l">${esc(r.label)}</span><span class="hbar-track"><span class="hbar-fill" style="width:${w}%;background:${col}"></span></span><span class="hbar-v">${esc(r.value)}${unit}</span></div>`;
    })
    .join('')}</div>`;
}

// area+line trend from runs (avg 0-100)
function trend(rs) {
  if (!rs.length) return `<p class="muted">No runs recorded yet — the first daily run will populate this trend.</p>`;
  const W = 720, H = 200, P = 34;
  const pts = rs.map((r, i) => {
    const x = rs.length === 1 ? W / 2 : P + (i * (W - 2 * P)) / (rs.length - 1);
    const y = H - P - ((r.avg || 0) / 100) * (H - 2 * P);
    return { x, y, r };
  });
  const line = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L${pts[pts.length - 1].x.toFixed(1)} ${H - P} L${pts[0].x.toFixed(1)} ${H - P} Z`;
  const grid = [0, 25, 50, 75, 100]
    .map((g) => { const y = H - P - (g / 100) * (H - 2 * P); return `<line x1="${P}" y1="${y}" x2="${W - P}" y2="${y}" class="grid"/><text x="${P - 6}" y="${y + 3}" text-anchor="end" class="axis">${g}</text>`; })
    .join('');
  const dots = pts
    .map((p) => `<circle cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4" fill="${COL.accent}"><title>${esc(p.r.date)}: ${p.r.avg}% (${p.r.tools} tools, ${p.r.issues} issues)</title></circle>`)
    .join('');
  const labels = pts
    .filter((_, i) => rs.length <= 8 || i % Math.ceil(rs.length / 8) === 0 || i === pts.length - 1)
    .map((p) => `<text x="${p.x.toFixed(1)}" y="${H - P + 16}" text-anchor="middle" class="axis">${esc(p.r.date.slice(5))}</text>`)
    .join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="trend" role="img" aria-label="Average audit score over time">
    <defs><linearGradient id="tg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${COL.accent}" stop-opacity="0.28"/><stop offset="1" stop-color="${COL.accent}" stop-opacity="0"/></linearGradient></defs>
    ${grid}
    ${pts.length > 1 ? `<path d="${area}" fill="url(#tg)"/>` : ''}
    ${pts.length > 1 ? `<path d="${line}" fill="none" stroke="${COL.accent}" stroke-width="2.5" stroke-linejoin="round"/>` : ''}
    ${dots}${labels}
  </svg>`;
}

// progress bar
const bar = (pct, color) => `<span class="pbar"><span class="pbar-fill" style="width:${Math.min(100, pct)}%;background:${color}"></span></span>`;

const sevColor = (s) => (s === 'high' || s === 'critical' ? COL.red : s === 'medium' ? COL.amber : COL.slate);
const fixIcon = (f) => (String(f.fixType || '').startsWith('auto:') ? '🤖 auto' : '✍️ manual');

// ── lists ────────────────────────────────────────────────────────────────────
const challengedHTML = challenged.length
  ? challenged.slice(0, 10).map((f) => `<li><a href="${esc(f.url)}" target="_blank" rel="noopener"><b>${esc(f.tool)}</b></a> — ${esc(f.check)}<span class="reason">${esc(f.history?.slice(-1)[0]?.note || f.detail)}</span></li>`).join('')
  : `<li class="muted">Nothing challenged — every attempted fix has verified. 🎉</li>`;
const verifyHTML = verifying.length
  ? verifying.slice(0, 10).map((f) => `<li><b>${esc(f.tool)}</b> — ${esc(f.check)} <span class="tag">fixed ${esc(f.fixedOn || '?')}</span></li>`).join('')
  : `<li class="muted">Queue empty.</li>`;
const doneHTML = complete.length
  ? recent(complete, 'resolvedOn').map((f) => `<li><b>${esc(f.tool)}</b> — ${esc(f.check)} <span class="tag done">done ${esc(f.resolvedOn || '?')}</span></li>`).join('')
  : `<li class="muted">None yet.</li>`;

const topOpen = openAll.slice().sort((a, b) => (sevRank[b.severity] || 0) - (sevRank[a.severity] || 0)).slice(0, 18);
const topOpenHTML = topOpen.length
  ? topOpen.map((f) => `<tr>
      <td><span class="sev" style="background:${sevColor(f.severity)}">${esc(f.severity)}</span></td>
      <td><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.tool)}</a></td>
      <td>${esc(f.check)}</td>
      <td class="nowrap">${fixIcon(f)}</td>
      <td class="detail">${esc(f.detail)}</td></tr>`).join('')
  : `<tr><td colspan="5" class="muted">No open findings. 🎉</td></tr>`;

// ── page ─────────────────────────────────────────────────────────────────────
const kpi = (num, label, sub) => `<div class="kpi"><div class="kpi-n">${num}</div><div class="kpi-l">${label}</div>${sub ? `<div class="kpi-s">${sub}</div>` : ''}</div>`;

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/>
<title>🤖 LazyTools Bot Control Room</title>
<style>
  :root{
    --bg:#f6f7fb; --panel:#ffffff; --ink:#0f172a; --muted:#64748b; --line:#e2e8f0;
    --track:#eef1f6; --accent:#6366f1; --shadow:0 1px 3px rgba(15,23,42,.06),0 1px 2px rgba(15,23,42,.04);
  }
  @media (prefers-color-scheme: dark){
    :root{ --bg:#0b1120; --panel:#111a2e; --ink:#e8edf6; --muted:#94a3b8; --line:#1f2b45;
      --track:#1a2438; --shadow:0 1px 3px rgba(0,0,0,.4); }
  }
  *{box-sizing:border-box}
  body{margin:0;background:var(--bg);color:var(--ink);font:15px/1.55 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased}
  .wrap{max-width:1080px;margin:0 auto;padding:28px 20px 64px}
  header.top{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px 14px;margin-bottom:6px}
  header.top h1{font-size:26px;margin:0;letter-spacing:-.5px}
  .stamp{color:var(--muted);font-size:13px}
  .lead{color:var(--muted);margin:2px 0 22px;max-width:70ch}
  .grid{display:grid;gap:16px}
  .kpis{grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-bottom:18px}
  .kpi{background:var(--panel);border:1px solid var(--line);border-radius:14px;padding:16px 18px;box-shadow:var(--shadow)}
  .kpi-n{font-size:30px;font-weight:700;letter-spacing:-1px;font-variant-numeric:tabular-nums}
  .kpi-l{font-size:12px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted);margin-top:2px}
  .kpi-s{font-size:12.5px;color:var(--muted);margin-top:6px}
  .cols{grid-template-columns:1fr 1fr}
  .cols3{grid-template-columns:1.2fr 1fr 1fr}
  @media (max-width:760px){.cols,.cols3{grid-template-columns:1fr}}
  .panel{background:var(--panel);border:1px solid var(--line);border-radius:16px;padding:18px 20px;box-shadow:var(--shadow)}
  .panel h2{font-size:15px;margin:0 0 14px;letter-spacing:.2px}
  .panel h2 .em{color:var(--muted);font-weight:500;font-size:13px}
  .pbar{display:block;height:10px;border-radius:6px;background:var(--track);overflow:hidden;margin:6px 0}
  .pbar-fill{display:block;height:100%;border-radius:6px}
  .prow{display:flex;justify-content:space-between;align-items:baseline;font-size:13.5px;margin-top:12px}
  .prow b{font-size:15px;font-variant-numeric:tabular-nums}
  .goalnum{font-size:22px;font-weight:700;font-variant-numeric:tabular-nums}
  .donut-wrap{display:flex;gap:16px;align-items:center}
  .donut{width:150px;height:150px;flex:none}
  .donut-num{font-size:30px;font-weight:700;fill:var(--ink)}
  .donut-cap{font-size:11px;fill:var(--muted);text-transform:uppercase;letter-spacing:.5px}
  .legend{display:flex;flex-direction:column;gap:7px;font-size:13.5px}
  .legend i{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:8px;vertical-align:middle}
  .legend b{font-variant-numeric:tabular-nums}
  .hbars{display:flex;flex-direction:column;gap:9px}
  .hbar{display:grid;grid-template-columns:120px 1fr 44px;align-items:center;gap:10px;font-size:13px}
  .hbar-l{color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .hbar-track{background:var(--track);border-radius:6px;height:9px;overflow:hidden}
  .hbar-fill{display:block;height:100%;border-radius:6px}
  .hbar-v{text-align:right;font-variant-numeric:tabular-nums;color:var(--muted)}
  .trend{width:100%;height:auto}
  .grid line.grid, .grid{stroke:var(--line)}
  line.grid{stroke:var(--line);stroke-width:1}
  text.axis{fill:var(--muted);font-size:11px}
  ul.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:8px;font-size:13.5px}
  ul.list li{padding-bottom:8px;border-bottom:1px solid var(--line)}
  ul.list li:last-child{border:0;padding-bottom:0}
  ul.list a{color:var(--accent);text-decoration:none}
  ul.list a:hover{text-decoration:underline}
  .reason{display:block;color:var(--muted);font-size:12.5px;margin-top:2px}
  .tag{font-size:11px;color:var(--muted);background:var(--track);padding:1px 7px;border-radius:20px;margin-left:4px}
  .tag.done{color:#0a7a3f}
  @media (prefers-color-scheme: dark){.tag.done{color:#4ade80}}
  table{width:100%;border-collapse:collapse;font-size:13px}
  th,td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
  th{font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:var(--muted)}
  td a{color:var(--accent);text-decoration:none}
  td a:hover{text-decoration:underline}
  td.detail{color:var(--muted)}
  td.nowrap{white-space:nowrap}
  .sev{color:#fff;font-size:11px;padding:2px 8px;border-radius:20px;text-transform:capitalize;white-space:nowrap}
  .funnel{display:flex;flex-wrap:wrap;gap:8px}
  .fstep{flex:1;min-width:120px;background:var(--track);border-radius:12px;padding:12px 14px}
  .fstep .n{font-size:24px;font-weight:700;font-variant-numeric:tabular-nums}
  .fstep .l{font-size:12px;color:var(--muted)}
  .muted{color:var(--muted)}
  footer{margin-top:26px;color:var(--muted);font-size:12.5px;text-align:center;line-height:1.9}
  footer a{color:var(--accent);text-decoration:none}
  section{margin-bottom:16px}
</style>
</head>
<body>
<div class="wrap">
  <header class="top">
    <h1>🤖 LazyTools Bot Control Room</h1>
    <span class="stamp">updated ${esc(ledger.updated || last.date || '')}</span>
  </header>
  <p class="lead">A single always-current view of the two autonomous, token-free bots — the <b>Auditor</b> (tests live tools) and the <b>Fixer</b> (applies safe fixes) — plus the build pipeline toward the ${BUILD_TARGET.toLocaleString()}-tool target. Regenerated on every bot run; charts are self-contained (no external requests).</p>

  <div class="grid kpis">
    ${kpi(`${toolCount.toLocaleString()}<span class="muted" style="font-size:16px">/${BUILD_TARGET.toLocaleString()}</span>`, 'Tools built', `${buildPct}% of target · ${remaining.toLocaleString()} to go`)}
    ${kpi(`${last.avg ?? '—'}%`, 'Latest avg score', `over ${last.tools ?? 0} tools`)}
    ${kpi(openAll.length, 'Open findings', `${sevCount.high || 0} high priority`)}
    ${kpi(verifying.length, 'Awaiting verify', 're-tested next run')}
    ${kpi(resolvedTotal, 'Resolved', 'fixed &amp; confirmed')}
    ${kpi(challenged.length, 'Challenged', challenged.length ? 'need attention' : 'all clear')}
  </div>

  <section class="grid cols">
    <div class="panel">
      <h2>🏗️ Build pipeline <span class="em">— toward ${BUILD_TARGET.toLocaleString()} tools</span></h2>
      <div class="prow"><span>Tools built</span><b>${toolCount.toLocaleString()} / ${BUILD_TARGET.toLocaleString()}</b></div>
      ${bar(buildPct, COL.accent)}
      <div class="prow"><span class="muted">${buildPct}% complete</span><span class="muted">${remaining.toLocaleString()} remaining</span></div>
      <div class="prow" style="margin-top:16px"><span>Audit coverage</span><b>${audited} / ${catalogue} tools</b></div>
      ${bar(auditPct, COL.teal)}
      <div class="prow"><span class="muted">${auditPct}% audited</span><span class="muted">~10/day rolling sweep</span></div>
    </div>
    <div class="panel">
      <h2>📚 Tools by category <span class="em">— top ${topCats.length}</span></h2>
      ${hbars(topCats.map(([label, value], i) => ({ label, value, color: CATPAL[i % CATPAL.length] })))}
    </div>
  </section>

  <section class="panel">
    <h2>📈 Audit score trend <span class="em">— average quality score per run</span></h2>
    ${trend(runs)}
  </section>

  <section class="grid cols3">
    <div class="panel">
      <h2>🔬 Open findings by severity</h2>
      <div class="donut-wrap">
        ${donut([
          { label: 'High', value: sevCount.high || 0, color: COL.red },
          { label: 'Medium', value: sevCount.medium || 0, color: COL.amber },
          { label: 'Low', value: sevCount.low || 0, color: COL.slate },
        ], { center: String(openAll.length) })}
        <div class="legend">
          <span><i style="background:${COL.red}"></i>High <b>${sevCount.high || 0}</b></span>
          <span><i style="background:${COL.amber}"></i>Medium <b>${sevCount.medium || 0}</b></span>
          <span><i style="background:${COL.slate}"></i>Low <b>${sevCount.low || 0}</b></span>
        </div>
      </div>
    </div>
    <div class="panel">
      <h2>🗂️ By audit dimension</h2>
      ${catFindingRows.length ? hbars(catFindingRows.map(([label, value]) => ({ label, value }))) : '<p class="muted">No open findings.</p>'}
    </div>
    <div class="panel">
      <h2>🔁 Fix lifecycle</h2>
      <div class="funnel">
        <div class="fstep"><div class="n">${openAll.length}</div><div class="l">🟡 Open</div></div>
        <div class="fstep"><div class="n">${verifying.length}</div><div class="l">🔧 Verifying</div></div>
        <div class="fstep"><div class="n">${resolvedTotal}</div><div class="l">✅ Complete</div></div>
        <div class="fstep"><div class="n">${challenged.length}</div><div class="l">⚠️ Challenged</div></div>
      </div>
      <p class="muted" style="font-size:12.5px;margin:12px 0 0">Fixer applies a safe change → <b>Verifying</b>; next day the Auditor re-tests live → <b>Complete</b>, or <b>Challenged</b> with a reason after repeated failure.</p>
    </div>
  </section>

  <section class="grid cols">
    <div class="panel">
      <h2>⚠️ Challenged — need a human/AI</h2>
      <ul class="list">${challengedHTML}</ul>
    </div>
    <div class="panel">
      <h2>🔧 Fixed, awaiting verification</h2>
      <ul class="list">${verifyHTML}</ul>
      <h2 style="margin-top:18px">✅ Recently completed</h2>
      <ul class="list">${doneHTML}</ul>
    </div>
  </section>

  <section class="panel">
    <h2>🟡 Top open findings <span class="em">— ${openAll.length} total, highest severity first</span></h2>
    <div style="overflow-x:auto">
    <table>
      <thead><tr><th>Sev</th><th>Tool</th><th>Finding</th><th>Fix</th><th>Detail</th></tr></thead>
      <tbody>${topOpenHTML}</tbody>
    </table>
    </div>
  </section>

  <footer>
    Two autonomous bots · token-free · runs daily in GitHub Actions.<br/>
    <a href="https://github.com/Synth88Labs/lazytools.io/blob/main/audits/DASHBOARD.md">markdown dashboard</a> ·
    <a href="https://github.com/Synth88Labs/lazytools.io/tree/main/audits/reports">daily reports</a> ·
    <a href="https://github.com/Synth88Labs/lazytools.io/blob/main/audits/recommendations.md">recommendations</a> ·
    <a href="https://github.com/Synth88Labs/lazytools.io/blob/main/audits/ledger.json">ledger</a> ·
    <a href="https://github.com/Synth88Labs/lazytools.io/blob/main/docs/AUDIT-SYSTEM.md">how it works</a><br/>
    Self-contained page — no trackers, no external requests. Not indexed.
  </footer>
</div>
</body>
</html>
`;

await writeFile(new URL('audits/dashboard.html', ROOT), html);
console.log(`dashboard.html written — ${toolCount}/${BUILD_TARGET} tools, ${openAll.length} open, ${runs.length} run(s).`);
