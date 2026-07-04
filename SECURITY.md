# Security Policy

LazyTools' security model is unusual: tools run entirely client-side, so there is no server-side data
path to attack. The main security surfaces are the static-site supply chain (dependencies, build,
deploy) and correctness of the client-side crypto/privacy tools.

## Reporting a vulnerability

Email **synth88labs@gmail.com** with subject line **SECURITY**. Please include reproduction steps.
You'll get an acknowledgment within 72 hours. Please don't open public issues for unpatched
vulnerabilities.

Machine-readable contact: [`/.well-known/security.txt`](public/.well-known/security.txt) on the live site.

## Scope

- XSS or content injection on lazytools.io pages
- Supply-chain issues in dependencies or the build pipeline
- Flaws in privacy-relevant tool logic (e.g. metadata removal that leaves data behind, weak client-side encryption)
- Anything that causes user data to leave the browser
