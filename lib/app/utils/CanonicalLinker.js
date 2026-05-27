"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeCanonicalLink = makeCanonicalLink;
var _apps = _interopRequireDefault(require("steemscript/apps.json"));
function makeCanonicalLink(d) {
  var canonicalUrl = 'https://melek.salon' + d.link;
  if (d.json_metadata) {
    if (d.json_metadata.canonical_url && typeof d.json_metadata.canonical_url === 'string') {
      var urlTester = new RegExp(/^https?:\/\//);
      if (urlTester.test(d.json_metadata.canonical_url)) {
        return d.json_metadata.canonical_url;
      }
    }
    if (d.json_metadata.app && typeof d.json_metadata.app === 'string') {
      var hasAppTemplateData = d.json_metadata && d.json_metadata.app && d.category && d.json_metadata.app.split('/').length === 2;
      if (hasAppTemplateData) {
        var app = d.json_metadata.app.split('/')[0];
        var hasAppData = _apps["default"][app] && _apps["default"][app].url_scheme;
        if (hasAppData) {
          canonicalUrl = _apps["default"][app].url_scheme.split('{category}').join(d.category).split('{username}').join(d.author).split('{permlink}').join(d.permlink);
        }
      }
    }
  }
  return canonicalUrl;
}