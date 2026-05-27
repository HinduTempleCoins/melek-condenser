"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _path = _interopRequireDefault(require("path"));
var _koa = _interopRequireDefault(require("koa"));
var _koaMount = _interopRequireDefault(require("koa-mount"));
var _koaLogger = _interopRequireDefault(require("koa-logger"));
var _requesttimings = _interopRequireDefault(require("./requesttimings"));
var _StatsLoggerClient = _interopRequireDefault(require("./utils/StatsLoggerClient"));
var _SteemMarket = require("./utils/SteemMarket");
var _hardwarestats = _interopRequireDefault(require("./hardwarestats"));
var _cluster = _interopRequireDefault(require("cluster"));
var _os = _interopRequireDefault(require("os"));
var _prod_logger = _interopRequireDefault(require("./prod_logger"));
var _koaFavicon = _interopRequireDefault(require("koa-favicon"));
var _koaStaticCache = _interopRequireDefault(require("koa-static-cache"));
var _redirects = _interopRequireDefault(require("./redirects"));
var _general = _interopRequireDefault(require("./api/general"));
var _user_json = _interopRequireDefault(require("./json/user_json"));
var _post_json = _interopRequireDefault(require("./json/post_json"));
var _koaIsbot = _interopRequireDefault(require("koa-isbot"));
var _koaEncryptedSession = _interopRequireDefault(require("koa-encrypted-session"));
var _koaCsrf = _interopRequireDefault(require("koa-csrf"));
var _minimist = _interopRequireDefault(require("minimist"));
var _config = _interopRequireDefault(require("config"));
var _ResolveRoute = require("app/ResolveRoute");
var _secureRandom = _interopRequireDefault(require("secure-random"));
var _userIllegalContent = _interopRequireDefault(require("app/utils/userIllegalContent"));
var _koaLocale = _interopRequireDefault(require("koa-locale"));
var _misc = require("./utils/misc");
var _SpecialPosts = require("./utils/SpecialPosts");
var _fs = _interopRequireDefault(require("fs"));
if (_cluster["default"].isMaster) console.log('application server starting, please wait.');

// import uploadImage from 'server/upload-image' //medium-editor

var app = new _koa["default"]();
app.name = 'MELEK app';
var env = process.env.NODE_ENV || 'development';
// cache of a thousand days
var cacheOpts = {
  maxAge: 86400000,
  gzip: true,
  buffer: true
};

// import ads.txt to be served statically
var adstxt = _fs["default"].readFileSync(_path["default"].join(__dirname, '../app/assets/ads.txt'), 'utf8');

// Serve static assets without fanfare
app.use((0, _koaFavicon["default"])(_path["default"].join(__dirname, '../app/assets/images/favicons/favicon.ico')));
app.use((0, _koaMount["default"])('/favicons', (0, _koaStaticCache["default"])(_path["default"].join(__dirname, '../app/assets/images/favicons'), cacheOpts)));
app.use((0, _koaMount["default"])('/images', (0, _koaStaticCache["default"])(_path["default"].join(__dirname, '../app/assets/images'), cacheOpts)));
app.use((0, _koaMount["default"])('/javascripts', (0, _koaStaticCache["default"])(_path["default"].join(__dirname, '../app/assets/javascripts'), cacheOpts)));
app.use((0, _koaMount["default"])('/ads.txt', /*#__PURE__*/_regenerator["default"].mark(function _callee() {
  return _regenerator["default"].wrap(function (_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        this.type = 'text/plain';
        this.body = adstxt;
      case 1:
      case "end":
        return _context.stop();
    }
  }, _callee, this);
})));

// Proxy asset folder to webpack development server in development mode
if (env === 'development') {
  var webpack_dev_port = process.env.PORT ? parseInt(process.env.PORT) + 1 : 8081;
  var proxyhost = 'http://0.0.0.0:' + webpack_dev_port;
  console.log('proxying to webpack dev server at ' + proxyhost);
  var proxy = require('koa-proxy')({
    host: proxyhost,
    map: function map(filePath) {
      return 'assets/' + filePath;
    }
  });
  app.use((0, _koaMount["default"])('/assets', proxy));
} else {
  app.use((0, _koaMount["default"])('/assets', (0, _koaStaticCache["default"])(_path["default"].join(__dirname, '../../dist'), cacheOpts)));
}
var resolvedAssets = false;
var supportedLocales = false;
if (process.env.NODE_ENV === 'production') {
  resolvedAssets = require(_path["default"].join(__dirname, '../..', '/tmp/webpack-stats-prod.json'));
  supportedLocales = (0, _misc.getSupportedLocales)();
}
app.use((0, _koaIsbot["default"])());

