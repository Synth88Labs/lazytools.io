import { useState, useEffect } from 'preact/hooks';
import { hmac, type HmacAlgo } from '../../lib/crypto-sign';

type Encoding = 'hex' | 'base64';

const ALGOS: { value: HmacAlgo; label: string }[] = [
  { value: 'SHA-256', label: 'HMAC-SHA-256' },
  { value: 'SHA-1', label: 'HMAC-SHA-1' },
  { value: 'SHA-384', label: 'HMAC-SHA-384' },
  { value: 'SHA-512', label: 'HMAC-SHA-512' },
];

export default function HmacTool() {
  const [message, setMessage] = useState('POST /webhook\n{"id":123}');
  const [key, setKey] = useState('my-secret-key');
  const [algo, setAlgo] = useState<HmacAlgo>('SHA-256');
  const [encoding, setEncoding] = useState<Encoding>('hex');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    if (message === '' || key === '') {
      setOutput('');
      setError('');
      return;
    }

    (async () => {
      try {
        const result = await hmac(message, key, algo, encoding);
        if (!cancelled) {
          setOutput(result);
          setError('');
        }
      } catch (err) {
        if (!cancelled) {
          setOutput('');
          setError(err instanceof Error ? err.message : 'Failed to compute HMAC.');
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [message, key, algo, encoding]);

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {
      /* clipboard unavailable — ignore */
    }
  };

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-4">
        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Message</span>
          <textarea
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            rows={4}
            value={message}
            onInput={(e) => setMessage((e.target as HTMLTextAreaElement).value)}
            placeholder="The message to sign…"
          />
        </label>

        <label class="block">
          <span class="mb-1 block text-sm font-medium text-slate-700">Secret key</span>
          <input
            type="text"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
            value={key}
            onInput={(e) => setKey((e.target as HTMLInputElement).value)}
            placeholder="Your shared secret…"
          />
        </label>

        <div class="grid gap-4 sm:grid-cols-2">
          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">Algorithm</span>
            <select
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
              value={algo}
              onChange={(e) => setAlgo((e.target as HTMLSelectElement).value as HmacAlgo)}
            >
              {ALGOS.map((a) => (
                <option value={a.value}>{a.label}</option>
              ))}
            </select>
          </label>

          <label class="block">
            <span class="mb-1 block text-sm font-medium text-slate-700">Output encoding</span>
            <select
              class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm"
              value={encoding}
              onChange={(e) => setEncoding((e.target as HTMLSelectElement).value as Encoding)}
            >
              <option value="hex">Hex</option>
              <option value="base64">Base64</option>
            </select>
          </label>
        </div>

        <div class="block">
          <div class="mb-1 flex items-center justify-between">
            <span class="text-sm font-medium text-slate-700">HMAC signature</span>
            <button
              type="button"
              onClick={copy}
              disabled={!output}
              class="rounded-lg bg-brand-700 px-3 py-1 text-xs font-medium text-white hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <textarea
            readOnly
            aria-label="HMAC signature"
            class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs"
            rows={3}
            value={output}
            placeholder="Output appears here…"
          />
          {error && <p class="mt-1 text-xs text-red-600">{error}</p>}
        </div>

        <div class="rounded-xl border border-slate-200 bg-white p-3 text-xs leading-relaxed text-slate-600">
          <p class="mb-2">
            <strong class="text-slate-700">HMAC needs both a message and a secret key</strong> — unlike a plain
            hash. It proves the message came from someone who knows the key. A common use is verifying webhook
            signatures: services like Stripe and GitHub sign each payload with your secret so you can confirm it is
            genuine and untampered.
          </p>
          <p>
            Everything runs locally in your browser. Your secret and message are never uploaded, and the tool works
            fully offline.
          </p>
        </div>
      </div>
    </div>
  );
}
