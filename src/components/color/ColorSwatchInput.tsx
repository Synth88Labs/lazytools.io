import type { RGB } from '../../lib/color-compute';
import { rgbToHex } from '../../lib/color-compute';

/**
 * A native color-picker styled as the tool's swatch. Clicking opens the OS
 * color picker; picking sets the text field via onPick(hex). Falls back to a
 * neutral fill when the current color is unparseable.
 */
export default function ColorSwatchInput({
  rgb,
  onPick,
  size = 'md',
  title = 'Pick a color',
}: {
  rgb: RGB | null;
  onPick: (hex: string) => void;
  size?: 'sm' | 'md' | 'lg';
  title?: string;
}) {
  const hex = rgb ? rgbToHex(rgb) : '#ffffff';
  const cls = size === 'lg' ? 'h-10 w-10' : size === 'sm' ? 'h-8 w-8' : 'h-9 w-9';
  return (
    <span class={`relative shrink-0 ${cls}`} title={title}>
      <span class="block h-full w-full rounded-lg ring-1 ring-slate-300" style={`background:${rgb ? hex : '#eee'}`} />
      <input
        type="color"
        value={hex}
        aria-label={title}
        onInput={(e) => onPick((e.target as HTMLInputElement).value)}
        class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </span>
  );
}
