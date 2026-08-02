/**
 * A small, dependency-free ASN.1 DER parser and X.509 certificate decoder.
 *
 * Enough of RFC 5280 to render a certificate's human-readable fields:
 * version, serial, signature algorithm, issuer/subject DN, validity window,
 * public-key algorithm and size, and the common extensions (SAN, key usage,
 * basic constraints, SKI/AKI). Pure and deterministic — no crypto, no network.
 */

// ---------------------------------------------------------------------------
// PEM → DER
// ---------------------------------------------------------------------------

/** Extract the DER bytes from a PEM block (or accept raw base64 / hex). */
export function pemToDer(input: string): Uint8Array {
  const text = input.trim();
  const pem = text.match(/-----BEGIN [^-]+-----([\s\S]*?)-----END [^-]+-----/);
  let b64: string;
  if (pem) {
    b64 = pem[1]!.replace(/\s+/g, '');
  } else if (/^[0-9a-fA-F\s]+$/.test(text) && text.replace(/\s+/g, '').length % 2 === 0 && !/[g-z]/i.test(text)) {
    // Looks like hex.
    return hexToBytes(text.replace(/\s+/g, ''));
  } else {
    b64 = text.replace(/\s+/g, '');
  }
  return b64ToBytes(b64);
}

function b64ToBytes(b64: string): Uint8Array {
  const bin = typeof atob === 'function' ? atob(b64) : Buffer.from(b64, 'base64').toString('binary');
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

function hexToBytes(hex: string): Uint8Array {
  const out = new Uint8Array(hex.length / 2);
  for (let i = 0; i < out.length; i++) out[i] = parseInt(hex.substr(i * 2, 2), 16);
  return out;
}

function bytesToHex(bytes: Uint8Array, sep = ''): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join(sep);
}

// ---------------------------------------------------------------------------
// ASN.1 DER TLV parser
// ---------------------------------------------------------------------------

export interface Asn1Node {
  tag: number;        // raw first byte
  tagNo: number;      // low 5 bits (tag number)
  cls: number;        // class (0 universal, 2 context)
  constructed: boolean;
  start: number;      // offset of the TLV
  headerLen: number;
  length: number;     // content length
  content: Uint8Array;
  end: number;        // offset just past this TLV
  children?: Asn1Node[];
}

/** Parse a single DER TLV at `offset`. Recurses into constructed values. */
export function parseTlv(bytes: Uint8Array, offset: number): Asn1Node {
  const tag = bytes[offset]!;
  const cls = tag >> 6;
  const constructed = (tag & 0x20) !== 0;
  const tagNo = tag & 0x1f;
  let i = offset + 1;
  const first = bytes[i]!;
  let length: number;
  if (first < 0x80) {
    length = first; i += 1;
  } else {
    const n = first & 0x7f;
    if (n === 0 || n > 4) throw new Error('Unsupported ASN.1 length encoding');
    length = 0;
    for (let k = 0; k < n; k++) length = length * 256 + bytes[i + 1 + k]!;
    i += 1 + n;
  }
  const headerLen = i - offset;
  const content = bytes.subarray(i, i + length);
  const end = i + length;
  const node: Asn1Node = { tag, tagNo, cls, constructed, start: offset, headerLen, length, content, end };
  if (constructed) {
    node.children = [];
    let p = i;
    while (p < end) { const child = parseTlv(bytes, p); node.children.push(child); p = child.end; }
  }
  return node;
}

// ---------------------------------------------------------------------------
// Primitive decoders
// ---------------------------------------------------------------------------

/** Decode an OBJECT IDENTIFIER content into dotted-decimal form. */
export function decodeOid(content: Uint8Array): string {
  if (content.length === 0) return '';
  const parts: number[] = [];
  const first = content[0]!;
  parts.push(Math.floor(first / 40), first % 40);
  let value = 0;
  for (let i = 1; i < content.length; i++) {
    const b = content[i]!;
    value = value * 128 + (b & 0x7f);
    if ((b & 0x80) === 0) { parts.push(value); value = 0; }
  }
  return parts.join('.');
}

