/**
 * Financial-ratio calculations with business-term interpretation, for the
 * /finance/ category. Formulas are standard accounting (unambiguous). The
 * interpretation thresholds are widely-cited rules of thumb (Corporate Finance
 * Institute, Investopedia, lender norms) and are STRONGLY industry-dependent —
 * shown as general guidance, not investment advice. Ratios that only make sense
 * relative to peers return a 'context' verdict rather than a hard good/bad.
 */

export type Verdict = 'good' | 'ok' | 'poor' | 'context';
export interface RatioResult {
  key: string;
  name: string;
  value: number | null;
  display: string;
  verdict: Verdict;
  meaning: string;
}

const num = (n: unknown): n is number => typeof n === 'number' && isFinite(n);
const money = (n: number) => n.toLocaleString('en-US', { maximumFractionDigits: 2 });
const x2 = (n: number) => `${n.toLocaleString('en-US', { maximumFractionDigits: 2 })}×`;
const pct = (n: number) => `${(n * 100).toLocaleString('en-US', { maximumFractionDigits: 1 })}%`;
const days = (n: number) => `${Math.round(n)} days`;

const R = (key: string, name: string, value: number | null, display: string, verdict: Verdict, meaning: string): RatioResult =>
  ({ key, name, value, display, verdict, meaning });
const NA = (key: string, name: string, reason: string): RatioResult =>
  ({ key, name, value: null, display: '—', verdict: 'context', meaning: reason });

/* ─────────────────────────── LIQUIDITY ─────────────────────────── */
export function liquidityRatios(i: { currentAssets: number; inventory: number; cash: number; currentLiabilities: number }): RatioResult[] {
  const { currentAssets, inventory, cash, currentLiabilities } = i;
  const out: RatioResult[] = [];
  if (currentLiabilities > 0) {
    const cr = currentAssets / currentLiabilities;
    out.push(R('current', 'Current ratio', cr, x2(cr),
      cr < 1 ? 'poor' : cr < 1.5 ? 'ok' : cr <= 3 ? 'good' : 'ok',
      cr < 1 ? `Only $${money(cr)} of current assets per $1 of short-term debt — the company may struggle to cover obligations due within a year.`
        : cr <= 3 ? `$${money(cr)} of current assets for every $1 of current liabilities — comfortably able to cover short-term obligations.`
        : `$${money(cr)} of current assets per $1 of liabilities — very liquid, but a very high ratio can signal cash or inventory sitting idle rather than being put to work.`));
    const qr = (currentAssets - inventory) / currentLiabilities;
    out.push(R('quick', 'Quick ratio (acid-test)', qr, x2(qr),
      qr < 0.8 ? 'poor' : qr < 1 ? 'ok' : 'good',
      qr < 1 ? `Excluding inventory, only $${money(qr)} of liquid assets per $1 of short-term debt — the firm leans on selling stock to meet obligations.`
        : `$${money(qr)} of liquid assets (excluding inventory) per $1 of current liabilities — can meet short-term debts without relying on selling inventory.`));
    const cash_r = cash / currentLiabilities;
    out.push(R('cash', 'Cash ratio', cash_r, x2(cash_r),
      cash_r < 0.2 ? 'ok' : cash_r < 1 ? 'good' : 'ok',
      cash_r < 0.2 ? `Cash alone covers ${pct(cash_r)} of short-term liabilities — normal for many firms, but leaves little buffer without collecting receivables or selling stock.`
        : cash_r < 1 ? `Cash and equivalents cover ${pct(cash_r)} of current liabilities — a solid immediate cushion.`
        : `Cash covers all short-term liabilities (${x2(cash_r)}) — extremely safe, though large idle cash may earn poor returns.`));
  } else {
    out.push(NA('current', 'Current ratio', 'Enter current liabilities greater than zero.'));
  }
  const nwc = currentAssets - currentLiabilities;
  out.push(R('nwc', 'Net working capital', nwc, `$${money(nwc)}`,
    nwc > 0 ? 'good' : nwc === 0 ? 'ok' : 'poor',
    nwc >= 0 ? `Current assets exceed current liabilities by $${money(nwc)} — positive working capital to fund day-to-day operations.`
      : `Current liabilities exceed current assets by $${money(-nwc)} — negative working capital, a potential short-term liquidity strain (though normal in some fast-turnover businesses).`));
  return out;
}

