"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = resolveRoute;
exports.routeRegex = void 0;
var _GDPRUserList = _interopRequireDefault(require("./utils/GDPRUserList"));
var routeRegex = exports.routeRegex = {
  PostsIndex: /^\/(@[\w\.\d-]+)\/feed\/?$/,
  UserProfile1: /^\/(@[\w\.\d-]+)\/?$/,
  UserProfile2: /^\/(@[\w\.\d-]+)\/(blog|posts|comments|transfers|curation-rewards|author-rewards|permissions|created|recent-replies|notifications|feed|password|followed|followers|settings)\/?$/,
  UserProfile3: /^\/(@[\w\.\d-]+)\/[\w\.\d-]+/,
  CategoryFilters: /^\/(hot|trending|promoted|payout|payout_comments|created)\/?$/gi,
  PostNoCategory: /^\/(@[\w\.\d-]+)\/([\w\d-]+)/,
  Post: /^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)\/?($|\?)/,
  PostJson: /^\/([\w\d\-\/]+)\/(\@[\w\d\.-]+)\/([\w\d-]+)(\.json)$/,
  UserJson: /^\/(@[\w\.\d-]+)(\.json)$/,
  UserNameJson: /^.*(?=(\.json))/
};
function resolveRoute(path) {
  if (path === '/') {
    return {
      page: 'PostsIndex',
      params: ['hot']
    };
  }
  if (path === '/about.html') {
    return {
      page: 'About'
    };
  }
  if (path === '/welcome') {
    return {
      page: 'Welcome'
    };
  }
  if (path === '/chat') {
    return {
      page: 'Chat'
    };
  }
  if (path === '/faq.html') {
    return {
      page: 'Faq'
    };
  }
  if (path === '/login.html') {
    return {
      page: 'Login'
    };
  }
  if (path === '/privacy.html') {
    return {
      page: 'Privacy'
    };
  }
  if (path === '/support.html') {
    return {
      page: 'Support'
    };
  }
  if (path === '/xss/test' && process.env.NODE_ENV === 'development') {
    return {
      page: 'XSSTest'
    };
  }
  if (path === '/benchmark' && process.env.OFFLINE_SSR_TEST) {
    return {
      page: 'Benchmark'
    };
  }
  if (path === '/tags') {
    return {
      page: 'Tags'
    };
  }
  if (path === '/tos.html') {
    return {
      page: 'Tos'
    };
  }
  if (path === '/change_password') {
    return {
      page: 'ChangePassword'
    };
  }
  if (path === '/recover_account_step_1') {
    return {
      page: 'RecoverAccountStep1'
    };
  }
  if (path === '/~witnesses') {
    return {
      page: 'Witnesses'
    };
  }
  if (path === '/submit.html') {
    return {
      page: 'SubmitPost'
    };
  }
  var match = path.match(routeRegex.PostsIndex);
  if (match) {
    if (_GDPRUserList["default"].includes(match[1].substring(1))) {
      return {
        page: 'NotFound'
      };
    }
    return {
      page: 'PostsIndex',
      params: ['home', match[1]]
    };
  }
  match = path.match(routeRegex.UserProfile1) ||
  // @user/"posts" is deprecated in favor of "comments" as of oct-2016 (#443)
  path.match(routeRegex.UserProfile2);
  if (match) {
    if (_GDPRUserList["default"].includes(match[1].substring(1))) {
      return {
        page: 'NotFound'
      };
    }
    return {
      page: 'UserProfile',
      params: match.slice(1)
    };
  }
  match = path.match(routeRegex.PostNoCategory);
  if (match) {
    if (_GDPRUserList["default"].includes(match[1].substring(1))) {
      return {
        page: 'NotFound'
      };
    }
    return {
      page: 'PostNoCategory',
      params: match.slice(1)
    };
  }
  match = path.match(routeRegex.Post);
  if (match) {
    if (_GDPRUserList["default"].includes(match[2].substring(1))) {
      return {
        page: 'NotFound'
      };
    }
    return {
      page: 'Post',
      params: match.slice(1)
    };
  }
  match = path.match(/^\/(hot|trending|promoted|payout|payout_comments|created)\/?$/) || path.match(/^\/(hot|trending|promoted|payout|payout_comments|created)\/([\w\d-]+)\/?$/);
  if (match) {
    return {
      page: 'PostsIndex',
      params: match.slice(1)
    };
  }
  return {
    page: 'NotFound'
  };
}