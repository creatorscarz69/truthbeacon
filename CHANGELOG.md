# Changelog

All notable changes to TruthBeacon are documented here.

## 2026-11-26

### Portable beacon board: embed your latest CERTAIN claims anywhere

- DEPLOY panel **01 / GRID EMBED** has a new **PORTABLE BOARD / LATEST CERTAIN CLAIMS INSIDE THE LINK** snippet with **Copy portable board** and **Open board ↗**. The existing `?embed=1` Grid Beacon reads the *viewer's* browser storage, so visitors on another site see "Awaiting your first CERTAIN claim". The board carries your latest non-demo CERTAIN claims (up to 3, newest first) inside the iframe link (`?embed=1#b=…`), so every visitor on any site sees the same claims.
- The board shows each claim's label and text (first 240 characters), then checks each fingerprint in the visitor's browser: **FINGERPRINT MATCH #…** in green or **FINGERPRINT MISMATCH** in red for each claim, plus a summary line that screen readers announce ("3 of 3 fingerprint(s) match…" or "1 of 3 claim(s) do NOT match…"). Each claim has **Open + check ↗**, a portable `#c=` link that opens the Received claim dialog so the visitor can save it as UNRESOLVED. The board also shows the date the snapshot was made, says the labels are the sender's local labels and not independent verification, and has a **Copy embed** button so it can be passed on.
- The board includes each claim's text, SHA-256, label, sources and tags, but never review notes. DEMO, PROBABLE and UNRESOLVED claims are left out. If the claims would make the link longer than 12,000 characters, the older ones are dropped. The iframe height fits the number of claims. With no CERTAIN claims, the snippet is empty, Open board is hidden, and Copy explains why. Damaged, wrong-version, empty, over-long or over-3-claim board links show "damaged or incomplete" and nothing else. It is a snapshot: copy it again after you add CERTAIN claims.
- No storage changes: `truthbeacon:v1:claims`, `truthbeacon:v1:follows` and `truthbeacon:v1:preImportBackup` are unchanged. The board stores nothing in the visitor's browser. No server, no tracking, no background polling. Internal: the claim-link check is now shared by single-claim links and board links (same rules). Service worker cache bumped to `truthbeacon-v1-2026-11-26-portable-board`.
- Validation: JS syntax check, manifest JSON check, local `python3 -m http.server` load check (200 for the app, shell files, `?embed=1` and `?embed=1#b=…`), plus jsdom tests of the real page: the snippet holds the 3 newest non-demo CERTAIN claims with no notes and a height that fits; Copy portable board copies it; claims storage untouched; opened in a fresh browser with empty storage, the board shows 3 claims, all MATCH, with Unicode and HTML escaped, valid per-claim `#c=` links and a working Copy embed, and stores nothing; an "Open + check" link opens the Received claim dialog with MATCH; an edited claim shows MISMATCH and the summary warns; damaged, wrong-version, empty, over-3, blank-text and over-long links are rejected; three 2,000-character claims stay under the length cap; with no CERTAIN claims nothing is copied. Single-claim `#c=` embeds, the local `?embed=1` Grid Beacon, and the earlier follows and OPML tests still pass. Not yet checked in a real browser.

## 2026-11-25

### Share your grid: followed beacons as OPML

- DEPLOY panel **02 / RSS + OPEN DATA** can now export and import the followed-beacons list as **OPML 2.0**, the subscription-list format feed readers use. Beacons can hand each other their whole list of followed feeds in one file instead of one `?follow=` link at a time.
- **↓ Export list (OPML)** (next to **Check all** under FOLLOWED BEACONS) downloads `truthbeacon-follows.opml` with one `<outline type="rss">` per followed beacon: its label and feed address only. Check times and new-item counts stay on this device. Labels and addresses are XML-escaped. With an empty list, a toast explains this and nothing is downloaded.
- **↑ Import followed list (OPML)** (always shown, below the feed field) reads an OPML file from another beacon or a feed reader, including nested folders. The same address rules as Fetch + review apply: only https:// (or http://localhost) feed addresses are kept; fragments are dropped; `javascript:`, plain http, embedded credentials and over-long addresses are skipped and counted. Feeds you already follow are skipped, and the 50-beacon limit is kept. You see the counts ("N new, N already followed, N skipped") and confirm first. Imported beacons appear as "Last checked: never". **Nothing is fetched and no claims change** until you press Check for new or Check all. Files over 1 MB or that are not OPML are rejected and nothing changes. Results appear in the existing status line, which screen readers announce; both buttons have descriptions.
- Fix: a followed beacon saved with no new-item count (`lastNewCount: null`) was read back as 0 ("0 new at last check"). It now stays empty.
- `truthbeacon:v1:follows` shape unchanged (imported entries use the same `{url,label,addedAt,lastCheckedAt,lastNewCount}` fields, with `lastCheckedAt` and `lastNewCount` set to null). `truthbeacon:v1:claims` unchanged. No server, no tracking, no background polling. Service worker cache bumped to `truthbeacon-v1-2026-11-25-opml-grid`.
- Validation: JS syntax check, manifest JSON check, local `python3 -m http.server` load check (200 for the app, shell files and a `?follow=` link), Node tests of the OPML logic taken from the real file (export escaping of `&`, `<`, quotes and apostrophes; date; empty list; merge dedupe incl. fragments; unsafe addresses skipped; entry shape; null new-item count kept as null), plus jsdom tests of the real page (export is well-formed OPML that parses back with the original labels and leaves out check times; re-importing your own export adds nothing; canceled import changes nothing; mixed list with nested folders, duplicates, `javascript:`, http and credential addresses adds only the safe new feeds and fetches nothing; HTML, malformed, empty, JSON and over-1 MB files rejected; 50-beacon cap reported; empty list downloads nothing), and the earlier follows tests still pass. Not yet checked in a real browser.

