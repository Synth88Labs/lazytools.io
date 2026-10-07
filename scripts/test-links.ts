import { driveLinks, dropboxLinks, githubRaw, cleanUrl } from '../src/lib/links-compute.ts';

let pass = 0, fail = 0;
const ok = (name: string, cond: boolean, got?: unknown) => { if (cond) { pass++; } else { fail++; console.log('FAIL:', name, '· got:', got); } };

// --- Drive ---
const ID = '1A2b3C4d5E6f7G8h9I0jKlMnOpQrStUvWx';
const sheet = driveLinks(`https://docs.google.com/spreadsheets/d/${ID}/edit#gid=0`)!;
ok('sheets type', sheet.type === 'sheets', sheet.type);
ok('sheets xlsx', sheet.links!.some((l) => l.url === `https://docs.google.com/spreadsheets/d/${ID}/export?format=xlsx`));
ok('sheets csv+pdf', sheet.links!.length === 3);
const doc = driveLinks(`https://docs.google.com/document/d/${ID}/edit`)!;
ok('docs docx', doc.links!.some((l) => l.url.endsWith('/export?format=docx')));
const slide = driveLinks(`https://docs.google.com/presentation/d/${ID}/edit`)!;
ok('slides pptx', slide.links!.some((l) => l.url.endsWith('/export?format=pptx')));
const file1 = driveLinks(`https://drive.google.com/file/d/${ID}/view?usp=sharing`)!;
ok('file type', file1.type === 'file', file1.type);
ok('file uc download', file1.links![0].url === `https://drive.google.com/uc?export=download&id=${ID}`);
const file2 = driveLinks(`https://drive.google.com/open?id=${ID}`)!;
ok('file id= param', file2.id === ID, file2.id);
ok('drive empty→null', driveLinks('') === null);
ok('drive garbage→error', !!driveLinks('hello world')!.error);

// --- Dropbox ---
const dbx = dropboxLinks('https://www.dropbox.com/s/abc123/file.pdf?dl=0')!;
ok('dbx dl=1', dbx.download === 'https://www.dropbox.com/s/abc123/file.pdf?dl=1', dbx.download);
ok('dbx raw host', dbx.raw!.startsWith('https://dl.dropboxusercontent.com/s/abc123/file.pdf'), dbx.raw);
const scl = dropboxLinks('https://www.dropbox.com/scl/fi/xxx/file.jpg?rlkey=KEY&dl=0')!;
ok('scl keeps rlkey', scl.download!.includes('rlkey=KEY') && scl.download!.includes('dl=1'), scl.download);
ok('dbx non-dropbox→error', !!dropboxLinks('https://example.com/x')!.error);

// --- GitHub raw ---
const gh = githubRaw('https://github.com/Synth88Labs/lazytools.io/blob/main/README.md')!;
ok('gh blob→raw', gh.raw === 'https://raw.githubusercontent.com/Synth88Labs/lazytools.io/main/README.md', gh.raw);
const gh2 = githubRaw('https://github.com/user/repo/blob/feature/x/src/a.ts')!;
ok('gh nested path', gh2.raw === 'https://raw.githubusercontent.com/user/repo/feature/x/src/a.ts', gh2.raw);
ok('gh already-raw passthrough', githubRaw('https://raw.githubusercontent.com/u/r/main/f.txt')!.raw === 'https://raw.githubusercontent.com/u/r/main/f.txt');
ok('gh repo-root→error', !!githubRaw('https://github.com/user/repo')!.error);
ok('gh non-github→error', !!githubRaw('https://example.com/x')!.error);

// --- URL clean ---
const c1 = cleanUrl('https://example.com/p?id=42&utm_source=fb&utm_medium=cpc&fbclid=XYZ')!;
ok('clean keeps id', c1.cleaned === 'https://example.com/p?id=42', c1.cleaned);
ok('clean lists removed', c1.removed!.length === 3 && c1.removed!.includes('fbclid'), c1.removed);
const c2 = cleanUrl('https://example.com/p?gclid=1&q=hello#sec')!;
ok('clean keeps q + fragment', c2.cleaned === 'https://example.com/p?q=hello#sec', c2.cleaned);
const c3 = cleanUrl('https://example.com/clean')!;
ok('clean no-trackers unchanged', c3.cleaned === 'https://example.com/clean' && c3.removed!.length === 0);

console.log(`\nlinks-compute: ${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
