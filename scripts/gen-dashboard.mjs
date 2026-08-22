/**
 * Command-deck dashboard generator — writes a single self-contained
 * audits/dashboard.html visualising the three autonomous agents (Manager,
 * Auditor, Fixer): what each is working on, per-task ETAs, open issues,
 * SLA reconciliation, and Manager's daily/weekly performance ratings — plus
 * the build pipeline toward the tool target.
 *
 * Regenerated on every bot run (called at the end of the Manager). 100%
 * self-contained: inline CSS + server-rendered inline SVG, no external
 * requests, no JS dependency. Future-tech HUD aesthetic.
 */
import { readFile, writeFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);
const BUILD_TARGET = Number(process.env.BUILD_TARGET || 1500);
const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const ledger = JSON.parse(await readFile(new URL('audits/ledger.json', ROOT), 'utf8'));
ledger.findings ||= {};
let slugs = [];
try { slugs = JSON.parse(await readFile(new URL('api/tools-allowlist.json', ROOT), 'utf8')); } catch {}

const all = Object.values(ledger.findings);
const by = (s) => all.filter((f) => f.status === s);
const complete = by('complete'), openAll = by('open'), verifying = [...by('verifying'), ...by('fixed')], challenged = by('challenged');
const active = all.filter((f) => ['open', 'verifying', 'fixed', 'challenged'].includes(f.status));
const runs = ledger.runs || [];
const last = runs[runs.length - 1] || {};
const scores = ledger.scores || { daily: [], weekly: [] };
const agents = ledger.agents || {};
const research = ledger.research || { items: [] };
const mKpis = (agents.manager && agents.manager.kpis) || {};
const tokUsed = mKpis.tokensToday || 0, tokCap = mKpis.tokenCap || 400000, tokCost = mKpis.costUsd || 0;
const tokPct = Math.min(100, Math.round((tokUsed / tokCap) * 100));
const tokCalls = ((ledger.tokens && ledger.tokens.daily) || []).reduce((a, d) => (d.date === ledger.updated ? a + (d.calls || 0) : a), 0);

const toolCount = slugs.length || ledger.catalogueSize || 0;
const audited = (ledger.auditedTools || []).length;
const catalogue = ledger.catalogueSize || toolCount || 1;
const auditPct = Math.round((audited / catalogue) * 100);
const buildPct = Math.min(100, Math.round((toolCount / BUILD_TARGET) * 100));
const remaining = Math.max(0, BUILD_TARGET - toolCount);

const sevRank = { critical: 4, high: 3, medium: 2, low: 1 };
const sevCount = { high: 0, medium: 0, low: 0 };
for (const f of openAll) { const k = f.severity === 'critical' ? 'high' : (f.severity || 'low'); sevCount[k] = (sevCount[k] || 0) + 1; }
const catFindings = {};
for (const f of openAll) catFindings[f.category || 'other'] = (catFindings[f.category || 'other'] || 0) + 1;
const catRows = Object.entries(catFindings).sort((a, b) => b[1] - a[1]);
const overdue = active.filter((f) => f.sla === 'overdue').length;
const onTrack = active.length - overdue;
const slaPct = active.length ? Math.round((onTrack / active.length) * 100) : 100;

// ── palette / helpers ────────────────────────────────────────────────────────
const CY = '#22d3ee', MG = '#e879f9', LI = '#a3e635', AM = '#fbbf24', RD = '#fb7185', VI = '#818cf8';
const CATPAL = [CY, MG, LI, AM, RD, VI, '#2dd4bf', '#f472b6', '#38bdf8', '#c084fc'];

