"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var _reactRouter = require("react-router");
var _TimeAgoWrapper = _interopRequireDefault(require("app/components/elements/TimeAgoWrapper"));
var Notice = function Notice(_ref) {
  var notice = _ref.notice;
  if (!notice || !notice.title) {
    return null;
  }
  var url = notice.permalink ? "/@".concat(notice.author, "/").concat(notice.permlink) : notice.url;
  var tag = notice.tag ? /*#__PURE__*/_react["default"].createElement("p", {
    className: "Notices__featured"
  }, notice.tag) : null;
  var title = url ? /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
    className: "Notices__title-link",
    to: url
  }, notice.title) : notice.title;
  var by = notice.author ? /*#__PURE__*/_react["default"].createElement("span", {
    className: "Notices__by"
  }, " ", (0, _counterpart["default"])('g.by'), "\xA0") : null;
  var author = notice.author ? /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
    className: "Notices__author-link",
    to: '/@' + notice.author
  }, notice.author) : null;
  var date = notice.created ? /*#__PURE__*/_react["default"].createElement("span", null, ' . ', /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
    date: notice.created
  })) : null;
  return /*#__PURE__*/_react["default"].createElement("li", {
    className: "Notices__notice"
  }, tag, /*#__PURE__*/_react["default"].createElement("p", {
    className: "Notices__title"
  }, title), /*#__PURE__*/_react["default"].createElement("p", {
    className: "Notices__metadata"
  }, by, author, date));
};
var MELEKNotices = function MELEKNotices(_ref2) {
  var notices = _ref2.notices;
  if (!notices || notices.length === 0) {
    return null;
  }
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__module"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__header"
  }, /*#__PURE__*/_react["default"].createElement("h3", {
    className: "c-sidebar__h3"
  }, "Updates Log")), /*#__PURE__*/_react["default"].createElement("div", {
    className: "c-sidebar__content"
  }, /*#__PURE__*/_react["default"].createElement("ul", {
    className: "Notices"
  }, notices.map(function (notice, i) {
    return /*#__PURE__*/_react["default"].createElement(Notice, {
      key: i,
      notice: notice
    });
  }))));
};
var _default = exports["default"] = MELEKNotices;