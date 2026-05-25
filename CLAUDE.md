# melek-wallet — Claude Code Reference

Full architectural context for the MELEK project lives in **HinduTempleCoins/MELEK** (`CLAUDE.md`) — read that first if this session has access to it. The sibling **melek-condenser** repo (`/workspaces/melek-condenser` in dev, also has its own `CLAUDE.md`) covers the content/social side.

## What this repo is

`melek-wallet` is the Blurt Wallet forked and rebranded for the **MELEK blockchain**. It is a React.js / Koa app that handles **signup, key generation, account recovery, login sessions, transfers, and witness voting** — the keys-and-money side of MELEK. The upstream source is [Blurt Wallet](https://gitlab.com/blurt/blurt-wallet) (which itself is a fork of Blurt Condenser, stripped down to wallet-only functionality).

## Why this is a separate repo from the condenser

This is **deliberate** and should not be merged with melek-condenser. The Steemit→Hive→Blurt lineage maintains this split on purpose:

1. **Origin / cookie scoping.** Session cookies on `signup.melek.salon` / `wallet.melek.salon` cannot be read by JS on `melek.salon` (the condenser). An XSS in the content site cannot reach wallet sessions or keys.
2. **CSP.** The condenser renders untrusted user content (posts, comments, embeds, ads) and needs a loose CSP. The wallet wants the opposite — strict CSP, no inline scripts, minimal third-party origins. Different `helmet` config per app.
3. **Operational stack.** The wallet uses MySQL/sequelize, sendgrid (email), twilio (SMS), `@steem/crypto-session`, koa-csrf, an on-chain `registrar` account for signup. The condenser uses none of these.
4. **Attack surface separation.** Bugs in content rendering must not be able to compromise key handling.

Look for `__Host-` prefixed session cookies in `config/default.json` (`session_cookie_key`) — that prefix enforces secure-only, no-Domain attribute, https-only cookies. That's the explicit security boundary.

## MELEK chain parameters (locked — must match condenser exactly)

| Parameter | Value |
|---|---|
| Address prefix | `MELEK` |
| Liquid token | `MELEK` |
| Vesting token | `MELEK POWER` |
| Block time | 4 seconds |
| Block reward | 1 MELEK per block (flat, no decay) |
| Emission ceiling | 270 years (hard stop, no tail emission) |
| Total supply at cutoff | ~2.1 billion MELEK |
| Power-down period | 13 weeks |
| Premine | None — fresh genesis |
| AI witness | First-class DPoS member (same vote mechanism as humans) |
| Chain ID | TBD — set in `config/default.json` → `chain_id` |
| RPC endpoint | TBD — set in `config/default.json` → `blurtd_connection_*` |
| App domain | `wallet.melek.salon` / `signup.melek.salon` (TBD) |

## Bootstrap period — Blurt as shim

The MELEK chain has not launched yet (`chain_id: TBD`). Until it does, the wallet talks to the **Blurt chain** as a shim — same code path, just different chain underneath. This has consequences:

- **UI strings say MELEK** (`APP_NAME`, `LIQUID_TOKEN`, `VESTING_TOKEN` etc. in `src/app/client_config.js`)
- **Asset tickers stay BLURT** (`LIQUID_TICKER`, `VEST_TICKER`, `DEBT_TICKER`) because transactions must be accepted by the Blurt chain
- **`address_prefix` stays `BLT`** in `config/default.json` for the same reason — generating keys with prefix MELEK would produce addresses the Blurt chain rejects
- **`chain_id` stays Blurt's** until MELEK launches

When the MELEK chain launches, these protocol-level identifiers all swap to MELEK values atomically. Don't half-swap them.

## Wallet-specific concepts

- **Registrar account.** `config/default.json` → `registrar` is the on-chain creator account that pays the account creation fee + delegation when a new user signs up. For MELEK launch, this needs to be a real MELEK account funded with enough MELEK POWER to delegate. Today (Blurt shim) it would need to be a funded Blurt account.
- **`disable_signups` flag.** Kill switch in `config/default.json`. Useful during chain migration.
- **`requestAccountRecovery`.** Wallet-specific flow; chain primitive.
- **Email/SMS verification.** Sendgrid + Twilio integrations. Optional but typically required to keep signup spam manageable.
- **`/api/v1/*` endpoints.** Per `doc/DEPLOYMENT.md`, rate-limit these tightly at the reverse proxy: `login_account`, `accounts`, `update_email`, `initiate_account_recovery`, `account_recovery_confirmation`, `request_account_recovery`.

## Current state of the rebrand

The repo was just cloned from `gitlab.com/blurt/blurt-wallet`. Working branch: `claude/melek-rebrand`.

### Done in this branch
- `CLAUDE.md` (this file)
- `package.json` — name and description
- `README.md` — title and intro
- `src/app/client_config.js` — MELEK display strings (matching condenser pattern)

### Not yet rebranded
- `src/shared/constants.js` — `SIGNUP_URL` (still points at `signup.blurtwallet.com`)
- `config/default.json` — `site_domain`, `session_cookie_key`, `session_key`, CSP `helmet.directives.connectSrc` (lots of `*.blurt.blog` URLs), `blurtd_connection_*`, `img_proxy_prefix`, `ipfs_prefix`, `price_info_url`, `social_url`, `upload_image`
- All UI strings in `src/app/locales/`
- All Blurt-branded images / logos in `src/app/assets/`
- `src/index.html` title, base URL
- `doc/` and `README.md` body content

## Key file map

```
src/app/client_config.js          # Display strings — rebranded
src/shared/constants.js           # SIGNUP_URL, KEYCHAIN_URL — TODO
config/default.json               # Runtime config: chain, RPC, registrar, CSP, sessions — TODO
src/server/index.js               # Koa server entry
src/app/redux/                    # Sagas including signup, account recovery
src/app/components/pages/         # Signup, Wallet, Witnesses, Settings pages
```

## Cross-repo: condenser handoff

When a user signs up here, they should be redirected back to the condenser landing on the canonical Welcome / Tutorial Program post (so the AI welcome bot's tagged comment generates their first notification). The condenser exposes `welcome_post_url` via `$STM_Config` (added 2026-05-25 in `melek-condenser`). The wallet should redirect to that URL after successful signup.

## Conventions

- Commit messages: follow the wallet's existing GitLab MR style (look at recent commits on `main`)
- Working branch: `claude/melek-rebrand`
- No TypeScript — plain JS/JSX
- Component CSS: BEM-style, uppercase block names (`Wallet__balance`, etc.) per the wallet's existing README
- The chat-box scaffold (`WelcomeChat` component) lives in the condenser today; when this repo gets a signup page, that component should be ported/copied here

## Don't

- Don't merge this repo with melek-condenser — see "Why this is a separate repo" above
- Don't change `LIQUID_TICKER` / `VEST_TICKER` / `DEBT_TICKER` / `address_prefix` / `chain_id` to MELEK values until the MELEK chain actually launches; they'd break Blurt-shim transactions
- Don't strip the `__Host-` cookie prefix; it's a security boundary
- Don't add CAPTCHAs or rate limits that key on account type (AI vs human) — per MELEK policy in the main CLAUDE.md, all accounts are treated identically
