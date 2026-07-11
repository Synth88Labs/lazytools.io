import { VOLUME_ML, INGREDIENTS, getIngredient, butterConvert, fToC, cToF, yeastConvert, YEAST } from '../src/lib/cooking.ts';

let pass = 0, fail = 0;
const approx = (a: number, b: number, tol = 0.5) => Math.abs(a - b) <= tol;
function ok(name: string, cond: boolean) { if (cond) { pass++; } else { fail++; console.error('FAIL:', name); } }

// Volume relationships
ok('3 US tsp = 1 US tbsp', approx(VOLUME_ML.us_tsp * 3, VOLUME_ML.us_tbsp, 0.001));
ok('16 US tbsp = 1 US cup', approx(VOLUME_ML.us_tbsp * 16, VOLUME_ML.us_cup, 0.001));
ok('1 US cup = 236.6 mL', approx(VOLUME_ML.us_cup, 236.588, 0.01));
ok('metric cup = 250 mL', VOLUME_ML.metric_cup === 250);
ok('AU tbsp = 20 mL', VOLUME_ML.au_tbsp === 20);
ok('US gallon ≠ imperial gallon', VOLUME_ML.us_gallon < VOLUME_ML.imp_gallon);
ok('imperial gallon ≈ 4546 mL', approx(VOLUME_ML.imp_gallon, 4546.09, 0.1));

// Ingredient densities (King Arthur)
ok('AP flour = 120 g/cup', getIngredient('flour-ap')!.gPerCup === 120);
ok('granulated sugar = 198 g/cup', getIngredient('sugar-granulated')!.gPerCup === 198);
ok('butter = 226 g/cup (2 sticks)', getIngredient('butter')!.gPerCup === 226);
ok('Diamond kosher salt < Morton kosher salt', getIngredient('salt-kosher-diamond')!.gPerCup < getIngredient('salt-kosher-morton')!.gPerCup);
ok('all ingredient ids unique', new Set(INGREDIENTS.map((i) => i.id)).size === INGREDIENTS.length);

// Butter: 1 cup butter = 226 g = 2 sticks = 16 tbsp
const b = butterConvert(1, 'cup');
ok('1 cup butter = 226 g', approx(b.grams, 226, 0.5));
ok('1 cup butter = 2 sticks', approx(b.sticks, 2, 0.01));
ok('1 cup butter = 16 tbsp', approx(b.tbsp, 16, 0.01));
const b2 = butterConvert(1, 'stick');
ok('1 stick = 113 g', approx(b2.grams, 113, 0.5));
ok('1 stick = 8 tbsp', approx(b2.tbsp, 8, 0.01));

// Temperature
ok('350 F = 176.7 C', approx(fToC(350), 176.67, 0.1));
ok('180 C = 356 F', approx(cToF(180), 356, 0.1));
ok('212 F = 100 C', approx(fToC(212), 100, 0.001));
ok('round trip F->C->F', approx(cToF(fToC(400)), 400, 0.001));

// Yeast: 1 packet = 7 g active dry; active dry == instant (1:1); fresh = 2.5x
const y = yeastConvert(7, 'active-dry');
ok('7 g active dry = 7 g instant (1:1)', approx(y.instant, 7, 0.01));
ok('7 g active dry = 17.5 g fresh (2.5x)', approx(y.fresh, 17.5, 0.01));
ok('packet = 7 g', YEAST.packetGrams === 7);
const yf = yeastConvert(17.5, 'fresh');
ok('17.5 g fresh -> 7 g active dry', approx(yf.activeDry, 7, 0.01));

console.log(`\n${pass} passed, ${fail} failed`);
if (fail > 0) process.exit(1);
