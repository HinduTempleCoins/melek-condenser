"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = ServerHTML;
var config = _interopRequireWildcard(require("config"));
var _react = _interopRequireDefault(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function ServerHTML(_ref) {
  var body = _ref.body,
    assets = _ref.assets,
    locale = _ref.locale,
    title = _ref.title,
    meta = _ref.meta,
    shouldSeeAds = _ref.shouldSeeAds,
    adClient = _ref.adClient,
    gptEnabled = _ref.gptEnabled,
    gptBannedTags = _ref.gptBannedTags,
    gptBidding = _ref.gptBidding,
    shouldSeeCookieConsent = _ref.shouldSeeCookieConsent,
    cookieConsentApiKey = _ref.cookieConsentApiKey;
  var page_title = title;
  return /*#__PURE__*/_react["default"].createElement("html", {
    lang: "en"
  }, /*#__PURE__*/_react["default"].createElement("head", null, /*#__PURE__*/_react["default"].createElement("script", {
    async: true,
    src: "https://www.googletagmanager.com/gtag/js?id=G-63ZBEY1EVG"
  }), /*#__PURE__*/_react["default"].createElement("script", {
    content: "window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', 'G-63ZBEY1EVG');"
  }), /*#__PURE__*/_react["default"].createElement("meta", {
    charSet: "utf-8"
  }), /*#__PURE__*/_react["default"].createElement("meta", {
    name: "viewport",
    content: "width=device-width, initial-scale=1.0"
  }), meta && meta.map(function (m) {
    if (m.title) {
      page_title = m.title;
      return null;
    }
    if (m.canonical) {
      return /*#__PURE__*/_react["default"].createElement("link", {
        key: "canonical",
        rel: "canonical",
        href: m.canonical
      });
    }
    if (m.name && m.content) {
      return /*#__PURE__*/_react["default"].createElement("meta", {
        key: m.name,
        name: m.name,
        content: m.content
      });
    }
    if (m.property && m.content) {
      return /*#__PURE__*/_react["default"].createElement("meta", {
        key: m.property,
        property: m.property,
        content: m.content
      });
    }
    return null;
  }), /*#__PURE__*/_react["default"].createElement("link", {
    rel: "manifest",
    href: "/static/manifest.json"
  }), /*#__PURE__*/_react["default"].createElement("link", {
    rel: "icon",
    type: "image/svg+xml",
    href: "/images/favicons/melek.svg"
  }), /*#__PURE__*/_react["default"].createElement("link", {
    rel: "apple-touch-icon",
    href: "/images/favicons/melek.svg"
  }), /*#__PURE__*/_react["default"].createElement("meta", {
    name: "application-name",
    content: "MELEK"
  }), /*#__PURE__*/_react["default"].createElement("meta", {
    name: "msapplication-TileColor",
    content: "#FFFFFF"
  }), /*#__PURE__*/_react["default"].createElement("link", {
    href: "https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,600",
    rel: "stylesheet",
    type: "text/css"
  }), /*#__PURE__*/_react["default"].createElement("link", {
    href: "https://fonts.googleapis.com/css?family=Source+Serif+Pro:400,600",
    rel: "stylesheet",
    type: "text/css"
  }), assets.style.map(function (href, idx) {
    return /*#__PURE__*/_react["default"].createElement("link", {
      href: href,
      key: idx,
      rel: "stylesheet",
      type: "text/css"
    });
  }), shouldSeeCookieConsent ? /*#__PURE__*/_react["default"].createElement("script", {
    id: "Cookiebot",
    src: "https://consent.cookiebot.com/uc.js",
    "data-cbid": cookieConsentApiKey,
    type: "text/javascript",
    async: true
  }) : null, /*#__PURE__*/_react["default"].createElement("script", {
    dangerouslySetInnerHTML: {
      __html: "\n                        window.twttr = (function(d, s, id) {\n                            var js, fjs = d.getElementsByTagName(s)[0],\n                            t = window.twttr || {};\n                            if (d.getElementById(id)) return t;\n                            js = d.createElement(s);\n                            js.id = id;\n                            js.src = \"https://platform.twitter.com/widgets.js\";\n                            fjs.parentNode.insertBefore(js, fjs);\n\n                            t._e = [];\n                            t.ready = function(f) {\n                            t._e.push(f);\n                        };\n\n                            return t;\n                        }(document, \"script\", \"twitter-wjs\"));\n                        "
    }
  }), /*#__PURE__*/_react["default"].createElement("title", null, page_title)), /*#__PURE__*/_react["default"].createElement("body", null, /*#__PURE__*/_react["default"].createElement("div", {
    id: "content",
    dangerouslySetInnerHTML: {
      __html: body
    }
  }), assets.script.map(function (href, idx) {
    return /*#__PURE__*/_react["default"].createElement("script", {
      key: idx,
      src: href
    });
  })));
}