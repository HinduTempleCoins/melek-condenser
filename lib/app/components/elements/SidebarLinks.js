"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var SidebarLinks = function SidebarLinks(_ref) {
  var username = _ref.username;
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__module"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__header"
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    className: "c-sidebar__h3"
  }, (0, _counterpart["default"])('g.links'))), /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__content"
  }, /*#__PURE__*/_react["default"].createElement("ul", {
    className: "c-sidebar__list"
  }, /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item",
    key: "feed"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: "/@".concat(username, "/feed")
  }, (0, _counterpart["default"])('g.my_feed'))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: '/@' + username
  }, (0, _counterpart["default"])('g.my_blog'))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: '/@' + username + '/notifications'
  }, (0, _counterpart["default"])('g.my_notifications'))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: 'https://blurtwallet.com/@' + username + ''
  }, (0, _counterpart["default"])('g.my_wallet'))), /*#__PURE__*/_react["default"].createElement("li", {
    className: "c-sidebar__list-item"
  }, /*#__PURE__*/_react["default"].createElement("a", {
    className: "c-sidebar__link",
    href: 'https://blocks.blurtwallet.com/#/@' + username
  }, (0, _counterpart["default"])('g.my_explorer'))), /*#__PURE__*/_react["default"].createElement("li", {
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
  }))));
};
var _default = exports["default"] = SidebarLinks;