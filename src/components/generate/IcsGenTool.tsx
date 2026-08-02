import { useMemo, useState } from 'preact/hooks';
import { buildIcs } from '../../lib/ics';

function nowStamp(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getUTCFullYear()}${p(d.getUTCMonth() + 1)}${p(d.getUTCDate())}T${p(d.getUTCHours())}${p(d.getUTCMinutes())}${p(d.getUTCSeconds())}Z`;
}
function uid(): string {
  const r = (globalThis.crypto && 'randomUUID' in globalThis.crypto) ? globalThis.crypto.randomUUID() : Math.abs(Date.parse(new Date().toISOString())).toString(36);
  return `${r}@lazytools.io`;
}

export default function IcsGenTool() {
  const [title, setTitle] = useState('Team Sync');
  const [start, setStart] = useState('2024-06-03T09:30');
  const [end, setEnd] = useState('2024-06-03T10:30');
  const [allDay, setAllDay] = useState(false);
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [recurrence, setRecurrence] = useState('none');
  const [count, setCount] = useState('');
  const [copied, setCopied] = useState(false);
  // stable per session so re-renders don't churn the UID/timestamp
  const stamp = useMemo(nowStamp, []);
  const id = useMemo(uid, []);

  const { ics, error } = useMemo(() => {
    try {
      return {
        ics: buildIcs({
          title, start, end: end || undefined, allDay,
          location: location || undefined, description: description || undefined, url: url || undefined,
          recurrence, count: count ? parseInt(count, 10) : undefined, uid: id, dtstamp: stamp,
        }),
        error: '',
      };
    } catch (e) { return { ics: '', error: (e as Error).message }; }
  }, [title, start, end, allDay, location, description, url, recurrence, count, id, stamp]);

  const download = () => {
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (title.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'event') + '.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };
  const copy = () => { if (ics) navigator.clipboard?.writeText(ics).then(() => { setCopied(true); setTimeout(() => setCopied(false), 1500); }); };

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const lbl = 'mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block"><span class={lbl}>Event title</span><input class={inp} value={title} onInput={(e) => setTitle((e.target as HTMLInputElement).value)} /></label>

      <label class="mt-3 flex items-center gap-1.5 text-sm text-slate-600"><input type="checkbox" checked={allDay} onChange={(e) => setAllDay((e.target as HTMLInputElement).checked)} /> All-day event</label>

      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <label class="block"><span class={lbl}>Start</span><input type={allDay ? 'date' : 'datetime-local'} class={inp} value={allDay ? start.slice(0, 10) : start} onInput={(e) => setStart((e.target as HTMLInputElement).value)} /></label>
        <label class="block"><span class={lbl}>End {allDay ? '' : '(optional)'}</span><input type={allDay ? 'date' : 'datetime-local'} class={inp} value={allDay ? end.slice(0, 10) : end} onInput={(e) => setEnd((e.target as HTMLInputElement).value)} /></label>
      </div>

      <div class="mt-3 grid gap-3 sm:grid-cols-2">
        <label class="block"><span class={lbl}>Location</span><input class={inp} value={location} onInput={(e) => setLocation((e.target as HTMLInputElement).value)} placeholder="Room 4 / Zoom link" /></label>
        <label class="block"><span class={lbl}>URL</span><input class={inp} value={url} onInput={(e) => setUrl((e.target as HTMLInputElement).value)} placeholder="https://…" /></label>
      </div>

      <label class="mt-3 block"><span class={lbl}>Description</span><textarea rows={2} class={inp} value={description} onInput={(e) => setDescription((e.target as HTMLTextAreaElement).value)} /></label>

      <div class="mt-3 flex flex-wrap items-end gap-3">
        <label class="block"><span class={lbl}>Repeat</span>
          <select class={inp} value={recurrence} onChange={(e) => setRecurrence((e.target as HTMLSelectElement).value)}>
            <option value="none">Does not repeat</option><option value="daily">Daily</option><option value="weekly">Weekly</option><option value="monthly">Monthly</option><option value="yearly">Yearly</option>
          </select>
        </label>
        {recurrence !== 'none' && <label class="block"><span class={lbl}>Occurrences (optional)</span><input type="number" min="1" class={`${inp} w-40`} value={count} onInput={(e) => setCount((e.target as HTMLInputElement).value)} placeholder="e.g. 10" /></label>}
      </div>

      {error ? <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p> : (
        <div class="mt-4">
          <div class="mb-2 flex items-center justify-between">
            <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">.ics file</span>
            <div class="flex gap-2">
              <button onClick={copy} class="rounded-lg bg-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-300">{copied ? '✓ Copied' : 'Copy'}</button>
              <button onClick={download} class="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white hover:bg-brand-800">⬇ Download .ics</button>
            </div>
          </div>
          <textarea readonly rows={8} class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-800" value={ics} />
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Generates a standard RFC 5545 .ics file that opens in Apple Calendar, Google Calendar, Outlook and any calendar app. Special characters in the title and description are escaped, long lines are folded, and times are written as “floating” local times (no timezone), so the event shows at the same clock time wherever it’s opened. 🔒 Built entirely in your browser — nothing is uploaded.</p>
    </div>
  );
}
