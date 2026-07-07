import { useState } from 'preact/hooks';
import { parseCron, cronDescribe, cronNextRuns } from '../../lib/net';

const PRESETS: [string, string][] = [
  ['*/5 * * * *', 'every 5 minutes'],
  ['0 * * * *', 'hourly'],
  ['0 0 * * *', 'daily at midnight'],
  ['0 9 * * 1-5', '9:00 on weekdays'],
  ['0 0 * * 0', 'weekly (Sunday)'],
  ['0 0 1 * *', 'monthly (1st)'],
  ['30 3 * * 6', '03:30 every Saturday'],
];

const FIELD_INFO = [
  ['Minute', '0–59'],
  ['Hour', '0–23'],
  ['Day of month', '1–31'],
  ['Month', '1–12 or JAN–DEC'],
  ['Day of week', '0–7 or SUN–SAT (0 and 7 = Sunday)'],
];

export default function CronParserTool() {
  const [expr, setExpr] = useState('0 9 * * 1-5');

  const parsed = parseCron(expr);
  const fields = expr.trim().split(/\s+/);
  const next = parsed ? cronNextRuns(parsed, new Date(), 5) : [];
  const fmt = new Intl.DateTimeFormat(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block max-w-lg">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Cron expression (5 fields)</span>
        <input
          class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 font-mono text-lg text-slate-900 focus:border-brand-500 focus:outline-none"
          value={expr}
          onInput={(e) => setExpr((e.target as HTMLInputElement).value)}
          placeholder="*/15 9-17 * * 1-5"
        />
      </label>

      <div class="mt-2 flex flex-wrap gap-2">
        {PRESETS.map(([p, label]) => (
          <button
            type="button"
            class="rounded-lg border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-600 transition hover:border-brand-400 hover:text-brand-700"
            onClick={() => setExpr(p)}
          >
            <span class="font-mono">{p}</span> · {label}
          </button>
        ))}
      </div>

      {!parsed && expr.trim() !== '' && (
        <p class="mt-4 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800">
          Not a valid 5-field cron expression. Fields are minute, hour, day-of-month, month, day-of-week — separated by spaces.
        </p>
      )}

      {parsed && (
        <>
          <div class="mt-5 rounded-xl border border-brand-200 bg-brand-50 px-4 py-3">
            <p class="text-lg font-semibold text-slate-900">{cronDescribe(parsed)}</p>
          </div>

          <div class="mt-4 grid gap-4 lg:grid-cols-2">
            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-600">
                  <tr><th class="px-4 py-2 font-semibold" colSpan={3}>Field breakdown</th></tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  {FIELD_INFO.map(([name, range], i) => (
                    <tr>
                      <td class="px-4 py-1.5 font-mono font-bold text-brand-700">{fields[i]}</td>
                      <td class="px-4 py-1.5 text-slate-700">{name}</td>
                      <td class="px-4 py-1.5 text-xs text-slate-400">{range}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div class="overflow-x-auto rounded-xl border border-slate-200 bg-white">
              <table class="w-full text-left text-sm">
                <thead class="bg-slate-50 text-slate-600">
                  <tr><th class="px-4 py-2 font-semibold">Next {next.length} runs (your local time)</th></tr>
                </thead>
                <tbody class="divide-y divide-slate-100 font-mono">
                  {next.map((d) => (
                    <tr><td class="px-4 py-1.5 text-slate-800">{fmt.format(d)}</td></tr>
                  ))}
                  {next.length === 0 && <tr><td class="px-4 py-2 text-slate-500">No runs in the next 5 years (impossible date combination?)</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Next-run times use your browser's timezone — the machine running the real crontab may use another (often UTC). Parsed entirely locally.
      </p>
    </div>
  );
}
