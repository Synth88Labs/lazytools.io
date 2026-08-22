# 🧑‍💻 Dev proposal — CSR Generator

`security/csr-generator` · category security · proposed 2026-08-22 · model claude-sonnet-5

> Manager-approved (rating 4.6/5). **Review, then implement + deploy through the normal build.** Not auto-committed.

---

# CSR Generator — Build Proposal

**Slug:** `security/csr-generator`
**Type:** Preact island component + framework-agnostic crypto lib (not data-driven; this tool needs multi-field forms, file downloads, and async key generation, so it doesn't fit the `computeId + widget` table pattern)

---

## 1. Approach

### What a CSR actually is
A Certificate Signing Request is a **PKCS#10** structure (RFC 2986) containing:
- the applicant's **public key** (`SubjectPublicKeyInfo`)
- the **Subject DN** (CN, O, OU, L, ST, C, emailAddress — X.520 attribute types)
- an optional **`extensionRequest` attribute** (OID `1.2.840.113549.1.9.14`) carrying a `subjectAltName` extension (OID `2.5.29.17`, RFC 5280 §4.2.1.6) for multi-domain/SAN certs
- a **signature** over the whole structure, produced with the matching private key

Modern CAs and browsers **require SAN** even for single-domain certs (CN-only is legacy), so SAN input is first-class, not an afterthought.

### Crypto operations (all via native `SubtleCrypto`, zero network)
| Step | API | Notes |
|---|---|---|
| Key generation | `crypto.subtle.generateKey(...)` | RSA (`RSASSA-PKCS1-v1_5`) or ECDSA |
| Public key packaging | `SubjectPublicKeyInfo.importKey()` (pkijs) | builds the DER `SubjectPublicKeyInfo` |
| Signing | `CertificationRequest.sign(privateKey, hash)` (pkijs → `crypto.subtle.sign`) | self-signs the CSR body |
| Private key export | `crypto.subtle.exportKey("pkcs8", key)` | for the downloadable `.key` file |

We use **pkijs + asn1js** (pure JS, no network fetch, bundled statically at build time) to construct the DER/ASN.1 structure correctly — hand-rolling PKCS#10 ASN.1 is error-prone and a wrong encoding silently breaks at the CA, which is unacceptable for a trust-sensitive tool.

### Algorithm choices offered (and why)
| Option | Security strength | Source |
|---|---|---|
| RSA-2048 (default) | ~112-bit | CA/Browser Forum Baseline Requirements §6.1.5 — 2048-bit is the CA/B Forum's mandated *minimum* RSA size |
| RSA-4096 | ~140-bit (conservatively bucketed with 3072 at ~128-bit) | NIST SP 800-57 Part 1 Rev. 5, Table 2 |
| ECDSA P-256 | ~128-bit | NIST SP 800-57 Part 1 Rev. 5, Table 2 — P-256 ≈ RSA-3072 |
| ECDSA P-384 | ~192-bit | same table |

Signature hash is fixed to **SHA-256** (SHA-384 for P-384) — SHA-1 is not offered since it's been rejected by all major CAs/browsers since 2016 (CA/Browser Forum ballots 118/152).

### Inputs
- Common Name (required)
- Organization, Organizational Unit, Locality, State/Province, Country (2-letter, optional)
- Email address (optional, legacy attribute some CAs still accept)
- Subject Alternative Names — DNS names only, newline/comma separated (auto-seeded with CN)
- Key algorithm: `RSA-2048 | RSA-4096 | ECDSA-P256 | ECDSA-P384`

### Outputs
- PEM-encoded **CSR** (`-----BEGIN CERTIFICATE REQUEST-----`)
- PEM-encoded **PKCS#8 private key** (`-----BEGIN PRIVATE KEY-----`)
- Decoded summary (subject line, SANs, algorithm) for the user to eyeball before submitting to a CA
- Both are downloadable as files and copyable to clipboard; **nothing is ever sent anywhere**

---

## 2. Implementation

### File tree

```
src/
  lib/
    security/
      csr.ts                 # pure logic, framework-agnostic, Node-testable
  components/
    security/
      CsrGenerator.tsx        # Preact island (UI)
  pages/
    security/
      csr-generator.astro     # route + editorial + JSON-LD FAQ
scripts/
  test-csr-generator.ts       # Node test
package.json                  # + pkijs, asn1js deps, + test script
```

Install deps:
```bash
npm i pkijs asn1js
```

### `src/lib/security/csr.ts`

```ts
// src/lib/security/csr.ts
// Framework-agnostic CSR (PKCS#10, RFC 2986) generation using WebCrypto + pkijs.
// Runs identically in the browser and in Node (for tests) — no network calls.

import * as asn1js from "asn1js";
import {
  CertificationRequest,
  AttributeTypeAndValue,
  Attribute,
  Extension,
  Extensions,
  GeneralNames,
  GeneralName,
  setEngine,
  CryptoEngine,
} from "pkijs";

export type KeyAlgorithmChoice =
  | "RSA-2048"
  | "RSA-4096"
  | "ECDSA-P256"
  | "ECDSA-P384";

export interface CsrSubject {
  commonName: string;
  organization?: string;
  organizationalUnit?: string;
  locality?: string;
  state?: string;
  /** ISO 3166-1 alpha-2, e.g. "US" */
  country?: string;
  email?: string;
}

export interface GenerateCsrInput {
  subject: CsrSubject;
  /** DNS names for the subjectAltName extension. CN is auto-included if empty. */
  sans: string[];
  algorithm: KeyAlgorithmChoice;
}

export interface GenerateCsrResult {
  csrPem: string;
  privateKeyPem: string;
  algorithmLabel: string;
}

// ---- WebCrypto engine wiring (works in browser and Node 19+/webcrypto) ----

let engineReady = false;
function ensureEngine(): void {
  if (engineReady) return;
  const cryptoObj: Crypto = (globalThis as any).crypto;
  if (!cryptoObj?.subtle) {
    throw new Error(
      "SubtleCrypto is unavailable in this runtime. Requires a modern browser (HTTPS/localhost) or Node 19+."
    );
  }
  const engine = new CryptoEngine({
    name: "runtime-webcrypto",
    crypto: cryptoObj,
    subtle: cryptoObj.subtle,
  });
  setEngine("runtime-webcrypto", engine, engine);
  engineReady = true;
}

function algoParams(choice: KeyAlgorithmChoice): {
  genParams: RsaHashedKeyGenParams | EcKeyGenParams;
  hashName: string;
  label: string;
} {
  switch (choice) {
    case "RSA-2048":
      return {
        genParams: {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: 2048,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: "SHA-256",
        },
        hashName: "SHA-256",
        label: "RSA 2048-bit / SHA-256",
      };
    case "RSA-4096":
      return {
        genParams: {
          name: "RSASSA-PKCS1-v1_5",
          modulusLength: 4096,
          publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
          hash: "SHA-256",
        },
        hashName: "SHA-256",
        label: "RSA 4096-bit / SHA-256",
      };
    case "ECDSA-P256":
      return {
        genParams: { name: "ECDSA", namedCurve: "P-256" },
        hashName: "SHA-256",
        label: "ECDSA P-256 / SHA-256",
      };
    case "ECDSA-P384":
      return {
        genParams: { name: "ECDSA", namedCurve: "P-384" },
        hashName: "SHA-384",
        label: "ECDSA P-384 / SHA-384",
      };
  }
}

function toBase64(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

function toPem(buf: ArrayBuffer, label: string): string {
  const b64 = toBase64(buf);
  const lines = b64.match(/.{1,64}/g) ?? [];
  return `-----BEGIN ${label}-----\n${lines.join("\n")}\n-----END ${label}-----\n`;
}

const OID = {
  CN: "2.5.4.3",
  O: "2.5.4.10",
  OU: "2.5.4.11",
  L: "2.5.4.7",
  ST: "2.5.4.8",
  C: "2.5.4.6",
  EMAIL: "1.2.840.113549.1.9.1",
  EXTENSION_REQUEST: "1.2.840.113549.1.9.14",
  SUBJECT_ALT_NAME: "2.5.29.17",
} as const;

const DNS_NAME_RE =
  /^(\*\.)?(([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)\.)+[a-zA-Z]{2,}$/;

export function isValidDnsName(name: string): boolean {
  return DNS_NAME_RE.test(name.trim());
}

export function isValidCountryCode(code: string): boolean {
  return /^[A-Za-z]{2}$/.test(code.trim());
}

/**
 * Generates a fresh key pair and a signed PKCS#10 CSR entirely client-side.
 */
export async function generateCsr(
  input: GenerateCsrInput
): Promise<GenerateCsrResult> {
  ensureEngine();

  if (!input.subject.commonName?.trim()) {
    throw new Error("Common Name is required.");
  }
  if (input.subject.country && !isValidCountryCode(input.subject.country)) {
    throw new Error("Country must be a 2-letter ISO 3166-1 
