"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireDefault(require("react"));
var _CloseButton = _interopRequireDefault(require("app/components/elements/CloseButton"));
var _reactRouter = require("react-router");
var _counterpart = _interopRequireDefault(require("counterpart"));
var _constants = require("shared/constants");
var _WelcomeChat = _interopRequireDefault(require("app/components/elements/WelcomeChat"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var WelcomePanel = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function WelcomePanel(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, WelcomePanel);
    _this = _callSuper(this, WelcomePanel, [props]);
    _this.setShowBannerFalse = props.setShowBannerFalse;
    return _this;
  }
  (0, _inherits2["default"])(WelcomePanel, _React$Component);
  return (0, _createClass2["default"])(WelcomePanel, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "welcomeWrapper"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "welcomeBanner"
      }, /*#__PURE__*/_react["default"].createElement(_CloseButton["default"], {
        onClick: this.setShowBannerFalse
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "large-1 show-for-large"
      }), /*#__PURE__*/_react["default"].createElement("div", {
        className: "small-12 medium-6 large-5 welcomePitch"
      }, /*#__PURE__*/_react["default"].createElement("h2", {
        className: "fade-in--1"
      }, (0, _counterpart["default"])('navigation.intro_tagline')), /*#__PURE__*/_react["default"].createElement("h4", {
        className: "fade-in--3"
      }, (0, _counterpart["default"])('navigation.intro_paragraph')), /*#__PURE__*/_react["default"].createElement("div", {
        className: "row buttonWrapper"
      }, /*#__PURE__*/_react["default"].createElement("a", {
        className: "button button--primary fade-in--5",
        href: _constants.SIGNUP_URL
      }, ' ', /*#__PURE__*/_react["default"].createElement("b", null, (0, _counterpart["default"])('navigation.sign_up')), ' '), /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        href: "/faq.html",
        className: "button ghost fade-in--7"
      }, /*#__PURE__*/_react["default"].createElement("b", null, (0, _counterpart["default"])('navigation.learn_more'))))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "small-12 medium-6 large-5 welcomeChatColumn"
      }, /*#__PURE__*/_react["default"].createElement(_WelcomeChat["default"], null)))));
    }
  }]);
}(_react["default"].Component);