# Blockchain / Web3 Developer Utilities — Market Research — 2026-07-11

## Executive summary

**Verdict: GO (qualified) — recommend a STANDALONE category, `/web3/` "Web3 & Blockchain Developer Tools," positioned explicitly as deterministic developer utilities: no wallets, no keys, no seed phrases, no live prices, no trading.** The count clears the bar: **11 genuinely-buildable, deterministic, on-charter, differentiated distinct-page tools** (plus a watchlist/fold set), comfortably above the ≥10 threshold for a standalone category rather than a `/dev/` fold. A pure `/dev/` fold would bury a coherent, cross-linkable audience (every EVM/Solidity + Bitcoin developer) under generic dev tools and forfeit the SEO cluster.

**But this is an owner-directed category expansion (ranked list), NOT a gap-gated build** — exactly like `/generate/`, `/calc/`, and `/biology/`. The competition-gap axis is structurally weak (uniformly 2–3): every single candidate already has multiple clean, client-side, often ad-free incumbents, several of which run *dedicated* "blockchain dev tools" sections (WuTools `/blockchain/`, EVMTools, Loris Tools, devtoolkit.sh, buidlnow, plus Etherscan/thirdweb/Alchemy). This is the 2026-07-11 daily-scan thesis in its purest form: **client-side is the baseline, not the differentiator.** Our edge here is identical to the rest of the site — **exactness (18-decimal BigInt fixed-point; keccak byte-exactness; canonical-signature normalization), one clean single-purpose ad-free SEO page per intent, and honest correctness notes (Keccak-vs-NIST-SHA3 padding, canonical uint256, sorted-pair Merkle) that the ad-heavy incumbents blur.**

**Future driver (named, strengthening):** the EVM is now a de-facto multichain standard — Arbitrum ~$13.8B and Base ~$11.2B L2 TVL, ~77% of L2 DeFi TVL between them, rollups the primary scaling path in 2026 — so wei/gwei, EIP-55, keccak, function-selector and calldata tooling is used by every developer on *every* EVM chain, chain-agnostic and staleness-proof (no live data feed anywhere). These are frozen specs (ERC-55, ABI spec, BIP-13/173/350) that do not rot. **AI-resistance is genuinely strong:** a chat LLM cannot reliably compute a Keccak-256 digest, a valid EIP-55 capitalization, a correct 4-byte selector, or an exact 18-decimal wei value — these are byte-exact deterministic outputs, and calldata/addresses are the kind of thing you shouldn't paste into a random site.

**Exclusions honored (see DO-NOT-BUILD):** no private-key/seed generation *or validation*, no HD/BIP39/BIP32 derivation, no vanity address, no keystore, no live price/gas/market/APY feed, no portfolio/mining/profitability/"should I buy." The only finance-adjacent tool proposed is a **gas fee calculator with the gas price and ETH price supplied BY THE USER** (rate-as-input, identical pattern to the shipped sales-tax tool) — never a live oracle.

**Brand-safety note:** crypto is a scam-adjacent, YMYL-adjacent space and this category carries reputational risk that `/math/` does not. Mitigate with (a) a persistent category banner — "Developer utilities only. LazyTools does not handle wallets, private keys, seed phrases, funds, live prices, or trading, and gives no financial advice." — (b) never accepting secret material anywhere, and (c) leading the SEO with *developer* intent ("ethereum unit converter," "eip-55 checksum," "keccak-256") not investor intent. If the owner judges the brand risk too high, the fallback is to fold only the 4 keccak-core LEAD tools into `/dev/` and skip the rest.

Legend: **[S]** = declarative fields→compute registry entry · **[C]** = custom Preact island (parse/codec/BigInt/bulk).

---

## Differentiation thesis in one line

A chatbot will happily *describe* wei or *talk about* EIP-55, but it cannot emit the exact 18-decimal BigInt wei value, the correct mixed-case checksum, the right Keccak-256 digest (with Ethereum's padding, not NIST SHA3's), or a canonical `transfer(address,uint256)` selector — and you shouldn't paste raw calldata into someone's ad server; that byte-exact, keccak-hard, privacy-relevant gap is where these pages earn their place.

---

## Ranked build list

### LEAD TIER — the Keccak core + the BigInt core (cheap, high-demand, strongly AI-resistant)

