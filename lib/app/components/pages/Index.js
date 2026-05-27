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
var _SvgImage = _interopRequireDefault(require("app/components/elements/SvgImage"));
var _Translator = require("app/Translator");
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var Index = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function Index() {
    (0, _classCallCheck2["default"])(this, Index);
    return _callSuper(this, Index, arguments);
  }
  (0, _inherits2["default"])(Index, _React$Component);
  return (0, _createClass2["default"])(Index, [{
    key: "render",
    value: function render() {
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "Index"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "text-center"
      }, /*#__PURE__*/_react["default"].createElement(_SvgImage["default"], {
        name: "melek",
        width: "480px",
        height: "240px"
      })), /*#__PURE__*/_react["default"].createElement("h1", {
        className: "center text-center"
      }, (0, _Translator.translateHtml)('APP_NAME_is_a_social_media_platform_where_everyone_gets_paid_for_creating_and_curating_content'), "."), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("br", null));
    }
  }]);
}(_react["default"].Component);