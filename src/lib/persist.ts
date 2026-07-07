/**
 * Shared helpers for the Productivity category: local-only persistence
 * (localStorage) plus JSON export/import so users own and can move their data.
 * Everything stays on the device — nothing is ever uploaded.
 */
import { useEffect, useRef, useState } from 'preact/hooks';
import type { RefObject } from 'preact';

/**
 * Fullscreen a container element. Uses the native Fullscreen API when allowed,
 * and falls back to a CSS full-viewport overlay when it isn't (e.g. inside an
 * iframe/preview, or on browsers that block it) — so it works everywhere.
 */
export function useFullscreen<T extends HTMLElement = HTMLDivElement>(): { ref: RefObject<T>; isFull: boolean; toggle: () => void } {
  const ref = useRef<T>(null);
  const [nativeFull, setNativeFull] = useState(false);
  const [cssFull, setCssFull] = useState(false);
  useEffect(() => {
    const on = () => setNativeFull(!!document.fullscreenElement && document.fullscreenElement === ref.current);
    document.addEventListener('fullscreenchange', on);
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setCssFull(false); };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('fullscreenchange', on); document.removeEventListener('keydown', onKey); };
  }, []);
  const toggle = () => {
    if (document.fullscreenElement) { document.exitFullscreen?.(); return; }
    if (cssFull) { setCssFull(false); return; }
    const el = ref.current;
    if (el?.requestFullscreen) el.requestFullscreen().catch(() => setCssFull(true));
    else setCssFull(true);
  };
  return { ref, isFull: nativeFull || cssFull, toggle };
}

/** useState backed by localStorage under `key`. SSR-safe (falls back to `initial`). */
export function usePersistentState<T>(key: string, initial: T): [T, (v: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(() => {
    if (typeof window === 'undefined') return initial;
    try {
      const raw = window.localStorage.getItem(key);
      return raw !== null ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* quota / private mode — tool still works for the session */
    }
  }, [key, state]);
  return [state, setState];
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/** Download `data` as a pretty-printed .json file, wrapped with a small envelope. */
export function exportJson(kind: string, filename: string, data: unknown): void {
  const envelope = { app: 'LazyTools', kind, version: 1, exportedAt: new Date().toISOString(), data };
  downloadBlob(new Blob([JSON.stringify(envelope, null, 2)], { type: 'application/json' }), filename);
}

/** Read a user-selected .json file and return the inner `data` (unwrapping the envelope). */
export function readJsonFile(file: File): Promise<unknown> {
  return file.text().then((txt) => {
    const parsed = JSON.parse(txt);
    return parsed && typeof parsed === 'object' && 'data' in parsed ? (parsed as { data: unknown }).data : parsed;
  });
}

/** Trigger a hidden file picker and resolve the imported inner data. */
export function pickJson(): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';
    input.onchange = () => {
      const f = input.files?.[0];
      if (!f) return reject(new Error('No file selected'));
      readJsonFile(f).then(resolve).catch(reject);
    };
    input.click();
  });
}

/** Serialise an <svg> element to a PNG blob at `scale`× resolution (for the visual builders). */
export function svgToPng(svg: SVGSVGElement, scale = 2): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const xml = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([xml], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);
    const img = new Image();
    img.onload = () => {
      const w = svg.viewBox.baseVal.width || svg.clientWidth || 1200;
      const h = svg.viewBox.baseVal.height || svg.clientHeight || 800;
      const canvas = document.createElement('canvas');
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext('2d')!;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('PNG encode failed'))), 'image/png');
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('SVG render failed')); };
    img.src = url;
  });
}

/** Save an <svg> element as a real PDF (image-embedded). pdf-lib is lazy-loaded on first use. */
export async function downloadSvgAsPdf(svg: SVGSVGElement, filename: string, scale = 2): Promise<void> {
  const png = await svgToPng(svg, scale);
  const bytes = new Uint8Array(await png.arrayBuffer());
  const { PDFDocument } = await import('pdf-lib');
  const doc = await PDFDocument.create();
  const img = await doc.embedPng(bytes);
  const w = (svg.viewBox.baseVal.width || img.width / scale);
  const h = (svg.viewBox.baseVal.height || img.height / scale);
  const page = doc.addPage([w, h]);
  page.drawImage(img, { x: 0, y: 0, width: w, height: h });
  const out = await doc.save();
  const ab = new ArrayBuffer(out.byteLength);
  new Uint8Array(ab).set(out);
  downloadBlob(new Blob([ab], { type: 'application/pdf' }), filename);
}

/** Save an <svg> element as a PNG file. */
export async function downloadSvgAsPng(svg: SVGSVGElement, filename: string, scale = 2): Promise<void> {
  downloadBlob(await svgToPng(svg, scale), filename);
}

/** Small stable id. */
export function uid(): string {
  return Math.random().toString(36).slice(2, 10);
}

/** YYYY-MM-DD in local time. */
export function todayKey(d = new Date()): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
