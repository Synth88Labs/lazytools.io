import { diceRoll, randomMac, luhnValid, luhnCheckDigit, generateTestCard } from '../src/lib/generate.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
// dice with rand=0 → all 1s
{ const d=diceRoll(3,6,()=>0); ok('dice 3x1 total 3', d.total===3&&d.rolls.length===3, d); }
{ const d=diceRoll(2,20,()=>0.999); ok('dice max ~20', d.rolls.every(r=>r<=20&&r>=1)); }
ok('dice clamps count', diceRoll(500,6,()=>0).rolls.length===100);
// luhn
ok('4111111111111111 valid', luhnValid('4111111111111111'));
ok('4111111111111112 invalid', !luhnValid('4111111111111112'));
ok('luhn check digit', luhnCheckDigit('411111111111111')===1, luhnCheckDigit('411111111111111'));
// generated card is Luhn-valid + right length + prefix
{ const c=generateTestCard('4',16,()=>0.5); ok('gen card length 16', c.length===16, c); ok('gen card prefix 4', c[0]==='4'); ok('gen card luhn valid', luhnValid(c), c); }
{ const c=generateTestCard('5555',16,()=>0.3); ok('gen MC prefix 5555', c.startsWith('5555')); ok('gen MC luhn', luhnValid(c)); }
// mac: locally-administered → first byte low nibble bit pattern (x2,x6,xA,xE)
{ const m=randomMac(()=>0,':',true); ok('mac localAdmin byte0=02', m.startsWith('02'), m); ok('mac 6 groups', m.split(':').length===6); }
{ const m=randomMac(()=>0,'-',false,true); ok('mac dash+upper', m.split('-').length===6&&m===m.toUpperCase()); }
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
