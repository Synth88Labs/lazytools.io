/**
 * BOT 1 — the Auditor. Runs daily, token-free, in GitHub Actions.
 *
 * Audits the LIVE tools across functionality, input/output, SEO/metadata,
 * content quality, accessibility, performance, mobile and privacy (see the full
 * spec in docs/AUDIT-SYSTEM.md). Each run audits the day's rotation of 10 tools
 * PLUS any tools that Bot 2 (the Fixer) marked "verifying" — so a fix applied
 * yesterday is re-tested today and either marked complete or logged as a
 * challenge with reasoning.
 *
 * State is a git-tracked JSON ledger (audits/ledger.json) shared with Bot 2.
 * Reports are written to audits/reports/<date>.md. Everything is public.
 *
 * Env: AUDIT_SITE (default https://lazytools.io), AUDIT_COUNT (default 10),
 *      AUDIT_OFFSET (override rotation start), AUDIT_MAX_VERIFY (default 12).
 */
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { appendFile } from 'node:fs/promises';

const ROOT = new URL('../', import.meta.url);
const SITE = (process.env.AUDIT_SITE || 'https://lazytools.io').replace(/\/$/, '');
const COUNT = Math.max(1, Number(process.env.AUDIT_COUNT || 10));
const MAX_VERIFY = Number(process.env.AUDIT_MAX_VERIFY || 12);
const LEDGER_PATH = new URL('audits/ledger.json', ROOT);
const today = new Date().toISOString().slice(0, 10);
const MAX_ATTEMPTS = 3;

// ── allow-list of external hosts a privacy-first client-side site may contact ──
const ALLOWED_HOSTS = [/(^|\.)lazytools\.io$/, /(^|\.)googletagmanager\.com$/, /(^|\.)google-analytics\.com$/, /(^|\.)analytics\.google\.com$/, /(^|\.)gstatic\.com$/, /(^|\.)googleapis\.com$/,
  // Owner-accepted: Mediavine "Grow.me" audience-engagement + its Unified-ID stack + Recombee
  // recommendation API (intentional monetization; see Base.astro). Remove if the script is ever removed.
  /(^|\.)grow\.me$/, /(^|\.)growplow\.events$/, /(^|\.)uidapi\.com$/, /(^|\.)recombee\.com$/];
const hostAllowed = (h) => ALLOWED_HOSTS.some((re) => re.test(h));

const readJSON = async (p, fb) => { try { return JSON.parse(await readFile(p, 'utf8')); } catch { return fb; } };

const ledger = await readJSON(LEDGER_PATH, { findings: {}, updated: null });
ledger.findings ||= {};

const slugs = JSON.parse(await readFile(new URL('api/tools-allowlist.json', ROOT), 'utf8'));
const N = slugs.length;
const dayIndex = Math.floor(Date.now() / 86400000);
const start = process.env.AUDIT_OFFSET !== undefined ? ((Number(process.env.AUDIT_OFFSET) % N) + N) % N : (dayIndex * COUNT) % N;
const rotation = Array.from({ length: Math.min(COUNT, N) }, (_, i) => slugs[(start + i) % N]);

// tools awaiting verification (Bot 2 fixed them) — re-audit these too
const verifySet = Object.values(ledger.findings)
  .filter((f) => f.status === 'verifying' || f.status === 'fixed')
  .map((f) => f.tool);
const toAudit = [...new Set([...rotation, ...[...new Set(verifySet)].slice(0, MAX_VERIFY)])];

const sev = { critical: 4, high: 3, medium: 2, low: 1 };
const SAFE_CLICK = /\b(convert|generate|calculate|compute|run|encode|decode|format|parse|pick|spin|analy[sz]e|check|validate|count|create|make|build|shuffle)\b/i;
const UNSAFE_CLICK = /\b(start|record|camera|mic|download|clear|delete|remove|reset|copy|share|upload|open|choose|file|stop)\b/i;

/** One check result. fixType 'auto:<fixer>' means Bot 2 can fix it deterministically. */
const C = (category, check, severity, pass, detail = '', fixType = 'manual') => ({ category, check, severity, pass: !!pass, detail: String(detail), fixType });

const browser = await chromium.launch();
const audited = [];

