"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = verify;
var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));
var _nodeFetch = _interopRequireDefault(require("node-fetch"));
var _config = _interopRequireDefault(require("config"));
var _crypto = _interopRequireDefault(require("crypto"));
var _secureRandom = _interopRequireDefault(require("secure-random"));
var customer_id = _config["default"].get('telesign.customer_id');
var api_key = '';
if (_config["default"].get('telesign.rest_api_key')) {
  api_key = new Buffer(_config["default"].get('telesign.rest_api_key'), 'base64');
}
var use_case_code = 'BACS'; // Use Case: avoid bulk attack and spammers

// Testing, always blocked: 1-310-555-0100

/** @return {object} - {reference_id} or {error} */
function verify(_ref) {
  var mobile = _ref.mobile,
    confirmation_code = _ref.confirmation_code,
    ip = _ref.ip,
    ignore_score = _ref.ignore_score;
  return /*#__PURE__*/_regenerator["default"].mark(function _callee() {
    var result, _result$risk, recommendation, score, phone, sms, _yield$verifySms, reference_id, _t;
    return _regenerator["default"].wrap(function (_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 1;
          return getScore(mobile);
        case 1:
          result = _context.sent;
          _result$risk = result.risk, recommendation = _result$risk.recommendation, score = _result$risk.score;
          phone = mobile; // if (!ignore_score && recommendation !== 'allow') {
          if (!(!ignore_score && (!score || score > 600))) {
            _context.next = 2;
            break;
          }
          console.log("TeleSign did not allow phone ".concat(mobile, " ip ").concat(ip, ". TeleSign responded: ").concat(recommendation));
          return _context.abrupt("return", {
            error: 'Unable to verify your phone number. Please try a different phone number.',
            score: score
          });
        case 2:
          if (result.numbering && result.numbering.cleansing && result.numbering.cleansing.sms) {
            sms = result.numbering.cleansing.sms;
            phone = sms.country_code + sms.phone_number;
          }
          _context.next = 3;
          return verifySms({
            mobile: mobile,
            confirmation_code: confirmation_code,
            ip: ip
          });
        case 3:
          _yield$verifySms = _context.sent;
          reference_id = _yield$verifySms.reference_id;
          return _context.abrupt("return", {
            reference_id: reference_id,
            score: score,
            phone: phone
          });
        case 4:
          _context.prev = 4;
          _t = _context["catch"](0);
          console.log('-- verify score error -->', _t);
          return _context.abrupt("return", {
            error: 'Unable to verify phone, please try again later.'
          });
        case 5:
        case "end":
          return _context.stop();
      }
    }, _callee, null, [[0, 4]]);
  })();
}
function getScore(mobile) {
  var fields = urlencode({
    ucid: use_case_code
  });
  var resource = '/v1/phoneid/score/' + mobile.match(/\d+/g).join('');
  var method = 'GET';
  return (0, _nodeFetch["default"])("https://rest-ww.telesign.com".concat(resource, "?").concat(fields), {
    method: method,
    headers: authHeaders({
      resource: resource,
      method: method
    })
  }).then(function (r) {
    return r.json();
  })["catch"](function (error) {
    console.error("ERROR: Phone ".concat(mobile, " score exception"), JSON.stringify(error, null, 0));
    return Promise.reject(error);
  }).then(function (response) {
    var status = response.status;
    if (status.code === 300) {
      // Transaction successfully completed
      console.log("Phone ".concat(mobile, " score"), JSON.stringify(response, null, 0));
      return Promise.resolve(response);
    }
    console.error("ERROR: Phone ".concat(mobile, " score"), JSON.stringify(response, null, 0));
    return Promise.reject(response);
  });
}
function verifySms(_ref2) {
  var mobile = _ref2.mobile,
    confirmation_code = _ref2.confirmation_code,
    ip = _ref2.ip;
  // https://developer.telesign.com/v2.0/docs/rest_api-verify-sms
  var f = {
    phone_number: mobile,
    language: 'en-US',
    ucid: use_case_code,
    verify_code: confirmation_code,
    template: '$$CODE$$ is your MELEK confirmation code'
  };
  if (ip) f.originating_ip = ip;
  var fields = urlencode(f);
  // console.log('fields', fields) // logspam

  var resource = '/v1/verify/sms';
  var method = 'POST';
  return (0, _nodeFetch["default"])('https://rest.telesign.com' + resource, {
    method: method,
    body: fields,
    headers: authHeaders({
      resource: resource,
      method: method,
      fields: fields
    })
  }).then(function (r) {
    return r.json();
  })["catch"](function (error) {
    console.error("ERROR: SMS failed to ".concat(mobile, " code ").concat(confirmation_code, " req ip ").concat(ip, " exception"), JSON.stringify(error, null, 0));
    return Promise.reject(error);
  }).then(function (response) {
    var status = response.status;
    if (status.code === 290) {
      // Message in progress
      console.log("Sent SMS to ".concat(mobile, " code ").concat(confirmation_code), JSON.stringify(response, null, 0));
      return Promise.resolve(response);
    }
    console.error("ERROR: SMS failed to ".concat(mobile, " code ").concat(confirmation_code, ":"), JSON.stringify(response, null, 0));
    return Promise.reject(response);
  });
}

/**
    @arg {string} resource `/v1/verify/AEBC93B5898342F790E4E19FED41A7DA`
    @arg {string} method [GET|POST|PUT]
    @arg {string} fields url query string
*/
function authHeaders(_ref3) {
  var resource = _ref3.resource,
    fields = _ref3.fields,
    _ref3$method = _ref3.method,
    method = _ref3$method === void 0 ? 'GET' : _ref3$method;
  var auth_method = 'HMAC-SHA256';
  var currDate = new Date().toUTCString();
  var nonce = parseInt(_secureRandom["default"].randomBuffer(8).toString('hex'), 16).toString(36);
  var content_type = '';
  if (/POST|PUT/.test(method)) {
    content_type = 'application/x-www-form-urlencoded';
  }
  var strToSign = "".concat(method, "\n").concat(content_type, "\n\nx-ts-auth-method:").concat(auth_method, "\nx-ts-date:").concat(currDate, "\nx-ts-nonce:").concat(nonce);
  if (fields) {
    strToSign += '\n' + fields;
  }
  strToSign += '\n' + resource;

  // console.log('strToSign', strToSign) // logspam
  var sig = _crypto["default"].createHmac('sha256', api_key).update(strToSign, 'utf8').digest('base64');
  var headers = {
    Authorization: "TSA ".concat(customer_id, ":").concat(sig),
    'Content-Type': content_type,
    'x-ts-date': currDate,
    'x-ts-auth-method': auth_method,
    'x-ts-nonce': nonce
  };
  return headers;
}
var urlencode = function urlencode(json) {
  return Object.keys(json).map(function (key) {
    return encodeURI(key) + '=' + encodeURI(json[key]);
  }).join('&');
};