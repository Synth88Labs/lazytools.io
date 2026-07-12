import { debtToIncome, inflationAdjust, npv, irr } from '../src/lib/finance-planning.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-3)=>Math.abs(a-b)<=t*Math.abs(b);
// DTI: housing 1500, other 500, income 6000 → front 25%, back 33.3%
{ const d=debtToIncome(1500,500,6000)!; ok('DTI front 25%',rel(d.front,25),d.front); ok('DTI back 33.33%',rel(d.back,33.333),d.back); }
ok('DTI income 0 → null', debtToIncome(1,1,0)===null);
// inflation: 1000 nominal, 3%/yr, 10yr → real ~744
{ const i=inflationAdjust(1000,3,10); ok('inflation real ~744',rel(i.real,744.09,1e-3),i.real); ok('loss ~25.6%',rel(i.lossPct,25.59,1e-2),i.lossPct); }
// NPV: -1000 then 5×300 at 8% → ~197.8
ok('NPV -1000 +5×300 @8% ≈ 197.8', rel(npv(8,[-1000,300,300,300,300,300]),197.81,2e-3), npv(8,[-1000,300,300,300,300,300]));
ok('NPV at 0% = sum', npv(0,[-1000,300,300,300,300,300])===500);
// IRR: -1000 then 5×300 → ~15.24%
ok('IRR -1000 +5×300 ≈ 15.24%', rel(irr([-1000,300,300,300,300,300])!,15.238,1e-3), irr([-1000,300,300,300,300,300]));
// NPV at IRR ≈ 0
{ const r=irr([-1000,300,300,300,300,300])!; ok('NPV at IRR ≈ 0', Math.abs(npv(r,[-1000,300,300,300,300,300]))<1e-2); }
ok('IRR all-positive → null', irr([100,100,100])===null);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
