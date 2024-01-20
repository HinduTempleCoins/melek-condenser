import { api } from '@blurtfoundation/blurtjs';
import ChainTypes from '@blurtfoundation/blurtjs/lib/auth/serializer/src/ChainTypes';
import Moment from 'moment';
import axios from 'axios';
import stateCleaner from 'app/redux/stateCleaner';
import JSBI from 'jsbi';

let makeBitMaskFilter = (allowedOperations) => {
  return allowedOperations.reduce(([low, high], allowedOperation) => allowedOperation < 64 ? [JSBI.bitwiseOr(low, JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(allowedOperation))), high]
                                                                                           : [low, JSBI.bitwiseOr(high, JSBI.leftShift(JSBI.BigInt(1), JSBI.BigInt(allowedOperation-64)))],
                                  [JSBI.BigInt(0), JSBI.BigInt(0)]).map(value => JSBI.notEqual(value, JSBI.BigInt(0)) ? value.toString() : null);
};



const op = ChainTypes.operations;
const wallet_operations_bitmask = makeBitMaskFilter([
    op.transfer,
    op.transfer_to_vesting,
    op.transfer_to_savings,
    op.transfer_from_savings,
    op.cancel_transfer_from_savings,
    op.withdraw_vesting,
    op.comment_benefactor_reward,
    op.author_reward,
    op.curation_reward,
    op.claim_reward_balance,
]);

async function callCondenser(method, params, pre = 'condenser_api.') {
    // [JES] Hivemind throws an exception if you call for my/[trending/payouts/new/etc] with a null observer
    // so just delete the 'my' tag if there is no observer specified
    return new Promise(function(resolve, reject) {
        api.call(pre + method, params, function(err, data) {
            if (err) {
                console.error('~~ apii.callCondenser error ~~~>', method, params, err);
                reject(err);
            } else resolve(data);
        });
    });
}

async function getStateForTrending() {
    const result = {};
    result.content = {};
    result.accounts = {};
    result.props = await api.getDynamicGlobalPropertiesAsync();
    const chainProperties = await getChainProperties();

    if (chainProperties) {
        result.props.operation_flat_fee = chainProperties.operation_flat_fee;
        result.props.bandwidth_kbytes_fee = chainProperties.bandwidth_kbytes_fee;
        result.props.proposal_fee = chainProperties.proposal_fee;
    }
    const response = await externalRequests()
    result.blurt_price = response.price

    return result;
}

async function getStateForWitnessesAndProposals() {
    const schedule = await api.getWitnessScheduleAsync();
    const witnesses = await api.getWitnessesByVoteAsync('', 250);
    const global_properties = await api.getDynamicGlobalPropertiesAsync();
    const chainProperties = await getChainProperties();

    const result = {};
    result.props = global_properties;
    result.tag_idx = {};
    result.tag_idx.trending = [];
    result.tags = {};
    result.content = {};
    result.accounts = {};
    result.witness_list = witnesses;
    result.witnesses = {}
    result.discussion_idx = {};
    result.witness_schedule = schedule;
    result.feed_price = {};
    result.error = '';

    if (chainProperties) {
        result.props.operation_flat_fee = chainProperties.operation_flat_fee;
        result.props.bandwidth_kbytes_fee = chainProperties.bandwidth_kbytes_fee;
        result.props.proposal_fee = chainProperties.proposal_fee;
    }

    const response = await externalRequests()
    result.blurt_price = response.price

    return result;
}

function getChainProperties() {
    return new Promise((resolve, reject) => {
        api.getChainProperties((err, result) => {
            if (result) {
                resolve(result);
            } else {
                resolve({});
            }
        });
    });
}

async function getGenericState(user) {
    const result = {};
    result.accounts = {};
    result.content = {};
    result.props = await api.getDynamicGlobalPropertiesAsync();

    let user_to_check = user;
    //user should be an account
    if (user.startsWith('/')) {
        user_to_check = user.split('/')[1];
    }

    if (user_to_check.startsWith('@'))
        user_to_check = user_to_check.split('@')[1];
    const account_details = await api.getAccountsAsync([user_to_check]);
    result.accounts[user_to_check] = account_details[0];

    return result;
}

export async function getAllTransferHistory(
    account,
    fetchDays = 60,
    opTypes = ['transfer'],
    accountHistory = [],
    start = -1
) {
    if (fetchDays > 60) {
        fetchDays = 60;
    }

    const transactions = await callCondenser(
        'get_account_history', 
        [account, start, start < 0 ? 1000 : Math.min(start, 1000)]
    );

    if (transactions.length > 0) {
        const lastTransaction = transactions[0];
        const lastTransactionTimestamp = lastTransaction[1].timestamp;
        const lastTransactionTime = Moment.utc(lastTransactionTimestamp);
        const now = Moment(Date.now());
        const daysAgo = now.diff(lastTransactionTime, 'days');
        const filteredTransactions = transactions.filter((transaction) => {
            const opType = transaction[1].op[0];
            return opTypes.indexOf(opType) !== -1;
        });

        if (filteredTransactions.length > 0) {
            accountHistory = accountHistory.concat(filteredTransactions);
        }

        if (
            daysAgo <= fetchDays &&
            lastTransaction[0] > 0 &&
            lastTransaction[0] !== start
        ) {
            accountHistory = await getAllTransferHistory(
                account,
                fetchDays,
                opTypes,
                accountHistory,
                lastTransaction[0]
            );
        }
    }

    return accountHistory;
}

