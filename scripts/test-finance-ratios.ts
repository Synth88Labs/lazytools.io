/**
 * Node test for src/lib/finance-ratios.ts — run:
 *   node --experimental-strip-types scripts/test-finance-ratios.ts
 */
import {
  liquidityRatios, leverageRatios, coverageRatios, profitabilityRatios,
  efficiencyRatios, valuationRatios,
} from '../src/lib/finance-ratios.ts';

let pass = 0, fail = 0;
function ok(name: string, cond: boolean, got?: unknown) {
  if (cond) { pass++; } else { fail++; console.error(`FAIL: ${name}` + (got !== undefined ? ` (got ${got})` : '')); }
}
const near = (a: number, b: number, tol = 1e-6) => Math.abs(a - b) <= tol;
const get = (arr: { key: string; value: number | null; verdict: string }[], k: string) => arr.find((r) => r.key === k)!;

// --- Liquidity: CA=150, Inv=60, Cash=30, CL=100
const L = liquidityRatios({ currentAssets: 150000, inventory: 60000, cash: 30000, currentLiabilities: 100000 });
ok('current ratio 1.5', near(get(L, 'current').value!, 1.5), get(L, 'current').value);
ok('current verdict good', get(L, 'current').verdict === 'good');
ok('quick ratio 0.9', near(get(L, 'quick').value!, 0.9));
ok('quick verdict poor (<0.8? no, 0.9 → ok)', get(L, 'quick').verdict === 'ok');
ok('cash ratio 0.3', near(get(L, 'cash').value!, 0.3));
ok('nwc 50000', near(get(L, 'nwc').value!, 50000));
// concern case: CA<CL
const L2 = liquidityRatios({ currentAssets: 80000, inventory: 40000, cash: 10000, currentLiabilities: 100000 });
ok('current <1 poor', get(L2, 'current').verdict === 'poor');
ok('nwc negative poor', get(L2, 'nwc').verdict === 'poor');

// --- Leverage: debt=200, equity=100, assets=300
const Lv = leverageRatios({ totalDebt: 200000, totalEquity: 100000, totalAssets: 300000 });
ok('D/E 2.0', near(get(Lv, 'de').value!, 2.0));
ok('D/E ≤2 ok', get(Lv, 'de').verdict === 'ok');
ok('debt ratio 0.667', near(get(Lv, 'debtratio').value!, 200000 / 300000, 1e-9));
ok('debt ratio >0.6 poor', get(Lv, 'debtratio').verdict === 'poor');
ok('equity multiplier 3.0', near(get(Lv, 'em').value!, 3.0));
ok('debt-to-cap 0.667', near(get(Lv, 'debtcap').value!, 200000 / 300000, 1e-9));
// conservative case
const Lv2 = leverageRatios({ totalDebt: 30000, totalEquity: 100000, totalAssets: 130000 });
ok('D/E 0.3 good', get(Lv2, 'de').verdict === 'good');

// --- Coverage: EBIT=50, interest=10 → ICR=5; NOI=60, service=40 → DSCR=1.5
const C = coverageRatios({ ebit: 50000, interestExpense: 10000, netOperatingIncome: 60000, totalDebtService: 40000 });
ok('interest coverage 5×', near(get(C, 'interest').value!, 5));
ok('ICR ≥3 good', get(C, 'interest').verdict === 'good');
ok('DSCR 1.5', near(get(C, 'dscr').value!, 1.5));
ok('DSCR ≥1.25 good', get(C, 'dscr').verdict === 'good');
// distress
const C2 = coverageRatios({ ebit: 8000, interestExpense: 10000, netOperatingIncome: 30000, totalDebtService: 40000 });
ok('ICR <1.5 poor', get(C2, 'interest').verdict === 'poor');
ok('DSCR <1 poor', get(C2, 'dscr').verdict === 'poor');

// --- Profitability: rev=100, cogs=60, opInc=15, NI=10, assets=200, equity=80
const P = profitabilityRatios({ revenue: 100000, cogs: 60000, operatingIncome: 15000, netIncome: 10000, totalAssets: 200000, totalEquity: 80000 });
ok('gross margin 0.4', near(get(P, 'gross').value!, 0.4));
ok('gross margin context', get(P, 'gross').verdict === 'context');
ok('operating margin 0.15', near(get(P, 'operating').value!, 0.15));
ok('net margin 0.10', near(get(P, 'net').value!, 0.1));
ok('ROA 0.05', near(get(P, 'roa').value!, 0.05));
ok('ROE 0.125', near(get(P, 'roe').value!, 0.125));
// loss case
const P2 = profitabilityRatios({ revenue: 100000, cogs: 90000, operatingIncome: -5000, netIncome: -8000, totalAssets: 200000, totalEquity: 80000 });
ok('negative net margin poor', get(P2, 'net').verdict === 'poor');
ok('negative operating margin poor', get(P2, 'operating').verdict === 'poor');

// --- Efficiency: cogs=60, avgInv=10 → turn=6; rev=100, avgAR=12; avgAP=8; assets=200
const E = efficiencyRatios({ cogs: 60000, avgInventory: 10000, revenue: 100000, avgReceivables: 12000, avgPayables: 8000, totalAssets: 200000 });
ok('inventory turnover 6', near(get(E, 'invturn').value!, 6));
ok('receivables turnover 8.33', near(get(E, 'recturn').value!, 100000 / 12000, 1e-6));
ok('asset turnover 0.5', near(get(E, 'assetturn').value!, 0.5));
// CCC = 365/6 + 365/8.333 - 365/7.5 = 60.83 + 43.8 - 48.67 ≈ 55.97
const ccc = get(E, 'ccc').value!;
ok('CCC ≈ 56', ccc > 54 && ccc < 58, ccc.toFixed(2));
// negative CCC case
const E2 = efficiencyRatios({ cogs: 60000, avgInventory: 3000, revenue: 100000, avgReceivables: 2000, avgPayables: 20000, totalAssets: 200000 });
ok('negative CCC good', get(E2, 'ccc').verdict === 'good', get(E2, 'ccc').value);

// --- Valuation: price=50, shares=1000, NI=5000, equity=40000, rev=100000, div=2000, ebitda=12000, EV=60000
const V = valuationRatios({ price: 50, shares: 1000, netIncome: 5000, totalEquity: 40000, revenue: 100000, dividendsPaid: 2000, ebitda: 12000, enterpriseValue: 60000 });
ok('EPS 5', near(get(V, 'eps').value!, 5));
ok('P/E 10', near(get(V, 'pe').value!, 10));
ok('P/B 1.25', near(get(V, 'pb').value!, 50 / 40, 1e-9)); // BVPS = 40000/1000 = 40 → 50/40 = 1.25
ok('P/S 0.5', near(get(V, 'ps').value!, 50000 / 100000, 1e-9));
ok('dividend yield 0.04', near(get(V, 'yield').value!, 2 / 50, 1e-9)); // DPS=2, /50
ok('payout 0.4', near(get(V, 'payout').value!, 0.4));
ok('payout ≤0.8 good', get(V, 'payout').verdict === 'good');
ok('EV/EBITDA 5', near(get(V, 'evebitda').value!, 5));
// unsustainable payout
const V2 = valuationRatios({ price: 50, shares: 1000, netIncome: 3000, totalEquity: 40000, revenue: 100000, dividendsPaid: 4000, ebitda: 12000, enterpriseValue: 60000 });
ok('payout >100% poor', get(V2, 'payout').verdict === 'poor', get(V2, 'payout').value);

console.log(`\n${pass} passed, ${fail} failed`);
if (fail) process.exit(1);
