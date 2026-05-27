"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));
var _react = _interopRequireDefault(require("react"));
var _reactRedux = require("react-redux");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _counterpart = _interopRequireDefault(require("counterpart"));
var _CloseButton = _interopRequireDefault(require("app/components/elements/CloseButton"));
var _Icon = _interopRequireDefault(require("app/components/elements/Icon"));
var _reactRouter = require("react-router");
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { (0, _defineProperty2["default"])(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
var SidePanel = function SidePanel(_ref) {
  var alignment = _ref.alignment,
    visible = _ref.visible,
    hideSidePanel = _ref.hideSidePanel,
    username = _ref.username,
    walletUrl = _ref.walletUrl;
  if (process.env.BROWSER) {
    visible && document.addEventListener('click', hideSidePanel);
    !visible && document.removeEventListener('click', hideSidePanel);
  }
  var loggedIn = username === undefined ? 'show-for-small-only' : 'SidePanel__hide-signup';
  var makeLink = function makeLink(i, ix, arr) {
    // A link is internal if it begins with a slash
    var isExternal = !i.link.match(/^\//) || i.isExternal;
    if (isExternal) {
      var cn = ix === arr.length - 1 ? 'last' : null;
      return /*#__PURE__*/_react["default"].createElement("li", {
        key: i.value,
        className: cn
      }, /*#__PURE__*/_react["default"].createElement("a", {
        href: i.link,
        target: i.internal ? null : '_blank',
        rel: "noopener noreferrer"
      }, i.label, "\xA0", /*#__PURE__*/_react["default"].createElement(_Icon["default"], {
        name: "extlink"
      })));
    } else {
      var _cn = ix === arr.length - 1 ? 'last' : null;
      return /*#__PURE__*/_react["default"].createElement("li", {
        key: i.value,
        className: _cn
      }, /*#__PURE__*/_react["default"].createElement(_reactRouter.Link, {
        to: i.link
      }, i.label));
    }
  };
  var sidePanelLinks = {
    internal: [{
      value: 'welcome',
      label: (0, _counterpart["default"])('navigation.welcome'),
      link: '/welcome'
    }, {
      value: 'faq',
      label: (0, _counterpart["default"])('navigation.faq'),
      link: 'https://blurtfaq.org'
    }, {
      value: 'tags',
      label: (0, _counterpart["default"])('navigation.explore'),
      link: '/tags'
    },
    // {
    //     value: 'recover_account_step_1',
    //     label: tt('navigation.stolen_account_recovery'),
    //     link: `${walletUrl}/recover_account_step_1`,
    // },
    {
      value: 'change_password',
      label: (0, _counterpart["default"])('navigation.change_account_password'),
      link: "".concat(walletUrl, "/change_password")
    }, {
      value: 'vote_for_witnesses',
      label: (0, _counterpart["default"])('navigation.vote_for_witnesses'),
      link: "".concat(walletUrl, "/~witnesses")
    }],
    exchanges: [{
      value: 'probit',
      label: 'Probit',
      link: 'https://www.probit.com/app/exchange/MELEK-BTC'
    }, {
      value: 'ionomy',
      label: 'Ionomy',
      link: 'https://ionomy.com/en/markets/btc-blurt'
    }, {
      value: 'beldex',
      label: 'Beldex',
      link: 'https://www.beldex.io/tradeAdvance?pair=MELEK_BTC'
    }, {
      value: 'stex',
      label: 'Stex',
      link: 'https://app.stex.com/en/trade/pair/BTC/MELEK/1D'
    }, {
      value: 'hive-engine',
      label: 'Hive Engine',
      link: 'https://hive-engine.com/?p=market&t=MELEK'
    }, {
      value: 'steem-engine',
      label: 'Steem Engine',
      link: 'https://steem-engine.com/?p=market&t=MELEK'
    }, {
      value: 'leodex',
      label: 'Leodex',
      link: 'https://leodex.io/'
    }],
    wrapped: [{
      value: 'wblurt',
      label: 'Uniswap',
      link: 'https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0x37472814e5c6146e6ca7ed1753cd1b18b733e5d4'
    }],
    external: [{
      value: 'chat',
      label: (0, _counterpart["default"])('navigation.chat'),
      link: '/chat',
      internal: true
    }, {
      value: 'block_explorer',
      label: 'Block Explorer',
      link: 'https://blocks.blurtwallet.com'
    }
    // {
    //     value: 'jobs',
    //     label: tt('navigation.jobs'),
    //     link: 'https://recruiting.paylocity.com/recruiting/jobs/List/3288/Steemit-Inc',
    // },
    // {
    //     value: 'tools',
    //     label: 'Tools',
    //     link: 'https://blurt.tools/',
    // },
    // {
    //     value: 'business',
    //     label: tt('navigation.business_center'),
    //     link: 'https://steemeconomy.com/',
    // },
    // {
    //     value: 'api_docs',
    //     label: tt('navigation.api_docs'),
    //     link: 'https://developers.steem.io/',
    // },
    ],
    organizational: [
    // {
    //     value: 'bluepaper',
    //     label: tt('navigation.bluepaper'),
    //     link: 'https://steem.io/steem-bluepaper.pdf',
    // },
    // {
    //     value: 'smt_whitepaper',
    //     label: tt('navigation.smt_whitepaper'),
    //     link: 'https://smt.steem.io/',
    // },
    // {
    //     value: 'whitepaper',
    //     label: tt('navigation.whitepaper'),
    //     link: 'https://steem.io/SteemWhitePaper.pdf',
    // },
    {
      value: 'about',
      label: (0, _counterpart["default"])('navigation.about'),
      link: '/about.html',
      internal: true
    }],
    legal: [{
      value: 'privacy',
      label: (0, _counterpart["default"])('navigation.privacy_policy'),
      link: '/privacy.html'
    }, {
      value: 'tos',
      label: (0, _counterpart["default"])('navigation.terms_of_service'),
      link: '/tos.html'
    }],
    extras: [{
      value: 'login',
      label: (0, _counterpart["default"])('g.sign_in'),
      link: '/login.html'
    }, {
      value: 'signup',
      label: (0, _counterpart["default"])('g.sign_up'),
      link: 'https://wallet.melek.salon/signup'
    }, {
      value: 'post',
      label: (0, _counterpart["default"])('g.post'),
      link: '/submit.html'
    }],
    swag: [{
      value: 'logo-merch',
      label: 'Logo Merch',
      link: 'https://www.redbubble.com/shop/ap/51822392'
    }, {
      value: 'text-merch',
      label: 'Text Merch',
      link: 'https://www.redbubble.com/shop/ap/51897803'
    }]
  };
  return /*#__PURE__*/_react["default"].createElement("div", {
    className: "SidePanel"
  }, /*#__PURE__*/_react["default"].createElement("div", {
    className: (visible ? 'visible ' : '') + alignment
  }, /*#__PURE__*/_react["default"].createElement(_CloseButton["default"], {
    onClick: hideSidePanel
  }), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "vertical menu ".concat(loggedIn)
  }, sidePanelLinks.extras.map(makeLink)), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "vertical menu"
  }, sidePanelLinks.internal.map(makeLink)), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "vertical menu"
  }, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
    className: "menu-section"
  }, (0, _counterpart["default"])('navigation.third_party_exchanges'))), sidePanelLinks.exchanges.map(makeLink)), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "vertical menu"
  }, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
    className: "menu-section"
  }, "Wrapped MELEK")), sidePanelLinks.wrapped.map(makeLink)), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "vertical menu"
  }, /*#__PURE__*/_react["default"].createElement("li", null, /*#__PURE__*/_react["default"].createElement("a", {
    className: "menu-section"
  }, (0, _counterpart["default"])('navigation.blurt_swag'))), sidePanelLinks.swag.map(makeLink)), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "vertical menu"
  }, sidePanelLinks.external.map(makeLink)), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "vertical menu"
  }, sidePanelLinks.organizational.map(makeLink)), /*#__PURE__*/_react["default"].createElement("ul", {
    className: "vertical menu"
  }, sidePanelLinks.legal.map(makeLink))));
};
SidePanel.propTypes = {
  alignment: _propTypes["default"].oneOf(['left', 'right']).isRequired,
  visible: _propTypes["default"].bool.isRequired,
  hideSidePanel: _propTypes["default"].func.isRequired,
  username: _propTypes["default"].string
};
SidePanel.defaultProps = {
  username: undefined
};
var _default = exports["default"] = (0, _reactRedux.connect)(function (state, ownProps) {
  var walletUrl = state.app.get('walletUrl');
  return _objectSpread({
    walletUrl: walletUrl
  }, ownProps);
}, function (dispatch) {
  return {};
})(SidePanel);