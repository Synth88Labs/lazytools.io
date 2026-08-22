/**
 * Daily UX auditor. Rotates through every tool page (10/day by default) and runs
 * a headless-browser user-experience audit against the LIVE site: does the page
 * load, does the interactive tool hydrate, are there console errors or broken
 * images, is it labelled for accessibility, does it fit a phone screen, is it
 * fast. Writes audit-report.html and prints a summary; exits 0 so the workflow
 * always emails the result.
 *
 * Env: AUDIT_SITE (default https://lazytools.io), AUDIT_COUNT (default 10),
 *      AUDIT_OFFSET (override the rotation start; default = day-based).
 */
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { appendFile } from 'node:fs/promises';

const SITE = (process.env.AUDIT_SITE || 'https://lazytools.io').replace(/\/$/, '');
const COUNT = Math.max(1, Number(process.env.AUDIT_COUNT || 10));

const slugs = JSON.parse(await readFile(new URL('../api/tools-allowlist.json', import.meta.url), 'utf8'));
const N = slugs.length;
const dayIndex = Math.floor(Date.now() / 86400000);
const start = process.env.AUDIT_OFFSET !== undefined ? Number(process.env.AUDIT_OFFSET) % N : (dayIndex * COUNT) % N;
const todays = Array.from({ length: Math.min(COUNT, N) }, (_, i) => slugs[(start + i) % N]);

const chk = (name, pass, detail = '', weight = 1) => ({ name, pass: !!pass, detail: String(detail), weight });

const browser = await chromium.launch();
const results = [];

for (const slug of todays) {
  const url = `${SITE}/${slug}/`;
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, userAgent: 'LazyToolsUXAuditor/1.0 (+https://lazytools.io)' });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const pageErrors = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
  page.on('pageerror', (e) => pageErrors.push(String(e)));
  page.on('requestfailed', (r) => { const f = r.failure(); if (f && !/net::ERR_ABORTED/.test(f.errorText)) consoleErrors.push(`request failed: ${r.url()} (${f.errorText})`); });

  const checks = [];
  let status = 0, loadMs = 0;
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
      const brokenImgs = imgs.filter((i) => i.complete && i.naturalWidth === 0).length;
      const unlabelled = [...main.querySelectorAll('input:not([type=hidden]),select,textarea')].filter((el) => {
        const id = el.getAttribute('id');
        const forLabel = id && document.querySelector(`label[for="${CSS.escape(id)}"]`);
        const wrapped = el.closest('label');
        const aria = el.getAttribute('aria-label') || el.getAttribute('aria-labelledby') || el.getAttribute('placeholder') || el.getAttribute('title');
        return !(forLabel || wrapped || aria);
      }).length;
      const unnamedBtns = [...main.querySelectorAll('button')].filter((b) => !((b.textContent || '').trim() || b.getAttribute('aria-label') || b.getAttribute('title'))).length;
      const imgsNoAlt = imgs.filter((i) => i.getAttribute('alt') === null).length;
      return {
        title: (document.title || '').trim(),
        h1: (document.querySelector('h1')?.textContent || '').trim(),
        metaDesc: (document.querySelector('meta[name="description"]')?.getAttribute('content') || '').trim(),
        canonical: !!document.querySelector('link[rel="canonical"]'),
        controls: controls.length,
        brokenImgs, unlabelled, unnamedBtns, imgsNoAlt,
      };
    });

    // mobile horizontal-overflow check
    await page.setViewportSize({ width: 375, height: 812 });
    await page.waitForTimeout(400);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);

    checks.push(chk('Loads (HTTP 200)', status === 200, `status ${status}`, 3));
    checks.push(chk('No JS errors', consoleErrors.length === 0 && pageErrors.length === 0, [...pageErrors, ...consoleErrors].slice(0, 4).join('  |  '), 3));
    checks.push(chk('Interactive tool present', d.controls > 0, `${d.controls} controls`, 3));
    checks.push(chk('Has <title>', !!d.title, d.title.slice(0, 60)));
    checks.push(chk('Has <h1>', !!d.h1, d.h1.slice(0, 60)));
    checks.push(chk('Has meta description', !!d.metaDesc));
    checks.push(chk('Has canonical link', d.canonical));
    checks.push(chk('No broken images', d.brokenImgs === 0, `${d.brokenImgs} broken`, 2));
    checks.push(chk('Form fields labelled (a11y)', d.unlabelled === 0, `${d.unlabelled} unlabelled`, 2));
    checks.push(chk('Buttons have names (a11y)', d.unnamedBtns === 0, `${d.unnamedBtns} unnamed`, 2));
    checks.push(chk('Images have alt (a11y)', d.imgsNoAlt === 0, `${d.imgsNoAlt} missing alt`));
    checks.push(chk('No horizontal scroll on mobile', overflow <= 2, `${overflow}px overflow`, 2));
    checks.push(chk('Loads under 6s', loadMs > 0 && loadMs < 6000, `${loadMs} ms`));
  } catch (e) {
    checks.push(chk('Loads', false, String(e).slice(0, 200), 3));
  }
  await ctx.close();

  const totW = checks.reduce((a, c) => a + c.weight, 0) || 1;
  const gotW = checks.reduce((a, c) => a + (c.pass ? c.weight : 0), 0);
  const score = Math.round((gotW / totW) * 100);
  results.push({ slug, url, status, loadMs, score, checks });
  console.log(`  ${score.toString().padStart(3)}%  ${slug}  ${checks.filter((c) => !c.pass).map((c) => c.name).join(', ') || 'clean'}`);
}
await browser.close();

