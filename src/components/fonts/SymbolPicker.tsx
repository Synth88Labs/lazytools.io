import { useState } from 'preact/hooks';

const CATEGORIES: { name: string; symbols: string }[] = [
  { name: 'Arrows', symbols: '← ↑ → ↓ ↔ ↕ ↖ ↗ ↘ ↙ ⇐ ⇒ ⇑ ⇓ ⇔ ➜ ➤ ➡ ⬅ ⬆ ⬇ ↩ ↪ ⤴ ⤵ ➦ ➥ ⟶ ⟵ ⇄ ⇅ ↻ ↺' },
  { name: 'Stars & sparkles', symbols: '★ ☆ ✦ ✧ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ⁂ ✱ ✲ ✳ ✴ ✵ ✶ ✷ ✸ ✹ ✺ ❋ ❂ ✨ ⭐ 🌟 ✳️' },
  { name: 'Hearts', symbols: '♥ ♡ ❤ ❥ ❣ ❦ ❧ 💕 💖 💗 💘 💙 💚 💛 💜 🖤 🤍 🤎 💝 💞 💓 ❤️‍🔥' },
  { name: 'Currency', symbols: '$ ¢ £ ¥ € ₹ ₽ ₩ ₺ ₴ ₦ ₱ ฿ ₪ ₫ ₡ ₲ ₵ ₭ ₮ ¤ ₿ ﷼' },
  { name: 'Math', symbols: '± × ÷ ≠ ≈ ≤ ≥ ∞ √ ∛ ∜ ∑ ∏ ∫ ∂ ∆ ∇ ∈ ∉ ⊂ ⊃ ∪ ∩ ° π µ ∅ ∝ ∴ ∵ ≡ ⌀ ‰' },
  { name: 'Shapes', symbols: '● ○ ◉ ◍ ◎ ■ □ ▪ ▫ ◆ ◇ ▲ △ ▼ ▽ ◀ ▶ ⬟ ⬢ ⬣ ⭓ ⯃ ▬ ▮ ▰ ◢ ◣ ◤ ◥ ⏢' },
  { name: 'Punctuation', symbols: '• ‣ ◦ ‧ · … — – ‑ ¡ ¿ « » ‹ › “ ” ‘ ’ „ ‟ § ¶ † ‡ ※ ‽ ⁓ ⸮ ⸜ ⸝' },
  { name: 'Brackets', symbols: '「 」 『 』 【 】 〔 〕 〖 〗 〘 〙 〚 〛 ⟨ ⟩ ⟪ ⟫ ⌈ ⌉ ⌊ ⌋ ⦃ ⦄ ❨ ❩ ❪ ❫ ❲ ❳ ⟦ ⟧' },
  { name: 'Lines & borders', symbols: '─ ━ │ ┃ ┄ ┅ ┈ ┉ ═ ║ ╌ ╍ ╭ ╮ ╯ ╰ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼ ╔ ╗ ╚ ╝ ▁ ▔ ▏ ▕' },
  { name: 'Weather & nature', symbols: '☀ ☁ ☂ ☃ ☄ ★ ☾ ☽ ❄ ❅ ❆ ☼ ☽ ⚡ ✿ ❀ ❁ ☘ ♧ ♣ ♠ ♤ ✾ ⚘ ☔ 🌙 ⛅' },
  { name: 'Music', symbols: '♩ ♪ ♫ ♬ ♭ ♮ ♯ 𝄞 𝄢 𝅘𝅥 𝅗𝅥 🎵 🎶 🎼' },
  { name: 'Check & cross', symbols: '✓ ✔ ✗ ✘ ☑ ☒ ☐ ✅ ❌ ✖ ⌫ ⎋ ⌦ √ ✕ ✚ ✜ ❎ ⊘ ⊗' },
];

export default function SymbolPicker() {
  const [copied, setCopied] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  async function copy(sym: string) {
    try {
      await navigator.clipboard.writeText(sym);
      setCopied(sym);
      setTimeout(() => setCopied((c) => (c === sym ? null : c)), 1200);
    } catch { /* clipboard blocked */ }
  }

  const q = query.trim();
  const cats = CATEGORIES.map((c) => ({
    ...c,
    list: c.symbols.split(/\s+/).filter(Boolean).filter((s) => !q || c.name.toLowerCase().includes(q.toLowerCase())),
  })).filter((c) => c.list.length);

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex items-center justify-between gap-3">
        <input
          type="search"
          value={query}
          placeholder="Filter categories (arrows, hearts, math…)"
          onInput={(e) => setQuery((e.target as HTMLInputElement).value)}
          class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-200"
        />
        {copied && <span class="shrink-0 text-sm font-semibold text-mint-600">✓ Copied {copied}</span>}
      </div>

      <div class="mt-4 space-y-5">
        {cats.map((c) => (
          <div>
            <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{c.name}</h3>
            <div class="flex flex-wrap gap-1.5">
              {c.list.map((s) => (
                <button
                  type="button"
                  onClick={() => copy(s)}
                  title={`Copy ${s}`}
                  class={`flex h-10 w-10 items-center justify-center rounded-lg border text-xl transition ${copied === s ? 'border-mint-500 bg-mint-50' : 'border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p class="mt-5 text-xs text-slate-500">
        Click any symbol to copy it, then paste it anywhere. These are standard Unicode characters — a few render differently or in colour depending on your device. 🔒 Runs in your browser.
      </p>
    </div>
  );
}
