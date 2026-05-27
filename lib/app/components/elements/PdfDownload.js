"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
var _typeof = require("@babel/runtime/helpers/typeof");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));
var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));
var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));
var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));
var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));
var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));
var _react = _interopRequireWildcard(require("react"));
var _ecc = require("@blurtfoundation/blurtjs/lib/auth/ecc");
var _qrious = _interopRequireDefault(require("qrious"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function _interopRequireWildcard(e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, "default": e }; if (null === e || "object" != _typeof(e) && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (var _t in e) "default" !== _t && {}.hasOwnProperty.call(e, _t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, _t)) && (i.get || i.set) ? o(f, _t, i) : f[_t] = e[_t]); return f; })(e, t); }
function _callSuper(t, o, e) { return o = (0, _getPrototypeOf2["default"])(o), (0, _possibleConstructorReturn2["default"])(t, _isNativeReflectConstruct() ? Reflect.construct(o, e || [], (0, _getPrototypeOf2["default"])(t).constructor) : o.apply(t, e)); }
function _isNativeReflectConstruct() { try { var t = !Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); } catch (t) {} return (_isNativeReflectConstruct = function _isNativeReflectConstruct() { return !!t; })(); }
function image2canvas(image, bgcolor) {
  var canvas = document.createElement('canvas');
  canvas.width = image.width * 32;
  canvas.height = image.height * 32;
  var ctx = canvas.getContext('2d');
  ctx.fillStyle = bgcolor;
  ctx.fillRect(0.0, 0.0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
  return canvas;
}
var PdfDownload = exports["default"] = /*#__PURE__*/function (_Component) {
  function PdfDownload(props) {
    var _this;
    (0, _classCallCheck2["default"])(this, PdfDownload);
    _this = _callSuper(this, PdfDownload, [props]);
    _this.downloadPdf = _this.downloadPdf.bind(_this);
    _this.state = {
      loaded: false
    };
    return _this;
  }

  // Generate a list of public and private keys from a master password
  (0, _inherits2["default"])(PdfDownload, _Component);
  return (0, _createClass2["default"])(PdfDownload, [{
    key: "generateKeys",
    value: function generateKeys(name, password) {
      return ['active', 'owner', 'posting', 'memo'].reduce(function (accum, kind, i) {
        var rawKey = _ecc.PrivateKey.fromSeed("".concat(name).concat(kind).concat(password));
        accum["".concat(kind, "Private")] = rawKey.toString();
        accum["".concat(kind, "Public")] = rawKey.toPublicKey().toString();
        return accum;
      }, {
        master: password
      });
    }
  }, {
    key: "downloadPdf",
    value: function downloadPdf() {
      var keys = this.generateKeys(this.props.name, this.props.password);
      var filename = this.props.name + '_steem_keys.pdf';
      this.renderPdf(keys, filename).save(filename);
    }

    // Generate the canvas, which will be generated into a PDF
  }, {
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = (0, _asyncToGenerator2["default"])(/*#__PURE__*/_regenerator["default"].mark(function _callee() {
        return _regenerator["default"].wrap(function (_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              // Load jsPDF. It does not work with webpack, so it must be loaded here.
              // On the plus side, it is only loaded when the warning page is shown.
              this.setState({
                loaded: false
              });
              _context.next = 1;
              return new Promise(function (res, rej) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://static.blurt.world/jspdf.min.js';
                document.body.appendChild(s);
                s.addEventListener('load', res);
              });
            case 1:
              _context.next = 2;
              return new Promise(function (res, rej) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://static.blurt.world/Roboto-Regular-normal.js';
                document.body.appendChild(s);
                s.addEventListener('load', res);
              });
            case 2:
              _context.next = 3;
              return new Promise(function (res, rej) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://static.blurt.world/Roboto-Bold-normal.js';
                document.body.appendChild(s);
                s.addEventListener('load', res);
              });
            case 3:
              _context.next = 4;
              return new Promise(function (res, rej) {
                var s = document.createElement('script');
                s.type = 'text/javascript';
                s.src = 'https://static.blurt.world/RobotoMono-Regular-normal.js';
                document.body.appendChild(s);
                s.addEventListener('load', res);
              });
            case 4:
              this.setState({
                loaded: true
              });
            case 5:
            case "end":
              return _context.stop();
          }
        }, _callee, this);
      }));
      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }
      return componentDidMount;
    }()
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;
      return /*#__PURE__*/_react["default"].createElement("div", {
        className: "pdf-download"
      }, /*#__PURE__*/_react["default"].createElement("img", {
        src: "/images/pdf-logo.svg",
        style: {
          display: 'none'
        },
        className: "pdf-logo"
      }), this.state.loaded && /*#__PURE__*/_react["default"].createElement("button", {
        style: {
          display: 'block'
        },
        onClick: function onClick(e) {
          _this2.downloadPdf();
          e.preventDefault();
        }
      }, this.props.label));
    }
  }, {
    key: "renderText",
    value: function renderText(ctx, text, _ref) {
      var scale = _ref.scale,
        x = _ref.x,
        y = _ref.y,
        lineHeight = _ref.lineHeight,
        maxWidth = _ref.maxWidth,
        color = _ref.color,
        fontSize = _ref.fontSize,
        font = _ref.font;
      var textLines = ctx.setFont(font).setFontSize(fontSize * scale).setTextColor(color).splitTextToSize(text, maxWidth);
      ctx.text(textLines, x, y + fontSize);
      return textLines.length * fontSize * lineHeight;
    }
  }, {
    key: "drawFilledRect",
    value: function drawFilledRect(ctx, x, y, w, h, _ref2) {
      var color = _ref2.color;
      ctx.setDrawColor(0);
      ctx.setFillColor(color);
      ctx.rect(x, y, w, h, 'F');
    }
  }, {
    key: "drawStrokedRect",
    value: function drawStrokedRect(ctx, x, y, w, h, _ref3) {
      var color = _ref3.color,
        lineWidth = _ref3.lineWidth;
      ctx.setLineWidth(lineWidth);
      ctx.setDrawColor(color);
      ctx.rect(x, y, w, h);
    }
  }, {
    key: "drawImageFromCanvas",
    value: function drawImageFromCanvas(ctx, selector, x, y, w, h, bgcolor) {
      var canvas = image2canvas(document.querySelector(selector), bgcolor); // svg -> jpg
      ctx.addImage(canvas, 'JPEG', x, y, w, h);
    }
  }, {
    key: "drawQr",
    value: function drawQr(ctx, data, x, y, size, bgcolor) {
      var canvas = document.createElement('canvas');
      var qr = new _qrious["default"]({
        element: canvas,
        size: 250,
        value: data,
        background: bgcolor
      });
      ctx.addImage(canvas, 'PNG', x, y, size, size);
    }
  }, {
    key: "renderPdf",
    value: function renderPdf(keys, filename) {
      var widthInches = this.props.widthInches; // 8.5,
      var lineHeight = 1.2;
      var margin = 0.3;
      var maxLineWidth = widthInches - margin * 2.0;
      var fontSize = 24;
      var scale = 72; // ptsPerInch
      var oneLineHeight = fontSize * lineHeight / scale;
      var qrSize = 1.1;
      var ctx = new jsPDF({
        orientation: 'portrait',
        unit: 'in',
        lineHeight: lineHeight,
        format: 'letter'
      }).setProperties({
        title: filename
      });
      var offset = 0.0;
      var sectionStart = 0;
      var sectionHeight = 0;

      // HEADER

      sectionHeight = 1.29;
      this.drawFilledRect(ctx, 0.0, 0.0, widthInches, sectionHeight, {
        color: '#1f0fd1'
      });
      this.drawImageFromCanvas(ctx, '.pdf-logo', widthInches - margin - 1.9, 0.36, 0.98 * 1.8, 0.3 * 1.8, '#1F0FD1');
      offset += 0.265;
      offset += this.renderText(ctx, "MELEK keys for @".concat(this.props.name), {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: 1.0,
        maxWidth: maxLineWidth,
        color: 'white',
        fontSize: 0.36,
        font: 'Roboto-Bold'
      });

      /*
      offset += 0.1;
      offset += this.renderText(
          ctx,
          'Your recovery account partner: wallet.blurt.world',
          {
              scale,
              x: margin,
              y: offset,
              lineHeight: 1.0,
              maxWidth: maxLineWidth,
              color: 'white',
              fontSize: 0.18,
              font: 'Roboto-Bold',
          }
      );
      */

      offset += 0.15;
      offset += this.renderText(ctx, 'Generated at ' + new Date().toISOString().replace(/\.\d{3}/, '') + ' by melek.salon', {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: 1.0,
        maxWidth: maxLineWidth,
        color: 'white',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset = sectionStart + sectionHeight;

      // BODY
      /*
      offset += 0.2;
      offset += this.renderText(
          ctx,
          'blurt.world is powered by MELEK and uses its hierarchical key ' +
              'system to keep you and your tokens safe. Print this out and ' +
              'keep it somewhere safe. When in doubt, use your Private ' +
              'Posting Key as your password, not your Master Password which ' +
              'is only intended to be used to change your private keys. You ' +
              'can also view these anytime at: https://explorer.blurt.world/' +
              this.props.name,
          {
              scale,
              x: margin,
              y: offset,
              lineHeight: lineHeight,
              maxWidth: maxLineWidth,
              color: 'black',
              fontSize: 0.14,
              font: 'Roboto-Regular',
          }
      );
      */
      // PRIVATE KEYS INTRO

      offset += 0.2;
      offset += this.renderText(ctx, 'Your Private Keys', {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.18,
        font: 'Roboto-Bold'
      });
      offset += 0.1;
      offset += this.renderText(ctx, 'Instead of password based authentication, blockchain accounts ' + 'have a set of public and private key pairs that are used for ' + 'authentication as well as the encryption and decryption of ' + 'data. Do not share this file with anyone.', {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Regular'
      });
      offset += 0.2;

      // POSTING KEY

      sectionStart = offset;
      sectionHeight = qrSize + 0.15 * 2;
      this.drawFilledRect(ctx, 0.0, offset, widthInches, sectionHeight, {
        color: 'f4f4f4'
      });
      offset += 0.15;
      this.drawQr(ctx, 'blurt://import/wif/' + keys.postingPrivate + '/account/' + this.props.name, margin, offset, qrSize, '#f4f4f4');
      offset += 0.1;
      offset += this.renderText(ctx, 'Private Posting Key', {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset += this.renderText(ctx, 'Used to log in to apps such as melek.salon and perform social ' + 'actions such as posting, commenting, and voting.', {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth - (qrSize + 0.1),
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Regular'
      });
      offset += 0.075;
      offset += this.renderText(ctx, keys.postingPrivate, {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: sectionStart + sectionHeight - 0.6,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'RobotoMono-Regular'
      });
      offset += 0.2;
      offset = sectionStart + sectionHeight;

      // MEMO KEY

      sectionStart = offset;
      sectionHeight = qrSize + 0.15 * 2;
      // this.drawFilledRect(ctx, 0.0, offset, widthInches, sectionHeight, {color: '#f4f4f4'});

      offset += 0.15;
      this.drawQr(ctx, 'blurt://import/wif/' + keys.memoPrivate + '/account/' + this.props.name, margin, offset, qrSize, '#ffffff');
      offset += 0.1;
      offset += this.renderText(ctx, 'Private Memo Key', {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset += this.renderText(ctx, 'Used to decrypt private transfer memos.', {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth - (qrSize + 0.1),
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Regular'
      });
      offset += 0.075;
      offset += this.renderText(ctx, keys.memoPrivate, {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: sectionStart + sectionHeight - 0.6,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'RobotoMono-Regular'
      });
      offset += 0.1;
      offset = sectionStart + sectionHeight;

      // ACTIVE KEY

      sectionStart = offset;
      sectionHeight = qrSize + 0.15 * 2;
      this.drawFilledRect(ctx, 0.0, offset, widthInches, sectionHeight, {
        color: '#f4f4f4'
      });
      offset += 0.15;
      this.drawQr(ctx, 'blurt://import/wif/' + keys.activePrivate + '/account/' + this.props.name, margin, offset, qrSize, '#f4f4f4');
      offset += 0.1;
      offset += this.renderText(ctx, 'Private Active Key', {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset += this.renderText(ctx, 'Used for monetary and wallet related actions, such as ' + 'transferring tokens or powering MELEK up and down.', {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth - (qrSize + 0.1),
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Regular'
      });
      offset += 0.075;
      offset += this.renderText(ctx, keys.activePrivate, {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: sectionStart + sectionHeight - 0.6,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'RobotoMono-Regular'
      });
      offset += 0.2;
      offset = sectionStart + sectionHeight;

      // OWNER KEY

      sectionStart = offset;
      sectionHeight = qrSize + 0.15 * 2;
      // this.drawFilledRect(ctx, 0.0, offset, widthInches, sectionHeight, {color: '#f4f4f4'});

      offset += 0.15;
      this.drawQr(ctx, 'blurt://import/wif/' + keys.ownerPrivate + '/account/' + this.props.name, margin, offset, qrSize, '#ffffff');
      offset += 0.1;
      offset += this.renderText(ctx, 'Private Owner Key', {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth - qrSize - 0.1,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset += this.renderText(ctx, 'This key is used to reset all your other keys. It is ' + 'recommended to keep it offline at all times. If your ' + 'account is compromised, use this key to recover it ' + 'within 30 days at https://blurtwallet.com.', {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth - (qrSize + 0.1),
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Regular'
      });
      offset += 0.075;
      offset += this.renderText(ctx, keys.ownerPrivate, {
        scale: scale,
        x: margin + qrSize + 0.1,
        y: sectionStart + sectionHeight - 0.6,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth - qrSize - 0.1,
        color: 'black',
        fontSize: 0.14,
        font: 'RobotoMono-Regular'
      });
      offset = sectionStart + sectionHeight;

      // MASTER PASSWORD

      sectionHeight = 1;
      sectionStart = offset;
      this.drawFilledRect(ctx, 0.0, offset, widthInches, sectionHeight, {
        color: '#f4f4f4'
      });
      offset += 0.2;
      offset += this.renderText(ctx, ['Master Password'].join(''), {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset += this.renderText(ctx, 'The seed password used to generate this document. ' + 'Do not share this key.', {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Regular'
      });
      offset += 0.075;
      offset += this.renderText(ctx, keys.master, {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'RobotoMono-Regular'
      });
      offset = sectionStart + sectionHeight;

      // PUBLIC KEYS INTRO

      sectionStart = offset;
      sectionHeight = 1.0;
      // this.drawFilledRect(ctx, 0.0, offset, widthInches, sectionHeight, {color: '#f4f4f4'});

      offset += 0.1;
      offset += this.renderText(ctx, 'Your Public Keys', {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.18,
        font: 'Roboto-Bold'
      });
      offset += 0.1;
      offset += this.renderText(ctx, 'Public keys are associated with usernames and are used to ' + 'encrypt and verify messages. Your public keys are not required ' + 'for login. You can view these anytime at: https://melek.salon/@' + this.props.name, {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.15,
        font: 'Roboto-Regular'
      });
      offset = sectionStart + sectionHeight;

      // PUBLIC KEYS

      this.renderText(ctx, 'Posting Public', {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset += this.renderText(ctx, keys.postingPublic, {
        scale: scale,
        x: 1.25,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'RobotoMono-Regular'
      });
      this.renderText(ctx, 'Memo Public', {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset += this.renderText(ctx, keys.memoPublic, {
        scale: scale,
        x: 1.25,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'RobotoMono-Regular'
      });
      this.renderText(ctx, 'Active Public', {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset += this.renderText(ctx, keys.activePublic, {
        scale: scale,
        x: 1.25,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'RobotoMono-Regular'
      });
      this.renderText(ctx, 'Owner Public', {
        scale: scale,
        x: margin,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'Roboto-Bold'
      });
      offset += this.renderText(ctx, keys.ownerPublic, {
        scale: scale,
        x: 1.25,
        y: offset,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: 'black',
        fontSize: 0.14,
        font: 'RobotoMono-Regular'
      });
      this.renderText(ctx, 'v0.1', {
        scale: scale,
        x: maxLineWidth - 0.2,
        y: offset - 0.2,
        lineHeight: lineHeight,
        maxWidth: maxLineWidth,
        color: '#bbbbbb',
        fontSize: 0.14,
        font: 'Roboto-Regular'
      });
      return ctx;
    }
  }]);
}(_react.Component);