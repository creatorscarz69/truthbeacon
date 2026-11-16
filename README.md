# MONSTRUM / TruthBeacon

A free, static, local-first claim ledger with a dark console interface. No accounts, backend, analytics, paid APIs, external fonts or dependencies.

## Run

```sh
python3 -m http.server 8080 --directory /workspace/artifacts
```

Open `http://localhost:8080/`. Opening `index.html` directly also works for the local ledger, but HTTP localhost / HTTPS is recommended for clipboard, Web Share and service workers. Storage belongs to the exact browser + origin (scheme/hostname/port). Changing the port does not migrate the browser's data.

## Workspace

- **CONSOLE**: submit up to 2,000 characters, optional source URLs and tags. SHA-256 fingerprints the exact trimmed submitted text. New claims are **UNRESOLVED**, round 0. Search/filter the ledger, review status, preserve notes, record source URLs, share, export JSON, or clear only demos.
- **SWARM**: local attestations only, not a real peer network or an AI verifier. A round increments the local round counter; 2 rounds can promote UNRESOLVED to **PROBABLE**, 4 to **CERTAIN**. Per-claim optional reasons and batch-round confirmations log events in each claim's `history`. Review may assign any label independently. Repetition and cryptographic hashing do not establish truth; CERTAIN is a local confidence label, never independent verification.
- **DEPLOY**: copy an iframe, preview the Grid Beacon, open RSS/open data, copy/download RSS XML, share the app, export or import/merge JSON, check SHA-256 fingerprint integrity, install the offline PWA when supported.
- Bottom node bar shows connection state, local status counts and last claim-share time in America/New_York. “Online” describes the browser connection, not a server or actual peer network.

Three `[DEMO]` entries illustrate statuses on a fresh ledger with distinct ages, hashes and round counts. Demos are omitted from the public embed teaser and RSS. They remain in full JSON backups until cleared. Previously cleared demos are not re-seeded.

Keyboard: Arrow Left/Right, Home/End navigate tabs; `N` focuses claim input; `/` focuses search. Standard Tab and visible focus rings work throughout.

## Grid / RSS / broadcasting

- `?embed=1` or `#embed`: compact Grid Beacon, latest non-demo CERTAIN claim, MONSTRUM / TruthBeacon free attribution, Open and Copy embed.
- `?embed=1#c=…`: portable **Claim Beacon** for one claim (copy it with **⧉ EMBED** on any claim card). The claim is carried in the link, so every visitor sees the same claim, with an on-device fingerprint check. The label shown is the sender's local label, not independent verification.
- `?rss=1` or `#rss`: minimal RSS/open-data generator; Copy RSS / Download XML produces RSS 2.0 for non-demo CERTAIN entries, with notes, sources, tags, hashes, dates and deep-links. Static hosting serves HTML here, **not** an RSS Content-Type endpoint. Publish the downloaded XML separately if you need a feed-reader URL; it is a snapshot, not automatically updated.
- Claim Share uses Web Share when supported; otherwise copies text, confidence disclaimer, sources, fingerprint and `#claim=<id>` deep-link. Clipboard refusal opens a manual-copy dialog. A canceled device share does not count as a broadcast. Broadcast count means a successful handoff/copy, not delivery or views.
- Claim shares use a **portable link** (`#c=…`) that carries the claim text, fingerprint, label, sources and tags inside the URL fragment, so it works on any device. The recipient sees a Received claim dialog with an on-device fingerprint check and can choose **Save to my ledger as UNRESOLVED**; the sender's label is shown but never adopted. Older `#claim=<id>` links still only resolve in a browser that already has that claim. App-share/copy-URL controls do not publish data.
- Embeds read storage in the viewer's browser. Cross-site storage may be partitioned or blocked, so public visitors do not see your browser's ledger. A public static host makes the shell reachable, but does not publish/sync local data. No public live synchronization is claimed.

## Storage / migration / backup

The original `truthbeacon:v1:claims` key is retained. Status migration: `verified` → `certain`, `disputed` → `probable`, `unverified` / `verifying` → `unresolved`. Original text, notes, sources and extra fields are retained. Missing hashes, round counts and canonical `broadcasts` (from `broadcastCount` where present), timestamps and arrays are filled. New records include `id`, `text`, `status`, `hash`, `hashAlgorithm`, `rounds`, `tags`, `createdAt`, `updatedAt`, `sources`, `notes`, `broadcasts`, `lastBroadcastAt`, `demo` and review `history`.

Before changing a valid existing stored ledger, its raw JSON is retained once in `truthbeacon:v1:preMonstrumBackup`. Malformed stored data is not overwritten; writes are disabled with a visible error. If storage is blocked or full, changes are not silently accepted. Export JSON regularly; browser data can be deleted or evicted. Restore with **↑ Import JSON** in DEPLOY: it merges a backup into the current ledger (new ids added, newer `updatedAt` wins on matching ids, nothing deleted), asks for confirmation with counts, and first saves the current ledger to `truthbeacon:v1:preImportBackup`. Multiple tabs refresh via storage events, but simultaneous edits are not transactionally merged.

SHA-256 uses Web Crypto when available and an equivalent UTF-8 pure-JavaScript SHA-256 fallback otherwise. The fingerprint check detects text/hash mismatches, not whether a claim is true. Existing fingerprints are preserved, never silently rewritten.

`sw.js` caches the shell for offline use; navigations use network-first with an offline shell fallback, including query modes. Service workers require localhost or HTTPS. The current cache is `truthbeacon-v1-2026-11-12-csv`; activation only clears older TruthBeacon caches. Refresh once online to pick up an update.

## Scope

All changes are static files. Nothing is published or sent automatically. This application cannot schedule background improvement work itself; an existing assistant routine, if configured, is managed outside these files. No routine configuration is changed by this rewrite.

## Validation (2026-11-06 evening, America/New_York)

JavaScript syntax checks passed. Manifest JSON and icon SVG parse successfully. A temporary Node VM / DOM-mock regression harness passed 58 assertions covering hashes (including Unicode and crypto fallback), submission, migration/no-data-loss guards, status rounds, review notes, demo removal, clipboard share accounting, embed/RSS modes, keyboard tab handling and service-worker offline routing/cache scope. Generated RSS also parsed as XML. No real-browser visual, install, Web Share or cross-site iframe-storage testing was performed; device/browser behavior still needs a smoke test.

## Checking a broadcast you received

Open **DEPLOY → 05 / CHECK A RECEIVED BROADCAST**, paste the shared message (or the claim text and its SHA-256), and press **Check fingerprint**. A MATCH means the text has not been edited since it was fingerprinted; it does not prove the claim is true or who wrote it. The check runs locally and stores nothing.

## Open-data CSV

**DEPLOY → 02 / RSS + OPEN DATA → Download CSV** saves non-demo claims (all statuses) as `truthbeacon-claims.csv` for spreadsheets and open-data portals. Columns: id, status, text, sha256, rounds, tags, sources, createdAt, updatedAt, broadcasts, link (a portable `#c=` link). Review notes and history are not included. If a cell starts with `=`, `+`, `-` or `@`, it gets a leading `'` so a spreadsheet won't run it as a formula. Use Export JSON for a full, exact backup.

## Share cards (PNG)

Press **▣ CARD** on any claim to save a 1200×630 image of it (status, text, short SHA-256, rounds and the beacon address), made on your device. On phones that can share files it opens the share sheet instead. Nothing is uploaded or stored.
