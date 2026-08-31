import { useMemo, useState } from 'preact/hooks';
import { decodeCertificate, type X509Cert } from '../../lib/x509';

const SAMPLE = `-----BEGIN CERTIFICATE-----
Paste a PEM certificate here (the block starting with -----BEGIN CERTIFICATE-----).
-----END CERTIFICATE-----`;

function daysBetween(a: number, b: number): number {
  return Math.round((b - a) / 86400000);
}

export default function CertDecoderTool() {
  const [text, setText] = useState('');

  const result = useMemo(() => {
    const t = text.trim();
    if (!t || t === SAMPLE.trim()) return null;
    try {
      return { cert: decodeCertificate(t), error: null as string | null };
    } catch (e) {
      return { cert: null, error: e instanceof Error ? e.message : 'Could not parse certificate' };
    }
  }, [text]);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setText(await f.text());
  };

  const cert = result?.cert ?? null;
  const now = Date.now();
  const nb = cert ? Date.parse(cert.notBefore) : 0;
  const na = cert ? Date.parse(cert.notAfter) : 0;
  const expired = cert ? now > na : false;
  const notYet = cert ? now < nb : false;
  const daysLeft = cert ? daysBetween(now, na) : 0;

  const inp = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-2 font-mono text-xs text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200';
  const field = (label: string, value: string, mono = false) => (
    <div class="grid grid-cols-[8rem_1fr] gap-2 border-b border-slate-100 py-2 sm:grid-cols-[10rem_1fr]">
      <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
      <span class={`break-all text-sm text-slate-800 ${mono ? 'font-mono text-xs' : ''}`}>{value}</span>
    </div>
  );

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="mb-2 flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">PEM certificate</span>
        <label class="cursor-pointer rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">
          📂 Open .pem / .crt…
          <input type="file" accept=".pem,.crt,.cer,.cert,text/plain" class="hidden" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        </label>
      </div>
      <textarea rows={6} class={inp} aria-label="PEM certificate" placeholder={SAMPLE} value={text} onInput={(e) => setText((e.target as HTMLTextAreaElement).value)} />

      {result?.error && (
        <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {result.error}. Make sure you pasted the whole PEM block (or the raw base64/DER-hex).</p>
      )}

      {cert && (
        <div class="mt-4 space-y-4">
          <div class={`rounded-xl p-4 ring-1 ${expired ? 'bg-rose-50 ring-rose-200' : notYet ? 'bg-amber-50 ring-amber-200' : 'bg-emerald-50 ring-emerald-200'}`}>
            <p class="text-sm font-bold text-slate-800">
              {expired ? '⛔ Expired' : notYet ? '⏳ Not yet valid' : '✅ Currently valid'}
              {!expired && !notYet && daysLeft <= 30 && <span class="ml-1 font-normal text-amber-700">, expires in {daysLeft} day{daysLeft === 1 ? '' : 's'}</span>}
            </p>
            <p class="mt-0.5 text-xs text-slate-600">{cert.notBefore} → {cert.notAfter}{!expired && !notYet ? ` · ${daysLeft} days left` : ''}</p>
          </div>

          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            {field('Subject', cert.subject)}
            {field('Issuer', cert.issuer)}
            {field('Serial', cert.serialNumber, true)}
            {field('Version', `v${cert.version}`)}
            {field('Signature', cert.signatureAlgorithm)}
            {field('Public key', `${cert.publicKeyAlgorithm}${cert.publicKeyBits ? ` (${cert.publicKeyBits} bit)` : ''}${cert.publicKeyCurve ? ` · ${cert.publicKeyCurve}` : ''}`)}
            {cert.sans.length > 0 && field('Alt names (SAN)', cert.sans.join(', '))}
          </div>

          {cert.extensions.length > 0 && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Extensions</p>
              <div class="space-y-2">
                {cert.extensions.map((e) => (
                  <div class="text-sm">
                    <span class="font-semibold text-slate-700">{e.name}</span>
                    {e.critical && <span class="ml-1 rounded bg-amber-100 px-1 text-[10px] font-bold uppercase text-amber-700">critical</span>}
                    <span class="ml-1 break-all text-slate-600">{e.value ? `— ${e.value}` : ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Paste a PEM certificate (the <code class="rounded bg-slate-200 px-1">-----BEGIN CERTIFICATE-----</code> block) to read its subject, issuer, validity window, key and extensions. The tool parses the ASN.1/DER structure directly in your browser, the certificate is never uploaded. Certificates are public by design, but decoding locally means even an internal cert stays on your machine. 🔒 100% client-side.</p>
    </div>
  );
}
