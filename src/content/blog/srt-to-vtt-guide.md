---
title: "How to Convert SRT to VTT for HTML5 Video"
description: "To convert SRT to VTT, add a WEBVTT header, change the millisecond comma to a dot, and drop the cue numbers. Do it free, in your browser — nothing uploaded."
pubDate: 2026-07-28
updatedDate: 2026-07-28
archetype: how-to
tools: ["/video/srt-to-vtt/"]
heroImage: /blog/srt-to-vtt-guide.png
heroAlt: "An SRT subtitle cue transformed into a WebVTT cue, showing the three changes: a WEBVTT header added, the millisecond comma changed to a dot, and the cue index removed"
keywords:
  - how to convert SRT to VTT
  - srt to vtt
  - srt to webvtt
  - subtitle converter
  - srt to vtt online
  - webvtt for html5 video
  - difference between srt and vtt
faqs:
  - q: "How do I convert SRT to VTT?"
    a: "Add a WEBVTT header line to the top of the file, change the comma before the milliseconds in every timestamp to a dot (00:00:01,000 becomes 00:00:01.000), and optionally remove the numeric cue indices. The cue text and timings stay exactly the same. A browser-based converter does all three edits for you in one click."
  - q: "Why do I need WebVTT instead of SRT?"
    a: "The HTML5 <track> element that adds captions and subtitles to web video requires WebVTT, not SRT. SRT is the most common subtitle format, so files almost always need converting before they will display on a web page."
  - q: "What's the difference between SRT and VTT?"
    a: "Both are plain-text lists of timed cues, but they differ in three ways: VTT starts with a WEBVTT header line, VTT uses a dot before the milliseconds while SRT uses a comma, and SRT requires numeric cue indices while VTT makes them optional. VTT also supports cue positioning, styling and NOTE/STYLE blocks that SRT has no equivalent for."
  - q: "Does converting SRT to VTT change the timings?"
    a: "No. Converting preserves the cue timings and the caption text exactly. Only the header, the millisecond separator and the cue indices change — every subtitle still appears at the same moment for the same duration."
  - q: "How do I add the .vtt file to an HTML5 video?"
    a: "Place a <track> element inside your <video> element and point its src at the .vtt file, for example <track kind=\"subtitles\" src=\"subs.vtt\" srclang=\"en\" label=\"English\">. Set kind to subtitles or captions and give srclang the correct language code so the browser shows it in the captions menu."
  - q: "Is my subtitle file uploaded when I convert it?"
    a: "Not with LazyTools. The SRT to VTT converter runs entirely in your browser as pure text processing, so the file never leaves your device and it works offline. That matters for unreleased scripts or client work you would rather not send to a stranger's server."
draft: false
---

**To convert an SRT subtitle file to VTT, you make three small edits: add a `WEBVTT` header line at the top, change the comma before the milliseconds in each timestamp to a dot, and (optionally) delete the numeric cue indices.** That is the whole of how to convert SRT to VTT — the timings and the caption text never change. You need this because the HTML5 `<track>` element that puts subtitles on web video only accepts WebVTT, and SRT is the format almost everything else hands you.

<aside class="key-takeaways">

**Key takeaways**

- **SRT and VTT are both plain-text cue lists** — converting is a text edit, not a re-encode.
- **Three changes:** add a `WEBVTT` header, comma → dot before milliseconds, indices optional.
- **HTML5 `<track>` needs WebVTT**, which is why SRT files so often need converting.
- **Timings and text are preserved exactly** — only header, separator and indices change.
- **LazyTools converts in your browser** — nothing is uploaded, works offline.

</aside>

<figure>
<img src="/blog/infographic-srt-vtt.svg" alt="An SRT cue and the VTT cue it becomes, side by side. The VTT version adds a WEBVTT header line at the top, changes the timestamp comma (00:00:01,000) to a dot (00:00:01.000), and the numeric cue index 1 becomes optional. The caption text 'Hello world' and the timings are identical in both." width="1200" height="700" loading="lazy" />
<figcaption>Same cue, three changes: the WEBVTT header, comma to dot, and optional index.</figcaption>
</figure>

## SRT vs VTT: the three differences

SubRip (`.srt`) and WebVTT (`.vtt`) are close cousins. Both are plain-text files listing cues, and each cue is just a time range plus a line or two of text. The differences that matter for conversion come down to exactly three things:

