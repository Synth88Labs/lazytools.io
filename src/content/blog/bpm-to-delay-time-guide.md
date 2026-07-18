---
title: "BPM to Delay Time: The 60,000 Rule Every Producer Should Know"
description: "Quarter-note delay in milliseconds is 60,000 ÷ BPM — 500 ms at 120 BPM. Here's the full subdivision table, how dotted and triplet delays work, and why the dotted eighth is the most useful delay setting in pop production."
pubDate: 2026-07-18
updatedDate: 2026-07-18
archetype: explainer
heroImage: /blog/bpm-to-delay-time-guide.png
heroAlt: "The formula 60,000 divided by BPM equals quarter note delay in milliseconds, shown as 500 milliseconds at 120 BPM."
tools: ["/music/bpm-delay-calculator/", "/music/reverb-time-calculator/", "/music/tap-tempo/"]
keywords:
  - bpm to delay time
  - delay time calculator ms
  - 60000 divided by bpm
  - dotted eighth delay
  - reverb pre-delay tempo
  - tempo sync delay
draft: false
---

**Quarter-note delay time in milliseconds = 60,000 ÷ BPM.** At 120 BPM that's 500 ms; at 90 BPM it's 667 ms. Every other subdivision comes from that one number — halve it for eighths, quarter it for sixteenths, multiply by 1.5 for dotted, by ⅔ for triplets. The reason 60,000 appears is simply that there are 60,000 milliseconds in a minute, and BPM is beats *per minute*.

<aside class="key-takeaways">

**Key takeaways**

- **Quarter note (ms) = 60,000 ÷ BPM.** 120 BPM → 500 ms.
- **Eighth** = ÷2, **sixteenth** = ÷4, **half** = ×2.
- **Dotted** = ×1.5. **Triplet** = ×⅔.
- **Dotted eighth = 45,000 ÷ BPM** — the classic rhythmic-echo delay.
- Use it for delay, **reverb pre-delay**, sidechain release, tremolo and gate rates.
- Tempo-synced times land *with* the groove; arbitrary times blur it.

</aside>

<figure>
<img src="/blog/infographic-bpm-delay.svg" alt="At 120 BPM, 60000 divided by 120 gives a 500 millisecond quarter note. An eighth note is 250 ms, a sixteenth 125 ms, a dotted eighth 375 ms and an eighth triplet 167 ms." width="1200" height="700" loading="lazy" />
<figcaption>One division gives you the beat. Everything else is a multiplier.</figcaption>
</figure>

## Where the number comes from

A minute is 60 seconds — **60,000 milliseconds**. BPM means beats per minute, and one beat is a quarter note in common time. So:

> **quarter note (ms) = 60,000 ÷ BPM**

At **120 BPM**: 60,000 ÷ 120 = **500 ms**. At **140 BPM**: ≈ **429 ms**. At **75 BPM**: **800 ms**.

That's the whole thing. Every other value is that number scaled.

## The subdivision table

| Note value | Multiplier | Formula | At 120 BPM |
| --- | --- | --- | --- |
| Whole | ×4 | 240,000 ÷ BPM | 2,000 ms |
| Half | ×2 | 120,000 ÷ BPM | 1,000 ms |
| **Quarter** | **×1** | **60,000 ÷ BPM** | **500 ms** |
| Eighth | ×0.5 | 30,000 ÷ BPM | 250 ms |
| Sixteenth | ×0.25 | 15,000 ÷ BPM | 125 ms |
| Dotted quarter | ×1.5 | 90,000 ÷ BPM | 750 ms |
| **Dotted eighth** | **×0.75** | **45,000 ÷ BPM** | **375 ms** |
| Quarter triplet | ×⅔ | 40,000 ÷ BPM | 333 ms |
| Eighth triplet | ×⅓ | 20,000 ÷ BPM | 167 ms |

The [BPM delay calculator](/music/bpm-delay-calculator/) prints the whole table for any tempo. If you don't know the tempo, [tap it out](/music/tap-tempo/) first.

## Dotted and triplet, in one line each

