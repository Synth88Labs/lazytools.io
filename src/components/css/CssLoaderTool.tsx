import { useState } from 'preact/hooks';
import { Range, ColorField, Output } from './shared';

type Kind = 'ring' | 'dual-ring' | 'dots' | 'bars' | 'pulse';
const KINDS: Kind[] = ['ring', 'dual-ring', 'dots', 'bars', 'pulse'];

function build(kind: Kind, size: number, color: string, speed: number): { html: string; css: string } {
  const sp = speed.toFixed(1);
  switch (kind) {
    case 'ring':
      return {
        html: '<div class="loader"></div>',
        css: `.loader {\n  width: ${size}px;\n  height: ${size}px;\n  border: ${Math.max(3, Math.round(size / 8))}px solid #e2e8f0;\n  border-top-color: ${color};\n  border-radius: 50%;\n  animation: lt-spin ${sp}s linear infinite;\n}\n@keyframes lt-spin { to { transform: rotate(360deg); } }`,
      };
    case 'dual-ring':
      return {
        html: '<div class="loader"></div>',
        css: `.loader {\n  width: ${size}px;\n  height: ${size}px;\n  border-radius: 50%;\n  border: ${Math.max(3, Math.round(size / 8))}px solid transparent;\n  border-top-color: ${color};\n  border-bottom-color: ${color};\n  animation: lt-spin ${sp}s linear infinite;\n}\n@keyframes lt-spin { to { transform: rotate(360deg); } }`,
      };
    case 'dots':
      return {
        html: '<div class="loader"><div></div><div></div><div></div></div>',
        css: `.loader { display: inline-flex; gap: ${Math.round(size / 5)}px; }\n.loader div {\n  width: ${Math.round(size / 3)}px;\n  height: ${Math.round(size / 3)}px;\n  border-radius: 50%;\n  background: ${color};\n  animation: lt-bounce ${sp}s ease-in-out infinite;\n}\n.loader div:nth-child(2) { animation-delay: ${(speed / 6).toFixed(2)}s; }\n.loader div:nth-child(3) { animation-delay: ${(speed / 3).toFixed(2)}s; }\n@keyframes lt-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }`,
      };
    case 'bars':
      return {
        html: '<div class="loader"><div></div><div></div><div></div><div></div></div>',
        css: `.loader { display: inline-flex; gap: ${Math.round(size / 10)}px; align-items: center; height: ${size}px; }\n.loader div {\n  width: ${Math.round(size / 6)}px;\n  height: 100%;\n  background: ${color};\n  animation: lt-bars ${sp}s ease-in-out infinite;\n}\n.loader div:nth-child(2) { animation-delay: ${(speed / 8).toFixed(2)}s; }\n.loader div:nth-child(3) { animation-delay: ${(speed / 4).toFixed(2)}s; }\n.loader div:nth-child(4) { animation-delay: ${(speed * 3 / 8).toFixed(2)}s; }\n@keyframes lt-bars { 0%, 100% { transform: scaleY(0.3); } 50% { transform: scaleY(1); } }`,
      };
    case 'pulse':
      return {
        html: '<div class="loader"></div>',
        css: `.loader {\n  width: ${size}px;\n  height: ${size}px;\n  border-radius: 50%;\n  background: ${color};\n  animation: lt-pulse ${sp}s ease-in-out infinite;\n}\n@keyframes lt-pulse { 0%, 100% { transform: scale(0.6); opacity: 0.5; } 50% { transform: scale(1); opacity: 1; } }`,
      };
  }
}

export default function CssLoaderTool() {
  const [kind, setKind] = useState<Kind>('ring');
  const [size, setSize] = useState(48);
  const [color, setColor] = useState('#1d87f1');
  const [speed, setSpeed] = useState(1);
  const { html, css } = build(kind, size, color, speed);
  const snippet = `<!-- HTML -->\n${html}\n\n/* CSS */\n${css}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div class="space-y-4">
          <div>
            <span class="text-sm font-medium text-slate-600">Spinner</span>
            <div class="mt-1 flex flex-wrap gap-1.5">
              {KINDS.map((k) => (
                <button type="button" onClick={() => setKind(k)} class={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${k === kind ? 'bg-brand-700 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}>{k}</button>
              ))}
            </div>
          </div>
          <Range label="Size" value={size} min={16} max={96} unit="px" onInput={setSize} />
          <Range label="Speed" value={speed} min={0.3} max={3} step={0.1} unit="s" onInput={setSpeed} />
          <ColorField label="Colour" value={color} onInput={setColor} />
        </div>
        <div class="flex min-h-[200px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6" dangerouslySetInnerHTML={{ __html: html }} />
      </div>
      <Output css={snippet} />
      <style dangerouslySetInnerHTML={{ __html: css }} />
    </div>
  );
}
