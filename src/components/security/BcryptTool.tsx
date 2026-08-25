import { useState } from 'preact/hooks';

type BcryptModule = {
  // Sync API — reliable in the browser (the async variants depend on
  // setImmediate and don't resolve in some browser bundles).
  hashSync: (data: string, saltOrRounds: string | number) => string;
  compareSync: (data: string, encrypted: string) => boolean;
};

async function loadBcrypt(): Promise<BcryptModule> {
  const mod: any = await import('bcryptjs');
  return (mod.default ?? mod) as BcryptModule;
}

type Mode = 'hash' | 'verify';

export default function BcryptTool() {
  const [mode, setMode] = useState<Mode>('hash');

  // Hash mode state
  const [hashPassword, setHashPassword] = useState('');
  const [cost, setCost] = useState(10);
  const [hashing, setHashing] = useState(false);
  const [hashResult, setHashResult] = useState('');
  const [hashError, setHashError] = useState('');
  const [copied, setCopied] = useState(false);

  // Verify mode state
  const [verifyPassword, setVerifyPassword] = useState('');
  const [verifyHash, setVerifyHash] = useState('');
  const [checking, setChecking] = useState(false);
  const [verifyState, setVerifyState] = useState<'idle' | 'match' | 'nomatch' | 'error'>('idle');

  const doHash = async () => {
    setHashing(true);
    setHashResult('');
    setHashError('');
    setCopied(false);
    // Yield once so the "Hashing…" state paints before the blocking sync hash.
    await new Promise((r) => setTimeout(r, 20));
    try {
      const bcrypt = await loadBcrypt();
      setHashResult(bcrypt.hashSync(hashPassword, cost));
    } catch {
      setHashError('Hashing failed in this browser — try a lower cost factor.');
    } finally {
      setHashing(false);
    }
  };

  const copyHash = async () => {
    try {
      await navigator.clipboard.writeText(hashResult);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  };

  const doCheck = async () => {
    setChecking(true);
    setVerifyState('idle');
    await new Promise((r) => setTimeout(r, 20));
    try {
      const bcrypt = await loadBcrypt();
      const match = bcrypt.compareSync(verifyPassword, verifyHash);
      setVerifyState(match ? 'match' : 'nomatch');
    } catch {
      setVerifyState('error');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      {/* Mode toggle */}
      <div class="mb-5 inline-flex rounded-xl border border-slate-300 bg-white p-1">
        <button
          type="button"
          onClick={() => setMode('hash')}
          class={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === 'hash' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Hash
        </button>
        <button
          type="button"
          onClick={() => setMode('verify')}
          class={`rounded-lg px-4 py-1.5 text-sm font-medium transition-colors ${
            mode === 'verify' ? 'bg-brand-700 text-white' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Verify
        </button>
      </div>

      {mode === 'hash' ? (
        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="text"
              value={hashPassword}
              onInput={(e) => setHashPassword((e.target as HTMLInputElement).value)}
              placeholder="Enter a password to hash"
              aria-label="Password to hash"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono"
            />
          </div>

          <div>
            <label class="mb-1.5 flex items-center justify-between text-sm font-medium text-slate-700">
              <span>Cost factor (rounds)</span>
              <span class="font-mono text-brand-700">{cost}</span>
            </label>
            <input
              type="range"
              min={4}
              max={14}
              step={1}
              value={cost}
              onInput={(e) => setCost(Number((e.target as HTMLInputElement).value))}
              aria-label="Cost factor (rounds)"
              class="w-full accent-brand-700"
            />
            <p class="mt-1 text-xs text-slate-500">
              Each +1 roughly doubles the time to compute. Higher is more resistant to brute-force
              but slower.
            </p>
          </div>

          <button
            type="button"
            onClick={doHash}
            disabled={hashing || hashPassword.length === 0}
            class="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {hashing ? 'Hashing…' : 'Hash'}
          </button>

          {hashError && <p class="text-sm font-medium text-red-700" aria-live="polite">✗ {hashError}</p>}

          {hashResult && (
            <div>
              <label class="mb-1.5 block text-sm font-medium text-slate-700">Bcrypt hash</label>
              <div class="flex items-stretch gap-2">
                <input
                  type="text"
                  readOnly
                  value={hashResult}
                  aria-label="Bcrypt hash"
                  class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono"
                />
                <button
                  type="button"
                  onClick={copyHash}
                  class="shrink-0 rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <p class="mt-2 text-xs text-slate-500">
                bcrypt embeds a random salt, so hashing the same password twice produces different
                <span class="font-mono"> $2b$…</span> hashes. That is expected and correct — each
                hash still verifies against the original password.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div class="space-y-4">
          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Password</label>
            <input
              type="text"
              value={verifyPassword}
              onInput={(e) => setVerifyPassword((e.target as HTMLInputElement).value)}
              placeholder="Password to check"
              aria-label="Password to verify"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono"
            />
          </div>

          <div>
            <label class="mb-1.5 block text-sm font-medium text-slate-700">Bcrypt hash</label>
            <input
              type="text"
              value={verifyHash}
              onInput={(e) => setVerifyHash((e.target as HTMLInputElement).value)}
              placeholder="$2b$10$…"
              aria-label="Bcrypt hash to verify"
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-mono"
            />
          </div>

          <button
            type="button"
            onClick={doCheck}
            disabled={checking || verifyPassword.length === 0 || verifyHash.length === 0}
            class="rounded-xl bg-brand-700 px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checking ? 'Checking…' : 'Check'}
          </button>

          {verifyState === 'match' && (
            <p class="rounded-xl border border-green-200 bg-green-50 px-3 py-2.5 text-sm font-medium text-green-700">
              ✓ Password matches this hash
            </p>
          )}
          {verifyState === 'nomatch' && (
            <p class="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
              ✗ No match
            </p>
          )}
          {verifyState === 'error' && (
            <p class="rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm font-medium text-red-700">
              That doesn't look like a valid bcrypt hash.
            </p>
          )}
        </div>
      )}

      {/* Explanation */}
      <div class="mt-6 space-y-2 border-t border-slate-200 pt-4 text-xs text-slate-500">
        <p>
          <strong class="text-slate-600">What is bcrypt?</strong> A deliberately slow
          password-hashing function with a built-in random salt and a tunable cost factor, used to
          store passwords safely. It is not a general-purpose or reversible hash — you cannot decode
          a password from its hash, only verify a guess against it. Higher cost makes brute-forcing
          harder but each hash slower to compute.
        </p>
        <p>
          Everything runs locally in your browser. Your password is never uploaded or sent anywhere.
        </p>
      </div>
    </div>
  );
}
