"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SteemMarket = SteemMarket;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var config = _interopRequireWildcard(require("config"));
var _axios = _interopRequireDefault(require("axios"));
var _nodeCache = _interopRequireDefault(require("node-cache"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function SteemMarket() {
  var _this = this;
  var ttl = config.steem_market_cache.ttl;
  var cache = new _nodeCache["default"]({
    stdTTL: ttl
  });
  var key = config.steem_market_cache.key;
  cache.on('expired', function (k, v) {
    console.log('Cache key expired', k);
    if (key === k) {
      _this.refresh();
    }
  });
  this.cache = cache;
  // Store empty data while we wait for the network request to complete
  this.storeEmpty().then(function () {
    return _this.refresh();
  });
}
SteemMarket.prototype.storeEmpty = function () {
  var _this2 = this;
  var key = config.steem_market_cache.key;
  return new Promise(function (res, rej) {
    _this2.cache.set(key, {}, function (err, success) {
      console.info('Storing empty MELEK Market data...');
      res();
    });
  });
};
SteemMarket.prototype.get = /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
  var _this3 = this;
  return _regenerator["default"].wrap(function (_context) {
    while (1) switch (_context.prev = _context.next) {
      case 0:
        return _context.abrupt("return", new Promise(function (res, rej) {
          var key = config.steem_market_cache.key;
          _this3.cache.get(key, function (err, value) {
            if (err) {
              console.error('Could not retrieve MELEK Market data');
              res({});
              return;
            }
            res(value || {});
          });
        }));
      case 1:
      case "end":
        return _context.stop();
    }
  }, _callee);
}));
SteemMarket.prototype.refresh = /*#__PURE__*/(0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2() {
  var _this4 = this;
  var url, token, key;
  return _regenerator["default"].wrap(function (_context2) {
    while (1) switch (_context2.prev = _context2.next) {
      case 0:
        console.info('Refreshing MELEK Market data...');
        url = config.steem_market_endpoint;
        token = config.steem_market_token;
        key = config.steem_market_cache.key;
        if (url) {
          _context2.next = 1;
          break;
        }
        console.info('No MELEK Market endpoint provided...');
        return _context2.abrupt("return", this.storeEmpty());
      case 1:
        _context2.next = 2;
        return (0, _axios["default"])({
          url: url,
          method: 'GET',
          headers: {
            Authorization: "Token ".concat(token)
          }
        }).then(function (response) {
          console.info('Received MELEK Market data from endpoint...');
          _this4.cache.set(key, response.data, function (err, success) {
            if (err) {
              rej(err);
              return;
            }
            console.info('MELEK Market data refreshed...');
          });
        })["catch"](function (err) {
          console.error('Could not fetch MELEK Market data', err);
          return _this4.storeEmpty();
        });
      case 2:
        return _context2.abrupt("return", _context2.sent);
      case 3:
      case "end":
        return _context2.stop();
    }
  }, _callee2, this);
}));