/* ─────────────────────────── LEVERAGE ─────────────────────────── */
export function leverageRatios(i: { totalDebt: number; totalEquity: number; totalAssets: number }): RatioResult[] {
  const { totalDebt, totalEquity, totalAssets } = i;
  const out: RatioResult[] = [];
  if (totalEquity > 0) {
    const de = totalDebt / totalEquity;
    out.push(R('de', 'Debt-to-equity', de, x2(de),
      de < 1 ? 'good' : de <= 2 ? 'ok' : 'poor',
      `$${money(de)} of debt for every $1 of equity. ${de < 1 ? 'Conservatively financed — mostly funded by owners, lower financial risk.' : de <= 2 ? 'A moderate reliance on debt — common, but check it against industry norms.' : 'Heavily leveraged — magnifies returns but raises the risk of distress if earnings dip.'} Capital-intensive industries (utilities, banks) run much higher, so compare to peers.`));
    out.push(R('em', 'Equity multiplier', totalAssets / totalEquity, x2(totalAssets / totalEquity),
      'context',
      `Assets are ${x2(totalAssets / totalEquity)} equity — every $1 of equity supports $${money(totalAssets / totalEquity)} of assets. Higher means more of the balance sheet is funded by debt (more leverage).`));
  } else {
    out.push(NA('de', 'Debt-to-equity', 'Enter total equity greater than zero.'));
  }
  if (totalAssets > 0) {
    const dr = totalDebt / totalAssets;
    out.push(R('debtratio', 'Debt ratio (debt / assets)', dr, pct(dr),
      dr < 0.4 ? 'good' : dr <= 0.6 ? 'ok' : 'poor',
      `${pct(dr)} of assets are financed by debt. ${dr < 0.4 ? 'A conservative, lower-risk capital structure.' : dr <= 0.6 ? 'A moderate debt load — typical for many firms.' : 'A high share of assets funded by debt — more vulnerable to rising rates or a downturn.'}`));
    const dc = totalDebt + totalEquity > 0 ? totalDebt / (totalDebt + totalEquity) : null;
    if (dc != null) out.push(R('debtcap', 'Debt-to-capital', dc, pct(dc),
      dc < 0.4 ? 'good' : dc <= 0.6 ? 'ok' : 'poor',
      `Debt makes up ${pct(dc)} of total capital (debt + equity). ${dc < 0.5 ? 'The company is more equity-financed than debt-financed.' : 'The company leans on debt for the majority of its capital.'}`));
  }
  return out;
}

/* ─────────────────────────── COVERAGE ─────────────────────────── */
export function coverageRatios(i: { ebit: number; interestExpense: number; netOperatingIncome: number; totalDebtService: number; fixedCharges?: number; leasePayments?: number }): RatioResult[] {
  const { ebit, interestExpense, netOperatingIncome, totalDebtService } = i;
  const out: RatioResult[] = [];
  if (interestExpense > 0) {
    const icr = ebit / interestExpense;
    out.push(R('interest', 'Interest coverage (times interest earned)', icr, x2(icr),
      icr < 1.5 ? 'poor' : icr < 3 ? 'ok' : 'good',
      icr < 1 ? `Operating earnings don't even cover the interest bill (${x2(icr)}) — a serious solvency warning.`
        : icr < 1.5 ? `Operating earnings cover interest only ${x2(icr)} — a thin cushion that leaves little room for a downturn.`
        : icr < 3 ? `Operating earnings cover interest ${x2(icr)} — adequate, though lenders like to see a bigger buffer.`
        : `Operating earnings cover the interest bill ${x2(icr)} over — a comfortable cushion to service debt.`));
  } else {
    out.push(NA('interest', 'Interest coverage', 'Enter interest expense greater than zero.'));
  }
  if (totalDebtService > 0) {
    const dscr = netOperatingIncome / totalDebtService;
    out.push(R('dscr', 'Debt service coverage (DSCR)', dscr, x2(dscr),
      dscr < 1 ? 'poor' : dscr < 1.25 ? 'ok' : 'good',
      dscr < 1 ? `Operating income covers only ${x2(dscr)} of total debt payments — it can't service its debt from operations, a red flag for lenders.`
        : dscr < 1.25 ? `Operating income covers debt payments ${x2(dscr)} — positive, but below the ~1.25× most lenders require.`
        : `Operating income covers total debt payments ${x2(dscr)} over — at or above the ~1.25× lenders typically want to see.`));
  }
  const fixed = (i.fixedCharges ?? 0) + (i.leasePayments ?? 0);
  if (fixed > 0 && (interestExpense >= 0)) {
    const fccr = (ebit + (i.leasePayments ?? 0)) / (interestExpense + (i.leasePayments ?? 0) + (i.fixedCharges ?? 0));
    out.push(R('fixedcharge', 'Fixed-charge coverage', fccr, x2(fccr),
      fccr < 1.25 ? (fccr < 1 ? 'poor' : 'ok') : 'good',
      `Earnings cover fixed charges (interest plus leases/other fixed obligations) ${x2(fccr)}. ${fccr < 1 ? 'Below 1× — fixed commitments exceed earnings available to pay them.' : fccr < 1.25 ? 'Positive but modest.' : 'A healthy cushion over all fixed commitments.'}`));
  }
  return out;
}

