import { useState } from 'preact/hooks';
import { Segmented, Range, Output, Shell } from './shared';

const DIRS = ['row', 'row-reverse', 'column', 'column-reverse'] as const;
const JUSTIFY = ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'] as const;
const ALIGN = ['stretch', 'flex-start', 'center', 'flex-end'] as const;
const WRAP = ['nowrap', 'wrap'] as const;

export default function FlexboxTool() {
  const [dir, setDir] = useState<(typeof DIRS)[number]>('row');
  const [justify, setJustify] = useState<(typeof JUSTIFY)[number]>('flex-start');
  const [align, setAlign] = useState<(typeof ALIGN)[number]>('stretch');
  const [wrap, setWrap] = useState<(typeof WRAP)[number]>('wrap');
  const [gap, setGap] = useState(12);

  const css = `display: flex;\nflex-direction: ${dir};\njustify-content: ${justify};\nalign-items: ${align};\nflex-wrap: ${wrap};\ngap: ${gap}px;`;
  const style = `display:flex;flex-direction:${dir};justify-content:${justify};align-items:${align};flex-wrap:${wrap};gap:${gap}px`;

  return (
    <>
      <Shell
        controls={
          <>
            <Segmented label="flex-direction" value={dir} options={DIRS} onSelect={setDir} />
            <Segmented label="justify-content" value={justify} options={JUSTIFY} onSelect={setJustify} />
            <Segmented label="align-items" value={align} options={ALIGN} onSelect={setAlign} />
            <Segmented label="flex-wrap" value={wrap} options={WRAP} onSelect={setWrap} />
            <Range label="gap" value={gap} min={0} max={40} unit="px" onInput={setGap} />
          </>
        }
        preview={
          <div class="h-full w-full rounded-lg bg-white/70 p-2" style={style}>
            {[1, 2, 3, 4, 5].map((n) => (
              <div class="flex h-12 min-w-[44px] items-center justify-center rounded-md bg-brand-600 px-3 font-bold text-white">{n}</div>
            ))}
          </div>
        }
      />
      <Output css={css} />
    </>
  );
}
