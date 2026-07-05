/** Audio helpers — Web Audio decode/process, 16-bit PCM WAV encode. All local. */

export async function decodeAudio(data: ArrayBuffer): Promise<AudioBuffer> {
  const ctx = new AudioContext();
  try {
    return await ctx.decodeAudioData(data);
  } finally {
    ctx.close();
  }
}

/** Render a processed copy of a buffer: optional trim, playback rate, gain. */
export async function renderAudio(
  src: AudioBuffer,
  opts: { startSec?: number; endSec?: number; rate?: number; gain?: number }
): Promise<AudioBuffer> {
  const start = Math.max(0, opts.startSec ?? 0);
  const end = Math.min(src.duration, opts.endSec ?? src.duration);
  const rate = opts.rate ?? 1;
  const gain = opts.gain ?? 1;
  const sliceDur = Math.max(0.01, end - start);
  const outDur = sliceDur / rate;
  const ctx = new OfflineAudioContext(src.numberOfChannels, Math.ceil(outDur * src.sampleRate), src.sampleRate);
  const node = ctx.createBufferSource();
  node.buffer = src;
  node.playbackRate.value = rate;
  const g = ctx.createGain();
  g.gain.value = gain;
  node.connect(g).connect(ctx.destination);
  node.start(0, start, sliceDur);
  return ctx.startRendering();
}

/** Encode an AudioBuffer as a 16-bit PCM WAV blob. */
export function encodeWav(buffer: AudioBuffer): Blob {
  const channels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const frames = buffer.length;
  const dataSize = frames * channels * 2;
  const out = new DataView(new ArrayBuffer(44 + dataSize));

  const str = (off: number, s: string) => [...s].forEach((c, i) => out.setUint8(off + i, c.charCodeAt(0)));
  str(0, 'RIFF');
  out.setUint32(4, 36 + dataSize, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  out.setUint32(16, 16, true);
  out.setUint16(20, 1, true); // PCM
  out.setUint16(22, channels, true);
  out.setUint32(24, sampleRate, true);
  out.setUint32(28, sampleRate * channels * 2, true);
  out.setUint16(32, channels * 2, true);
  out.setUint16(34, 16, true);
  str(36, 'data');
  out.setUint32(40, dataSize, true);

  const chans = Array.from({ length: channels }, (_, c) => buffer.getChannelData(c));
  let off = 44;
  for (let i = 0; i < frames; i++) {
    for (let c = 0; c < channels; c++) {
      const s = Math.max(-1, Math.min(1, chans[c]![i]!));
      out.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      off += 2;
    }
  }
  return new Blob([out.buffer], { type: 'audio/wav' });
}

export function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = (sec % 60).toFixed(1);
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
}

export function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(2)} MB`;
}
