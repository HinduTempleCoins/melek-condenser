"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Comment = _interopRequireWildcard(require("app/components/cards/Comment"));
var _PostFull = _interopRequireDefault(require("app/components/cards/PostFull"));
var _Accessors = require("app/utils/Accessors");
var _ExtractContent = _interopRequireDefault(require("app/utils/ExtractContent"));
var _reactRedux = require("react-redux");
var _DropdownMenu = _interopRequireDefault(require("app/components/elements/DropdownMenu"));
var _immutable = require("immutable");
var _counterpart = _interopRequireDefault(require("counterpart"));
var _shouldComponentUpdate = _interopRequireDefault(require("app/utils/shouldComponentUpdate"));
var _ServerApiClient = require("app/utils/ServerApiClient");
var _client_config = require("app/client_config");
var _constants = require("shared/constants");
var _GptAd = _interopRequireDefault(require("app/components/elements/GptAd"));
var _UserUtil = require("app/utils/UserUtil");
var _reactAdsense = _interopRequireDefault(require("react-adsense"));
var _Icon = _interopRequireDefault(require("app/components/elements/Icon"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var Post = /*#__PURE__*/function (_React$Component) {
  function Post() {
    var _this;
    (0, _classCallCheck2["default"])(this, Post);
    _this = _callSuper(this, Post);
    (0, _defineProperty2["default"])(_this, "toggleNegativeReplies", function (e) {
      _this.setState({
        showNegativeComments: !_this.state.showNegativeComments
      });
      e.preventDefault();
    });
    (0, _defineProperty2["default"])(_this, "onHideComment", function () {
      _this.setState({
        commentHidden: true
      });
    });
    (0, _defineProperty2["default"])(_this, "showAnywayClick", function () {
      _this.setState({
        showAnyway: true
      });
    });
    _this.state = {
      showNegativeComments: false
    };
    _this.showSignUp = function () {
      (0, _ServerApiClient.serverApiRecordEvent)('SignUp', 'Post Promo');
      window.location = _constants.SIGNUP_URL;
    };
    return _this;
  }
  (0, _inherits2["default"])(Post, _React$Component);
  return (0, _createClass2["default"])(Post, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      if (!this.props.enabled) {
        return;
      }
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var showSignUp = this.showSignUp;
      var _this$props = this.props,
        content = _this$props.content,
        sortOrder = _this$props.sortOrder;
      var _this$state = this.state,
        showNegativeComments = _this$state.showNegativeComments,
        commentHidden = _this$state.commentHidden,
        showAnyway = _this$state.showAnyway;
      var post = this.props.post;
      if (!post) {
        var route_params = this.props.routeParams;
        post = route_params.username + '/' + route_params.slug;
      }
      var dis = content.get(post);

      // check if the post doesn't exist
      // !dis may be enough but keep 'created' & 'body' test for potential compatibility
      var emptyPost = !dis || dis.get('created') === '1970-01-01T00:00:00' && dis.get('body') === '';
      if (emptyPost) return /*#__PURE__*/_react["default"].createElement("div", {
        className: "NotFound float-center"
      }, /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
        name: "melek",
        size: "4x"
      }), /*#__PURE__*/_react["default"].createElement("h4", {
        className: "NotFound__header"
      }, "Sorry! This page doesn't exist."), /*#__PURE__*/_react["default"].createElement("p", null, "Not to worry. You can head back to", ' ', /*#__PURE__*/_react["default"].createElement("a", {
        style: {
          fontWeight: 800
        },
        href: "/"
      }, "our homepage"), ", or check out some great posts."), /*#__PURE__*/_react["default"].createElement("ul", {
        className: "NotFound__menu"
      }, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
        href: "/created"
      }, "new posts")), /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
        href: "/hot"
      }, "hot posts")), /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
        href: "/trending"
      }, "trending posts")), /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
        href: "/promoted"
      }, "promoted posts")), /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
        href: "/active"
      }, "active posts")))));

      // TODO: This data model needs some help.
      var post_content = content.get(post);
      var p = (0, _ExtractContent["default"])(_Accessors.immutableAccessor, post_content);
      var tags = p.json_metadata.tags;

      // A post should be hidden if it is not special, is not told to "show
      // anyway", and is designated "gray".
      var special = dis.get('special');
      if (!special && !showAnyway) {
        var _dis$get$toJS = dis.get('stats').toJS(),
          gray = _dis$get$toJS.gray;
        if (gray) {
          return /*#__PURE__*/_react["default"].createElement("div", {
            className: "Post"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "row"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "column"
          }, /*#__PURE__*/_react["default"].createElement("div", {
            className: "PostFull"
          }, /*#__PURE__*/_react["default"].createElement("p", {
            onClick: this.showAnywayClick
          }, (0, _counterpart["default"])('promote_post_jsx.this_post_was_hidden_due_to_low_ratings'), ".", ' ', /*#__PURE__*/_react["default"].createElement("button", {
            style: {
              marginBottom: 0
            },
            className: "button hollow tiny float-right",
            onClick: this.showAnywayClick
          }, (0, _counterpart["default"])('g.show')))))));
        }
      }
      var replies = dis.get('replies').toJS();
      (0, _Comment.sortComments)(content, replies, sortOrder);

      // Don't render too many comments on server-side
      var commentLimit = 100;
      if (global.process !== undefined && replies.length > commentLimit) {
        replies = replies.slice(0, commentLimit);
      }
      var commentCount = 0;
      var positiveComments = replies.map(function (reply) {
        commentCount++;
        var showAd = commentCount % 5 == 0 && commentCount != replies.length && commentCount != commentLimit;
        return /*#__PURE__*/_react["default"].createElement("div", {
          key: post + reply
        }, /*#__PURE__*/_react["default"].createElement(_Comment["default"], {
          root: true,
          content: reply,
          cont: content,
          sort_order: sortOrder,
          showNegativeComments: showNegativeComments,
          onHide: _this2.onHideComment
        }), _this2.props.gptEnabled && showAd ? /*#__PURE__*/_react["default"].createElement("div", {
          className: "Post_footer__ad"
        }, /*#__PURE__*/_react["default"].createElement(_GptAd["default"], {
          tags: tags,
          type: "Freestar",
          id: "bsa-zone_1566494240874-7_123456"
        })) : null);
      });
      var negativeGroup = commentHidden && /*#__PURE__*/_react["default"].createElement("div", {
        className: "hentry Comment root Comment__negative_group"
      }, /*#__PURE__*/_react["default"].createElement("p", null, showNegativeComments ? (0, _counterpart["default"])('post_jsx.now_showing_comments_with_low_ratings') : (0, _counterpart["default"])('post_jsx.comments_were_hidden_due_to_low_ratings'), ".", ' ', /*#__PURE__*/_react["default"].createElement("button", {
        className: "button hollow tiny float-right",
        onClick: function onClick(e) {
          return _this2.toggleNegativeReplies(e);
        }
      }, showNegativeComments ? (0, _counterpart["default"])('g.hide') : (0, _counterpart["default"])('g.show'))));
      var sort_orders = ['trending', 'votes', 'new', 'author_reputation'];
      var sort_labels = [(0, _counterpart["default"])('post_jsx.comment_sort_order.trending'), (0, _counterpart["default"])('post_jsx.comment_sort_order.votes'), (0, _counterpart["default"])('post_jsx.comment_sort_order.age'), (0, _counterpart["default"])('post_jsx.comment_sort_order.reputation')];
      var sort_menu = [];
      var sort_label;
      var selflink = "/".concat(dis.get('category'), "/@").concat(post);
      for (var o = 0; o < sort_orders.length; ++o) {
        if (sort_orders[o] == sortOrder) sort_label = sort_labels[o];
        sort_menu.push({
          value: sort_orders[o],
          label: sort_labels[o],
          link: selflink + '?sort=' + sort_orders[o] + '#comments'
        });
      }
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "Post"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "column"
      }, /*#__PURE__*/_react["default"].createElement(_PostFull["default"], {
        post: post,
        cont: content
      }))), !(0, _UserUtil.isLoggedIn)() && /*#__PURE__*/_react["default"].createElement("div", {
        className: "row"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "column"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "Post__promo"
      }, (0, _counterpart["default"])('g.next_7_strings_single_block.authors_get_paid_when_people_like_you_upvote_their_post'), ".", /*#__PURE__*/_react["default"].createElement("br", null), (0, _counterpart["default"])('g.next_7_strings_single_block.if_you_enjoyed_what_you_read_earn_amount'), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("button", {
        type: "button",
        className: "button e-btn",
        onClick: showSignUp
      }, (0, _counterpart["default"])('loginform_jsx.sign_up_get_steem'))))), /*#__PURE__*/_react["default"].createElement("div", {
        id: "#comments",
        className: "Post_comments row hfeed"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "column large-12"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "Post_comments__content"
      }, positiveComments.length ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "Post__comments_sort_order float-right"
      }, (0, _counterpart["default"])('post_jsx.sort_order'), ": \xA0", /*#__PURE__*/_react["default"].createElement(_DropdownMenu["default"], {
        items: sort_menu,
        el: "li",
        selected: sort_label,
        position: "left"
      })) : null, positiveComments, negativeGroup))), this.props.gptEnabled ? /*#__PURE__*/_react["default"].createElement("div", {
        className: "Post_footer__ad"
      }, /*#__PURE__*/_react["default"].createElement(_GptAd["default"], {
        tags: tags,
        type: "Freestar",
        id: "bsa-zone_1566494371533-0_123456"
      })) : null, this.props.enabled && positiveComments.length ? /*#__PURE__*/_react["default"].createElement(_reactAdsense["default"].Google, {
        client: "ca-pub-8228818602519714",
        slot: "1435928495",
        style: {
          display: 'block'
        },
        format: "auto",
        responsive: "true"
      }) : null);
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(Post, "propTypes", {
  content: _propTypes["default"].object.isRequired,
  post: _propTypes["default"].string,
  routeParams: _propTypes["default"].object,
  sortOrder: _propTypes["default"].string
});
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, ownProps) {
  return {
    content: state.global.get('content'),
    sortOrder: ownProps.router.getCurrentLocation().query.sort || 'trending',
    gptEnabled: state.app.getIn(['googleAds', 'gptEnabled']),
    enabled: state.app.getIn(['googleAds', 'enabled'])
  };
})(Post);