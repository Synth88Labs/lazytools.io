# LazyTools.io — Public Roadmap

LazyTools launches publicly on **~July 25, 2026** (Namecheap hosting, lazytools.io). Until then we're
building in the open — weekly progress releases every Friday.

## Week 1 — Polish & foundations (Jul 6 – Jul 12)

- [ ] Unit converter QA pass: factors audit against NIST/BIPM definitions
- [ ] Lighthouse ≥ 95 on all four categories (performance, a11y, best practices, SEO)
- [ ] Anonymous ratings endpoint (single PHP file + MySQL, no IP/cookies stored)
- [ ] Blog: first 3 posts finalized (kg→lbs, °C→°F, MB vs GB)
- [ ] Release `v0.2.0` — "polish week"

## Week 2 — Second category & content engine (Jul 13 – Jul 19)

- [ ] Calculators pilot: 10 launch calculators (percentage, EMI, BMI, age, tip, discount…)
- [ ] Timezone city-pair converter pages (IST↔EST and top 20 pairs)
- [ ] Search: add calculators to the smart-search index
- [ ] llms.txt + structured-data validation across all pages
- [ ] Release `v0.3.0` — "calculators pilot"

## Week 3 — Launch prep (Jul 20 – Jul 26)

- [ ] GitHub Actions → Namecheap FTPS deploy pipeline (dry-run + rollback plan)
- [ ] DNS cutover + SSL (AutoSSL), .htaccess verification on LiteSpeed
- [ ] Google Search Console + Bing Webmaster: verify, submit sitemap.xml
- [ ] Final legal review pass (privacy, terms, disclaimer)
- [ ] **Release `v1.0.0` — public launch on lazytools.io** 🚀

## Post-launch (Aug 2026 →)

Weekly tranches of 50–150 new tool pages, tracked in Search Console; categories earn expansion when
their pilot pages rank (details in [docs/category-research.md](docs/category-research.md)). Next up:
developer tools, file converters, text utilities, generators, color tools, privacy/security tools —
then WASM-heavy image, PDF, and audio/video tools.

---
*A [Synth88 Labs Inc.](https://synth88.com) project · MIT licensed · lazytools.io*