function stars(v) {
  v = Number(v) || 0; const full = Math.round(v);
  let out = '';
  for (let i = 1; i <= 5; i++) out += `<span class="st ${i <= full ? 'on' : ''}">★</span>`;
  return `<span class="stars">${out}</span><span class="stv">${v.toFixed(1)}</span>`;
}
function ring(pct, label, sub, color) {
  const r = 54, c = 2 * Math.PI * r, len = (pct / 100) * c;
  return `<svg viewBox="0 0 140 140" class="ring" role="img" aria-label="${esc(label)} ${pct}%">
    <circle cx="70" cy="70" r="${r}" class="ring-track"/>
    <circle cx="70" cy="70" r="${r}" fill="none" stroke="${color}" stroke-width="10" stroke-linecap="round"
      stroke-dasharray="${len.toFixed(1)} ${(c - len).toFixed(1)}" transform="rotate(-90 70 70)" filter="url(#glow)"/>
    <text x="70" y="66" text-anchor="middle" class="ring-num">${pct}%</text>
    <text x="70" y="86" text-anchor="middle" class="ring-cap">${esc(sub)}</text>
  </svg>`;
}
function donut(segs, center) {
  const size = 150, th = 20, r = (size - th) / 2, c = 2 * Math.PI * r, cx = size / 2;
  const total = segs.reduce((a, s) => a + s.value, 0) || 1;
  let off = 0;
  const rings = segs.filter((s) => s.value > 0).map((s) => {
    const len = (s.value / total) * c;
    const el = `<circle cx="${cx}" cy="${cx}" r="${r}" fill="none" stroke="${s.color}" stroke-width="${th}" stroke-dasharray="${len.toFixed(2)} ${(c - len).toFixed(2)}" stroke-dashoffset="${(-off).toFixed(2)}" transform="rotate(-90 ${cx} ${cx})" filter="url(#glow)"><title>${esc(s.label)}: ${s.value}</title></circle>`;
    off += len; return el;
  }).join('');
  return `<svg viewBox="0 0 ${size} ${size}" class="donut"><circle cx="${cx}" cy="${cx}" r="${r}" class="ring-track" stroke-width="${th}"/>${rings}<text x="${cx}" y="${cx - 1}" text-anchor="middle" class="donut-num">${esc(center)}</text><text x="${cx}" y="${cx + 16}" text-anchor="middle" class="ring-cap">OPEN</text></svg>`;
}
function hbars(rows, max) {
  const m = max ?? Math.max(1, ...rows.map((r) => r.value));
  return `<div class="hbars">${rows.map((r, i) => {
    const w = Math.max(3, Math.round((r.value / m) * 100)); const col = r.color || CATPAL[i % CATPAL.length];
    return `<div class="hbar"><span class="hbar-l">${esc(r.label)}</span><span class="hbar-track"><span class="hbar-fill" style="width:${w}%;background:${col};box-shadow:0 0 10px ${col}"></span></span><span class="hbar-v">${esc(r.value)}</span></div>`;
  }).join('')}</div>`;
}
// dual-line performance chart (auditor vs fixer, 0-5)
function perfChart(daily) {
  if (!daily || !daily.length) return `<p class="muted">No performance history yet — Manager records daily scores each run.</p>`;
  const W = 760, H = 210, P = 34;
  const xs = (i) => daily.length === 1 ? W / 2 : P + (i * (W - 2 * P)) / (daily.length - 1);
  const ys = (v) => H - P - (v / 5) * (H - 2 * P);
  const path = (key) => daily.map((r, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)} ${ys(r[key] || 0).toFixed(1)}`).join(' ');
  const dots = (key, col) => daily.map((r, i) => `<circle cx="${xs(i).toFixed(1)}" cy="${ys(r[key] || 0).toFixed(1)}" r="3.5" fill="${col}" filter="url(#glow)"><title>${esc(r.date)} ${key}: ${r[key]}</title></circle>`).join('');
  const grid = [0, 1, 2, 3, 4, 5].map((g) => { const y = ys(g); return `<line x1="${P}" y1="${y}" x2="${W - P}" y2="${y}" class="grid"/><text x="${P - 6}" y="${y + 3}" text-anchor="end" class="axis">${g}</text>`; }).join('');
  const labels = daily.filter((_, i) => daily.length <= 8 || i % Math.ceil(daily.length / 8) === 0 || i === daily.length - 1)
    .map((r) => { const i = daily.indexOf(r); return `<text x="${xs(i).toFixed(1)}" y="${H - P + 16}" text-anchor="middle" class="axis">${esc(r.date.slice(5))}</text>`; }).join('');
  return `<svg viewBox="0 0 ${W} ${H}" class="wide">${grid}
    <path d="${path('auditor')}" fill="none" stroke="${CY}" stroke-width="2.4" filter="url(#glow)"/>
    <path d="${path('fixer')}" fill="none" stroke="${LI}" stroke-width="2.4" filter="url(#glow)"/>
    ${dots('auditor', CY)}${dots('fixer', LI)}${labels}</svg>
    <div class="lgnd"><span><i style="background:${CY}"></i>Auditor</span><span><i style="background:${LI}"></i>Fixer</span></div>`;
}
// ETA gantt-style bars for in-flight recommendations
function etaBars() {
  const items = active.filter((f) => f.effortHours).sort((a, b) => (String(a.dueBy) < String(b.dueBy) ? -1 : 1)).slice(0, 12);
  if (!items.length) return `<p class="muted">No active recommendations.</p>`;
  const maxH = Math.max(12, ...items.map((f) => f.effortHours || 0));
  return `<div class="gantt">${items.map((f) => {
    const w = Math.max(8, Math.round(((f.effortHours || 2) / maxH) * 100));
    const col = f.sla === 'overdue' ? RD : f.assignedTo === 'manager' ? MG : CY;
    return `<div class="grow">
      <span class="gl" title="${esc(f.tool)}: ${esc(f.check)}">${esc(f.tool.split('/').pop())} · ${esc(f.check)}</span>
      <span class="gtrack"><span class="gfill" style="width:${w}%;background:${col};box-shadow:0 0 10px ${col}"></span></span>
      <span class="geta">${esc(f.eta)}</span>
      <span class="gdue ${f.sla === 'overdue' ? 'od' : ''}">${esc(f.dueBy)}</span>
      <span class="gwho who-${esc(f.assignedTo)}">${esc(f.assignedTo)}</span>
    </div>`;
  }).join('')}</div>`;
}

function agentCard(key, glyph, accent, a) {
  a = a || {}; const sc = a.score || {};
  const kp = a.kpis || {};
  const chips = Object.entries(kp).map(([k, v]) => `<span class="chip">${esc(k)}<b>${esc(v)}</b></span>`).join('');
  const ratingBlock = (key.toLowerCase() === 'manager')
    ? `<div class="rate mgr">RATES THE TEAM ▸</div>`
    : `<div class="rate"><span class="rlab">daily</span>${stars(sc.daily)}</div><div class="rate"><span class="rlab">weekly</span>${stars(sc.weekly)}</div>`;
  return `<div class="agent" style="--ac:${accent}">
    <div class="ahead"><span class="glyph">${glyph}</span><div class="ainfo"><div class="aname">${esc(key)}</div><div class="arole">${esc(a.role || '')}</div></div></div>
    <div class="astatus"><span class="led"><i></i>${esc(a.status || 'idle')}</span></div>
    <div class="atask"><span class="now">NOW</span>${esc(a.task || '—')}</div>
    <div class="chips">${chips}</div>
    <div class="rates">${ratingBlock}</div>
  </div>`;
}

const sevColor = (s) => (s === 'high' || s === 'critical' ? RD : s === 'medium' ? AM : VI);
const topOpen = openAll.slice().sort((a, b) => (sevRank[b.severity] || 0) - (sevRank[a.severity] || 0)).slice(0, 16);
const coordItems = active.filter((f) => f.coordination).slice(0, 10);

// ── page ─────────────────────────────────────────────────────────────────────
const html = `<!doctype html><html lang="en"><head>
<meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>
<meta name="robots" content="noindex, nofollow"/>
<meta http-equiv="refresh" content="1800"/>
<title>◤ KUROOP Command Deck ◢</title>
<style>
  *{box-sizing:border-box}
  :root{--cy:${CY};--mg:${MG};--li:${LI};--am:${AM};--rd:${RD};--ink:#dbeafe;--mut:#7d8db3;--line:rgba(120,160,220,.16);--glass:rgba(12,20,38,.55)}
  html,body{margin:0}
  body{background:
      radial-gradient(1200px 600px at 15% -10%, rgba(34,211,238,.10), transparent 60%),
      radial-gradient(1000px 500px at 100% 0%, rgba(232,121,249,.08), transparent 55%),
      linear-gradient(180deg,#05070f,#070b16 60%,#04060d);
    color:var(--ink);font:14px/1.5 ui-sans-serif,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;min-height:100vh}
  body::before{content:"";position:fixed;inset:0;pointer-events:none;z-index:0;opacity:.35;
    background-image:linear-gradient(rgba(120,160,220,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(120,160,220,.05) 1px,transparent 1px);
    background-size:40px 40px}
  .wrap{position:relative;z-index:1;max-width:1140px;margin:0 auto;padding:26px 18px 70px}
  .mono{font-family:ui-monospace,"Cascadia Mono",Consolas,monospace}
  .muted{color:var(--mut)}
  /* header */
  .hud{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;margin-bottom:6px}
  .hud h1{margin:0;font-size:24px;letter-spacing:4px;font-weight:700;text-transform:uppercase;
    background:linear-gradient(90deg,var(--cy),var(--mg));-webkit-background-clip:text;background-clip:text;color:transparent;
    text-shadow:0 0 26px rgba(34,211,238,.25)}
  .sub{color:var(--mut);letter-spacing:2px;text-transform:uppercase;font-size:11px}
  .hstat{margin-left:auto;display:flex;gap:8px;flex-wrap:wrap}
  .pill{font-family:ui-monospace,Consolas,monospace;font-size:11px;letter-spacing:1px;padding:5px 11px;border:1px solid var(--line);border-radius:20px;background:var(--glass);color:var(--ink)}
  .pill b{color:var(--cy)}
  .ok{color:var(--li)}.warn{color:var(--am)}.bad{color:var(--rd)}
  /* panels */
  .grid{display:grid;gap:16px}
  .cols3{grid-template-columns:repeat(3,1fr)}
  .cols2{grid-template-columns:1fr 1fr}
  .roster{display:grid;gap:16px;grid-template-columns:repeat(5,1fr)}
  @media(max-width:1000px){.roster{grid-template-columns:repeat(2,1fr)}}
  @media(max-width:520px){.roster{grid-template-columns:1fr}}
  .col-2-1{grid-template-columns:1.3fr .7fr}
  @media(max-width:820px){.cols3,.cols2,.col-2-1{grid-template-columns:1fr}}
  .panel{position:relative;background:var(--glass);border:1px solid var(--line);border-radius:16px;padding:18px;
    backdrop-filter:blur(8px);box-shadow:0 0 0 1px rgba(0,0,0,.2),0 18px 40px -20px rgba(0,0,0,.8)}
  .panel::before,.panel::after{content:"";position:absolute;width:14px;height:14px;border:2px solid var(--cy);opacity:.5}
  .panel::before{top:8px;left:8px;border-right:0;border-bottom:0}
  .panel::after{bottom:8px;right:8px;border-left:0;border-top:0}
  h2.t{margin:0 0 14px;font-size:12px;letter-spacing:2.5px;text-transform:uppercase;color:var(--mut);font-weight:700}
  h2.t b{color:var(--cy)}
  section{margin-top:16px}
  /* agent cards */
  .agent{position:relative;background:linear-gradient(180deg,rgba(255,255,255,.03),transparent);border:1px solid var(--line);border-top:2px solid var(--ac);border-radius:14px;padding:15px;overflow:hidden}
  .agent::after{content:"";position:absolute;inset:0;background:radial-gradient(120px 60px at 90% 0,var(--ac),transparent 70%);opacity:.12;pointer-events:none}
  .ahead{display:flex;align-items:center;gap:11px}
  .glyph{width:40px;height:40px;flex:none;display:grid;place-items:center;border-radius:11px;background:rgba(255,255,255,.04);border:1px solid var(--line);font-size:20px;filter:drop-shadow(0 0 8px var(--ac))}
  .ainfo{min-width:0;flex:1}
  .aname{font-weight:700;letter-spacing:2px;text-transform:uppercase;font-size:14px;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .arole{font-size:11px;color:var(--mut);line-height:1.35}
  .astatus{margin-top:11px}
  .led{display:inline-flex;align-items:center;gap:6px;max-width:100%;font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--ac);border:1px solid var(--line);border-radius:20px;padding:3px 10px;background:rgba(255,255,255,.03)}
  .led i{width:8px;height:8px;flex:none;border-radius:50%;background:var(--ac);box-shadow:0 0 10px var(--ac);animation:pulse 1.8s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
  .atask{margin:12px 0 10px;font-size:13px;line-height:1.45;min-height:38px}
  .now{display:inline-block;font-size:9px;letter-spacing:1.5px;color:#04060d;background:var(--ac);padding:1px 6px;border-radius:4px;margin-right:8px;vertical-align:middle;font-weight:800}
  .chips{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px}
  .chip{font-family:ui-monospace,Consolas,monospace;font-size:10.5px;color:var(--mut);border:1px solid var(--line);border-radius:6px;padding:3px 7px}
  .chip b{color:var(--ink);margin-left:5px}
  .rates{display:flex;gap:16px;flex-wrap:wrap;border-top:1px solid var(--line);padding-top:11px}
  .rate{display:flex;align-items:center;gap:6px}
  .rlab{font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--mut)}
  .rate.mgr{color:var(--mg);font-size:11px;letter-spacing:2px;font-weight:700}
  .stars .st{color:#2b3652;font-size:14px}
  .stars .st.on{color:var(--am);text-shadow:0 0 8px rgba(251,191,36,.6)}
  .stv{margin-left:5px;font-family:ui-monospace,Consolas,monospace;font-size:12px;color:var(--ink)}
  /* rings/charts */
  .ring{width:140px;height:140px}
  .ring-track{fill:none;stroke:rgba(120,160,220,.12)}
  .ring-num{fill:#fff;font-size:26px;font-weight:700;font-family:ui-monospace,Consolas,monospace}
  .ring-cap{fill:var(--mut);font-size:9px;letter-spacing:1.5px}
  .donut{width:150px;height:150px}
  .donut-num{fill:#fff;font-size:30px;font-weight:700;font-family:ui-monospace,Consolas,monospace}
  .flexrow{display:flex;gap:18px;align-items:center;flex-wrap:wrap}
  .pbar{display:block;height:9px;border-radius:6px;background:rgba(120,160,220,.12);overflow:hidden;margin:8px 0}
  .pbar-fill{display:block;height:100%;border-radius:6px}
  .prow{display:flex;justify-content:space-between;font-size:12.5px;margin-top:6px}
  .prow b{font-family:ui-monospace,Consolas,monospace}
  .wide{width:100%;height:auto}
  line.grid{stroke:var(--line)}
  text.axis{fill:var(--mut);font-size:10px;font-family:ui-monospace,Consolas,monospace}
  .lgnd{display:flex;gap:16px;justify-content:center;font-size:12px;color:var(--mut);margin-top:6px}
  .lgnd i{display:inline-block;width:11px;height:11px;border-radius:3px;margin-right:6px;vertical-align:middle}
  .hbars{display:flex;flex-direction:column;gap:8px}
  .hbar{display:grid;grid-template-columns:104px 1fr 30px;align-items:center;gap:10px;font-size:12px}
  .hbar-l{color:var(--mut);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:capitalize}
  .hbar-track{background:rgba(120,160,220,.12);border-radius:6px;height:8px;overflow:hidden}
  .hbar-fill{display:block;height:100%;border-radius:6px}
  .hbar-v{text-align:right;font-family:ui-monospace,Consolas,monospace;color:var(--ink)}
  .rrow{display:grid;grid-template-columns:1fr auto auto;align-items:center;gap:10px;font-size:12.5px;padding:6px 0;border-bottom:1px solid var(--line)}
  .rrow:last-child{border:0}
  .rname{color:var(--ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .rbadge{font-size:9.5px;letter-spacing:.5px;text-transform:uppercase;border:1px solid;border-radius:20px;padding:2px 8px}
  .rrate{font-family:ui-monospace,Consolas,monospace;color:var(--am);font-size:12px}
  .goalnum{font-family:ui-monospace,Consolas,monospace;font-weight:700}
  /* gantt */
  .gantt{display:flex;flex-direction:column;gap:8px}
  .grow{display:grid;grid-template-columns:1fr 90px 70px 84px 66px;align-items:center;gap:10px;font-size:12px}
  .gl{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:var(--ink)}
  .gtrack{background:rgba(120,160,220,.12);border-radius:5px;height:9px;overflow:hidden}
  .gfill{display:block;height:100%;border-radius:5px}
  .grow{grid-template-columns:220px 1fr 78px 74px}
  @media(max-width:820px){.grow{grid-template-columns:130px 1fr 60px 64px}}
  .geta{font-family:ui-monospace,Consolas,monospace;color:var(--mut);font-size:11px;text-align:right}
  .gdue{font-family:ui-monospace,Consolas,monospace;font-size:11px;color:var(--cy);text-align:right}
  .gdue.od{color:var(--rd)}
  .gwho{display:none}
  /* table */
  table{width:100%;border-collapse:collapse;font-size:12.5px}
  th,td{text-align:left;padding:8px 9px;border-bottom:1px solid var(--line);vertical-align:top}
  th{font-size:10px;letter-spacing:1px;text-transform:uppercase;color:var(--mut)}
  td a{color:var(--cy);text-decoration:none}
  td a:hover{text-decoration:underline}
  .sev{color:#04060d;font-size:10px;font-weight:700;padding:2px 8px;border-radius:20px;text-transform:capitalize}
  .who{font-size:10px;letter-spacing:.5px;text-transform:uppercase;padding:2px 7px;border-radius:20px;border:1px solid var(--line)}
  .who-fixer{color:var(--li)}.who-manager{color:var(--mg)}.who-auditor{color:var(--cy)}
  ul.list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;font-size:12.5px}
  ul.list li{padding-bottom:9px;border-bottom:1px solid var(--line)}
  ul.list li:last-child{border:0}
  ul.list b{color:#fff}
  footer{margin-top:26px;text-align:center;color:var(--mut);font-size:11px;letter-spacing:.5px;line-height:2}
  footer a{color:var(--cy);text-decoration:none}
</style></head>
<body><svg width="0" height="0"><defs><filter id="glow"><feGaussianBlur stdDeviation="2.2" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs></svg>
<div class="wrap">

  <div class="hud">
    <h1>◤ Kuroop Command Deck ◢</h1>
    <span class="hstat">
      <span class="pill">SYS <b class="${overdue ? 'warn' : 'ok'}">${overdue ? 'RECONCILING' : 'NOMINAL'}</b></span>
      <span class="pill">SLA <b class="${slaPct >= 80 ? 'ok' : 'warn'}">${slaPct}%</b></span>
      <span class="pill mono">${esc(ledger.updated || last.date || '')}</span>
      <span class="pill" title="auto-refreshes every 30 minutes">⟳ 30m</span>
    </span>
  </div>
  <div class="sub">LazyTools · autonomous operations · Manager ▸ Auditor ▸ Fixer ▸ Researcher ▸ Developer · reported by Kuroop</div>

  <section class="roster">
    ${agentCard('Manager', '🧭', MG, agents.manager)}
    ${agentCard('Auditor', '🛰️', CY, agents.auditor)}
    ${agentCard('Fixer', '🛠️', LI, agents.fixer)}
    ${agentCard('Researcher', '🔬', AM, agents.researcher)}
    ${agentCard('Developer', '🧑‍💻', VI, agents.developer)}
  </section>

  <section class="grid col-2-1">
    <div class="panel">
      <h2 class="t">Team performance <b>· out of 5 ·</b> Manager's rating</h2>
      ${perfChart(scores.daily)}
    </div>
    <div class="panel">
      <h2 class="t">Build pipeline</h2>
      <div class="flexrow" style="justify-content:center">${ring(buildPct, 'build', `${toolCount}/${BUILD_TARGET}`, MG)}</div>
      <div class="prow"><span class="muted">Tools built</span><b>${toolCount} / ${BUILD_TARGET}</b></div>
      <div class="prow"><span class="muted">Remaining</span><b>${remaining}</b></div>
      <div class="prow" style="margin-top:8px"><span class="muted">Audit coverage</span><b>${audited}/${catalogue}</b></div>
      <div class="pbar"><span class="pbar-fill" style="width:${auditPct}%;background:${CY};box-shadow:0 0 10px ${CY}"></span></div>
    </div>
  </section>

  <section class="grid col-2-1">
    <div class="panel">
      <h2 class="t">Research pipeline <b>· Manager-rated</b></h2>
      ${research.items && research.items.length ? `<div class="hbars">${research.items.slice().sort((a, b) => (b.managerRating || 0) - (a.managerRating || 0)).slice(0, 8).map((it) => {
        const rt = it.managerRating || 0; const col = it.status === 'approved' ? LI : it.status === 'built' ? CY : '#5b6784';
        return `<div class="rrow"><span class="rname" title="${esc(it.slug)}">${esc(it.name)}</span><span class="rbadge" style="color:${col};border-color:${col}">${esc(it.status || 'proposed')}</span><span class="rrate">${rt}/5</span></div>`;
      }).join('')}</div><p class="muted" style="font-size:11px;margin-top:10px">Researcher proposes weekly → Manager rates → ≥4 enters the Developer's build queue.</p>` : '<p class="muted">No research this cycle — the Researcher runs weekly.</p>'}
    </div>
    <div class="panel">
      <h2 class="t">Token governance <b>· Manager</b></h2>
      <div class="goalnum" style="font-size:30px;color:${tokPct >= 90 ? RD : tokPct >= 70 ? AM : CY}">${tokUsed.toLocaleString()}</div>
      <div class="prow"><span class="muted">of ${tokCap.toLocaleString()} daily cap</span><span class="muted">${tokPct}%</span></div>
      <div class="pbar"><span class="pbar-fill" style="width:${tokPct}%;background:${tokPct >= 90 ? RD : tokPct >= 70 ? AM : CY};box-shadow:0 0 10px ${CY}"></span></div>
      <div class="prow" style="margin-top:10px"><span class="muted">Est. cost today</span><b>$${tokCost}</b></div>
      <div class="prow"><span class="muted">LLM calls today</span><b>${tokCalls}</b></div>
    </div>
  </section>

  <section class="panel">
    <h2 class="t">Recommendation ETAs <b>· ${active.length} active ·</b> ${overdue} overdue</h2>
    ${etaBars()}
  </section>

  <section class="grid cols3">
    <div class="panel">
      <h2 class="t">Open by severity</h2>
      <div class="flexrow">
        ${donut([{ label: 'High', value: sevCount.high || 0, color: RD }, { label: 'Medium', value: sevCount.medium || 0, color: AM }, { label: 'Low', value: sevCount.low || 0, color: VI }], String(openAll.length))}
        <div class="lgnd" style="flex-direction:column;align-items:flex-start;gap:6px">
          <span><i style="background:${RD}"></i>High ${sevCount.high || 0}</span>
          <span><i style="background:${AM}"></i>Medium ${sevCount.medium || 0}</span>
          <span><i style="background:${VI}"></i>Low ${sevCount.low || 0}</span>
        </div>
      </div>
    </div>
    <div class="panel">
      <h2 class="t">By dimension</h2>
      ${catRows.length ? hbars(catRows.map(([label, value]) => ({ label, value }))) : '<p class="muted">None.</p>'}
    </div>
    <div class="panel">
      <h2 class="t">Lifecycle</h2>
      ${hbars([
        { label: 'open', value: openAll.length, color: AM },
        { label: 'verifying', value: verifying.length, color: CY },
        { label: 'complete', value: complete.length, color: LI },
        { label: 'challenged', value: challenged.length, color: RD },
      ])}
      <div class="prow" style="margin-top:12px"><span class="muted">On-track / overdue</span><b>${onTrack} / ${overdue}</b></div>
    </div>
  </section>

  ${coordItems.length ? `<section class="panel">
    <h2 class="t">Coordination log <b>· Manager ⇄ Auditor ⇄ Fixer</b></h2>
    <ul class="list">${coordItems.map((f) => `<li><b>${esc(f.tool)}</b> — ${esc(f.check)}<br/><span class="muted">${esc(f.coordination)}</span></li>`).join('')}</ul>
  </section>` : ''}

  <section class="panel">
    <h2 class="t">Top open findings <b>· ${openAll.length} total</b></h2>
    <div style="overflow-x:auto"><table>
      <thead><tr><th>Sev</th><th>Tool</th><th>Finding</th><th>Owner</th><th>ETA</th><th>Due</th></tr></thead>
      <tbody>${topOpen.length ? topOpen.map((f) => `<tr>
        <td><span class="sev" style="background:${sevColor(f.severity)}">${esc(f.severity)}</span></td>
        <td><a href="${esc(f.url)}" target="_blank" rel="noopener">${esc(f.tool)}</a></td>
        <td>${esc(f.check)}</td>
        <td><span class="who who-${esc(f.assignedTo || 'fixer')}">${esc(f.assignedTo || 'fixer')}</span></td>
        <td class="mono muted">${esc(f.eta || '')}</td>
        <td class="mono ${f.sla === 'overdue' ? 'bad' : 'muted'}">${esc(f.dueBy || '')}</td></tr>`).join('') : '<tr><td colspan="6" class="muted">No open findings.</td></tr>'}</tbody>
    </table></div>
  </section>

  <footer>
    Three autonomous agents · token-free · runs daily in GitHub Actions · reported aloud by Kuroop.<br/>
    <a href="https://github.com/Synth88Labs/lazytools.io/blob/main/audits/DASHBOARD.md">markdown</a> ·
    <a href="https://github.com/Synth88Labs/lazytools.io/tree/main/audits/reports">reports</a> ·
    <a href="https://github.com/Synth88Labs/lazytools.io/blob/main/audits/ledger.json">ledger</a> ·
    <a href="https://github.com/Synth88Labs/lazytools.io/blob/main/docs/AUDIT-SYSTEM.md">how it works</a><br/>
    Self-contained HUD — no trackers, no external requests. Not indexed. · auto-refreshes every 30 min.
  </footer>
</div>
<script>setTimeout(function(){location.reload(true);},1800000);</script>
</body></html>`;

await writeFile(new URL('audits/dashboard.html', ROOT), html);
console.log(`dashboard.html (command deck) — ${toolCount}/${BUILD_TARGET} tools, ${openAll.length} open, ${active.length} active, ${overdue} overdue.`);
