# BLURT Plugin client snapshot

Frozen copy of the client-side files from `https://blurtplugin.online/account/` pulled on **2026-05-27**. Imported here as the seed of the MELEK-targeted port per the "Signup architecture" section of `../CLAUDE.md`.

Located at `third_party/` (not `vendor/`) because the wallet's `.gitignore` excludes `vendor/*` for webpack output.

**This directory is not wired into the wallet's routing yet.** It is a staging area. The next steps (separate commits, ordered) are:

1. Rebrand visible strings + assets to MELEK
2. Identify and parameterize chain config inside the client JS (chain endpoints, chain_id, address_prefix)
3. Replace or proxy the server-side `creator.php` POST target (see "Server-side gap" below)
4. Wire the rebranded directory into the wallet's Koa server at the same URL path the plugin uses (`/account/...`) so it works as a transparent rehost

## What's here

| File | Purpose |
|---|---|
| `index.html` | The single page that hosts the signup form |
| `js/script.js` | The plugin's own signup logic — 1364 lines, unminified, readable |
| `js/lang.js` | i18n translation table |
| `js/blurt.min.js` | A webpack bundle of the `blurtjs` library; the plugin treats this as a vendor lib via `window.blurt = {api, auth, memo, broadcast, config, formatter, utils}` |
| `js/bs58.bundle.js` | Base58 encoding helper |
| `js/qrcode.min.js` | QR code rendering |
| `css/style.css` | Plugin styles |
| `img/favicon.png` | Plugin favicon |

External vendor scripts referenced by `index.html` but NOT mirrored (loaded from CDN at runtime):

- `https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css`
- `https://cdn.jsdelivr.net/npm/crypto-js@4.1.1/crypto-js.min.js`
- `https://unpkg.com/dsteem@^0.10.1/dist/dsteem.js`
- `https://www.googletagmanager.com/gtag/js?id=G-F6KHJM5QPR` (Google Analytics — must be removed before serving)
- `https://www.hCaptcha.com/1/api.js` (hCaptcha, present but the corresponding `<div>` is commented out in the current deploy)

## Server-side gap

`script.js:1180` POSTs the user's form (encrypted keys, fingerprint, voucher, etc.) to `creator.php`. That PHP backend holds the funded creator account's signing key and broadcasts `account_create_with_delegation`. **We do not have the source of `creator.php`** — only the client-visible POST body shape and JSON response shape (`{success, txid, error}`).

The port will need a MELEK-targeted replacement for `creator.php`. Options:
- Build a small Node service that lives behind `api.melek.salon` (see ecosystem memory map) and holds the MELEK creator signing key as an env var
- Build a serverless function (Cloudflare Worker, etc.) with the same single POST endpoint
- Add a `/account/_creator` route inside the wallet's existing Koa server (smaller scope; mixes signup with wallet — debatable)

Whichever option, the route must:
- Refuse to broadcast if MELEK chain config is unset (fail-closed; never fall back to BLURT chain)
- Validate anti-abuse fingerprint signals the client sends
- Validate optional voucher codes (the client supports vouchers; `window.prefilledVoucher` is set near the top of `index.html`)

## Rebrand inventory (handy for the next pass)

- **`index.html`** — `<title>BLURT Account Creation</title>`, `<h1>BLURT Account Creator</h1>`, anywhere `BLURT` appears in markup
- **`js/script.js`** — strings on lines 98, 453, 704, 794, 832, 847 (PDF backup file titles + alerts mention BLURT)
- **`js/lang.js`** — the i18n table; verify every string
- **`css/style.css`** — color palette + any background-image references to Blurt assets
- **`img/favicon.png`** — replace with MELEK favicon
- **`js/blurt.min.js`** — this is `blurtjs`; the chain it talks to is controlled by config the client passes (`window.blurt.api.setOptions(...)` and `window.blurt.config.set(...)`); patch the client init code in `script.js`, not the bundled lib

## Provenance

Source URL: `https://blurtplugin.online/account/`
Pulled: 2026-05-27 via `curl` from the live site.
License: unspecified in source files. Mirroring authorized by user (mahatmajapa@gmail.com) per the "BLURT Plugin and rebranding it" directive captured in the Signup architecture section of `../../CLAUDE.md`.
