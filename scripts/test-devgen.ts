import { jsonToSchema } from '../src/lib/json-schema-gen.ts';
import { jsonToGo } from '../src/lib/json-codegen.ts';
import { parseCurl, curlToCode, shellTokenize } from '../src/lib/curl-parse.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

// ---- JSON Schema ----
const s1 = JSON.parse(jsonToSchema('{"name":"Ada","age":36,"admin":true}'));
ok('schema draft-07 header', s1.$schema === 'http://json-schema.org/draft-07/schema#');
ok('schema object type', s1.type === 'object');
ok('schema integer inference', s1.properties.age.type === 'integer');
ok('schema string inference', s1.properties.name.type === 'string');
ok('schema boolean inference', s1.properties.admin.type === 'boolean');
ok('schema required all keys', JSON.stringify(s1.required) === JSON.stringify(['name', 'age', 'admin']));
const s2 = JSON.parse(jsonToSchema('{"tags":["a","b"],"score":1.5}'));
ok('schema array items', s2.properties.tags.type === 'array' && s2.properties.tags.items.type === 'string');
ok('schema float → number', s2.properties.score.type === 'number');
// array of objects with a missing key → required only for the always-present key
const s3 = JSON.parse(jsonToSchema('[{"id":1,"x":2},{"id":3}]'));
ok('schema array-of-objects merges', s3.type === 'array' && s3.items.type === 'object');
ok('schema required only common key', JSON.stringify(s3.items.required) === JSON.stringify(['id']));
let threwS = false; try { jsonToSchema('{bad'); } catch { threwS = true; }
ok('schema rejects bad json', threwS);

// ---- JSON → Go ----
const g1 = jsonToGo('{"user_name":"Ada","age":36,"scores":[1,2]}');
ok('go type Root struct', g1.output.includes('type Root struct'));
ok('go pascal field + tag', g1.output.includes('UserName string `json:"user_name"`'));
ok('go int type', g1.output.includes('Age int `json:"age"`'));
ok('go slice type', g1.output.includes('Scores []int `json:"scores"`'));
const g2 = jsonToGo('{"profile":{"city":"NYC"}}');
ok('go nested struct emitted', g2.output.includes('type Profile struct') && g2.output.includes('Profile Profile `json:"profile"`'));
ok('go 2 structs', g2.count === 2);
const g3 = jsonToGo('{"ratio":1.5,"ok":true,"nada":null}');
ok('go float64', g3.output.includes('Ratio float64 `json:"ratio"`'));
ok('go bool', g3.output.includes('Ok bool `json:"ok"`'));
ok('go null → interface{}', g3.output.includes('Nada interface{} `json:"nada"`'));

// ---- curl ----
ok('tokenize quotes', JSON.stringify(shellTokenize(`curl -H "A: b c" 'x y'`)) === JSON.stringify(['curl', '-H', 'A: b c', 'x y']));
const p1 = parseCurl(`curl https://api.example.com/users`);
ok('curl default GET', p1.method === 'GET' && p1.url === 'https://api.example.com/users' && p1.body === null);
const p2 = parseCurl(`curl -X POST https://api.example.com/login -H "Content-Type: application/json" -d '{"u":"a"}'`);
ok('curl POST method', p2.method === 'POST');
ok('curl header parsed', p2.headers['Content-Type'] === 'application/json');
ok('curl body parsed', p2.body === '{"u":"a"}');
const p3 = parseCurl(`curl https://x.test -d name=ada -d age=36`);
ok('curl implicit POST from data', p3.method === 'POST');
ok('curl multiple -d joined', p3.body === 'name=ada&age=36');
ok('curl default content-type', p3.headers['Content-Type'] === 'application/x-www-form-urlencoded');
const p4 = parseCurl(`curl --url https://y.test -u user:pass`);
ok('curl --url + basic auth', p4.url === 'https://y.test' && p4.headers['Authorization'].startsWith('Basic '));
const code = curlToCode(`curl -X POST https://api.example.com -H "Accept: application/json" -d 'hi'`);
ok('curlToCode emits fetch', code.startsWith('fetch("https://api.example.com"') && code.includes('method: "POST"') && code.includes('body: "hi"'));
let threwC = false; try { parseCurl('wget https://x'); } catch { threwC = true; }
ok('curl rejects non-curl', threwC);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
