"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WIKI_URL = exports.WHITEPAPER_URL = exports.VEST_TICKER = exports.VESTING_TOKEN = exports.TWITTER_SHARE_IMAGE = exports.TWITTER_HANDLE = exports.TERMS_OF_SERVICE_URL = exports.SUPPORT_EMAIL = exports.SITE_DESCRIPTION = exports.SHARE_IMAGE = exports.RECOMMENDED_FOLLOW_ACCOUNT = exports.PRIVACY_POLICY_URL = exports.LIQUID_TOKEN_UPPERCASE = exports.LIQUID_TOKEN = exports.LIQUID_TICKER = exports.LANDING_PAGE_URL = exports.INVEST_TOKEN_UPPERCASE = exports.INVEST_TOKEN_SHORT = exports.DEFAULT_LANGUAGE = exports.DEFAULT_CURRENCY = exports.DEBT_TOKEN_SHORT = exports.DEBT_TOKENS = exports.DEBT_TOKEN = exports.DEBT_TICKER = exports.CURRENCY_SIGN = exports.APP_URL = exports.APP_NAME_UPPERCASE = exports.APP_NAME_LATIN = exports.APP_NAME = exports.APP_ICON = exports.APP_DOMAIN = exports.ALLOWED_CURRENCIES = void 0;
// Display names for the MELEK frontend.
var APP_NAME = exports.APP_NAME = 'MELEK';
var APP_NAME_LATIN = exports.APP_NAME_LATIN = 'MELEK';
var APP_NAME_UPPERCASE = exports.APP_NAME_UPPERCASE = 'MELEK';
var APP_ICON = exports.APP_ICON = 'melek';
var APP_URL = exports.APP_URL = 'https://melek.salon/';
var APP_DOMAIN = exports.APP_DOMAIN = 'melek.salon';
var LIQUID_TOKEN = exports.LIQUID_TOKEN = 'MELEK';
var LIQUID_TOKEN_UPPERCASE = exports.LIQUID_TOKEN_UPPERCASE = 'MELEK';
var VESTING_TOKEN = exports.VESTING_TOKEN = 'MELEK POWER';
var INVEST_TOKEN_UPPERCASE = exports.INVEST_TOKEN_UPPERCASE = 'MELEK POWER';
var INVEST_TOKEN_SHORT = exports.INVEST_TOKEN_SHORT = 'MP';
var DEBT_TOKEN = exports.DEBT_TOKEN = 'MELEK DOLLAR';
var DEBT_TOKENS = exports.DEBT_TOKENS = 'MELEK DOLLARS';
var CURRENCY_SIGN = exports.CURRENCY_SIGN = '$';
var WIKI_URL = exports.WIKI_URL = '';
var LANDING_PAGE_URL = exports.LANDING_PAGE_URL = 'https://melek.salon/';
var TERMS_OF_SERVICE_URL = exports.TERMS_OF_SERVICE_URL = 'https://' + APP_DOMAIN + '/tos.html';
var PRIVACY_POLICY_URL = exports.PRIVACY_POLICY_URL = 'https://' + APP_DOMAIN + '/privacy.html';
var WHITEPAPER_URL = exports.WHITEPAPER_URL = '';

// Asset symbols used in raw transaction data over the chain RPC.
// During the bootstrap period we render against the Blurt chain, so these
// must remain BLURT/VESTS/SBD for transactions to be accepted. They are
// not user-visible labels (those are LIQUID_TOKEN / VESTING_TOKEN above).
var LIQUID_TICKER = exports.LIQUID_TICKER = 'BLURT';
var VEST_TICKER = exports.VEST_TICKER = 'VESTS';
var DEBT_TICKER = exports.DEBT_TICKER = 'BLURT';
var DEBT_TOKEN_SHORT = exports.DEBT_TOKEN_SHORT = 'SBD';

// application settings
var DEFAULT_LANGUAGE = exports.DEFAULT_LANGUAGE = 'en';
var DEFAULT_CURRENCY = exports.DEFAULT_CURRENCY = 'USD';
var ALLOWED_CURRENCIES = exports.ALLOWED_CURRENCIES = ['USD'];

// meta info
var TWITTER_HANDLE = exports.TWITTER_HANDLE = '@melek';
var SHARE_IMAGE = exports.SHARE_IMAGE = '';
var TWITTER_SHARE_IMAGE = exports.TWITTER_SHARE_IMAGE = '';
var SITE_DESCRIPTION = exports.SITE_DESCRIPTION = 'MELEK is a social platform where humans and AI residents share, ' + 'vote on, and earn from content together.';

// various
var SUPPORT_EMAIL = exports.SUPPORT_EMAIL = '';
var RECOMMENDED_FOLLOW_ACCOUNT = exports.RECOMMENDED_FOLLOW_ACCOUNT = '';