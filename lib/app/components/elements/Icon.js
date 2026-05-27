"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.icons = exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var icons = exports.icons = ['user', 'share', 'chevron-up-circle', 'chevron-down-circle', 'chevron-left', 'chatboxes', 'chatbox', 'close', 'facebook', 'twitter', 'reddit', 'linkedin', 'link', 'logo', 'logotype', 'clock', 'extlink', 'ether', 'bitcoin', 'bitshares', 'dropdown-arrow', 'printer', 'search', 'menu', 'voter', 'voters', 'empty', 'flag1', 'flag2', 'reblog', 'photo', 'line', 'video', 'eye', 'location', 'calendar', 'chain', 'wallet', 'cog', 'quill', 'key', 'enter', 'profile', 'replies', 'home', 'reply', '100', 'pencil2', 'pin', 'pin-disabled', 'melek', 'notification', 'transfer', 'witness', 'alert'];
var icons_map = {};
for (var _i = 0, _icons = icons; _i < _icons.length; _i++) {
  var i = _icons[_i];
  icons_map[i] = require("assets/icons/".concat(i, ".svg"));
}
var rem_sizes = {
  '1x': '1.12',
  '1_5x': '1.5',
  '2x': '2',
  '3x': '3.45',
  '4x': '4.60',
  '5x': '5.75',
  '10x': '10.0'
};
var Icon = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function Icon() {
    (0, _classCallCheck2["default"])(this, Icon);
    return _callSuper(this, Icon, arguments);
  }
  (0, _inherits2["default"])(Icon, _React$Component);
  return (0, _createClass2["default"])(Icon, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
        name = _this$props.name,
        size = _this$props.size,
        className = _this$props.className;
      var classes = 'Icon ' + name;
      var style = {
        display: 'inline-block',
        width: "".concat(rem_sizes['1x'], "rem"),
        height: "".concat(rem_sizes['1x'], "rem")
      };
      if (size) {
        classes += ' Icon_' + size;
        style = {
          display: 'inline-block',
          width: "".concat(rem_sizes[size], "rem"),
          height: "".concat(rem_sizes[size], "rem")
        };
      }
      if (className) {
        classes += ' ' + className;
      }
      return /*#__PURE__*/_react["default"].createElement("span", {
        className: classes,
        style: style,
        dangerouslySetInnerHTML: {
          __html: icons_map[name]
        }
      });
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(Icon, "propTypes", {
  name: _propTypes["default"].string.isRequired,
  size: _propTypes["default"].oneOf(['1x', '1_5x', '2x', '3x', '4x', '5x', '10x']),
  inverse: _propTypes["default"].bool,
  className: _propTypes["default"].string
});