# MELEK condenser

The web front end for the [MELEK](https://melek.salon) social blockchain. This
is the source of the live site at **https://melek.salon**: a server-side-rendered
React app on a Koa server that reads from and broadcasts to a MELEK RPC node.
Users post, comment, vote, transfer and manage their accounts here; keys are
handled in the browser and never sent to the server.

MELEK is a Graphene-family DPoS chain forked from [Blurt](https://gitlab.com/blurt/blurt),
which forked [Steem](https://github.com/steemit/steem). The chain node lives in
[HinduTempleCoins/melek-chain](https://github.com/HinduTempleCoins/melek-chain).
This front end is a fork of the Blurt condenser, itself a fork of
[steemit/condenser](https://github.com/steemit/condenser).

## Run it yourself

You need Node.js 18 or newer and npm. Any MELEK RPC node works; the public one is
`https://melek.salon/rpc`.

```bash
git clone https://github.com/HinduTempleCoins/melek-condenser.git
cd melek-condenser
npm install
mkdir -p tmp

# development mode: hot-reloading bundles, app on http://localhost:8080
npm start
```

### Production build

```bash
npm run build                       # webpack bundle + babel to lib/
export SDC_SESSION_SECRETKEY=$(base64 --wrap=0 /dev/urandom | head -c 32)
export SDC_CLIENT_BLURTD_URL=https://melek.salon/rpc   # RPC the browser uses
export SDC_SERVER_BLURTD_URL=https://melek.salon/rpc   # RPC the SSR server uses
NODE_ENV=production PORT=8080 node lib/server/index.js
```

On Node 17+ the webpack 4 build needs `NODE_OPTIONS=--openssl-legacy-provider`.
Keep `SDC_SESSION_SECRETKEY` stable across restarts, or every session is logged
out. The session cookie requires HTTPS, so put a TLS-terminating proxy (Caddy,
or nginx with certbot) in front and forward `X-Forwarded-Proto: https`.

### Docker

```bash
docker build -t melek-condenser .
docker run -it -p 8080:8080 \
  -e SDC_SESSION_SECRETKEY="$(base64 --wrap=0 /dev/urandom | head -c 32)" \
  -e SDC_CLIENT_BLURTD_URL=https://melek.salon/rpc \
  -e SDC_SERVER_BLURTD_URL=https://melek.salon/rpc \
  melek-condenser
```

### Configuration

All settings can be set with environment variables; the names are in
`config/custom-environment-variables.json` and the defaults in
`config/default.json`. The defaults already target MELEK mainnet (chain id
`907959e5...ad8b`, address prefix `MELEK`). The ones you will usually touch:

| Variable | What it does |
|---|---|
| `SDC_SESSION_SECRETKEY` | Session signing secret. Required in production; generate your own. |
| `SDC_CLIENT_BLURTD_URL` / `SDC_SERVER_BLURTD_URL` | RPC node for the browser and for server-side rendering. |
| `SDC_CHAIN_ID` / `SDC_ADDRESS_PREFIX` | Chain id and key prefix, if you point it at a MELEK testnet. |
| `SDC_IMAGE_PROXY_PREFIX` / `SDC_UPLOAD_IMAGE_URL` | Image proxy and upload service. |

The `RPC` variable names still say `BLURTD`; they are inherited from upstream
and kept so existing deploy scripts keep working.

`src/server/server-html.jsx` also loads `/melek-extras.js`, a small script
that melek.salon serves alongside the app. It is not in this repository yet, and
a self-hosted copy works without it (the browser just gets a 404 for it).

#### Debugging SSR code

`npm run debug` will build a development version of the codebase and then start the
local server with `--inspect-brk` so that you can connect a debugging client.
You can use Chromium to connect by finding the remote client at
`chrome://inspect/#devices`.

#### Configuration

The intention is to configure condenser using environment variables. You
can see the names of all of the available configuration environment
variables in `config/custom-environment-variables.json`. Default values are
stored in `config/default.json`.

Keep in mind environment variables only exist in your active session, so if
you wish to save them for later use you can put them all in a file and
`source` them in.

If you'd like to statically configure condenser without variables you can
edit the settings directly in `config/production.json`. If you're running
in development mode, copy `config/production.json` to `config/dev.json`
with `cp config/production.json config/dev.json` and adjust settings in
`dev.json`.

If you're intending to run condenser in a production environment one
configuration option that you will definitely want to edit is
`server_session_secret` which can be set by the environment variable
`SDC_SESSION_SECRETKEY`. To generate a new value for this setting, you can
do this:

```bash
base64 --wrap=0 /dev/urandom | head -c 32
```

## Style Guides For Submitting Pull Requests

### File naming and location

-   Prefer CamelCase js and jsx file names
-   Prefer lower case one word directory names
-   Keep stylesheet files close to components
-   Component's stylesheet file name should match component name

#### Js & Jsx

We use [prettier](https://github.com/prettier/prettier) to autofromat the
code, with [this configuration](.prettierrc). Run `npm run fmt` to format
everything in `src/`, or `npx prettier --config .prettierrc --write src/whatever/file.js` for a specific file.

#### CSS & SCSS

If a component requires a css rule, please use its uppercase name for the
class, e.g. "Header" class for the header's root div. We adhere to BEM
methodology with exception for Foundation classes, here is an example for
the Header component:

```html
<!-- Block -->
<ul class="Header">
    ...
    <!-- Element -->
    <li class="Header__menu-item">Menu Item 1</li>
    <!-- Element with modifier -->
    <li class="Header__menu-item--selected">Element with modifier</li>
</ul>
```

## Storybook

`npm run storybook`

## Testing

### Run test suite

`npm run ci:test`

runs `jest`.

### Test endpoints offline

If you want to test a server-side rendered page without using the network, do this:

```
npm run build
OFFLINE_SSR_TEST=true NODE_ENV=production node --prof lib/server/index.js
```

This will read data from the blobs in `api_mockdata` directory. If you want to use another set of mock data, create a similar directory to that one and add an argument `OFFLINE_SSR_TEST_DATA_DIR` pointing to your new directory.

### Run blackbox tests using nightwatch

To run a Selenium test suite, build and start the condenser docker image with a name `condenser` (like `docker build -t melek-condenser . && docker run --name condenser -itp 8080:8080 melek-condenser`) and then run the blackboxtest image attached to the condenser image's network:

```
docker build -t melek-condenser-blackboxtest blackboxtest/
docker run --network container:condenser melek-condenser-blackboxtest

```

## Issues and contributions

Bugs and feature requests: open an issue at
https://github.com/HinduTempleCoins/melek-condenser/issues. Issues labelled
`good first issue` are sized for a first contribution.

Security problems: please do not open a public issue. Use GitHub's private
vulnerability reporting ("Security" tab, "Report a vulnerability") so a fix can
ship before details are public.

## Credits and license

MELEK condenser stands on the work of two upstream projects:

- [steemit/condenser](https://github.com/steemit/condenser), the original
  Steem front end, copyright Steemit, Inc. (MIT).
- The [Blurt condenser](https://gitlab.com/blurt/openblurt/condenser), copyright
  the Blurt contributors (MIT), from which this repository was forked.

Thank you to both teams. This repository is released under the MIT License, with
the upstream copyright notices preserved; see [LICENSE](LICENSE).