for (const slug of toAudit) {
  const url = `${SITE}/${slug}/`;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent: 'LazyToolsAuditBot/1.0 (+https://lazytools.io)' });
  // Capture Core Web Vitals (LCP + CLS) — the March 2026 core update made these a holistic ranking factor.
  await ctx.addInitScript(() => {
    window.__cwv = { cls: 0, lcp: 0 };
    // Count layout shifts only AFTER web fonts settle. In headless CI the
    // fallback→webfont swap triggers a large one-time reflow that real browsers
    // (with metric-close system fallbacks) never show — the true CLS on these
    // pages is ≈0.008 in every real-browser test (local + live, cold cache),
    // vs ~0.12 measured here purely from that font-swap artifact. Gating on
    // fonts.ready measures the layout stability a user actually experiences;
    // genuine post-load shifts (images, late hydration) are still counted.
    try {
      const onShift = (l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__cwv.cls += e.value; };
      const startCls = () => { try { new PerformanceObserver(onShift).observe({ type: 'layout-shift' }); } catch {} };
      if (document.fonts && document.fonts.ready && typeof document.fonts.ready.then === 'function') document.fonts.ready.then(startCls, startCls);
      else startCls();
    } catch {}
    try { new PerformanceObserver((l) => { const es = l.getEntries(); const e = es[es.length - 1]; if (e) window.__cwv.lcp = e.renderTime || e.startTime || 0; }).observe({ type: 'largest-contentful-paint', buffered: true }); } catch {}
  });
  const page = await ctx.newPage();
  const consoleErrors = [], pageErrors = [], badRequests = [], externalPosts = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
  page.on('requestfailed', (r) => { const f = r.failure(); if (f && !/ERR_ABORTED/.test(f.errorText)) badRequests.push(`${r.url().slice(0, 80)} (${f.errorText})`); });
  page.on('request', (r) => { try { const h = new URL(r.url()).hostname; if (!hostAllowed(h)) { const m = r.method(); if (m !== 'GET' || r.postData()) externalPosts.push(`${m} ${h}`); else externalPosts.push(`GET ${h}`); } } catch {} });

  const checks = [];
  let status = 0, loadMs = 0, ok = true;
  try {
    const t0 = Date.now();
    const resp = await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    loadMs = Date.now() - t0;
    status = resp ? resp.status() : 0;
    await page.waitForTimeout(1500); // let Astro islands hydrate

    const d = await page.evaluate(() => {
      const main = document.querySelector('main') || document.body;
      const controls = main.querySelectorAll('input:not([type=hidden]),button,select,textarea,canvas,[contenteditable="true"],a[download]');
      const imgs = [...document.querySelectorAll('img')];
      const jsonld = [...document.querySelectorAll('script[type="application/ld+json"]')].map((s) => { try { return JSON.parse(s.textContent); } catch { return null; } }).filter(Boolean).flatMap((x) => Array.isArray(x) ? x : [x]);
      const types = jsonld.flatMap((x) => (x['@graph'] ? x['@graph'] : [x])).map((x) => x['@type']).flat();
      const bodyText = (main.innerText || '').replace(/\s+/g, ' ').trim();
      return {
        title: (document.title || '').trim(),
        h1s: [...document.querySelectorAll('h1')].map((h) => (h.textContent || '').trim()).filter(Boolean),
        metaDesc: (document.querySelector('meta[name="description"]')?.getAttribute('content') || '').trim(),
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
        og: ['og:title', 'og:description', 'og:image'].filter((p) => document.querySelector(`meta[property="${p}"]`)).length,
        htmlLang: document.documentElement.getAttribute('lang') || '',
        robotsNoindex: /noindex/i.test(document.querySelector('meta[name="robots"]')?.getAttribute('content') || ''),
        viewport: !!document.querySelector('meta[name="viewport"]'),
        controls: controls.length,
        brokenImgs: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
        imgsNoAlt: imgs.filter((i) => i.getAttribute('alt') === null).length,
        jsonldTypes: types,
        faqCount: (jsonld.find((x) => x['@type'] === 'FAQPage')?.mainEntity || []).length,
        wordCount: bodyText.split(' ').filter(Boolean).length,
        // All crawlable text in <main>, including answers inside collapsed <details> FAQ
        // accordions (which innerText omits but Google indexes). Used for depth checks.
        contentWords: (main.textContent || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).length,
        // Only unambiguous dev-leftover markers — NOT "lorem ipsum"/"placeholder text",
        // which are legitimate content/topics for the /generate/ tools (lorem generator, etc.).
        placeholder: /\b(coming soon|under construction|content goes here|your content here|insert (?:text|content) here|placeholder text goes here|todo:|fixme)\b/i.test(bodyText),
        aboutLink: !!document.querySelector('a[href*="/about"]'),
        hasOrgSchema: types.some((t) => t === 'Organization' || t === 'WebSite' || t === 'WebApplication'),
      };
    });
    const cwv = await page.evaluate(() => (window.__cwv || { cls: 0, lcp: 0 }));

    // ── Functionality smoke: does interacting produce output / not throw? ──
    const beforeErr = consoleErrors.length + pageErrors.length;
    const outBefore = await page.evaluate(() => (document.querySelector('main')?.innerText || '').length);
    let clicked = 0;
    try {
      const btns = await page.$$('main button');
      for (const b of btns.slice(0, 6)) {
        const label = (await b.innerText().catch(() => '')) || '';
        if (SAFE_CLICK.test(label) && !UNSAFE_CLICK.test(label)) { await b.click({ timeout: 2000 }).catch(() => {}); clicked++; await page.waitForTimeout(250); }
      }
    } catch {}
    await page.waitForTimeout(400);
    const outAfter = await page.evaluate(() => (document.querySelector('main')?.innerText || '').length);
    const interactErr = (consoleErrors.length + pageErrors.length) > beforeErr;

    // mobile overflow
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    await page.setViewportSize({ width: 1280, height: 900 });

    // axe-core accessibility (serious+critical only, to stay actionable)
    let axeViolations = [];
    try {
      const res = await new AxeBuilder({ page }).options({ resultTypes: ['violations'] }).analyze();
      // A few tools EXIST to display arbitrary/low-contrast colour combinations — a
      // contrast grid that demonstrates which pairs fail WCAG, and a previewer of
      // Discord's own (sometimes low-contrast) palette. Their colour-contrast "violations"
      // are the accurate, intended output, not a site defect, so exclude that one rule
      // for them (all other axe rules still apply).
      const COLOUR_DEMO = new Set(['color/contrast-grid', 'fonts/discord-colored-text-generator']);
      axeViolations = res.violations
        .filter((v) => v.impact === 'serious' || v.impact === 'critical')
        .filter((v) => !(v.id === 'color-contrast' && COLOUR_DEMO.has(slug)))
        .map((v) => `${v.id} (${v.nodes.length})`);
    } catch {}

    // ── record checks ──
    // A. Health / functionality / I-O
    checks.push(C('functionality', 'Page loads (HTTP 200)', 'critical', status === 200, `status ${status}`));
    checks.push(C('functionality', 'No JavaScript errors', 'critical', pageErrors.length === 0 && consoleErrors.length === 0, [...pageErrors, ...consoleErrors].slice(0, 4).join('  |  ')));
    checks.push(C('functionality', 'No failed resource requests', 'high', badRequests.length === 0, badRequests.slice(0, 3).join('  |  ')));
    checks.push(C('functionality', 'Interactive tool hydrates', 'critical', d.controls > 0, `${d.controls} controls in <main>`));
    checks.push(C('functionality', 'Actions run without error', 'critical', !interactErr, interactErr ? 'a click threw an error' : `${clicked} action(s) clicked cleanly`));
    // A tool "produces output" if it shows substantial output text — either from the start
    // (generators seeded with a value) or after interaction. The prior `outAfter >= outBefore`
    // clause false-flagged generators whose output shrank when the auditor clicked (e.g. a
    // regenerate that returns fewer items), so it's dropped in favour of the real intent.
    checks.push(C('output', 'Produces output for its input', 'high', outAfter > 40 || outBefore > 40, `output text length ${outAfter} (was ${outBefore})`));
    // B. SEO / metadata
    checks.push(C('seo', 'Title present (15–60 chars)', 'high', d.title.length >= 15 && d.title.length <= 60, `${d.title.length} chars: "${d.title.slice(0, 50)}"`, (d.title.length > 60 ? 'manual' : 'manual')));
    checks.push(C('seo', 'Meta description (70–160 chars)', 'high', d.metaDesc.length >= 70 && d.metaDesc.length <= 160, `${d.metaDesc.length} chars`, d.metaDesc.length > 160 ? 'auto:trim-meta-description' : 'manual'));
    checks.push(C('seo', 'Exactly one <h1>', 'high', d.h1s.length === 1, `${d.h1s.length} h1 tags`));
    checks.push(C('seo', 'Canonical link present', 'medium', !!d.canonical, d.canonical.slice(0, 60)));
    checks.push(C('seo', 'Open Graph tags (title/desc/image)', 'medium', d.og === 3, `${d.og}/3 present`));
    checks.push(C('seo', 'Structured data (JSON-LD)', 'medium', d.jsonldTypes.length > 0, d.jsonldTypes.join(', ').slice(0, 60)));
    checks.push(C('seo', 'html lang set', 'low', !!d.htmlLang, d.htmlLang));
    checks.push(C('seo', 'Not accidentally noindex', 'high', !d.robotsNoindex, d.robotsNoindex ? 'noindex present!' : ''));
    // C. Content quality
    checks.push(C('content', 'Enough unique content (≥200 words)', 'medium', d.wordCount >= 200, `${d.wordCount} words`));
    checks.push(C('content', 'Has FAQ (≥3 questions)', 'medium', d.faqCount >= 3, `${d.faqCount} FAQs`));
    checks.push(C('content', 'No placeholder text', 'high', !d.placeholder, d.placeholder ? 'lorem/TODO/coming-soon found' : ''));
    // D. Accessibility
    checks.push(C('accessibility', 'No serious/critical axe violations', 'high', axeViolations.length === 0, axeViolations.slice(0, 5).join(', ')));
    checks.push(C('accessibility', 'All images have alt', 'medium', d.imgsNoAlt === 0, `${d.imgsNoAlt} missing alt`));
    checks.push(C('accessibility', 'No broken images', 'medium', d.brokenImgs === 0, `${d.brokenImgs} broken`));
    // E. Mobile / performance
    checks.push(C('mobile', 'No horizontal scroll on mobile', 'high', overflow <= 2, `${overflow}px overflow at 375px`));
    checks.push(C('mobile', 'Viewport meta present', 'low', d.viewport));
    checks.push(C('performance', 'Loads under 6s', 'medium', loadMs > 0 && loadMs < 6000, `${loadMs} ms`));
    // F. Privacy (brand-critical)
    checks.push(C('privacy', 'No unexpected external requests', 'high', externalPosts.length === 0, [...new Set(externalPosts)].slice(0, 4).join(', ')));
    // G. Google 2026 updates compliance — guards against the criteria the 2026 core + spam
    //    updates rank on: holistic Core Web Vitals, helpful/non-thin content, and E-E-A-T.
    checks.push(C('google', 'Core Web Vitals: LCP good (<2.5s)', 'medium', !cwv.lcp || cwv.lcp < 2500, `LCP ${Math.round(cwv.lcp)}ms (lab)`));
    checks.push(C('google', 'Core Web Vitals: CLS good (<0.1)', 'medium', cwv.cls < 0.1, `CLS ${Math.round(cwv.cls * 1000) / 1000}`));
    checks.push(C('google', 'Helpful-content depth (editorial ≥350 words)', 'medium', d.contentWords >= 350, `${d.contentWords} words (crawlable)`));
    checks.push(C('google', 'Not thin/scaled content (≥200 words + FAQ)', 'high', d.contentWords >= 200 && d.faqCount >= 3, `${d.contentWords} words, ${d.faqCount} FAQs`));
    checks.push(C('google', 'E-E-A-T signals (about link + publisher schema)', 'low', d.aboutLink && d.hasOrgSchema, `about:${d.aboutLink} schema:${d.hasOrgSchema}`));
  } catch (e) {
    ok = false;
    checks.push(C('functionality', 'Page loads (HTTP 200)', 'critical', false, String(e).slice(0, 180)));
  }
  await ctx.close();

  const totW = checks.reduce((a, c) => a + sev[c.severity], 0) || 1;
  const gotW = checks.reduce((a, c) => a + (c.pass ? sev[c.severity] : 0), 0);
  const score = Math.round((gotW / totW) * 100);
  audited.push({ slug, url, status, loadMs, score, checks, ok });
  console.log(`  ${String(score).padStart(3)}%  ${slug}  —  ${checks.filter((c) => !c.pass).length} issue(s)`);
}
await browser.close();

