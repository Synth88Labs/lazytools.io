import { jsonToSql, csvToSql, listToInClause, parseCsv } from '../src/lib/sql-gen.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- parseCsv ----
ok('csv basic', JSON.stringify(parseCsv('a,b\n1,2')) === JSON.stringify([['a', 'b'], ['1', '2']]));
ok('csv quoted comma', JSON.stringify(parseCsv('a,b\n"x,y",2')) === JSON.stringify([['a', 'b'], ['x,y', '2']]));
ok('csv escaped quote', JSON.stringify(parseCsv('a\n"she said ""hi"""')) === JSON.stringify([['a'], ['she said "hi"']]));
ok('csv quoted newline', JSON.stringify(parseCsv('a\n"line1\nline2"')) === JSON.stringify([['a'], ['line1\nline2']]));

// ---- jsonToSql ----
const j1 = jsonToSql('[{"id":1,"name":"Ada"},{"id":2,"name":"Bo"}]', { table: 'users' });
ok('json multirow header', j1.output.startsWith('INSERT INTO users (id, name) VALUES'));
ok('json string escaped + number literal', j1.output.includes("(1, 'Ada')") && j1.output.includes("(2, 'Bo')"));
ok('json rows count', j1.rows === 2);
const j2 = jsonToSql('[{"a":true,"b":null,"c":3.5}]', { table: 't' });
ok('json bool→TRUE, null→NULL, float literal', j2.output.includes('(TRUE, NULL, 3.5)'));
const j3 = jsonToSql('{"n":"O\'Brien"}', { table: 't' });
ok('json single object + quote escaping', j3.output.includes("('O''Brien')"));
const j4 = jsonToSql('[{"id":1}]', { table: 'x', multiRow: false });
ok('json one-statement-per-row mode', j4.output === 'INSERT INTO x (id) VALUES (1);');
let jThrew = false; try { jsonToSql('[1,2,3]', {}); } catch { jThrew = true; }
ok('json rejects array of non-objects', jThrew);

// ---- csvToSql ----
const c1 = csvToSql('id,name,active\n1,Ada,true\n2,"Bo, Jr",false', { table: 'people' });
ok('csv header cols', c1.output.startsWith('INSERT INTO people (id, name, active) VALUES'));
ok('csv numeric literal + quoted string + bool', c1.output.includes("(1, 'Ada', TRUE)") && c1.output.includes("(2, 'Bo, Jr', FALSE)"));
ok('csv rows count', c1.rows === 2);
const c2 = csvToSql('a,b\n1,\n2,x', { table: 't' });
ok('csv empty → NULL by default', c2.output.includes('(1, NULL)'));
let cThrew = false; try { csvToSql('onlyheader', {}); } catch { cThrew = true; }
ok('csv rejects header-only', cThrew);

// ---- listToInClause ----
const l1 = listToInClause('apple\nbanana\ncherry');
ok('in-clause strings quoted', l1.output === "('apple', 'banana', 'cherry')");
const l2 = listToInClause('1, 2, 3');
ok('in-clause numbers unquoted (auto)', l2.output === '(1, 2, 3)');
const l3 = listToInClause('1\n2', { quote: 'always' });
ok('in-clause force quote', l3.output === "('1', '2')");
ok('in-clause count', listToInClause('a,b,c').count === 3);
let lThrew = false; try { listToInClause('  \n  '); } catch { lThrew = true; }
ok('in-clause rejects empty', lThrew);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
