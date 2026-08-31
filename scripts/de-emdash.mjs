// One-off codemod: replace em/en dashes used as prose punctuation with commas
// (default) or a period + capital where the dash starts a new independent clause
// led by a pronoun/demonstrative. Numeric ranges become hyphens. Standalone
// placeholder dashes (e.g. value ?? '—', <option>—</option>) are left untouched.
import fs from 'node:fs';
import { execSync } from 'node:child_process';

const EM = '—', EN = '–';
const PERIOD = new Set(['it', 'this', 'these', 'those', 'they', 'you', 'we', 'there', 'here', 'i']);

// Every rule REQUIRES an actual em/en dash, so text without dashes is never
// touched (no global cleanups — those corrupted rgba()/spread syntax before).
export function deAsh(text) {
  let t = text;
  // 1. numeric range → hyphen (5–6, 45–75, 1990–2000)
  t = t.replace(/(\d)\s*[–—]\s*(\d)/g, '$1-$2');
  // 2. sentence/clause punctuation already before the dash → drop the dash, keep that punctuation
  t = t.replace(/([.!?;:])\s*[–—]\s+([A-Za-z])/g, (_, p, c) =>
    p + ' ' + (/[.!?]/.test(p) ? c.toUpperCase() : c));
  // 3. a comma already before the dash → keep a single comma
  t = t.replace(/,\s*[–—]\s+/g, ', ');
  // 4. spaced dash + following word → period+Capital (pronoun clause) or comma
  t = t.replace(/\s[–—]\s+([A-Za-z][A-Za-z']*)/g, (_, w) =>
    PERIOD.has(w.toLowerCase()) ? '. ' + w.charAt(0).toUpperCase() + w.slice(1) : ', ' + w);
  // 5. any remaining spaced dash (before a number/symbol) → comma
  t = t.replace(/\s[–—]\s+/g, ', ');
  // 6. word—word (letters both sides only, so 'value'/>—</option> placeholders are safe) → comma
  t = t.replace(/([A-Za-z])[–—]([A-Za-z])/g, '$1, $2');
  return t;
}

// ---- self-test on tricky inputs (run: node scripts/de-emdash.mjs --test) ----
if (process.argv.includes('--test')) {
  const cases = [
    ['real dimensions — overall diameter, sidewall', 'real dimensions, overall diameter, sidewall'],
    ['the following Sunday — so it starts', 'the following Sunday, so it starts'],
    ['uncovered — it adds a 53rd week', 'uncovered. It adds a 53rd week'],
    ['every 5–6 years', 'every 5-6 years'],
    ['ideal 45–75 chars', 'ideal 45-75 chars'],
    ['one mile (1,609 m)', 'one mile (1,609 m)'],           // must not touch 1,609
    ['e.g., kilograms', 'e.g., kilograms'],                  // must not touch e.g.,
    ["value ?? '—'", "value ?? '—'"],              // placeholder untouched
    ['<option>—</option>', '<option>—</option>'],  // placeholder untouched
    ['low—level detail', 'low, level detail'],
    ['Done — This is next', 'Done. This is next'],
    // regression: no-dash code must be byte-for-byte identical
    ['rgba(255,255,255,.85)', 'rgba(255,255,255,.85)'],
    ['rgba(0,0,0,.6)', 'rgba(0,0,0,.6)'],
    ['description,\n    ...(post.data.heroImage', 'description,\n    ...(post.data.heroImage'],
    ['const x = [1, , 2];', 'const x = [1, , 2];'],
    ['already, — appositive', 'already, appositive'],
    ['ends here. — Next line', 'ends here. Next line'],
  ];
  let pass = 0;
  for (const [inp, exp] of cases) {
    const got = deAsh(inp);
    const ok = got === exp;
    if (ok) pass++;
    console.log((ok ? 'PASS' : 'FAIL') + '  ' + JSON.stringify(inp) + '  ->  ' + JSON.stringify(got) + (ok ? '' : '   EXP ' + JSON.stringify(exp)));
  }
  console.log(`\n${pass}/${cases.length} passed`);
}

// ---- apply mode (run: node scripts/de-emdash.mjs --apply) ----
if (process.argv.includes('--apply')) {
  const files = execSync('git ls-files src/content src/data src/components src/pages', { encoding: 'utf8' })
    .trim().split('\n').filter((f) => /\.(md|ts|tsx|astro)$/.test(f));
  let changed = 0, dashesBefore = 0;
  for (const f of files) {
    const before = fs.readFileSync(f, 'utf8');
    dashesBefore += (before.match(/[–—]/g) || []).length;
    const after = deAsh(before);
    if (after !== before) { fs.writeFileSync(f, after); changed++; }
  }
  console.log(`applied to ${changed} files (of ${files.length}); ${dashesBefore} dashes processed`);
}
