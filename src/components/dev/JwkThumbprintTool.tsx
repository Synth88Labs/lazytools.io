import { useEffect, useState } from 'preact/hooks';
import { jwkThumbprint, type ThumbHash, type ThumbprintResult } from '../../lib/jwk-thumbprint';

const SAMPLE = `{
  "kty": "EC",
  "crv": "P-256",
  "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
  "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
  "use": "sig",
  "kid": "example"
}`;

export default function JwkThumbprintTool() {
  const [text, setText] = useState(SAMPLE);
  const [hash, setHash] = useState<ThumbHash>('SHA-256');
  const [result, setResult] = useState<ThumbprintResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const t = text.trim();
    if (!t) { setResult(null); setError(null); return; }
    let jwk: Record<string, unknown>;
    try { jwk = JSON.parse(t); } catch { setResult(null); setError('Input is not valid JSON.'); return; }
    jwkThumbprint(jwk, hash).then((r) => { if (!cancelled) { setResult(r); setError(null); } })
      .catch((e) => { if (!cancelled) { setResult(null); setError(e instanceof Error ? e.message : 'Could not compute thumbprint'); } });
    return () => { cancelled = true; };
  }, [text, hash]);

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const copy = (v: string) => navigator.clipboard?.writeText(v);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-3 flex flex-wrap items-center justify-between gap-3">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">JSON Web Key (JWK)</span>
        <label class="text-sm text-slate-600">Hash
          <select class="ml-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm" value={hash} onChange={(e) => setHash((e.target as HTMLSelectElement).value as ThumbHash)}>
            <option value="SHA-256">SHA-256 (RFC 7638 default)</option>
            <option value="SHA-384">SHA-384</option>
            <option value="SHA-512">SHA-512</option>
            <option value="SHA-1">SHA-1 (legacy)</option>
          </select>
        </label>
      </div>
      <textarea rows={8} class={inp} aria-label="JSON Web Key (JWK)" value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} placeholder='{ "kty": "RSA", "n": "…", "e": "AQAB" }' />

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {error}</p>}

      {result && (
        <div class="mt-4 space-y-3">
          {result.hasPrivate && (
            <p class="rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-800 ring-1 ring-amber-200">⚠️ This JWK contains private-key members (like <code>d</code>). The thumbprint only uses the public members, but be careful not to share a private key.</p>
          )}
          <div class="rounded-xl bg-white p-4 ring-2 ring-brand-200">
            <div class="mb-1 flex items-center justify-between"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Thumbprint ({result.hash})</p><button onClick={() => copy(result.thumbprint)} class="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button></div>
            <p class="break-all font-mono text-sm font-bold text-brand-800">{result.thumbprint}</p>
          </div>
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <div class="mb-1 flex items-center justify-between"><p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Thumbprint URI (RFC 9278)</p><button onClick={() => copy(result.uri)} class="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button></div>
            <p class="break-all font-mono text-xs text-slate-700">{result.uri}</p>
          </div>
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Canonical JSON (what gets hashed)</p>
            <p class="break-all font-mono text-xs text-slate-600">{result.canonical}</p>
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Compute the RFC 7638 thumbprint of a JSON Web Key — a stable identifier often used as a <code>kid</code>. It takes the key&#39;s required public members in lexicographic order as compact JSON, hashes them (SHA-256 by default), and base64url-encodes the result, then also builds the RFC 9278 thumbprint URI. Private-key members are ignored in the hash (and flagged), so the same thumbprint identifies a key pair whether you feed it the public or private JWK. Everything runs in your browser — the key is never uploaded. 🔒</p>
    </div>
  );
}