| Aspect | SRT (.srt) | VTT (.vtt) |
| --- | --- | --- |
| Header line | none — file starts with the first cue | must start with `WEBVTT` |
| Millisecond separator | comma: `00:00:01,000` | dot: `00:00:01.000` |
| Cue indices | required numeric index before each cue | optional |

WebVTT can do more on top of this — it allows cue positioning and styling, plus `NOTE` comments and `STYLE` blocks that SRT has no equivalent for. But for a straight conversion you only need to handle the three rows above. Get those right and the file is valid VTT.

It helps to remember why the formats diverged. SRT came out of desktop video players, where a numbered list of cues was all anyone needed. WebVTT was designed for the web, so it borrowed SRT's simple cue structure but added a header to identify the format and a few features browsers could hang styling off. The dot-versus-comma difference is the most easily overlooked, because it is a single character buried in every timestamp — which is exactly why a manual find-and-replace so often misses one.

## Convert SRT to VTT, step by step

Take a single SRT cue. Here is what a typical one looks like:

```srt
1
00:00:01,000 --> 00:00:04,000
Hello world
```

Now apply the three changes. Add the `WEBVTT` header (followed by a blank line), swap the comma in the timestamp for a dot, and drop the `1` index. The result is valid WebVTT:

```vtt
WEBVTT

00:00:01.000 --> 00:00:04.000
Hello world
```

That is it. The text `Hello world` is untouched, and the cue still starts at one second and ends at four. For a whole file you repeat the timestamp fix on every line that contains `-->`, which is tedious by hand and easy to get wrong — one missed comma and the browser rejects the cue.

The [SRT to VTT converter](/video/srt-to-vtt/) does the entire file in one step, in your browser, so nothing is uploaded. If you ever need to go the other direction — say a desktop player only wants SubRip — the [VTT to SRT converter](/video/vtt-to-srt/) reverses the process.

## Add the subtitles to your HTML5 video

Once you have a `.vtt` file, you attach it to a video with a `<track>` element nested inside `<video>`:

```html
<video controls>
  <source src="movie.mp4" type="video/mp4" />
  <track kind="subtitles" src="subs.vtt" srclang="en" label="English" />
</video>
```

The `kind` tells the browser what the file is (`subtitles` for a translation, `captions` for same-language captions that also note sounds). `srclang` is the language code, and `label` is the human-readable name shown in the player's captions menu. Point `src` at your converted `.vtt` file and the subtitles appear in the built-in controls.

You can add more than one `<track>` — one per language — and mark a preferred one with the `default` attribute so it shows automatically. Each still points at its own `.vtt` file with its own `srclang` and `label`, which is why getting the conversion and the language codes right for every file matters once you go beyond a single caption track.

## Common mistakes

A few errors account for almost every "my captions won't show" problem:

- **Leaving the comma millisecond separator.** `00:00:01,000` is still SRT syntax; WebVTT needs the dot. A single stray comma can invalidate a cue.
- **Missing the `WEBVTT` header.** Without that first line the file is not recognised as WebVTT at all, no matter how correct the cues are.
- **Wrong `<track>` attributes.** Forgetting `kind`, or giving `srclang` a bad or missing language code, keeps the track out of the captions menu.
- **Serving `.vtt` with the wrong MIME type.** The file should be served as `text/vtt`. If your server sends it as `text/plain` or `application/octet-stream`, some browsers refuse to load it — a server config fix, not a file fix.

If your subtitles load but appear at the wrong moments, that is a timing problem, not a format one — the [subtitle shifter](/video/subtitle-shifter/) nudges every cue earlier or later to resync them.

## Convert it locally

Converting SRT to VTT is a plain-text transformation: header, separator, indices. Because there is no media to re-encode, there is no reason for the file to leave your machine. The [SRT to VTT converter](/video/srt-to-vtt/) runs entirely in your browser and works offline — useful when the subtitles belong to an unreleased cut or a client project you would rather not upload anywhere. Fix the three things, drop the `.vtt` into your `<track>`, and your HTML5 video has captions.

---

*This is general how-to information about the SubRip (SRT) and WebVTT (.vtt) subtitle formats. The LazyTools SRT to VTT converter processes text entirely in your browser; the file is never uploaded. WebVTT is the format required by the HTML5 <track> element.*
