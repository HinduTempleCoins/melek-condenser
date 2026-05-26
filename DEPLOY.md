# MELEK Deploy Guide

This repo houses two branches on one GitHub URL:
- `claude/add-claude-md-file-vWOxi` — **condenser** (front end at `melek.salon`)
- `claude/melek-rebrand` — **wallet** (front end at `wallet.melek.salon`)

Both are React/Koa SSR Node apps. They share the BLURT chain RPCs during the
bootstrap period and will move to MELEK-native RPCs once the MELEK chain is
launched.

## Required environment variables

### Both apps

| Variable | Purpose | Notes |
|---|---|---|
| `NODE_ENV` | `production` for prod, `development` for local dev | |
| `PORT` | TCP port to bind | Wallet on `8080`, condenser on `8080` (one each) |
| `SDC_SESSION_SECRETKEY` | Koa session encryption key | **Must be 32 bytes minimum.** Generate once: `openssl rand -hex 32`. Keep stable across restarts or sessions are lost. |
| `SDC_CLIENT_BLURTD_URL` | RPC endpoint the browser hits | Recommended: `https://rpc.beblurt.com` |
| `SDC_SERVER_BLURTD_URL` | RPC endpoint the SSR Koa server hits | Recommended: `https://rpc.beblurt.com` |
| `NODE_OPTIONS` | Required on Node ≥17 | `--openssl-legacy-provider` (legacy crypto bindings the build uses) |
| `BROWSER` | Must be unset/empty on Codespaces | The wallet's `LoginForm.jsx` treats `BROWSER` as a "we're in a browser" flag. Codespaces sets it to a helper-script path which trips the SSR guard. Set explicitly to empty string. |

### Wallet-only (for production email delivery)

| Variable | Purpose |
|---|---|
| `sendgrid_key` (mapped via `config/custom-environment-variables.json`) | SendGrid API key for the magic-link emails |
| `sendgrid_from` | Sender address |
| `sendgrid_templates_*` | SendGrid template IDs for each email type |

In dev (`NODE_ENV != production`), `src/server/sendEmail.js` logs the
email to console instead of sending — no SendGrid required.

### Wallet-only (for actual on-chain account creation)

The current `/signup/keys` flow generates real keys but does **not** broadcast
the `account_create_with_delegation` operation. Real account creation needs:
- A funded creator account on the chain (BLURT for now, MELEK once launched)
- The creator's `active` key available to the SSR Koa server
- Account-creation fee balance on that account (currently 3 BLURT + 10x SP)

Wire these via the existing `/api/v1/accounts` POST endpoint in
`src/server/api/general.js`.

## Node version

- **Use Node 22.** Node 24 crashes `config@3.3.2` and the SSR child dies
  silently while webpack reports "listening." Node 14 (old Dockerfile default)
  is too old for our deps.
- See the project memory `project_node_version` for the gotcha details.

## Local dev

### Wallet
```sh
cd melek-wallet
nvm use 22
npm ci
NODE_OPTIONS=--openssl-legacy-provider npm run build
SDC_SESSION_SECRETKEY=$(openssl rand -hex 32) \
  SDC_CLIENT_BLURTD_URL=https://rpc.beblurt.com \
  SDC_SERVER_BLURTD_URL=https://rpc.beblurt.com \
  BROWSER= NODE_ENV=production PORT=8080 \
  node lib/server/index.js
```
Then `curl -H "X-Forwarded-Proto: https" http://localhost:8080/signup`
(the proxy header is required — koa-session refuses to set the `__Host-`
prefixed cookie over plain HTTP).

### Condenser
```sh
cd melek-condenser
nvm use 22
npm ci
NODE_OPTIONS=--openssl-legacy-provider npm run build
SDC_SESSION_SECRETKEY=$(openssl rand -hex 32) \
  SDC_CLIENT_BLURTD_URL=https://rpc.beblurt.com \
  SDC_SERVER_BLURTD_URL=https://rpc.beblurt.com \
  BROWSER= NODE_ENV=production PORT=8080 \
  node lib/server/index.js
```

## Production deploy options

### Option A — Render (easiest)

Render auto-deploys on push, has free + paid tiers, supports multiple services
per repo. Use the `render.yaml` blueprint at the repo root.

