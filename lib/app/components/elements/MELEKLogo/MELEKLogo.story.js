"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _react = _interopRequireDefault(require("react"));
var _react2 = require("@storybook/react");
var _addonKnobs = require("@storybook/addon-knobs");
var _index = _interopRequireDefault(require("./index"));
var _decorators = require("decorators");
(0, _react2.storiesOf)('Elements', module).addDecorator(_addonKnobs.withKnobs).addDecorator(_decorators.Center).add('MELEKLogo', function () {
  return /*#__PURE__*/_react["default"].createElement(_index["default"], null);
});