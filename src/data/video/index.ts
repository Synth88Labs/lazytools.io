/** Audio & Video tools registry (audio tools first — video requires heavier codecs). */

export interface AudioToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'trim' | 'speed' | 'volume' | 'wav' | 'frame';
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
      'Cut a section out of an audio file — set start and end, preview, download as WAV. Decoded and trimmed in your browser; recordings are never uploaded.',
    lead: 'Cut the exact seconds you need from any audio file — preview the result and download — without the recording leaving your device.',
    widget: 'trim',
    how: 'The file is decoded to raw samples with the Web Audio API (the browser understands MP3, WAV, OGG, M4A/AAC and FLAC natively), the selected span is rendered sample-accurately, and the result is encoded as a standard 16-bit WAV. Output is WAV because browsers decode everything but only encode uncompressed reliably — it plays everywhere and re-encodes cleanly to MP3/AAC in any editor if you need small files.',
    note: 'Voice memos, meeting recordings, interview clips — audio people trim is very often audio of people. Local processing isn\'t a nicety for this category; it\'s the reason the tool exists. Everything happens in browser memory and works offline.',
    faqs: [
      { q: 'What input formats work?', a: 'Whatever your browser can decode — MP3, WAV, OGG, M4A/AAC and usually FLAC. If the file loads and shows a duration, it\'s supported.' },
      { q: 'Why is the output WAV instead of MP3?', a: 'Browsers ship decoders for everything but no reliable MP3/AAC encoder. WAV is lossless and universally playable; converting it to MP3 later (in any editor or converter) costs nothing extra in quality versus encoding directly.' },
      { q: 'Why is the WAV file so much bigger than my MP3?', a: 'WAV is uncompressed: stereo at 44.1 kHz runs about 10 MB per minute regardless of content. Your 5 MB MP3 might become a 40 MB WAV of the same audio — that\'s the format, not a bug.' },
      { q: 'How precise is the cut?', a: 'Sample-accurate — the trim happens on the decoded waveform, so at 44.1 kHz the boundary lands within ~0.00002 seconds of what you set.' },
      { q: 'Is my recording uploaded?', a: 'No — decoding, trimming and encoding all run in your browser\'s memory. Disconnect from the internet and it works identically.' },
    ],
    keywords: ['trim audio online', 'cut mp3', 'audio trimmer', 'crop audio file', 'cut audio without uploading'],
  },
  {
    slug: 'audio-speed-changer',
    name: 'Audio Speed Changer',
    icon: '⏩',
    description:
      'Speed up or slow down audio from 0.5× to 3× and download the result as WAV — processed locally, nothing uploaded.',
    lead: 'Play back a lecture at 1.5× permanently, or slow a riff to 0.75× to learn it — rendered on your device and saved as WAV.',
    widget: 'speed',
    how: 'The audio is decoded to samples and re-rendered at your chosen playback rate through an offline audio graph, then encoded as WAV. This is resampling: 2× halves the duration and raises pitch one octave, 0.5× doubles duration and drops it one octave — like a record played at the wrong speed. Pitch-preserving time-stretch is a different, artifact-prone algorithm; honest resampling keeps the audio clean.',
    note: 'Practical settings: 1.25–1.75× for lectures and podcasts (voices get chipmunk-ish beyond that since pitch shifts too), 0.5–0.75× for transcribing fast speech or learning music by ear. For casual listening most players already offer pitch-corrected speed — this tool is for when you need the changed file itself.',
    faqs: [
      { q: 'Does changing speed change pitch?', a: 'Yes — this tool resamples, so speed and pitch move together (2× is one octave up), exactly like tape or vinyl at the wrong speed. That\'s the artifact-free method; pitch-preserving stretch smears transients and is best left to dedicated audio software.' },
      { q: 'What speed range is available?', a: '0.5× (half speed, one octave down) to 3×. For listenable speech, 1.25–1.75× is the useful zone; beyond 2× the pitch shift makes voices hard on the ears.' },
      { q: 'How does 1.5× affect the file duration?', a: 'Duration divides by the rate: a 60-minute recording at 1.5× becomes 40 minutes; at 0.75× it becomes 80 minutes. The tool shows the output duration before you render.' },
      { q: 'Why does the output come out as WAV?', a: 'Browsers decode compressed formats but don\'t reliably encode them, so results are saved as universal lossless WAV. Convert to MP3 afterwards if size matters — the quality cost is the same as encoding directly would have been.' },
      { q: 'Is the audio processed on a server?', a: 'No — the offline audio renderer runs on your device. Nothing about the file, including its existence, leaves your browser.' },
    ],
    keywords: ['change audio speed', 'speed up audio', 'slow down audio', 'audio speed changer online', 'slow down music to learn'],
  },
  {
    slug: 'audio-volume-changer',
    name: 'Audio Volume Changer',
    icon: '🔊',
    description:
      'Boost or reduce an audio file\'s volume — with a clipping check that tells you the safe maximum gain — processed locally, saved as WAV.',
    lead: 'Make a quiet recording louder (or a loud one quieter) — with the tool measuring your file\'s headroom so you boost without distortion.',
    widget: 'volume',
    how: 'The audio is decoded and every sample is multiplied by your gain factor, then encoded as WAV. Before you choose, the tool measures the file\'s peak level and reports the maximum clean gain — amplification beyond the point where peaks hit full scale flattens them into hard clipping, the harsh distortion of over-driven audio. Staying at or below the suggested maximum keeps the waveform intact.',
    note: 'If a recording is quiet in places and loud in others, flat gain can\'t fix both — the loud parts hit the ceiling before the quiet parts are loud enough. That problem needs compression/normalization in an audio editor; this tool is the right fix when the whole file is uniformly too quiet or too loud.',
    faqs: [
      { q: 'How much can I boost without distortion?', a: 'Up to the point where the file\'s loudest peak reaches full scale — which depends on the recording. The tool measures your file and shows that safe maximum; beyond it, peaks clip and distort audibly.' },
      { q: 'What does the clipping warning mean?', a: 'Digital audio has a hard ceiling. Samples pushed past it are flattened ("clipped"), which sounds like harsh crackling on peaks. The warning appears when your chosen gain would push measured peaks over the ceiling.' },
      { q: 'My recording is quiet only in parts — will this fix it?', a: 'Flat gain raises everything equally, so if loud sections already sit near the ceiling, the quiet parts can\'t be boosted enough without clipping the loud ones. Uneven levels need dynamic compression in an audio editor.' },
      { q: 'What is a dB and how does it relate to the multiplier?', a: 'Decibels are the logarithmic scale audio uses: ×2 amplitude = +6 dB, ×0.5 = −6 dB. The tool shows both, since editors talk dB while the math is a plain multiplication.' },
      { q: 'Is my audio uploaded?', a: 'No — measurement, gain and encoding run in your browser. Voice recordings never touch a server.' },
    ],
    keywords: ['increase audio volume', 'make audio louder', 'volume booster online', 'boost mp3 volume', 'audio gain'],
  },
  {
    slug: 'audio-to-wav',
    name: 'Audio to WAV Converter',
    icon: '🎚️',
    description:
      'Convert MP3, M4A, OGG or FLAC to standard uncompressed WAV — decoded by your browser locally, nothing uploaded.',
    lead: 'Any audio your browser plays → standard 16-bit WAV, the format every editor, sampler and legacy system accepts — converted on your device.',
    widget: 'wav',
    how: 'The source is decoded to raw samples with the browser\'s built-in codecs and written out as a 16-bit PCM WAV at the original sample rate. WAV is the lowest-common-denominator format: uncompressed, patent-free, readable by every DAW, editor, court-transcription workflow and embedded system since the 1990s. Decoding a lossy source doesn\'t restore lost quality — it makes the already-decoded audio maximally compatible.',
    note: 'Know what conversion can and can\'t do: MP3 → WAV does not "upgrade" the audio — the MP3\'s losses are permanent; the WAV just stores them losslessly (in a much bigger file). The conversion is for compatibility: tools that demand WAV input, editing without generation loss, or archiving a decode. Expect ~10 MB per stereo minute.',
    faqs: [
      { q: 'Does converting MP3 to WAV improve quality?', a: 'No — lossy compression discards audio permanently; conversion just re-packages what\'s left. The value is compatibility and editability: WAV re-saves without further generation loss, unlike re-encoding MP3 to MP3.' },
      { q: 'Why is the WAV so much bigger?', a: 'WAV is uncompressed PCM: 44.1 kHz stereo 16-bit is about 10 MB per minute, always. A 4 MB MP3 of a 4-minute song becomes roughly 40 MB of WAV.' },
      { q: 'What sample rate and bit depth does the output use?', a: 'Your file\'s original sample rate (commonly 44.1 or 48 kHz) at 16-bit — the CD-standard combination that every application accepts.' },
      { q: 'What input formats can I convert?', a: 'Anything the browser decodes: MP3, M4A/AAC, OGG, FLAC and WAV itself. If it plays in a browser tab, it converts here.' },
      { q: 'Is the audio sent to a server for conversion?', a: 'No — the browser\'s own decoder does the work locally. It runs offline, and no copy of your file exists anywhere but your device.' },
    ],
    keywords: ['mp3 to wav', 'convert audio to wav', 'm4a to wav', 'audio converter online', 'flac to wav'],
  },
  {
    slug: 'video-frame-extractor',
    name: 'Video Frame Extractor',
    icon: '🎞️',
    description:
      'Grab a still frame from any video as a PNG or JPEG — scrub to the exact moment and capture at full resolution. Runs in your browser, the video is never uploaded.',
    lead: 'Pull a still image out of a video: scrub to the moment you want, then capture it at the video’s full resolution as PNG or JPEG. Nothing leaves your device.',
    widget: 'frame',
    how: 'The video is loaded straight into a <video> element from a local object URL, so your browser’s own decoder handles playback. Scrub to the moment you want and the tool draws that exact frame onto a canvas sized to the video’s native resolution, then encodes it as a PNG or JPEG for download. Because the whole pipeline is the browser’s built-in decoder plus a canvas, there is no upload, no conversion queue and no watermark — and the captured image is full quality, not the size of the on-screen preview.',
    note: 'Deliberately built without ffmpeg.wasm. Frame-accurate seeking and re-encoding would need SharedArrayBuffer, which requires cross-origin isolation headers that break third-party scripts on the page, plus a download of around 25 MB before you could do anything. For pulling a still out of a video none of that is necessary — the decoder is already in your browser. The trade-off is that browsers do not expose exact frame boundaries, so the ±1 frame buttons assume roughly 30 fps; use the slider for fine positioning. Which formats open at all depends on your browser’s codec support: MP4 (H.264) and WebM are near-universal, while some MOV and AVI variants may not decode.',
    faqs: [
      { q: 'How do I extract a frame from a video?', a: 'Choose the video, scrub the slider to the moment you want, then click Capture. The frame downloads as a PNG or JPEG at the video’s full resolution. Everything happens in your browser.' },
      { q: 'Is the captured image full quality?', a: 'Yes — the frame is drawn to a canvas matching the video’s native resolution, so a 1080p video yields a 1920×1080 image regardless of how large the preview appears on screen. PNG is lossless; JPEG lets you trade some quality for a smaller file.' },
      { q: 'Why are the frame-step buttons approximate?', a: 'Browsers don’t expose exact frame boundaries to web pages, so stepping assumes about 30 fps. If your video runs at a different rate, use the slider to fine-tune the position — the capture itself is always exact for wherever the video is paused.' },
      { q: 'Which video formats work?', a: 'Whatever your browser can decode — MP4 (H.264) and WebM work almost everywhere, and most MOV files do too. Some AVI, MKV or unusual codec combinations may not open, in which case the tool tells you rather than failing silently.' },
      { q: 'Why not use ffmpeg for this?', a: 'ffmpeg.wasm needs SharedArrayBuffer, which requires cross-origin isolation headers that would block third-party scripts on the page, and it downloads roughly 25 MB before doing any work. Your browser already contains a video decoder, so a still frame needs neither.' },
      { q: 'Is my video uploaded?', a: 'No. It’s read from your device as a local object URL and decoded by your browser. Nothing is transmitted, and the tool works offline once the page has loaded.' },
    ],
    keywords: ['extract frame from video', 'video frame extractor', 'video to image', 'screenshot from video', 'video thumbnail grabber', 'save frame as png'],
  },
];