results.sort((a, b) => a.score - b.score);
const avg = Math.round(results.reduce((a, r) => a + r.score, 0) / results.length);
const issues = results.reduce((a, r) => a + r.checks.filter((c) => !c.pass).length, 0);
const failing = results.filter((r) => r.score < 100).length;
const today = new Date(dayIndex * 86400000).toISOString().slice(0, 10);
const subject = `LazyTools UX audit ${today} — avg ${avg}%, ${issues} issue${issues === 1 ? '' : 's'} across ${results.length} tools`;

// ---- HTML report ----
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const scoreColor = (s) => (s >= 100 ? '#16a34a' : s >= 80 ? '#ca8a04' : '#dc2626');
const rows = results.map((r) => {
  const fails = r.checks.filter((c) => !c.pass);
  const detail = fails.length
    ? '<ul style="margin:6px 0 0;padding-left:18px;color:#b91c1c">' + fails.map((c) => `<li><b>${esc(c.name)}</b>${c.detail ? ` — ${esc(c.detail)}` : ''}</li>`).join('') + '</ul>'
    : '<span style="color:#16a34a">All checks passed</span>';
  return `<tr>
    <td style="padding:10px;border-bottom:1px solid #e5e7eb;vertical-align:top">
      <a href="${esc(r.url)}" style="color:#2563eb;text-decoration:none;font-weight:600">${esc(r.slug)}</a>
      <div style="color:#64748b;font-size:12px">${r.status} · ${r.loadMs} ms</div>
    </td>
    <td style="padding:10px;border-bottom:1px solid #e5e7eb;text-align:center;vertical-align:top">
      <span style="display:inline-block;min-width:52px;padding:4px 8px;border-radius:8px;color:#fff;font-weight:700;background:${scoreColor(r.score)}">${r.score}%</span>
    </td>
    <td style="padding:10px;border-bottom:1px solid #e5e7eb;font-size:13px;vertical-align:top">${detail}</td>
  </tr>`;
}).join('');

const cycleDays = Math.ceil(N / COUNT);
const html = `<!doctype html><html><body style="margin:0;background:#f8fafc;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0f172a">
<div style="max-width:760px;margin:0 auto;padding:24px">
  <h1 style="margin:0 0 4px;font-size:20px">🔍 LazyTools daily UX audit</h1>
  <p style="margin:0 0 16px;color:#475569">${esc(today)} · audited ${results.length} of ${N} tools (rotation ${start}–${(start + results.length - 1) % N}; full cycle ~${cycleDays} days)</p>
  <div style="display:flex;gap:10px;margin-bottom:18px">
    <div style="flex:1;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px;text-align:center"><div style="font-size:24px;font-weight:800;color:${scoreColor(avg)}">${avg}%</div><div style="color:#64748b;font-size:12px">avg score</div></div>
    <div style="flex:1;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px;text-align:center"><div style="font-size:24px;font-weight:800">${failing}</div><div style="color:#64748b;font-size:12px">tools with issues</div></div>
    <div style="flex:1;background:#fff;border:1px solid #e5e7eb;border-radius:12px;padding:14px;text-align:center"><div style="font-size:24px;font-weight:800">${issues}</div><div style="color:#64748b;font-size:12px">total issues</div></div>
  </div>
  <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
    <thead><tr style="background:#f1f5f9;text-align:left;font-size:12px;text-transform:uppercase;color:#64748b">
      <th style="padding:10px">Tool</th><th style="padding:10px;text-align:center">Score</th><th style="padding:10px">Findings (worst first)</th>
    </tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <p style="margin:18px 0 0;color:#94a3b8;font-size:12px">Checks: HTTP 200, no JS/console errors, interactive tool hydrates, title/h1/meta/canonical, no broken images, form-field + button + image accessibility, no mobile horizontal scroll, load under 6s. Audited on the live site with headless Chromium (Playwright). Automated — reply if a finding looks wrong.</p>
</div></body></html>`;

await writeFile(new URL('../audit-report.html', import.meta.url), html);
console.log(`\n${subject}`);
console.log(`report: audit-report.html`);

if (process.env.GITHUB_OUTPUT) {
  await appendFile(process.env.GITHUB_OUTPUT, `subject=${subject}\n`);
}
