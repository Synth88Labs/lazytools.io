import { useState } from 'preact/hooks';
import { fmtSize } from '../../lib/audio-compute';

interface QpdfModule {
  callMain(args: string[]): number;
  FS: { writeFile(path: string, data: Uint8Array): void; readFile(path: string): Uint8Array };
}
type QpdfFactory = (opts: {
  locateFile: (f: string) => string;
  print: (l: string) => void;
  printErr: (l: string) => void;
}) => Promise<QpdfModule>;

/** qpdf is a classic Emscripten UMD script; load it from /vendor/ as a plain tag. */
async function loadQpdfFactory(): Promise<QpdfFactory> {
  const w = window as unknown as { exports?: { Module?: QpdfFactory }; __qpdfFactory?: QpdfFactory };
  if (w.__qpdfFactory) return w.__qpdfFactory;
  w.exports = w.exports ?? {};
  await new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = '/vendor/qpdf.js';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Could not load the qpdf engine, check your connection and retry.'));
    document.head.appendChild(s);
  });
  const factory = w.exports?.Module;
  if (!factory) throw new Error('qpdf engine loaded but did not register.');
  w.__qpdfFactory = factory;
  return factory;
}

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
    code = typeof (e as { status?: number })?.status === 'number' ? (e as { status: number }).status : 1;
  }
  if (code !== 0) {
    const msg = stderr.join(' ').replace(/^qpdf:\s*/i, '').trim();
    throw new Error(msg || `qpdf exited with code ${code}.`);
  }
  return mod.FS.readFile('/out.pdf') as Uint8Array;
}

const OPT_ARGS = ['--object-streams=generate', '--recompress-flate', '--compression-level=9'];

interface Result { url: string; name: string; inBytes: number; outBytes: number; alreadyOptimal: boolean }

export default function CompressPdfTool() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<Result | null>(null);

  const reset = () => { setResult(null); setError(''); };

  const onFile = (f: File | null) => {
    reset();
    setFile(f);
  };

  const compress = async () => {
    if (!file) return;
    setBusy(true); setError(''); setResult(null);
    try {
      const input = new Uint8Array(await file.arrayBuffer());
      let out: Uint8Array;
      try {
        out = await runQpdf(input, OPT_ARGS);
      } catch (e) {
        const m = (e as Error).message;
        if (/password|encrypt/i.test(m)) {
          throw new Error('This PDF is password-protected. Remove the password first (see our Unlock PDF tool), then compress.');
        }
        throw e;
      }
      // Keep whichever is smaller, never hand back a bigger file.
      const alreadyOptimal = out.byteLength >= input.byteLength;
      const bytes = alreadyOptimal ? input : out;
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setResult({
        url: URL.createObjectURL(blob),
        name: file.name.replace(/\.pdf$/i, '') + '-compressed.pdf',
        inBytes: input.byteLength,
        outBytes: bytes.byteLength,
        alreadyOptimal,
      });
    } catch (e) {
      setError((e as Error).message || 'Could not compress this PDF.');
    } finally {
      setBusy(false);
    }
  };

  const pct = result ? Math.max(0, Math.round((1 - result.outBytes / result.inBytes) * 100)) : 0;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-brand-400">
        <input type="file" accept="application/pdf,.pdf" class="hidden" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="text-sm font-semibold text-slate-700">{file ? `📄 ${file.name}` : '📄 Choose a PDF file'}</span>
        <span class="mt-1 block text-xs text-slate-500">{file ? fmtSize(file.size) : 'or drag it onto this box, nothing is uploaded'}</span>
      </label>

      <div class="mt-4">
        <button onClick={compress} disabled={!file || busy} class="rounded-xl bg-brand-700 px-6 py-2.5 text-sm font-semibold text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50">
          {busy ? 'Compressing…' : 'Compress PDF'}
        </button>
      </div>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">{error}</p>}

      {result && (
        <div class="mt-4 rounded-xl bg-white p-4 ring-2 ring-brand-200">
          {result.alreadyOptimal ? (
            <p class="text-sm text-slate-700">
              This PDF is already well-optimized, lossless recompression couldn’t make it meaningfully smaller ({fmtSize(result.inBytes)}). You can still download the processed copy below.
            </p>
          ) : (
            <p class="text-sm text-slate-700">
              Reduced from <strong>{fmtSize(result.inBytes)}</strong> to <strong class="text-brand-800">{fmtSize(result.outBytes)}</strong>, <strong class="text-emerald-600">{pct}% smaller</strong>, with no loss of quality.
            </p>
          )}
          <a href={result.url} download={result.name} class="mt-3 inline-block rounded-xl bg-brand-700 px-5 py-2 text-sm font-semibold text-white hover:bg-brand-800">⬇ Download compressed PDF</a>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">
        Compression is <strong>lossless</strong>: qpdf recompresses the PDF’s internal data streams at maximum level and consolidates objects, so text stays selectable and images keep their exact quality, nothing is rasterized or downsampled. Savings are largest on PDFs exported without optimization; already-optimized files may shrink little. 🔒 Runs entirely in your browser via qpdf (WebAssembly), your document is never uploaded.
      </p>
    </div>
  );
}