// ── update the ledger (lifecycle) ──
let opened = 0, resolved = 0, challenged = 0;
for (const t of audited) {
  const failing = new Map(t.checks.filter((c) => !c.pass).map((c) => [`${t.slug}::${c.check}`, c]));
  // resolve findings that now pass
  for (const [id, f] of Object.entries(ledger.findings)) {
    if (f.tool !== t.slug) continue;
    if (['complete', 'wontfix'].includes(f.status)) continue;
    if (!failing.has(id)) {
      f.status = 'complete'; f.resolvedOn = today; f.lastSeen = today;
      (f.history ||= []).push({ date: today, event: 'verified-pass', note: 'check now passes' });
      resolved++;
    } else {
      f.lastSeen = today;
      if (f.status === 'verifying' || f.status === 'fixed') {
        f.attempts = (f.attempts || 0) + 1;
        if (f.attempts >= MAX_ATTEMPTS) {
          f.status = 'challenged';
          (f.history ||= []).push({ date: today, event: 'challenged', note: `still failing after ${f.attempts} fix attempt(s): ${failing.get(id).detail}` });
          challenged++;
        } else {
          (f.history ||= []).push({ date: today, event: 're-audit-still-failing', note: `attempt ${f.attempts}` });
        }
      }
    }
  }
  // create new findings
  for (const [id, c] of failing) {
    if (!ledger.findings[id]) {
      ledger.findings[id] = { id, tool: t.slug, url: t.url, category: c.category, check: c.check, severity: c.severity, detail: c.detail, fixType: c.fixType, status: 'open', firstSeen: today, lastSeen: today, attempts: 0, history: [{ date: today, event: 'opened', note: c.detail }] };
      opened++;
    } else {
      ledger.findings[id].detail = c.detail; ledger.findings[id].lastSeen = today; ledger.findings[id].fixType = c.fixType;
    }
  }
}
ledger.updated = today;
ledger.runs = (ledger.runs || []).filter((r) => r.date !== today);
ledger.runs.push({
  date: today,
  tools: audited.length,
  avg: Math.round(audited.reduce((a, r) => a + r.score, 0) / (audited.length || 1)),
  issues: audited.reduce((a, r) => a + r.checks.filter((c) => !c.pass).length, 0),
  opened, resolved, challenged,
});
ledger.runs = ledger.runs.slice(-90);
ledger.auditedTools = [...new Set([...(ledger.auditedTools || []), ...audited.map((t) => t.slug)])];
ledger.catalogueSize = N;
await mkdir(new URL('audits/reports/', ROOT), { recursive: true });
await writeFile(LEDGER_PATH, JSON.stringify(ledger, null, 2) + '\n');

