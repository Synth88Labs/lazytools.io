import { useState } from 'preact/hooks';
import { Range, Segmented, Output } from './shared';

const KEYFRAMES: Record<string, string> = {
  'fade-in': 'from { opacity: 0; } to { opacity: 1; }',
  'fade-in-up': 'from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); }',
  'slide-in-left': 'from { transform: translateX(-100%); } to { transform: translateX(0); }',
  'zoom-in': 'from { opacity: 0; transform: scale(0.6); } to { opacity: 1; transform: scale(1); }',
  bounce: '0%, 20%, 53%, 100% { transform: translateY(0); } 40%, 43% { transform: translateY(-24px); } 70% { transform: translateY(-12px); } 90% { transform: translateY(-4px); }',
  pulse: '0% { transform: scale(1); } 50% { transform: scale(1.12); } 100% { transform: scale(1); }',
  spin: 'from { transform: rotate(0); } to { transform: rotate(360deg); }',
  shake: '0%, 100% { transform: translateX(0); } 20%, 60% { transform: translateX(-10px); } 40%, 80% { transform: translateX(10px); }',
  flip: 'from { transform: perspective(400px) rotateY(0); } to { transform: perspective(400px) rotateY(360deg); }',
  wobble: '0% { transform: none; } 25% { transform: rotate(-6deg); } 50% { transform: rotate(6deg); } 75% { transform: rotate(-3deg); } 100% { transform: none; }',
};
const PRESETS = Object.keys(KEYFRAMES);
const TIMINGS = ['ease', 'ease-in-out', 'linear', 'ease-in', 'ease-out'] as const;
const ITER = ['1', 'infinite'] as const;

export default function CssAnimationTool() {
  const [preset, setPreset] = useState('fade-in-up');
  const [dur, setDur] = useState(1);
  const [timing, setTiming] = useState<(typeof TIMINGS)[number]>('ease');
  const [delay, setDelay] = useState(0);
  const [iter, setIter] = useState<(typeof ITER)[number]>('1');
  const [run, setRun] = useState(0);

  const name = `lt-${preset}`;
  const anim = `${dur}s ${timing} ${delay}s ${iter} ${name}`;
  const css = `@keyframes ${name} {\n  ${KEYFRAMES[preset].replace(/ } /g, ' }\n  ')}\n}\n\n.animated {\n  animation: ${anim};\n}`;

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="grid gap-6 lg:grid-cols-[1fr_1.1fr]">
        <div class="space-y-4">
          <div>
            <span class="text-sm font-medium text-slate-600">Preset</span>
            <div class="mt-1 flex flex-wrap gap-1.5">
              {PRESETS.map((p) => (
                <button type="button" onClick={() => { setPreset(p); setRun((r) => r + 1); }} class={`rounded-lg px-2.5 py-1 text-xs font-semibold transition ${p === preset ? 'bg-brand-700 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}>{p}</button>
              ))}
            </div>
          </div>
          <Range label="Duration" value={dur} min={0.1} max={4} step={0.1} unit="s" onInput={setDur} />
          <Range label="Delay" value={delay} min={0} max={3} step={0.1} unit="s" onInput={setDelay} />
          <Segmented label="Timing function" value={timing} options={TIMINGS} onSelect={setTiming} />
          <Segmented label="Iterations" value={iter} options={ITER} onSelect={setIter} />
          <button type="button" onClick={() => setRun((r) => r + 1)} class="rounded-lg bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">▶ Replay</button>
        </div>
        <div class="flex min-h-[260px] items-center justify-center rounded-xl border border-slate-200 bg-white p-6">
          <div key={run} class="flex h-24 w-24 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 font-bold text-white" style={`animation:${anim}`}>box</div>
        </div>
      </div>
      <Output css={css} />
      <style dangerouslySetInnerHTML={{ __html: `@keyframes ${name} { ${KEYFRAMES[preset]} }` }} />
    </div>
  );
}