/** Big integer content as a (positive) hex string, no leading 0x. */
export function intToHex(content: Uint8Array): string {
  let start = 0;
  while (start < content.length - 1 && content[start] === 0) start++;
  return bytesToHex(content.subarray(start)).toUpperCase();
}

/** Decode UTCTime / GeneralizedTime content to an ISO string. */
export function decodeTime(node: Asn1Node): string {
  const s = new TextDecoder().decode(node.content).trim();
  // UTCTime: YYMMDDHHMMSSZ ; GeneralizedTime: YYYYMMDDHHMMSSZ
  let m: RegExpMatchArray | null;
  if (node.tagNo === 23 && (m = s.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z$/))) {
    const yy = parseInt(m[1]!, 10);
    const year = yy >= 50 ? 1900 + yy : 2000 + yy;
    return `${year}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? '00'}Z`;
  }
  if (node.tagNo === 24 && (m = s.match(/^(\d{4})(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})?Z?$/))) {
    return `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6] ?? '00'}Z`;
  }
  return s;
}

// ---------------------------------------------------------------------------
// OID name tables
// ---------------------------------------------------------------------------

const DN_OIDS: Record<string, string> = {
  '2.5.4.3': 'CN', '2.5.4.6': 'C', '2.5.4.7': 'L', '2.5.4.8': 'ST', '2.5.4.10': 'O',
  '2.5.4.11': 'OU', '2.5.4.5': 'serialNumber', '2.5.4.4': 'SN', '2.5.4.42': 'GN',
  '2.5.4.9': 'street', '2.5.4.17': 'postalCode', '1.2.840.113549.1.9.1': 'emailAddress',
  '0.9.2342.19200300.100.1.25': 'DC', '2.5.4.15': 'businessCategory',
  '1.3.6.1.4.1.311.60.2.1.3': 'jurisdictionC',
};

const SIG_OIDS: Record<string, string> = {
  '1.2.840.113549.1.1.5': 'SHA-1 with RSA', '1.2.840.113549.1.1.11': 'SHA-256 with RSA',
  '1.2.840.113549.1.1.12': 'SHA-384 with RSA', '1.2.840.113549.1.1.13': 'SHA-512 with RSA',
  '1.2.840.113549.1.1.10': 'RSASSA-PSS', '1.2.840.10045.4.3.2': 'ECDSA with SHA-256',
  '1.2.840.10045.4.3.3': 'ECDSA with SHA-384', '1.2.840.10045.4.3.4': 'ECDSA with SHA-512',
  '1.3.101.112': 'Ed25519', '1.3.101.113': 'Ed448',
};

const PK_OIDS: Record<string, string> = {
  '1.2.840.113549.1.1.1': 'RSA', '1.2.840.10045.2.1': 'EC', '1.3.101.112': 'Ed25519', '1.3.101.113': 'Ed448',
};

const CURVE_OIDS: Record<string, string> = {
  '1.2.840.10045.3.1.7': 'P-256 (secp256r1)', '1.3.132.0.34': 'P-384 (secp384r1)', '1.3.132.0.35': 'P-521 (secp521r1)',
};

const EXT_OIDS: Record<string, string> = {
  '2.5.29.17': 'subjectAltName', '2.5.29.15': 'keyUsage', '2.5.29.19': 'basicConstraints',
  '2.5.29.37': 'extKeyUsage', '2.5.29.14': 'subjectKeyIdentifier', '2.5.29.35': 'authorityKeyIdentifier',
  '2.5.29.31': 'cRLDistributionPoints', '2.5.29.32': 'certificatePolicies',
  '1.3.6.1.5.5.7.1.1': 'authorityInfoAccess',
};

const EKU_OIDS: Record<string, string> = {
  '1.3.6.1.5.5.7.3.1': 'TLS Web Server Authentication', '1.3.6.1.5.5.7.3.2': 'TLS Web Client Authentication',
  '1.3.6.1.5.5.7.3.3': 'Code Signing', '1.3.6.1.5.5.7.3.4': 'Email Protection', '1.3.6.1.5.5.7.3.8': 'Time Stamping',
  '1.3.6.1.5.5.7.3.9': 'OCSP Signing',
};

