import { rgbToHsv, hsvToRgb } from '../src/lib/color-compute.ts';
import { deltaE76, deltaE2000, kelvinToRgb, rgbToLab } from '../src/lib/color-advanced.ts';
let pass=0,fail=0; const ok=(n:string,c:boolean,g?:unknown)=>{c?pass++:(fail++,console.error(`FAIL: ${n}`+(g!==undefined?` (${JSON.stringify(g)})`:'')));};
const rel=(a:number,b:number,t=1e-3)=>Math.abs(a-b)<=t*Math.abs(b)+1e-4;
// HSV: red (255,0,0) → h0 s100 v100
{ const h=rgbToHsv({r:255,g:0,b:0}); ok('red HSV 0/100/100', h.h===0&&h.s===100&&h.v===100, h); }
{ const h=rgbToHsv({r:128,g:128,b:128}); ok('gray s=0', h.s===0&&rel(h.v,50.196,1e-2), h); }
// round trip
{ const rgb=hsvToRgb(210,50,80); const h=rgbToHsv(rgb); ok('HSV round-trip h', rel(h.h,210,1e-2)); ok('HSV round-trip', Math.abs(h.s-50)<1&&Math.abs(h.v-80)<1, h); }
ok('hsvToRgb red', JSON.stringify(hsvToRgb(0,100,100))==='{"r":255,"g":0,"b":0}');
// CIEDE2000 anchor (Sharma test data): Lab1=(50,2.6772,-79.7751), Lab2=(50,0,-82.7485) → 2.0425
ok('ΔE2000 anchor1 ≈ 2.0425', rel(deltaE2000({L:50,a:2.6772,b:-79.7751},{L:50,a:0,b:-82.7485}),2.0425,1e-3), deltaE2000({L:50,a:2.6772,b:-79.7751},{L:50,a:0,b:-82.7485}));
// anchor2: (50,3.1571,-77.2803),(50,0,-82.7485) → 2.8615
ok('ΔE2000 anchor2 ≈ 2.8615', rel(deltaE2000({L:50,a:3.1571,b:-77.2803},{L:50,a:0,b:-82.7485}),2.8615,1e-3), deltaE2000({L:50,a:3.1571,b:-77.2803},{L:50,a:0,b:-82.7485}));
// anchor3: (50,-1.3802,-84.2814),(50,0,-82.7485) → 1.0000
ok('ΔE2000 anchor3 ≈ 1.0000', rel(deltaE2000({L:50,a:-1.3802,b:-84.2814},{L:50,a:0,b:-82.7485}),1.0000,1e-3), deltaE2000({L:50,a:-1.3802,b:-84.2814},{L:50,a:0,b:-82.7485}));
// identical → 0
ok('ΔE2000 identical = 0', deltaE2000({L:50,a:10,b:10},{L:50,a:10,b:10})===0);
// ΔE76 simple
ok('ΔE76 = 5', deltaE76({L:50,a:0,b:0},{L:53,a:4,b:0})===5);
// kelvin: 6500K ≈ white-ish (high all channels)
{ const k=kelvinToRgb(6500); ok('6500K near white', k.r>240&&k.g>240&&k.b>240, k); }
{ const k=kelvinToRgb(2000); ok('2000K warm (r>b)', k.r>k.b, k); }
console.log(`\n${pass} passed, ${fail} failed`); if(fail)process.exit(1);
