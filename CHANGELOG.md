# Changelog

All notable changes to TruthBeacon are documented here.

## 2026-11-20

### Check anything: links, ❝ CITE quotes and broadcasts

- DEPLOY panel **05 / CHECK A RECEIVED BROADCAST** now accepts every format TruthBeacon shares, not just the plain broadcast text: portable claim links (`#c=…`, including `?embed=1#c=…` embed links and links pasted inside other text), **❝ CITE** Markdown quotes (the escaping is undone so the exact claim text is checked), plain broadcasts (LF or CRLF), or plain text plus a SHA-256. Before today, CITE quotes and links could not be checked here.
- Cross-check: if the paste has both a link and visible text (a CITE quote, or a broadcast followed by its link), both are fingerprint-checked **and** compared with each other. A quote that was edited while the original link was left intact now shows as MISMATCH instead of passing. A SHA-256 typed in the second field overrides the one in the paste, and a note appears if it differs from the one stored in the link.
- Clearer results: a headline verdict (✓ MATCH, ✕ MISMATCH, ○ NO FINGERPRINT, ! CANNOT CHECK) then one line per check, with a colored border (green, red or gold) and the same words in text, so the result does not rely on color. It is still announced by the existing `aria-live` status region. Damaged links and malformed hashes get a specific message. **Ctrl/⌘ + Enter** in the paste box and **Enter** in the hash field run the check.
- Read-only and local: nothing is uploaded or written to storage. `truthbeacon:v1:claims` shape unchanged. Service worker cache bumped to `truthbeacon-v1-2026-11-20-verify-anything`.
- Known limit: CITE removes trailing spaces at the ends of lines, so a claim whose lines ended in spaces shows MISMATCH from its quote alone. Its `#c=` link still checks correctly.
- Validation: JS syntax check, manifest JSON check, local `python3 -m http.server` load check, plus Node tests (link only: match, wrong hash, no hash; damaged link; CITE round trip with the app's real `citeMarkdown` incl. Markdown characters, headings/lists, backslashes and Unicode; edited CITE quote with an intact link; broadcast with a link, LF and CRLF; plain text with an upper-case hash; malformed hash; empty input; typed hash overriding the link hash; text that differs from its link; `?embed=1#c=` links). Not yet checked in a real browser.

## 2026-11-19

### JSON Feed 1.1 open-data export

- DEPLOY panel **02 / RSS + OPEN DATA** has a new **Download JSON Feed** button. It saves `truthbeacon-feed.json`, a standard [JSON Feed 1.1](https://jsonfeed.org/version/1.1) that feed readers, static-site tools and scripts can use without parsing XML.
- Same entries as RSS: non-demo CERTAIN claims, newest first. Each item has a stable `urn:truthbeacon:claim:<id>` id, the claim text plus "local label, not independent verification" note, a portable `#c=` link (opens and fingerprint-checks the claim on any device, unlike the device-local `#claim=` link), created/updated dates, tags, the first http/https source as `external_url`, and a `_truthbeacon` extension with status, SHA-256, round count and http/https sources (up to 10).
- Privacy: private review notes are not included, and non-http(s) sources such as `javascript:` are dropped. If there are no non-demo CERTAIN claims, a toast explains this and nothing is downloaded.
- Read-only: nothing is written to storage. `truthbeacon:v1:claims` shape unchanged. Service worker cache bumped to `truthbeacon-v1-2026-11-19-json-feed`.
- Validation: JS syntax check, manifest JSON check, local `python3 -m http.server` load check, plus Node tests (feed version and home URL, CERTAIN-only and demo exclusion, newest-first order, notes and unsafe sources excluded, `external_url` and tags, whitespace-collapsed titles, portable link round trip with Unicode, empty feed). Not yet checked in a real browser.

## 2026-11-18

### ❝ CITE: Markdown claim citations

- Every claim card has a new **❝ CITE** button. It copies a ready-to-paste Markdown citation for forums, GitHub issues, Reddit, wikis and notes: the claim text as a quote block, its status (marked as a local confidence label, not independent verification), the round count, the full SHA-256, http/https sources (up to 10), tags, and a portable `#c=` link to **open, fingerprint-check and optionally save** the claim.
- Safe to paste: Markdown characters in the claim (`*`, `_`, `[`, `]`, `<`, `>`, backticks, `|`, `~`, and heading/list markers at the start of a line) are escaped, so a claim can't add links, HTML or formatting it didn't have. Non-http(s) sources such as `javascript:` are dropped. Spaces and parentheses in links are percent-encoded so they don't break.
- If the clipboard is blocked, the existing copy dialog opens instead. DEMO claims ask for confirmation first.
- Read-only: nothing is written to storage and the broadcast count is not changed. `truthbeacon:v1:claims` shape unchanged. Service worker cache bumped to `truthbeacon-v1-2026-11-18-cite`.
- Validation: JS syntax check plus Node tests (Markdown escaping incl. heading/list markers and HTML, unsafe source dropped, URL encoding of spaces/angle brackets/parentheses, singular/plural rounds, optional sources/tags, CRLF handling, Unicode kept). Not yet checked in a real browser.

## 2026-11-17

### Send to beacon: share target + bookmarklet

- **Share menu capture:** the web app manifest now declares a `share_target`. Once TruthBeacon is installed as an app (Android, ChromeOS and other browsers that support Web Share Target), it shows up in the device Share menu. Sharing text or a link from another app opens the console with the claim form filled in.
- **Bookmarklet:** new DEPLOY panel **06 / SEND TO BEACON** with a draggable **⇪ Send to TruthBeacon** bookmarklet and a **Copy bookmarklet** button. Select text on any page, click the bookmark, and the selected text plus the page address open in the claim form.
- How it works: links like `?text=…&url=…&title=…` (or `?share-target=1&…`) fill the claim text (max 2,000 characters) and add the link to Sources. Only http/https links are accepted. If the shared text contains a link and no separate URL was sent, the link is moved to Sources. If there is no text, the title is used. If you are already typing a different claim, you are asked before it is replaced. The query is then removed from the address bar.
- Nothing is saved until you press **Submit**. `truthbeacon:v1:claims` shape unchanged. Embed/RSS modes are unaffected. Service worker cache bumped to `truthbeacon-v1-2026-11-17-share-target`.
- Validation: JS syntax check plus Node tests (no-op without parameters, URL moved out of text, unsafe `javascript:` URL rejected, title fallback, 2,000-character cap, empty share, bookmarklet output round trip). Not yet checked in a real browser or on an installed Android app.

## 2026-11-16

### PNG share cards

- Every claim card has a new **▣ CARD** button. It draws a 1200×630 PNG share card on your device (status badge, the claim text wrapped and cut with … if long, a short SHA-256, the round count, a "not independent verification" note, and the beacon's address) and saves it as `truthbeacon-claim-<first 12 hash chars>.png`. Post it anywhere images travel: social feeds, chats, slides.
- On touch devices that support sharing files, the card goes to the device share sheet with the claim's portable link; elsewhere it downloads. DEMO claims ask for confirmation first. Uses only the built-in canvas, no external fonts, services or tracking.
- Read-only: nothing is written to storage and the broadcast count is not changed. `truthbeacon:v1:claims` shape unchanged. Service worker cache bumped to `truthbeacon-v1-2026-11-16-share-card`.
- Validation: JS syntax check plus Node tests (text wrapping incl. long words, Unicode, line limit with ellipsis; full card drawing against a stub canvas). Not yet checked in a real browser (headless Chrome on the build box hangs).

## 2026-11-13

### Portable claim embeds

- Every claim card has a new **⧉ EMBED** button. It copies an iframe (`?embed=1#c=…`) that shows that one claim on any website. The claim travels inside the link, so every visitor sees the same claim, not whatever is in their own browser's ledger. (The existing site-wide `?embed=1` beacon still reads the visitor's own local ledger.)
- The **Claim Beacon** shows the sender's local label, the text (cut to 240 characters), and a fingerprint check run on the visitor's device: FINGERPRINT MATCH, MISMATCH, or none supplied. It also has free TruthBeacon attribution, **Open + check ↗** (opens the normal Received claim dialog), and **Copy embed** so other people can embed it again.
- Embed mode no longer opens the Received claim dialog inside an iframe. Damaged embed links show a safe notice. DEMO claims ask for confirmation before you copy an embed.
- Read-only: nothing is written to storage. `truthbeacon:v1:claims` shape unchanged. Service worker cache bumped to `truthbeacon-v1-2026-11-13-claim-embed`.
- Validation: JS syntax check plus Node tests (embed URL round trip with Unicode, HTML escaping in the iframe code, mode/fragment layout). Not yet checked in a real browser.

## 2026-11-12

### Open-data CSV export

- DEPLOY panel **02 / RSS + OPEN DATA** has a new **Download CSV** button. It saves `truthbeacon-claims.csv` with every non-demo claim (all statuses, newest first): id, status, text, sha256, rounds, tags, sources, createdAt, updatedAt, broadcasts and a portable `#c=` link. It opens straight in spreadsheets and open-data tools.
- Private review notes and history are left out. Demo claims are excluded, the same as RSS. Shows a toast and saves nothing when there are no non-demo claims.
- Built for spreadsheets: UTF-8 with BOM, CRLF line endings, RFC 4180 quoting. Any cell that starts with `=`, `+`, `-`, `@`, a tab or a carriage return gets a leading `'` so spreadsheets cannot run it as a formula. This means such a cell no longer matches the claim's SHA-256 exactly; use JSON export or the fingerprint check when you need exact text.
- Read-only: nothing is written to storage. `truthbeacon:v1:claims` shape unchanged. Service worker cache bumped to `truthbeacon-v1-2026-11-12-csv`.
- Validation: JS syntax check plus Node tests of the CSV output (quoting, embedded quotes/newlines, formula guard, demo exclusion, ordering, Unicode).

## 2026-11-11

### Portable claim links

- **Share** on a claim now uses a portable link (`#c=…`) that carries the claim itself: text, SHA-256, sender's label, up to 10 sources and tags, as base64url UTF-8 JSON in the URL fragment. Recipients no longer need the same local ledger for the link to work. Fragments are never sent to the web server.
- Opening a `#c=` link shows a **Received claim** dialog: re-hashes the text on-device and shows FINGERPRINT MATCH / MISMATCH, the sender's label, sources (http/https only, escaped) and tags, and notes if the text is already in your ledger.
- **Save to my ledger as UNRESOLVED** adds it (deduped by hash) with a `received` tag, a note recording the sender's label and fingerprint result, and a `received-link` history entry. The sender's label is never adopted. Nothing is saved unless you press the button.
- Old `#claim=<id>` deep-links still resolve. `truthbeacon:v1:claims` shape unchanged (new records use existing fields). Malformed or oversized links (over 2,000 characters of text) are rejected with a toast.
- Service worker cache bumped to `truthbeacon-v1-2026-11-11-portable`.
- Validation: JS syntax check plus Node tests of encode/decode (Unicode round trip, URL-safe alphabet, bad status, damaged/wrong-version/oversized links). A full 2,000-character non-ASCII claim makes a fragment of about 5,500 characters, so very long claims may be cut off by some chat apps.

## 2026-11-10

### Check a received broadcast

- DEPLOY panel **05 / CHECK A RECEIVED BROADCAST**: paste a TruthBeacon broadcast (or claim text plus a SHA-256) and press **Check fingerprint**. The app strips the status prefix, reads the `SHA-256:` line, re-hashes the text on-device and reports MATCH or MISMATCH (with the computed hash).
- If the exact text is already in the local ledger, the result also shows its local status.
- Without a hash, it shows the computed fingerprint so you can compare by hand. Handles Windows line endings and upper-case hashes.
- Read-only: nothing is written to storage. `truthbeacon:v1:claims` shape unchanged. Service worker cache bumped to `truthbeacon-v1-2026-11-10-check`.
- Validation: JS syntax check plus Node tests of broadcast parsing (round trip, edited text mismatch, separate hash field, CRLF).

## 2026-11-09

### JSON import / merge restore

- DEPLOY panel now has **↑ Import JSON** next to Export JSON. Pick a `truthbeacon-claims.json` backup (a plain claim array or `{ "claims": [...] }`).
- Merge, never replace: new ids are added; for an id that already exists, the copy with the newer `updatedAt` wins (history entries combined); older or identical copies are left alone. No local claims are deleted.
- Shows a confirm prompt with counts (new / newer / unchanged) before writing, saves the current ledger to `truthbeacon:v1:preImportBackup` first, and reports the result inline. Malformed files change nothing. Disabled when storage is read-only.
- Imported records go through the same `normalize()` migration as stored data, so older backups (`verified`/`disputed` statuses, `broadcastCount`) upgrade safely. Existing hashes are preserved; run the fingerprint check after importing.
- Service worker cache bumped to `truthbeacon-v1-2026-11-09-import`. `truthbeacon:v1:claims` shape unchanged.
- Validation: JS syntax check plus Node tests of the merge (add, newer-wins, older-kept, wrapped object, invalid file).

## 2026-11-06 (evening, America/New_York)

### MONSTRUM console rewrite + local swarm + deployment hub

- Replaced the cyan card-style TruthBeacon interface found on disk with a near-black, monospace MONSTRUM console: CONSOLE / SWARM / DEPLOY tabs, status metrics, dense ledger and persistent node bar. No Base44 screenshots were available; implemented the supplied interface/behavior specification, not a pixel-perfect screenshot reconstruction.
- CONSOLE: character-counted claim submission, SHA-256 fingerprinting (Web Crypto plus equivalent pure-JS fallback), UNRESOLVED defaults, review/status dialog, evidence URLs, reason/history log, search/filter and three labeled demos on a fresh ledger.
- SWARM: explicit local/simulated attestation rounds, per-claim reasons, confirmed batch rounds, PROBABLE at 2 / CERTAIN at 4. No AI, peers or independent verification are represented as real.
- DEPLOY: restyled Grid Beacon (`?embed=1` / `#embed`) with free attribution, iframe preview/copy, RSS/open-data (`?rss=1` / `#rss`), RSS XML download, app share, JSON backup and fingerprint checks. Demo data is excluded from RSS and embed signals.
- Preserved `truthbeacon:v1:claims`; mapped old statuses without discarding claims/notes, added missing fields and a one-time raw pre-migration backup. Parse failures disable writes rather than wiping user data.
- Broadcast includes text, local-confidence disclaimer, sources and hash. Kept Web Share / clipboard deep-links with explicit local-data limitations; added manual-copy fallback. No automatic publishing or external services.
- Updated manifest and angular icon. Bumped offline cache to `truthbeacon-v1-2026-11-06-monstrum`, with scoped cache cleanup and offline query-mode navigation support.
- Added accessible keyboard tabs, responsive layouts, source-link protocol validation and HTML/XML escaping. Updated README with storage, deployment and truth-label limitations.
- Existing automatic improvement routine is external to these files and was not altered by this pass.
- Validation: 58 mocked behavior/SHA-256/storage/service-worker assertions passed, plus JS syntax and manifest/SVG/generated-RSS parsing. Real-browser visual/device checks remain outstanding.

## 2026-11-06

### Open-data RSS of verified claims

- Header control **RSS / open data** builds a valid RSS 2.0 XML document from claims with `status === 'verified'` (newest `updatedAt` first): title (truncated), deep-link, guid, RFC-822 `pubDate`, description (notes + sources), and category tags.
- Dialog offers **Copy RSS** + **Download XML** (`truthbeacon-verified.xml`), matching the Export JSON / embed-dialog pattern.
- Open-data endpoint view via `?rss=1` or `#rss`: minimal page with readable `<pre>` plus Copy / Download (static hosts cannot set RSS Content-Type; documented inline).
- Service worker `CACHE_VERSION` bumped to `truthbeacon-v1-2026-11-06`. localStorage claim shapes unchanged.

## 2026-11-05

### Scaffold

- Created standalone static PWA under `/workspace/artifacts/`: `index.html`, `manifest.json`, `sw.js`, `icon.svg`, `README.md`, `CHANGELOG.md`.
- Claims CRUD in `localStorage` (`truthbeacon:v1:`): id, text, status, tags, createdAt, updatedAt, sources, notes.
- Verification workflow (mark verifying / verified / disputed with reason).
- Broadcast via Web Share API with clipboard deep-link fallback (`#claim=<id>`).
- Dark, accessible, mobile-friendly UI; PWA hooks (manifest, theme-color, Apple meta); versioned offline app-shell cache.
- Seeded 1–2 clearly labeled `[DEMO]` claims plus **Clear demo data**.
- Optional polish: JSON export, keyboard shortcuts (`N`, `/`), broadcast count + last-broadcast stamp.

### First improvement — Embeddable Grid Beacon widget

- Embed mode via `?embed=1` or `#embed`: compact strip showing the latest **verified** claim teaser, “Powered by TruthBeacon — free local truth beacon”, **Open**, and **Copy embed** (iframe snippet pointing at this page with `embed=1`).
- Main UI **Get embed code** control opens a dialog with the same iframe snippet for self-advertising / embedding in the wider web grid.
