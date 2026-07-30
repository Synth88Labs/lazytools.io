import { useState, useEffect } from 'preact/hooks';
import { totp, secondsRemaining, type TotpAlgo } from '../../lib/totp';
import { base32Decode, base32Encode } from '../../lib/dev-encoders';

/** Group a numeric code for readability: 6 digits -> "XXX XXX", 8 -> "XXXX XXXX". */
function groupCode(code: string): string {
  if (code.length === 8) return `${code.slice(0, 4)} ${code.slice(4)}`;
  if (code.length === 6) return `${code.slice(0, 3)} ${code.slice(3)}`;
  return code;
}

export default function TotpTool() {
  const [secret, setSecret] = useState('');
  const [algo, setAlgo] = useState<TotpAlgo>('SHA-1');
  const [digits, setDigits] = useState(6);
  const [period, setPeriod] = useState(30);

  const [code, setCode] = useState('');
  const [remaining, setRemaining] = useState(period);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const [checkInput, setCheckInput] = useState('');
  const [checkResult, setCheckResult] = useState<'valid' | 'invalid' | null>(null);

  // Live 1-second update of the current code + countdown.
  useEffect(() => {
    let cancelled = false;
    let busy = false; // guard against overlapping async updates

    async function tick() {
      const now = Math.floor(Date.now() / 1000);
      if (!secret.trim()) {
        if (!cancelled) {
          setCode('');
          setError('');
          setRemaining(period);
        }
        return;
      }
      if (busy) return;
      busy = true;
      try {
        const key = base32Decode(secret);
        const c = await totp(key, now, period, digits, algo);
        if (!cancelled) {
          setCode(c);
          setError('');
          setRemaining(secondsRemaining(now, period));
        }
      } catch {
        if (!cancelled) {
          setCode('');
          setError('Not a valid Base32 secret — TOTP secrets use A–Z and 2–7.');
          setRemaining(period);
        }
      } finally {
        busy = false;
      }
    }

    tick();
    const id = setInterval(tick, 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [secret, algo, digits, period]);

  // Reset "copied" and verify result when the underlying config changes.
  useEffect(() => {
    setCopied(false);
    setCheckResult(null);
  }, [secret, algo, digits, period]);

  function generateSecret() {
    const bytes = new Uint8Array(20);
    crypto.getRandomValues(bytes);
    setSecret(base32Encode(bytes));
  }

  async function copyCode() {
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  async function checkCode() {
    setCheckResult(null);
    const candidate = checkInput.replace(/\s+/g, '');
    if (!secret.trim() || !candidate) {
      setCheckResult('invalid');
      return;
    }
    try {
      const key = base32Decode(secret);
      const now = Math.floor(Date.now() / 1000);
      // Allow ±1 window for clock skew.
      const windows = await Promise.all([
        totp(key, now - period, period, digits, algo),
        totp(key, now, period, digits, algo),
        totp(key, now + period, period, digits, algo),
      ]);
      setCheckResult(windows.includes(candidate) ? 'valid' : 'invalid');
    } catch {
      setCheckResult('invalid');
    }
  }

  const pct = Math.max(0, Math.min(100, (remaining / period) * 100));

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <p class="mb-4 text-xs text-slate-500">
        This runs entirely in your browser — your secret never leaves this page. Still, only paste a 2FA
        secret into tools you trust and control.
      </p>

      {/* Secret input */}
      <label class="mb-1 block text-sm font-medium text-slate-700">Base32 secret</label>
      <div class="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          value={secret}
          spellcheck={false}
          autocomplete="off"
          placeholder="JBSWY3DPEHPK3PXP"
          onInput={(e) => setSecret((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono"
        />
        <button
          type="button"
          onClick={generateSecret}
          class="shrink-0 rounded-xl bg-brand-700 px-3 py-2.5 text-sm font-medium text-white hover:bg-brand-800"
        >
          Generate random secret
        </button>
      </div>

      {/* Options */}
      <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Algorithm</label>
          <select
            value={algo}
            onChange={(e) => setAlgo((e.target as HTMLSelectElement).value as TotpAlgo)}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono"
          >
            <option value="SHA-1">SHA-1</option>
            <option value="SHA-256">SHA-256</option>
            <option value="SHA-512">SHA-512</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Digits</label>
          <select
            value={String(digits)}
            onChange={(e) => setDigits(Number((e.target as HTMLSelectElement).value))}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono"
          >
            <option value="6">6</option>
            <option value="8">8</option>
          </select>
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-slate-700">Period (s)</label>
          <input
            type="number"
            min={1}
            value={period}
            onInput={(e) => {
              const v = Number((e.target as HTMLInputElement).value);
              setPeriod(Number.isFinite(v) && v >= 1 ? v : 30);
            }}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono"
          />
        </div>
      </div>

      {/* Live code */}
      <div class="mt-5 rounded-2xl border border-slate-200 bg-white p-4 text-center">
        {!secret.trim() ? (
          <p class="py-4 text-sm text-slate-500">
            Enter or generate a Base32 secret to see the current one-time code.
          </p>
        ) : error ? (
          <p class="py-4 text-sm font-medium text-red-600">{error}</p>
        ) : (
          <>
            <div class="text-4xl font-mono tracking-widest text-slate-900 tabular-nums">
              {code ? groupCode(code) : '––– –––'}
            </div>
            <div class="mt-3 flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={copyCode}
                disabled={!code}
                class="rounded-xl bg-brand-700 px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
              >
                {copied ? 'Copied' : 'Copy'}
              </button>
              <span class="text-sm text-slate-500">
                Refreshes in <span class="font-mono tabular-nums">{remaining}</span>s
              </span>
            </div>
            <div class="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                class="h-full rounded-full bg-brand-700 transition-[width] duration-1000 ease-linear"
                style={{ width: `${pct}%` }}
              />
            </div>
          </>
        )}
      </div>

      {/* Verify mode */}
      <div class="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
        <label class="mb-1 block text-sm font-medium text-slate-700">Verify a code</label>
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input
            type="text"
            inputMode="numeric"
            value={checkInput}
            placeholder="123 456"
            onInput={(e) => {
              setCheckInput((e.target as HTMLInputElement).value);
              setCheckResult(null);
            }}
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono"
          />
          <button
            type="button"
            onClick={checkCode}
            disabled={!secret.trim()}
            class="shrink-0 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:opacity-50"
          >
            Check
          </button>
        </div>
        {checkResult === 'valid' && (
          <p class="mt-2 text-sm font-medium text-green-600">✓ Valid — matches the current window (±1).</p>
        )}
        {checkResult === 'invalid' && (
          <p class="mt-2 text-sm font-medium text-red-600">✗ No match for the current or adjacent windows.</p>
        )}
      </div>

      <p class="mt-4 text-xs text-slate-500">
        Codes here match Google Authenticator / Authy for the same secret. Adjacent-window checking allows
        for small clock differences between your device and the server.
      </p>
    </div>
  );
}
