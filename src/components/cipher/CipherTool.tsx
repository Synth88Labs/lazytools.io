import { useState } from 'preact/hooks';
import {
  textToMorse, morseToText, textToNato, natoToText,
  textToBinary, binaryToText, caesar, rot13, caesarBruteForce, vigenere,
} from '../../lib/ciphers';

type Mode = 'morse' | 'nato' | 'binary' | 'caesar' | 'rot13' | 'vigenere';

interface Props { mode: Mode; }

const SAMPLES: Record<Mode, string> = {
  morse: 'SOS Hello World',
  nato: 'Hello',
  binary: 'Hi!',
  caesar: 'Attack at dawn',
  rot13: 'Why did the chicken?',
  vigenere: 'Meet me at noon',
};

const ENCODE_LABEL: Record<Mode, [string, string]> = {
  morse: ['Text → Morse', 'Morse → Text'],
  nato: ['Text → NATO', 'NATO → Text'],
  binary: ['Text → Binary', 'Binary → Text'],
  caesar: ['Encode', 'Decode'],
  rot13: ['Apply ROT13', 'Apply ROT13'],
  vigenere: ['Encode', 'Decode'],
};

export default function CipherTool({ mode }: Props) {
  const [input, setInput] = useState(SAMPLES[mode]);
  const [decode, setDecode] = useState(false);
  const [shift, setShift] = useState(3);
  const [key, setKey] = useState('LEMON');
  const [copied, setCopied] = useState(false);
  const [playing, setPlaying] = useState(false);

  function compute(): string {
    switch (mode) {
      case 'morse': return decode ? morseToText(input) : textToMorse(input);
      case 'nato': return decode ? natoToText(input) : textToNato(input);
      case 'binary': return decode ? binaryToText(input) : textToBinary(input);
      case 'caesar': return caesar(input, decode ? -shift : shift);
      case 'rot13': return rot13(input);
      case 'vigenere': return vigenere(input, key, decode);
    }
  }
  const output = compute();

  async function copy() {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500); } catch { /* */ }
  }

  // Morse audio: play the CURRENT morse (encode the output if decoding, else the output itself)
  async function playMorse() {
    const morse = decode ? textToMorse(output) : output;
    setPlaying(true);
    const ctx = new AudioContext();
    const unit = 0.08; // seconds per dot
    let t = ctx.currentTime + 0.05;
    const beep = (dur: number) => {
      const osc = ctx.createOscillator(); const g = ctx.createGain();
      osc.frequency.value = 600; osc.type = 'sine';
      osc.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(0.25, t + 0.005);
      g.gain.setValueAtTime(0.25, t + dur); g.gain.exponentialRampToValueAtTime(0.0001, t + dur + 0.01);
      osc.start(t); osc.stop(t + dur + 0.02);
      t += dur;
    };
    for (const ch of morse) {
      if (ch === '.') { beep(unit); t += unit; }
      else if (ch === '-') { beep(unit * 3); t += unit; }
      else if (ch === ' ') t += unit * 2;
      else if (ch === '/') t += unit * 4;
    }
    const total = (t - ctx.currentTime) * 1000;
    setTimeout(() => { setPlaying(false); ctx.close(); }, total + 200);
  }

  const inputCls = 'w-full rounded-xl border border-slate-300 bg-white px-3 py-3 font-mono text-sm text-slate-900 focus:border-brand-500 focus:outline-none';
  const [encLabel, decLabel] = ENCODE_LABEL[mode];
  const swappable = mode !== 'rot13';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      {swappable && (
        <div class="mb-3 flex gap-2 rounded-xl border border-slate-200 bg-white p-1.5">
          <button type="button" onClick={() => setDecode(false)} class={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${!decode ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 hover:text-brand-700'}`}>{encLabel}</button>
          <button type="button" onClick={() => setDecode(true)} class={`flex-1 rounded-lg px-4 py-2 text-sm font-semibold transition ${decode ? 'bg-brand-700 text-white' : 'bg-white text-slate-600 hover:text-brand-700'}`}>{decLabel}</button>
        </div>
      )}

      {(mode === 'caesar' || mode === 'vigenere') && (
        <div class="mb-3">
          {mode === 'caesar' ? (
            <div>
              <label for="cph-shift" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Shift: {shift}</label>
              <input id="cph-shift" type="range" min={1} max={25} value={shift} onInput={(e) => setShift(parseInt((e.target as HTMLInputElement).value, 10))} class="w-full max-w-md accent-brand-600" />
            </div>
          ) : (
            <div>
              <label for="cph-key" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Keyword</label>
              <input id="cph-key" type="text" value={key} onInput={(e) => setKey((e.target as HTMLInputElement).value)} placeholder="e.g. LEMON" class="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 focus:border-brand-500 focus:outline-none" />
            </div>
          )}
        </div>
      )}

      <label for="cph-in" class="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-500">Input</label>
      <textarea id="cph-in" rows={4} value={input} onInput={(e) => setInput((e.target as HTMLTextAreaElement).value)} class={inputCls} spellcheck={false} />

      <div class="mt-3 flex items-center justify-between">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Output</span>
        <div class="flex gap-2">
          {mode === 'morse' && (
            <button type="button" onClick={playMorse} disabled={playing || !output.trim()} class="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-brand-400 hover:text-brand-700 disabled:opacity-40">
              {playing ? '🔊 Playing…' : '▶ Play'}
            </button>
          )}
          <button type="button" onClick={copy} disabled={!output.trim()} class="rounded-lg bg-brand-700 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-brand-800 disabled:opacity-40">{copied ? '✓ Copied' : 'Copy'}</button>
        </div>
      </div>
      <textarea readOnly rows={4} value={output} class="mt-1 w-full rounded-xl border border-brand-200 bg-white px-3 py-3 font-mono text-sm text-slate-800" spellcheck={false} />

      {mode === 'caesar' && (
        <details class="mt-3 rounded-xl border border-slate-200 bg-white p-3">
          <summary class="cursor-pointer text-sm font-semibold text-slate-700">🔓 Crack it — try all 25 shifts</summary>
          <div class="mt-2 max-h-56 overflow-y-auto font-mono text-xs">
            {caesarBruteForce(input).map((r) => (
              <div class="flex gap-3 border-b border-slate-100 py-1 last:border-0">
                <span class="w-12 shrink-0 font-bold text-slate-400">↓{r.shift}</span>
                <span class="text-slate-800">{r.text}</span>
              </div>
            ))}
          </div>
        </details>
      )}

      {mode === 'binary' && <p class="mt-2 text-xs text-slate-500">8 bits per byte (UTF-8), space-separated. Decoding accepts any whitespace-separated binary bytes.</p>}
      {mode === 'nato' && <p class="mt-2 text-xs text-slate-500">Uses the ICAO/NATO spelling alphabet; word breaks are shown as “|”.</p>}
      <p class="mt-2 text-xs text-slate-500">Transformed in your browser — nothing you type is uploaded.</p>
    </div>
  );
}