**1. Ethereum unit converter — wei ⇄ gwei ⇄ ether (+finney/szabo/shannon) — [C] — 21/25**
- Scores: demand 5 · feasibility 5 · gap 2 · durability 5 · fit 4.
- Spec: fixed denominations, 1 ether = 10¹⁸ wei, 1 gwei = 10⁹ wei. Implement as **BigInt fixed-point** (integer wei + decimal scaling), never JS float — the whole point.
- Differentiation / AI-resistance (4/5): deterministic byte-exact, zero-friction, repeat-workflow, privacy-neutral. Edge over Etherscan/thirdweb/Alchemy/eth-converter: pure BigInt across *all* denominations with no rounding drift and **no bundled live price** (many incumbents mix in a price ticker that rots); clean single-purpose page. Named driver: gwei-denominated gas is a permanent EVM primitive across all L2s.
- Overlap/fold: shares the fixed-point core with #5 and #9; distinct from `/dev/` number-base-converter. Satoshi⇄BTC (#12) can fold in as a "Bitcoin units" mode to become a broader "crypto unit converter."

**2. EIP-55 checksum address — validate + to-checksum — [C] — 20/25**
- Scores: demand 5 · feasibility 4 · gap 2 · durability 5 · fit 4.
- Spec: **ERC-55.** keccak256 of the 40-char lowercase hex ASCII; uppercase hex letter *i* iff nibble *i* of the hash ≥ 8. Provide both directions: convert lowercase→checksummed, and validate a pasted address's checksum (flag mismatch = likely typo). Optionally note ERC-1191 chain-id-salted variant (do not default to it).
- Differentiation / AI-resistance (4/5): keccak-hard (chatbot can't fake the capitalization), deterministic, privacy-neutral, address hygiene is a real repeat need. Public address only — **no key material ever.**
- Overlap: reuses the keccak core (#3). Absorbs the "address format checker" (#16) as its input validation.

**3. Keccak-256 / SHA-3 hash generator — [C] — 20/25**
- Scores: demand 5 · feasibility 4 · gap 2 · durability 5 · fit 4.
- Spec: offer **both** original **Keccak-256** (Ethereum's, 0x01 padding) *and* **NIST SHA3-256** (0x06 padding), and LOUDLY label the difference — this conflation is the #1 confusion in the space and the exactness/education wedge. Input modes: UTF-8 text and raw hex-bytes. Optionally SHA3-512 / SHAKE.
- Differentiation / AI-resistance (4/5): byte-exact deterministic, keccak-hard, repeat-workflow. **Distinct from the shipped `/dev/` SHA hash generator** (that is SHA-2 via Web Crypto; Web Crypto has no Keccak/SHA-3, so this needs `js-sha3`/`keccak` wasm/JS). Cross-link the two.
- Overlap: this is the shared engine behind #2, #4, #10, #14. Build it first.

**4. 4-byte function selector / event topic0 generator — [C] — 20/25**
- Scores: demand 5 · feasibility 4 · gap 2 · durability 5 · fit 4.
- Spec: selector = first 4 bytes of keccak256(canonical function signature); event topic0 = full 32-byte keccak256(event signature). **Canonicalize** the signature: `uint`→`uint256`, `int`→`int256`, strip whitespace, normalize tuples/arrays — the "space in the signature hashes to a selector that never matches the contract" footgun is the exactness value.
- Differentiation / AI-resistance (4/5): keccak-hard, deterministic, Solidity-dev repeat-workflow. Edge over 4byte.directory (that's a lookup DB, not a canonicalizing generator) and WuTools: show the canonical form + the hash + the 4 bytes with the normalization steps.
- Overlap: reuses keccak core (#3).

### SOLID TIER — high value, slightly narrower demand or higher build cost

**5. ERC-20 token amount ⇄ raw units (user-supplied decimals) — [C] — 20/25**
- Scores: demand 4 · feasibility 5 · gap 2 · durability 5 · fit 4.
- Spec: raw uint256 = amount × 10^decimals, **BigInt fixed-point both directions.** Decimals is a **user input** (presets 6/8/18 as convenience, always editable) — never a token lookup → **zero maintenance, staleness-proof** (same discipline as the sales-tax rate-as-input tool).
- Differentiation / AI-resistance (4/5): exact BigInt (chatbot mis-handles 10^18 arithmetic), deterministic, repeat-workflow. Edge over EVMTools/Loris/tokendecimals.com: exactness + clean page + honest "you supply the decimals."
- Overlap: shares fixed-point core with #1.

**6. Bitcoin address validator — Base58Check + Bech32/Bech32m — [C] — 18/25**
- Scores: demand 4 · feasibility 4 · gap 2 · durability 4 · fit 4.
- Spec: **Base58Check** (version byte + double-SHA256 first-4-bytes checksum; BIP-13 P2SH) for legacy `1…`/`3…`; **Bech32 (BIP-173)** for SegWit v0 `bc1q…`; **Bech32m (BIP-350)** for Taproot v1 `bc1p…`. Output: valid?/type (P2PKH/P2SH/SegWit/Taproot)/network (main/test)/decoded hash160 or witness program. **Format & checksum only — no key material, no live balance lookup** (a balance check would need a chain data feed = excluded).
- Differentiation / AI-resistance (4/5): deterministic checksum verification, explains *why* invalid (charset vs checksum vs length) + type/network detection. Edge over BitRef/IOTools: clean single page, honest "format-only, we never see funds."
- Overlap: shares Base58 (#7) and Bech32 (#8) codecs.

**7. Base58 / Base58Check encode-decode — [C] — 18/25**
- Scores: demand 3 · feasibility 5 · gap 2 · durability 4 · fit 4.
- Spec: Bitcoin Base58 alphabet (no 0/O/I/l). Base58Check = version‖payload, append double-SHA256[:4], encode. Text and hex I/O. Distinct from the shipped `/dev/` Base64.
- Differentiation / AI-resistance (3/5): deterministic, checksum-exact, repeat-workflow. Overlap: codec reused by #6.

**8. Bech32 / Bech32m encode-decode — [C] — 18/25**
- Scores: demand 3 · feasibility 5 · gap 2 · durability 4 · fit 4.
- Spec: **BIP-173 (Bech32)** / **BIP-350 (Bech32m)** — HRP + data part + 6-char polymod checksum (constant 1 vs 0x2bc830a3). Show HRP, witness version, and the checksum verdict.
- Differentiation / AI-resistance (3/5): deterministic, checksum-exact. Overlap: codec reused by #6.

**9. Gas fee calculator — rate-as-INPUT (gas units × gwei → ETH; × ETH price → fiat) — [S] — 18/25**
- Scores: demand 4 · feasibility 5 · gap 2 · durability 4 · fit 3.
- Spec: fee (ETH) = gas_used × gas_price_gwei × 10⁻⁹; fiat = fee × ETH_price. **Gas price AND ETH price are user inputs** (identical charter pattern to the sales-tax tool) — NO live gas oracle, NO live price. Presets for common gas limits (21000 transfer, ~65000 ERC-20) as editable convenience.
- Differentiation / AI-resistance (3/5): deterministic arithmetic; staleness-proof & private vs incumbents that fetch live gas. Loud note: "not a live estimate — you supply the current gas price." SEO: "ethereum gas fee calculator."
- Overlap: shares fixed-point/units logic with #1. Fit is 3 (finance-adjacent framing, but explicitly on-charter per brief).

**10. ENS namehash + labelhash calculator — [C] — 17/25**
- Scores: demand 3 · feasibility 4 · gap 3 · durability 4 · fit 3.
- Spec: **EIP-137** recursive namehash (reverse-label keccak accumulation), labelhash, and ERC-721 token-id. Build caveat: full **ENSIP-15 (UTS-46) name normalization** is a heavy dependency — MVP requires pre-normalized lowercase input and warns loudly, rather than shipping a half-correct normalizer.
- Differentiation / AI-resistance (3/5): keccak-hard, deterministic. Gap slightly better (fewer clean incumbents than the others). Overlap: reuses keccak core (#3).

**11. ABI encode / decode calldata — [C] — 19/25 (build-cost-gated)**
- Scores: demand 5 · feasibility 3 · gap 3 · durability 5 · fit 3.
- Spec: full Solidity ABI encoding (static + dynamic types, arrays, tuples, offsets) per the ABI spec; decode raw calldata given a signature/ABI; auto-selector-lookup optional. Highest demand + durability on the list, but **feasibility 3 = the gate**: needs a real ABI coder (viem/ethers/`micro-eth-signer`) and careful edge-case handling (dynamic tuples, nested arrays). Anchors the category's power-user credibility.
- Differentiation / AI-resistance (4/5): deterministic byte-exact, calldata is privacy-relevant, Solidity/security-researcher repeat-workflow. Build AFTER the cheap wins; ship decode-first, then encode.
- Overlap: consumes the selector generator (#4) and hex⇄bytes (#15).

### WATCHLIST / FOLD

- **12. Satoshi ⇄ BTC converter — [S] — 17/25** (demand 4 · feas 5 · gap 2 · dur 3 · fit 3). 1 BTC = 10⁸ sats, BigInt-exact. Most incumbents bundle live USD (excluded), so the pure sat⇄BTC slice is thin. **FOLD** as a "Bitcoin units" mode of the ETH unit converter (#1) → a broader "crypto unit converter" page, rather than a standalone thin page.
- **13. RLP encode / decode — [C] — 17/25** (demand 3 · feas 4 · gap 3 · dur 4 · fit 3). Recursive-length-prefix tx serialization; deterministic but niche and awkward to present (nested arrays). Build only if the ABI tool (#11) performs.
- **14. Merkle root calculator — [C] — 16/25** (demand 3 · feas 4 · gap 3 · dur 3 · fit 3). Two conventions — **OpenZeppelin sorted-pair keccak256** (airdrop allowlists) vs **Bitcoin double-SHA256** (block tx roots) — and getting that distinction right is the exactness angle. Watchlist; promote with allowlist-builder long-tail proof.
- **15. Hex ⇄ UTF-8 / bytes (calldata strings) — [S] — 16/25** (demand 3 · feas 5 · gap 2 · dur 3 · fit 3). Overlaps `/dev/` number-base-converter + Base64. **FOLD** as a mode inside the ABI/calldata tool (#11), not a standalone page (Etherscan's utf8converter framing).
- **16. Address / tx-hash format checker — [S] — 15/25** (demand 3 · feas 5 · gap 1 · dur 3 · fit 3). Thin length/regex check. **FOLD** into the EIP-55 validator (#2), which already validates addresses; tx-hash is a trivial 0x+64-hex check → an FAQ line at most.

**Count of standalone-page-worthy, deterministic, on-charter, differentiated tools (≥17, not folded): 11 (#1–#11) → clears ≥10 → standalone category.**

---

## DO-NOT-BUILD (charter + safety exclusions — with reasons)

- **Private-key / seed-phrase / mnemonic generation OR validation** — hard charter exclusion. No BIP39 generate/validate, no BIP32/BIP44 HD derivation, no keystore, no WIF handling. Even *validating* a mnemonic invites users to paste a live seed phrase into a web page — never build anything that solicits secret material. (Enables theft/loss; security-honesty rule.)
- **Vanity address generator** — key-derivation in disguise; same exclusion.
- **Any live/market data** — no price ticker, live gas oracle, exchange rate, market cap, TVL, or APY feed. Not client-side-feasible (CORS/data feed), rots instantly, advice-adjacent. (The Satoshi⇄BTC and gas tools ship *without* any live price — user-supplied only.)
- **Investment / finance tools** — no portfolio tracker, no mining/staking-return or profitability calculator, no trading, no "should I buy," no yield/APY calculator. Financial-advice-adjacent, prohibited.
- **Wallet balance / address "checker" that queries a chain** — needs a live blockchain data feed (CORS/RPC) → fails browser-feasibility and drifts into finance. The Bitcoin/EIP-55 validators are **format & checksum only.**
- **Transaction broadcaster / raw-tx signer** — requires a key and a live node; both excluded.

---

## Build-order recommendation

1. **Keccak core cluster (build the engine once, reuse 4×):** ship the **Keccak-256 hash generator (#3)** first — it's the shared dependency — then **EIP-55 checksum (#2)** and **4-byte selector (#4)** fall out cheaply. Three LEAD pages off one `js-sha3` dependency.
2. **BigInt fixed-point cluster:** **Ethereum unit converter (#1)** then **ERC-20 decimals (#5)** then **gas fee calculator (#9)** — one fixed-point core, three pages. #1 is the highest-demand page on the list. Fold Satoshi⇄BTC (#12) into #1.
3. **Bitcoin codec cluster:** **Base58/Base58Check (#7)** + **Bech32/Bech32m (#8)** codecs, then **Bitcoin address validator (#6)** on top of them.
4. **Heavier / later:** **ABI encode-decode (#11)** (flagship, build-cost-gated; decode first), then **ENS namehash (#10)**, then watchlist **RLP (#13)** / **Merkle root (#14)** if the category proves out.

Category shell: `/web3/` with H1 "Web3 & Blockchain Developer Tools," persistent "no keys / no funds / no live prices / not financial advice" banner, cross-links to `/dev/` (SHA-2 hash, base64, number-base, JWT) and `/time/` (unix timestamp). Run as an owner-directed ranked expansion — do not gate on the (structurally weak) competition-gap axis.

## Lane notes

- **ETH-units scan:** Etherscan, thirdweb, Alchemy, Tatum, eth-converter.com all client-side — enormous demand, gap weak; BigInt-exact-no-price is the wedge.
- **Keccak/EIP-55/selector scan:** dedicated tools everywhere (Loris Tools, WuTools `/blockchain/`, DevOven, EVMTools, emn178, 4byte.directory) — gap weak; exactness (Keccak-vs-NIST padding, canonical signature, distinct from `/dev/` SHA-2) is the wedge.
- **Bitcoin scan:** BitRef, IOTools, spark.money, base58.io, browserling, bech32converter — client-side and clean; format/checksum-only positioning keeps us on-charter.
- **ABI/calldata scan:** EVMTools, Ethernal, deth.net, Swiss-Knife, apoorvlathey — strong demand, but real build cost (ABI coder) → gate.
- **Durability check:** EVM is a multichain standard in 2026 (Arbitrum ~$13.8B, Base ~$11.2B, ~77% of L2 DeFi TVL; rollups primary scaling) → chain-agnostic, staleness-proof developer demand.
- **Charter check:** all live-price/key/finance candidates rejected in DO-NOT-BUILD; the one finance-adjacent tool (gas fee) is rate-as-input only.

## Sources

- https://etherscan.io/unitconverter
- https://thirdweb.com/tools/wei-converter
- https://www.alchemy.com/gwei-calculator
- https://eth-converter.com/
- https://eips.ethereum.org/EIPS/eip-55
- https://loris.tools/tools/checksum-address-converter
- https://wutools.com/blockchain/checksum-address-converter
- https://evmtools.dev/crypto/checksum-address
- https://www.4byte.directory/
- https://wutools.com/blockchain/solidity-function-selector
- https://info.etherscan.com/what-is-method-id/
- https://docs.soliditylang.org/en/v0.4.21/abi-spec.html
- https://emn178.github.io/online-tools/keccak_256.html
- https://toolsana.com/tools/sha3-keccak-hash-generator-verifier/
- https://github.com/ethereum/eth-hash
- https://evmtools.dev/crypto/token-unit-converter
- https://devtoolkit.sh/tools/token-unit-converter
- https://www.tokendecimals.com/
- https://loris.tools/tools/token-decimal-converter
- https://tryethernal.com/tools/calldata-decoder
- https://evmtools.dev/crypto/calldata-decoder
- https://adibas03.github.io/online-ethereum-abi-encoder-decoder/
- https://calldata-decoder.apoorv.xyz/
- https://ethtools.com/ethereum-name-service/ens-namehash-labelhash-node-generator
- https://docs.ens.domains/resolution/names/
- https://www.spark.money/tools/bech32-encoder
- https://learnmeabitcoin.com/technical/keys/bech32/
- https://www.base64.sh/bech32/
- https://bitref.com/address-validator/
- https://iotools.cloud/tool/bitcoin-address-validator/
- https://base58.io/base58-decoder
- https://www.browserling.com/tools/base58-encode
- https://anyonlinetool.com/tool/rlp-encoder
- https://ethereum.org/developers/docs/data-structures-and-encoding/rlp/
- https://zkblock.app/merkletree-generator
- https://etherscan.io/utf8converter
- https://www.spark.money/tools/hex-converter
- https://bitcointosatoshi.com/
- https://coincodex.com/convert/satoshi-sats/bitcoin/
- https://www.theblock.co/post/383329/2026-layer-2-outlook
- https://yellow.com/research/ethereum-l2-winners-dead-weight-2026
- https://vasilkoff.com/blog/20-evm-compatible-blockchains
