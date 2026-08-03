import { useState } from 'preact/hooks';
import { parseTorrent, type TorrentInfo } from '../../lib/torrent';
import { fmtSize } from '../../lib/audio-compute';

export default function TorrentInspectorTool() {
  const [info, setInfo] = useState<TorrentInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const onFile = async (f: File | null) => {
    if (!f) return;
    setBusy(true); setError(null); setInfo(null); setFileName(f.name);
    try {
      setInfo(await parseTorrent(new Uint8Array(await f.arrayBuffer())));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not read this .torrent file.');
    } finally { setBusy(false); }
  };

  const copy = (v: string) => navigator.clipboard?.writeText(v);
  const row = (label: string, value?: string | number) =>
    value === undefined || value === '' ? null : (
      <div class="grid grid-cols-[8rem_1fr] gap-2 border-b border-slate-100 py-2 sm:grid-cols-[10rem_1fr]">
        <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</span>
        <span class="break-all text-sm text-slate-800">{value}</span>
      </div>
    );

  const magnet = info ? `magnet:?xt=urn:btih:${info.infoHash}&dn=${encodeURIComponent(info.name)}${info.announce ? `&tr=${encodeURIComponent(info.announce)}` : ''}` : '';

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white px-4 py-8 text-center hover:border-brand-400">
        <input type="file" class="hidden" accept=".torrent,application/x-bittorrent" onChange={(e) => onFile((e.target as HTMLInputElement).files?.[0] ?? null)} />
        <span class="block text-2xl">🧲</span>
        <span class="mt-1 block text-sm font-semibold text-slate-700">{fileName ? `📄 ${fileName}` : 'Choose a .torrent file'}</span>
        <span class="mt-1 block text-xs text-slate-500">{busy ? 'Reading…' : 'Read locally — the file is never uploaded'}</span>
      </label>

      {error && <p class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700 ring-1 ring-rose-200">⚠️ {error}</p>}

      {info && (
        <div class="mt-4 space-y-4">
          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <div class="mb-1 flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Info-hash (SHA-1)</p>
              <button onClick={() => copy(info.infoHash)} class="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button>
            </div>
            <p class="break-all font-mono text-sm font-semibold text-brand-800">{info.infoHash}</p>
          </div>

          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            {row('Name', info.name)}
            {row('Total size', `${fmtSize(info.totalSize)} (${info.totalSize.toLocaleString()} bytes)`)}
            {row('Files', info.single ? '1 (single file)' : info.files.length)}
            {row('Piece length', fmtSize(info.pieceLength))}
            {row('Pieces', info.pieceCount.toLocaleString())}
            {row('Private', info.isPrivate ? 'yes (no DHT/PEX)' : 'no')}
            {row('Created', info.creationDate?.replace('T', ' '))}
            {row('Created by', info.createdBy)}
            {row('Comment', info.comment)}
            {row('Primary tracker', info.announce)}
          </div>

          {info.announceList.length > 1 && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Trackers ({info.announceList.length})</p>
              <ul class="space-y-0.5 text-xs text-slate-600">{info.announceList.map((t) => <li class="break-all font-mono">{t}</li>)}</ul>
            </div>
          )}

          {!info.single && (
            <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
              <p class="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">Files ({info.files.length})</p>
              <ul class="max-h-64 space-y-1 overflow-y-auto text-sm">
                {info.files.map((f) => (
                  <li class="flex justify-between gap-3 border-b border-slate-50 py-1">
                    <span class="break-all font-mono text-xs text-slate-700">{f.path}</span>
                    <span class="shrink-0 text-slate-500">{fmtSize(f.length)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div class="rounded-xl bg-white p-4 ring-1 ring-slate-200">
            <div class="mb-1 flex items-center justify-between">
              <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">Magnet link</p>
              <button onClick={() => copy(magnet)} class="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Copy</button>
            </div>
            <p class="break-all font-mono text-xs text-slate-600">{magnet}</p>
          </div>
        </div>
      )}

      <p class="mt-4 text-xs text-slate-500">Drop a .torrent file to read its contents — the name, file list, total size, piece length and trackers — and compute its info-hash, the SHA-1 of the torrent&#39;s info dictionary that uniquely identifies it (and forms the magnet link). It parses the bencoded file in your browser, so the .torrent is never uploaded and no download ever starts — it only reads the metadata. 🔒 100% client-side.</p>
    </div>
  );
}