// set number of processes equal to number of cores
// (unless passed in as an env var)
var numProcesses = process.env.NUM_PROCESSES || _os["default"].cpus().length;
var statsLoggerClient = new _StatsLoggerClient["default"](process.env.STATSD_IP);
app.use((0, _requesttimings["default"])(statsLoggerClient));
app.keys = [_config["default"].get('session_key')];
var crypto_key = _config["default"].get('server_session_secret');
(0, _koaEncryptedSession["default"])({
  maxAge: 1000 * 3600 * 24 * 60,
  key: _config["default"].get('session_cookie_key'),
  secretKey: crypto_key
}, app);
(0, _koaCsrf["default"])(app);
(0, _koaLocale["default"])(app);
function convertEntriesToArrays(obj) {
  return Object.keys(obj).reduce(function (result, key) {
    result[key] = obj[key].split(/\s+/);
    return result;
  }, {});
}

// Fetch cached currency data for homepage
var steemMarket = new _SteemMarket.SteemMarket();
app.use(/*#__PURE__*/_regenerator["default"].mark(function _callee2(next) {
  return _regenerator["default"].wrap(function (_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        _context2.next = 1;
        return steemMarket.get();
      case 1:
        this.steemMarketData = _context2.sent;
        _context2.next = 2;
        return next;
      case 2:
      case "end":
        return _context2.stop();
    }
  }, _callee2, this);
}));

// some redirects and health status
app.use(/*#__PURE__*/_regenerator["default"].mark(function _callee3(next) {
  var _this = this;
  var p, userCheck, _p, redir;
  return _regenerator["default"].wrap(function (_context3) {
    while (1) switch (_context3.prev = _context3.next) {
      case 0:
        if (!(this.method === 'GET' && this.url === '/.well-known/healthcheck.json')) {
          _context3.next = 1;
          break;
        }
        this.status = 200;
        this.body = {
          status: 'ok',
          docker_tag: process.env.DOCKER_TAG ? process.env.DOCKER_TAG : false,
          source_commit: process.env.SOURCE_COMMIT ? process.env.SOURCE_COMMIT : false
        };
        return _context3.abrupt("return");
      case 1:
        if (!(this.method === 'GET' && this.url === '/' && this.session.a)) {
          _context3.next = 2;
          break;
        }
        this.status = 302;
        this.redirect("/@".concat(this.session.a, "/feed"));
        return _context3.abrupt("return");
      case 2:
        if (!(this.method === 'GET' && (_ResolveRoute.routeRegex.UserProfile1.test(this.url) || _ResolveRoute.routeRegex.PostNoCategory.test(this.url) || _ResolveRoute.routeRegex.Post.test(this.url)))) {
          _context3.next = 4;
          break;
        }
        p = this.originalUrl.toLowerCase();
        userCheck = '';
        if (_ResolveRoute.routeRegex.Post.test(this.url)) {
          userCheck = p.split('/')[2].slice(1);
        } else {
          userCheck = p.split('/')[1].slice(1);
        }
        if (!_userIllegalContent["default"].includes(userCheck)) {
          _context3.next = 3;
          break;
        }
        console.log('Illegal content user found blocked', userCheck);
        this.status = 451;
        return _context3.abrupt("return");
      case 3:
        if (!(p !== this.originalUrl)) {
          _context3.next = 4;
          break;
        }
        this.status = 301;
        this.redirect(p);
        return _context3.abrupt("return");
      case 4:
        if (!(this.method === 'GET' && _ResolveRoute.routeRegex.CategoryFilters.test(this.url))) {
          _context3.next = 5;
          break;
        }
        _p = this.originalUrl.toLowerCase();
        if (!(_p !== this.originalUrl)) {
          _context3.next = 5;
          break;
        }
        this.status = 301;
        this.redirect(_p);
        return _context3.abrupt("return");
      case 5:
        if (!(this.method === 'GET' && /\?[^\w]*(ch=|cn=|r=)/.test(this.url))) {
          _context3.next = 6;
          break;
        }
        redir = this.url.replace(/((ch|cn|r)=[^&]+)/gi, function (r) {
          var p = r.split('=');
          if (p.length === 2) _this.session[p[0]] = p[1];
          return '';
        });
        redir = redir.replace(/&&&?/, '');
        redir = redir.replace(/\?&?$/, '');
        console.log("server redirect ".concat(this.url, " -> ").concat(redir));
        this.status = 302;
        this.redirect(redir);
        _context3.next = 7;
        break;
      case 6:
        _context3.next = 7;
        return next;
      case 7:
      case "end":
        return _context3.stop();
    }
  }, _callee3, this);
}));

