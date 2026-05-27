"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireDefault(require("react"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var _client_config = require("app/client_config");
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var Support = /*#__PURE__*/function (_React$Component) {
  function Support() {
    (0, _classCallCheck2["default"])(this, Support);
    return _callSuper(this, Support, arguments);
  }
  (0, _inherits2["default"])(Support, _React$Component);
  return (0, _createClass2["default"])(Support, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("h2", null, (0, _counterpart["default"])('g.APP_NAME_support', {
        APP_NAME: _client_config.APP_NAME
      })), /*#__PURE__*/_react["default"].createElement("p", null, (0, _counterpart["default"])('g.please_email_questions_to'), ' ', /*#__PURE__*/_react["default"].createElement("a", {
        href: "mailto:info@melek.salon"
      }, "info@melek.salon"), ".")));
    }
  }]);
}(_react["default"].Component);
module.exports = {
  path: 'support.html',
  component: Support
};