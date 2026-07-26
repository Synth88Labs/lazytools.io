import { useState } from 'preact/hooks';

const GROUPS: { name: string; faces: string[] }[] = [
  {
    name: 'Lenny & smug',
    faces: ['( ͡° ͜ʖ ͡°)', '( ͡~ ͜ʖ ͡°)', '( ͠° ͟ʖ ͡°)', '( ͡ᵔ ͜ʖ ͡ᵔ)', '( ͡° ͜ʖ ͡ °)', '(͠≖ ͜ʖ͠≖)', '(  ͡° ͜ʖ ͡°)', '( ͡° ͜ °)'],
  },
  {
    name: 'Happy',
    faces: ['(◕‿◕)', '(｡◕‿◕｡)', '(＾▽＾)', '(¬‿¬)', '(◠‿◠)', '(◕ᴥ◕)', 'ヽ(・∀・)ﾉ', '(´｡• ᵕ •｡`)', '(≧◡≦)', '(*^‿^*)'],
  },
  {
    name: 'Shrug & dismissive',
    faces: ['¯\\_(ツ)_/¯', '¯\\_(ϯ)_/¯', 'ヽ(´ー｀)ノ', '╮(╯▽╰)╭', '┐(´ー｀)┌', '¯\\(°_o)/¯', '¯\\_(⊙_ʖ⊙)_/¯'],
  },
  {
    name: 'Angry & flip',
    faces: ['(╯°□°）╯︵ ┻━┻', '┻━┻ ︵ヽ(`Д´)ﾉ︵ ┻━┻', '(ノಠ益ಠ)ノ彡┻━┻', 'ヽ(ｏ`皿′ｏ)ﾉ', '(҂◡_◡)', 'ಠ_ಠ', '(¬_¬)', 'ヽ(#`Д´)ﾉ'],
  },
  {
    name: 'Sad & crying',
    faces: ['(╥﹏╥)', '(っ˘̩╭╮˘̩)っ', '(个_个)', '(ಥ﹏ಥ)', '。゜゜(´Ｏ`) ゜゜。', '(；￢＿￢)', 'ﾟ(つд`ﾟ)', '(◞‸◟)'],
  },
  {
    name: 'Love & cute',
    faces: ['(♥ω♥)', '(｡♥‿♥｡)', '(❤ω❤)', '(*≧ω≦*)', '(づ￣ ³￣)づ', '(◍•ᴗ•◍)❤', 'ʕ•ᴥ•ʔ', '(=^･ω･^=)', '(＾• ω •＾)'],
  },
  {
    name: 'Table flip & put back',
    faces: ['(╯°□°）╯︵ ┻━┻', '┬─┬ ノ( ゜-゜ノ)', '(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧', '┬──┬ ◡ ノ(° -°ノ)', '(ノ゜▽゜)ノ'],
  },
  {
    name: 'Surprise & dance',
    faces: ['(⊙_⊙)', '(°o°)', '(ﾟﾛﾟ)', 'ヽ(°〇°)ﾉ', '⊙▂⊙', '┏(・o･)┛', '♪┏(・o･)┛♪', 'ヾ(⌐■_■)ノ♪', '(~˘▾˘)~'],
  },
];

export default function LennyPicker() {
  const [copied, setCopied] = useState<string | null>(null);

  async function copy(face: string) {
    try {
      await navigator.clipboard.writeText(face);
      setCopied(face);
      setTimeout(() => setCopied((c) => (c === face ? null : c)), 1200);
    } catch { /* clipboard blocked */ }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div class="flex items-center justify-between">
        <p class="text-sm text-slate-600">Click any face to copy it, then paste it anywhere.</p>
        {copied && <span class="shrink-0 text-sm font-semibold text-mint-600">✓ Copied</span>}
      </div>

      <div class="mt-4 space-y-5">
        {GROUPS.map((g) => (
          <div>
            <h3 class="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">{g.name}</h3>
            <div class="flex flex-wrap gap-2">
              {g.faces.map((f) => (
                <button
                  type="button"
                  onClick={() => copy(f)}
                  title="Copy"
                  class={`rounded-lg border px-3 py-2 text-base transition ${copied === f ? 'border-mint-500 bg-mint-50' : 'border-slate-200 bg-white hover:border-brand-400 hover:bg-brand-50'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p class="mt-5 text-xs text-slate-500">
        These "kaomoji" are built from ordinary Unicode characters, so they paste into chats, bios and comments. A few use combining marks that some apps render slightly differently. 🔒 Runs in your browser.
      </p>
    </div>
  );
}
