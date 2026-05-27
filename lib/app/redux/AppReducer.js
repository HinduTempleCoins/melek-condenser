"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addNotification = exports.TOGGLE_NIGHTMODE = exports.TOGGLE_BLOGMODE = exports.SET_USER_PREFERENCES = exports.RECEIVE_FEATURE_FLAGS = void 0;
exports["default"] = reducer;
exports.toggleNightmode = exports.toggleBlogmode = exports.steemApiError = exports.setUserPreferences = exports.selectors = exports.removeNotification = exports.receiveFeatureFlags = exports.fetchDataEnd = exports.fetchDataBegin = exports.defaultState = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _immutable = require("immutable");
var _counterpart = _interopRequireDefault(require("counterpart"));
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var MELEK_API_ERROR = 'app/MELEK_API_ERROR';
var FETCH_DATA_BEGIN = 'app/FETCH_DATA_BEGIN';
var FETCH_DATA_END = 'app/FETCH_DATA_END';
var ADD_NOTIFICATION = 'app/ADD_NOTIFICATION';
var REMOVE_NOTIFICATION = 'app/REMOVE_NOTIFICATION';
var SET_USER_PREFERENCES = exports.SET_USER_PREFERENCES = 'app/SET_USER_PREFERENCES';
var TOGGLE_NIGHTMODE = exports.TOGGLE_NIGHTMODE = 'app/TOGGLE_NIGHTMODE';
var TOGGLE_BLOGMODE = exports.TOGGLE_BLOGMODE = 'app/TOGGLE_BLOGMODE';
var RECEIVE_FEATURE_FLAGS = exports.RECEIVE_FEATURE_FLAGS = 'app/RECEIVE_FEATURE_FLAGS';
var defaultState = exports.defaultState = (0, _immutable.Map)({
  loading: false,
  error: '',
  location: {},
  notifications: null,
  user_preferences: (0, _immutable.Map)({
    locale: null,
    nsfwPref: 'warn',
    nightmode: false,
    blogmode: false,
    currency: 'USD',
    defaultBlogPayout: '50%',
    defaultCommentPayout: '50%'
  }),
  featureFlags: (0, _immutable.Map)({})
});
function reducer() {
  var state = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : defaultState;
  var action = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  switch (action.type) {
    case '@@router/LOCATION_CHANGE':
      return state.set('location', {
        pathname: action.payload.pathname
      });
    case MELEK_API_ERROR:
      // Until we figure out how to better handle these errors, let em slide.
      // This action is the only part of the app that marks an error in state.app.error,
      // and the only part of the app which pays attn to this part of the state is in App.jsx.
      // return  state.set('error', action.error).set('loading', false);
      // It is also worth noting that showTransactionErrorNotification in SagaShared
      // Will check state.transaction.errors and create a notification for whatever it finds there.
      // While TransactionReducer will add items to state.transaction.errors.
      return state;
    case FETCH_DATA_BEGIN:
      return state.set('loading', true);
    case FETCH_DATA_END:
      return state.set('loading', false);
    case ADD_NOTIFICATION:
      {
        var n = _objectSpread({
          action: (0, _counterpart["default"])('g.dismiss'),
          dismissAfter: 10000
        }, action.payload);
        return state.update('notifications', function (s) {
          return s ? s.set(n.key, n) : (0, _immutable.OrderedMap)((0, _defineProperty2["default"])({}, n.key, n));
        });
      }
    case REMOVE_NOTIFICATION:
      return state.update('notifications', function (s) {
        return s["delete"](action.payload.key);
      });
    case SET_USER_PREFERENCES:
      return state.set('user_preferences', (0, _immutable.Map)(action.payload));
    case TOGGLE_NIGHTMODE:
      return state.setIn(['user_preferences', 'nightmode'], !state.getIn(['user_preferences', 'nightmode']));
    case TOGGLE_BLOGMODE:
      return state.setIn(['user_preferences', 'blogmode'], !(state.getIn(['user_preferences', 'blogmode']) === undefined ? true : state.getIn(['user_preferences', 'blogmode'])));
    case RECEIVE_FEATURE_FLAGS:
      var newFlags = state.get('featureFlags') ? state.get('featureFlags').merge(action.flags) : (0, _immutable.Map)(action.flags);
      return state.set('featureFlags', newFlags);
    default:
      return state;
  }
}
var steemApiError = exports.steemApiError = function steemApiError(error) {
  return {
    type: MELEK_API_ERROR,
    error: error
  };
};
var fetchDataBegin = exports.fetchDataBegin = function fetchDataBegin() {
  return {
    type: FETCH_DATA_BEGIN
  };
};
var fetchDataEnd = exports.fetchDataEnd = function fetchDataEnd() {
  return {
    type: FETCH_DATA_END
  };
};
var addNotification = exports.addNotification = function addNotification(payload) {
  return {
    type: ADD_NOTIFICATION,
    payload: payload
  };
};
var removeNotification = exports.removeNotification = function removeNotification(payload) {
  return {
    type: REMOVE_NOTIFICATION,
    payload: payload
  };
};
var setUserPreferences = exports.setUserPreferences = function setUserPreferences(payload) {
  return {
    type: SET_USER_PREFERENCES,
    payload: payload
  };
};
var toggleNightmode = exports.toggleNightmode = function toggleNightmode() {
  return {
    type: TOGGLE_NIGHTMODE
  };
};
var toggleBlogmode = exports.toggleBlogmode = function toggleBlogmode() {
  return {
    type: TOGGLE_BLOGMODE
  };
};
var receiveFeatureFlags = exports.receiveFeatureFlags = function receiveFeatureFlags(flags) {
  return {
    type: RECEIVE_FEATURE_FLAGS,
    flags: flags
  };
};
var selectors = exports.selectors = {
  getFeatureFlag: function getFeatureFlag(state, flagName) {
    return state.getIn(['featureFlags', flagName], false);
  }
};