const KEY_USAGE_BITS = [
  'Digital Signature', 'Non Repudiation', 'Key Encipherment', 'Data Encipherment',
  'Key Agreement', 'Certificate Sign', 'CRL Sign', 'Encipher Only', 'Decipher Only',
];

// ---------------------------------------------------------------------------
// X.509 extraction
// ---------------------------------------------------------------------------

export interface X509Extension { name: string; oid: string; critical: boolean; value: string; }

export interface X509Cert {
  version: number;
  serialNumber: string;
  signatureAlgorithm: string;
  issuer: string;
  subject: string;
  notBefore: string;
  notAfter: string;
  publicKeyAlgorithm: string;
  publicKeyBits?: number;
  publicKeyCurve?: string;
  extensions: X509Extension[];
  sans: string[];
}

function algName(seq: Asn1Node, table: Record<string, string>): { name: string; oid: string; params?: Asn1Node } {
  const oidNode = seq.children![0]!;
  const oid = decodeOid(oidNode.content);
  return { name: table[oid] ?? oid, oid, params: seq.children![1] };
}

/** Format a Name (RDNSequence) as a comma-separated DN string. */
function formatName(name: Asn1Node): string {
  const parts: string[] = [];
  for (const rdn of name.children ?? []) {
    for (const atv of rdn.children ?? []) {
      const oid = decodeOid(atv.children![0]!.content);
      const label = DN_OIDS[oid] ?? oid;
      const val = new TextDecoder().decode(atv.children![1]!.content);
      parts.push(`${label}=${val}`);
    }
  }
  return parts.join(', ');
}

const GENERAL_NAME_KIND: Record<number, string> = { 1: 'email', 2: 'DNS', 6: 'URI', 7: 'IP' };

function formatSan(extnValue: Uint8Array): { sans: string[]; text: string } {
  const seq = parseTlv(extnValue, 0);
  const sans: string[] = [];
  for (const gn of seq.children ?? []) {
    const kind = GENERAL_NAME_KIND[gn.tagNo];
    if (gn.tagNo === 7) {
      const b = gn.content;
      const ip = b.length === 4 ? Array.from(b).join('.') : bytesToHex(b, ':');
      sans.push(`IP:${ip}`);
    } else if (kind) {
      sans.push(`${kind}:${new TextDecoder().decode(gn.content)}`);
    }
  }
  return { sans, text: sans.join(', ') };
}

function formatExtension(oid: string, name: string, extnValue: Uint8Array): { value: string; sans?: string[] } {
  try {
    if (oid === '2.5.29.17') { const r = formatSan(extnValue); return { value: r.text, sans: r.sans }; }
    if (oid === '2.5.29.19') {
      const seq = parseTlv(extnValue, 0);
      let ca = false, pathLen: number | null = null;
      for (const c of seq.children ?? []) {
        if (c.tagNo === 1) ca = c.content[0] !== 0;
        if (c.tagNo === 2) pathLen = c.content[0] ?? null;
      }
      return { value: `CA: ${ca}${pathLen !== null ? `, pathlen: ${pathLen}` : ''}` };
    }
    if (oid === '2.5.29.15') {
      const bit = parseTlv(extnValue, 0);
      const unused = bit.content[0]!;
      const bits = bit.content.subarray(1);
      const flags: string[] = [];
      let idx = 0;
      for (let byte = 0; byte < bits.length; byte++) {
        for (let b = 7; b >= 0; b--) {
          const totalBitsUsed = bits.length * 8 - unused;
          if (idx < totalBitsUsed && (bits[byte]! >> b) & 1) flags.push(KEY_USAGE_BITS[idx] ?? `bit${idx}`);
          idx++;
        }
      }
      return { value: flags.join(', ') };
    }
    if (oid === '2.5.29.37') {
      const seq = parseTlv(extnValue, 0);
      const usages = (seq.children ?? []).map((c) => { const o = decodeOid(c.content); return EKU_OIDS[o] ?? o; });
      return { value: usages.join(', ') };
    }
    if (oid === '2.5.29.14') {
      const oct = parseTlv(extnValue, 0);
      return { value: bytesToHex(oct.content, ':').toUpperCase() };
    }
    if (oid === '2.5.29.35') {
      const seq = parseTlv(extnValue, 0);
      const keyid = (seq.children ?? []).find((c) => c.tagNo === 0);
      if (keyid) return { value: `keyid:${bytesToHex(keyid.content, ':').toUpperCase()}` };
    }
  } catch { /* fall through to hex */ }
  return { value: bytesToHex(extnValue.subarray(0, 64), ':').toUpperCase() + (extnValue.length > 64 ? '…' : '') };
}

