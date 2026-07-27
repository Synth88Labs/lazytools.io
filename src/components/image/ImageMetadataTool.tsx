import { useState } from 'preact/hooks';

interface Row { label: string; value: string; }

function pick(data: any): { rows: Row[]; gps: { lat: number; lng: number } | null } {
  const rows: Row[] = [];
  const add = (label: string, v: unknown, suffix = '') => {
    if (v !== undefined && v !== null && v !== '') rows.push({ label, value: String(v) + suffix });
  };
  add('Camera make', data.Make);
  add('Camera model', data.Model);
  add('Lens', data.LensModel);
  add('Software', data.Software);
  const dt = data.DateTimeOriginal ?? data.CreateDate ?? data.ModifyDate;
  if (dt) add('Date taken', dt instanceof Date ? dt.toLocaleString() : dt);
  if (data.ExifImageWidth && data.ExifImageHeight) add('Dimensions', `${data.ExifImageWidth} × ${data.ExifImageHeight}`);
  if (data.FNumber) add('Aperture', `f/${data.FNumber}`);
  if (data.ExposureTime) add('Shutter', data.ExposureTime < 1 ? `1/${Math.round(1 / data.ExposureTime)} s` : `${data.ExposureTime} s`);
  add('ISO', data.ISO);
  if (data.FocalLength) add('Focal length', `${data.FocalLength} mm`);
  if (data.FocalLengthIn35mmFormat) add('Focal length (35mm eq.)', `${data.FocalLengthIn35mmFormat} mm`);
  add('Flash', data.Flash);
  add('Orientation', data.Orientation);
  add('Artist / author', data.Artist);
  add('Copyright', data.Copyright);
  add('GPS altitude', data.GPSAltitude ? `${Math.round(data.GPSAltitude)} m` : undefined);
  const gps = (typeof data.latitude === 'number' && typeof data.longitude === 'number')
    ? { lat: data.latitude, lng: data.longitude } : null;
  return { rows, gps };
}

export default function ImageMetadataTool() {
  const [fileName, setFileName] = useState('');
  const [preview, setPreview] = useState('');
  const [result, setResult] = useState<{ rows: Row[]; gps: { lat: number; lng: number } | null } | null>(null);
  const [empty, setEmpty] = useState(false);
  const [error, setError] = useState('');

  async function onFile(e: Event) {
    const f = (e.target as HTMLInputElement).files?.[0];
    if (!f) return;
    setFileName(f.name);
    setError(''); setResult(null); setEmpty(false);
    setPreview(URL.createObjectURL(f));
    try {
      const exifr = (await import('exifr')).default;
      const data = await exifr.parse(f, { gps: true, tiff: true, ifd0: true, exif: true }).catch(() => null);
      if (!data || Object.keys(data).length === 0) { setEmpty(true); return; }
      const picked = pick(data);
      if (picked.rows.length === 0 && !picked.gps) setEmpty(true);
      else setResult(picked);
    } catch (err) {
      setError(`Could not read metadata: ${(err as Error).message}`);
    }
  }

  return (
    <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <label class="block cursor-pointer rounded-xl border-2 border-dashed border-slate-300 bg-white p-6 text-center transition hover:border-brand-400">
        <input type="file" accept="image/*" onChange={onFile} class="sr-only" />
        <span class="text-sm font-semibold text-brand-700">{fileName || 'Choose a photo to inspect its metadata'}</span>
        <span class="mt-1 block text-xs text-slate-500">Read on your device — the image is never uploaded</span>
      </label>

      {error && <p class="mt-3 text-sm font-medium text-red-700">✗ {error}</p>}
      {empty && <div class="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">No EXIF metadata found — this image has little or no embedded data (it may have been stripped already, or it\'s a format/screenshot that doesn\'t store EXIF).</div>}

      {result && (
        <div class="mt-4 grid gap-4 sm:grid-cols-[auto_1fr]">
          {preview && <img src={preview} alt="preview" class="max-h-48 w-auto rounded-lg border border-slate-200" />}
          <div>
            {result.gps && (
              <div class="mb-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm">
                <p class="font-bold text-amber-900">⚠ This photo contains GPS location</p>
                <p class="mt-0.5 text-amber-800">{result.gps.lat.toFixed(6)}, {result.gps.lng.toFixed(6)} — <a href={`https://www.openstreetmap.org/?mlat=${result.gps.lat}&mlon=${result.gps.lng}#map=15/${result.gps.lat}/${result.gps.lng}`} target="_blank" rel="noopener" class="font-semibold underline">view on map</a>. Remove it before sharing if you don\'t want to reveal where it was taken.</p>
              </div>
            )}
            <table class="w-full text-left text-sm">
              <tbody>
                {result.rows.map((r) => (
                  <tr class="border-b border-slate-100"><td class="py-1.5 pr-4 font-semibold text-slate-600">{r.label}</td><td class="py-1.5 font-mono text-slate-800">{r.value}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <p class="mt-4 rounded-lg bg-white px-3 py-2 text-xs text-slate-500 ring-1 ring-slate-200">
        Shows the EXIF/metadata embedded in a photo — camera, settings, date and any GPS location — so you can see what a picture reveals before you share it. Everything is read locally and never uploaded. To strip this data, use the <a href="/security/image-metadata-remover/" class="font-semibold text-brand-700 underline decoration-slate-300 underline-offset-2">metadata remover</a>. 🔒
      </p>
    </div>
  );
}
