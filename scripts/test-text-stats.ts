import { textStats } from '../src/lib/text-stats.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const eq = (name: string, a: unknown, b: unknown) => ok(name, JSON.stringify(a) === JSON.stringify(b));

eq('empty', textStats(''), { words: 0, chars: 0, charsNoSpaces: 0, lines: 0, readingMinutes: 0 });
eq('single word', textStats('hello'), { words: 1, chars: 5, charsNoSpaces: 5, lines: 1, readingMinutes: 1 });
const s = textStats('the quick brown fox');
ok('words 4', s.words === 4);
ok('chars 19', s.chars === 19);
ok('charsNoSpaces 16', s.charsNoSpaces === 16);
ok('lines 1', s.lines === 1);
const ml = textStats('line one\nline two\nline three');
ok('lines 3', ml.lines === 3);
ok('words 6', ml.words === 6);
ok('crlf counts as one line break', textStats('a\r\nb').lines === 2);
ok('leading/trailing spaces ignored for words', textStats('   hi   there   ').words === 2);
ok('reading time ~1min for short', textStats('a b c').readingMinutes === 1);
ok('reading time scales', textStats(Array(450).fill('w').join(' ')).readingMinutes === 3);
ok('whitespace-only is zero words', textStats('   \n  \t ').words === 0);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
