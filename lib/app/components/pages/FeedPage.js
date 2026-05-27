"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _PostSummary = _interopRequireDefault(require("../cards/PostSummary"));
var FeedPage = function FeedPage(_ref) {
  var content = _ref.content,
    discussionIdx = _ref.discussionIdx;
  var created = discussionIdx.getIn(['created', ''], List());
  if (!created.size) return /*#__PURE__*/_react["default"].createElement("div", null, "No posts found.");
  var posts = created.map(function (key) {
    return content.get(key);
  }).filter(Boolean);
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "FeedPage"
  }, posts.size === 0 && /*#__PURE__*/_react["default"].createElement("div", null, "No posts available."), posts.map(function (post) {
    return /*#__PURE__*/_react["default"].createElement(_PostSummary["default"], {
      key: post.get('permlink'),
      post: post.toJS()
    });
  }));
};
var mapStateToProps = function mapStateToProps(state) {
  return {
    content: state.global.get('content'),
    discussionIdx: state.global.get('discussion_idx')
  };
};
var _default = exports["default"] = (0, _reactRedux.connect)(mapStateToProps)(FeedPage);