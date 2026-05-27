"use strict";

var _typeof = require("@babel/runtime/helpers/typeof");
var _regeneratorRuntime2 = require("@babel/runtime/regenerator");
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.broadcastOperation = broadcastOperation;
exports.createPatch = createPatch;
exports.createPermlink = createPermlink;
exports.preBroadcast_comment = preBroadcast_comment;
exports.transactionWatches = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _effects = require("redux-saga/effects");
var _immutable = require("immutable");
var _counterpart = _interopRequireDefault(require("counterpart"));
var _speakingurl = _interopRequireDefault(require("speakingurl"));
var _bs = _interopRequireDefault(require("bs58"));
var _secureRandom = _interopRequireDefault(require("secure-random"));
var _ecc = require("@blurtfoundation/blurtjs/lib/auth/ecc");
var _blurtjs = require("@blurtfoundation/blurtjs");
var _SagaShared = require("app/redux/SagaShared");
var _AuthSaga = require("app/redux/AuthSaga");
var appActions = _interopRequireWildcard(require("app/redux/AppReducer"));
var globalActions = _interopRequireWildcard(require("app/redux/GlobalReducer"));
var transactionActions = _interopRequireWildcard(require("app/redux/TransactionReducer"));
var userActions = _interopRequireWildcard(require("app/redux/UserReducer"));
var _client_config = require("app/client_config");
var _ServerApiClient = require("app/utils/ServerApiClient");
var _SteemKeychain = require("app/utils/SteemKeychain");
var _diffMatchPatch = _interopRequireDefault(require("diff-match-patch"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t0 in e) "default" !== _t0 && {}.hasOwnProperty.call(e, _t0) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t0)) && (i.get || i.set) ? o(f, _t0, i) : f[_t0] = e[_t0]); return f; })(e, t); }
var _marked = /*#__PURE__*/_regeneratorRuntime2.mark(createPermlink);
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var transactionWatches = exports.transactionWatches = [(0, _effects.takeEvery)(transactionActions.BROADCAST_OPERATION, broadcastOperation)];
var hook = {
  preBroadcast_comment: preBroadcast_comment,
  preBroadcast_vote: preBroadcast_vote,
  error_vote: error_vote,
  error_custom_json: error_custom_json,
  accepted_comment: accepted_comment,
  accepted_custom_json: accepted_custom_json,
  accepted_delete_comment: accepted_delete_comment,
  accepted_vote: accepted_vote
};
var toStringUtf8 = function toStringUtf8(o) {
  return o ? Buffer.isBuffer(o) ? o.toString('utf-8') : o.toString() : o;
};
function preBroadcast_vote(_ref) {
  var operation = _ref.operation,
    username = _ref.username;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var voter, author, permlink, weight;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!operation.voter) operation.voter = username;
          voter = operation.voter, author = operation.author, permlink = operation.permlink, weight = operation.weight; // give immediate feedback
          _context.next = 1;
          return (0, _effects.put)(globalActions.set({
            key: "transaction_vote_active_".concat(author, "_").concat(permlink),
            value: true
          }));
        case 1:
          _context.next = 2;
          return (0, _effects.put)(globalActions.voted({
            username: voter,
            author: author,
            permlink: permlink,
            weight: weight
          }));
        case 2:
          return _context.abrupt("return", operation);
        case 3:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })();
}

