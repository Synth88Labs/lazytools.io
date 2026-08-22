# audits/

Autonomous, token-free audit-and-fix output for lazytools.io. Generated daily by
GitHub Actions (`.github/workflows/audit.yml`). Full spec:
[`docs/AUDIT-SYSTEM.md`](../docs/AUDIT-SYSTEM.md).

- **`dashboard.html`** — the **visual** control room: charts for the build
  pipeline, audit score trend, findings by severity/dimension, and the fix
  lifecycle. Self-contained (no external requests), regenerated every run. View
  it rendered at
  <https://raw.githack.com/Synth88Labs/lazytools.io/main/audits/dashboard.html>.
- **`DASHBOARD.md`** — the same progress as plain markdown (renders inline on
  GitHub): counts, coverage, score trend, recent fixes, challenges, top open
  findings.
- **`ledger.json`** — every finding, its severity, fix type and lifecycle
  (`open` → `verifying` → `complete` / `challenged`) with history.
- **`recommendations.md`** — open findings that need a human or AI (things the
  deterministic Fixer can't safely change), grouped by severity.
- **`reports/<date>.md`** — that day's audit; **`reports/<date>-fixes.md`** — that
  day's fixes.

Two bots: **Auditor** (`scripts/audit-ux.mjs`) tests the live tools; **Fixer**
(`scripts/audit-fix.mjs`) applies safe fixes and files the rest as
recommendations. The Auditor re-tests fixed tools the next day to confirm.
