import { api } from '@blurtfoundation/blurtjs';
import axios from 'axios';
import { Client } from '@busyorg/busyjs';

import stateCleaner from 'app/redux/stateCleaner';

// Static pages don't need on-chain state. Calling get_state for these against
// the Blurt RPC returns "unhandled path", which blurtjs retries 10× with
// exponential backoff (~6 min) — hanging SSR. Short-circuit with an empty
// state so the route renders immediately.
const STATIC_PAGE_PATHS = new Set([
    'about.html',
    'welcome',
    'chat',
    'faq.html',
    'login.html',
    'privacy.html',
    'support.html',
    'tos.html',
    'tags',
    'change_password',
    'recover_account_step_1',
    '~witnesses',
    'submit.html',
    'xss/test',
    'benchmark',
]);

const emptyChainState = () => ({
    accounts: {},
    content: {},
    props: {},
    discussion_idx: {},
    feed_price: {},
    tag_idx: { trending: [] },
    tags: {},
    witnesses: {},
});

export async function getStateAsync(url) {
    // strip off query string
    url = url.split('?')[0];

    // strip off leading and trailing slashes
    if (url.length > 0 && url[0] == '/') url = url.substring(1, url.length);
    if (url.length > 0 && url[url.length - 1] == '/') {
        url = url.substring(0, url.length - 1);
    }

    if (STATIC_PAGE_PATHS.has(url)) {
        return stateCleaner(emptyChainState());
    }

    // blank URL defaults to `trending`
    if (url === '') url = 'hot';

    // curation and author rewards pages are alias of `transfers`
    if (url.indexOf('/curation-rewards') !== -1) {
        url = url.replace('/curation-rewards', '/transfers');
    }
    if (url.indexOf('/author-rewards') !== -1) {
        url = url.replace('/author-rewards', '/transfers');
    }

    const raw = await api.getStateAsync(url);
    const chainProperties = await getChainProperties();
    if (chainProperties) {
        raw.props.operation_flat_fee = parseFloat(
            chainProperties.operation_flat_fee
        );
        raw.props.bandwidth_kbytes_fee = parseFloat(
            chainProperties.bandwidth_kbytes_fee
        );
    }
    const rewardFund = await getRewardFund();
    if (rewardFund) {
        raw.reward_fund = rewardFund;
    }

    const cleansed = stateCleaner(raw);
    return cleansed;
}

function getChainProperties() {
    return new Promise((resolve) => {
        api.getChainProperties((err, result) => {
            if (result) {
                resolve(result);
            } else {
                resolve({});
            }
        });
    });
}
function getRewardFund() {
    return new Promise((resolve) => {
        api.getRewardFund('post', (err, result) => {
            if (result) {
                resolve(result);
            } else {
                resolve({});
            }
        });
    });
}
export async function callNotificationsApi(account) {
    console.log('call notifications api', account);
    return new Promise((resolve, reject) => {
        const client = new Client('wss://notifications.blurt.world');
        client.call('get_notifications', [account], (err, result) => {
            if (err !== null) reject(err);
            resolve(result);
        });
    });
}
