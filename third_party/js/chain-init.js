// MELEK chain initialization for the signup port.
//
// Runs after blurtjs (window.blurt) and dsteem load, before script.js.
// Reads window.MELEK_CHAIN_CONFIG (declared inline in index.html) and
// configures the in-page chain libraries for MELEK. If config is
// incomplete, this script disables the signup form and shows a banner.
//
// Fail-closed by design: empty / missing config never silently falls
// back to BLURT defaults. Users cannot generate keys for the wrong
// chain even if dev tools are used to bypass UI gating, because key
// derivation is gated on melekChainReady === true (see the form
// submission path).
//
// Configuration is supplied at deploy time (when MELEK chain is live):
//
//   window.MELEK_CHAIN_CONFIG = {
//       address_prefix: 'MELEK',            // public-key prefix
//       chain_id:       '<64-hex-string>',  // MELEK chain genesis id
//       rpc:            'https://rpc.<...>' // MELEK RPC endpoint
//   };

(function () {
    'use strict';

    var cfg = window.MELEK_CHAIN_CONFIG || {};
    var required = ['address_prefix', 'chain_id', 'rpc'];
    var missing = required.filter(function (k) {
        return !((cfg[k] || '') + '').trim();
    });

    function showDisabledBanner(reasons) {
        var container =
            document.querySelector('.container') ||
            document.body;
        if (!container) return;
        var banner = document.createElement('div');
        banner.className = 'alert alert-warning text-center mt-4';
        banner.style.margin = '20px';
        banner.innerHTML =
            '<strong>MELEK chain not yet configured.</strong><br>' +
            'Account signup is disabled. ' +
            'Missing configuration: <code>' +
            reasons.join('</code>, <code>') +
            '</code>.';
        container.insertBefore(banner, container.firstChild);

        var form = document.getElementById('form_id');
        if (form) form.style.display = 'none';
    }

    function fail(reasons) {
        window.melekChainReady = false;
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                showDisabledBanner(reasons);
            });
        } else {
            showDisabledBanner(reasons);
        }
    }

    if (missing.length > 0) {
        fail(missing);
        return;
    }

    if (!window.blurt || !window.blurt.config || !window.blurt.config.set) {
        fail(['blurtjs library not loaded']);
        return;
    }

    try {
        window.blurt.config.set('address_prefix', cfg.address_prefix);
        window.blurt.config.set('chain_id', cfg.chain_id);
    } catch (e) {
        console.error('chain-init: failed to set blurtjs config', e);
        fail(['blurtjs config rejected: ' + (e && e.message)]);
        return;
    }

    if (window.dsteem && window.dsteem.Client) {
        try {
            window.melekDsteemClient = new window.dsteem.Client(cfg.rpc, {
                addressPrefix: cfg.address_prefix,
                chainId: cfg.chain_id
            });
        } catch (e) {
            console.error('chain-init: dsteem client failed to init', e);
        }
    }

    window.melekChainReady = true;
})();
