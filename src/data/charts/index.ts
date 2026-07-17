/** Charts & Design registry — client-side chart makers (SVG/PNG, no upload). */

export interface ChartToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'bar' | 'line' | 'pie';
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
];

export const getChartTool = (slug: string) => CHART_TOOLS.find((t) => t.slug === slug);