- **Dotted** = the note plus half itself again → **×1.5**. A dot adds 50% of the note's duration.
- **Triplet** = three in the space of two → **×⅔**. Each note is two-thirds the normal length.

## Why the dotted eighth is everywhere

Set a delay to a **dotted eighth** (0.75 of a beat) and the echoes don't land on the beat — they land three sixteenths later, repeatedly, drifting across the bar before realigning. Against a straight eighth-note part, that creates the interlocking, galloping pattern heard on countless pop and rock records, most famously in U2's guitar sound.

It's a rhythmic trick, not a timbral one: a single note becomes a pattern. That's why it's the first delay setting worth learning after the plain quarter.

**Practical tip:** pair it with feedback around 25–40% and roll off some high end in the repeats so the echoes sit behind the dry signal rather than competing with it.

## It's not just delay

The same arithmetic drives most time-based settings in a mix:

- **Reverb pre-delay.** A pre-delay of a sixteenth or a thirty-second (say 60–125 ms at 120 BPM) separates the dry signal from the tail, keeping vocals intelligible while still sounding large.
- **Reverb decay.** Setting the tail so it has largely died away before the next downbeat keeps dense mixes from turning to mush. At 120 BPM a bar is 2 seconds — so a 1.8 s decay clears itself; a 4 s decay smears across bars. The [reverb time calculator](/music/reverb-time-calculator/) works this out.
- **Sidechain / compressor release.** Matching release to an eighth or sixteenth lets the pump recover in time for the next hit.
- **Tremolo, auto-pan and filter LFOs.** Rate in Hz = 1000 ÷ (delay time in ms), so a quarter-note LFO at 120 BPM is 2 Hz.
- **Noise gates and stutter effects**, where the hold time is a subdivision.

## When *not* to sync

Tempo-synced times aren't a rule, they're a default:

- **Slapback echo** (roughly 60–120 ms) is usually set by ear, not by tempo — it's heard as thickening rather than rhythm.
- **Doubling and chorus-style delays** (10–40 ms) are below the threshold where we perceive separate events at all.
- **Deliberate looseness.** Nudging a synced delay a few milliseconds off can make it feel more human, the same way a slightly-behind snare feels laid back.

The rule of thumb: if you want the effect to be *heard as rhythm*, sync it. If you want it heard as *space or thickness*, set it by ear.

## Going the other way

To convert a delay time back to tempo: **BPM = 60,000 ÷ delay time (ms)**. A 400 ms quarter note is 150 BPM. Useful for matching a tempo to a sample or a loop you've been handed without metadata.

## Frequently asked questions

### How do you calculate delay time from BPM?
Divide 60,000 by the tempo to get the quarter-note delay in milliseconds. At 120 BPM that's 60,000 ÷ 120 = 500 ms. Halve it for eighths (250 ms), quarter it for sixteenths (125 ms).

### Why 60,000?
Because there are 60,000 milliseconds in a minute and BPM counts beats per minute. Dividing total milliseconds by beats gives milliseconds per beat.

### What is a dotted eighth delay?
A delay of 0.75 of a beat — 45,000 ÷ BPM, or 375 ms at 120 BPM. The echoes fall off the beat and interlock with straight eighth-note parts, producing the rhythmic, galloping delay pattern common in pop and rock guitar.

### How do I calculate a triplet delay?
Multiply the base note value by ⅔. An eighth-note triplet is 20,000 ÷ BPM — about 167 ms at 120 BPM. Triplets fit three notes in the space of two.

### What should I set reverb pre-delay to?
Often a sixteenth or thirty-second note — roughly 60–125 ms at 120 BPM. Enough separation keeps the dry vocal clear while the tail still reads as a large space. Set decay so the tail mostly clears before the next downbeat.

### Should every delay be tempo-synced?
No. Sync when you want the effect perceived as rhythm. Short slapback (60–120 ms) and doubling delays (10–40 ms) are normally dialled in by ear, since they're heard as thickness rather than distinct repeats.

### How do I convert milliseconds back to BPM?
BPM = 60,000 ÷ the quarter-note delay time in milliseconds. A 500 ms quarter note is 120 BPM; 400 ms is 150 BPM.
