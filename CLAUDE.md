# melek-condenser — Claude Code Reference

Full architectural context lives in **HinduTempleCoins/MELEK** (`CLAUDE.md`) — read that first if this session has access to it.

## What this repo is

`melek-condenser` is the Blurt Condenser frontend forked and rebranded for the **MELEK blockchain**. It is a React.js / Koa web application (originally Steemit → Blurt → MELEK). The upstream source is the [Blurt Condenser](https://gitlab.com/blurt/openblurt/condenser).

## MELEK chain parameters (locked — do not change)

| Parameter | Value |
|---|---|
| Address prefix | `MLK` |
| Liquid token | `MELEK` |
| Vesting token | `MELEK POWER` |
| Chain ID | TBD — set in `config/default.json` → `chain_id` |
| RPC endpoint | TBD — set in `config/default.json` → `blurtd_connection_client` / `blurtd_connection_server` |
| App domain | TBD — set in `config/default.json` → `site_domain` |

The chain parameters above must match `HinduTempleCoins/MELEK` exactly. Never derive them from Blurt defaults.

## Current state of the repo

The codebase is a **work-in-progress rebranding** of Blurt Condenser. As of the last session:

### What has been changed (partial list from git log)
- `src/app/redux/FetchDataSaga.js` — adapted for MELEK API calls
- `src/app/redux/SagaShared.js` — saga wiring updates
- `src/app/redux/GlobalReducer.js` — reducer fixes
- `src/shared/UniversalRender.jsx` — SSR render fixes
- `src/app/RootRoute.js`, `src/app/ResolveRoute.js` — routing fixes
- `src/app/components/pages/FeedPage.jsx`, `PostsIndex.jsx`, `PostPageNoCategory.jsx` — page fixes
- `src/app/components/elements/ChangePassword.jsx` — component fix
- `src/index.html` — title/base URL updates
- `package.json` / `package-lock.json` — dependency updates
- Images / logo — updated

### What still needs rebranding (BLURT → MELEK)
These files are still fully Blurt-branded and need updating:

- **`src/app/client_config.js`** — all `APP_NAME`, `LIQUID_TOKEN`, `APP_URL`, `APP_DOMAIN`, ticker symbols, etc. still say `Blurt`
- **`src/shared/api_client/ChainConfig.js`** — `address_prefix` still `'BLT'`, chain_id still zeroes
- **`src/shared/constants.js`** — `SIGNUP_URL`, `KEYCHAIN_URL` still point to Blurt
- **`config/default.json`** — RPC URLs, `chain_id`, `address_prefix`, session keys, domain all still Blurt
- **`README.md`** — still describes Blurt
- **`package.json`** — `description` still says "Blurt blockchain"
- All remaining UI strings, social handles, share images referencing Blurt

## Key file map

```
src/app/client_config.js          # Token names, URLs, social handles — rebrand here first
src/shared/api_client/ChainConfig.js  # address_prefix, chain_id
src/shared/constants.js           # Signup/keychain URLs
config/default.json               # Server config: RPC, chain_id, domain, session keys
src/app/redux/FetchDataSaga.js    # API call layer (uses @blurtfoundation/blurtjs)
src/server/index.js               # Koa server entry
src/index.html                    # HTML shell (title, base href, inline config)
```

## JS library dependency

The app currently imports `@blurtfoundation/blurtjs`. Once a MELEK-specific JS library exists (e.g. `@hindutemplecoins/melekjs`), `package.json` and all `import ... from '@blurtfoundation/blurtjs'` lines must be updated to point to it.

Until then, `@blurtfoundation/blurtjs` is used as a shim — ensure the chain_id and address_prefix overrides in `ChainConfig.js` are correct so it talks to the MELEK chain.

## Conventions

- Commit messages use the pattern `Fix <file-path(s)>` (match existing style)
- Development branch: `claude/add-claude-md-file-vWOxi`
- No TypeScript — plain JS/JSX throughout
- Config is split: runtime server config in `config/default.json`, client-side constants in `src/app/client_config.js`
