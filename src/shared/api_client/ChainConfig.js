import * as blurtjs from '@blurtfoundation/blurtjs';

blurtjs.config.set('address_prefix', 'MELEK');

const chain_id =
    '907959e559e253f0db275e467363425cc2cf4f20f7721699914d248a5547ad8b';

module.exports = {
    address_prefix: 'MELEK',
    expire_in_secs: 15,
    chain_id,
};
