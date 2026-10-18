import assert from 'assert';
import constants from 'app/redux/constants';
import { parsePayoutAmount, repLog10 } from 'app/utils/ParsersAndFormatters';
import { Long } from 'bytebuffer';
import { VEST_TICKER, LIQUID_TICKER } from 'app/client_config';
import { fromJS } from 'immutable';
import { formatter } from '@blurtfoundation/blurtjs';

export const numberWithCommas = (x) => x.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export function isFetchingOrRecentlyUpdated(global_status, order, category) {
    const status = global_status
        ? global_status.getIn([category || '', order])
        : null;
    if (!status) return false;
    if (status.fetching) return true;
    if (status.last_fetch) {
        const res =
            new Date() - status.last_fetch <
            constants.FETCH_DATA_EXPIRE_SEC * 1000;
        return res;
    }
    return false;
}

export function allowDelete(comment) {
    if (!(comment instanceof Map)) comment = fromJS(comment);
    const rshares = String(comment.get('net_rshares'));
    const hasPayout = !(rshares[0] == '0' || rshares[0] == '-');
    const hasChildren = comment.get('children') !== 0;
    return !(hasPayout || hasChildren);
}

export function hasNsfwTag(content) {
    // Combine tags+category to check nsfw status
    const json = content.get('json_metadata');
    let tags = [];
    try {
        tags = (json && JSON.parse(json).tags) || [];
        if (typeof tags === 'string') {
            tags = [tags];
        }
        if (!Array.isArray(tags)) {
            tags = [];
        }
    } catch (e) {
        tags = [];
    }
    tags.push(content.get('category'));
    tags = filterTags(tags);
    const isNsfw = tags.filter((tag) => tag && tag.match(/^nsfw$/i)).length > 0;
    return isNsfw;
}

export function contentStats(content) {
    if (!content) return {};
    if (!(content instanceof Map)) content = fromJS(content);

    let net_rshares_adj = Long.ZERO;
    let total_votes = 0;

    // TODO: breaks if content has no active_votes attribute.
    content.get('active_votes').forEach((v) => {
        const sign = Math.sign(v.get('percent'));
        if (sign === 0) return;
        total_votes += 1;

        // For graying: ignore tiny downvotes (9 digits or less)
        const rshares = String(v.get('rshares'));
        if (!(rshares.substring(0, 1) === '-' && rshares.length < 11)) {
            net_rshares_adj = net_rshares_adj.add(rshares);
        }
    });

    // post must have non-trivial negative rshares to be grayed out. (more than 10 digits)
    const grayThreshold = -9999999999;
    const meetsGrayThreshold = net_rshares_adj.compare(grayThreshold) < 0;

    const hasPendingPayout =
        parsePayoutAmount(content.get('pending_payout_value')) >= 0.02;
    const authorRepLog10 = repLog10(content.get('author_reputation'));

    const gray =
        !hasPendingPayout && (authorRepLog10 < 1 || meetsGrayThreshold);
    const hide = !hasPendingPayout && authorRepLog10 < 0; // rephide

    return {
        hide,
        gray,
        total_votes,
    };
}

export function filterTags(tags) {
    return tags
        .filter((tag) => typeof tag === 'string')
        .filter((value, index, self) => value && self.indexOf(value) === index);
}

// export function pricePerSteem(state) {
//     const feed_price = state.user.get(
//         'latest_feed_price',
//         state.global.get('feed_price')
//     );
//     if (feed_price && feed_price.has('base') && feed_price.has('quote')) {
//         return formatter.pricePerSteem(feed_price.toJS());
//     }
//     return undefined;
// }

export function vestsToHpf(state, vesting_shares) {
    const { global } = state;
    let vests = vesting_shares;
    if (typeof vesting_shares === 'string') {
        vests = assetFloat(vesting_shares, VEST_TICKER);
    }
    const total_vests = assetFloat(
        global.getIn(['props', 'total_vesting_shares']),
        VEST_TICKER
    );
    const total_vest_blurt = assetFloat(
        global.getIn(['props', 'total_vesting_fund_steem']),
        LIQUID_TICKER
    );
    return total_vest_blurt * (vests / total_vests);
}

export function vestsToHp(state, vesting_shares) {
    return vestsToHpf(state, vesting_shares).toFixed(3);
}

export function spToVestsf(state, blurt_power) {
    const { global } = state;
    let power = blurt_power;
    if (typeof power === 'string') {
        power = assetFloat(power, LIQUID_TICKER);
    }
    const total_vests = assetFloat(
        global.getIn(['props', 'total_vesting_shares']),
        VEST_TICKER
    );
    const total_vest_blurt = assetFloat(
        global.getIn(['props', 'total_vesting_fund_steem']),
        LIQUID_TICKER
    );
    return (blurt_power / total_vest_blurt) * total_vests;
}

export function spToVests(state, vesting_shares) {
    return spToVestsf(state, vesting_shares).toFixed(6);
}

export function vestingBlurt(account, gprops) {
    const vests = parseFloat(account.vesting_shares.split(' ')[0]);
    const total_vests = parseFloat(gprops.total_vesting_shares.split(' ')[0]);
    const total_vest_blurt = parseFloat(
        gprops.total_vesting_fund_steem.split(' ')[0]
    );
    const vesting_blurtf = total_vest_blurt * (vests / total_vests);
    return vesting_blurtf;
}

// How much BLURT this account has delegated out (minus received).
export function delegatedBlurt(account, gprops) {
    const delegated_vests = parseFloat(
        account.delegated_vesting_shares.split(' ')[0]
    );
    const received_vests = parseFloat(
        account.received_vesting_shares.split(' ')[0]
    );
    const vests = delegated_vests - received_vests;
    const total_vests = parseFloat(gprops.total_vesting_shares.split(' ')[0]);
    const total_vest_blurt = parseFloat(
        gprops.total_vesting_fund_steem.split(' ')[0]
    );
    const vesting_blurtf = total_vest_blurt * (vests / total_vests);
    return vesting_blurtf;
}

// How much BLURT this account is powering down.
export function powerdownBlurt(account, gprops) {
    const withdraw_rate_vests = parseFloat(
        account.vesting_withdraw_rate.split(' ')[0]
    );
    const remaining_vests =
        (parseFloat(account.to_withdraw) - parseFloat(account.withdrawn)) /
        1000000;
    const vests = Math.min(withdraw_rate_vests, remaining_vests);
    const total_vests = parseFloat(gprops.total_vesting_shares.split(' ')[0]);
    const total_vest_blurt = parseFloat(
        gprops.total_vesting_fund_steem.split(' ')[0]
    );
    const powerdown_blurtf = total_vest_blurt * (vests / total_vests);
    return powerdown_blurtf;
}

export function remainingPowerdowns(account) {
    const to_withdraw = parseFloat(account.to_withdraw);
    const withdrawn = parseFloat(account.withdrawn);
    const remaining = 4 - Math.floor((withdrawn / to_withdraw) * 4);
    return remaining;
}

export function assetFloat(str, asset) {
    try {
        assert.equal(typeof str, 'string');
        assert.equal(typeof asset, 'string');
        assert(
            new RegExp(`^\\d+(\\.\\d+)? ${asset}$`).test(str),
            'Asset should be formatted like 99.99 ' + asset + ': ' + str
        );
        return parseFloat(str.split(' ')[0]);
    } catch (e) {
        console.log(e);
        return undefined;
    }
}
export function pricePerBlurt(state) {
    const price = state.global.get('blurt_price');
    return price;
}
