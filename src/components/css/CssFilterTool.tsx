import { useState } from 'preact/hooks';
import { Range, Output, Shell } from './shared';

export default function CssFilterTool() {
  const [blur, setBlur] = useState(0);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [grayscale, setGrayscale] = useState(0);
  const [sepia, setSepia] = useState(0);
  const [hue, setHue] = useState(0);
  const [saturate, setSaturate] = useState(100);
  const [invert, setInvert] = useState(0);

  const parts: string[] = [];
  if (blur) parts.push(`blur(${blur}px)`);
  if (brightness !== 100) parts.push(`brightness(${brightness}%)`);
  if (contrast !== 100) parts.push(`contrast(${contrast}%)`);
  if (grayscale) parts.push(`grayscale(${grayscale}%)`);
  if (sepia) parts.push(`sepia(${sepia}%)`);
  if (hue) parts.push(`hue-rotate(${hue}deg)`);
  if (saturate !== 100) parts.push(`saturate(${saturate}%)`);
  if (invert) parts.push(`invert(${invert}%)`);
  const value = parts.join(' ') || 'none';
  const css = `filter: ${value};`;

  return (
    <>
      <Shell
        controls={
          <>
            <Range label="Blur" value={blur} min={0} max={20} unit="px" onInput={setBlur} />
            <Range label="Brightness" value={brightness} min={0} max={200} unit="%" onInput={setBrightness} />
            <Range label="Contrast" value={contrast} min={0} max={200} unit="%" onInput={setContrast} />
            <Range label="Grayscale" value={grayscale} min={0} max={100} unit="%" onInput={setGrayscale} />
            <Range label="Sepia" value={sepia} min={0} max={100} unit="%" onInput={setSepia} />
            <Range label="Hue rotate" value={hue} min={0} max={360} unit="deg" onInput={setHue} />
            <Range label="Saturate" value={saturate} min={0} max={300} unit="%" onInput={setSaturate} />
            <Range label="Invert" value={invert} min={0} max={100} unit="%" onInput={setInvert} />
          </>
        }
        preview={
          <div class="h-40 w-40 rounded-xl" style={`filter:${value};background:conic-gradient(from 0deg,#ef4444,#f59e0b,#eab308,#22c55e,#3b82f6,#8b5cf6,#ef4444)`} />
        }
      />
      <Output css={css} />
    </>
  );
}
