import { growingDegreeDays, pondVolume, sprayMix } from '../src/lib/garden.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-3)=>Math.abs(a-b)<=t*Math.abs(b)+1e-9;
// GDD: tMax 30, tMin 10, base 10 → avg 20 − 10 = 10
ok('GDD 30/10 base10 = 10', growingDegreeDays(30,10,10)===10);
// with cap 30: tMax 35 capped to 30 → avg (30+10)/2=20 −10 =10
ok('GDD cap 30', growingDegreeDays(35,10,10,30)===10);
// below base → 0
ok('GDD below base = 0', growingDegreeDays(8,4,10)===0);
// pond: 3×2×0.5 = 3 m³ = 3000 L, 792.5 gal
{ const p=pondVolume(3,2,0.5)!; ok('pond 3000 L',rel(p.litres,3000),p.litres); ok('pond ~792.5 gal',rel(p.gallons,792.5,1e-3),p.gallons);
  ok('liner length 3+1+0.6=4.6',rel(p.linerLength,4.6),p.linerLength); }
ok('pond bad → null', pondVolume(0,2,0.5)===null);
// spray: 5 gal × 2 oz/gal = 10 oz
ok('spray 10 oz', sprayMix(5,2)===10);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
