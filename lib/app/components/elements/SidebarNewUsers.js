"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var _constants = require("shared/constants");
var SidebarNewUsers = function SidebarNewUsers() {
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__module"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__header"
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    className: "c-sidebar__h3"
  }, "Explore MELEK?")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__content"
  }, /*#__PURE__*/_react["default"].createElement("ul", {
    className: "c-sidebar__list"
  }, /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: "/welcome"
  }, "Quick start guide")), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: $STM_Config.wiki_url,
    target: "_blank",
    rel: "noopener noreferrer"
  }, "Wiki / FAQ")), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: "/chat"
  }, "Community Chat")), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: "https://blocks.blurtwallet.com"
  }, "Block Explorer")), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: "https://blurtwallet.com/~witnesses"
  }, "Vote for Witnesses")), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: "https://blurtwallet.com/proposals"
  }, "Proposals")))));
};
var _default = exports["default"] = SidebarNewUsers;