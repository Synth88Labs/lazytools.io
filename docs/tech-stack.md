# LazyTools.io — Tech Stack (Namecheap Shared Hosting)

*Decided: July 2026. Constraint: Namecheap Shared Hosting (cPanel, Apache/LiteSpeed, PHP + MySQL native, Node.js only via Passenger with tight limits). No serverless, no edge, no long-running SSR.*

## Guiding decision

The hosting constraint and the product philosophy point the same direction: **everything is static files + client-side compute.** The site builds to plain HTML/CSS/JS locally (or in CI) and is uploaded to `public_html`. The server does nothing but serve files — which is also the strongest possible proof of "your files never leave your browser."

## The stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Astro** (static output, islands) | Best-in-class SSG for content+interactivity mix: tool pages render as full HTML (SEO/GEO requirement), tool UIs hydrate as isolated islands. Content collections fit the registry model. Zero JS shipped for pure-content pages (blog). |
| Island components | **Preact** (or vanilla TS for simple tools) | React ergonomics at ~4KB; keeps bundles small on shared hosting bandwidth. Astro allows per-tool choice. |
| Styling | **Tailwind CSS** | One design system across 100+ tool pages from a single template; purged CSS stays tiny. |
| Language | **TypeScript** everywhere | Registry schema is typed → tool metadata errors caught at build. |
| Tool engines (client-side) | `pdf-lib` + `pdf.js` (PDF), Squoosh codecs / `wasm-image-optimization` (images), `ffmpeg.wasm` (video/audio), `jszip`, `crypto.subtle` (security tools), plain TS (text/dev/calc) | All WASM/Web-API, all run in-browser. Lazy-loaded on first interaction, never on page load (Core Web Vitals). |
| Search (client) | **Pagefind** or Fuse.js over registry index | Static search index generated at build — no search server needed. |
| Micro-backend (ratings only) | **Single PHP endpoint + MySQL** | PHP/MySQL are first-class on Namecheap shared hosting — more reliable than the Passenger Node app. One `rate.php` accepting `{tool, stars}`, one table. Aggregates exported to JSON at intervals and pulled into builds. |
| Analytics | **Plausible (cloud) or GoatCounter** | Privacy-respecting (on-brand), script-based — nothing to host. |
| CI/CD | **GitHub Actions → FTPS deploy** (`SamKirkland/FTP-Deploy-Action`) or cPanel Git | Push to `main` → build → upload `dist/` diff to `public_html`. No manual FTP. |
| Server config | **.htaccess** | Redirects, caching headers, gzip/brotli, security headers, and **COOP/COEP** (see below). |

## Rejected alternatives

- **Next.js**: SSG export works, but its static-export mode fights the framework (no image optimization, middleware, etc.), and everything it adds over Astro assumes a Node server we don't have.
- **Node SSR via cPanel Passenger**: memory-capped, fragile restarts, wrong tool — and SSR buys us nothing when pages are static by design.
- **Plain 11ty/Hugo**: great SSG, but weak ergonomics for 100+ interactive TS/WASM tool components.
- **WordPress (native to shared hosting)**: fine for blogs, wrong for a component-driven tool registry; slower, larger attack surface.

## Namecheap-specific requirements

### .htaccess essentials

```apache
# Cross-origin isolation — required for SharedArrayBuffer (ffmpeg.wasm threads)
Header set Cross-Origin-Opener-Policy "same-origin"
Header set Cross-Origin-Embedder-Policy "require-corp"

# Long-cache hashed assets, short-cache HTML
<FilesMatch "\.(js|css|wasm|woff2|avif|webp)$">
  Header set Cache-Control "public, max-age=31536000, immutable"
</FilesMatch>
<FilesMatch "\.html$">
  Header set Cache-Control "public, max-age=3600"
</FilesMatch>

# Serve .wasm with the right MIME (required for streaming compilation)
AddType application/wasm .wasm

# Trailing-slash canonical redirects + www→apex (or vice versa), HTTPS force
```

Notes:
- COOP/COEP makes the site cross-origin-isolated: any third-party iframe/script must send CORP/CORS headers. Test analytics + (future) ad scripts against this; if a conflict arises, scope COOP/COEP to only the tool routes that need threads (per-directory .htaccess).
- Namecheap shared plans include free SSL (AutoSSL) and HTTP/2 — enable both in cPanel.

### Size & performance budget (shared hosting bandwidth is finite)

- Per-page JS budget: ≤ 50KB gzipped before tool interaction; WASM engines (up to ~30MB for ffmpeg.wasm) load on explicit user action with a progress indicator, and are cached immutably thereafter.
- Consider serving the largest WASM bundles from a free CDN (jsDelivr pinning the exact npm version) — but self-host by default to keep the "nothing leaves your browser" story clean and audit-able. If CDN is used, note CORP header requirement under COEP.

### Ratings endpoint sketch (`/api/rate.php`)

- `POST {tool: string, stars: 1–5}` → validate slug against a generated allowlist, `INSERT` into `ratings(tool, stars, created_at)` — no IP, no cookies, no UA stored.
- Rate-limit by a coarse hashed-IP daily counter kept only in memory of the day's table, or simply accept noise (threshold ≥25 + localStorage flag already dampens abuse).
- A `stats.php` (or nightly cron in cPanel) writes `ratings.json`; the CI build fetches it so `aggregateRating` schema stays server-rendered.

## Repo layout

```
lazytools/
├── src/
│   ├── registry/            # one .ts file per tool (metadata, SEO, FAQ, variants)
│   ├── components/          # shared UI + per-tool islands
│   ├── engines/             # wasm/web-api wrappers (lazy-loaded)
│   ├── layouts/             # tool page, hub, blog templates
│   ├── pages/               # Astro routes generated from registry
│   └── content/blog/        # MDX posts with archetype frontmatter
├── public/                  # static assets, robots.txt, llms.txt
├── api/                     # rate.php, stats.php (deployed alongside dist)
├── docs/                    # these decision docs
└── .github/workflows/deploy.yml
```

## Migration posture

Nothing in this stack is Namecheap-specific except `.htaccess` and `rate.php`. If the project outgrows shared hosting (bandwidth, ratings write volume), the same `dist/` deploys unchanged to Cloudflare Pages/Netlify and the PHP endpoint becomes a worker — a day's work, no rewrite.
