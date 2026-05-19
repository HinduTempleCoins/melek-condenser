import * as blurtjs from '@blurtfoundation/blurtjs';

// MELEK is the address prefix — keys on the MELEK chain begin with MELEK.
// This must match the address_prefix in melek-chain. Using blurtjs as a shim
// until @hindutemplecoins/melekjs is published.
blurtjs.config.set('address_prefix', 'MELEK');

// chain_id is all zeros until melek-chain genesis is finalized.
let chain_id = '';
for (let i = 0; i < 32; i++) chain_id += '00';

module.exports = {
    address_prefix: 'MELEK',
    expire_in_secs: 15,
    chain_id,
};
