import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

interface Props {
  mode: 'excel-to-csv' | 'excel-to-json' | 'csv-to-excel';
}

const ACCEPT_MAP: Record<Props['mode'], string> = {
  'excel-to-csv': '.xlsx,.xls,.csv',
  'excel-to-json': '.xlsx,.xls,.csv',
  'csv-to-excel': '.csv,text/csv',
};

const HINT_MAP: Record<Props['mode'], string> = {
  'excel-to-csv': 'Excel (.xlsx / .xls) or .csv, up to a few MB',
  'excel-to-json': 'Excel (.xlsx / .xls) or .csv, first row is the header',
  'csv-to-excel': 'A .csv file, or paste CSV below',
};

function baseName(name: string): string {
  const i = name.lastIndexOf('.');
  return i > 0 ? name.slice(0, i) : name;
}

function download(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function ExcelConvertTool({ mode }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [sheetNames, setSheetNames] = useState<string[]>([]);
  const [activeSheet, setActiveSheet] = useState('');
  const [wb, setWb] = useState<any>(null);
  const [output, setOutput] = useState('');
  const [pasted, setPasted] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [done, setDone] = useState('');

  const ACCEPT = ACCEPT_MAP[mode];
  const HINT = HINT_MAP[mode];

  function convertSheet(book: any, name: string, XLSX: any) {
    const ws = book.Sheets[name];
    if (!ws) {
      setOutput('');
      return;
    }
    if (mode === 'excel-to-json') {
      const rows = XLSX.utils.sheet_to_json(ws);
      setOutput(JSON.stringify(rows, null, 2));
    } else {
      setOutput(XLSX.utils.sheet_to_csv(ws));
    }
  }

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0] ?? null;
    setError('');
    setOutput('');
    setDone('');
    setCopied(false);
    setWb(null);
    setSheetNames([]);
    setActiveSheet('');
    setFile(f);
    if (!f) return;

    if (mode === 'csv-to-excel') {
      // Read CSV text; conversion happens on button click.
      try {
        setBusy(true);
        const text = await f.text();
        setPasted(text);
      } catch {
        setError('Could not read that file. Please try another.');
      } finally {
        setBusy(false);
      }
      return;
    }

    try {
      setBusy(true);
      const XLSX: any = await import('xlsx');
      const data = await f.arrayBuffer();
      const book = XLSX.read(data, { type: 'array' });
      if (!book.SheetNames || book.SheetNames.length === 0) {
        setError('This file has no sheets to convert.');
        return;
      }
      setWb(book);
      setSheetNames(book.SheetNames);
      const first = book.SheetNames[0];
      setActiveSheet(first);
      convertSheet(book, first, XLSX);
    } catch {
      setError('Could not read that spreadsheet. It may be corrupt or an unsupported format.');
    } finally {
      setBusy(false);
    }
  }

  async function onSheetChange(e: Event) {
    const name = (e.target as HTMLSelectElement).value;
    setActiveSheet(name);
    setCopied(false);
    if (!wb) return;
    try {
      setBusy(true);
      const XLSX: any = await import('xlsx');
      convertSheet(wb, name, XLSX);
    } catch {
      setError('Could not convert that sheet.');
    } finally {
      setBusy(false);
    }
  }

  async function copyOut() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setError('Copy failed. You can select the text manually.');
    }
  }

  function downloadOut() {
    const base = file ? baseName(file.name) : 'data';
    if (mode === 'excel-to-json') {
      download(new Blob([output], { type: 'application/json' }), `${base}.json`);
    } else {
      download(new Blob([output], { type: 'text/csv' }), `${base}.csv`);
    }
  }

  async function makeExcel() {
    const csvText = (file ? pasted : pasted).trim();
    setError('');
    setDone('');
    if (!csvText) {
      setError('Paste some CSV or choose a .csv file first.');
      return;
    }
    try {
      setBusy(true);
      const XLSX: any = await import('xlsx');
      const book = XLSX.read(csvText, { type: 'string' });
      const out = XLSX.write(book, { type: 'array', bookType: 'xlsx' });
      const base = file ? baseName(file.name) : 'data';
      const filename = `${base || 'data'}.xlsx`;
      download(
        new Blob([out], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        filename,
      );
      setDone(`✓ Downloaded ${filename}`);
    } catch {
      setError('Could not build the Excel file. Make sure the CSV is valid.');
    } finally {
      setBusy(false);
    }
  }

  const btn =
    'inline-flex items-center justify-center rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50';
  const btnAlt =
    'inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-brand-400 disabled:cursor-not-allowed disabled:opacity-50';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept={ACCEPT} onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">
          {file ? file.name : 'Choose a file'}
        </span>
        <span class="mt-1 block text-xs text-slate-500">
          {file ? fmtSize(file.size) : HINT}
        </span>
      </label>

      {mode === 'csv-to-excel' && (
        <div class="mt-4">
          <label class="mb-1 block text-xs font-semibold text-slate-600">
            …or paste CSV here
          </label>
          <textarea
            value={pasted}
            onInput={(e) => {
              setPasted((e.target as HTMLTextAreaElement).value);
              setDone('');
            }}
            rows={8}
            placeholder="name,age&#10;Ada,36&#10;Grace,44"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
          />
        </div>
      )}

      {busy && (
        <p class="mt-3 text-sm font-medium text-slate-500">Working…</p>
      )}

      {error && (
        <p class="mt-3 text-sm font-medium text-red-600">{error}</p>
      )}

      {mode !== 'csv-to-excel' && sheetNames.length > 1 && (
        <div class="mt-4">
          <label class="mb-1 block text-xs font-semibold text-slate-600">
            Sheet
          </label>
          <select
            value={activeSheet}
            onChange={onSheetChange}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm"
          >
            {sheetNames.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}

      {mode !== 'csv-to-excel' && output && (
        <div class="mt-4">
          <textarea
            readOnly
            value={output}
            rows={12}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
          />
          <div class="mt-3 flex flex-wrap gap-2">
            <button type="button" class={btn} onClick={downloadOut}>
              Download {mode === 'excel-to-json' ? '.json' : '.csv'}
            </button>
            <button type="button" class={btnAlt} onClick={copyOut}>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          {mode === 'excel-to-json' && (
            <p class="mt-2 text-xs text-slate-500">
              The first row of the sheet is treated as the header; each following
              row becomes a JSON object.
            </p>
          )}
        </div>
      )}

      {mode === 'csv-to-excel' && (
        <div class="mt-4">
          <button
            type="button"
            class={btn}
            onClick={makeExcel}
            disabled={busy}
          >
            Convert to Excel (.xlsx)
          </button>
          {done && (
            <p class="mt-3 text-sm font-medium text-green-600">{done}</p>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-400">
        Everything runs in your browser, nothing is uploaded to any server.
      </p>
    </div>
  );
}
