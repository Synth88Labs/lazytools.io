import { useState } from 'preact/hooks';
import { Output, Shell } from './shared';

const SHAPES: Record<string, string> = {
  Triangle: 'polygon(50% 0%, 0% 100%, 100% 100%)',
  Rhombus: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
  Pentagon: 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
  Hexagon: 'polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)',
  Star: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
  Arrow: 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
  Chevron: 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
  Message: 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
  Circle: 'circle(50% at 50% 50%)',
  Ellipse: 'ellipse(40% 50% at 50% 50%)',
};

export default function ClipPathTool() {
  const [shape, setShape] = useState('Hexagon');
  const value = SHAPES[shape];
  const css = `clip-path: ${value};`;

  return (
    <>
      <Shell
        controls={
          <div>
            <span class="text-sm font-medium text-slate-600">Shape</span>
            <div class="mt-1 grid grid-cols-3 gap-1.5 sm:grid-cols-4">
              {Object.keys(SHAPES).map((s) => (
                <button type="button" onClick={() => setShape(s)} class={`rounded-lg px-2 py-1.5 text-xs font-semibold transition ${s === shape ? 'bg-brand-700 text-white' : 'border border-slate-300 bg-white text-slate-600 hover:border-brand-400'}`}>{s}</button>
              ))}
            </div>
          </div>
        }
        preview={<div class="h-40 w-40 bg-gradient-to-br from-brand-500 to-brand-700" style={`clip-path:${value}`} />}
      />
      <Output css={css} />
    </>
  );
}
