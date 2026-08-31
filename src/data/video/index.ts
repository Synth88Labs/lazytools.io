/** Audio & Video tools registry (audio tools first, video requires heavier codecs). */

export interface AudioToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'trim' | 'speed' | 'volume' | 'wav' | 'frame' | 'merge' | 'srt-vtt' | 'vtt-srt' | 'shift' | 'audioinspect' | 'id3' | 'flac';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const AUDIO_TOOLS: AudioToolDef[] = [
  {
    slug: 'audio-trimmer',
    name: 'Audio Trimmer',
    icon: '✂️',
    description:
      'Cut a section out of an audio file, set start and end, preview, download as WAV. Decoded and trimmed in your browser; recordings are never uploaded.',
    lead: 'Cut the exact seconds you need from any audio file, preview the result and download, without the recording leaving your device.',
    widget: 'trim',
    how: 'The file is decoded to raw samples with the Web Audio API (the browser understands MP3, WAV, OGG, M4A/AAC and FLAC natively), the selected span is rendered sample-accurately, and the result is encoded as a standard 16-bit WAV. Sample-accurate means the cut points map to individual audio samples rather than to whole compressed frames: your start and end times are multiplied by the sample rate to find the exact samples to keep, and only those are copied into the output, so nothing before or after the selection survives. Output is WAV because browsers decode everything but only encode uncompressed reliably. It plays everywhere and re-encodes cleanly to MP3/AAC in any editor if you need small files.',
    note: 'Voice memos, meeting recordings, interview clips, audio people trim is very often audio of people. Local processing isn\'t a nicety for this category; it\'s the reason the tool exists. Everything happens in browser memory and works offline.',
    faqs: [
      { q: 'What input formats work?', a: 'Whatever your browser can decode, MP3, WAV, OGG, M4A/AAC and usually FLAC. If the file loads and shows a duration, it\'s supported.' },
      { q: 'Why is the output WAV instead of MP3?', a: 'Browsers ship decoders for everything but no reliable MP3/AAC encoder. WAV is lossless and universally playable; converting it to MP3 later (in any editor or converter) costs nothing extra in quality versus encoding directly.' },
      { q: 'Why is the WAV file so much bigger than my MP3?', a: 'WAV is uncompressed: stereo at 44.1 kHz runs about 10 MB per minute regardless of content. Your 5 MB MP3 might become a 40 MB WAV of the same audio, that\'s the format, not a bug.' },
      { q: 'How precise is the cut?', a: 'Sample-accurate, the trim happens on the decoded waveform, so at 44.1 kHz the boundary lands within ~0.00002 seconds of what you set.' },
      { q: 'Can I keep the middle of a file and drop both ends?', a: 'Yes, that is the normal use. Set the start where you want the clip to begin and the end where it should stop; everything outside that span is discarded and the kept section becomes the whole output file.' },
      { q: 'Does trimming re-compress or lose quality?', a: 'The trim itself is lossless. It copies the existing decoded samples untouched into a 16-bit WAV. If your source was already a lossy MP3 or AAC, those earlier losses remain, but trimming adds none of its own the way re-encoding to MP3 would.' },
      { q: 'Is my recording uploaded?', a: 'No, decoding, trimming and encoding all run in your browser\'s memory. Disconnect from the internet and it works identically.' },
    ],
    keywords: ['trim audio online', 'cut mp3', 'audio trimmer', 'crop audio file', 'cut audio without uploading'],
  },
  {
    slug: 'audio-speed-changer',
    name: 'Audio Speed Changer',
    icon: '⏩',
    description:
      'Speed up or slow down audio from 0.5× to 3× and download the result as WAV, processed locally, nothing uploaded.',
    lead: 'Play back a lecture at 1.5× permanently, or slow a riff to 0.75× to learn it, rendered on your device and saved as WAV.',
    widget: 'speed',
    how: 'The audio is decoded to samples and re-rendered at your chosen playback rate through an offline audio graph, then encoded as WAV. This is resampling: 2× halves the duration and raises pitch one octave, 0.5× doubles duration and drops it one octave, like a record played at the wrong speed. Pitch-preserving time-stretch is a different, artifact-prone algorithm; honest resampling keeps the audio clean.',
    note: 'Practical settings: 1.25-1.75× for lectures and podcasts (voices get chipmunk-ish beyond that since pitch shifts too), 0.5-0.75× for transcribing fast speech or learning music by ear. For casual listening most players already offer pitch-corrected speed. This tool is for when you need the changed file itself.',
    faqs: [
      { q: 'Does changing speed change pitch?', a: 'Yes. This tool resamples, so speed and pitch move together (2× is one octave up), exactly like tape or vinyl at the wrong speed. That\'s the artifact-free method; pitch-preserving stretch smears transients and is best left to dedicated audio software.' },
      { q: 'What speed range is available?', a: '0.5× (half speed, one octave down) to 3×. For listenable speech, 1.25-1.75× is the useful zone; beyond 2× the pitch shift makes voices hard on the ears.' },
      { q: 'How does 1.5× affect the file duration?', a: 'Duration divides by the rate: a 60-minute recording at 1.5× becomes 40 minutes; at 0.75× it becomes 80 minutes. The tool shows the output duration before you render.' },
      { q: 'Why does the output come out as WAV?', a: 'Browsers decode compressed formats but don\'t reliably encode them, so results are saved as universal lossless WAV. Convert to MP3 afterwards if size matters, the quality cost is the same as encoding directly would have been.' },
      { q: 'Is the audio processed on a server?', a: 'No, the offline audio renderer runs on your device. Nothing about the file, including its existence, leaves your browser.' },
    ],
    keywords: ['change audio speed', 'speed up audio', 'slow down audio', 'audio speed changer online', 'slow down music to learn'],
  },
  {
    slug: 'audio-volume-changer',
    name: 'Audio Volume Changer',
    icon: '🔊',
    description:
      'Boost or reduce an audio file\'s volume, with a clipping check that tells you the safe maximum gain, processed locally, saved as WAV.',
    lead: 'Make a quiet recording louder (or a loud one quieter), with the tool measuring your file\'s headroom so you boost without distortion.',
    widget: 'volume',
    how: 'The audio is decoded and every sample is multiplied by your gain factor, then encoded as WAV. Before you choose, the tool measures the file\'s peak level and reports the maximum clean gain, amplification beyond the point where peaks hit full scale flattens them into hard clipping, the harsh distortion of over-driven audio. Staying at or below the suggested maximum keeps the waveform intact.',
    note: 'If a recording is quiet in places and loud in others, flat gain can\'t fix both, the loud parts hit the ceiling before the quiet parts are loud enough. That problem needs compression/normalization in an audio editor; this tool is the right fix when the whole file is uniformly too quiet or too loud.',
    faqs: [
      { q: 'How much can I boost without distortion?', a: 'Up to the point where the file\'s loudest peak reaches full scale, which depends on the recording. The tool measures your file and shows that safe maximum; beyond it, peaks clip and distort audibly.' },
      { q: 'What does the clipping warning mean?', a: 'Digital audio has a hard ceiling. Samples pushed past it are flattened ("clipped"), which sounds like harsh crackling on peaks. The warning appears when your chosen gain would push measured peaks over the ceiling.' },
      { q: 'My recording is quiet only in parts, will this fix it?', a: 'Flat gain raises everything equally, so if loud sections already sit near the ceiling, the quiet parts can\'t be boosted enough without clipping the loud ones. Uneven levels need dynamic compression in an audio editor.' },
      { q: 'What is a dB and how does it relate to the multiplier?', a: 'Decibels are the logarithmic scale audio uses: ×2 amplitude = +6 dB, ×0.5 = −6 dB. The tool shows both, since editors talk dB while the math is a plain multiplication.' },
      { q: 'Is my audio uploaded?', a: 'No, measurement, gain and encoding run in your browser. Voice recordings never touch a server.' },
    ],
    keywords: ['increase audio volume', 'make audio louder', 'volume booster online', 'boost mp3 volume', 'audio gain'],
  },
  {
    slug: 'audio-to-wav',
    name: 'Audio to WAV Converter',
    icon: '🎚️',
    description:
      'Convert MP3, M4A, OGG or FLAC to standard uncompressed WAV, decoded by your browser locally, nothing uploaded.',
    lead: 'Any audio your browser plays → standard 16-bit WAV, the format every editor, sampler and legacy system accepts, converted on your device.',
    widget: 'wav',
    how: 'The source is decoded to raw samples with the browser\'s built-in codecs and written out as a 16-bit PCM WAV at the original sample rate. WAV is the lowest-common-denominator format: uncompressed, patent-free, readable by every DAW, editor, court-transcription workflow and embedded system since the 1990s. Decoding a lossy source doesn\'t restore lost quality. It makes the already-decoded audio maximally compatible.',
    note: 'Know what conversion can and can\'t do: MP3 → WAV does not "upgrade" the audio, the MP3\'s losses are permanent; the WAV just stores them losslessly (in a much bigger file). The conversion is for compatibility: tools that demand WAV input, editing without generation loss, or archiving a decode. Expect ~10 MB per stereo minute.',
    faqs: [
      { q: 'Does converting MP3 to WAV improve quality?', a: 'No, lossy compression discards audio permanently; conversion just re-packages what\'s left. The value is compatibility and editability: WAV re-saves without further generation loss, unlike re-encoding MP3 to MP3.' },
      { q: 'Why is the WAV so much bigger?', a: 'WAV is uncompressed PCM: 44.1 kHz stereo 16-bit is about 10 MB per minute, always. A 4 MB MP3 of a 4-minute song becomes roughly 40 MB of WAV.' },
      { q: 'What sample rate and bit depth does the output use?', a: 'Your file\'s original sample rate (commonly 44.1 or 48 kHz) at 16-bit, the CD-standard combination that every application accepts.' },
      { q: 'What input formats can I convert?', a: 'Anything the browser decodes: MP3, M4A/AAC, OGG, FLAC and WAV itself. If it plays in a browser tab, it converts here.' },
      { q: 'Is the audio sent to a server for conversion?', a: 'No, the browser\'s own decoder does the work locally. It runs offline, and no copy of your file exists anywhere but your device.' },
    ],
    keywords: ['mp3 to wav', 'convert audio to wav', 'm4a to wav', 'audio converter online', 'flac to wav'],
  },
  {
    slug: 'video-frame-extractor',
    name: 'Video Frame Extractor',
    icon: '🎞️',
    description:
      'Grab a still frame from any video as a PNG or JPEG, scrub to the exact moment and capture at full resolution. Runs in your browser, the video is never uploaded.',
    lead: 'Pull a still image out of a video: scrub to the moment you want, then capture it at the video’s full resolution as PNG or JPEG. Nothing leaves your device.',
    widget: 'frame',
    how: 'The video is loaded straight into a <video> element from a local object URL, so your browser’s own decoder handles playback. Scrub to the moment you want and the tool draws that exact frame onto a canvas sized to the video’s native resolution, then encodes it as a PNG or JPEG for download. Because the whole pipeline is the browser’s built-in decoder plus a canvas, there is no upload, no conversion queue and no watermark, and the captured image is full quality, not the size of the on-screen preview.',
    note: 'Deliberately built without ffmpeg.wasm. Frame-accurate seeking and re-encoding would need SharedArrayBuffer, which requires cross-origin isolation headers that break third-party scripts on the page, plus a download of around 25 MB before you could do anything. For pulling a still out of a video none of that is necessary, the decoder is already in your browser. The trade-off is that browsers do not expose exact frame boundaries, so the ±1 frame buttons assume roughly 30 fps; use the slider for fine positioning. Which formats open at all depends on your browser’s codec support: MP4 (H.264) and WebM are near-universal, while some MOV and AVI variants may not decode.',
    faqs: [
      { q: 'How do I extract a frame from a video?', a: 'Choose the video, scrub the slider to the moment you want, then click Capture. The frame downloads as a PNG or JPEG at the video’s full resolution. Everything happens in your browser.' },
      { q: 'Is the captured image full quality?', a: 'Yes, the frame is drawn to a canvas matching the video’s native resolution, so a 1080p video yields a 1920×1080 image regardless of how large the preview appears on screen. PNG is lossless; JPEG lets you trade some quality for a smaller file.' },
      { q: 'Why are the frame-step buttons approximate?', a: 'Browsers don’t expose exact frame boundaries to web pages, so stepping assumes about 30 fps. If your video runs at a different rate, use the slider to fine-tune the position, the capture itself is always exact for wherever the video is paused.' },
      { q: 'Which video formats work?', a: 'Whatever your browser can decode, MP4 (H.264) and WebM work almost everywhere, and most MOV files do too. Some AVI, MKV or unusual codec combinations may not open, in which case the tool tells you rather than failing silently.' },
      { q: 'Why not use ffmpeg for this?', a: 'ffmpeg.wasm needs SharedArrayBuffer, which requires cross-origin isolation headers that would block third-party scripts on the page, and it downloads roughly 25 MB before doing any work. Your browser already contains a video decoder, so a still frame needs neither.' },
      { q: 'Is my video uploaded?', a: 'No. It’s read from your device as a local object URL and decoded by your browser. Nothing is transmitted, and the tool works offline once the page has loaded.' },
    ],
    keywords: ['extract frame from video', 'video frame extractor', 'video to image', 'screenshot from video', 'video thumbnail grabber', 'save frame as png'],
  },
  {
    slug: 'audio-merger',
    name: 'Audio Merger (Join Audio Files)',
    icon: '🎚️',
    description:
      'Merge multiple audio files into one, MP3, WAV, OGG, M4A, in any order, and download a single WAV. Runs entirely in your browser; nothing is uploaded.',
    lead: 'Combine several audio clips end to end: add your files, drag them into order, and download one merged WAV, all processed locally in your browser.',
    widget: 'merge',
    how: 'Each file is decoded to raw audio with the Web Audio API, then the clips are played back to back into an offline audio renderer in the order you set, producing one continuous track that is exported as a 16-bit WAV. Because it uses Web Audio rather than a video/ffmpeg engine, it needs no special browser flags and never uploads your files, everything happens on your device.',
    note: 'Files with different sample rates or channel counts are automatically resampled and matched to the highest quality among them, so mixing a mono voice memo with a stereo track works fine. The output is uncompressed WAV (large but lossless); convert it to MP3 afterwards with the WAV converter if you need a smaller file. Clips join directly with no gap or crossfade.',
    faqs: [
      { q: 'How do I merge audio files?', a: 'Add two or more audio files, order them with the up/down arrows, and click "Merge & download WAV". The clips are joined end to end into one track, entirely in your browser.' },
      { q: 'What formats can I merge?', a: 'Any format your browser can decode, MP3, WAV, OGG, M4A/AAC and usually FLAC. They\'re decoded to raw audio first, so you can mix formats freely. The output is a single WAV file.' },
      { q: 'Why is the output a WAV and not an MP3?', a: 'WAV is lossless and encodes instantly in the browser without extra libraries. If you need a smaller MP3, run the merged WAV through an MP3 converter afterwards.' },
      { q: 'Are my audio files uploaded?', a: 'No. Decoding and merging use the Web Audio API on your device, so the files never leave your browser. It works offline once the page has loaded.' },
    ],
    keywords: ['audio merger', 'merge audio files', 'combine mp3', 'join audio files', 'audio joiner', 'merge mp3 online', 'concatenate audio'],
  },
  {
    slug: 'srt-to-vtt',
    name: 'SRT to VTT Converter',
    icon: '💬',
    description:
      'Convert SubRip (.srt) subtitles to WebVTT (.vtt) for HTML5 video, in your browser, never uploaded.',
    lead: 'Turn an .srt subtitle file into the .vtt format HTML5 <track> needs, paste or load the file, all locally.',
    widget: 'srt-vtt',
    how: 'SRT and WebVTT are both plain-text cue lists, but they differ in three ways: VTT starts with a WEBVTT header, uses a dot before the milliseconds (00:00:01.000) instead of SRT\'s comma (00:00:01,000), and makes the numeric cue indices optional. Each cue is a timestamp line "start --> end" followed by one or more lines of caption text and a blank line, and the tool rewrites only the timestamp punctuation and header, every character of the caption text and every millisecond of the timings is carried across unchanged. That means the conversion never re-times anything: a cue that showed at 00:00:04 in the SRT shows at exactly 00:00:04 in the VTT.',
    note: 'WebVTT is the format the HTML5 <track> element requires for captions and subtitles on web video, which is why SRT files (the most common subtitle format) so often need converting. The conversion is pure text processing done on your device, subtitle files, which can contain unreleased scripts or private transcripts, never leave the browser.',
    faqs: [
      { q: 'How do I convert SRT to VTT?', a: 'Load or paste your .srt subtitles and the tool outputs valid WebVTT you can copy or download as a .vtt file. Timings and text are preserved; only the header, millisecond separator and indices change.' },
      { q: 'Why do I need WebVTT instead of SRT?', a: 'The HTML5 <track> element for captions on web video accepts WebVTT, not SRT. Converting lets you add existing SRT subtitles to a <video> element without re-timing anything.' },
      { q: 'What actually changes between the formats?', a: 'VTT adds a WEBVTT header line, uses a dot before milliseconds (00:00:01.000 vs 00:00:01,000), and treats cue numbers as optional. The cue times and text stay identical.' },
      { q: 'Can I show the converted captions on my own website?', a: 'Yes, save the output as a .vtt file and reference it from a <track kind="subtitles" src="…"> element inside your <video>. WebVTT is the only subtitle format the HTML5 <track> element officially supports, which is the usual reason to convert an SRT.' },
      { q: 'Does the converter keep line breaks within a caption?', a: 'Yes, a two-line SRT cue stays a two-line VTT cue. Both formats treat a line break inside a cue as part of the caption text, so multi-line subtitles carry across exactly as written.' },
      { q: 'Will it handle a whole file with hundreds of cues?', a: 'Yes, every cue in the file is parsed and rewritten in one pass, however many there are. Since it is plain text processed locally, even a feature-length subtitle track converts instantly.' },
      { q: 'Are my subtitle files uploaded?', a: 'No. It\'s pure text conversion in your browser. Scripts and transcripts stay on your device and it works offline.' },
    ],
    keywords: ['srt to vtt', 'convert srt to vtt', 'srt to webvtt', 'subtitle converter', 'srt to vtt online', 'vtt converter'],
  },
  {
    slug: 'vtt-to-srt',
    name: 'VTT to SRT Converter',
    icon: '🗨️',
    description:
      'Convert WebVTT (.vtt) captions to SubRip (.srt) subtitles for players and editors that expect SRT, in your browser, never uploaded.',
    lead: 'Turn a .vtt caption file into the widely-supported .srt format, paste or load it, all in the browser.',
    widget: 'vtt-srt',
    how: 'The tool parses your WebVTT cues, skipping the WEBVTT header and any NOTE or STYLE blocks, and dropping cue settings like alignment that SRT doesn\'t support, then rewrites them as SubRip: numbered cues, with a comma before the milliseconds (00:00:01,000). Because SRT requires a sequential index above each cue, the converter numbers them 1, 2, 3… in order even if the source VTT left its cues unnumbered or used text labels. Timestamps also gain their leading hours field if the VTT used the short mm:ss.mmm form, since SRT always writes the full hh:mm:ss,mmm. The timings and caption text themselves are preserved exactly.',
    note: 'SRT is the most widely supported subtitle format across media players, editors and upload forms, so VTT captions (often extracted from web video) frequently need converting back. Positioning and styling that WebVTT allows have no SRT equivalent and are dropped, plain text and timings carry over. Everything runs on your device.',
    faqs: [
      { q: 'How do I convert VTT to SRT?', a: 'Load or paste your .vtt captions and the tool produces numbered SRT cues you can copy or download as .srt. The WEBVTT header, notes and styling are removed; timings and text are kept.' },
      { q: 'Why convert VTT to SRT?', a: 'SRT is accepted almost everywhere, desktop players like VLC, video editors, and many upload forms, while VTT is mainly a web format. Converting makes web captions usable in those tools.' },
      { q: 'Is any information lost?', a: 'Only WebVTT-specific extras: the header, NOTE/STYLE blocks, and cue positioning/styling, which SRT has no way to express. The caption text and all timings are preserved exactly.' },
      { q: 'What if my VTT timestamps have no hours, like 01:20.500?', a: 'They are expanded to SRT\'s full form. WebVTT allows the short mm:ss.mmm notation, but SRT always uses hh:mm:ss,mmm, so 01:20.500 becomes 00:01:20,500, the same moment, just written with the leading hours field SRT expects.' },
      { q: 'Why does SRT need the cues numbered?', a: 'The SubRip format puts a sequential index line above each cue, and many players rely on it. WebVTT makes those numbers optional, so the converter adds them 1, 2, 3… in playback order regardless of whether the source had any.' },
      { q: 'Can I load a captions file I downloaded from a web video?', a: 'Yes, web captions are frequently WebVTT, and this converts them to the SRT that desktop players, editors and upload forms expect. Paste the text or load the .vtt file and download the .srt result.' },
      { q: 'Are my captions uploaded?', a: 'No, the conversion is done in your browser as plain text. Nothing is transmitted and it works offline.' },
    ],
    keywords: ['vtt to srt', 'convert vtt to srt', 'webvtt to srt', 'vtt to subtitle', 'vtt to srt online', 'subtitle converter'],
  },
  {
    slug: 'subtitle-shifter',
    name: 'Subtitle Shifter (Resync)',
    icon: '⏱️',
    description:
      'Shift subtitle timings forward or back to fix out-of-sync captions, SRT or VTT, in your browser, never uploaded.',
    lead: 'Captions running early or late? Shift every cue by a set number of seconds to resync, SRT or VTT, all locally.',
    widget: 'shift',
    how: 'When subtitles are consistently ahead of or behind the audio, every cue needs moving by the same amount. Enter a shift in seconds, positive to delay the subtitles (they appear later), negative to move them earlier, and the tool converts each cue\'s start and end timestamp to milliseconds, adds the offset, and writes them back in the original format (SRT or VTT). Both the start and end move by the identical amount, so every caption keeps its original on-screen duration; only its position on the timeline changes. Times can\'t go below zero, so any cue that would be pushed before 00:00 is clamped to the start.',
    note: 'This fixes a constant offset, the whole track being a second or two out, not drift, where the gap grows over the film (a frame-rate mismatch, which needs stretching rather than shifting). Work out the offset from one known line: if a caption shows at 00:10 but should be at 00:12, shift by +2 seconds. It\'s pure text math done on your device.',
    faqs: [
      { q: 'How do I resync subtitles that are out of sync?', a: 'Load the SRT or VTT, find how many seconds off one line is, and enter that as the shift, positive if the subtitles are early (to delay them), negative if late. Every cue moves by that amount; download the fixed file.' },
      { q: 'Does it work for both SRT and VTT?', a: 'Yes. It detects the format from the file and keeps it. SRT stays SRT (comma milliseconds, numbered), VTT stays VTT (WEBVTT header, dot milliseconds).' },
      { q: 'What if the subtitles drift more over time?', a: 'A constant shift only fixes a fixed offset. If the gap grows through the video, that\'s a frame-rate mismatch that needs time-stretching, not shifting. This tool handles the common constant-offset case.' },
      { q: 'Do positive and negative shifts move subtitles which way?', a: 'A positive shift delays the subtitles so they appear later, use it when captions are running ahead of the speech. A negative shift moves them earlier, use it when captions lag behind. If a line reads at 00:10 but should read at 00:12, shift by +2 seconds.' },
      { q: 'Does shifting change how long each caption stays on screen?', a: 'No, the start and end of every cue move by the same offset, so each caption\'s duration is unchanged. Only the whole track slides earlier or later along the timeline.' },
      { q: 'Can I enter a fraction of a second?', a: 'Yes, the shift accepts decimals, so you can nudge by 0.5 or 1.25 seconds. Internally the timestamps are handled in milliseconds, so sub-second corrections are applied precisely.' },
      { q: 'Are my subtitles uploaded?', a: 'No, the shift is calculated in your browser and nothing is sent anywhere. It works offline.' },
    ],
    keywords: ['subtitle shifter', 'resync subtitles', 'shift srt timing', 'subtitle delay', 'fix out of sync subtitles', 'adjust subtitle timing', 'srt time shift'],
  },
  {
    slug: 'wav-aiff-inspector',
    name: 'WAV / AIFF Audio Inspector',
    icon: '🎧',
    description:
      'Inspect a WAV or AIFF audio file to read its sample rate, bit depth, channels, codec and exact duration from the header, in your browser, never uploaded.',
    lead: 'Drop a .wav or .aiff file to instantly read its sample rate, bit depth, channel count, codec and length, straight from the file header.',
    widget: 'audioinspect',
    how: 'WAV and AIFF are chunk-based container formats: a WAV is a RIFF file whose "fmt " chunk holds the audio format and whose "data" chunk holds the samples, while an AIFF wraps a "COMM" chunk with the same facts. This tool reads those header chunks, nothing else, to report the sample rate, bit depth, number of channels, the codec (PCM, IEEE float, A-law, and so on), the byte rate/bitrate, and the exact duration computed from the data size and format. It also lists any embedded INFO or NAME tags. Because it only parses the header, it is instant even on a large file and never touches the audio samples.',
    note: 'This reads the technical specs baked into the file, which is exactly what you need when checking whether a recording is 44.1 kHz or 48 kHz, 16-bit or 24-bit, mono or stereo, before mastering, submitting to a service, or converting. It handles uncompressed WAV and AIFF/AIFF-C (including the 80-bit extended sample-rate field AIFF uses); it does not read compressed formats like MP3, FLAC or AAC, whose headers work differently. Everything is parsed on your device, so unreleased recordings never leave your machine.',
    faqs: [
      { q: 'How do I check a WAV file\'s sample rate and bit depth?', a: 'Drop the .wav file in and the tool reads its "fmt " chunk, showing the sample rate (e.g. 44100 Hz), bit depth (e.g. 16-bit), channel count and codec instantly, no playback or re-encoding needed.' },
      { q: 'How is the duration calculated?', a: 'From the header, not by decoding audio. For WAV it divides the "data" chunk size by the block align and sample rate; for AIFF it divides the number of sample frames by the sample rate. That gives an exact length in seconds without reading the samples.' },
      { q: 'Does it support AIFF as well as WAV?', a: 'Yes. It reads AIFF and AIFF-C, including the unusual 80-bit extended-precision floating-point field AIFF uses to store the sample rate, and it names the AIFF-C codec (NONE, sowt, fl32, and so on).' },
      { q: 'Can it read MP3 or FLAC files?', a: 'No. This tool is for uncompressed PCM containers (WAV and AIFF). MP3, FLAC, AAC and similar formats use different header structures and frame-based layouts, so they aren\'t parsed here.' },
      { q: 'Is my audio uploaded?', a: 'No, only the header chunks are read, entirely in your browser, and nothing is transmitted. It works offline, and large files are read instantly because the samples are never loaded.' },
    ],
    keywords: ['wav inspector', 'aiff inspector', 'wav sample rate checker', 'check wav bit depth', 'audio file info', 'wav header reader', 'wav metadata', 'aiff sample rate'],
  },
  {
    slug: 'mp3-tag-reader',
    name: 'MP3 Tag Reader (ID3)',
    icon: '🎵',
    description:
      'Read an MP3\'s ID3 tags, title, artist, album, year, genre, track, plus its bitrate, sample rate and duration. In your browser, never uploaded.',
    lead: 'Drop an .mp3 to read its ID3 tags (title, artist, album, genre…) and audio details like bitrate, sample rate and length, all locally.',
    widget: 'id3',
    how: 'An MP3\'s metadata lives in ID3 tags. The tool reads the ID3v2 tag at the start of the file (versions 2.2, 2.3 and 2.4), decoding each text frame in its declared character set, whether Latin-1, UTF-16 or UTF-8, and falls back to the older 128-byte ID3v1 tag at the end of the file if there\'s no ID3v2. It resolves numeric genre codes (like "(17)") to their names, notes whether cover art is embedded, and then reads the first MPEG audio frame header to report the MPEG version, layer, bitrate, sample rate and channel mode. If the file has a Xing/Info VBR header it uses the frame count for an exact duration; otherwise it estimates from the constant bitrate.',
    note: 'Useful for checking exactly how a track is tagged before importing it into a library, spotting missing or mojibake (wrongly-encoded) fields, or confirming a file\'s real bitrate and sample rate. It reads MP3 (MPEG-1/2 Layer III) tags and headers; it doesn\'t read tags in other formats like FLAC (Vorbis comments) or M4A/AAC (MP4 atoms), which store metadata differently. This is a reader, not an editor. It shows the tags without changing them, and everything is parsed on your device, so the file is never uploaded.',
    faqs: [
      { q: 'How do I see an MP3\'s title, artist and album?', a: 'Drop the .mp3 in and the tool reads its ID3 tags, listing the title, artist, album, year, genre, track number and any other text frames it finds. Copy them or just check they\'re correct before importing the file.' },
      { q: 'What is the difference between ID3v1 and ID3v2?', a: 'ID3v1 is an old, fixed 128-byte block at the end of the file with room for only short title/artist/album/year/comment/genre fields. ID3v2 sits at the start, is extensible, supports long Unicode text and cover art, and is what modern software writes. This tool reads both, preferring ID3v2.' },
      { q: 'Can it tell me an MP3\'s bitrate and sample rate?', a: 'Yes. It parses the first MPEG audio frame header to report the MPEG version, layer, bitrate, sample rate and channel mode, and computes the duration (using the Xing/Info VBR header when present for an exact figure).' },
      { q: 'Why do some tags show garbled characters elsewhere but not here?', a: 'Because ID3 text can be stored in several character encodings (Latin-1, UTF-16, UTF-8) and some players guess wrong. This reader decodes each frame using the encoding byte the tag declares, so accented and non-Latin text shows correctly.' },
      { q: 'Does it read FLAC, M4A or WAV tags?', a: 'No. Those use different metadata systems (Vorbis comments, MP4 atoms, RIFF chunks). This tool is specifically for MP3/ID3. For WAV and AIFF, use the WAV/AIFF Inspector instead.' },
      { q: 'Is my MP3 uploaded?', a: 'No, the tags and headers are parsed entirely in your browser and nothing is transmitted, so your music stays on your device. It works offline too.' },
    ],
    keywords: ['mp3 tag reader', 'id3 tag reader', 'read mp3 metadata', 'mp3 metadata viewer', 'id3v2 reader', 'mp3 bitrate checker', 'view mp3 tags', 'mp3 info'],
  },
  {
    slug: 'flac-metadata-viewer',
    name: 'FLAC Metadata Viewer',
    icon: '🎼',
    description:
      'Inspect a FLAC file to read its sample rate, bit depth, channels and exact duration, plus its Vorbis comment tags (title, artist, album). In your browser, never uploaded.',
    lead: 'Drop a .flac file to read its audio specs (sample rate, bit depth, duration) and its Vorbis comment tags, title, artist, album and more.',
    widget: 'flac',
    how: 'A FLAC file starts with a "fLaC" marker followed by a series of metadata blocks, and this tool reads the two that matter. The STREAMINFO block packs the sample rate, channel count, bit depth and total sample count into a few bytes, from which the exact duration is computed, plus an MD5 of the decoded audio. The VORBIS_COMMENT block holds the tags as KEY=value pairs (TITLE, ARTIST, ALBUM, DATE, TRACKNUMBER and any others) along with the encoder\'s vendor string. It also notes whether cover art (a PICTURE block) is embedded. Because it reads only the metadata blocks and never decodes the compressed audio, it\'s instant even on a large lossless file.',
    note: 'This is handy for checking a FLAC\'s real resolution, whether it\'s genuine 24-bit/96 kHz "hi-res" or just CD-quality 16-bit/44.1 kHz, and for confirming its tags before importing into a library. FLAC uses Vorbis comments for tags, which are different from MP3\'s ID3 and WAV\'s RIFF chunks, so it needs its own reader (for those, use the MP3 Tag Reader and the WAV/AIFF Inspector). It reads tags; it doesn\'t change them. Everything is parsed on your device, so your music stays private.',
    faqs: [
      { q: 'How do I check a FLAC\'s sample rate and bit depth?', a: 'Drop the .flac file in and the tool reads its STREAMINFO block, showing the sample rate (e.g. 44100 Hz), bit depth (e.g. 16- or 24-bit), channel count and exact duration instantly, no decoding needed.' },
      { q: 'Is my FLAC really hi-res?', a: 'The bit depth and sample rate from STREAMINFO tell you. True "hi-res" is typically 24-bit and 88.2 kHz or higher; a file that\'s 16-bit/44.1 kHz is CD quality regardless of how it was labelled. This tool shows the actual stored values so you can tell.' },
      { q: 'What are Vorbis comments?', a: 'They\'re FLAC\'s tagging system, simple KEY=value text pairs like TITLE=…, ARTIST=…, ALBUM=…, DATE=…. Unlike MP3\'s fixed ID3 frames, Vorbis comment keys are free-form, so a FLAC can carry any tag a tagger writes. The tool lists them all.' },
      { q: 'What is the audio MD5 in a FLAC?', a: 'STREAMINFO stores an MD5 checksum of the raw decoded audio. FLAC decoders use it to verify that decoding reproduced the original samples exactly, which is how FLAC guarantees it\'s lossless. The tool displays it for reference.' },
      { q: 'Does it read MP3 or WAV tags too?', a: 'No. This is specifically for FLAC, which uses Vorbis comments. MP3 uses ID3 tags and WAV/AIFF use RIFF chunks, which are different formats; use the dedicated MP3 Tag Reader or WAV/AIFF Inspector for those.' },
      { q: 'Is my file uploaded?', a: 'No, only the metadata blocks are read, entirely in your browser, and nothing is transmitted. It works offline, and large files are read instantly because the audio is never decoded.' },
    ],
    keywords: ['flac metadata viewer', 'flac tag reader', 'read flac metadata', 'flac sample rate checker', 'flac bit depth', 'vorbis comment reader', 'flac info', 'is my flac hi-res'],
  },
];
