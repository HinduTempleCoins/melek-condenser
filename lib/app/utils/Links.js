"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.remote = exports.makeParams = exports.local = exports.imageFile = exports.image = exports.determineViewMode = exports["default"] = exports.any = exports.addToParams = void 0;
var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));
var _constants = require("../../shared/constants");
var urlChar = '[^\\s"<>\\]\\[\\(\\)]';
var urlCharEnd = urlChar.replace(/\]$/, ".,']"); // insert bad chars to end on
var imagePath = '(?:(?:\\.(?:tiff?|jpe?g|gif|png|svg|ico)|ipfs/[a-z\\d]{40,}))';
var domainPath = '(?:[-a-zA-Z0-9\\._]*[-a-zA-Z0-9])';
var urlChars = '(?:' + urlChar + '*' + urlCharEnd + ')?';
var urlSet = function urlSet() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
    _ref$domain = _ref.domain,
    domain = _ref$domain === void 0 ? domainPath : _ref$domain,
    path = _ref.path;
  // urlChars is everything but html or markdown stop chars
  return "https?://".concat(domain, "(?::\\d{2,5})?(?:[/\\?#]").concat(urlChars).concat(path || '', ")").concat(path ? '' : '?');
};

/**
    Unless your using a 'g' (glob) flag you can store and re-use your regular expression.  Use the cache below.  If your using a glob (for example: replace all), the regex object becomes stateful and continues where it left off when called with the same string so naturally the regexp object can't be cached for long.
*/
var any = exports.any = function any() {
  var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'i';
  return new RegExp(urlSet(), flags);
};
var local = exports.local = function local() {
  var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'i';
  return new RegExp(urlSet({
    domain: '(?:localhost|(?:.*\\.)?melek.salon)'
  }), flags);
};
var remote = exports.remote = function remote() {
  var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'i';
  return new RegExp(urlSet({
    domain: "(?!localhost|(?:.*\\.)?melek.salon)".concat(domainPath)
  }), flags);
};
var image = exports.image = function image() {
  var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'i';
  return new RegExp(urlSet({
    path: imagePath
  }), flags);
};
var imageFile = exports.imageFile = function imageFile() {
  var flags = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'i';
  return new RegExp(imagePath, flags);
};
// export const nonImage = (flags = 'i') => new RegExp(urlSet({path: '!' + imageFile}), flags)
// export const markDownImageRegExp = (flags = 'i') => new RegExp('\!\[[\w\s]*\]\(([^\)]+)\)', flags);
var _default = exports["default"] = {
  any: any(),
  local: local(),
  remote: remote(),
  image: image(),
  imageFile: imageFile()
}; // TODO: possible this should go somewhere else.
/**
 * Returns a new object extended from outputParams with [key] == inputParams[key] if the value is in allowedValues
 * @param outputParams
 * @param inputParams
 * @param key
 * @param allowedValues
 * @returns {*}
 */
var addToParams = exports.addToParams = function addToParams(outputParams, inputParams, key, allowedValues) {
  var respParams = Object.assign({}, outputParams);
  if (inputParams[key] && allowedValues.indexOf(inputParams[key]) > -1) {
    respParams[key] = inputParams[key];
  }
  return respParams;
};

// TODO: possible this should go somewhere else.
var makeParams = exports.makeParams = function makeParams(params, prefix) {
  var paramsList = [];
  if (params.constructor === Array) {
    paramsList = params;
  } else {
    Object.entries(params).forEach(function (_ref2) {
      var _ref3 = (0, _slicedToArray2["default"])(_ref2, 2),
        key = _ref3[0],
        value = _ref3[1];
      paramsList.push("".concat(key, "=").concat(value));
    });
  }
  if (paramsList.length > 0) {
    return (prefix !== false ? typeof prefix === 'string' ? prefix : '?' : '') + paramsList.join('&');
  }
  return '';
};

/**
 *
 * @param {string} search - window.location.search formatted string (may omit '?')
 * @returns {string}
 */
var determineViewMode = exports.determineViewMode = function determineViewMode(search) {
  var searchList = search.indexOf('?') === 0 ? search.substr(1).split('&') : search.split('&');
  for (var i = 0; i < searchList.length; i++) {
    if (searchList[i].indexOf(_constants.PARAM_VIEW_MODE) === 0) {
      if (searchList[i] == _constants.PARAM_VIEW_MODE + '=' + _constants.VIEW_MODE_WHISTLE) {
        // we only want to support known view modes.
        return _constants.VIEW_MODE_WHISTLE;
      }
      return '';
    }
  }
  return '';
};

// Original regex
// const urlRegex = '^(?!mailto:)(?:(?:http|https|ftp)://)(?:\\S+(?::\\S*)?@)?(?:(?:(?:[1-9]\\d?|1\\d\\d|2[01]\\d|22[0-3])(?:\\.(?:1?\\d{1,2}|2[0-4]\\d|25[0-5])){2}(?:\\.(?:[0-9]\\d?|1\\d\\d|2[0-4]\\d|25[0-4]))|(?:(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)(?:\\.(?:[a-z\\u00a1-\\uffff0-9]+-?)*[a-z\\u00a1-\\uffff0-9]+)*(?:\\.(?:[a-z\\u00a1-\\uffff]{2,})))|localhost)(?::\\d{2,5})?(?:(/|\\?|#)[^\\s]*)?$';

// About performance
// Using exec on the same regex object requires a new regex to be created and compile for each text (ex: post).  Instead replace can be used `body.replace(remoteRe, l => {` discarding the result for better performance`}).  Re-compiling is a chrome bottleneck but did not effect nodejs.