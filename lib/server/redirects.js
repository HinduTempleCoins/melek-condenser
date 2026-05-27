"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = useRedirects;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _koaRouter = _interopRequireDefault(require("koa-router"));
var redirects = [
// example: [/\/about(\d+)-(.+)/, '/about?$0:$1', 302],
[/^\/recent\/?$/, '/created'], [/^\/pick_account.*/, 'https://wallet.melek.salon/signup']];
function useRedirects(app) {
  var router = (0, _koaRouter["default"])();
  app.use(router.routes());
  redirects.forEach(function (r) {
    router.get(r[0], /*#__PURE__*/_regenerator["default"].mark(function _callee() {
      var _this = this;
      var dest;
      return _regenerator["default"].wrap(function (_context) {
        while (1) switch (_context.prev = _context.next) {
          case 0:
            dest = Object.keys(this.params).reduce(function (value, key) {
              return value.replace('$' + key, _this.params[key]);
            }, r[1]);
            console.log("server redirect: [".concat(r[0], "] ").concat(this.request.url, " -> ").concat(dest));
            this.status = r[2] || 301;
            this.redirect(dest);
          case 1:
          case "end":
            return _context.stop();
        }
      }, _callee, this);
    }));
  });
}