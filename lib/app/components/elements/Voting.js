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
var _reactRedux = require("react-redux");
var _reactRangeslider = _interopRequireDefault(require("react-rangeslider"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var _CloseButton = _interopRequireDefault(require("app/components/elements/CloseButton"));
var transactionActions = _interopRequireWildcard(require("app/redux/TransactionReducer"));
var _Icon = _interopRequireDefault(require("app/components/elements/Icon"));
var _client_config = require("app/client_config");
var _FormattedAsset = _interopRequireDefault(require("app/components/elements/FormattedAsset"));
var _StateFunctions = require("app/utils/StateFunctions");
var _shouldComponentUpdate = _interopRequireDefault(require("app/utils/shouldComponentUpdate"));
var _ParsersAndFormatters = require("app/utils/ParsersAndFormatters");
var _DropdownMenu = _interopRequireDefault(require("app/components/elements/DropdownMenu"));
var _TimeAgoWrapper = _interopRequireDefault(require("app/components/elements/TimeAgoWrapper"));
var _Dropdown = _interopRequireDefault(require("app/components/elements/Dropdown"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
var ABOUT_FLAG = /*#__PURE__*/_react["default"].createElement("div", null, /*#__PURE__*/_react["default"].createElement("p", null, "Downvoting a post can decrease pending rewards and make it less visible. Common reasons:"), /*#__PURE__*/_react["default"].createElement("ul", null, /*#__PURE__*/_react["default"].createElement("li", null, "Disagreement on rewards"), /*#__PURE__*/_react["default"].createElement("li", null, "Fraud or plagiarism"), /*#__PURE__*/_react["default"].createElement("li", null, "Hate speech or trolling"), /*#__PURE__*/_react["default"].createElement("li", null, "Miscategorized content or spam")));
var MAX_VOTES_DISPLAY = 20;
var VOTE_WEIGHT_DROPDOWN_THRESHOLD = 50; //if BP is more than 50, enable the slider
// const SBD_PRINT_RATE_MAX = 10000;
var MAX_WEIGHT = 10000;
var Voting = /*#__PURE__*/function (_React$Component) {
  function Voting(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, Voting);
    _this = _callSuper(this, Voting, [props]);
    _this.state = {
      showWeight: false,
      myVote: null,
      sliderWeight: {
        up: MAX_WEIGHT,
        down: MAX_WEIGHT
      }
    };
    _this.voteUp = function (e) {
      e && e.preventDefault();
      _this.voteUpOrDown(true);
    };
    _this.voteDown = function (e) {
      e && e.preventDefault();
      _this.voteUpOrDown(false);
    };
    _this.voteUpOrDown = function (up) {
      if (_this.props.voting) return;
      _this.setState({
        votingUp: up
      });
      if (_this.state.showWeight) _this.setState({
        showWeight: false
      });
      var myVote = _this.state.myVote;
      var _this$props = _this.props,
        author = _this$props.author,
        permlink = _this$props.permlink,
        username = _this$props.username,
        is_comment = _this$props.is_comment;
      var weight;
      if (myVote > 0 || myVote < 0) {
        // if there is a current vote, we're clearing it
        weight = 0;
      } else if (_this.props.enable_slider) {
        // if slider is enabled, read its value
        weight = up ? _this.state.sliderWeight.up : -_this.state.sliderWeight.down;
      } else {
        // otherwise, use max power
        weight = up ? MAX_WEIGHT : -MAX_WEIGHT;
      }
      var isFlag = up ? null : true;
      _this.props.vote(weight, {
        author: author,
        permlink: permlink,
        username: username,
        myVote: myVote,
        isFlag: isFlag
      });
    };
    _this.handleWeightChange = function (up) {
      return function (weight) {
        var w;
        if (up) {
          w = {
            up: weight,
            down: _this.state.sliderWeight.down
          };
        } else {
          w = {
            up: _this.state.sliderWeight.up,
            down: weight
          };
        }
        _this.setState({
          sliderWeight: w
        });
      };
    };
    _this.storeSliderWeight = function (up) {
      return function () {
        var _this$props2 = _this.props,
          username = _this$props2.username,
          is_comment = _this$props2.is_comment;
        var weight = up ? _this.state.sliderWeight.up : _this.state.sliderWeight.down;
        localStorage.setItem('voteWeight' + (up ? '' : 'Down') + '-' + username + (is_comment ? '-comment' : ''), weight);
      };
    };
    _this.readSliderWeight = function () {
      var _this$props3 = _this.props,
        username = _this$props3.username,
        enable_slider = _this$props3.enable_slider,
        is_comment = _this$props3.is_comment;
      if (enable_slider) {
        var sliderWeightUp = Number(localStorage.getItem('voteWeight' + '-' + username + (is_comment ? '-comment' : '')));
        var sliderWeightDown = Number(localStorage.getItem('voteWeight' + 'Down' + '-' + username + (is_comment ? '-comment' : '')));
        _this.setState({
          sliderWeight: {
            up: sliderWeightUp ? sliderWeightUp : MAX_WEIGHT,
            down: sliderWeightDown ? sliderWeightDown : MAX_WEIGHT
          }
        });
      }
    };
    _this.toggleWeightUp = function (e) {
      e.preventDefault();
      _this.toggleWeightUpOrDown(true);
    };
    _this.toggleWeightDown = function (e) {
      e && e.preventDefault();
      _this.toggleWeightUpOrDown(false);
    };
    _this.toggleWeightUpOrDown = function (up) {
      _this.setState({
        showWeight: !_this.state.showWeight,
        showWeightDir: up ? 'up' : 'down'
      });
    };
    _this.shouldComponentUpdate = (0, _shouldComponentUpdate["default"])(_this, 'Voting');
    return _this;
  }
  (0, _inherits2["default"])(Voting, _React$Component);
  return (0, _createClass2["default"])(Voting, [{
    key: "componentWillMount",
    value: function componentWillMount() {
      var _this$props4 = this.props,
        username = _this$props4.username,
        active_votes = _this$props4.active_votes;
      this._checkMyVote(username, active_votes);
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      var username = nextProps.username,
        active_votes = nextProps.active_votes;
      this._checkMyVote(username, active_votes);
    }
  }, {
    key: "_checkMyVote",
    value: function _checkMyVote(username, active_votes) {
      if (username && active_votes) {
        var vote = active_votes.find(function (el) {
          return el.get('voter') === username;
        });
        // weight warning, the API may send a string or a number (when zero)
        if (vote) this.setState({
          myVote: parseInt(vote.get('percent') || 0, 10)
        });
      }
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      var _this$props5 = this.props,
        active_votes = _this$props5.active_votes,
        showList = _this$props5.showList,
        voting = _this$props5.voting,
        enable_slider = _this$props5.enable_slider,
        is_comment = _this$props5.is_comment,
        post_obj = _this$props5.post_obj,
        current_account = _this$props5.current_account,
        operationFlatFee = _this$props5.operationFlatFee,
        bandwidthKbytesFee = _this$props5.bandwidthKbytesFee,
        username = _this$props5.username,
        author = _this$props5.author,
        permlink = _this$props5.permlink,
        blacklist = _this$props5.blacklist,
        rewardBalance = _this$props5.rewardBalance,
        recentClaims = _this$props5.recentClaims;
      var voting_manabar = current_account ? current_account.get('voting_manabar') : 0;
      var current_mana = voting_manabar ? voting_manabar.get('current_mana') : 0;
      var last_update_time = voting_manabar ? voting_manabar.get('last_update_time') : 0;
      var vesting_shares = current_account ? current_account.get('vesting_shares') : 0.0;
      var delegated_vesting_shares = current_account ? current_account.get('delegated_vesting_shares') : 0.0;
      var vesting_withdraw_rate = current_account ? current_account.get('vesting_withdraw_rate') ? current_account.get('vesting_withdraw_rate').split(' ')[0] : 0.0 : 0.0;
      var received_vesting_shares = current_account ? current_account.get('received_vesting_shares') : 0.0;
      var net_vesting_shares = vesting_shares - delegated_vesting_shares + received_vesting_shares - Number(vesting_withdraw_rate);
      var elapsed = new Date() / 1000 - last_update_time;
      var maxMana = net_vesting_shares * 1000000;
      var currentMana = parseFloat(current_mana) + elapsed * maxMana / 432000;
      if (currentMana > maxMana) {
        currentMana = maxMana;
      }
      var currentVp = currentMana * 100 / maxMana;
      var operation = {
        voter: username,
        author: author,
        permlink: permlink,
        weight: 10000
      };
      var size = JSON.stringify(operation).replace(/[\[\]\,\"]/g, '').length;
      var bw_fee = Math.max(0.001, (size / 1024 * bandwidthKbytesFee).toFixed(3));
      var fee = (operationFlatFee + bw_fee).toFixed(3);
      var rshares = currentVp * 100 * parseInt(net_vesting_shares * 1e6, 10);
      var voteValue = rshares * (rshares + 2 * 2e12) / (rshares + 4 * 2e12) / recentClaims * parseFloat(rewardBalance) / 1000000;
      var _this$state = this.state,
        votingUp = _this$state.votingUp,
        showWeight = _this$state.showWeight,
        showWeightDir = _this$state.showWeightDir,
        myVote = _this$state.myVote;
      var votingUpActive = voting && votingUp;
      voteValue = voteValue * this.state.sliderWeight.up / 10000;
      var slider = function slider(up) {
        var b = up ? _this2.state.sliderWeight.up : _this2.state.sliderWeight.down;
        var s = up ? '' : '-';
        return /*#__PURE__*/_react["default"].createElement("span", null, /*#__PURE__*/_react["default"].createElement("div", {
          id: "btn_group"
        }, /*#__PURE__*/_react["default"].createElement("button", {
          id: "weight-10",
          onClick: _this2.handleButtonWeightChange(up, 1000)
        }, ' ', "10%", ' '), /*#__PURE__*/_react["default"].createElement("button", {
          id: "weight-25",
          onClick: _this2.handleButtonWeightChange(up, 2500)
        }, ' ', "25%", ' '), /*#__PURE__*/_react["default"].createElement("button", {
          id: "weight-50",
          onClick: _this2.handleButtonWeightChange(up, 5000)
        }, ' ', "50%", ' '), /*#__PURE__*/_react["default"].createElement("button", {
          id: "weight-75",
          onClick: _this2.handleButtonWeightChange(up, 7500)
        }, ' ', "75%", ' '), /*#__PURE__*/_react["default"].createElement("button", {
          id: "weight-100",
          onClick: _this2.handleButtonWeightChange(up, 10000)
        }, ' ', "100%", ' ')), votingUpActive ? /*#__PURE__*/_react["default"].createElement("a", {
          href: "#",
          onClick: function onClick() {
            return null;
          },
          className: "confirm_weight",
          title: (0, _counterpart["default"])('g.upvote')
        }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
          size: "2x",
          name: 'empty'
        })) : /*#__PURE__*/_react["default"].createElement("a", {
          href: "#",
          onClick: _this2.voteUp,
          className: "confirm_weight",
          title: (0, _counterpart["default"])('g.upvote')
        }, /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
          size: "2x",
          name: "chevron-up-circle"
        })), /*#__PURE__*/_react["default"].createElement("div", {
          className: "weight-display"
        }, s + b / 100, "%"), /*#__PURE__*/_react["default"].createElement(_reactRangeslider["default"], {
          min: 100,
          max: MAX_WEIGHT,
          step: 100,
          value: b,
          onChange: _this2.handleWeightChange(up),
          onChangeComplete: _this2.storeSliderWeight(up),
          tooltip: false
        }), currentVp ? /*#__PURE__*/_react["default"].createElement("div", {
          className: "voting-power-display"
        }, (0, _counterpart["default"])('voting_jsx.vote_value'), ":", ' ', voteValue.toFixed(2), " MELEK", /*#__PURE__*/_react["default"].createElement("br", null), (0, _counterpart["default"])('voting_jsx.voting_power'), ":", ' ', currentVp.toFixed(1), "%", /*#__PURE__*/_react["default"].createElement("br", null), (0, _counterpart["default"])('g.transaction_fee'), ": ", fee, " MELEK") : '');
      };
      this.handleButtonWeightChange = function (up, weight) {
        return function (e) {
          var w;
          if (up) {
            w = {
              up: weight,
              down: _this2.state.sliderWeight.down
            };
          } else {
            w = {
              up: _this2.state.sliderWeight.up,
              down: weight
            };
          }
          _this2.setState({
            sliderWeight: w
          });
          var _this2$props = _this2.props,
            username = _this2$props.username,
            is_comment = _this2$props.is_comment;
          localStorage.setItem('voteWeight' + (up ? '' : 'Down') + '-' + username + (is_comment ? '-comment' : ''), weight);
        };
      };
      var total_votes = post_obj.getIn(['stats', 'total_votes']);
      var cashout_time = post_obj.get('cashout_time');
      var max_payout = (0, _ParsersAndFormatters.parsePayoutAmount)(post_obj.get('max_accepted_payout'));
      var pending_payout = (0, _ParsersAndFormatters.parsePayoutAmount)(post_obj.get('pending_payout_value'));
      // const pending_payout_sp = pending_payout / price_per_steem;

      var promoted = (0, _ParsersAndFormatters.parsePayoutAmount)(post_obj.get('promoted'));
      var total_author_payout = (0, _ParsersAndFormatters.parsePayoutAmount)(post_obj.get('total_payout_value'));
      var total_curator_payout = (0, _ParsersAndFormatters.parsePayoutAmount)(post_obj.get('curator_payout_value'));
      var payout = pending_payout + total_author_payout + total_curator_payout;
      if (payout < 0.0) payout = 0.0;
      if (payout > max_payout) payout = max_payout;
      var payout_limit_hit = payout >= max_payout;
      // Show pending payout amount for declined payment posts
      if (max_payout === 0) payout = pending_payout;
      var up = /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
        name: votingUpActive ? 'empty' : 'chevron-up-circle',
        className: "upvote"
      });
      var classUp = 'Voting__button Voting__button-up' + (myVote > 0 ? ' Voting__button--upvoted' : '') + (votingUpActive ? ' votingUp' : '');

      // There is an "active cashout" if: (a) there is a pending payout, OR (b) there is a valid cashout_time AND it's NOT a comment with 0 votes.
      var cashout_active = pending_payout > 0 || cashout_time.indexOf('1969') !== 0 && !(is_comment && total_votes == 0);
      var payoutItems = [];
      var minimumAmountForPayout = 0.02;
      var warnZeroPayout = '';
      if (pending_payout > 0 && pending_payout < minimumAmountForPayout) {
        warnZeroPayout = (0, _counterpart["default"])('voting_jsx.must_reached_minimum_payout');
      }
      if (cashout_active) {
        var payoutDate = /*#__PURE__*/_react["default"].createElement("span", null, (0, _counterpart["default"])('voting_jsx.payout'), ' ', /*#__PURE__*/_react["default"].createElement(_TimeAgoWrapper["default"], {
          date: cashout_time
        }));
        payoutItems.push({
          value: (0, _counterpart["default"])('voting_jsx.pending_payout', {
            value: (0, _ParsersAndFormatters.formatDecimal)(pending_payout).join('')
          })
        });
        if (max_payout > 0) {
          payoutItems.push({
            value: (0, _counterpart["default"])('voting_jsx.breakdown') + ': '
          });
          payoutItems.push({
            value: (0, _counterpart["default"])('voting_jsx.pending_payouts_author', {
              value: (0, _ParsersAndFormatters.formatDecimal)(pending_payout / 2).join('')
            })
          });
          payoutItems.push({
            value: (0, _counterpart["default"])('voting_jsx.pending_payouts_curators', {
              value: (0, _ParsersAndFormatters.formatDecimal)(pending_payout / 2).join('')
            })
          });
        }
        // add beneficiary info.
        var beneficiaries = post_obj.get('beneficiaries');
        if (beneficiaries.size > 0) {
          payoutItems.push({
            value: 'Beneficiaries:'
          });
          beneficiaries.forEach(function (key) {
            payoutItems.push({
              value: '- ' + key.get('account') + ': ' + (parseFloat(key.get('weight')) / 100).toFixed(2) + '%',
              link: '/@' + key.get('account')
            });
          });
        }
        payoutItems.push({
          value: payoutDate
        });
        if (warnZeroPayout !== '') {
          payoutItems.push({
            value: warnZeroPayout
          });
        }
      }
      if (max_payout == 0) {
        payoutItems.push({
          value: (0, _counterpart["default"])('voting_jsx.payout_declined')
        });
      } else if (max_payout < 1000000) {
        payoutItems.push({
          value: (0, _counterpart["default"])('voting_jsx.max_accepted_payout', {
            value: (0, _ParsersAndFormatters.formatDecimal)(max_payout).join('')
          })
        });
      }
      if (promoted > 0) {
        payoutItems.push({
          value: (0, _counterpart["default"])('voting_jsx.promotion_cost', {
            value: (0, _ParsersAndFormatters.formatDecimal)(promoted).join('')
          })
        });
      }
      // - payout instead of total_author_payout: total_author_payout can be zero with 100% beneficiary
      // - !cashout_active is needed to avoid the info is also shown for pending posts.
      if (!cashout_active && payout > 0) {
        payoutItems.push({
          value: (0, _counterpart["default"])('voting_jsx.past_payouts', {
            value: (0, _ParsersAndFormatters.formatDecimal)(total_author_payout + total_curator_payout).join('')
          })
        });
        payoutItems.push({
          value: (0, _counterpart["default"])('voting_jsx.past_payouts_author', {
            value: (0, _ParsersAndFormatters.formatDecimal)(total_author_payout).join('')
          })
        });
        payoutItems.push({
          value: (0, _counterpart["default"])('voting_jsx.past_payouts_curators', {
            value: (0, _ParsersAndFormatters.formatDecimal)(total_curator_payout).join('')
          })
        });
      }
      var payoutEl = /*#__PURE__*/_react["default"].createElement(_DropdownMenu["default"], {
        el: "div",
        items: payoutItems
      }, /*#__PURE__*/_react["default"].createElement("span", {
        style: payout_limit_hit ? {
          opacity: '0.5'
        } : {}
      }, /*#__PURE__*/_react["default"].createElement(_FormattedAsset["default"], {
        amount: payout,
        asset: "MELEK",
        classname: max_payout === 0 ? 'strikethrough' : ''
      }), payoutItems.length > 0 && /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
        name: "dropdown-arrow"
      })));
      var voters_list = null;
      if (showList && total_votes > 0 && active_votes) {
        var avotes = active_votes.toJS();
        var total_rshares = 0;
        // sum of rshares
        for (var v = 0; v < avotes.length; ++v) {
          var _rshares = avotes[v].rshares;
          total_rshares += Number(_rshares);
        }
        avotes.sort(function (a, b) {
          return Math.abs(parseInt(a.rshares)) > Math.abs(parseInt(b.rshares)) ? -1 : 1;
        });
        var voters = [];
        for (var _v = 0; _v < avotes.length && voters.length < MAX_VOTES_DISPLAY; ++_v) {
          var _avotes$_v = avotes[_v],
            percent = _avotes$_v.percent,
            voter = _avotes$_v.voter,
            _rshares2 = _avotes$_v.rshares;
          var sign = Math.sign(percent);
          if (sign === 0) continue;
          voters.push({
            value: (sign > 0 ? '+ ' : '- ') + voter + ': ' + (payout * _rshares2 / total_rshares).toFixed(3) + ' MELEK (' + percent / 100 + '%)',
            link: '/@' + voter
          });
        }
        if (total_votes > voters.length) {
          voters.push({
            value: /*#__PURE__*/_react["default"].createElement("span", null, "\u2026", ' ', (0, _counterpart["default"])('voting_jsx.and_more', {
              count: total_votes - voters.length
            }))
          });
        }
        voters_list = /*#__PURE__*/_react["default"].createElement(_DropdownMenu["default"], {
          selected: (0, _counterpart["default"])('voting_jsx.votes_plural', {
            count: total_votes
          }),
          className: "Voting__voters_list",
          items: voters,
          el: "div"
        });
      }
      var voteUpClick = this.voteUp;
      var dropdown = null;
      var voteChevron = votingUpActive ? up : /*#__PURE__*/_react["default"].createElement("a", {
        href: "#",
        onClick: voteUpClick,
        title: myVote > 0 ? (0, _counterpart["default"])('g.remove_vote') : (0, _counterpart["default"])('g.upvote'),
        id: "upvote_button"
      }, up);
      if (myVote <= 0 && enable_slider) {
        voteUpClick = this.toggleWeightUp;
        voteChevron = null;
        // Vote weight adjust
        dropdown = /*#__PURE__*/_react["default"].createElement(_Dropdown["default"], {
          show: showWeight && showWeightDir == 'up',
          onHide: function onHide() {
            return _this2.setState({
              showWeight: false
            });
          },
          onShow: function onShow() {
            _this2.setState({
              showWeight: true,
              showWeightDir: 'up'
            });
            _this2.readSliderWeight();
          },
          title: up
        }, /*#__PURE__*/_react["default"].createElement("div", {
          className: "Voting__adjust_weight"
        }, slider(true), /*#__PURE__*/_react["default"].createElement(_CloseButton["default"], {
          className: "Voting__adjust_weight_close",
          onClick: function onClick() {
            return _this2.setState({
              showWeight: false
            });
          }
        })));
      }
      return /*#__PURE__*/_react["default"].createElement("span", {
        className: "Voting"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: "Voting__inner"
      }, /*#__PURE__*/_react["default"].createElement("span", {
        className: classUp
      }, voteChevron, dropdown), payoutEl), voters_list);
    }
  }]);
}(_react["default"].Component);
(0, _defineProperty2["default"])(Voting, "propTypes", {
  // HTML properties
  post: _propTypes["default"].string.isRequired,
  showList: _propTypes["default"].bool,
  // Redux connect properties
  vote: _propTypes["default"].func.isRequired,
  author: _propTypes["default"].string,
  // post was deleted
  permlink: _propTypes["default"].string,
  username: _propTypes["default"].string,
  is_comment: _propTypes["default"].bool,
  active_votes: _propTypes["default"].object,
  loggedin: _propTypes["default"].bool,
  post_obj: _propTypes["default"].object,
  current_account: _propTypes["default"].object,
  enable_slider: _propTypes["default"].bool,
  voting: _propTypes["default"].bool
  // price_per_blurt: PropTypes.number,
  // sbd_print_rate: PropTypes.number,
});
(0, _defineProperty2["default"])(Voting, "defaultProps", {
  showList: true
});
var _default = exports["default"] = (0, _reactRedux.connect)(
// mapStateToProps
function (state, ownProps) {
  var post = state.global.getIn(['content', ownProps.post]);
  if (!post) return ownProps;
  var author = post.get('author');
  var permlink = post.get('permlink');
  var active_votes = post.get('active_votes');
  var is_comment = post.get('parent_author') !== '';
  var current_account = state.user.get('current');
  var username = current_account ? current_account.get('username') : null;
  var vesting_shares = current_account ? current_account.get('vesting_shares') : 0.0;
  var delegated_vesting_shares = current_account ? current_account.get('delegated_vesting_shares') : 0.0;
  var received_vesting_shares = current_account ? current_account.get('received_vesting_shares') : 0.0;
  var net_vesting_shares = vesting_shares - delegated_vesting_shares + received_vesting_shares;
  var voting = state.global.get("transaction_vote_active_".concat(author, "_").concat(permlink));
  //const price_per_blurt = pricePerSteem(state);
  // const sbd_print_rate = state.global.getIn(['props', 'sbd_print_rate']);
  var recentClaims = state.global.getIn(['reward_fund', 'recent_claims']);
  var rewardBalance = state.global.getIn(['reward_fund', 'reward_balance']);
  var operationFlatFee = state.global.getIn(['props', 'operation_flat_fee']);
  var bandwidthKbytesFee = state.global.getIn(['props', 'bandwidth_kbytes_fee']);
  var blacklist = state.global.get('blacklist');
  var enable_slider = net_vesting_shares > VOTE_WEIGHT_DROPDOWN_THRESHOLD;
  return {
    post: ownProps.post,
    showList: ownProps.showList,
    author: author,
    permlink: permlink,
    username: username,
    active_votes: active_votes,
    enable_slider: enable_slider,
    is_comment: is_comment,
    post_obj: post,
    current_account: current_account,
    loggedin: username != null,
    voting: voting,
    operationFlatFee: operationFlatFee,
    bandwidthKbytesFee: bandwidthKbytesFee,
    blacklist: blacklist,
    recentClaims: recentClaims,
    rewardBalance: rewardBalance
    // price_per_blurt,
    // sbd_print_rate,
  };
},
// mapDispatchToProps
function (dispatch) {
  return {
    vote: function vote(weight, _ref) {
      var author = _ref.author,
        permlink = _ref.permlink,
        username = _ref.username,
        myVote = _ref.myVote,
        isFlag = _ref.isFlag;
      var confirm = function confirm() {
        if (myVote == null) return null;
        if (weight === 0) return isFlag ? (0, _counterpart["default"])('voting_jsx.removing_your_vote') : (0, _counterpart["default"])('voting_jsx.removing_your_vote_will_reset_curation_rewards_for_this_post');
        if (weight > 0) return isFlag ? (0, _counterpart["default"])('voting_jsx.changing_to_an_upvote') : (0, _counterpart["default"])('voting_jsx.changing_to_an_upvote_will_reset_curation_rewards_for_this_post');
        // if (weight < 0)
        //     return isFlag
        //         ? tt('voting_jsx.changing_to_a_downvote')
        //         : tt(
        //               'voting_jsx.changing_to_a_downvote_will_reset_curation_rewards_for_this_post'
        //           );
        return null;
      };
      dispatch(transactionActions.broadcastOperation({
        type: 'vote',
        operation: {
          voter: username,
          author: author,
          permlink: permlink,
          weight: weight,
          __config: {
            title: weight < 0 ? 'Confirm Downvote' : null
          }
        },
        confirm: confirm,
        errorCallback: function errorCallback(errorKey) {
          console.log('Transaction Error:' + errorKey);
        }
      }));
    }
  };
})(Voting);