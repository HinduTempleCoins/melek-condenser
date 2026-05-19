const fs = require('fs');
if (!fs.existsSync('tmp')) fs.mkdirSync('tmp');

process.env.BABEL_ENV = 'browser';
process.env.NODE_ENV = 'development';

const Koa = require('koa');
const webpack = require('webpack');

const webpackDevConfig = require('./dev.config');

const app = new Koa();
const compiler = webpack(webpackDevConfig);

const PORT = process.env.PORT ? parseInt(process.env.PORT) + 1 : 8081;

const server_options = {
    publicPath: '/assets/',
    hot: true,
    stats: {
        assets: true,
        colors: true,
        version: false,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
    },
};

app.use(require('koa-webpack-dev-middleware')(compiler, server_options));
app.use(require('koa-webpack-hot-middleware')(compiler));

app.listen(PORT, '0.0.0.0', () => {
    console.log('`webpack-dev-server` listening on port %s', PORT);
});

// Start the Koa SSR app as a child process so it serves rendered pages on 8080.
// (The webpack `done` hook in dev.config.js does not fire reliably with the current
// webpack version, so we kick it off here directly.)
const cp = require('child_process');
const path = require('path');
const koaPath = path.join(__dirname, '../src/server/index');
const koaEnv = { ...process.env, NODE_ENV: 'development', BABEL_ENV: 'server' };
// Codespaces sets BROWSER=/.../browser.sh for "open URL in browser" tooling.
// The condenser code treats `if (process.env.BROWSER)` as "running in a real browser",
// so leaking that env var into the SSR child trips browser-only code paths
// (localStorage, window, etc.) at module-load time.
delete koaEnv.BROWSER;
console.log('[dev-server] forking SSR app:', koaPath);
const koa = cp.fork(koaPath, {
    env: koaEnv,
    stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
});
process.on('exit', () => koa && koa.kill('SIGTERM'));
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));
