// common.js - shared MELEK chain config + helpers for the portal pages.
//
// ORIGIN-AWARE. This one set of files is served from BOTH the mainnet site (melek.salon) and the
// testnet site (alpha.melek.salon), so the chain parameters MUST be chosen by hostname. They used
// to be hardcoded to the testnet, which was a live, user-visible bug: on melek.salon the wallet
// read MAINNET balances correctly (the RPC is same-origin) but SIGNED every operation with the
// TESTNET chain id, so every signature was invalid - and it offered TESTS/TBD, which are not
// assets on mainnet at all. A user could see their 100 MELEK and could do nothing with it.
//
// Anything added here that signs MUST take its chain id, prefix and symbols from window.MELEK_CHAIN
// rather than restating them, or this bug comes straight back.
window.MELEK_CHAINS = {
  mainnet: {
    net: 'mainnet',
    chainId: '907959e559e253f0db275e467363425cc2cf4f20f7721699914d248a5547ad8b',
    addressPrefix: 'MELEK',
    symbols: { liquid: 'MELEK', debt: 'MBD', vest: 'VESTS' },
  },
  testnet: {
    net: 'testnet',
    chainId: '18dcf0a285365fc58b71f18b3d3fec954aa0c141c44e4e5cb4cf777b9eab274e',
    addressPrefix: 'TST',
    symbols: { liquid: 'TESTS', debt: 'TBD', vest: 'VESTS' },
  },
};

// Testnet is the exception and must be named explicitly; anything else is mainnet. Defaulting the
// other way is what caused the bug - an unrecognised host silently became testnet.
window.MELEK_IS_TESTNET = (function () {
  var h = (typeof location !== 'undefined' && location.hostname) || '';
  return /^alpha\./.test(h) || h === 'localhost' || h === '127.0.0.1';
})();

window.MELEK_CHAIN = Object.assign(
  {},
  window.MELEK_IS_TESTNET ? window.MELEK_CHAINS.testnet : window.MELEK_CHAINS.mainnet,
  {
    rpc: (location.origin || 'https://melek.salon') + '/rpc',
    faucet: (location.origin || 'https://melek.salon') + '/faucet',
  }
);

// Back-compat alias: the portal pages were written against window.MELEK_TESTNET. Keep the name
// working, but it now carries whichever chain this origin actually serves.
window.MELEK_TESTNET = window.MELEK_CHAIN;

window.rpcCall = async function rpcCall(method, params) {
  const res = await fetch(window.MELEK_CHAIN.rpc, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', method: 'condenser_api.' + method, params: params || [], id: 1 }),
  });
  const j = await res.json();
  if (j.error) throw new Error(j.error.message || JSON.stringify(j.error));
  return j.result;
};

window.makeClient = function makeClient() {
  if (!window.dsteem || !window.dsteem.Client) throw new Error('dsteem not loaded');
  return new window.dsteem.Client(window.MELEK_CHAIN.rpc, {
    chainId: window.MELEK_CHAIN.chainId,
    addressPrefix: window.MELEK_CHAIN.addressPrefix,
    timeout: 15000,
  });
};

window.el = function el(id) { return document.getElementById(id); };
window.setMsg = function setMsg(id, text, kind) {
  const n = window.el(id);
  if (!n) return;
  n.textContent = text || '';
  n.className = 'msg' + (kind ? ' ' + kind : '');
};


// The portal is served from both sites, so these banners must say which one the visitor is on.
// "TESTNET ONLY ... Not real value." was hardcoded in the markup and shown to holders of real MELEK.
(function paintNet() {
  function paint() {
    var s = window.MELEK_CHAIN.symbols;
    var b = document.getElementById('netBanner');
    if (b) {
      b.textContent = window.MELEK_IS_TESTNET
        ? 'TESTNET \u2014 tokens are ' + s.liquid + ' / ' + s.debt + ' on the MELEK test network. Not real value.'
        : 'MELEK MAINNET \u2014 tokens are ' + s.liquid + ' / ' + s.debt + '. These are real balances. Your key is used only in this browser and is never sent anywhere.';
    }
    var upper = window.MELEK_IS_TESTNET ? 'TESTNET ONLY' : 'MELEK MAINNET';
    var lower = window.MELEK_IS_TESTNET ? 'MELEK test network' : 'MELEK mainnet';
    Array.prototype.forEach.call(document.querySelectorAll('.net-name'), function (n) { n.textContent = upper; });
    Array.prototype.forEach.call(document.querySelectorAll('.net-name-lower'), function (n) { n.textContent = lower; });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', paint);
  else paint();
})();