/** Keys, username, and password are not needed for the initial call.  This will check the login and may trigger an action to prompt for the password / key. */
function broadcastOperation(_ref2) {
  var _ref2$payload = _ref2.payload,
    type = _ref2$payload.type,
    operation = _ref2$payload.operation,
    confirm = _ref2$payload.confirm,
    warning = _ref2$payload.warning,
    keys = _ref2$payload.keys,
    username = _ref2$payload.username,
    password = _ref2$payload.password,
    useKeychain = _ref2$payload.useKeychain,
    successCallback = _ref2$payload.successCallback,
    errorCallback = _ref2$payload.errorCallback,
    allowPostUnsafe = _ref2$payload.allowPostUnsafe;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee2() {
    var operationParam, conf, payload, _confirm, _warning, checkbox, signingKey, eventType, page, _t;
    return _regenerator["default"].wrap(function (_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          operationParam = {
            type: type,
            operation: operation,
            keys: keys,
            username: username,
            password: password,
            useKeychain: useKeychain,
            successCallback: successCallback,
            errorCallback: errorCallback,
            allowPostUnsafe: allowPostUnsafe
          };
          console.log('broadcastOperation', operationParam);
          conf = typeof confirm === 'function' ? confirm() : confirm;
          if (!conf) {
            _context2.next = 2;
            break;
          }
          _context2.next = 1;
          return (0, _effects.put)(transactionActions.confirmOperation({
            confirm: confirm,
            warning: warning,
            operation: operationParam,
            errorCallback: errorCallback
          }));
        case 1:
          return _context2.abrupt("return");
        case 2:
          payload = {
            operations: [[type, operation]],
            keys: keys,
            username: username,
            successCallback: successCallback,
            errorCallback: errorCallback
          };
          if (!(!allowPostUnsafe && hasPrivateKeys(payload))) {
            _context2.next = 4;
            break;
          }
          _confirm = (0, _counterpart["default"])('g.post_key_warning.confirm');
          _warning = (0, _counterpart["default"])('g.post_key_warning.warning');
          checkbox = (0, _counterpart["default"])('g.post_key_warning.checkbox');
          operationParam.allowPostUnsafe = true;
          _context2.next = 3;
          return (0, _effects.put)(transactionActions.confirmOperation({
            confirm: _confirm,
            warning: _warning,
            checkbox: checkbox,
            operation: operationParam,
            errorCallback: errorCallback
          }));
        case 3:
          return _context2.abrupt("return");
        case 4:
          _context2.prev = 4;
          if ((0, _SteemKeychain.isLoggedInWithKeychain)()) {
            _context2.next = 8;
            break;
          }
          if (!(!keys || keys.length === 0)) {
            _context2.next = 8;
            break;
          }
          payload.keys = [];
          // user may already be logged in, or just enterend a signing passowrd or wif
          _context2.next = 5;
          return (0, _effects.call)(_AuthSaga.findSigningKey, {
            opType: type,
            username: username,
            password: password
          });
        case 5:
          signingKey = _context2.sent;
          if (!signingKey) {
            _context2.next = 6;
            break;
          }
          payload.keys.push(signingKey);
          _context2.next = 8;
          break;
        case 6:
          if (password) {
            _context2.next = 8;
            break;
          }
          _context2.next = 7;
          return (0, _effects.put)(userActions.showLogin({
            operation: {
              type: type,
              operation: operation,
              username: username,
              successCallback: successCallback,
              errorCallback: errorCallback,
              saveLogin: true
            }
          }));
        case 7:
          return _context2.abrupt("return");
        case 8:
          _context2.next = 9;
          return (0, _effects.call)(broadcastPayload, {
            payload: payload
          });
        case 9:
          eventType = type.replace(/^([a-z])/, function (g) {
            return g.toUpperCase();
          }).replace(/_([a-z])/g, function (g) {
            return g[1].toUpperCase();
          });
          if (eventType === 'Comment' && !operation.parent_author) {
            eventType = 'Post';
          }
          page = eventType === 'Vote' ? "@".concat(operation.author, "/").concat(operation.permlink) : '';
          (0, _ServerApiClient.serverApiRecordEvent)(eventType, page);
          _context2.next = 11;
          break;
        case 10:
          _context2.prev = 10;
          _t = _context2["catch"](4);
          console.error('TransactionSage', _t);
          if (errorCallback) errorCallback(_t.toString());
        case 11:
        case "end":
          return _context2.stop();
      }
    }, _callee2, null, [[4, 10]]);
  })();
}
function hasPrivateKeys(payload) {
  var blob = JSON.stringify(payload.operations);
  var m;
  var re = /P?(5[123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz]{50})/g;
  while (true) {
    m = re.exec(blob);
    if (m) {
      try {
        _ecc.PrivateKey.fromWif(m[1]); // performs the base58check
        return true;
      } catch (e) {}
    } else {
      break;
    }
  }
  return false;
}
function broadcastPayload(_ref3) {
  var _ref3$payload = _ref3.payload,
    operations = _ref3$payload.operations,
    keys = _ref3$payload.keys,
    username = _ref3$payload.username,
    successCallback = _ref3$payload.successCallback,
    errorCallback = _ref3$payload.errorCallback;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee3() {
    var needsActiveAuth, _iterator, _step, _step$value, _type4, newOps, _iterator2, _step2, _step2$value, type, operation, op, _iterator3, _step3, o, broadcastedEvent, currentUser, currentUsername, _iterator5, _step5, _step5$value, _type2, _operation2, config, _iterator6, _step6, _step6$value, _type3, _operation3, _t2, _t3, _t4, _t5, _t6, _t7, _t8;
    return _regenerator["default"].wrap(function (_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          needsActiveAuth = false; // console.log('broadcastPayload')
          if (!$STM_Config.read_only_mode) {
            _context3.next = 1;
            break;
          }
          return _context3.abrupt("return");
        case 1:
          _iterator = _createForOfIteratorHelper(operations);
          _context3.prev = 2;
          _iterator.s();
        case 3:
          if ((_step = _iterator.n()).done) {
            _context3.next = 6;
            break;
          }
          _step$value = (0, _slicedToArray2["default"])(_step.value, 1), _type4 = _step$value[0];
          _context3.next = 4;
          return (0, _effects.put)(transactionActions.remove({
            key: ['TransactionError', _type4]
          }));
        case 4:
          if (!_AuthSaga.postingOps.has(_type4)) {
            needsActiveAuth = true;
          }
        case 5:
          _context3.next = 3;
          break;
        case 6:
          _context3.next = 8;
          break;
        case 7:
          _context3.prev = 7;
          _t2 = _context3["catch"](2);
          _iterator.e(_t2);
        case 8:
          _context3.prev = 8;
          _iterator.f();
          return _context3.finish(8);
        case 9:
          newOps = [];
          _iterator2 = _createForOfIteratorHelper(operations);
          _context3.prev = 10;
          _iterator2.s();
        case 11:
          if ((_step2 = _iterator2.n()).done) {
            _context3.next = 15;
            break;
          }
          _step2$value = (0, _slicedToArray2["default"])(_step2.value, 2), type = _step2$value[0], operation = _step2$value[1];
          if (!hook['preBroadcast_' + type]) {
            _context3.next = 13;
            break;
          }
          _context3.next = 12;
          return (0, _effects.call)(hook['preBroadcast_' + type], {
            operation: operation,
            username: username
          });
        case 12:
          op = _context3.sent;
          if (Array.isArray(op)) {
            _iterator3 = _createForOfIteratorHelper(op);
            try {
              for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
                o = _step3.value;
                newOps.push(o);
              }
            } catch (err) {
              _iterator3.e(err);
            } finally {
              _iterator3.f();
            }
          } else newOps.push([type, op]);
          _context3.next = 14;
          break;
        case 13:
          newOps.push([type, operation]);
        case 14:
          _context3.next = 11;
          break;
        case 15:
          _context3.next = 17;
          break;
        case 16:
          _context3.prev = 16;
          _t3 = _context3["catch"](10);
          _iterator2.e(_t3);
        case 17:
          _context3.prev = 17;
          _iterator2.f();
          return _context3.finish(17);
        case 18:
          operations = newOps;
          // status: broadcasting
          broadcastedEvent = function broadcastedEvent() {
            var _iterator4 = _createForOfIteratorHelper(operations),
              _step4;
            try {
              for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
                var _step4$value = (0, _slicedToArray2["default"])(_step4.value, 2),
                  _type = _step4$value[0],
                  _operation = _step4$value[1];
                if (hook['broadcasted_' + _type]) {
                  try {
                    hook['broadcasted_' + _type]({
                      operation: _operation
                    });
                  } catch (error) {
                    console.error(error);
                  }
                }
              }
            } catch (err) {
              _iterator4.e(err);
            } finally {
              _iterator4.f();
            }
          }; // get username
          _context3.next = 19;
          return (0, _effects.select)(function (state) {
            return state.user.get('current');
          });
        case 19:
          currentUser = _context3.sent;
          currentUsername = currentUser && currentUser.get('username');
          username = username || currentUsername;
          _context3.prev = 20;
          _context3.next = 21;
          return new Promise(function (resolve, reject) {
            // Bump transaction (for live UI testing).. Put 0 in now (no effect),
            // to enable browser's autocomplete and help prevent typos.
            var env = process.env;
            var bump = env.BROWSER ? parseInt(localStorage.getItem('bump') || 0) : 0;
            if (env.BROWSER && bump === 1) {
              // for testing
              console.log('TransactionSaga bump(no broadcast) and reject', JSON.stringify(operations, null, 2));
              setTimeout(function () {
                reject(new Error('Testing, fake error'));
              }, 2000);
            } else if (env.BROWSER && bump === 2) {
              // also for testing
              console.log('TransactionSaga bump(no broadcast) and resolve', JSON.stringify(operations, null, 2));
              setTimeout(function () {
                resolve();
                broadcastedEvent();
              }, 2000);
            } else {
              if (!(0, _SteemKeychain.isLoggedInWithKeychain)()) {
                _blurtjs.broadcast.send({
                  extensions: [],
                  operations: operations
                }, keys, function (err) {
                  if (err) {
                    console.error(err);
                    reject(err);
                  } else {
                    broadcastedEvent();
                    resolve();
                  }
                });
              } else {
                var authType = needsActiveAuth ? 'active' : 'posting';
                window.blurt_keychain.requestBroadcast(username, operations, authType, function (response) {
                  if (!response.success) {
                    reject(response.message);
                  } else {
                    broadcastedEvent();
                    resolve();
                  }
                });
              }
            }
          });
        case 21:
          // status: accepted
          _iterator5 = _createForOfIteratorHelper(operations);
          _context3.prev = 22;
          _iterator5.s();
        case 23:
          if ((_step5 = _iterator5.n()).done) {
            _context3.next = 29;
            break;
          }
          _step5$value = (0, _slicedToArray2["default"])(_step5.value, 2), _type2 = _step5$value[0], _operation2 = _step5$value[1];
          if (!hook['accepted_' + _type2]) {
            _context3.next = 27;
            break;
          }
          _context3.prev = 24;
          _context3.next = 25;
          return (0, _effects.call)(hook['accepted_' + _type2], {
            operation: _operation2
          });
        case 25:
          _context3.next = 27;
          break;
        case 26:
          _context3.prev = 26;
          _t4 = _context3["catch"](24);
          console.error(_t4);
        case 27:
          config = _operation2.__config;
          if (!(config && config.successMessage)) {
            _context3.next = 28;
            break;
          }
          _context3.next = 28;
          return (0, _effects.put)(appActions.addNotification({
            key: 'trx_' + Date.now(),
            message: config.successMessage,
            dismissAfter: 5000
          }));
        case 28:
          _context3.next = 23;
          break;
        case 29:
          _context3.next = 31;
          break;
        case 30:
          _context3.prev = 30;
          _t5 = _context3["catch"](22);
          _iterator5.e(_t5);
        case 31:
          _context3.prev = 31;
          _iterator5.f();
          return _context3.finish(31);
        case 32:
          if (successCallback) {
            try {
              successCallback();
            } catch (error) {
              console.error(error);
            }
          }
          _context3.next = 44;
          break;
        case 33:
          _context3.prev = 33;
          _t6 = _context3["catch"](20);
          console.error('TransactionSaga\tbroadcastPayload', _t6);
          // status: error
          _context3.next = 34;
          return (0, _effects.put)(transactionActions.error({
            operations: operations,
            error: _t6,
            errorCallback: errorCallback
          }));
        case 34:
          _iterator6 = _createForOfIteratorHelper(operations);
          _context3.prev = 35;
          _iterator6.s();
        case 36:
          if ((_step6 = _iterator6.n()).done) {
            _context3.next = 41;
            break;
          }
          _step6$value = (0, _slicedToArray2["default"])(_step6.value, 2), _type3 = _step6$value[0], _operation3 = _step6$value[1];
          if (!hook['error_' + _type3]) {
            _context3.next = 40;
            break;
          }
          _context3.prev = 37;
          _context3.next = 38;
          return (0, _effects.call)(hook['error_' + _type3], {
            operation: _operation3
          });
        case 38:
          _context3.next = 40;
          break;
        case 39:
          _context3.prev = 39;
          _t7 = _context3["catch"](37);
          console.error(_t7);
        case 40:
          _context3.next = 36;
          break;
        case 41:
          _context3.next = 43;
          break;
        case 42:
          _context3.prev = 42;
          _t8 = _context3["catch"](35);
          _iterator6.e(_t8);
        case 43:
          _context3.prev = 43;
          _iterator6.f();
          return _context3.finish(43);
        case 44:
        case "end":
          return _context3.stop();
      }
    }, _callee3, null, [[2, 7, 8, 9], [10, 16, 17, 18], [20, 33], [22, 30, 31, 32], [24, 26], [35, 42, 43, 44], [37, 39]]);
  })();
}
function accepted_comment(_ref4) {
  var operation = _ref4.operation;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee4() {
    var author, permlink;
    return _regenerator["default"].wrap(function (_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          author = operation.author, permlink = operation.permlink; // update again with new $$ amount from the steemd node
          _context4.next = 1;
          return (0, _effects.call)(_SagaShared.getContent, {
            author: author,
            permlink: permlink
          });
        case 1:
          _context4.next = 2;
          return (0, _effects.put)(globalActions.linkReply(operation));
        case 2:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  })();
}
function updateFollowState(action, following, state) {
  if (action == null) {
    state = state.update('blog_result', (0, _immutable.Set)(), function (r) {
      return r["delete"](following);
    });
    state = state.update('ignore_result', (0, _immutable.Set)(), function (r) {
      return r["delete"](following);
    });
  } else if (action === 'blog') {
    state = state.update('blog_result', (0, _immutable.Set)(), function (r) {
      return r.add(following);
    });
    state = state.update('ignore_result', (0, _immutable.Set)(), function (r) {
      return r["delete"](following);
    });
  } else if (action === 'ignore') {
    state = state.update('ignore_result', (0, _immutable.Set)(), function (r) {
      return r.add(following);
    });
    state = state.update('blog_result', (0, _immutable.Set)(), function (r) {
      return r["delete"](following);
    });
  }
  state = state.set('blog_count', state.get('blog_result', (0, _immutable.Set)()).size);
  state = state.set('ignore_count', state.get('ignore_result', (0, _immutable.Set)()).size);
  return state;
}
function accepted_custom_json(_ref5) {
  var operation = _ref5.operation;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee5() {
    var json, _json$, follower, following, _json$$what, action, _t9;
    return _regenerator["default"].wrap(function (_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          json = JSON.parse(operation.json);
          if (!(operation.id === 'follow')) {
            _context5.next = 4;
            break;
          }
          console.log(operation);
          _context5.prev = 1;
          if (!(json[0] === 'follow')) {
            _context5.next = 2;
            break;
          }
          _json$ = json[1], follower = _json$.follower, following = _json$.following, _json$$what = (0, _slicedToArray2["default"])(_json$.what, 1), action = _json$$what[0];
          _context5.next = 2;
          return (0, _effects.put)(globalActions.update({
            key: ['follow', 'getFollowingAsync', follower],
            notSet: (0, _immutable.Map)(),
            updater: function updater(m) {
              return updateFollowState(action, following, m);
            }
          }));
        case 2:
          _context5.next = 4;
          break;
        case 3:
          _context5.prev = 3;
          _t9 = _context5["catch"](1);
          console.error('TransactionSaga unrecognized follow custom_json format', operation.json);
        case 4:
          return _context5.abrupt("return", operation);
        case 5:
        case "end":
          return _context5.stop();
      }
    }, _callee5, null, [[1, 3]]);
  })();
}
function accepted_delete_comment(_ref6) {
  var operation = _ref6.operation;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee6() {
    return _regenerator["default"].wrap(function (_context6) {
      while (1) switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 1;
          return (0, _effects.put)(globalActions.deleteContent(operation));
        case 1:
        case "end":
          return _context6.stop();
      }
    }, _callee6);
  })();
}
function accepted_vote(_ref7) {
  var _ref7$operation = _ref7.operation,
    author = _ref7$operation.author,
    permlink = _ref7$operation.permlink,
    weight = _ref7$operation.weight;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee7() {
    return _regenerator["default"].wrap(function (_context7) {
      while (1) switch (_context7.prev = _context7.next) {
        case 0:
          console.log('Vote accepted, weight', weight, 'on', author + '/' + permlink, 'weight');
          // update again with new $$ amount from the steemd node
          _context7.next = 1;
          return (0, _effects.put)(globalActions.remove({
            key: "transaction_vote_active_".concat(author, "_").concat(permlink)
          }));
        case 1:
          _context7.next = 2;
          return (0, _effects.call)(_SagaShared.getContent, {
            author: author,
            permlink: permlink
          });
        case 2:
        case "end":
          return _context7.stop();
      }
    }, _callee7);
  })();
}
function preBroadcast_comment(_ref8) {
  var operation = _ref8.operation,
    username = _ref8.username;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee8() {
    var permlink, author, _operation$__config, originalBody, comment_options, _operation$parent_aut, parent_author, _operation$parent_per, parent_permlink, title, body, body2, patch, md, json_metadata, op, comment_op, _comment_options$max_, max_accepted_payout, _comment_options$allo, allow_votes, _comment_options$allo2, allow_curation_rewards;
    return _regenerator["default"].wrap(function (_context8) {
      while (1) switch (_context8.prev = _context8.next) {
        case 0:
          if (!operation.author) operation.author = username;
          permlink = operation.permlink;
          author = operation.author, _operation$__config = operation.__config, originalBody = _operation$__config.originalBody, comment_options = _operation$__config.comment_options;
          _operation$parent_aut = operation.parent_author, parent_author = _operation$parent_aut === void 0 ? '' : _operation$parent_aut, _operation$parent_per = operation.parent_permlink, parent_permlink = _operation$parent_per === void 0 ? operation.category : _operation$parent_per;
          title = operation.title;
          body = operation.body;
          body = body.trim();

          // TODO Slightly smaller blockchain comments: if body === json_metadata.steem.link && Object.keys(steem).length > 1 remove steem.link ..This requires an adjust of get_state and the API refresh of the comment to put the steem.link back if Object.keys(steem).length >= 1

          if (originalBody) {
            patch = createPatch(originalBody, body); // Putting body into buffer will expand Unicode characters into their true length
            if (patch && patch.length < new Buffer(body, 'utf-8').length) {
              body2 = patch;
            }
          }
          if (!body2) body2 = body;
          if (permlink) {
            _context8.next = 2;
            break;
          }
          _context8.next = 1;
          return createPermlink(title, author);
        case 1:
          permlink = _context8.sent;
        case 2:
          md = operation.json_metadata;
          json_metadata = typeof md === 'string' ? md : JSON.stringify(md);
          op = _objectSpread(_objectSpread({}, operation), {}, {
            permlink: permlink.toLowerCase(),
            parent_author: parent_author,
            parent_permlink: parent_permlink,
            json_metadata: json_metadata,
            title: (operation.title || '').trim(),
            body: body2
          });
          comment_op = [['comment', op]]; // comment_options must come directly after comment
          if (comment_options) {
            _comment_options$max_ = comment_options.max_accepted_payout, max_accepted_payout = _comment_options$max_ === void 0 ? ['1000000.000', _client_config.DEBT_TICKER].join(' ') : _comment_options$max_, _comment_options$allo = comment_options.allow_votes, allow_votes = _comment_options$allo === void 0 ? true : _comment_options$allo, _comment_options$allo2 = comment_options.allow_curation_rewards, allow_curation_rewards = _comment_options$allo2 === void 0 ? true : _comment_options$allo2;
            comment_op.push(['comment_options', {
              author: author,
              permlink: permlink,
              max_accepted_payout: max_accepted_payout,
              allow_votes: allow_votes,
              allow_curation_rewards: allow_curation_rewards,
              extensions: comment_options.extensions ? comment_options.extensions : []
            }]);
          }
          return _context8.abrupt("return", comment_op);
        case 3:
        case "end":
          return _context8.stop();
      }
    }, _callee8);
  })();
}
function createPermlink(title, author) {
  var permlink, s, slugState, noise;
  return _regenerator["default"].wrap(function (_context9) {
    while (1) switch (_context9.prev = _context9.next) {
      case 0:
        if (!(title && title.trim() !== '')) {
          _context9.next = 2;
          break;
        }
        s = slug(title);
        if (s === '') {
          s = _bs["default"].encode(_secureRandom["default"].randomBuffer(4));
        }
        // only letters numbers and dashes shall survive
        s = s.toLowerCase().replace(/[^a-z0-9-]+/g, '');

        // ensure the permlink is unique
        _context9.next = 1;
        return (0, _effects.call)([_blurtjs.api, _blurtjs.api.getContentAsync], author, s);
      case 1:
        slugState = _context9.sent;
        if (slugState.body !== '') {
          noise = _bs["default"].encode(_secureRandom["default"].randomBuffer(4)).toLowerCase();
          permlink = noise + '-' + s;
        } else {
          permlink = s;
        }

        // ensure permlink conforms to MELEKIT_MAX_PERMLINK_LENGTH
        if (permlink.length > 255) {
          permlink = permlink.substring(0, 255);
        }
        _context9.next = 3;
        break;
      case 2:
        permlink = Math.floor(Date.now() / 1000).toString(36);
      case 3:
        return _context9.abrupt("return", permlink);
      case 4:
      case "end":
        return _context9.stop();
    }
  }, _marked);
}
var dmp = new _diffMatchPatch["default"]();
function createPatch(text1, text2) {
  if (!text1 && text1 === '') return undefined;
  var patches = dmp.patch_make(text1, text2);
  var patch = dmp.patch_toText(patches);
  return patch;
}
function error_custom_json(_ref9) {
  var _ref9$operation = _ref9.operation,
    id = _ref9$operation.id,
    required_posting_auths = _ref9$operation.required_posting_auths;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee9() {
    var follower;
    return _regenerator["default"].wrap(function (_context0) {
      while (1) switch (_context0.prev = _context0.next) {
        case 0:
          if (!(id === 'follow')) {
            _context0.next = 1;
            break;
          }
          follower = required_posting_auths[0];
          _context0.next = 1;
          return (0, _effects.put)(globalActions.update({
            key: ['follow', 'getFollowingAsync', follower, 'loading'],
            updater: function updater() {
              return null;
            }
          }));
        case 1:
        case "end":
          return _context0.stop();
      }
    }, _callee9);
  })();
}
function error_vote(_ref0) {
  var _ref0$operation = _ref0.operation,
    author = _ref0$operation.author,
    permlink = _ref0$operation.permlink;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee0() {
    return _regenerator["default"].wrap(function (_context1) {
      while (1) switch (_context1.prev = _context1.next) {
        case 0:
          _context1.next = 1;
          return (0, _effects.put)(globalActions.remove({
            key: "transaction_vote_active_".concat(author, "_").concat(permlink)
          }));
        case 1:
          _context1.next = 2;
          return (0, _effects.call)(_SagaShared.getContent, {
            author: author,
            permlink: permlink
          });
        case 2:
        case "end":
          return _context1.stop();
      }
    }, _callee0);
  })();
}

// function* error_comment({operation}) {
//     // Rollback an immediate UI update (the transaction had an error)
//     yield put(g.actions.deleteContent(operation))
//     const {author, permlink, parent_author, parent_permlink} = operation
//     yield call(getContent, {author, permlink})
//     if (parent_author !== '' && parent_permlink !== '') {
//         yield call(getContent, {parent_author, parent_permlink})
//     }
// }

function slug(text) {
  return (0, _speakingurl["default"])(text.replace(/[<>]/g, ''), {
    truncate: 128
  });
}