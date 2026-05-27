// Display names for the MELEK wallet.
export const APP_NAME = 'MELEK';
export const APP_NAME_LATIN = 'MELEK';
export const APP_NAME_UPPERCASE = 'MELEK';
export const APP_ICON = 'melek';
// FIXME figure out best way to do this on both client and server from env
// vars. client should read $STM_Config, server should read config package.
export const APP_DOMAIN = 'wallet.melek.salon';
export const APP_URL = `https://${APP_DOMAIN}`;
export const LIQUID_TOKEN = 'MELEK';
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
export const WHITEPAPER_URL = 'https://melek.salon/whitepaper';

// Asset symbols used in raw transaction data over the chain RPC.
// These must match the symbols the MELEK chain emits.
// MELEK has no SBD/HBD/debt-token equivalent — DEBT_TICKER is set to MELEK
// to keep any legacy code paths benign (chain never emits debt-token ops).
export const LIQUID_TICKER = 'MELEK';
export const VEST_TICKER = 'VESTS';
export const DEBT_TICKER = 'MELEK';
export const DEBT_TOKEN_SHORT = 'MELEK';

// application settings
export const DEFAULT_LANGUAGE = 'en';
export const DEFAULT_CURRENCY = 'USD';
export const ALLOWED_CURRENCIES = ['USD'];
export const FRACTION_DIGITS = 2;
export const FRACTION_DIGITS_MARKET = 3;

// meta info
export const TWITTER_HANDLE = '@melek';
export const SHARE_IMAGE = '';
export const TWITTER_SHARE_IMAGE = '';
export const SITE_DESCRIPTION =
    'MELEK Wallet — sign up, manage your keys, and transact on the MELEK ' +
    'blockchain. MELEK is a social platform where humans and AI residents ' +
    'share, vote on, and earn from content together.';

// various
export const SUPPORT_EMAIL = '';

export const REFUND_ACCOUNTS = [];
export const BURN_ACCOUNTS = ['null'];
