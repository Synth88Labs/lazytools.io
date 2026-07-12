import { titrationConc, raoults } from '../src/lib/chemistry.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-6)=>Math.abs(a-b)<=t*Math.abs(b)+1e-9;
// 1:1 acid-base: 0.1 M acid, 25 mL titrates 20 mL base → base = 0.1*25/20 = 0.125 M
ok('titration 1:1 = 0.125 M', rel(titrationConc(0.1,25,20)!,0.125), titrationConc(0.1,25,20));
// 1:2 ratio (e.g. H2SO4 vs NaOH): moleRatio 2 → 0.1*25*2/20 = 0.25
ok('titration ratio 2 = 0.25', rel(titrationConc(0.1,25,20,2)!,0.25));
ok('titration vUnknown 0 → null', titrationConc(0.1,25,0)===null);
// Raoult: pPure 100, xSolvent 0.8 → pSolution 80, lowering 20
{ const r=raoults(100,0.8); ok('raoult pSolution 80', r.pSolution===80); ok('raoult lowering 20', r.lowering===20); }
ok('raoult pure solvent x=1', raoults(100,1).pSolution===100);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
