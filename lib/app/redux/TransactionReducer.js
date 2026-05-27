"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.confirmOperation = exports.broadcastOperation = exports.BROADCAST_OPERATION = void 0;
exports["default"] = reducer;
exports.set = exports.remove = exports.hideConfirm = exports.error = exports.dismissError = exports.deleteError = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _immutable = require("immutable");
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e && r && "number" == typeof r.length) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
// Action constants
var CONFIRM_OPERATION = 'transaction/CONFIRM_OPERATION';
var HIDE_CONFIRM = 'transaction/HIDE_CONFIRM';
var BROADCAST_OPERATION = exports.BROADCAST_OPERATION = 'transaction/BROADCAST_OPERATION';
var ERROR = 'transaction/ERROR'; // Has a watcher in SagaShared
var DELETE_ERROR = 'transaction/DELETE_ERROR';
var DISMISS_ERROR = 'transaction/DISMISS_ERROR';
var SET = 'transaction/SET';
var REMOVE = 'transaction/REMOVE';
// Saga-related
var defaultState = (0, _immutable.fromJS)({
  operations: [],
  status: {
    key: '',
    error: false,
    busy: false
  },
  errors: {
    bandwidthError: false,
    transactionFeeError: false
  }
});
function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 ? arguments[1] : undefined;
  var payload = action.payload;
  switch (action.type) {
    case CONFIRM_OPERATION:
      {
        var operation = (0, _immutable.fromJS)(payload.operation);
        var confirm = payload.confirm;
        var warning = payload.warning;
        return state.merge({
          show_confirm_modal: true,
          confirmBroadcastOperation: operation,
          confirmErrorCallback: payload.errorCallback,
          confirm: confirm,
          warning: warning
        });
      }
    case HIDE_CONFIRM:
      return state.merge({
        show_confirm_modal: false,
        confirmBroadcastOperation: undefined,
        confirm: undefined
      });
    case BROADCAST_OPERATION:
      // See TransactionSaga.js
      return state;
    case ERROR:
      {
        var operations = payload.operations,
          _error = payload.error,
          errorCallback = payload.errorCallback;
        var errorStr = _error.toString();
        var errorKey = 'Transaction broadcast error.';
        var _iterator = _createForOfIteratorHelper(operations),
          _step;
        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var _step$value = (0, _slicedToArray2["default"])(_step.value, 1),
              type = _step$value[0];
            switch (type) {
              case 'vote':
                if (/uniqueness constraint/.test(errorStr)) {
                  errorKey = 'You already voted for this post';
                  console.error('You already voted for this post.');
                }
                if (/Voting weight is too small/.test(errorStr)) {
                  errorKey = 'Voting weight is too small';
                  errorStr = 'Voting weight is too small, please accumulate more voting power or blurt power.';
                }
                break;
              case 'comment':
                if (/You may only post once per minute/.test(errorStr)) {
                  errorKey = 'You may only post once per minute.';
                } else if (errorStr === 'Testing, fake error') {
                  errorKey = 'Testing, fake error';
                }
                break;
              default:
                break;
            }
            if (state.hasIn(['TransactionError', type + '_listener'])) {
              state = state.setIn(['TransactionError', type], (0, _immutable.fromJS)({
                key: errorKey,
                exception: errorStr
              }));
            } else {
              if (_error.message) {
                // TODO: This reformatting could be better, in most cases, errorKey and errorString end up being similar if not identical.
                // Depends on FC_ASSERT formatting
                // https://github.com/steemit/blurt.world/issues/222
                var err_lines = _error.message.split('\n');
                if (err_lines.length > 2) {
                  errorKey = err_lines[1];
                  var txt = errorKey.split(': ');
                  if (txt.length && txt[txt.length - 1].trim() !== '') {
                    errorKey = errorStr = txt[txt.length - 1];
                  } else {
                    errorStr = "Transaction failed: ".concat(err_lines[1]);
                  }
                }
              }
              // TODO: This would perhaps be better expressed as a Case, Switch statement.
              // TODO: The precise reason for why this clipping needs to happen is unclear.
              if (errorStr.length > 200) {
                errorStr = errorStr.substring(0, 200);
              }
              // Catch for unknown key better error handling
              if (/unknown key: /.test(errorKey)) {
                errorKey = "MELEK account doesn't exist.";
                errorStr = "Transaction failed: MELEK account doesn't exist.";
              }
              // Catch for invalid active authority
              if (/Missing Active Authority /.test(errorKey)) {
                errorKey = 'Not your valid active key.';
                errorStr = 'Transaction failed: Not your valid active key.';
              }
              // TODO: refactor this so that the keys are consistent and sane, i.e. do not include user name in error key.
              state = state.update('errors', function (errors) {
                return errors ? errors.set(errorKey, errorStr) : (0, _immutable.Map)((0, _defineProperty2["default"])({}, errorKey, errorStr));
              });
              // Sane error key for the bandwidth error.
              if (errorKey.includes('bandwidth') || errorStr.includes('bandwidth') || errorStr.includes('RC') // Error key for HF-20 insufficient RC error, #3001.
              ) {
                state = state.setIn(['errors', 'bandwidthError'], true);
              }
              if (errorStr.includes('transaction fee')) {
                state = state.setIn(['errors', 'transactionFeeError'], true);
              }
            }
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
        if (errorCallback) {
          errorCallback(errorKey);
        } else {
          throw new Error('PANIC: no callback registered to handle error ' + errorKey);
        }
        return state;
      }
    case DELETE_ERROR:
      return state.deleteIn(['errors', payload.key]);
    case DISMISS_ERROR:
      return state.setIn(['errors', payload.key], false);
    case SET:
      return state.setIn(Array.isArray(payload.key) ? payload.key : [payload.key], (0, _immutable.fromJS)(payload.value));
    case REMOVE:
      return state.removeIn(Array.isArray(payload.key) ? payload.key : [payload.key]);
    default:
      return state;
  }
}

// Action creators
var confirmOperation = exports.confirmOperation = function confirmOperation(payload) {
  return {
    type: CONFIRM_OPERATION,
    payload: payload
  };
};
var hideConfirm = exports.hideConfirm = function hideConfirm(payload) {
  return {
    type: HIDE_CONFIRM,
    payload: payload
  };
};
var broadcastOperation = exports.broadcastOperation = function broadcastOperation(payload) {
  return {
    type: BROADCAST_OPERATION,
    payload: payload
  };
};
var error = exports.error = function error(payload) {
  return {
    type: ERROR,
    payload: payload
  };
};
var deleteError = exports.deleteError = function deleteError(payload) {
  return {
    type: DELETE_ERROR,
    payload: payload
  };
};
var dismissError = exports.dismissError = function dismissError(payload) {
  return {
    type: DISMISS_ERROR,
    payload: payload
  };
};
var set = exports.set = function set(payload) {
  return {
    type: SET,
    payload: payload
  };
};
var remove = exports.remove = function remove(payload) {
  return {
    type: REMOVE,
    payload: payload
  };
};