/* ─────────────────────────── PROFITABILITY ─────────────────────────── */
export function profitabilityRatios(i: { revenue: number; cogs: number; operatingIncome: number; netIncome: number; totalAssets: number; totalEquity: number }): RatioResult[] {
  const { revenue, cogs, operatingIncome, netIncome, totalAssets, totalEquity } = i;
  const out: RatioResult[] = [];
  if (revenue > 0) {
    const gm = (revenue - cogs) / revenue;
    out.push(R('gross', 'Gross margin', gm, pct(gm), 'context',
      `${pct(gm)} of every sales dollar is left after the direct cost of goods — the money available to cover operating expenses and profit. Whether that's "good" depends heavily on the industry (software runs high, groceries run low), so compare to peers.`));
    const om = operatingIncome / revenue;
    out.push(R('operating', 'Operating margin', om, pct(om),
      om < 0 ? 'poor' : 'context',
      om < 0 ? `Operations lose ${pct(-om)} on every sales dollar — the core business isn't profitable before interest and tax.`
        : `${pct(om)} of revenue remains as operating profit after running costs. Higher is better, but it's industry-relative — benchmark against competitors.`));
    const nm = netIncome / revenue;
    out.push(R('net', 'Net profit margin', nm, pct(nm),
      nm < 0 ? 'poor' : 'context',
      nm < 0 ? `The company loses ${pct(-nm)} on every dollar of sales after all costs — it's unprofitable.`
        : `${pct(nm)} of each sales dollar becomes bottom-line profit after all expenses, interest and tax. Compare to industry peers — a "good" net margin varies widely by sector.`));
  } else {
    out.push(NA('gross', 'Margins', 'Enter revenue greater than zero.'));
  }
  if (totalAssets > 0) {
    const roa = netIncome / totalAssets;
    out.push(R('roa', 'Return on assets (ROA)', roa, pct(roa),
      roa < 0 ? 'poor' : 'context',
      roa < 0 ? `The company is losing money on its asset base (${pct(roa)}).`
        : `The company generates ${pct(roa)} of profit per dollar of assets — how efficiently management turns assets into earnings. Asset-heavy industries run lower; compare to peers.`));
  }
  if (totalEquity > 0) {
    const roe = netIncome / totalEquity;
    out.push(R('roe', 'Return on equity (ROE)', roe, pct(roe),
      roe < 0 ? 'poor' : 'context',
      roe < 0 ? `Shareholders are losing ${pct(-roe)} on their equity.`
        : `Shareholders earn ${pct(roe)} on their equity. Often 15–20% is considered strong — but a high ROE can be driven by heavy debt, so read it alongside the leverage ratios.`));
  }
  return out;
}

/* ─────────────────────────── EFFICIENCY ─────────────────────────── */
export function efficiencyRatios(i: { cogs: number; avgInventory: number; revenue: number; avgReceivables: number; avgPayables: number; totalAssets: number }): RatioResult[] {
  const { cogs, avgInventory, revenue, avgReceivables, avgPayables, totalAssets } = i;
  const out: RatioResult[] = [];
  let dio: number | null = null, dso: number | null = null, dpo: number | null = null;
  if (avgInventory > 0 && cogs > 0) {
    const it = cogs / avgInventory;
    dio = 365 / it;
    out.push(R('invturn', 'Inventory turnover', it, `${it.toLocaleString('en-US', { maximumFractionDigits: 1 })}× / yr`, 'context',
      `Inventory is sold and replaced ${it.toLocaleString('en-US', { maximumFractionDigits: 1 })} times a year, roughly every ${days(dio)} (days inventory outstanding). Faster turnover ties up less cash in stock, but "right" depends on the industry — perishables turn fast, heavy equipment slow.`));
  }
  if (avgReceivables > 0 && revenue > 0) {
    const rt = revenue / avgReceivables;
    dso = 365 / rt;
    out.push(R('recturn', 'Receivables turnover / DSO', rt, `${days(dso)} DSO`, 'context',
      `Customers take about ${days(dso)} to pay on average (days sales outstanding). Compare to your payment terms — well above them signals slow collection and cash tied up in receivables.`));
  }
  if (avgPayables > 0 && cogs > 0) {
    const pt = cogs / avgPayables;
    dpo = 365 / pt;
    out.push(R('payturn', 'Payables turnover / DPO', pt, `${days(dpo)} DPO`, 'context',
      `The company takes about ${days(dpo)} to pay its suppliers (days payable outstanding). Longer holds onto cash longer, but stretching too far can strain supplier relationships.`));
  }
  if (totalAssets > 0 && revenue > 0) {
    const at = revenue / totalAssets;
    out.push(R('assetturn', 'Asset turnover', at, x2(at), 'context',
      `Each $1 of assets generates $${money(at)} of revenue — how efficiently the asset base produces sales. Retailers run high, capital-intensive firms low; compare within the industry.`));
  }
  if (dio != null && dso != null && dpo != null) {
    const ccc = dio + dso - dpo;
    out.push(R('ccc', 'Cash conversion cycle', ccc, days(ccc),
      ccc < 0 ? 'good' : 'context',
      ccc < 0 ? `Negative cash conversion cycle (${days(ccc)}) — the company collects from customers before it pays suppliers, effectively funding operations with supplier credit (a strong position, like some big retailers).`
        : `It takes about ${days(ccc)} to convert investments in inventory and receivables back into cash (inventory days + collection days − payment days). Shorter frees up working capital.`));
  }
  return out;
}