async function getTransferHistory(account) {
    let transfer_history = null;
    let start_sequence = -1;

    try {
        transfer_history = await callCondenser(
            'get_account_history', 
            [account, start_sequence, 500, wallet_operations_bitmask[0]]
        );
    } catch (err) {
        console.log(err);
        const error_string = err.toString();
        if (error_string.includes('start=')) {
            const index = error_string.indexOf('=');
            start_sequence = error_string.substr(index + 1);
            if (start_sequence.indexOf('.') > 0)
                start_sequence = start_sequence.substr(
                    0,
                    start_sequence.length - 1
                );
            try {
                transfer_history = await callCondenser(
                    'get_account_history', 
                    [account, start_sequence, 500, wallet_operations_bitmask[0]]
                );
            } catch (err) {
                console.log(err);
                console.log(
                    'Unable to fetch account history for account: ',
                    account,
                    err
                );
                transfer_history = [];
            }
        }
    }

    if (transfer_history === null || transfer_history === undefined)
        transfer_history = [];
    return transfer_history;
}

function verifyLocalStorageData(propertyDate, propertyValue, maxSecondsSinceUpdate = 300) {
    try {
        const consultationDate = localStorage.getItem(propertyDate);
        const value = localStorage.getItem(propertyValue);
        if (consultationDate !== null && value !== null && consultationDate !== undefined && value !== undefined) {
            const dateObtained = new Date(Date.parse(consultationDate));
            const currentTimestamp = new Date().getTime();
            // Check if the time difference in seconds is greater than the specified limit
            if (!isNaN(dateObtained.getTime()) && (currentTimestamp - dateObtained.getTime()) / 1000 < maxSecondsSinceUpdate) {
                return { result: true, [propertyDate]: dateObtained, [propertyValue]: value };
            }
        }
        return { result: false };
    } catch (error) {
        console.error(error.message);
        return { result: false };
    }
}

function saveDataToLocalStorage(dataObject) {
    try {
        if (typeof dataObject === 'object' && dataObject !== null) {
            Object.entries(dataObject).forEach(([key, value]) => {
                localStorage.setItem(key, JSON.stringify(value));
            });
        }
    } catch (error) {
        console.error(error.message);
    }
}

async function externalRequests() {
    const state = {}
    let { result, price, datePrice } = verifyLocalStorageData('datePrice', 'price')
    if (result) {
        state.price = Number(price).toFixed(8);
        console.log(`Local storage: ${price} - ${datePrice}`);
    }
    else {
        await axios
            .get($STM_Config.price_info_url, { timeout: 3000 })
            .then((response) => {
                if (response.status === 200) {
                    state.price = Number(
                        response.data.price_usd
                    ).toFixed(8);
                    const currentDate = new Date();
                    saveDataToLocalStorage({ datePrice: currentDate.toUTCString(), price: response.data.price_usd })
                    console.log('axios - price_info_url');
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }
    return state
}

export async function getStateAsync(url) {
    if (url === 'trending') {
        return stateCleaner(await getStateForTrending());
    }
    if (url === '/~witnesses' || url === '/proposals') {
        return stateCleaner(await getStateForWitnessesAndProposals());
    }
    // strip off query string
    let path = url.split('?')[0];
    let fetch_transfers = false;
    if (path.includes('transfers')) {
        fetch_transfers = true;
        //just convert path to be the username, nexus won't accept the request if transfers is in the path
        const tokens = url.split('/');
        for (const token of tokens) {
            if (token.includes('@')) {
                path = token;
                break;
            }
        }
    }

    const raw = await getGenericState(path);

    if (fetch_transfers) {
        const account_name = path.split('@')[1];
        let account_history = null;

        account_history = await getTransferHistory(account_name);
        let account = await api.getAccountsAsync([account_name]);
        account = account[0];
        account.transfer_history = account_history;
        raw.accounts[account_name] = account;
    }

    const chainProperties = await getChainProperties();

    if (chainProperties) {
        raw.props.operation_flat_fee = chainProperties.operation_flat_fee;
        raw.props.bandwidth_kbytes_fee = chainProperties.bandwidth_kbytes_fee;
        raw.props.proposal_fee = chainProperties.proposal_fee;
    }

    const response = await externalRequests()
    raw.blurt_price = response.price


    const cleansed = stateCleaner(raw);

    return cleansed;
}
