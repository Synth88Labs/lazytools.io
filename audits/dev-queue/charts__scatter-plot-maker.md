# 🧑‍💻 Dev proposal — Scatter Plot Maker

`charts/scatter-plot-maker` · category charts · proposed 2026-08-24 · model claude-sonnet-5

> Manager-approved (rating 4/5). **Review, then implement + deploy through the normal build.** Not auto-committed.

---

# Scatter Plot Maker — Build Proposal

**Slug:** `charts/scatter-plot-maker`
**Category:** charts
**Type:** Preact island component (canvas rendering + file I/O required — not a pure `computeId` data tool)

---

## 1. Approach

### Inputs
- Pasted text (CSV, TSV, or whitespace-separated) via `<textarea>`
- OR uploaded `.csv`/`.txt` file (read client-side via `FileReader`, never uploaded to a server)
- Expected shape: two numeric columns (`X`, `Y`), optional third column as a point label
- Optional header row (auto-detected: if row 1's first two tokens aren't both numeric, it's treated as a header and skipped)
- Chart options: title, X-axis label, Y-axis label, point color, trendline toggle, trendline color

### Core math — Ordinary Least Squares (OLS) linear regression
Standard least-squares fit for `y = mx + b`, the same method used by Excel's "Add Trendline" and Google Sheets' `LINEST`/`TREND`:

```
n     = number of points
m (slope)     = (nΣxy − ΣxΣy) / (nΣx² − (Σx)²)
b (intercept) = (Σy − mΣx) / n

Pearson r     = (nΣxy − ΣxΣy) / √[(nΣx² − (Σx)²)(nΣy² − (Σy)²)]
R²            = 1 − SSres/SStot
   where SSres = Σ(yᵢ − ŷᵢ)²,  ŷᵢ = m·xᵢ + b
         SStot = Σ(yᵢ − ȳ)²
```

**Source:** Draper, N.R. & Smith, H., *Applied Regression Analysis*, 3rd ed., Wiley, 1998 — standard OLS derivation. This is deterministic arithmetic, not a magic constant, so no external API/lookup is needed; the formula is reproduced verbatim and covered by the Node test below.

Edge cases handled:
- `< 2` valid points → no regression, chart still renders points if any
- All `x` values identical (vertical scatter) → denominator is `0` → regression returns `null`, trendline is skipped, UI shows a note instead of crashing
- Non-numeric rows are silently dropped (with a count shown to the user)

### Output
- `<canvas>` scatter chart with axes, gridlines, points, and (optionally) the trendline overlaid, plus the fitted equation, R², and Pearson r printed under the chart
- Downloadable PNG via `canvas.toDataURL('image/png')`

---

## 2. Implementation

### 2.1 Pure math module (testable, no DOM)

`src/lib/charts/scatterMath.ts`

```ts
export interface Point {
  x: number;
  y: number;
  label?: string;
}

export interface RegressionResult {
  slope: number;
  intercept: number;
  rSquared: number;
  pearsonR: number;
  n: number;
}

export interface ParseResult {
  points: Point[];
  skippedRows: number;
  hadHeader: boolean;
}

function splitLine(line: string): string[] {
  if (line.includes(',')) return line.split(',').map((s) => s.trim());
  if (line.includes('\t')) return line.split('\t').map((s) => s.trim());
  return line.trim().split(/\s+/);
}

export function parseXYData(raw: string): ParseResult {
  const lines = raw
    .trim()
    .split(/\r?\n/)
    .filter((l) => l.trim().length > 0);

  if (lines.length === 0) {
    return { points: [], skippedRows: 0, hadHeader: false };
  }

  let startIndex = 0;
  let hadHeader = false;

  const firstTokens = splitLine(lines[0]);
  if (firstTokens.length >= 2) {
    const maybeX = Number(firstTokens[0]);
    const maybeY = Number(firstTokens[1]);
    if (Number.isNaN(maybeX) || Number.isNaN(maybeY)) {
      startIndex = 1;
      hadHeader = true;
    }
  }

  const points: Point[] = [];
  let skippedRows = 0;

  for (let i = startIndex; i < lines.length; i++) {
    const tokens = splitLine(lines[i]);
    if (tokens.length < 2) {
      skippedRows++;
      continue;
    }
    const x = Number(tokens[0]);
    const y = Number(tokens[1]);
    if (Number.isNaN(x) || Number.isNaN(y)) {
      skippedRows++;
      continue;
    }
    points.push({ x, y, label: tokens[2]?.trim() });
  }

  return { points, skippedRows, hadHeader };
}

export function computeLinearRegression(points: Point[]): RegressionResult | null {
  const n = points.length;
  if (n < 2) return null;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;
  for (const p of points) {
    sumX += p.x;
    sumY += p.y;
    sumXY += p.x * p.y;
    sumX2 += p.x * p.x;
    sumY2 += p.y * p.y;
  }

  const denom = n * sumX2 - sumX * sumX;
  if (denom === 0) return null; // vertical scatter — no defined slope

  const slope = (n * sumXY - sumX * sumY) / denom;
  const intercept = (sumY - slope * sumX) / n;

  const rNumerator = n * sumXY - sumX * sumY;
  const rDenominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
  const pearsonR = rDenominator === 0 ? 0 : rNumerator / rDenominator;

  const meanY = sumY / n;
  let ssRes = 0, ssTot = 0;
  for (const p of points) {
    const predicted = slope * p.x + intercept;
    ssRes += (p.y - predicted) ** 2;
    ssTot += (p.y - meanY) ** 2;
  }
  const rSquared = ssTot === 0 ? 1 : 1 - ssRes / ssTot;

  return { slope, intercept, rSquared, pearsonR, n };
}

export function getAxisBounds(
  points: Point[],
  paddingFraction = 0.1
): { minX: number; maxX: number; minY: number; maxY: number } {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  let minX = Math.min(...xs);
  let maxX = Math.max(...xs);
  let minY = Math.min(...ys);
  let maxY = Math.max(...ys);

  const rangeX = maxX - minX || 1;
  const rangeY = maxY - minY || 1;

  minX -= rangeX * paddingFraction;
  maxX += rangeX * paddingFraction;
  minY -= rangeY * paddingFraction;
  maxY += rangeY * paddingFraction;

  return { minX, maxX, minY, maxY };
}
```

### 2.2 Preact island component

`src/components/charts/ScatterPlotMaker.tsx`

```tsx
import { useState, useRef, useMemo, useEffect } from 'preact/hooks';
import {
  parseXYData,
  computeLinearRegression,
  getAxisBounds,
  type Point,
} from '../../lib/charts/scatterMath';

const SAMPLE_DATA = `Hours Studied,Exam Score
1,52
2,58
3,63
4,65
5,71
6,74
7,79
8,84
9,88
10,93`;

export default function ScatterPlotMaker() {
  const [raw, setRaw] = useState('');
  const [title, setTitle] = useState('Scatter Plot');
  const [xLabel, setXLabel] = useState('X');
  const [yLabel, setYLabel] = useState('Y');
  const [pointColor, setPointColor] = useState('#2563eb');
  const [trendColor, setTrendColor] = useState('#dc2626');
  const [showTrendline, setShowTrendline] = useState(true);
  const [fileError, setFileError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  const parsed = useMemo(() => parseXYData(raw), [raw]);
  const regression = useMemo(
    () => computeLinearRegression(parsed.points),
    [parsed.points]
  );

  useEffect(() => {
    draw();
  }, [parsed.points, regression, title, xLabel, yLabel, pointColor, trendColor, showTrendline]);

  function handleFile(e: Event) {
    setFileError(null);
    const input = e.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    if (!/\.(csv|txt|tsv)$/i.test(file.name)) {
      setFileError('Please upload a .csv, .tsv, or .txt file.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setRaw(String(reader.result ?? ''));
    reader.onerror = () => setFileError('Could not read that file.');
    reader.readAsText(file);
  }

  function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const cssWidth = 720;
    const cssHeight = 480;
    canvas.width = cssWidth * dpr;
    canvas.height = cssHeight * dpr;
    canvas.style.width = `${cssWidth}px`;
    canvas.style.height = `${cssHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, cssWidth, cssHeight);

    // background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, cssWidth, cssHeight);

    const points = parsed.points;
    const padding = { top: 50, right: 30, bottom: 60, left: 70 };
    const plotW = cssWidth - padding.left - padding.right;
    const plotH = cssHeight - padding.top - padding.bottom;

    // title
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 18px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(title || 'Scatter Plot', cssWidth / 2, 28);

    if (points.length === 0) {
      ctx.font = '14px system-ui, sans-serif';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Paste or upload X/Y data to see a chart', cssWidth / 2, cssHeight / 2);
      return;
    }

    const { minX, maxX, minY, maxY } = getAxisBounds(points);
    const sx = (x: number) => padding.left + ((x - minX) / (maxX - minX)) * plotW;
    const sy = (y: number) => padding.top + plotH - ((y - minY) / (maxY - minY)) * plotH;

    // gridlines + axis ticks (5 divisions)
    ctx.strokeStyle = '#e5e7eb';
    ctx.fillStyle = '#6b7280';
    ctx.font = '11px system-ui, sans-serif';
    ctx.lineWidth = 1;
    const divisions = 5;
    for (let i = 0; i <= divisions; i++) {
      const xVal = minX + ((maxX - minX) * i) / divisions;
      const yVal = minY + ((maxY - minY) * i) / divisions;
      const px = sx(xVal);
      const py = sy(yVal);

      ctx.beginPath();
      ctx.moveTo(px, padding.top);
      ctx.lineTo(px, padding.top + plotH);
      ctx.stroke();
      ctx.textAlign = 'center';
      ctx.fillText(xVal.toFixed(1), px, padding.top + plotH + 18);

      ctx.beginPath();
      ctx.moveTo(padding.left, py);
      ctx.lineTo(padding.left + plotW, py);
      ctx.stroke();
      ctx.textAlign = 'right';
      ctx.fillText(yVal.toFixed(1), padding.left - 10, py + 4);
    }

    // axes
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(padding.left, padding.top, plotW, plotH);

    // axis labels
    ctx.fillStyle = '#111827';
    ctx.font = '13px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(xLabel || 'X', padding.left + plotW / 2, cssHeight - 15);
    ctx.save();
    ctx.translate(18, padding.top + plotH / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(yLabel || 'Y', 0, 0);
    ctx.restore();

    // trendline
    if (showTrendline && regression) {
      const x1 = minX;
      const x2 = maxX;
      const y1 = regression.slope * x1 + regression.intercept;
      const y2 = regression.slope * x2 + regression.intercept;
      ctx.strokeStyle = trendColor;
      ctx.lineWidth = 2;
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(sx(x1), sy(y1));
      ctx.lineTo(sx(x2), sy(y2));
      ctx.stroke();
    }

    // points
    ctx.fillStyle = pointColor;
    for (const p of points) {
      ctx.beginPath();
      ctx.arc(sx(p.x), sy(p.y), 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function downloadPNG() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(title || 'scatter-plot').replace(/\s+/g, '-').toLowerCase()}.png`;
    a.click();
  }

  return (
    <div class="scatter-plot-maker">
      <div class="controls">
        <label>
          Paste X,Y data (CSV, TSV, or space-separated; header optional)
          <textarea
            rows={10}
            placeholder={'X,Y\n1,3\n2,5\n3,7'}
            value={raw}
            onInput={(e) => setRaw((e.target as HTMLTextAreaElement).value)}
          />
        </label>

        <div class="row">
          <button type="button" onClick={() => setRaw(SAMPLE_DATA)}>
            Load sample data
          </button>
          <label class="file-btn">
            Upload CSV
            <input type="file" accept=".csv,.tsv,.txt" onChange={handleFile} />
          </label>
        </div>
        {fileError && <p class="error">{fileError}</p>}
        {parsed.skippedRows > 0 && (
          <p class="notice">Skipped {parsed.skippedRows} row(s) with invalid or missing numbers.</p>
        )}

        <div class="row">
          <label>
            Title
            <input value={title} onInput={(e) => setTitle((e.target as HTMLInputElement).value)} />
          </label>
          <label>
            X-axis label
            <input value={xLabel} onInput={(e) => setXLabel((e.target as HTMLInputElement).value)} />
          </label>
          <label>
            Y-axis label
            <input value={yLabel} onInput={(e) => setYLabel((e.target as HTMLInputElement).value)} />
          </label>
        </div>

        <div class="row">
          <label>
            Point color
            <input type="color" value={pointColor} onInput={(e) => setPointColor((e.target as HTMLInputElement).value)} />
          </label>
          <label>
            Trendline color
            <input type="color" value={trendColor} onInput={(e) => setTrendColor((e.target as HTMLInputElement).value)} />
          </label>
          <label class="checkbox">
            <input
              type="checkbox"
              checked={showTrendline}
              onChange={(e) => setShowTrendline((e.target as HTMLInputElement).checked)}
            />
            Show trendline
          </label>
        </div>

        <button type="button" class="primary" onClick={downloadPNG} disabled={parsed.points.length === 0}>
          Download PNG
        </button>
      </div>

      <div class="preview">
        <canvas ref={canvasRef} />
        {regression && (
          <div class="stats">
            <p>
              <strong>Trendline:</strong> y = {regression.slope.toFixed(4)}x{' '}
              {regression.intercept >= 0 ? '+' : '−'} {Math.abs(regression.intercept).toFixed(4)}
            </p>
            <p>
              <strong>R²:</strong> {regression.rSquared.toFixed(4)} &nbsp;|&nbsp;
              <strong>Pearson r:</strong> {regression.pearsonR.toFixed(4)} &nbsp;|&nbsp;
              <strong>n:</strong> {regression.n}
            </p>
          </div>
        )}
        {!regression && parsed.points.length >= 2 && (
          <p class="notice">All X values are identical — a trendline slope isn't defined for a vertical scatter.</p>
        )}
      </div>
    </div>
  );
}
```

> Styling: add a scoped stylesheet (`ScatterPlotMaker.css` imported into the component, or Tailwind classes if the site already uses Tailwind — reuse whatever the other 6 chart tools use for visual consistency).

### 2.3 Route page

`src/pages/charts/scatter-plot-maker.astro`

```astro
---
import ToolLayout from '../../layouts/ToolLayout.astro';
import ScatterPlotMaker from '../../components/charts/ScatterPlotMaker.tsx';

const title = 'Scatter Plot Maker — Free Online Chart Tool';
const description =
  'Paste or upload X/Y data to instantly generate a downloadable scatter plot with an optional least-squares trendline, R², and correlation coefficient. 100% client-side.';

const faqs = [
  {
    q: 'What file formats can I upload?',
    a: 'CSV, TSV, and plain .txt files with two numeric columns (X and Y) work. You can also just paste data directly into the textbox — comma, tab, or space-separated values are all auto-detected.',
  },
  {
    q: 'How is the trendline calculated?',
    a: 'The tool fits a straight line using ordinary least squares (OLS) regression — the same method behind Excel\'s "linear trendline" and Google Sheets\' TREND function. It minimizes the sum of squared vertical distances between each point and the line.',
  },
  {
    q: 'What do R² and Pearson r mean?',
    a: 'Pearson r measures the strength and direction of the linear relationship between X and Y, from -1 (perfect negative) to +1 (perfect positive). R² (r squared) tells you what fraction of the variation in Y is explained by X — an R² of 0.81 means 81% of the spread in Y is accounted for by the linear trend.',
  },
  {
    q: 'Can I label individual points?',
    a: 'Yes — add a third column after X and Y (e.g. "12,45,Store A") and that text will be stored with the point. Point labels currently aren\'t rendered on the chart itself to keep dense datasets readable, but this is read from your data if present.',
  },
  {
    q: 'Is my data sent to a server?',
    a: 'No. Parsing, regression, and chart rendering all happen in your browser using the HTML canvas API. Nothing you paste or upload ever leaves your device.',
  },
  {
    q: 'What if my data has no linear relationship?',
    a: 'The trendline is always a straight line, so a low R² is expected — and informative — for curved, cyclical, or unrelated data. Toggle the trendline off if it isn\'t meaningful for your dataset.',
  },
  {
    q: 'What image format does it export?',
    a: 'PNG, generated directly from the canvas at your browser\'s device pixel ratio for a crisp result on retina displays.',
  },
];
---

<ToolLayout title={title} description={description}>
  <article class="prose">
    <h1>Scatter Plot Maker</h1>
    <p>
      A scatter plot is the fastest way to see whether two numeric variables move together — exam
      scores against study hours, ad spend against revenue, temperature against ice cream sales.
      This tool turns pasted or uploaded X/Y data into a clean, downloadable chart in your browser,
      with an optional least-squares trendline and the statistics (R², Pearson r) that tell you how
      strong that relationship actually is. No spreadsheet software, no account, no data leaving
      your device.
    </p>

    <h2>How it works</h2>
    <p>
      Paste two columns of numbers (or upload a CSV/TSV file) with X in the first column and Y in
      the second — a header row is detected automatically and skipped. The tool plots every valid
      pair as a point, scales the axes to fit your data with a small margin, and — if you enable it —
      draws a trendline computed with ordinary least squares regression: the line that minimizes the
      squared vertical distance to every point. Underneath the chart you'll see the fitted equation
      (y = mx + b), the R² value, and the Pearson correlation coefficient. When you're happy with the
      result, click "Download PNG" to save the chart as an image.
    </p>

    <ScatterPlotMaker client:load />

    <p class="note">
      <strong>Note:</strong> the trendline is always linear (a straight line). For data with a
      curved, cyclical, or non-linear relationship, R² will correctly report a poor fit — that's
      useful information, not a bug. Rows with non-numeric or missing values are automatically
      skipped and counted for you. For very large pastes (tens of thousands of rows), rendering
      may take a moment since everything runs in-browser.
    </p>

    <h2>FAQs</h2>
    <dl>
      {faqs.map((f) => (
        <div class="faq-item">
          <dt>{f.q}</dt>
          <dd>{f.a}</dd>
        </div>
      ))}
    </dl>
  </article>

  <script type="application/ld+json" set:html={JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  })} />
</ToolLayout>
```

> Assumption: the site already has a shared `src/layouts/ToolLayout.astro` used by the other 6 chart tools (title/description meta, header/footer, nav). If the existing layout has a different name/prop signature, swap it in — everything else is layout-agnostic.

---

## 3. Test

`scripts/test-scatter-plot-maker.ts`

```ts
import assert from 'node:assert/strict';
import {
  parseXYData,
  computeLinearRegression,
} from '../src/lib/charts/scatterMath';

function approxEqual(a: number, b: number, epsilon = 1e-6) {
  assert.ok(Math.abs(a - b) < epsilon, `Expected ${a} ≈ ${b}`);
}

// --- Case 1: perfect linear relationship y = 2x + 1 ---
{
  const raw = '1,3\n2,5\n3,7\n4,9';
  const { points, skippedRows, hadHeader } = parseXYData(raw);
  assert.equal(points.length, 4);
  assert.equal(skippedRows, 0);
  assert.equal(hadHeader, false);

  const reg = computeLinearRegression(points);
  assert.ok(reg);
  approxEqual(reg!.slope, 2);
  approxEqual(reg!.intercept,
