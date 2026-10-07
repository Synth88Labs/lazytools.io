/**
 * Pure, deterministic URL transforms for the Links & Sharing tools.
 * No network, no side effects — just string/URL parsing. Unit-tested in
 * scripts/test-links.mjs.
 */

export type DriveType = 'sheets' | 'docs' | 'slides' | 'file';
export interface DriveLink { format: string; label: string; url: string }
export interface DriveResult { id?: string; type?: DriveType; links?: DriveLink[]; error?: string }

/** A Google Drive file ID is a 25+ char run of [A-Za-z0-9_-]. */
const ID_RE = /[-\w]{25,}/;

export function extractDriveId(url: string): string | null {
  const m =
    url.match(/\/d\/([-\w]{25,})/) ||
    url.match(/[?&]id=([-\w]{25,})/) ||
    url.match(/\/folders\/([-\w]{25,})/);
  if (m) return m[1];
  const g = url.match(ID_RE);
  return g ? g[0] : null;
}

export function driveType(url: string): DriveType {
  if (/\/spreadsheets\//.test(url)) return 'sheets';
  if (/\/document\//.test(url)) return 'docs';
  if (/\/presentation\//.test(url)) return 'slides';
  return 'file';
}

export function driveLinks(input: string): DriveResult | null {
  const url = input.trim();
  if (!url) return null;
  const id = extractDriveId(url);
  if (!id) return { error: 'No Google file ID found in that link. Paste a full Drive, Docs, Sheets or Slides sharing URL.' };
  const type = driveType(url);
  const links: DriveLink[] = [];
  if (type === 'sheets') {
    const b = `https://docs.google.com/spreadsheets/d/${id}/export?format=`;
    links.push({ format: 'XLSX', label: 'Excel', url: b + 'xlsx' }, { format: 'CSV', label: 'CSV', url: b + 'csv' }, { format: 'PDF', label: 'PDF', url: b + 'pdf' });
  } else if (type === 'docs') {
    const b = `https://docs.google.com/document/d/${id}/export?format=`;
    links.push({ format: 'DOCX', label: 'Word', url: b + 'docx' }, { format: 'PDF', label: 'PDF', url: b + 'pdf' }, { format: 'TXT', label: 'Plain text', url: b + 'txt' });
  } else if (type === 'slides') {
    const b = `https://docs.google.com/presentation/d/${id}/export?format=`;
    links.push({ format: 'PPTX', label: 'PowerPoint', url: b + 'pptx' }, { format: 'PDF', label: 'PDF', url: b + 'pdf' });
  } else {
    links.push(
      { format: 'DOWNLOAD', label: 'Direct download', url: `https://drive.google.com/uc?export=download&id=${id}` },
      { format: 'RAW', label: 'High-speed host', url: `https://lh3.googleusercontent.com/d/${id}` },
    );
  }
  return { id, type, links };
}

export interface DropboxResult { download?: string; raw?: string; error?: string }

export function dropboxLinks(input: string): DropboxResult | null {
  const url = input.trim();
  if (!url) return null;
  if (!/(^|\.)dropbox\.com\//.test(url) && !/dropboxusercontent\.com\//.test(url)) {
    return { error: 'That doesn\'t look like a Dropbox share link.' };
  }
  let u: URL;
  try { u = new URL(url); } catch { return { error: 'Invalid URL.' }; }
  // Direct download: keep dropbox.com, force dl=1.
  const d = new URL(u.href);
  d.hostname = 'www.dropbox.com';
  d.searchParams.delete('raw');
  d.searchParams.set('dl', '1');
  // Raw hot-link: serve bytes from dl.dropboxusercontent.com (keeps rlkey), no dl flag.
  const r = new URL(u.href);
  r.hostname = 'dl.dropboxusercontent.com';
  r.searchParams.delete('dl');
  return { download: d.href, raw: r.href };
}

export interface GithubResult { raw?: string; error?: string }

export function githubRaw(input: string): GithubResult | null {
  const url = input.trim();
  if (!url) return null;
  let u: URL;
  try { u = new URL(url); } catch { return { error: 'Enter a valid GitHub file URL.' }; }
  if (u.hostname === 'raw.githubusercontent.com') return { raw: u.href }; // already raw
  if (u.hostname !== 'github.com' && u.hostname !== 'www.github.com') {
    return { error: 'That doesn\'t look like a github.com file URL.' };
  }
  // /{owner}/{repo}/blob/{ref}/{path…}  (also accepts the /raw/ form)
  const m = u.pathname.match(/^\/([^/]+)\/([^/]+)\/(?:blob|raw)\/(.+)$/);
  if (!m) return { error: 'Link to a file (…/blob/branch/path). Repo and folder links can\'t be raw-linked.' };
  const [, owner, repo, rest] = m;
  return { raw: `https://raw.githubusercontent.com/${owner}/${repo}/${rest}` };
}

/** Known tracking/click-id parameters stripped by the cleaner (lower-cased). */
export const TRACKER_PARAMS = new Set([
  'fbclid', 'gclid', 'gclsrc', 'dclid', 'wbraid', 'gbraid', 'msclkid', 'ttclid', 'twclid', 'yclid',
  'mc_cid', 'mc_eid', '_hsenc', '_hsmi', 'vero_id', 'vero_conv', 'oly_anon_id', 'oly_enc_id',
  'mkt_tok', '_openstat', 'igshid', 'spm', 'scm', 'li_fat_id', 'epik', 'rb_clickid', 's_cid',
  'hsa_acc', 'hsa_cam', 'hsa_grp', 'hsa_ad', 'hsa_src', 'hsa_tgt', 'hsa_kw', 'hsa_mt', 'hsa_net', 'hsa_ver',
  'fb_action_ids', 'fb_action_types', 'fb_source', 'action_object_map', 'action_type_map', 'action_ref_map',
]);

export interface CleanResult { cleaned?: string; removed?: string[]; error?: string }

export function cleanUrl(input: string): CleanResult | null {
  const url = input.trim();
  if (!url) return null;
  let u: URL;
  try { u = new URL(url); } catch { try { u = new URL('https://' + url); } catch { return { error: 'Enter a valid URL.' }; } }
  const removed: string[] = [];
  for (const k of [...u.searchParams.keys()]) {
    const lk = k.toLowerCase();
    if (lk.startsWith('utm_') || TRACKER_PARAMS.has(lk)) {
      if (!removed.includes(k)) removed.push(k);
      u.searchParams.delete(k);
    }
  }
  return { cleaned: u.href, removed };
}
