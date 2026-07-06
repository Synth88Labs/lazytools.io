import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

interface Props {
  mode: 'unlock' | 'protect';
}

interface QpdfModule {
  callMain(args: string[]): number;
  FS: { writeFile(path: string, data: Uint8Array): void; readFile(path: string): Uint8Array };
}
type QpdfFactory = (opts: {
  locateFile: (f: string) => string;
  print: (l: string) => void;
  printErr: (l: string) => void;
}) => Promise<QpdfModule>;

/**
 * qpdf ships as a classic Emscripten UMD script; bundler CJS-interop breaks its
 * export shim, so we serve it from /vendor/ and load it as a plain script tag.
 */
async function loadQpdfFactory(): Promise<QpdfFactory> {
  const w = window as unknown as { exports?: { Module?: QpdfFactory }; __qpdfFactory?: QpdfFactory };
  if (w.__qpdfFactory) return w.__qpdfFactory;
  w.exports = w.exports ?? {}; // the UMD footer assigns exports["Module"]
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = '/vendor/qpdf.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load the qpdf engine — check your connection and retry.'));
    document.head.appendChild(s);
  });
  const factory = w.exports?.Module;
  if (!factory) throw new Error('qpdf engine loaded but did not register.');
  w.__qpdfFactory = factory;
  return factory;
}

class QpdfError extends Error {
  constructor(message: string, readonly code: number, readonly stderr: string) {
    super(message);
  }
}

/** Run one qpdf CLI invocation in a fresh wasm instance; returns output bytes. */
async function runQpdf(input: Uint8Array, args: string[]): Promise<Uint8Array> {
  const factory = await loadQpdfFactory();
  const stderr: string[] = [];
  const mod = await factory({
    locateFile: () => '/vendor/qpdf.wasm',
    print: () => {},
    printErr: (line: string) => stderr.push(line),
  });
  mod.FS.writeFile('/in.pdf', input);
  let code: number;
  try {
    code = mod.callMain([...args, '/in.pdf', '/out.pdf']);
  } catch (e) {
    // Emscripten throws ExitStatus on non-zero exit in some builds
    code = typeof (e as { status?: number })?.status === 'number' ? (e as { status: number }).status : 1;
  }
  if (code !== 0) {
    const msg = stderr.join(' ').replace(/^qpdf:\s*/i, '').trim();
    throw new QpdfError(msg || `qpdf exited with code ${code}.`, code, msg);
  }
  return mod.FS.readFile('/out.pdf') as Uint8Array;
}

export default function PdfPasswordTool({ mode }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
  const [ownerPassword, setOwnerPassword] = useState('');
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState('');

  function onFile(e: Event) {
    setFile((e.target as HTMLInputElement).files?.[0] ?? null);
    setError('');
    setDone('');
  }

  async function run() {
    if (!file) return;
    if (mode === 'protect' && !password) return;
    setBusy(true);
    setError('');
    setDone('');
    try {
      const input = new Uint8Array(await file.arrayBuffer());
      const args =
        mode === 'unlock'
          ? [`--password=${password}`, '--decrypt']
          : ['--encrypt', password, ownerPassword || password, '256', '--'];
      const out = await runQpdf(input, args);
      const ab = new ArrayBuffer(out.byteLength);
      new Uint8Array(ab).set(out);
      const blob = new Blob([ab], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const base = file.name.replace(/\.pdf$/i, '');
      a.href = url;
      a.download = mode === 'unlock' ? `${base}-unlocked.pdf` : `${base}-protected.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setDone(`✓ ${a.download} (${fmtSize(blob.size)}) — download started.`);
    } catch (e) {
      const err = e as QpdfError;
      const wrongPw = err instanceof QpdfError && (/invalid password/i.test(err.stderr) || (mode === 'unlock' && err.code === 2));
      if (wrongPw) {
        setError(password
          ? 'Wrong password — that password does not decrypt this PDF. Check it and try again.'
          : 'This PDF needs a password to open — enter it above. (Leave empty only for files that open freely but restrict printing/copying.)');
      } else {
        setError(err.message || 'Processing failed — the file may be damaged or use an unsupported encryption.');
      }
    }
    setBusy(false);
  }

  const inputCls =
    'w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="application/pdf" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{file ? file.name : 'Choose a PDF'}</span>
        <span class="mt-1 block text-xs text-slate-500">
          {file ? fmtSize(file.size) : mode === 'unlock' ? 'A password-protected PDF you have the right to open' : 'The PDF to password-protect'}
        </span>
      </label>

      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label for="pp-pass" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">
            {mode === 'unlock' ? 'PDF password (leave empty if it opens without one)' : 'Password (required to open the PDF)'}
          </label>
          <div class="flex gap-2">
            <input
              id="pp-pass"
              type={show ? 'text' : 'password'}
              value={password}
              onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
              placeholder={mode === 'unlock' ? 'The password it opens with' : 'Use a strong, stored password'}
              class={inputCls}
              autocomplete="off"
            />
            <button type="button" onClick={() => setShow(!show)} class="rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-600 hover:border-brand-400" aria-label={show ? 'Hide password' : 'Show password'}>
              {show ? '🙈' : '👁'}
            </button>
          </div>
        </div>
        {mode === 'protect' && (
          <div>
            <label for="pp-owner" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Owner password (optional — defaults to the same)</label>
            <input
              id="pp-owner"
              type={show ? 'text' : 'password'}
              value={ownerPassword}
              onInput={(e) => setOwnerPassword((e.target as HTMLInputElement).value)}
              placeholder="Controls permissions like printing"
              class={inputCls}
              autocomplete="off"
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={run}
        disabled={busy || !file || (mode === 'protect' && !password)}
        class="mt-4 w-full rounded-xl bg-brand-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-brand-800 disabled:opacity-40 sm:w-auto sm:px-8"
      >
        {busy ? 'Working…' : mode === 'unlock' ? '🔓 Remove password & download' : '🔒 Encrypt & download'}
      </button>

      <div aria-live="polite">
        {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}
        {done && <p class="mt-3 text-sm font-medium text-mint-700">{done}</p>}
      </div>
      <p class="mt-3 text-xs text-slate-500">
        Runs qpdf (the standard PDF transformation engine) compiled to WebAssembly, on your device — neither the document nor the password is ever transmitted.
        {mode === 'unlock' && ' Only unlock documents you have the legal right to open.'}
      </p>
    </div>
  );
}