## 2026-11-24

### Followed beacons list

- DEPLOY panel **02 / RSS + OPEN DATA** now remembers the beacons you follow. When **Fetch + review** reads a feed successfully and you confirm the import (or it has nothing new), its address is saved under **FOLLOWED BEACONS**, below the FOLLOW ANOTHER BEACON field, with the feed's title, its address, when it was last checked and how many new items that check found.
- Each followed beacon has **Check for new** and **Unfollow**. **Check all** checks every followed feed one after another. Every check uses the same fetch, fingerprint check, dedupe, confirmation and pre-import backup as Fetch + review, so nothing is imported until you confirm. Progress and a final summary ("Checked N followed beacon(s): … read, … could not be read, … new claim(s) found") appear in the existing status line, which screen readers announce. Buttons are disabled while a check runs and have labels that name the beacon (e.g. "Check Alpha Beacon for new claims").
- If you cancel the confirmation, a feed you do not follow yet is not added. A feed you already follow just gets its check time and new-item count updated. Unfollow asks first and keeps every claim already imported.
- Stored only on this device in the new key `truthbeacon:v1:follows` (array of `{url,label,addedAt,lastCheckedAt,lastNewCount}`, up to 50, no duplicates). A missing or malformed value counts as an empty list and is not overwritten until you follow a feed. The same address rules as Fetch + review apply (https://, or http://localhost); fragments and addresses with embedded credentials are not stored. Nothing is checked in the background: there is no polling, no tracking and no server.
- `truthbeacon:v1:claims` shape unchanged. Service worker cache bumped to `truthbeacon-v1-2026-11-24-followed-beacons`.
- Validation: JS syntax check, manifest JSON check, local `python3 -m http.server` load check (200 for the app and all shell files), Node tests of the follows logic taken from the real file (parse/normalize of missing, malformed and junk entries; dedupe incl. fragments; 50-entry cap; label cleanup and 120-char cap; add then update keeps `addedAt`; remove; URL rules: https and localhost allowed; http, `javascript:`, `data:`, `file:`, credentials and over-long addresses rejected; no polling), plus jsdom tests of the real page with fake fetch and confirm (malformed key ignored; confirmed import followed and listed with accessible labels; Check for new adds no duplicates; canceled import not followed; Check all runs in order and reports failures; Unfollow keeps claims). Not yet checked in a real browser.

## 2026-11-23

### Follow another beacon (JSON Feed import)

- DEPLOY panel **02 / RSS + OPEN DATA** has a new **FOLLOW ANOTHER BEACON / JSON FEED URL** field with **Fetch + review**. Paste the address of a published `truthbeacon-feed.json` (or any JSON Feed 1.1) and its items come into your ledger as **UNRESOLVED** claims, tagged `from-feed`, so you review them yourself. Beacons can now pick up each other's published claims: a first step from single beacons to a grid.
- **↑ Import JSON** now also accepts a JSON Feed file, not just a TruthBeacon backup.
- **Follow links:** `?follow=https://…/truthbeacon-feed.json` opens DEPLOY with the feed address filled in. Nothing is fetched until you press **Fetch + review**. The parameter is then removed from the address bar.
- Every fingerprint is checked on this device first. Items whose text does not match their SHA-256 (or whose portable link and feed hash disagree) are skipped and counted. Items already in your ledger (same fingerprint) are skipped. Items with no fingerprint are imported and their notes say so. You see the counts and confirm before anything is saved. The current ledger is copied to `truthbeacon:v1:preImportBackup` first, and no local claims are deleted.
- The other beacon's label is written in each claim's notes and history (`imported-feed`), never adopted. Only http/https sources are kept (up to 10). At most 500 items and 2 MB per feed. Fetches send no cookies and no referrer; only https:// addresses (and http://localhost) are allowed. The feed host must allow cross-origin reads (GitHub Pages does); otherwise download the file and use ↑ Import JSON.
- `truthbeacon:v1:claims` shape unchanged (new claims use the existing fields). Service worker cache bumped to `truthbeacon-v1-2026-11-23-follow-feed`.
- Validation: JS syntax check, manifest JSON check, local `python3 -m http.server` load check, plus Node tests using the app's real `jsonFeed` output (round trip incl. Unicode and Markdown characters; UNRESOLVED, round 0 and `from-feed` tag; sender label in notes; private notes, `javascript:` sources and demos not carried; dedupe against the ledger; edited text skipped; link vs feed hash disagreement skipped; content-text fallback without a link; generic feed without hashes; unreadable and over-long items skipped; URL scheme rules). Not yet checked in a real browser.

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