/** Parse a DER-encoded X.509 certificate into readable fields. */
export function parseCertificate(der: Uint8Array): X509Cert {
  const cert = parseTlv(der, 0);
  if (cert.tagNo !== 16 || !cert.children) throw new Error('Not a certificate: top-level is not a SEQUENCE');
  const tbs = cert.children[0]!;
  const sigAlg = cert.children[1]!;
  if (!tbs.children) throw new Error('Malformed tbsCertificate');

  let idx = 0;
  let version = 1;
  if (tbs.children[0]!.cls === 2 && tbs.children[0]!.tagNo === 0) {
    version = (tbs.children[0]!.children?.[0]?.content[0] ?? 0) + 1;
    idx = 1;
  }
  const serial = intToHex(tbs.children[idx++]!.content);
  idx++; // inner signature AlgorithmIdentifier (same as outer)
  const issuer = formatName(tbs.children[idx++]!);
  const validity = tbs.children[idx++]!;
  const notBefore = decodeTime(validity.children![0]!);
  const notAfter = decodeTime(validity.children![1]!);
  const subject = formatName(tbs.children[idx++]!);
  const spki = tbs.children[idx++]!;

  const pkAlg = algName(spki.children![0]!, PK_OIDS);
  let publicKeyBits: number | undefined;
  let publicKeyCurve: string | undefined;
  if (pkAlg.name === 'RSA') {
    const bitStr = spki.children![1]!;
    const inner = parseTlv(bitStr.content, 1); // skip unused-bits byte
    const modulus = inner.children![0]!;
    let mlen = modulus.content.length;
    if (modulus.content[0] === 0) mlen -= 1;
    publicKeyBits = mlen * 8;
  } else if (pkAlg.name === 'EC' && pkAlg.params) {
    const curveOid = decodeOid(pkAlg.params.content);
    publicKeyCurve = CURVE_OIDS[curveOid] ?? curveOid;
  }

  const extensions: X509Extension[] = [];
  let sans: string[] = [];
  const extContainer = tbs.children.find((c) => c.cls === 2 && c.tagNo === 3);
  if (extContainer?.children?.[0]?.children) {
    for (const ext of extContainer.children[0].children) {
      const oid = decodeOid(ext.children![0]!.content);
      let critical = false, valIdx = 1;
      if (ext.children![1]!.tagNo === 1) { critical = ext.children![1]!.content[0] !== 0; valIdx = 2; }
      const extnValue = ext.children![valIdx]!.content;
      const name = EXT_OIDS[oid] ?? oid;
      const f = formatExtension(oid, name, extnValue);
      if (f.sans) sans = f.sans;
      extensions.push({ name, oid, critical, value: f.value });
    }
  }

  return {
    version,
    serialNumber: serial,
    signatureAlgorithm: algName(sigAlg, SIG_OIDS).name,
    issuer,
    subject,
    notBefore,
    notAfter,
    publicKeyAlgorithm: pkAlg.name,
    publicKeyBits,
    publicKeyCurve,
    extensions,
    sans,
  };
}

/** Convenience: PEM/base64/hex string → parsed certificate. */
export function decodeCertificate(input: string): X509Cert {
  return parseCertificate(pemToDer(input));
}
