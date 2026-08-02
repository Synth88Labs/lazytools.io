import {
  parseIni, stringifyIni, parseEnv, stringifyEnv,
  parseProperties, stringifyProperties, requireObject,
} from '../src/lib/config-formats.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }
const eq = (name: string, a: unknown, b: unknown) => ok(name, JSON.stringify(a) === JSON.stringify(b));

// ---- INI ----
const ini = `; comment
title = LazyTools
[owner]
name = Ada
age = 30   ; inline comment
[server]
host = "localhost"
port = 8080`;
const iniObj = parseIni(ini);
eq('ini root scalar', iniObj.title, 'LazyTools');
eq('ini section owner.name', (iniObj.owner as any).name, 'Ada');
eq('ini inline comment stripped', (iniObj.owner as any).age, '30');
eq('ini quoted value', (iniObj.server as any).host, 'localhost');
eq('ini port', (iniObj.server as any).port, '8080');
// round-trip
const iniBack = parseIni(stringifyIni(iniObj));
eq('ini round-trip', iniBack, iniObj);
ok('ini stringify has section header', stringifyIni(iniObj).includes('[owner]'));

// ---- .env ----
const env = `# db config
export DB_HOST=localhost
DB_PORT=5432
GREETING="hello world"
LITERAL='no $expand'
EMPTY=
URL=https://example.com/path # trailing comment`;
const envObj = parseEnv(env);
eq('env export prefix', envObj.DB_HOST, 'localhost');
eq('env plain', envObj.DB_PORT, '5432');
eq('env double-quoted spaces', envObj.GREETING, 'hello world');
eq('env single-quoted literal', envObj.LITERAL, 'no $expand');
eq('env empty', envObj.EMPTY, '');
eq('env inline comment stripped', envObj.URL, 'https://example.com/path');
// escaped newline in double quotes
eq('env escaped newline', parseEnv('K="a\\nb"').K, 'a\nb');
// stringify quotes values with spaces
ok('env stringify quotes spaces', stringifyEnv({ X: 'a b' }).includes('X="a b"'));
ok('env stringify bare when safe', stringifyEnv({ X: 'abc' }).trim() === 'X=abc');
eq('env round-trip', parseEnv(stringifyEnv(envObj)), envObj);

// ---- .properties ----
const props = `# a comment
! also a comment
server.host = localhost
server.port : 8080
greeting = Hello, \\
           World
path=C:\\\\temp
key\\ with\\ spaces = value
unicode = caf\\u00e9`;
const p = parseProperties(props);
eq('props dotted key', p['server.host'], 'localhost');
eq('props colon separator', p['server.port'], '8080');
eq('props line continuation', p.greeting, 'Hello, World');
eq('props backslash path', p.path, 'C:\\temp');
eq('props escaped spaces in key', p['key with spaces'], 'value');
eq('props unicode escape', p.unicode, 'café');
// whitespace separator
eq('props whitespace sep', parseProperties('foo bar').foo, 'bar');
// round-trip (values only, keys re-escaped)
const pRound = parseProperties(stringifyProperties(p));
eq('props round-trip', pRound, p);

// requireObject guard
let threw = false;
try { requireObject([1, 2], 'INI'); } catch { threw = true; }
ok('requireObject rejects array', threw);
ok('requireObject accepts object', requireObject({ a: 1 }, 'INI').a === 1);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
