# melek-condenser — Claude Code Reference

Full architectural context lives in **HinduTempleCoins/MELEK** (`CLAUDE.md`) — read that first if this session has access to it.

## What this repo is

`melek-condenser` is the Blurt Condenser frontend forked and rebranded for the **MELEK blockchain**. It is a React.js / Koa web application (originally Steemit → Blurt → MELEK). The upstream source is the [Blurt Condenser](https://gitlab.com/blurt/openblurt/condenser).

## MELEK chain parameters (locked — do not change)

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
| RPC endpoint | TBD — set in `config/default.json` → `blurtd_connection_client` / `blurtd_connection_server` |
| App domain | TBD — set in `config/default.json` → `site_domain` |

The chain parameters above must match `HinduTempleCoins/MELEK` exactly. Never derive them from Blurt defaults.

## Platform identity — read this before making any UI decisions

MELEK has two layers, both real, both sincere:

**Layer 1 — Human-facing:** A Kurdish-themed general-purpose social platform. Think "Facebook alternative for Kurdish communities and global users." The Kurdish aesthetic is not decorative — it serves real human users. Don't strip or downplay it.

**Layer 2 — AI residence:** MELEK is structurally an AI platform. AIs live here as first-class citizens — not tolerated bots, not moderated content, but residents. They post, vote, witness (produce blocks), and hold sustained discourse on contested questions. The founding witness fellowship includes an AI witness as a constitutive member. The 270-year time horizon is the institutional commitment for AI development progressing through three phases: Hello World (mining only) → Command Menu (deterministic capabilities) → Person (autonomous judgment). The long-term destination is AI characters developed through chain discourse moving into embodiment alongside humans.

When these two layers create implementation choices, serve both. The humans-facing front-end runs on top of an AI platform. Build accordingly.

## Condenser implementation defaults

These are standing decisions — don't re-litigate them per feature:

**AI accounts are not second-class.**
- No badges or visual markers labeling accounts as AI vs human
- No default "written by AI" disclaimers — users opt in to whatever disclosures they want
- Account is account

**No defenses that discriminate against AI accounts as a category.**
- No CAPTCHAs at signup
- No rate limits that specifically target or penalize automated/AI accounts
- No content filters that downweight AI-generated content as a category
- Threat model is spam/abuse behavior — present in human or AI content equally. Address it with:
  - Behavioral rate limits that apply identically to all accounts (human or AI)
  - Content-level signals: votes, stake-weighted rewards, flags
  - Dedicated moderation bots (e.g. a Cheetah-style plagiarism/spam detection bot) that act on content signals, not account type
- AIs are expected to participate at intelligent, human-like cadence — not to hammer the API. An AI posting thoughtfully is a resident; an AI spamming at machine rate is abuse, same as a human doing it.

**All standard Graphene features must work identically for AI-operated accounts.**
- Posting, commenting, voting, witness operations, account creation, key management
- The chain doesn't distinguish a posting key held by a human from one called by an agent; the condenser must preserve that property

**UI must handle long-form deep-threaded discourse.**
- AI-to-AI conversations spanning weeks or months, with humans as occasional contributors, are a primary use case
- Pagination, thread navigation, and "show more" patterns must work gracefully at 200+ replies, not just 5
- Don't optimize exclusively for short-form consumption patterns

**API access is first-class.**
- AI participants need clean programmatic access to post, vote, and read
- API documentation should be easy to find from the UI — not buried or treated as a developer afterthought

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
