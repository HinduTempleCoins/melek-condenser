"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactRouter = require("react-router");
var _reactRedux = require("react-redux");
var _classnames = _interopRequireDefault(require("classnames"));
var globalActions = _interopRequireWildcard(require("app/redux/GlobalReducer"));
var transactionActions = _interopRequireWildcard(require("app/redux/TransactionReducer"));
var userActions = _interopRequireWildcard(require("app/redux/UserReducer"));
var _FetchDataSaga = require("app/redux/FetchDataSaga");
var _Icon = _interopRequireDefault(require("app/components/elements/Icon"));
var _UserWallet = _interopRequireDefault(require("app/components/modules/UserWallet"));
var _Settings = _interopRequireDefault(require("app/components/modules/Settings"));
var _UserList = _interopRequireDefault(require("app/components/elements/UserList"));
var _Follow = _interopRequireDefault(require("app/components/elements/Follow"));
var _LoadingIndicator = _interopRequireDefault(require("app/components/elements/LoadingIndicator"));
var _PostsList = _interopRequireDefault(require("app/components/cards/PostsList"));
var _StateFunctions = require("app/utils/StateFunctions");
var _ParsersAndFormatters = require("app/utils/ParsersAndFormatters.js");
var _Tooltip = _interopRequireDefault(require("app/components/elements/Tooltip"));
var _DateJoinWrapper = _interopRequireDefault(require("app/components/elements/DateJoinWrapper"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var _immutable = require("immutable");
var _Userpic = _interopRequireDefault(require("app/components/elements/Userpic"));
var _Callout = _interopRequireDefault(require("app/components/elements/Callout"));
var _NormalizeProfile = _interopRequireDefault(require("app/utils/NormalizeProfile"));
var _userIllegalContent = _interopRequireDefault(require("app/utils/userIllegalContent"));
var _AffiliationMap = _interopRequireDefault(require("app/utils/AffiliationMap"));
var _ProxifyUrl = _interopRequireDefault(require("app/utils/ProxifyUrl"));
var _ArticleLayoutSelector = _interopRequireDefault(require("app/components/modules/ArticleLayoutSelector"));
var _SanitizedLink = _interopRequireDefault(require("app/components/elements/SanitizedLink"));
var _DropdownMenu = _interopRequireDefault(require("app/components/elements/DropdownMenu"));
var _NotificationsList = _interopRequireDefault(require("../cards/NotificationsList"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); } /* eslint react/prop-types: 0 */
var UserProfile = exports["default"] = /*#__PURE__*/function (_React$Component) {
  function UserProfile() {
    var _this;
    (0, _classCallCheck2["default"])(this, UserProfile);
    _this = _callSuper(this, UserProfile);
    (0, _defineProperty2["default"])(_this, "toggleShowResteem", function (e) {
      e.preventDefault();
      var newShowResteem = !_this.state.showResteem;
      _this.setState({
        showResteem: newShowResteem
      });
    });
    _this.state = {
      showResteem: true
    };
    _this.onPrint = function () {
      window.print();
    };
    _this.loadMore = _this.loadMore.bind(_this);
    return _this;
  }
  (0, _inherits2["default"])(UserProfile, _React$Component);
  return (0, _createClass2["default"])(UserProfile, [{
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(np, ns) {
      var _this$props = this.props,
        follow = _this$props.follow,
        follow_count = _this$props.follow_count,
        account = _this$props.account,
        accountname = _this$props.accountname,
        notifications = _this$props.notifications;
      var followersLoading = false,
        npFollowersLoading = false;
      var followingLoading = false,
        npFollowingLoading = false;
      if (follow) {
        followersLoading = follow.getIn(['getFollowersAsync', accountname, 'blog_loading'], false);
        followingLoading = follow.getIn(['getFollowingAsync', accountname, 'blog_loading'], false);
      }
      if (np.follow) {
        npFollowersLoading = np.follow.getIn(['getFollowersAsync', accountname, 'blog_loading'], false);
        npFollowingLoading = np.follow.getIn(['getFollowingAsync', accountname, 'blog_loading'], false);
      }
      return np.current_user !== this.props.current_user || np.account !== this.props.account || np.global_status !== this.props.global_status || npFollowersLoading !== followersLoading && !npFollowersLoading || npFollowingLoading !== followingLoading && !npFollowingLoading || np.loading !== this.props.loading || np.location.pathname !== this.props.location.pathname || np.follow_count !== this.props.follow_count || np.blogmode !== this.props.blogmode || ns.showResteem !== this.state.showResteem || np.notifications !== this.props.notifications;
    }
  }, {
    key: "loadMore",
    value: function loadMore(last_post, category, showResteem) {
      var accountname = this.props.accountname;
      if (!last_post) return;
      var order;
      switch (category) {
        case 'blog':
          order = 'by_author';
          break;
        case 'comments':
          order = 'by_comments';
          break;
        case 'recent_replies':
          order = 'by_replies';
          break;
        default:
          console.log('unhandled category:', category);
      }
      if ((0, _StateFunctions.isFetchingOrRecentlyUpdated)(this.props.global_status, order, category)) {
        return;
      }
      var postFilter = showResteem ? null : function (value) {
        return value.author === accountname;
      };
      var _last_post$split = last_post.split('/'),
        _last_post$split2 = (0, _slicedToArray2["default"])(_last_post$split, 2),
        author = _last_post$split2[0],
        permlink = _last_post$split2[1];
      this.props.requestData({
        author: author,
        permlink: permlink,
        order: order,
        category: category,
        accountname: accountname,
        postFilter: postFilter
      });
    }
  }, {
    key: "render",
    value: function render() {
      var showResteem = this.state.showResteem,
        _this$props2 = this.props,
        current_user = _this$props2.current_user,
        global_status = _this$props2.global_status,
        follow = _this$props2.follow,
        accountname = _this$props2.accountname,
        walletUrl = _this$props2.walletUrl,
        notifications = _this$props2.notifications,
        onPrint = this.onPrint;
      var username = current_user ? current_user.get('username') : null;
      var section = this.props.routeParams.section;
      if (!section) section = 'blog';

      // Loading status
      var status = global_status ? global_status.getIn([section, 'by_author']) : null;
      var fetching = status && status.fetching || this.props.loading;
      var account;
      var accountImm = this.props.account;
      if (accountImm) {
        account = accountImm.toJS();
      } else if (fetching) {
        return /*#__PURE__*/_react["default"].createElement("center", null, /*#__PURE__*/_react["default"].createElement(_LoadingIndicator["default"], {
          type: "circle"
        }));
      } else {
        return /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("center", null, (0, _counterpart["default"])('user_profile.unknown_account')));
      }
      var followers = follow && follow.getIn(['getFollowersAsync', accountname]);
      var following = follow && follow.getIn(['getFollowingAsync', accountname]);

      // instantiate following items
      var totalCounts = this.props.follow_count;
      var followerCount = 0;
      var followingCount = 0;
      if (totalCounts && accountname) {
        totalCounts = totalCounts.get(accountname);
        if (totalCounts) {
          totalCounts = totalCounts.toJS();
          followerCount = totalCounts.follower_count;
          followingCount = totalCounts.following_count;
        }
      }

      // const rep = repLog10(account.reputation);

      var isMyAccount = username === account.name;
      var tab_content = null;
      var walletClass = '';
      if (section === 'transfers') {
        walletClass = 'active';
        tab_content = /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_UserWallet["default"], {
          account: accountImm,
          current_user: current_user
        }));
      } else if (section === 'followers') {
        if (followers && followers.has('blog_result')) {
          tab_content = /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_UserList["default"], {
            title: (0, _counterpart["default"])('user_profile.followers'),
            users: followers.get('blog_result')
          }));
        }
      } else if (section === 'followed') {
        if (following && following.has('blog_result')) {
          tab_content = /*#__PURE__*/_react["default"].createElement(_UserList["default"], {
            title: "Followed",
            users: following.get('blog_result')
          });
        }
      } else if (section === 'settings') {
        tab_content = /*#__PURE__*/_react["default"].createElement(_Settings["default"], {
          routeParams: this.props.routeParams
        });
      } else if (section === 'comments') {
        if (account.comments) {
          var posts = accountImm.get('comments');
          if (!fetching && posts && !posts.size) {
            tab_content = /*#__PURE__*/_react["default"].createElement(_Callout["default"], null, (0, _counterpart["default"])('user_profile.user_hasnt_made_any_posts_yet', {
              name: accountname
            }));
          } else {
            tab_content = /*#__PURE__*/_react["default"].createElement(_PostsList["default"], {
              posts: posts,
              loading: fetching,
              category: "comments",
              loadMore: this.loadMore,
              showPinned: false,
              showSpam: true
            });
          }
        } else {
          tab_content = /*#__PURE__*/_react["default"].createElement("center", null, /*#__PURE__*/_react["default"].createElement(_LoadingIndicator["default"], {
            type: "circle"
          }));
        }
      } else if (!section || section === 'blog') {
        if (account.blog) {
          var _posts = accountImm.get('blog');
          var emptyText = isMyAccount ? /*#__PURE__*/_react["default"].createElement("div", null, (0, _counterpart["default"])('user_profile.looks_like_you_havent_posted_anything_yet'), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
            to: "/submit.html"
          }, (0, _counterpart["default"])('user_profile.create_a_post')), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
            to: "/hot"
          }, (0, _counterpart["default"])('user_profile.explore_trending_articles')), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
            to: "/welcome"
          }, (0, _counterpart["default"])('user_profile.read_the_quick_start_guide')), /*#__PURE__*/_react["default"].createElement("br", null), /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
            to: "/faq.html"
          }, (0, _counterpart["default"])('user_profile.browse_the_faq')), /*#__PURE__*/_react["default"].createElement("br", null)) : (0, _counterpart["default"])('user_profile.user_hasnt_started_bloggin_yet', {
            name: accountname
          });
          if (!fetching && _posts && !_posts.size) {
            tab_content = /*#__PURE__*/_react["default"].createElement(_Callout["default"], null, emptyText);
          } else {
            tab_content = /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("a", {
              href: "#",
              onClick: this.toggleShowResteem
            }, showResteem ? (0, _counterpart["default"])('user_profile.hide_resteems') : (0, _counterpart["default"])('user_profile.show_all')), /*#__PURE__*/_react["default"].createElement(_PostsList["default"], {
              account: account.name,
              posts: _posts,
              loading: fetching,
              category: "blog",
              loadMore: this.loadMore,
              showPinned: false,
              showResteem: showResteem,
              showSpam: true
            }));
          }
        } else {
          tab_content = /*#__PURE__*/_react["default"].createElement("center", null, /*#__PURE__*/_react["default"].createElement(_LoadingIndicator["default"], {
            type: "circle"
          }));
        }
      } else if (section === 'recent-replies') {
        if (account.recent_replies) {
          var _posts2 = accountImm.get('recent_replies');
          if (!fetching && _posts2 && !_posts2.size) {
            tab_content = /*#__PURE__*/_react["default"].createElement(_Callout["default"], null, (0, _counterpart["default"])('user_profile.user_hasnt_had_any_replies_yet', {
              name: accountname
            }) + '.');
          } else {
            tab_content = /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement(_PostsList["default"], {
              posts: _posts2,
              loading: fetching,
              category: "recent_replies",
              loadMore: this.loadMore,
              showPinned: false,
              showSpam: false
            }));
          }
        } else {
          tab_content = /*#__PURE__*/_react["default"].createElement("center", null, /*#__PURE__*/_react["default"].createElement(_LoadingIndicator["default"], {
            type: "circle"
          }));
        }
      } else if (section === 'notifications') {
        if (username === accountname) {
          tab_content = /*#__PURE__*/_react["default"].createElement(_NotificationsList["default"], {
            username: accountname,
            notifications: notifications && notifications.toJS()
          });
        }
      } else {
        //    console.log( "no matches" );
      }

      // detect illegal users
      if (_userIllegalContent["default"].includes(accountname)) {
        tab_content = /*#__PURE__*/_react["default"].createElement("div", null, "Unavailable For Legal Reasons.");
      }
      var page_title = '';
      // Page title

      if (isMyAccount) {
        if (section === 'blog') {
          page_title = (0, _counterpart["default"])('g.my_blog');
        } else if (section === 'comments') {
          page_title = (0, _counterpart["default"])('g.my_comments');
        } else if (section === 'recent-replies') {
          page_title = (0, _counterpart["default"])('g.my_replies');
        } else if (section === 'settings') {
          page_title = (0, _counterpart["default"])('g.settings');
        }
      } else {
        if (section === 'blog') {
          page_title = (0, _counterpart["default"])('g.blog');
        } else if (section === 'comments') {
          page_title = (0, _counterpart["default"])('g.comments');
        } else if (section === 'recent-replies') {
          page_title = (0, _counterpart["default"])('g.replies');
        } else if (section === 'settings') {
          page_title = (0, _counterpart["default"])('g.settings');
        }
      }
      var layoutClass = this.props.blogmode ? 'layout-block' : 'layout-list';
      var blog_header = /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__header"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__header-col"
      }, /*#__PURE__*/_react["default"].createElement("h1", {
        className: "articles__h1"
      }, page_title)), /*#__PURE__*/_react["default"].createElement("div", {
        className: "articles__header-col articles__header-col--right"
      }, /*#__PURE__*/_react["default"].createElement(_ArticleLayoutSelector["default"], null))), /*#__PURE__*/_react["default"].createElement("hr", {
        className: "articles__hr"
      }));
      if (!(section === 'transfers' || section === 'permissions' || section === 'password')) {
        tab_content = /*#__PURE__*/_react["default"].createElement("div", {
          className: "row"
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: (0, _classnames["default"])('UserProfile__tab_content', 'column', layoutClass, section)
        }, /*#__PURE__*/_react["default"].createElement("article", {
          className: "articles"
        }, section === 'blog' || 'comments' ? blog_header : null, tab_content)));
      }
      var rewardsMenu = [{
        link: "".concat(walletUrl, "/@").concat(accountname, "/curation-rewards"),
        label: (0, _counterpart["default"])('g.curation_rewards'),
        value: (0, _counterpart["default"])('g.curation_rewards')
      }, {
        link: "".concat(walletUrl, "/@").concat(accountname, "/author-rewards"),
        label: (0, _counterpart["default"])('g.author_rewards'),
        value: (0, _counterpart["default"])('g.author_rewards')
      }];
      var top_menu = /*#__PURE__*/_react["default"].createElement("div", {
        className: "row UserProfile__top-menu"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "columns small-10 medium-12 medium-expand"
      }, /*#__PURE__*/_react["default"].createElement("ul", {
        className: "menu",
        style: {
          flexWrap: 'wrap'
        }
      }, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: "/@".concat(accountname),
        activeClassName: "active"
      }, (0, _counterpart["default"])('g.blog'))), /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: "/@".concat(accountname, "/comments"),
        activeClassName: "active"
      }, (0, _counterpart["default"])('g.comments'))), /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: "/@".concat(accountname, "/recent-replies"),
        activeClassName: "active"
      }, (0, _counterpart["default"])('g.replies'))), username === accountname & /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: "/@".concat(accountname, "/notifications"),
        activeClassName: "active"
      }, (0, _counterpart["default"])('g.notifications'))), /*#__PURE__*/_react["default"].createElement(_DropdownMenu["default"], {
        items: rewardsMenu,
        el: "li",
        selected: (0, _counterpart["default"])('g.rewards'),
        position: "right"
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "columns shrink"
      }, /*#__PURE__*/_react["default"].createElement("ul", {
        className: "menu",
        style: {
          flexWrap: 'wrap'
        }
      }, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
        href: "".concat(walletUrl, "/@").concat(accountname),
        target: "_blank",
        className: walletClass
      }, (0, _counterpart["default"])('g.wallet'))), isMyAccount && /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: "/@".concat(accountname, "/settings"),
        activeClassName: "active"
      }, (0, _counterpart["default"])('g.settings'))))));
      var _normalizeProfile = (0, _NormalizeProfile["default"])(account),
        name = _normalizeProfile.name,
        location = _normalizeProfile.location,
        about = _normalizeProfile.about,
        website = _normalizeProfile.website,
        cover_image = _normalizeProfile.cover_image;
      var website_label = website ? website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '') : null;
      var cover_image_style = {};
      if (cover_image) {
        if (cover_image.match(/\.(gif)$/) !== null) {
          cover_image_style = {
            backgroundImage: 'url(' + cover_image + ')'
          };
        } else {
          cover_image_style = {
            backgroundImage: 'url(' + (0, _ProxifyUrl["default"])(cover_image, '2048x512') + ')'
          };
        }
      }
      var vestingShares = parseFloat(account.vesting_shares);
      var delegatedVestingShares = parseFloat(account.delegated_vesting_shares);
      var receivedVestingShares = parseFloat(account.received_vesting_shares);
      var accountBp = parseInt((vestingShares - delegatedVestingShares + receivedVestingShares) * this.props.blurtPerVest);
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "UserProfile"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "UserProfile__banner row expanded"
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "column",
        style: cover_image_style
      }, /*#__PURE__*/_react["default"].createElement("div", {
        style: {
          position: 'relative'
        }
      }, /*#__PURE__*/_react["default"].createElement("div", {
        className: "UserProfile__buttons hide-for-small-only"
      }, /*#__PURE__*/_react["default"].createElement(_Follow["default"], {
        follower: username,
        following: accountname
      }))), /*#__PURE__*/_react["default"].createElement("h1", null, /*#__PURE__*/_react["default"].createElement(_Userpic["default"], {
        account: account.name,
        hideIfDefault: true
      }), name || account.name, ' ', /*#__PURE__*/_react["default"].createElement(_Tooltip["default"], {
        t: (0, _counterpart["default"])('user_profile.this_is_users_reputations_score_it_is_based_on_history_of_votes', {
          name: accountname
        })
      }), _AffiliationMap["default"][accountname] ? /*#__PURE__*/_react["default"].createElement("span", {
        className: "affiliation"
      }, (0, _counterpart["default"])('g.affiliation_' + _AffiliationMap["default"][accountname])) : null), /*#__PURE__*/_react["default"].createElement("div", null, about && /*#__PURE__*/_react["default"].createElement("p", {
        className: "UserProfile__bio"
      }, about), /*#__PURE__*/_react["default"].createElement("div", {
        className: "UserProfile__stats"
      }, /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: "/@".concat(accountname, "/followers")
      }, (0, _counterpart["default"])('user_profile.follower_count', {
        count: followerCount
      }))), /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: "/@".concat(accountname)
      }, (0, _counterpart["default"])('user_profile.post_count', {
        count: account.post_count || 0
      }))), /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: "/@".concat(accountname, "/followed")
      }, (0, _counterpart["default"])('user_profile.followed_count', {
        count: followingCount
      }))), /*#__PURE__*/_react["default"].createElement("span", null, accountBp, " BP"), /*#__PURE__*/_react["default"].createElement("span", null, parseInt(account.balance), " MELEK")), /*#__PURE__*/_react["default"].createElement("p", {
        className: "UserProfile__info"
      }, location && /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
        name: "location"
      }), " ", location), website && /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
        name: "link"
      }), ' ', /*#__PURE__*/_react["default"].createElement(_SanitizedLink["default"], {
        url: website,
        text: website_label
      })), /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
        name: "calendar"
      }), ' ', /*#__PURE__*/_react["default"].createElement(_DateJoinWrapper["default"], {
        date: account.created
      }))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "UserProfile__buttons_mobile show-for-small-only"
      }, /*#__PURE__*/_react["default"].createElement(_Follow["default"], {
        follower: username,
        following: accountname,
        what: "blog"
      })))), /*#__PURE__*/_react["default"].createElement("div", {
        className: "UserProfile__top-nav row expanded noPrint"
      }, top_menu), /*#__PURE__*/_react["default"].createElement("div", null, tab_content));
    }
  }]);
}(_react["default"].Component);
module.exports = {
  path: '@:accountname(/:section)',
  component: (0, _reactRedux.connect)(function (state, ownProps) {
    var current_user = state.user.get('current');
    var accountname = ownProps.routeParams.accountname.toLowerCase();
    var walletUrl = state.app.get('walletUrl');
    var blurtPerVest = parseFloat(state.global.getIn(['props', 'total_vesting_fund_blurt'])) / parseFloat(state.global.getIn(['props', 'total_vesting_shares']));
    return {
      discussions: state.global.get('discussion_idx'),
      current_user: current_user,
      loading: state.app.get('loading'),
      global_status: state.global.get('status'),
      accountname: accountname,
      account: state.global.getIn(['accounts', accountname]),
      notifications: state.global.getIn(['notifications', accountname, 'notifications'], null),
      follow: state.global.get('follow'),
      follow_count: state.global.get('follow_count'),
      blurtPerVest: blurtPerVest,
      blogmode: state.app.getIn(['user_preferences', 'blogmode']) === undefined ? true : state.app.getIn(['user_preferences', 'blogmode']),
      walletUrl: walletUrl
    };
  }, function (dispatch) {
    return {
      login: function login() {
        dispatch(userActions.showLogin());
      },
      requestData: function requestData(args) {
        return dispatch(_FetchDataSaga.actions.requestData(args));
      }
    };
  })(UserProfile)
};