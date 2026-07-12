import { brine, airFryerConvert, roastTime } from '../src/lib/cooking.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-9)=>Math.abs(a-b)<=t*Math.abs(b)+1e-9;
// brine: 1000 g water, 5% salt → 50 g; 2% sugar → 20 g
{ const b=brine(1000,5,2)!; ok('brine salt 50g',b.saltG===50,b.saltG); ok('brine sugar 20g',b.sugarG===20); }
ok('brine 0 water → null', brine(0,5)===null);
// air fryer: 400°F, 30 min → 375°F, 24 min
{ const a=airFryerConvert(400,30); ok('air fryer 375°F',a.tempF===375); ok('air fryer 24 min',a.timeMin===24,a.timeMin); }
// roast: 12 lb turkey × 13 min/lb → 156 min
ok('roast 12lb×13 = 156', roastTime(12,13)===156, roastTime(12,13));
ok('roast with base', roastTime(4,20,15)===95);
ok('roast 0 → null', roastTime(0,20)===null);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
