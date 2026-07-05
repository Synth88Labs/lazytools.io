import { useState } from 'preact/hooks';
import { encryptBytes, decryptBytes } from '../../lib/security-compute';
import { fmtSize } from '../../lib/audio-compute';

export default function FileEncryptTool() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState('');
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
    if (!file || !password) return;
    setBusy(true);
    setError('');
    setDone('');
    try {
      const buf = await file.arrayBuffer();
      let blob: Blob;
      let outName: string;
      if (mode === 'encrypt') {
        blob = await encryptBytes(buf, password);
        outName = `${file.name}.enc`;
      } else {
        blob = new Blob([await decryptBytes(buf, password)]);
        outName = file.name.replace(/\.enc$/i, '') || 'decrypted.bin';
      }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = outName;
      a.click();
      URL.revokeObjectURL(url);
      setDone(`✓ ${mode === 'encrypt' ? 'Encrypted' : 'Decrypted'} → ${outName} (${fmtSize(blob.size)}) — download started.`);
    } catch (e) {
      setError((e as Error).message);
    }
    setBusy(false);
  }

  const tabCls = (active: boolean) =>
    `flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${active ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 hover:text-brand-700'}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
        <button type="button" class={tabCls(mode === 'encrypt')} onClick={() => { setMode('encrypt'); setError(''); setDone(''); }}>🔒 Encrypt</button>
        <button type="button" class={tabCls(mode === 'decrypt')} onClick={() => { setMode('decrypt'); setError(''); setDone(''); }}>🔓 Decrypt</button>
      </div>

      <label class="mt-4 block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" onChange={onFile} class="sr-only" accept={mode === 'decrypt' ? '.enc' : undefined} />
        <span class="text-sm font-semibold text-brand-700">{file ? file.name : `Choose a file to ${mode}`}</span>
        <span class="mt-1 block text-xs text-slate-500">{file ? fmtSize(file.size) : mode === 'decrypt' ? 'A .enc file made with this tool' : 'Any file type — processed locally'}</span>
      </label>

      <label for="fe-pass" class="mt-4 mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Password</label>
      <div class="flex gap-2">
        <input
          id="fe-pass"
          type={show ? 'text' : 'password'}
          value={password}
          onInput={(e) => setPassword((e.target as HTMLInputElement).value)}
          placeholder={mode === 'encrypt' ? 'Use a long, generated password — there is no recovery' : 'The password used to encrypt'}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none"
          autocomplete="off"
        />
        <button type="button" onClick={() => setShow(!show)} class="rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-600 hover:border-brand-400" aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? '🙈' : '👁'}
        </button>
      </div>

      <button
        type="button"
        onClick={run}
        disabled={!file || !password || busy}
        class="mt-4 w-full rounded-xl bg-brand-700 px-4 py-3 text-base font-semibold text-white transition hover:bg-brand-800 disabled:opacity-40 sm:w-auto sm:px-8"
      >
        {busy ? 'Working…' : mode === 'encrypt' ? '🔒 Encrypt & download' : '🔓 Decrypt & download'}
      </button>

      <div aria-live="polite">
        {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}
        {done && <p class="mt-3 text-sm font-medium text-mint-700">{done}</p>}
      </div>
      <p class="mt-3 text-xs text-slate-500">
        AES-256-GCM · PBKDF2-SHA256, 310,000 iterations · runs offline. Forgotten password = unrecoverable data, by design.
      </p>
    </div>
  );
}