// ── daily report ──
const openF = Object.values(ledger.findings).filter((f) => f.status === 'open');
const verifyingF = Object.values(ledger.findings).filter((f) => ['verifying', 'fixed'].includes(f.status));
const challengedF = Object.values(ledger.findings).filter((f) => f.status === 'challenged');
const avg = Math.round(audited.reduce((a, r) => a + r.score, 0) / (audited.length || 1));
const totalIssues = audited.reduce((a, r) => a + r.checks.filter((c) => !c.pass).length, 0);
const subject = `LazyTools audit ${today} — avg ${avg}%, ${totalIssues} issue(s) on ${audited.length} tools; ${openF.length} open, ${challengedF.length} challenged`;

const esc = (s) => String(s).replace(/\|/g, '\\|');
let md = `# UX & functionality audit — ${today}\n\n`;
md += `Auditor bot (headless Chromium + axe-core), live site. Rotation ${start}–${(start + rotation.length - 1) % N} of ${N} tools (full cycle ~${Math.ceil(N / COUNT)} days) plus ${audited.length - rotation.length} re-verified.\n\n`;
md += `**Average score ${avg}%** · ${totalIssues} issues this run · ledger: ${openF.length} open · ${verifyingF.length} awaiting verification · ${challengedF.length} challenged · ${Object.values(ledger.findings).filter((f) => f.status === 'complete').length} completed all-time.\n\n`;
md += `## Tools audited today\n\n| Score | Tool | Failing checks |\n|---|---|---|\n`;
for (const t of [...audited].sort((a, b) => a.score - b.score)) {
  const fails = t.checks.filter((c) => !c.pass);
  md += `| ${t.score}% | [${t.slug}](${t.url}) | ${fails.length ? fails.map((c) => `${c.check}${c.detail ? ` (${esc(c.detail)})` : ''}`).join('; ') : '✅ clean'} |\n`;
}
md += `\n## Open findings for Bot 2 (the Fixer)\n\n`;
if (openF.length === 0) md += `_None open._\n`;
else {
  md += `| Severity | Tool | Finding | Fixable | Detail |\n|---|---|---|---|---|\n`;
  for (const f of openF.sort((a, b) => sev[b.severity] - sev[a.severity]).slice(0, 60)) {
    md += `| ${f.severity} | ${f.tool} | ${f.check} | ${f.fixType.startsWith('auto:') ? '🤖 auto' : '✍️ manual'} | ${esc(f.detail)} |\n`;
  }
}
if (challengedF.length) {
  md += `\n## ⚠️ Challenged (fix attempted, still failing)\n\n`;
  for (const f of challengedF) md += `- **${f.tool}** — ${f.check}: ${esc(f.history?.slice(-1)[0]?.note || f.detail)}\n`;
}
await writeFile(new URL(`audits/reports/${today}.md`, ROOT), md);

