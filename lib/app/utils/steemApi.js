"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.callNotificationsApi = callNotificationsApi;
exports.getStateAsync = getStateAsync;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _blurtjs = require("@blurtfoundation/blurtjs");
var _axios = _interopRequireDefault(require("axios"));
var _busyjs = require("@busyorg/busyjs");
var _stateCleaner = _interopRequireDefault(require("app/redux/stateCleaner"));
// Static pages don't need on-chain state. Calling get_state for these against
// the Blurt RPC returns "unhandled path", which blurtjs retries 10× with
// exponential backoff (~6 min) — hanging SSR. Short-circuit with an empty
// state so the route renders immediately.
var STATIC_PAGE_PATHS = new Set(['about.html', 'welcome', 'chat', 'faq.html', 'login.html', 'privacy.html', 'support.html', 'tos.html', 'tags', 'change_password', 'recover_account_step_1', '~witnesses', 'submit.html', 'xss/test', 'benchmark']);
var emptyChainState = function emptyChainState() {
  return {
    accounts: {},
    content: {},
    props: {},
    discussion_idx: {},
    feed_price: {},
    tag_idx: {
      trending: []
    },
    tags: {},
    witnesses: {}
  };
};
function getStateAsync(_x) {
  return _getStateAsync.apply(this, arguments);
}
function _getStateAsync() {
  _getStateAsync = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee(url) {
    var raw, chainProperties, rewardFund, cleansed;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          // strip off query string
          url = url.split('?')[0];

          // strip off leading and trailing slashes
          if (url.length > 0 && url[0] == '/') url = url.substring(1, url.length);
          if (url.length > 0 && url[url.length - 1] == '/') {
            url = url.substring(0, url.length - 1);
          }
          if (!STATIC_PAGE_PATHS.has(url)) {
            _context.next = 1;
            break;
          }
          return _context.abrupt("return", (0, _stateCleaner["default"])(emptyChainState()));
        case 1:
          // blank URL defaults to `trending`
          if (url === '') url = 'hot';

          // curation and author rewards pages are alias of `transfers`
          if (url.indexOf('/curation-rewards') !== -1) {
            url = url.replace('/curation-rewards', '/transfers');
          }
          if (url.indexOf('/author-rewards') !== -1) {
            url = url.replace('/author-rewards', '/transfers');
          }
          _context.next = 2;
          return _blurtjs.api.getStateAsync(url);
        case 2:
          raw = _context.sent;
          _context.next = 3;
          return getChainProperties();
        case 3:
          chainProperties = _context.sent;
          if (chainProperties) {
            raw.props.operation_flat_fee = parseFloat(chainProperties.operation_flat_fee);
            raw.props.bandwidth_kbytes_fee = parseFloat(chainProperties.bandwidth_kbytes_fee);
          }
          _context.next = 4;
          return getRewardFund();
        case 4:
          rewardFund = _context.sent;
          if (rewardFund) {
            raw.reward_fund = rewardFund;
          }
          cleansed = (0, _stateCleaner["default"])(raw);
          return _context.abrupt("return", cleansed);
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee);
  }));
  return _getStateAsync.apply(this, arguments);
}
function getChainProperties() {
  return new Promise(function (resolve) {
    _blurtjs.api.getChainProperties(function (err, result) {
      if (result) {
        resolve(result);
      } else {
        resolve({});
      }
    });
  });
}
function getRewardFund() {
  return new Promise(function (resolve) {
    _blurtjs.api.getRewardFund('post', function (err, result) {
      if (result) {
        resolve(result);
      } else {
        resolve({});
      }
    });
  });
}
function callNotificationsApi(_x2) {
  return _callNotificationsApi.apply(this, arguments);
}
function _callNotificationsApi() {
  _callNotificationsApi = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee2(account) {
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          console.log('call notifications api', account);
          return _context2.abrupt("return", new Promise(function (resolve, reject) {
            var client = new _busyjs.Client('wss://notifications.blurt.world');
            client.call('get_notifications', [account], function (err, result) {
              if (err !== null) reject(err);
              resolve(result);
            });
          }));
        case 1:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  }));
  return _callNotificationsApi.apply(this, arguments);
}