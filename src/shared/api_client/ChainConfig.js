import * as blurtjs from '@blurtfoundation/blurtjs';

blurtjs.config.set('address_prefix', 'MELEK');

const chain_id =
    '4cfa8136137dda78031d0508b844770906a61854c48e4032a4338ce26db538ff';

module.exports = {
    address_prefix: 'MELEK',
    expire_in_secs: 15,
    chain_id,
};
