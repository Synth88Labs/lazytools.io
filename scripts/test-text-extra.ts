import { integerToWords, numberToWords, amountToWords, upsideDown, pickLines } from '../src/lib/text-compute.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
ok('0 = zero', integerToWords(0)==='zero');
ok('21 = twenty-one', integerToWords(21)==='twenty-one', integerToWords(21));
ok('100 = one hundred', integerToWords(100)==='one hundred');
ok('1234', integerToWords(1234)==='one thousand two hundred thirty-four', integerToWords(1234));
ok('1000000 = one million', integerToWords(1000000)==='one million');
ok('999999 words', integerToWords(999999)==='nine hundred ninety-nine thousand nine hundred ninety-nine', integerToWords(999999));
ok('numberToWords -12.5', numberToWords(-12.5)==='negative twelve point five', numberToWords(-12.5));
ok('amount 1234.5', amountToWords(1234.5)==='One thousand two hundred thirty-four and 50/100', amountToWords(1234.5));
ok('amount 0.99', amountToWords(0.99)==='Zero and 99/100', amountToWords(0.99));
// upside down: reversible-ish; "hi" → flip h,i reverse → "ᴉɥ"
ok('upsideDown hi', upsideDown('hi')==='ᴉɥ', upsideDown('hi'));
ok('upsideDown length', upsideDown('hello').length>=5);
// pickLines deterministic with fixed rand
{ const r=()=>0; const p=pickLines(['a','b','c'],2,true,r); ok('pickLines unique count 2', p.length===2, p); }
{ const p=pickLines(['a','b','c'],5,false,()=>0); ok('pickLines repeat 5', p.length===5&&p.every(x=>x==='a')); }
ok('pickLines empty', pickLines(['','  '],2,true).length===0);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
