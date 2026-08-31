import { useMemo, useState } from 'preact/hooks';
import { diffJson, formatDiff, type Change } from '../../lib/json-diff';

const SAMPLE_A = '{"name":"Ada","roles":["admin","user"],"active":true}';
const SAMPLE_B = '{"name":"Ada","roles":["admin","editor"],"active":false,"age":36}';

const MAX_ROWS = 1000;

interface ParseResult {
  aError: string | null;
  bError: string | null;
  changes: Change[] | null;
}

function parseSide(text: string): { value?: unknown; error: string | null } {
  const trimmed = text.trim();
  if (!trimmed) return { error: 'Empty, paste or type JSON here.' };
  try {
    return { value: JSON.parse(trimmed), error: null };
  } catch (e) {
    return { error: e instanceof Error ? e.message : 'Invalid JSON.' };
  }
}

export default function JsonDiffTool() {
  const [a, setA] = useState(SAMPLE_A);
  const [b, setB] = useState(SAMPLE_B);
  const [copied, setCopied] = useState(false);
  const [showNote, setShowNote] = useState(false);

  const result = useMemo<ParseResult>(() => {
    const pa = parseSide(a);
    const pb = parseSide(b);
    if (pa.error || pb.error) {
      return { aError: pa.error, bError: pb.error, changes: null };
    }
    return { aError: null, bError: null, changes: diffJson(pa.value, pb.value) };
  }, [a, b]);

  const changes = result.changes ?? [];
  const added = changes.filter((c) => c.type === 'added').length;
  const removed = changes.filter((c) => c.type === 'removed').length;
  const changed = changes.filter((c) => c.type === 'changed').length;
  const total = changes.length;

  const shown = changes.slice(0, MAX_ROWS);
  const overflow = total - shown.length;

  const j = (v: unknown) => JSON.stringify(v);

  async function copyDiff() {
    try {
      await navigator.clipboard.writeText(formatDiff(changes));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable, ignore */
    }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4 sm:grid-cols-2">
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Original (A)</span>
          <textarea
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            rows={10}
            spellcheck={false}
            value={a}
            onInput={(e) => setA((e.currentTarget as HTMLTextAreaElement).value)}
          />
          {result.aError && (
            <span class="mt-1 block text-xs font-medium text-red-600">Side A invalid: {result.aError}</span>
          )}
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Changed (B)</span>
          <textarea
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            rows={10}
            spellcheck={false}
            value={b}
            onInput={(e) => setB((e.currentTarget as HTMLTextAreaElement).value)}
          />
          {result.bError && (
            <span class="mt-1 block text-xs font-medium text-red-600">Side B invalid: {result.bError}</span>
          )}
        </label>
      </div>

      <div class="mt-4">
        {result.changes === null ? (
          <p class="text-sm text-slate-500">Fix the JSON above to see a structural diff.</p>
        ) : total === 0 ? (
          <p class="rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-sm text-green-700">
            ✓ No differences, the documents are structurally identical (key order and formatting are ignored).
          </p>
        ) : (
          <>
            <div class="flex flex-wrap items-center gap-3">
              <p class="text-sm font-semibold text-slate-800">
                {total} change{total === 1 ? '' : 's'}: {added} added, {removed} removed, {changed} changed
              </p>
              <button
                type="button"
                onClick={copyDiff}
                class="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800"
              >
                {copied ? 'Copied!' : 'Copy diff'}
              </button>
            </div>

            <ul class="mt-3 space-y-1 font-mono text-xs">
              {shown.map((c, i) => {
                if (c.type === 'added') {
                  return (
                    <li key={i} class="rounded bg-green-50 px-2 py-1 text-green-700">
                      <span class="font-bold">+</span> {c.path}: {j(c.newValue)}
                    </li>
                  );
                }
                if (c.type === 'removed') {
                  return (
                    <li key={i} class="rounded bg-red-50 px-2 py-1 text-red-700">
                      <span class="font-bold">-</span> {c.path}: {j(c.oldValue)}
                    </li>
                  );
                }
                return (
                  <li key={i} class="rounded bg-amber-50 px-2 py-1 text-amber-700">
                    <span class="font-bold">~</span> {c.path}: {j(c.oldValue)} → {j(c.newValue)}
                  </li>
                );
              })}
            </ul>

            {overflow > 0 && (
              <p class="mt-2 text-xs italic text-slate-500">…and {overflow} more change{overflow === 1 ? '' : 's'} not shown.</p>
            )}
          </>
        )}
      </div>

      <div class="mt-4 border-t border-slate-200 pt-3">
        <button
          type="button"
          onClick={() => setShowNote((v) => !v)}
          class="text-xs font-medium text-brand-700 hover:text-brand-800 hover:underline"
        >
          {showNote ? 'Hide' : 'What counts as a change?'}
        </button>
        {showNote && (
          <p class="mt-2 text-xs leading-relaxed text-slate-600">
            This is a <strong>semantic (structural)</strong> diff: it compares the parsed data, not the text.
            Reformatting, whitespace, or reordering object keys is <strong>not</strong> reported as a change, only
            keys and values that were actually added, removed, or altered. Arrays are compared by position.
          </p>
        )}
      </div>

      <p class="mt-3 text-xs text-slate-500">
        Everything runs in your browser, nothing is uploaded.
      </p>
    </div>
  );
}
