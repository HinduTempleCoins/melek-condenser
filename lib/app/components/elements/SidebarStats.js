"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var SidebarStats = function SidebarStats(_ref) {
  var operationFlatFee = _ref.operationFlatFee,
    bandwidthKbytesFee = _ref.bandwidthKbytesFee;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__module"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__header"
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    className: "c-sidebar__h3"
  }, "Transaction Fees")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__content"
  }, /*#__PURE__*/_react["default"].createElement("ul", {
    className: "c-sidebar__list-small"
  }, /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", null, "Operation Flat Fee"), /*#__PURE__*/_react["default"].createElement("span", null, operationFlatFee, " MELEK"))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/_react["default"].createElement("div", null, "Bandwidth Fee"), /*#__PURE__*/_react["default"].createElement("span", null, bandwidthKbytesFee, " MELEK"))))));
};
var _default = exports["default"] = SidebarStats;