/** Charts & Design registry — client-side chart makers (SVG/PNG, no upload). */

export interface ChartToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'bar' | 'line' | 'pie' | 'funnel' | 'radar' | 'waterfall';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const CHART_TOOLS: ChartToolDef[] = [
  {
    slug: 'bar-chart-maker',
    name: 'Bar Chart Maker',
    icon: '📊',
    description:
      'Make a bar chart from your own data and download it as PNG or SVG — paste “label, value” lines, pick colors, add a title. Free, no sign-up, your data never leaves your browser.',
    lead: 'Paste your data as “label, value” lines, choose a color palette, and download a clean bar chart as a crisp PNG or an editable SVG — all in your browser.',
    widget: 'bar',
    how: 'Enter one “label, value” pair per line (comma or tab separated). The tool scales the tallest bar to the plot height, draws evenly spaced bars with value labels and a gridded value axis, and colors each bar from the palette you pick. The chart is drawn as an SVG in your browser; the PNG export renders that SVG onto a 2× canvas for a sharp, high-resolution image. Nothing is uploaded — the data you paste stays on your device.',
    note: 'Bar charts are best for comparing distinct categories — days of the week, products, survey options. Negative values are supported and draw below the zero axis. For a part-of-a-whole breakdown use the pie chart maker, and for a trend over time use the line chart maker.',
    faqs: [
      { q: 'How do I make a bar chart online for free?', a: 'Paste your data as “label, value” lines (for example “Mon, 12”), pick a color palette and an optional title, then click Download. This tool does it instantly in your browser with no sign-up and no watermark.' },
      { q: 'Can I download the chart as PNG or SVG?', a: 'Both. The PNG is rendered at 2× resolution for crisp slides and documents, and the SVG is a vector file you can scale infinitely or edit in Figma, Illustrator or Inkscape.' },
      { q: 'Is my data uploaded anywhere?', a: 'No. The chart is drawn entirely in your browser from the text you paste — the data never touches a server, so it works offline and is safe for private or unpublished numbers.' },
      { q: 'What data format does it accept?', a: 'One “label, value” pair per line, separated by a comma or a tab — so you can paste a column straight from a spreadsheet. Blank lines and stray text are ignored; the last number on each line is used as the value.' },
      { q: 'Does it support negative values?', a: 'Yes. Negative values draw below the zero axis, which is automatically positioned, so profit/loss or above/below-baseline data charts correctly.' },
    ],
    keywords: ['bar chart maker', 'bar graph maker', 'create bar chart online', 'bar chart generator', 'make a bar graph', 'bar chart from data', 'free bar chart maker'],
  },
  {
    slug: 'line-chart-maker',
    name: 'Line Chart Maker',
    icon: '📈',
    description:
      'Create a line chart from your data and export it as PNG or SVG — paste “label, value” lines, pick colors, add a title. Free, private, no upload, no sign-up.',
    lead: 'Paste your data as “label, value” lines and get a clean line chart with a subtle area fill — download it as a crisp PNG or an editable SVG, right in your browser.',
    widget: 'line',
    how: 'Enter one “label, value” pair per line. The tool plots each value against a gridded axis, connects the points with a smooth 2.5-pixel line, adds a light area fill beneath it and marks each data point. The x-axis labels come from your first column. Everything is drawn as an SVG in the browser, and the PNG export renders it at 2× resolution. Your data is never uploaded.',
    note: 'Line charts are ideal for showing a trend or change over an ordered sequence — months, weeks, versions, measurements. If your categories are unordered and you just want to compare sizes, a bar chart reads better; for shares of a total, use the pie chart maker.',
    faqs: [
      { q: 'How do I make a line graph online?', a: 'Paste your data as “label, value” lines (for example “Jan, 30”), choose a color and optional title, and download. The line chart is generated instantly in your browser — no account, no watermark.' },
      { q: 'Can I export the line chart as SVG?', a: 'Yes — download an editable, infinitely scalable SVG for design tools, or a 2× PNG for slides and documents. Both are generated locally on your device.' },
      { q: 'Is my data kept private?', a: 'Completely. The chart is drawn from the text you paste, entirely in your browser, so nothing is uploaded — it even works offline once the page has loaded.' },
      { q: 'What is the difference between a line and a bar chart?', a: 'A line chart connects values in order to show a trend over time or a sequence; a bar chart compares independent categories by height. Use a line for “how did it change,” a bar for “which is biggest.”' },
      { q: 'How many data points can I plot?', a: 'As many lines as you paste — the axis and spacing rescale automatically. Very dense series still render, though labels read best up to a few dozen points.' },
    ],
    keywords: ['line chart maker', 'line graph maker', 'create line chart online', 'line graph generator', 'make a line graph', 'trend chart maker', 'free line chart maker'],
  },
  {
    slug: 'pie-chart-maker',
    name: 'Pie & Donut Chart Maker',
    icon: '🥧',
    description:
      'Make a pie or donut chart from your data with automatic percentages and a legend — download PNG or SVG. Free, private, no sign-up, nothing uploaded.',
    lead: 'Paste your data as “label, value” lines and get a pie or donut chart with automatic percentages and a legend — download a crisp PNG or an editable SVG in your browser.',
    widget: 'pie',
    how: 'Enter one “label, value” pair per line. The tool totals the values, draws each slice proportional to its share, and labels every slice with its percentage plus a side legend showing the value and percent. A checkbox switches between a full pie and a donut (ring) style. It’s all drawn as an SVG in your browser, with a 2× PNG export — and your numbers are never uploaded.',
    note: 'Pie and donut charts show parts of a single whole, so they work best with a handful of positive categories that add up to 100%. Only positive values are used (a slice can’t be negative). For comparing many categories precisely, or for trends over time, a bar or line chart is easier to read.',
    faqs: [
      { q: 'How do I make a pie chart online for free?', a: 'Paste your data as “label, value” lines (for example “Direct, 45”), and the tool draws the slices with percentages automatically. Add a title, pick colors, and download — no sign-up, no watermark.' },
      { q: 'How do I make a donut chart instead?', a: 'Tick the “Donut (ring) style” box and the same data renders as a ring with a hollow centre. Everything else — percentages, legend, downloads — works the same.' },
      { q: 'Are the percentages calculated for me?', a: 'Yes. The tool sums your values and labels each slice with its share of the total, and the legend repeats the value and percentage — you just paste the raw numbers.' },
      { q: 'Is my data uploaded to make the chart?', a: 'No. The pie chart is generated in your browser from the text you paste, so your data stays on your device and the tool works offline after loading.' },
      { q: 'Why should a pie chart only use positive numbers?', a: 'A pie shows each value’s share of a total, and a share can’t be negative, so only positive values are drawn. If you have negative numbers (like profit and loss), a bar chart is the right choice.' },
    ],
    keywords: ['pie chart maker', 'donut chart maker', 'create pie chart online', 'pie chart generator', 'make a pie chart', 'pie chart with percentages', 'free pie chart maker'],
  },
  {
    slug: 'funnel-chart-maker',
    name: 'Funnel Chart Maker',
    icon: '🫙',
    description:
      'Make a funnel chart to show conversion through stages — paste “stage, value” lines and get each stage’s drop-off and percentage of the top. Download PNG or SVG, nothing uploaded.',
    lead: 'Paste your funnel stages as “label, value” lines and get a clean funnel chart with each stage’s percentage of the top — download a crisp PNG or an editable SVG in your browser.',
    widget: 'funnel',
    how: 'Enter one “stage, value” pair per line, from the widest stage at the top to the narrowest at the bottom. The tool draws each stage as a trapezoid whose width is proportional to its value, so the tapering shape shows how many people or items drop off between steps, and labels each stage with its count and its percentage of the first (top) stage. It’s drawn as an SVG in your browser with a 2× PNG export — your numbers are never uploaded.',
    note: 'Funnel charts are made for sequential conversion processes — marketing and sales funnels, sign-up flows, checkout steps, hiring pipelines — where each stage is a subset of the one above it. List the stages in order; the biggest drop between two stages is the bottleneck worth fixing first. For unordered categories that aren’t subsets of each other, a bar chart is the honest choice.',
    faqs: [
      { q: 'How do I make a funnel chart?', a: 'Paste your stages as “label, value” lines, biggest first (for example “Visitors, 12000” then “Sign-ups, 4200”). The tool draws the tapering funnel and labels each stage with its value and its percentage of the top stage. Download as PNG or SVG.' },
      { q: 'What is a funnel chart used for?', a: 'To visualise how many people or items make it through each step of a sequential process — a marketing or sales funnel, a sign-up or checkout flow, a recruiting pipeline. The narrowing shape shows drop-off between stages.' },
      { q: 'How is the percentage calculated?', a: 'Each stage is labelled with its share of the first (top) stage, so you can see overall conversion at a glance. The top stage is 100%, and each stage below shows what fraction of that starting total remains.' },
      { q: 'What order should the stages be in?', a: 'Top to bottom, from the largest stage to the smallest, following the real sequence. Each stage should be a subset of the one above it — that’s what makes a funnel meaningful.' },
      { q: 'Is my data uploaded?', a: 'No. The funnel is drawn in your browser from the text you paste, so your data stays on your device and the tool works offline once loaded.' },
    ],
    keywords: ['funnel chart maker', 'sales funnel chart', 'conversion funnel maker', 'funnel chart generator', 'make a funnel chart', 'marketing funnel chart', 'free funnel chart maker'],
  },
  {
    slug: 'radar-chart-maker',
    name: 'Radar Chart Maker',
    icon: '🕸️',
    description:
      'Make a radar (spider) chart from your data — paste “axis, value” lines and get a multi-axis polygon for comparing strengths. Download PNG or SVG, all in your browser.',
    lead: 'Paste your data as “axis, value” lines and get a radar (spider) chart — great for skills, ratings and multi-attribute comparisons. Download a crisp PNG or an editable SVG.',
    widget: 'radar',
    how: 'Enter one “axis, value” pair per line — each line becomes a spoke radiating from the centre. The tool scales every value against the largest, plots a point along each spoke, and connects them into a filled polygon over concentric grid rings. The further a point sits from the centre, the higher the value on that axis, so the overall shape shows strengths and weaknesses at a glance. Drawn as an SVG in your browser, with a 2× PNG export and no upload.',
    note: 'Radar charts (also called spider or web charts) suit three or more comparable attributes measured on a similar scale — a character’s stats, a product’s ratings, a candidate’s skills. They’re best for showing an overall profile or shape rather than precise readings; if exact comparison matters, a bar chart is easier to read. Keep it to a handful of axes so the shape stays legible.',
    faqs: [
      { q: 'How do I make a radar chart?', a: 'Paste one “axis, value” pair per line (for example “Speed, 8”), with at least three axes. The tool draws the spokes, scales your values and connects them into a filled polygon. Download as PNG or SVG.' },
      { q: 'What is a radar chart good for?', a: 'Comparing several attributes of one or a few items on a common scale — skill sets, product or game-character stats, survey dimensions. The polygon’s shape shows the overall profile of strengths and weaknesses.' },
      { q: 'How many axes can a radar chart have?', a: 'At least three (fewer can’t form a polygon) and ideally up to around eight to ten; beyond that the labels crowd and the shape gets hard to read. This tool handles up to twelve axes.' },
      { q: 'Are the values scaled?', a: 'Yes — every value is scaled against the largest one in your data, which becomes the outer ring, so axes with different natural ranges still plot on the same chart. Use similar scales across axes for a fair comparison.' },
      { q: 'Is a radar chart the same as a spider chart?', a: 'Yes — “radar chart,” “spider chart” and “web chart” are all names for the same multi-axis plot. This maker produces exactly that, downloadable as PNG or SVG.' },
    ],
    keywords: ['radar chart maker', 'spider chart maker', 'radar chart generator', 'spider graph maker', 'make a radar chart', 'web chart maker', 'free radar chart maker'],
  },
  {
    slug: 'waterfall-chart-maker',
    name: 'Waterfall Chart Maker',
    icon: '🪜',
    description:
      'Make a waterfall chart showing a running total — paste a starting value then positive and negative changes, and see how each contributes. Download PNG or SVG, nothing uploaded.',
    lead: 'Paste a starting value followed by positive and negative changes, and get a waterfall chart of the running total — download a crisp PNG or an editable SVG in your browser.',
    widget: 'waterfall',
    how: 'Enter one “label, value” pair per line. The first line is treated as a starting total drawn from zero; each line after it is a change that floats up (for a positive value) or down (for a negative one) from wherever the running total left off, so you can see exactly how each item builds up or eats into the total. Positive and negative steps are coloured differently, dashed connectors link them, and each bar is labelled with its signed value. Drawn as an SVG in your browser with a 2× PNG export — your data is never uploaded.',
    note: 'Waterfall charts (also called bridge or cascade charts) are ideal for explaining how a starting figure becomes an ending figure through a series of gains and losses — revenue to profit, budget variance, inventory changes, headcount movement. Enter negative changes with a minus sign (for example “Refunds, -180”). Order the steps the way the story flows; the chart’s job is to make each contribution visible.',
    faqs: [
      { q: 'How do I make a waterfall chart?', a: 'Paste a starting value first (for example “Start, 1000”), then each change on its own line, using a minus sign for decreases (“Fees, -120”). The tool floats each bar from the running total and labels its signed value. Download as PNG or SVG.' },
      { q: 'What is a waterfall chart used for?', a: 'Showing how an initial value becomes a final value through a sequence of increases and decreases — profit bridges, budget variance, cash-flow movement, headcount changes. Each floating bar is one contribution to the running total.' },
      { q: 'How do I enter decreases?', a: 'Put a minus sign in front of the value, like “Refunds, -180”. Positive and negative steps are drawn in different colours and float down or up from the previous running total accordingly.' },
      { q: 'What is the first value?', a: 'The first line is treated as the starting total and is drawn as a full bar from zero. Every line after it is a change relative to the running total, so the chart reads left to right as a story.' },
      { q: 'Is a waterfall chart the same as a bridge chart?', a: 'Yes — “waterfall,” “bridge” and “cascade” chart are different names for the same running-total visualisation. This maker builds it from your data and exports PNG or SVG.' },
    ],
    keywords: ['waterfall chart maker', 'bridge chart maker', 'waterfall chart generator', 'cascade chart maker', 'make a waterfall chart', 'running total chart', 'free waterfall chart maker'],
  },
];

export const getChartTool = (slug: string) => CHART_TOOLS.find((t) => t.slug === slug);