1. Sign in to Render and connect this GitHub repo.
2. Create a new **Blueprint** pointing at `render.yaml`.
3. Render reads the blueprint, creates two services: `melek-condenser`
   (branch `claude/add-claude-md-file-vWOxi`) and `melek-wallet` (branch
   `claude/melek-rebrand`).
4. Set the env vars listed above in each service's "Environment" tab.
5. After first deploy, copy the `*.onrender.com` URLs Render assigns — those
   are the working URLs while you set up DNS.

### Option B — Fly.io

Fly is similar in shape. You'd write two `fly.toml` files (one per branch)
and run `fly launch` from each working tree. Skipping the file here because
Render's blueprint covers the auto-deploy + multi-service case more cleanly.

### Option C — Generic VPS with Docker

Both repos ship a working `Dockerfile`. Build and run with:

```sh
docker build -t melek-wallet .
docker run -d --name melek-wallet -p 8080:8080 \
  -e SDC_SESSION_SECRETKEY=$(openssl rand -hex 32) \
  -e SDC_CLIENT_BLURTD_URL=https://rpc.beblurt.com \
  -e SDC_SERVER_BLURTD_URL=https://rpc.beblurt.com \
  -e NODE_OPTIONS=--openssl-legacy-provider \
  -e BROWSER= \
  melek-wallet
```

**Note:** the existing Dockerfile uses an old Node version (14 for wallet,
`alpine` latest for condenser). Both will need updates to Node 22 before
they build cleanly. That's a follow-up — left as-is for now to keep blast
radius small.

## DNS

Assuming you control `melek.salon` (and/or `melek.in`):

| Subdomain | Points at | Notes |
|---|---|---|
| `melek.salon` (apex) | Condenser host | The main public face |
| `wallet.melek.salon` | Wallet host | Account, signup, transfers |
| `signer.melek.salon` (alias `connect.`) | Future Hivesigner fork | Not built yet |
| `hathor.melek.salon` | Future bot HTTP gateway | Not built yet — see `reference-bot-repo` memory |
| `explorer.melek.salon` | Future block explorer | Not built yet |
| `api.melek.salon` | Future shared API spine | Not built yet |

Set:
- An **A record** for `melek.salon` to the condenser host's IP (or CNAME to
  Render's `melek-condenser.onrender.com`).
- A **CNAME** for `wallet.melek.salon` → wallet host.

Both apps assume HTTPS (the koa-session `__Host-` cookie requires it). On
Render, HTTPS is automatic. On a VPS, terminate TLS at a fronting proxy
(Caddy, nginx + certbot) and pass `X-Forwarded-Proto: https` upstream.

## Verifying a deploy

After the wallet is up, hit:
- `GET /` → wallet landing
- `GET /signup` → language picker (with embedded Hathor chat)
- `GET /signup/en` → email entry (demo mode)
- `GET /signup/keys` → key generation (demo mode — real keys, no on-chain
  broadcast yet)
- `GET /signup/done` → success page

After the condenser is up, hit:
- `GET /` → homepage
- `GET /welcome` → welcome content
- `GET /trending` → trending posts (depends on RPC)
- Any "Sign up" CTA in the header → routes to
  `wallet.melek.salon/signup`

Grep response body for `\bBlurt\b` — should be zero in display copy on the
key pages. (Comments in source / chain-protocol regexes still say BLURT;
those are correct and live below the rendered HTML.)

## What's not done

- **Real magic-link email delivery** — needs SendGrid credentials and the
  wallet's existing `/enter_email` → `/submit_email` → `/confirm_email/:code`
  pipeline wired up to the new `/signup/en` route (currently `/signup/en`
  is demo-mode and skips the email round trip).
- **On-chain account creation** — needs a funded creator account + key on
  the SSR Koa server, calling the existing `/api/v1/accounts` POST handler.
- **Hathor's real character** — `OnboardingChat` uses scripted replies.
  When the Bot repo exposes an HTTP API, swap the `scriptedReply()` call
  in `src/app/components/elements/OnboardingChat.jsx` for a `fetch` to
  `https://hathor.melek.salon/api/chat`. The component contract is
  `{ from, text }` messages; the API just needs to return the same shape.
- **MELEK chain** — chain-protocol values still say BLURT on the wire.
  When the MELEK chain launches, flip `LIQUID_TICKER`, `DEBT_TICKER`,
  `VEST_TICKER` in `src/app/client_config.js` (condenser) and the
  equivalent constants in the wallet, plus the RPC env vars.
