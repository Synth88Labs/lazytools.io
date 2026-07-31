import { useState, useEffect } from 'preact/hooks';
import { signJwt, type JwtAlgo } from '../../lib/crypto-sign';

const SAMPLE_PAYLOAD = `{
  "sub": "1234567890",
  "name": "Jane Doe",
  "admin": true,
  "iat": 1516239022
}`;

const ALGOS: JwtAlgo[] = ['HS256', 'HS384', 'HS512'];

export default function JwtEncoderTool() {
  const [payload, setPayload] = useState(SAMPLE_PAYLOAD);
  const [secret, setSecret] = useState('your-256-bit-secret');
  const [algo, setAlgo] = useState<JwtAlgo>('HS256');
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (!payload.trim()) {
      setError('');
      setToken('');
      return;
    }

    let obj: Record<string, unknown>;
    try {
      const parsed = JSON.parse(payload);
      if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
        throw new Error('not an object');
      }
      obj = parsed as Record<string, unknown>;
    } catch {
      setError("Payload isn't valid JSON");
      setToken('');
      return;
    }

    setError('');

    signJwt(obj, secret, algo)
      .then((jwt) => {
        if (!cancelled) setToken(jwt);
      })
      .catch(() => {
        if (!cancelled) {
          setToken('');
          setError('Could not sign the token.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [payload, secret, algo]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(id);
  }, [copied]);

  const copy = () => {
    if (!token) return;
    void navigator.clipboard?.writeText(token).then(() => setCopied(true));
  };

  const segments = token ? token.split('.') : [];

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="space-y-4">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700" for="jwt-payload">
            Payload (JSON)
          </label>
          <textarea
            id="jwt-payload"
            rows={8}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            value={payload}
            onInput={(e) => setPayload((e.target as HTMLTextAreaElement).value)}
            spellcheck={false}
          />
          {error ? (
            <p class="mt-1 text-xs font-medium text-red-600">{error}</p>
          ) : null}
        </div>

        <div class="grid gap-4 sm:grid-cols-2">
          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="jwt-algo">
              Algorithm
            </label>
            <select
              id="jwt-algo"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
              value={algo}
              onChange={(e) => setAlgo((e.target as HTMLSelectElement).value as JwtAlgo)}
            >
              {ALGOS.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label class="mb-1 block text-sm font-medium text-slate-700" for="jwt-secret">
              Secret
            </label>
            <input
              id="jwt-secret"
              type="text"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
              value={secret}
              onInput={(e) => setSecret((e.target as HTMLInputElement).value)}
              spellcheck={false}
            />
          </div>
        </div>

        <p class="text-xs text-slate-500">
          Only HS* algorithms (HMAC with a shared secret) are supported. RS/ES
          (public-key) signing needs a private key and isn&apos;t offered here.
        </p>

        <div>
          <div class="mb-1 flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700">Signed token</span>
            <button
              type="button"
              onClick={copy}
              disabled={!token}
              class="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div class="min-h-[3rem] w-full break-all rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs">
            {segments.length === 3 ? (
              <>
                <span class="text-red-600">{segments[0]}</span>
                <span class="text-slate-400">.</span>
                <span class="text-fuchsia-600">{segments[1]}</span>
                <span class="text-slate-400">.</span>
                <span class="text-sky-600">{segments[2]}</span>
              </>
            ) : (
              <span class="text-slate-400">
                {error ? '—' : 'Enter a payload and secret to build a token.'}
              </span>
            )}
          </div>
          {segments.length === 3 ? (
            <p class="mt-1 text-[11px] text-slate-500">
              <span class="font-medium text-red-600">header</span>
              {' · '}
              <span class="font-medium text-fuchsia-600">payload</span>
              {' · '}
              <span class="font-medium text-sky-600">signature</span>
            </p>
          ) : null}
        </div>

        <p class="text-xs text-slate-500">
          This creates (signs) a token. To read one, use the JWT decoder to
          inspect a token. Your secret and payload never leave your browser —
          signing happens entirely on your device.
        </p>
      </div>
    </div>
  );
}
