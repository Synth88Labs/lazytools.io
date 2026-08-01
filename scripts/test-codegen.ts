import { jsonToPython, jsonToRust, jsonToCsharp } from '../src/lib/json-codegen.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean) { if (cond) pass++; else { fail++; console.error('FAIL:', name); } }

const SAMPLE = '{"id":42,"user_name":"ada","ratio":1.5,"is_active":true,"scores":[10,20],"profile":{"city":"London"},"nada":null}';

// ---- Python dataclasses ----
const py = jsonToPython(SAMPLE).output;
ok('py header dataclass import', py.includes('from dataclasses import dataclass'));
ok('py Root class', py.includes('@dataclass\nclass Root:'));
ok('py int field', py.includes('    id: int'));
ok('py float field', py.includes('    ratio: float'));
ok('py bool field', py.includes('    is_active: bool'));
ok('py list field', py.includes('    scores: List[int]'));
ok('py nested class ref', py.includes('    profile: Profile'));
ok('py Profile defined before Root (deepest first)', py.indexOf('class Profile') < py.indexOf('class Root'));
ok('py null → Optional', py.includes('nada: Optional[Any]'));

// ---- Rust serde ----
const rs = jsonToRust(SAMPLE).output;
ok('rust serde use', rs.includes('use serde::{Deserialize, Serialize};'));
ok('rust derive', rs.includes('#[derive(Serialize, Deserialize)]'));
ok('rust struct Root', rs.includes('struct Root {'));
ok('rust i64', rs.includes('id: i64,'));
ok('rust f64', rs.includes('ratio: f64,'));
ok('rust String', rs.includes('user_name: String,'));
ok('rust Vec', rs.includes('scores: Vec<i64>,'));
ok('rust nested', rs.includes('profile: Profile,'));

// rename attribute when key isn't snake_case
const rs2 = jsonToRust('{"userName":"x"}').output;
ok('rust rename attr for camelCase key', rs2.includes('#[serde(rename = "userName")]') && rs2.includes('user_name: String,'));

// ---- C# ----
const cs = jsonToCsharp(SAMPLE).output;
ok('csharp using', cs.includes('using System.Text.Json.Serialization;'));
ok('csharp class Root', cs.includes('public class Root'));
ok('csharp int prop', cs.includes('public int Id { get; set; }'));
ok('csharp double prop', cs.includes('public double Ratio { get; set; }'));
ok('csharp bool prop', cs.includes('public bool IsActive { get; set; }'));
ok('csharp List prop', cs.includes('public List<int> Scores { get; set; }'));
ok('csharp nested class', cs.includes('public Profile Profile { get; set; }') && cs.includes('public class Profile'));
ok('csharp JsonPropertyName for snake_case', cs.includes('[JsonPropertyName("user_name")]') && cs.includes('public string UserName'));

// ---- error handling ----
let threw = false; try { jsonToPython('{bad'); } catch { threw = true; }
ok('python rejects bad json', threw);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