// ── email-friendly HTML report ──
const eh = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const col = (s) => (s >= 90 ? '#16a34a' : s >= 75 ? '#ca8a04' : '#dc2626');
const trs = [...audited].sort((a, b) => a.score - b.score).map((t) => {
  const fails = t.checks.filter((c) => !c.pass);
  const detail = fails.length ? '<ul style="margin:4px 0 0;padding-left:16px;color:#b91c1c;font-size:12px">' + fails.map((c) => `<li>${eh(c.check)}${c.detail ? ` — ${eh(c.detail)}` : ''}</li>`).join('') + '</ul>' : '<span style="color:#16a34a">clean</span>';
  return `<tr><td style="padding:9px;border-bottom:1px solid #e5e7eb;vertical-align:top"><a href="${eh(t.url)}" style="color:#2563eb;text-decoration:none;font-weight:600">${eh(t.slug)}</a><div style="color:#64748b;font-size:12px">${t.status} · ${t.loadMs} ms</div></td><td style="padding:9px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:top"><span style="display:inline-block;padding:3px 8px;border-radius:8px;color:#fff;font-weight:700;background:${col(t.score)}">${t.score}%</span></td><td style="padding:9px;border-bottom:1px solid #e5e7eb;vertical-align:top">${detail}</td></tr>`;
}).join('');
const html = `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:#0f172a"><div style="max-width:780px;margin:0 auto;padding:22px"><h1 style="margin:0 0 4px;font-size:19px">🔍 LazyTools daily audit — ${today}</h1><p style="margin:0 0 14px;color:#475569">Avg <b style="color:${col(avg)}">${avg}%</b> across ${audited.length} tools · ${openF.length} open findings · ${verifyingF.length} awaiting verification · ${challengedF.length} challenged · ${Object.values(ledger.findings).filter((f) => f.status === 'complete').length} completed all-time.</p><table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden"><thead><tr style="background:#f1f5f9;text-align:left;font-size:12px;text-transform:uppercase;color:#64748b"><th style="padding:9px">Tool</th><th style="padding:9px;text-align:center">Score</th><th style="padding:9px">Findings (worst first)</th></tr></thead><tbody>${trs}</tbody></table><p style="margin:14px 0 0;color:#94a3b8;font-size:12px">Full ledger &amp; history in the repo under <code>audits/</code>. Fixer bot auto-resolves safe issues (build-gated) and logs the rest to <code>recommendations.md</code>. Automated — reply if a finding looks wrong.</p></div></body></html>`;
await writeFile(new URL('audit-report.html', ROOT), html);

console.log(`\n${subject}`);
if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `subject=${subject}\n`);
  await appendFile(process.env.GITHUB_OUTPUT, `report=audits/reports/${today}.md\n`);
}