// load production middleware
if (env === 'production') {
  app.use(require('koa-conditional-get')());
  app.use(require('koa-etag')());
  app.use(require('koa-compressor')());
}

// Logging
if (env === 'production') {
  app.use((0, _prod_logger["default"])());
} else {
  app.use((0, _koaLogger["default"])());
}
app.use((0, _koaMount["default"])('/static', (0, _koaStaticCache["default"])(_path["default"].join(__dirname, '../app/assets/static'), cacheOpts)));
app.use((0, _koaMount["default"])('/robots.txt', /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
  return _regenerator["default"].wrap(function (_context4) {
    while (1) switch (_context4.prev = _context4.next) {
      case 0:
        this.set('Cache-Control', 'public, max-age=86400000');
        this.type = 'text/plain';
        this.body = 'User-agent: *\nAllow: /';
      case 1:
      case "end":
        return _context4.stop();
    }
  }, _callee4, this);
})));

// set user's uid - used to identify users in logs and some other places
// FIXME SECURITY PRIVACY cycle this uid after a period of time
app.use(/*#__PURE__*/_regenerator["default"].mark(function _callee5(next) {
  var last_visit, from_link;
  return _regenerator["default"].wrap(function (_context5) {
    while (1) switch (_context5.prev = _context5.next) {
      case 0:
        last_visit = this.session.last_visit;
        this.session.last_visit = new Date().getTime() / 1000 | 0;
        from_link = this.request.headers.referer;
        if (!this.session.uid) {
          this.session.uid = _secureRandom["default"].randomBuffer(13).toString('hex');
          this.session.new_visit = true;
          if (from_link) this.session.r = from_link;
        } else {
          this.session.new_visit = this.session.last_visit - last_visit > 1800;
          if (!this.session.r && from_link) {
            this.session.r = from_link;
          }
        }
        _context5.next = 1;
        return next;
      case 1:
      case "end":
        return _context5.stop();
    }
  }, _callee5, this);
}));
(0, _redirects["default"])(app);
(0, _user_json["default"])(app);
(0, _post_json["default"])(app);
(0, _general["default"])(app);
if (env !== 'test') {
  var appRender = require('./app_render');

  // Load special posts and store them on the ctx for later use. Since
  // we're inside a generator, we can't `await` here, so we pass a promise
  // so `src/server/app_render.jsx` can `await` on it.
  app.specialPostsPromise = (0, _SpecialPosts.specialPosts)();
  // refresh special posts every five minutes
  setInterval(function () {
    return new Promise(function (resolve, reject) {
      app.specialPostsPromise = (0, _SpecialPosts.specialPosts)();
      resolve();
    });
  }, 300000);
  app.use(/*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    var bot;
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 1;
          return appRender(this, supportedLocales, resolvedAssets);
        case 1:
          bot = this.state.isBot;
          if (bot) {
            console.log("  --> ".concat(this.method, " ").concat(this.originalUrl, " ").concat(this.status, " (BOT '").concat(bot, "')"));
          }
        case 2:
        case "end":
          return _context6.stop();
      }
    }, _callee6, this);
  }));
  var argv = (0, _minimist["default"])(process.argv.slice(2));
  var port = process.env.PORT ? parseInt(process.env.PORT) : 8080;
  if (env === 'production') {
    if (_cluster["default"].isMaster) {
      for (var i = 0; i < numProcesses; i++) {
        _cluster["default"].fork();
      }
      // if a worker dies replace it so application keeps running
      _cluster["default"].on('exit', function (worker) {
        console.log('error: worker %d died, starting a new one', worker.id);
        _cluster["default"].fork();
      });
    } else {
      app.listen(port);
      if (process.send) process.send('online');
      console.log("Worker process started for port ".concat(port));
    }
  } else {
    // spawn a single thread if not running in production mode
    app.listen(port);
    if (process.send) process.send('online');
    console.log("Application started on port ".concat(port));
  }
}

// set PERFORMANCE_TRACING to the number of seconds desired for
// logging hardware stats to the console
if (process.env.PERFORMANCE_TRACING) {
  setInterval(_hardwarestats["default"], 1000 * process.env.PERFORMANCE_TRACING);
}
module.exports = app;