"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _counterpart = _interopRequireDefault(require("counterpart"));
var userActions = _interopRequireWildcard(require("app/redux/UserReducer"));
var appActions = _interopRequireWildcard(require("app/redux/AppReducer"));
var _UserList = _interopRequireDefault(require("app/components/elements/UserList"));
var blurt = _interopRequireWildcard(require("@blurtfoundation/blurtjs"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var Settings = /*#__PURE__*/function (_React$Component) {
  function Settings(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, Settings);
    _this = _callSuper(this, Settings, [props]);
    (0, _defineProperty2["default"])(_this, "handleDefaultBlogPayoutChange", function (event) {
      _this.props.setUserPreferences(_objectSpread(_objectSpread({}, _this.props.user_preferences), {}, {
        defaultBlogPayout: event.target.value
      }));
    });
    (0, _defineProperty2["default"])(_this, "handleDefaultCommentPayoutChange", function (event) {
      _this.props.setUserPreferences(_objectSpread(_objectSpread({}, _this.props.user_preferences), {}, {
        defaultCommentPayout: event.target.value
      }));
    });
    (0, _defineProperty2["default"])(_this, "handleLanguageChange", function (event) {
      var locale = event.target.value;
      var userPreferences = _objectSpread(_objectSpread({}, _this.props.user_preferences), {}, {
        locale: locale
      });
      _this.props.setUserPreferences(userPreferences);
    });
    (0, _defineProperty2["default"])(_this, "getPreferredApiEndpoint", function () {
      var preferred_api_endpoint = $STM_Config.blurtd_connection_client;
      if (typeof window !== 'undefined' && localStorage.getItem('user_preferred_api_endpoint')) {
        preferred_api_endpoint = localStorage.getItem('user_preferred_api_endpoint');
      }
      return preferred_api_endpoint;
    });
    (0, _defineProperty2["default"])(_this, "generateAPIEndpointOptions", function () {
      var endpoints = blurt.config.get('alternative_api_endpoints');
      if (endpoints === null || endpoints === undefined) {
        return null;
      }
      var preferred_api_endpoint = _this.getPreferredApiEndpoint();
      var entries = [];
      for (var ei = 0; ei < endpoints.length; ei += 1) {
        var endpoint = endpoints[ei];

        //this one is always present even if the api config call fails
        if (endpoint !== preferred_api_endpoint) {
          var entry = /*#__PURE__*/_react["default"].createElement("option", {
            value: endpoint,
            key: endpoint
          }, endpoint);
          entries.push(entry);
        }
      }
      return entries;
    });
    (0, _defineProperty2["default"])(_this, "handlePreferredAPIEndpointChange", function (event) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_preferred_api_endpoint', event.target.value);
        blurt.api.setOptions({
          url: event.target.value
        });
      }
    });
    _this.state = {
      errorMessage: '',
      successMessage: ''
    };
    _this.onNsfwPrefChange = _this.onNsfwPrefChange.bind(_this);
    return _this;
  }
  (0, _inherits2["default"])(Settings, _React$Component);
  return (0, _createClass2["default"])(Settings, [{
    key: "onNsfwPrefChange",
    value: function onNsfwPrefChange(e) {
      this.props.setUserPreferences(_objectSpread(_objectSpread({}, this.props.user_preferences), {}, {
        nsfwPref: e.currentTarget.value
      }));
    }
  }, {
    key: "render",
    value: function render() {
      var state = this.state,
        props = this.props;
      var _this$props = this.props,
        walletUrl = _this$props.walletUrl,
        ignores = _this$props.ignores,
        account = _this$props.account,
        isOwnAccount = _this$props.isOwnAccount,
        user_preferences = _this$props.user_preferences;
      var preferred_api_endpoint = this.getPreferredApiEndpoint();
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "Settings"
      }, isOwnAccount && /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "small-12 columns"
      }, /*#__PURE__*/_react["default"].createElement("p", null, "To update your public profile, visit", ' ', /*#__PURE__*/_react["default"].createElement("a", {
        href: walletUrl + '/@' + account.name + '/settings'
      }, "wallet.melek.salon"), ".")), /*#__PURE__*/_react["default"].createElement("hr", null), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("div", {
        className: "small-12 medium-4 large-4 columns"
      }, /*#__PURE__*/_react["default"].createElement("h4", null, (0, _counterpart["default"])('settings_jsx.preferences')), /*#__PURE__*/_react["default"].createElement("label", null, (0, _counterpart["default"])('g.choose_language'), /*#__PURE__*/_react["default"].createElement("select", {
        defaultValue: user_preferences.locale,
        onChange: this.handleLanguageChange
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: "en"
      }, "English"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "es"
      }, "Spanish Espa\xF1ol"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "ru"
      }, "Russian \u0440\u0443\u0441\u0441\u043A\u0438\u0439"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "fr"
      }, "French fran\xE7ais"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "it"
      }, "Italian italiano"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "ko"
      }, "Korean \uD55C\uAD6D\uC5B4"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "ja"
      }, "Japanese \u65E5\u672C\u8A9E"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "pl"
      }, "Polish"), /*#__PURE__*/_react["default"].createElement("option", {
        value: "zh"
      }, "Chinese \u7B80\u4F53\u4E2D\u6587"))), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("label", null, (0, _counterpart["default"])('g.choose_preferred_endpoint'), /*#__PURE__*/_react["default"].createElement("select", {
        defaultValue: preferred_api_endpoint,
        onChange: this.handlePreferredAPIEndpointChange
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: preferred_api_endpoint
      }, preferred_api_endpoint), this.generateAPIEndpointOptions())), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("label", null, (0, _counterpart["default"])('settings_jsx.not_safe_for_work_nsfw_content')), /*#__PURE__*/_react["default"].createElement("select", {
        value: user_preferences.nsfwPref,
        onChange: this.onNsfwPrefChange
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: "hide"
      }, (0, _counterpart["default"])('settings_jsx.always_hide')), /*#__PURE__*/_react["default"].createElement("option", {
        value: "warn"
      }, (0, _counterpart["default"])('settings_jsx.always_warn')), /*#__PURE__*/_react["default"].createElement("option", {
        value: "show"
      }, (0, _counterpart["default"])('settings_jsx.always_show'))), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("label", null, (0, _counterpart["default"])('settings_jsx.choose_default_blog_payout'), /*#__PURE__*/_react["default"].createElement("select", {
        defaultValue: user_preferences.defaultBlogPayout || '100%',
        onChange: this.handleDefaultBlogPayoutChange
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: "0%"
      }, (0, _counterpart["default"])('reply_editor.decline_payout')), /*#__PURE__*/_react["default"].createElement("option", {
        value: "100%"
      }, (0, _counterpart["default"])('reply_editor.power_up_100')))), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("label", null, (0, _counterpart["default"])('settings_jsx.choose_default_comment_payout'), /*#__PURE__*/_react["default"].createElement("select", {
        defaultValue: user_preferences.defaultCommentPayout || '100%',
        onChange: this.handleDefaultCommentPayoutChange
      }, /*#__PURE__*/_react["default"].createElement("option", {
        value: "0%"
      }, (0, _counterpart["default"])('reply_editor.decline_payout')), /*#__PURE__*/_react["default"].createElement("option", {
        value: "100%"
      }, (0, _counterpart["default"])('reply_editor.power_up_100')))), /*#__PURE__*/_react["default"].createElement("br", null))), ignores && ignores.size > 0 && /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "small-12 medium-6 large-6 columns"
      }, /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement(_UserList["default"], {
        title: (0, _counterpart["default"])('settings_jsx.muted_users'),
        users: ignores
      }))));
    }
  }]);
}(_react["default"].Component);
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, ownProps) {
  var accountname = ownProps.routeParams.accountname;
  var isOwnAccount = state.user.getIn(['current', 'username'], '') == accountname;
  var ignores = isOwnAccount && state.global.getIn(['follow', 'getFollowingAsync', accountname, 'ignore_result']);
  return _objectSpread({
    accountname: accountname,
    isOwnAccount: isOwnAccount,
    ignores: ignores,
    account: state.global.getIn(['accounts', accountname]).toJS(),
    user_preferences: state.app.get('user_preferences').toJS(),
    walletUrl: state.app.get('walletUrl')
  }, ownProps);
}, function (dispatch) {
  return {
    changeLanguage: function changeLanguage(language) {
      dispatch(userActions.changeLanguage(language));
    },
    setUserPreferences: function setUserPreferences(payload) {
      dispatch(appActions.setUserPreferences(payload));
    }
  };
})(Settings);