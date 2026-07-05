import { useState } from 'preact/hooks';
import { assessPassword } from '../../lib/security-compute';

export default function PasswordStrengthTool() {
  const [pw, setPw] = useState('');
  const [show, setShow] = useState(true);

  const r = pw ? assessPassword(pw) : null;
  const color =
    !r ? 'bg-slate-200' :
    r.label === 'Excellent' ? 'bg-mint-600' :
    r.label === 'Strong' ? 'bg-mint-500' :
    r.label === 'Fair' ? 'bg-amber-400' :
    r.label === 'Weak' ? 'bg-amber-500' : 'bg-red-500';
  const pct = !r ? 0 : Math.min(100, (r.entropyBits / 110) * 100);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label for="ps-in" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Type or paste a password</label>
      <div class="flex gap-2">
        <input
          id="ps-in"
          type={show ? 'text' : 'password'}
          value={pw}
          onInput={(e) => setPw((e.target as HTMLInputElement).value)}
          placeholder="Checked locally — never transmitted"
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-base text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
          autocomplete="off"
          spellcheck={false}
        />
        <button type="button" onClick={() => setShow(!show)} class="rounded-xl border border-slate-300 bg-white px-3 text-sm text-slate-600 hover:border-brand-400" aria-label={show ? 'Hide password' : 'Show password'}>
          {show ? '🙈' : '👁'}
        </button>
      </div>

      <div class="mt-4 flex items-center gap-3">
        <span class="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-200">
          <span class={`block h-full rounded-full transition-all ${color}`} style={`width:${pct}%`} />
        </span>
        <span class="min-w-32 text-right text-sm font-bold text-slate-800" aria-live="polite">
          {r ? `${r.label} · ~${r.entropyBits} bits` : '—'}
        </span>
      </div>

      {r && (
        <div class="mt-4 rounded-xl border border-brand-100 bg-white p-4" aria-live="polite">
          <div class="grid gap-2 text-sm sm:grid-cols-3">
            <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Length</span><span class="font-mono font-bold text-slate-900">{pw.length} chars</span></div>
            <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Alphabet in use</span><span class="font-mono font-bold text-slate-900">{r.charsetSize} symbols</span></div>
            <div class="rounded-lg bg-slate-50 px-3 py-2"><span class="block text-xs font-semibold uppercase text-slate-500">Entropy estimate</span><span class="font-mono font-bold text-slate-900">~{r.entropyBits} bits</span></div>
          </div>
          {r.warnings.length > 0 ? (
            <ul class="mt-3 space-y-1.5">
              {r.warnings.map((w) => (
                <li class="text-sm font-medium text-amber-800">⚠ {w}</li>
              ))}
            </ul>
          ) : (
            <p class="mt-3 text-sm text-slate-600">
              No weakness patterns detected. Remember the limit of any checker: it can prove weakness, not strength —
              a <a href="/generate/password-generator/" class="font-medium text-brand-700 underline decoration-brand-300 underline-offset-2">generated random password</a> is the only kind whose entropy is guaranteed.
            </p>
          )}
        </div>
      )}
      <p class="mt-3 text-xs text-slate-500">Evaluated entirely in your browser — nothing typed here is transmitted, stored or logged.</p>
    </div>
  );
}
