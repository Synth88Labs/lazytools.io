/** Links & Sharing registry — client-side URL transformers (no server, nothing uploaded). */

export interface LinkToolDef {
  slug: string;
  name: string;
  icon: string;
  description: string;
  lead: string;
  widget: 'drive' | 'dropbox' | 'github' | 'url-clean';
  how: string;
  note?: string;
  faqs: { q: string; a: string }[];
  keywords: string[];
}

export const LINK_TOOLS: LinkToolDef[] = [
  {
    slug: 'google-drive-direct-link-generator',
    name: 'Google Drive Direct Download Link Generator',
    icon: '📥',
    description:
      'Turn a Google Drive, Docs, Sheets or Slides share link into a direct download or export link (XLSX, PDF, CSV, DOCX, PPTX…). Runs in your browser, nothing uploaded.',
    lead: 'Paste a Google Drive, Docs, Sheets or Slides sharing link and get a direct download / export URL — the file ID is parsed in your browser, no sign-in and nothing sent anywhere.',
    widget: 'drive',
    how: 'Every Google Drive item has a long file ID in its URL (the 25+ character string after /d/ or id=). This tool reads that ID out of whatever share link you paste and rebuilds it into Google\'s own direct-access URLs. A Drive file becomes drive.google.com/uc?export=download&id=ID (the official "download" endpoint). A Docs, Sheets or Slides file becomes its matching /export?format=… endpoint — xlsx/csv/pdf for Sheets, docx/txt/pdf for Docs, pptx/pdf for Slides — the same URLs Google uses behind its own File → Download menu. The parsing and rebuilding happen entirely in your browser with a regular expression; your link is never sent to LazyTools or anyone else.',
    note: 'Direct links only work if the file\'s sharing is set to "Anyone with the link" — Google still enforces permissions, so a link this tool builds for a private file will prompt the visitor to sign in and request access. Very large Drive files may show Google\'s "can\'t scan for viruses" interstitial before the download starts; that\'s Google\'s page, not a failure of the link. These URLs are unofficial conveniences built on Google\'s endpoints and could change if Google changes them.',
    faqs: [
      { q: 'How do I make a Google Drive link download directly?', a: 'Paste the share link here and copy the generated drive.google.com/uc?export=download&id=… URL. Clicking it starts the download instead of opening Drive\'s preview page. The file\'s sharing must be set to "Anyone with the link".' },
      { q: 'How do I export a Google Sheet to Excel or CSV from a link?', a: 'Paste the Sheet\'s share link and this tool builds the docs.google.com/spreadsheets/d/ID/export?format=xlsx (or =csv, =pdf) URL. Opening it downloads that format directly — the same export Google\'s own File → Download menu uses.' },
      { q: 'Does the file get uploaded to your server?', a: 'No. Only the text of the URL is processed, and that happens in your browser with JavaScript. Nothing — not the link, not the file — is sent to LazyTools. You can disconnect from the internet and it still converts.' },
      { q: 'Why does my direct link ask people to sign in?', a: 'Because the file is still private. Google enforces sharing permissions on these endpoints exactly like anywhere else. In Drive, set the file to Share → "Anyone with the link" (Viewer) and the direct link will work for everyone.' },
      { q: 'What is the lh3.googleusercontent.com link for?', a: 'It is an alternate high-speed host Google serves Drive file contents from, handy for hot-linking an image. It can be rate-limited or change without notice, so treat it as a convenience, not a permanent CDN URL — the uc?export=download link is the more stable choice.' },
      { q: 'Can I embed a Google Doc as a PDF with this?', a: 'Yes — use the Docs PDF export URL (…/document/d/ID/export?format=pdf). It returns the current PDF of the document, so you can link or embed it; it updates whenever the document changes and the viewer has access.' },
    ],
    keywords: ['google drive direct download link', 'google drive direct link generator', 'google sheets to excel link', 'google docs export link', 'drive uc export download', 'google slides to pptx link'],
  },
  {
    slug: 'dropbox-direct-download-link-generator',
    name: 'Dropbox Direct Download Link Generator',
    icon: '📦',
    description:
      'Convert a Dropbox share link (…?dl=0) into a direct download or raw hot-link (…?dl=1 / dl.dropboxusercontent.com). In-browser, no login, nothing uploaded.',
    lead: 'Paste a Dropbox share link and get a direct-download version and a raw hot-link version — the transform happens in your browser, nothing is sent to Dropbox or to us.',
    widget: 'dropbox',
    how: 'A normal Dropbox share link ends in ?dl=0, which opens Dropbox\'s preview page rather than downloading. Dropbox exposes the behaviour through that one query parameter: setting dl=1 makes the same link download the file immediately. For embedding or hot-linking (an image in a page, a file a script fetches), swapping the host www.dropbox.com for dl.dropboxusercontent.com serves the raw bytes with no Dropbox wrapper. This tool rewrites the parameter and host for both the classic /s/ links and the newer /scl/fi/ links (it keeps the rlkey token those need), entirely in your browser.',
    note: 'The file\'s sharing link must exist and be public ("Anyone with the link") for either version to download. The raw dl.dropboxusercontent.com host is intended for direct fetching/embedding and may be rate-limited for high traffic — Dropbox is not a CDN. These are conveniences built on Dropbox\'s documented dl parameter and could change if Dropbox changes it.',
    faqs: [
      { q: 'How do I force a Dropbox link to download?', a: 'Change the ?dl=0 at the end of the share link to ?dl=1 — or just paste it here and copy the "Direct download" result. The link then downloads the file instead of opening Dropbox\'s preview page.' },
      { q: 'What is the difference between dl=1 and dl.dropboxusercontent.com?', a: 'dl=1 keeps Dropbox\'s domain but triggers a download. dl.dropboxusercontent.com serves the raw file bytes with no Dropbox page around them, which is what you want for hot-linking an image or fetching the file from code. This tool gives you both.' },
      { q: 'Does this work with the new /scl/fi/ Dropbox links?', a: 'Yes. The newer links carry an rlkey access token; the tool preserves it and just sets dl=1 (or switches the host), so the converted link keeps working.' },
      { q: 'Is my Dropbox link or file sent anywhere?', a: 'No. The link is rewritten in your browser with JavaScript — nothing is transmitted to LazyTools or Dropbox by this tool. It works offline.' },
      { q: 'Can I hot-link a Dropbox image on my website?', a: 'You can for low traffic using the dl.dropboxusercontent.com version, but Dropbox is not a content delivery network and may throttle or block heavy hot-linking. For a real site, host the image properly; use this for quick shares and prototypes.' },
    ],
    keywords: ['dropbox direct download link', 'dropbox dl=1', 'dropbox direct link generator', 'dropboxusercontent raw link', 'dropbox force download', 'dropbox hotlink image'],
  },
  {
    slug: 'github-raw-link-generator',
    name: 'GitHub Raw Link Generator',
    icon: '🐙',
    description:
      'Turn a GitHub file URL (…/blob/branch/path) into its raw.githubusercontent.com link for direct downloading, hot-linking or fetching. In-browser, nothing uploaded.',
    lead: 'Paste a GitHub file link and get its raw.githubusercontent.com URL — the direct, un-rendered file you can download, embed or fetch from code.',
    widget: 'github',
    how: 'A normal GitHub file URL (github.com/owner/repo/blob/branch/path) is an HTML page — GitHub\'s viewer wrapped around the file, not the file itself. The raw content lives at raw.githubusercontent.com/owner/repo/branch/path, with no page around it. This tool parses the owner, repo, branch (or tag/commit) and path out of the blob URL and rebuilds the raw URL — the same link GitHub\'s own "Raw" button points to. It happens in your browser with a regular expression; nothing is sent anywhere, and links already on raw.githubusercontent.com are passed through unchanged.',
    note: 'The raw host serves public repository files. It is rate-limited and explicitly not a CDN, so it is right for a script that fetches a config file, a quick download, or an example in docs, not for serving assets to a production website. The branch name is taken verbatim, so a link against main keeps returning the latest commit on main; pin to a tag or commit SHA in the URL if you need an immutable version.',
    faqs: [
      { q: 'How do I get a raw GitHub link?', a: 'Open the file on GitHub, paste its URL here, and copy the raw.githubusercontent.com link — or click GitHub\'s own "Raw" button on the file page. Both give the same direct-content URL.' },
      { q: 'What is the difference between github.com and raw.githubusercontent.com?', a: 'github.com/.../blob/... is the HTML page with GitHub\'s viewer, line numbers and buttons around the file. raw.githubusercontent.com/... is just the file\'s bytes, which is what you want to download it, fetch it from a script, or point an <img>/<script> at it.' },
      { q: 'Does the raw link always show the latest version?', a: 'If the URL uses a branch name (like main), yes — it returns the current commit on that branch, so it changes as the branch moves. To freeze a specific version, use a link built against a tag or a commit SHA instead of a branch.' },
      { q: 'Can I hot-link files from raw.githubusercontent.com?', a: 'For light use, like an example image in documentation, yes. GitHub rate-limits the raw host and states it is not a CDN, so don\'t use it to serve assets for a real site — publish those properly or use GitHub Pages.' },
      { q: 'Does this work for private repositories?', a: 'No. raw.githubusercontent.com only serves public files without authentication. A private-repo raw link needs an access token, which this client-side tool deliberately never handles.' },
    ],
    keywords: ['github raw link', 'raw githubusercontent generator', 'github blob to raw', 'github direct file link', 'github raw url', 'download file from github'],
  },
  {
    slug: 'url-tracking-parameter-cleaner',
    name: 'URL Tracking Parameter Cleaner',
    icon: '🧼',
    description:
      'Strip tracking junk (utm_*, fbclid, gclid, igshid and more) from a URL to get a clean, shorter, private link. Runs in your browser — the URL is never sent anywhere.',
    lead: 'Paste a long, tracker-laden link and get a clean one back — every known tracking parameter removed in your browser, so the URL you share says nothing about where it came from.',
    widget: 'url-clean',
    how: 'Shared links are often stuffed with tracking parameters — utm_source/medium/campaign from analytics, fbclid from Facebook, gclid/gclsrc/dclid from Google Ads, igshid from Instagram, mc_cid/mc_eid from Mailchimp, and more. None of them are needed for the page to load; they exist to tell the destination (or a re-sharer\'s analytics) how you got there. This tool parses the URL, removes every parameter matching a maintained block-list of known trackers (including anything starting utm_), and hands back the cleaned link plus a list of exactly what it stripped. It keeps the parameters a page genuinely needs (like ?id= or ?q=) and preserves the #fragment. All of it runs locally — the link never leaves your browser.',
    note: 'The cleaner removes known tracking parameters by name; it can\'t know that a site\'s own custom ?ref= is purely cosmetic, so it leaves unrecognised parameters in place rather than risk breaking the link. If a cleaned link ever misbehaves, the original still works — nothing is changed except the parameters listed as removed.',
    faqs: [
      { q: 'What is fbclid and is it safe to remove?', a: 'fbclid is the Facebook Click Identifier Facebook appends to outbound links to tie the click back to a user and ad. It is never needed for the page to work, so removing it is safe and makes the link shorter and more private.' },
      { q: 'Which parameters does the cleaner strip?', a: 'All utm_* parameters plus known click IDs and trackers: fbclid, gclid, gclsrc, dclid, wbraid, gbraid, msclkid, igshid, mc_cid, mc_eid, _hsenc, _hsmi, vero_id, oly_anon_id, twclid, yclid and others. Anything it doesn\'t recognise is left untouched so the link keeps working.' },
      { q: 'Does removing tracking parameters break the link?', a: 'No, for tracking parameters — they are metadata about the click, not instructions the page needs. The cleaner only removes parameters on its known-tracker list and preserves everything else, including functional parameters and the #fragment.' },
      { q: 'Is the URL I paste sent to your server?', a: 'No. The whole clean-up runs in your browser with JavaScript; the URL is never transmitted to LazyTools or anyone. That is the point — a privacy tool that phoned home would defeat itself.' },
      { q: 'Why do my links have so much tracking on them?', a: 'Platforms add it automatically: analytics tools add utm tags, ad networks add click IDs, and social and email systems add their own identifiers so they can measure and attribute clicks. Cleaning a link before you share it stops that history riding along.' },
    ],
    keywords: ['remove tracking from url', 'url cleaner', 'strip utm parameters', 'remove fbclid', 'clean url tool', 'remove gclid from link'],
  },
];