/* ─────────────────────────── VALUATION ─────────────────────────── */
export function valuationRatios(i: { price: number; shares: number; netIncome: number; totalEquity: number; revenue: number; dividendsPaid: number; ebitda: number; enterpriseValue: number }): RatioResult[] {
  const { price, shares, netIncome, totalEquity, revenue, dividendsPaid, ebitda, enterpriseValue } = i;
  const out: RatioResult[] = [];
  const marketCap = num(price) && num(shares) ? price * shares : null;
  if (shares > 0) {
    const eps = netIncome / shares;
    out.push(R('eps', 'Earnings per share (EPS)', eps, `$${money(eps)}`,
      eps < 0 ? 'poor' : 'context',
      eps < 0 ? `The company earns −$${money(-eps)} per share — it's currently lossmaking.`
        : `Each share earns $${money(eps)} of net profit. On its own it says little — compare over time and against the share price (P/E).`));
    if (price > 0 && eps > 0) {
      const pe = price / eps;
      out.push(R('pe', 'Price-to-earnings (P/E)', pe, x2(pe), 'context',
        `Investors pay $${money(pe)} for every $1 of annual earnings. A high P/E signals high growth expectations (or overvaluation); a low one can mean a bargain or a troubled business. P/E is only meaningful against the sector and the market.`));
    }
    if (price > 0 && totalEquity > 0) {
      const bvps = totalEquity / shares;
      const pb = price / bvps;
      out.push(R('pb', 'Price-to-book (P/B)', pb, x2(pb),
        'context',
        `The market values the company at ${x2(pb)} its accounting book value. Below 1× can flag undervaluation (or trouble); a premium reflects intangibles and growth the balance sheet doesn't capture. Sector-dependent.`));
    }
    if (marketCap != null && revenue > 0) {
      const ps = marketCap / revenue;
      out.push(R('ps', 'Price-to-sales (P/S)', ps, x2(ps), 'context',
        `The company is valued at ${x2(ps)} its annual revenue — useful for firms with little or no profit yet. Compare within the sector.`));
    }
    if (price > 0 && dividendsPaid > 0) {
      const dps = dividendsPaid / shares;
      const dy = dps / price;
      out.push(R('yield', 'Dividend yield', dy, pct(dy), 'context',
        `Shareholders receive ${pct(dy)} of the share price in dividends each year. A higher yield means more income, but an unusually high yield can signal a falling price or an unsustainable payout.`));
    }
    if (netIncome > 0 && dividendsPaid >= 0) {
      const payout = dividendsPaid / netIncome;
      out.push(R('payout', 'Dividend payout ratio', payout, pct(payout),
        payout > 1 ? 'poor' : payout > 0.8 ? 'ok' : 'good',
        payout > 1 ? `The company pays out ${pct(payout)} of earnings as dividends — more than it earns, which isn't sustainable without dipping into reserves or debt.`
          : `${pct(payout)} of earnings are paid out as dividends, leaving ${pct(1 - payout)} reinvested in the business. Lower suits growth companies; higher suits mature income stocks.`));
    }
  }
  if (enterpriseValue > 0 && ebitda > 0) {
    const evebitda = enterpriseValue / ebitda;
    out.push(R('evebitda', 'EV / EBITDA', evebitda, x2(evebitda), 'context',
      `The whole business (equity + net debt) is valued at ${x2(evebitda)} its operating cash earnings. A capital-structure-neutral valuation multiple — lower can mean cheaper, but it's highly sector-dependent.`));
  }
  return out;
}
