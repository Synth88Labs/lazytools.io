import { molality, massPercent, osmoticPressure, molarMass } from '../src/lib/chemistry.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-3)=>Math.abs(a-b)<=t*Math.abs(b);
// molality: 1 mol in 0.5 kg = 2 mol/kg
ok('molality 1mol/0.5kg=2', molality(1,0.5)===2);
ok('molality 0 solvent → NaN', Number.isNaN(molality(1,0)));
// mass percent: 10 g in 200 g = 5%
ok('massPercent 10/200=5', massPercent(10,200)===5);
// osmotic pressure: i=1, M=1, T=273.15 → ~22.41 atm
ok('osmotic 1M 0°C ≈ 22.41 atm', rel(osmoticPressure(1,1,273.15),22.41,2e-3), osmoticPressure(1,1,273.15));
// i=2 (NaCl) M=0.1 T=298.15 → ~4.89 atm
ok('osmotic NaCl 0.1M 25°C ≈ 4.89', rel(osmoticPressure(2,0.1,298.15),4.89,5e-3), osmoticPressure(2,0.1,298.15));
// molar mass NaCl ≈ 58.44 (reused parser)
ok('molarMass NaCl ≈ 58.44', rel(molarMass('NaCl').molarMass,58.44,1e-3), molarMass('NaCl').molarMass);
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
