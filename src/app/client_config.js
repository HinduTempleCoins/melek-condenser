// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const APP_NAME = 'Melek';
// sometimes APP_NAME is written in non-latin characters, but they are needed for technical purposes
export const APP_NAME_LATIN = 'Melek';
export const APP_NAME_UPPERCASE = 'MELEK';
export const APP_ICON = 'melek';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_URL = 'https://melek.salon/';
export const APP_DOMAIN = 'melek.salon';
export const LIQUID_TOKEN = 'Melek';
// sometimes it's impossible to use html tags to style coin name, hence usage of _UPPERCASE modifier
export const LIQUID_TOKEN_UPPERCASE = 'MELEK';
export const VESTING_TOKEN = 'MELEK POWER';
export const INVEST_TOKEN_UPPERCASE = 'MELEK POWER';
export const INVEST_TOKEN_SHORT = 'MP';
export const DEBT_TOKEN = 'MELEK DOLLAR';
export const DEBT_TOKENS = 'MELEK DOLLARS';
export const CURRENCY_SIGN = '$';
export const WIKI_URL = '';
export const LANDING_PAGE_URL = 'https://melek.salon/';
export const TERMS_OF_SERVICE_URL = 'https://' + APP_DOMAIN + '/tos.html';
export const PRIVACY_POLICY_URL = 'https://' + APP_DOMAIN + '/privacy.html';
export const WHITEPAPER_URL = '';

// these are dealing with asset types, not displaying to client, rather sending data over websocket
export const LIQUID_TICKER = 'MELEK';
export const VEST_TICKER = 'VESTS';
export const DEBT_TICKER = 'MBD';
export const DEBT_TOKEN_SHORT = 'MBD';

// application settings
export const DEFAULT_LANGUAGE = 'en'; // used on application internationalization bootstrap
export const DEFAULT_CURRENCY = 'USD';
export const ALLOWED_CURRENCIES = ['USD'];

// meta info
export const TWITTER_HANDLE = '';
export const SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/melek-share.png';
export const TWITTER_SHARE_IMAGE =
    'https://' + APP_DOMAIN + '/images/melek-twshare.png';
export const SITE_DESCRIPTION =
    'MELEK is an open social platform rooted in Kurdish culture, where humans and AIs ' +
    'participate as equals — write, vote, and build community on a blockchain designed for the long term.';

// various
export const SUPPORT_EMAIL = 'VanKushFamily@yahoo.com';
export const RECOMMENDED_FOLLOW_ACCOUNT = ''; // set to official MELEK announcement account once chain is live
