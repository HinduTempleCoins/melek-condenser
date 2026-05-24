import { api } from '@blurtfoundation/blurtjs';
import ChainTypes from '@blurtfoundation/blurtjs/lib/auth/serializer/src/ChainTypes';
import Moment from 'moment';
import axios from 'axios';
import stateCleaner from 'app/redux/stateCleaner';

const ASSET_SYMBOLS = {
    '@@000000021': 'BLURT',
    '@@000000037': 'VESTS',
};

const ACCOUNT_HISTORY_OPERATIONS = ChainTypes.operations || {};
const DISABLED_WITNESS_SIGNING_KEY =
    'BLT1111111111111111111111111111111114T1Anm';

const WALLET_FINANCIAL_OPERATION_TYPES = [
    'transfer',
    'transfer_to_savings',
    'transfer_from_savings',
    'cancel_transfer_from_savings',
    'fill_transfer_from_savings',
    'transfer_to_vesting',
    'withdraw_vesting',
    'fill_vesting_withdraw',
    'delegate_vesting_shares',
    'return_vesting_delegation',
    'claim_reward_balance',
    'interest',
];

const HISTORY_MODE_OPERATION_TYPES = {
    wallet: WALLET_FINANCIAL_OPERATION_TYPES,
    author: ['author_reward'],
    curation: ['curation_reward'],
    witness: ['producer_reward'],
};

const HISTORY_MODE_OPERATION_SETS = Object.keys(
    HISTORY_MODE_OPERATION_TYPES
).reduce((result, key) => {
    result[key] = new Set(HISTORY_MODE_OPERATION_TYPES[key]);
    return result;
}, {});

function makeAccountHistoryOperationFilter(operationTypes) {
    let operationFilterLow = 0;
    let operationFilterHigh = 0;

    operationTypes.forEach((operationType) => {
        const operationIndex = ACCOUNT_HISTORY_OPERATIONS[operationType];

        if (
            operationIndex === undefined ||
            operationIndex === null ||
            !Number.isFinite(operationIndex)
        ) {
            return;
        }

        if (operationIndex < 64) {
            operationFilterLow += Math.pow(2, operationIndex);
        } else {
            operationFilterHigh += Math.pow(2, operationIndex - 64);
        }
    });

    return [
        operationFilterLow === 0
            ? null
            : operationFilterLow.toString(),
        operationFilterHigh === 0
            ? null
            : operationFilterHigh.toString(),
    ];
}

const HISTORY_MODE_OPERATION_FILTERS = Object.keys(
    HISTORY_MODE_OPERATION_TYPES
).reduce((result, key) => {
    result[key] = makeAccountHistoryOperationFilter(
        HISTORY_MODE_OPERATION_TYPES[key]
    );
    return result;
}, {});

function getHistoryModeOperationSet(historyMode) {
    return HISTORY_MODE_OPERATION_SETS[historyMode] ||
        HISTORY_MODE_OPERATION_SETS.wallet;
}

function getHistoryModeOperationFilter(historyMode) {
    return HISTORY_MODE_OPERATION_FILTERS[historyMode] ||
        HISTORY_MODE_OPERATION_FILTERS.wallet;
}

function formatAccountHistoryAsset(value) {
    if (
        !value ||
        typeof value !== 'object' ||
        value.amount === undefined ||
        value.precision === undefined ||
        value.nai === undefined
    ) {
        return value;
    }

    const precision = Number(value.precision);
    const amount = Number(value.amount) / Math.pow(10, precision);
    const symbol = ASSET_SYMBOLS[value.nai] || value.nai;
    return amount.toFixed(precision) + ' ' + symbol;
}

function normalizeAccountHistoryValue(value) {
    const asset = formatAccountHistoryAsset(value);
    if (asset !== value) return asset;

    if (Array.isArray(value)) return value.map(normalizeAccountHistoryValue);
    if (value && typeof value === 'object') {
        return Object.keys(value).reduce((result, key) => {
            result[key] = normalizeAccountHistoryValue(value[key]);
            return result;
        }, {});
    }

    return value;
}

function normalizeAccountHistoryEntry(entry) {
    const history = entry[1];
    const historyOp = history && history.op;

    if (!historyOp || Array.isArray(historyOp)) return entry;

    const type = historyOp.type
        ? historyOp.type.replace(/_operation$/, '')
        : undefined;

    if (!type) return entry;

    return [
        entry[0],
        {
            ...history,
            op: [type, normalizeAccountHistoryValue(historyOp.value || {})],
        },
    ];
}

function getSafeAccountHistoryLimit(start, limit) {
    const numericLimit = Number(limit);

    if (!Number.isFinite(numericLimit) || numericLimit < 0) return 0;
    if (start === -1) return numericLimit;

    const numericStart = Number(start);

    if (!Number.isFinite(numericStart) || numericStart < 0) {
        return numericLimit;
    }

    return Math.min(numericLimit, numericStart);
}

function getConfiguredAccountHistoryEndpoints() {
    const primaryEndpoint =
        (api.options && (api.options.url || api.options.uri)) ||
        (typeof $STM_Config !== 'undefined' &&
            $STM_Config.blurtd_connection_client);
    const alternativeEndpoints =
        (api.options && api.options.alternative_api_endpoints) ||
        (typeof $STM_Config !== 'undefined' &&
            $STM_Config.alternative_api_endpoints) ||
        [];

    return [primaryEndpoint]
        .concat(alternativeEndpoints)
        .filter(Boolean)
        .filter((endpoint, index, list) => list.indexOf(endpoint) === index);
}

function shouldFailoverAccountHistoryEndpoint(error) {
    if (!error) return false;
    if (isRateLimitError(error)) return true;

    const status = error.response && error.response.status;
    if (status >= 500) return true;

    return (
        error.code === 'ECONNABORTED' ||
        error.code === 'ECONNRESET' ||
        error.code === 'ENOTFOUND' ||
        error.code === 'ETIMEDOUT' ||
        !error.response
    );
}

async function callCondenser(method, params, pre = 'condenser_api.') {
    // [JES] Hivemind throws an exception if you call for my/[trending/payouts/new/etc] with a null observer
    // so just delete the 'my' tag if there is no observer specified
    return new Promise(function(resolve, reject) {
        api.call(pre + method, params, function(err, data) {
            if (err) {
                console.error('~~ api.callCondenser error ~~~>', method, params, err);
                reject(err);
            } else resolve(data);
        });
    });
}

async function callAccountHistory(account, start, limit, operationFilter) {
    const safeLimit = getSafeAccountHistoryLimit(start, limit);
    const params = {
        account,
        start,
        limit: safeLimit,
    };

    if (operationFilter && operationFilter[0]) {
        params.operation_filter_low = operationFilter[0];
    }
    if (operationFilter && operationFilter[1]) {
        params.operation_filter_high = operationFilter[1];
    }
    const endpoints = getConfiguredAccountHistoryEndpoints();
    let lastError = null;

    for (let index = 0; index < endpoints.length; index++) {
        const endpoint = endpoints[index];

        try {
            const response = await axios.post(endpoint, {
                id: 1,
                jsonrpc: '2.0',
                method: 'account_history_api.get_account_history',
                params,
            });
            const responseData = response.data || {};
            const continuationStart = getAccountHistoryContinuationStart(
                responseData.error
            );

            if (continuationStart !== null) {
                return { history: [], nextStart: continuationStart };
            }

            if (responseData.error) {
                const error = new Error(responseData.error.message);
                error.rpcError = responseData.error;
                throw error;
            }

            const result = responseData.result;

            return {
                history: ((result && result.history) || []).map(
                    normalizeAccountHistoryEntry
                ),
                nextStart: null,
            };
        } catch (error) {
            lastError = error;
            if (
                !shouldFailoverAccountHistoryEndpoint(error) ||
                index === endpoints.length - 1
            ) {
                throw error;
            }
        }
    }

    throw lastError;
}

function getAccountHistoryContinuationStart(error) {
    if (!error) return null;

    const stack = error.data && error.data.stack;
    const sequence =
        stack &&
        stack[0] &&
        stack[0].data &&
        Number(stack[0].data.sequence);

    if (Number.isFinite(sequence)) return sequence;

    const match =
        error.message && error.message.match(/set start=([0-9]+)/);

    return match ? Number(match[1]) : null;
}

function isRateLimitError(error) {
    return error && error.response && error.response.status === 429;
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
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

async function getWitnessByAccount(accountName) {
    try {
        return await api.callAsync('condenser_api.get_witness_by_account', [
            accountName,
        ]);
    } catch (error) {
        console.error(error);
        return null;
    }
}

function isActiveWitnessAccount(witness) {
    return !!(
        witness &&
        witness.owner &&
        witness.signing_key &&
        witness.signing_key !== DISABLED_WITNESS_SIGNING_KEY
    );
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
    const witness = await getWitnessByAccount(user_to_check);

    result.accounts[user_to_check] = {
        ...account_details[0],
        witness_account: witness,
        is_active_witness: isActiveWitnessAccount(witness),
    };

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
        const now = Moment.utc();
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

async function getTransferHistory(account, { fetchDays = 30, historyMode = 'wallet' } = {}) {
    let transfer_history = [];
    const limit = 1000;
    const maxRpcCalls = historyMode === 'wallet' ? 96 : 48;
    const now = Moment.utc();
    const operationSet = getHistoryModeOperationSet(historyMode);
    const operationFilter = getHistoryModeOperationFilter(historyMode);
    const isInsideFetchWindow = (timestamp) =>
        now.diff(Moment.utc(timestamp), 'days', true) < fetchDays;
    const shouldIncludeEntry = (entry) => {
        const opType = entry[1] && entry[1].op && entry[1].op[0];

        if (!opType) return false;

        return operationSet.has(opType);
    };
    const callAccountHistoryWithRetry = async (
        historyStart,
        historyLimit,
        currentFilter = operationFilter
    ) => {
        for (let retry = 0; retry < 3; retry++) {
            try {
                return await callAccountHistory(
                    account,
                    historyStart,
                    historyLimit,
                    currentFilter
                );
            } catch (err) {
                if (!isRateLimitError(err) || retry === 2) throw err;
                await wait(750 * (retry + 1));
            }
        }
    };

    try {
        const seen = {};
        let historyStart = -1;
        let shouldContinue = true;

        for (
            let requestCount = 0;
            requestCount < maxRpcCalls && shouldContinue;
            requestCount++
        ) {
            const rawPage = await callAccountHistoryWithRetry(
                historyStart,
                limit,
                null
            );

            if (rawPage.nextStart !== null) {
                historyStart = rawPage.nextStart;
                continue;
            }

            if (!rawPage.history.length) break;

            const oldestRawEntry = rawPage.history[0];
            const oldestRawTimestamp =
                oldestRawEntry && oldestRawEntry[1] && oldestRawEntry[1].timestamp;
            const page =
                historyMode === 'wallet'
                    ? rawPage
                    : await callAccountHistoryWithRetry(
                          historyStart,
                          limit,
                          operationFilter
                      );

            if (page.nextStart !== null) {
                historyStart = page.nextStart;
                continue;
            }

            page.history.forEach((entry) => {
                const sequence = entry[0];
                const timestamp = entry[1] && entry[1].timestamp;

                if (!timestamp) return;
                if (!isInsideFetchWindow(timestamp)) {
                    shouldContinue = false;
                    return;
                }
                if (!shouldIncludeEntry(entry)) return;
                if (seen[sequence]) return;

                seen[sequence] = true;
                transfer_history.push(entry);
            });

            historyStart = Math.max(oldestRawEntry[0] - 1, 0);

            if (
                !oldestRawTimestamp ||
                !isInsideFetchWindow(oldestRawTimestamp) ||
                historyStart === 0
            ) {
                shouldContinue = false;
            }
        }
    } catch (err) {
        console.log(err);
        console.log(
            'Unable to fetch account history for account: ',
            account,
            err
        );
        transfer_history = transfer_history || [];
    }

    if (transfer_history === null || transfer_history === undefined)
        transfer_history = [];
    return transfer_history.sort((a, b) => a[0] - b[0]);
}

function getHistoryFetchDays(url) {
    if (
        url.includes('/author-rewards') ||
        url.includes('/curation-rewards') ||
        url.includes('/witness-rewards')
    ) {
        return 7;
    }

    return 30;
}

function getHistoryMode(url) {
    if (url.includes('/author-rewards')) return 'author';
    if (url.includes('/curation-rewards')) return 'curation';
    if (url.includes('/witness-rewards')) return 'witness';
    return 'wallet';
}

function verifyLocalStorageData(propertyDate, propertyValue, maxSecondsSinceUpdate = 300) {
    if (!process.env.BROWSER) {
        return { result: false}
    }
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
    if (!process.env.BROWSER) {
        return
    }
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
    const historyFetchDays = getHistoryFetchDays(url);
    const historyMode = getHistoryMode(url);
    let path = url.split('?')[0];
    let fetch_transfers = false;
    if (
        path.includes('transfers') ||
        path.includes('author-rewards') ||
        path.includes('curation-rewards') ||
        path.includes('witness-rewards')
    ) {
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

        account_history = await getTransferHistory(account_name, {
            fetchDays: historyFetchDays,
            historyMode,
        });
        let account = await api.getAccountsAsync([account_name]);
        account = account[0];
        const existingAccount = raw.accounts[account_name];
        const witness =
            (existingAccount && existingAccount.witness_account) ||
            (await getWitnessByAccount(account_name));
        account.transfer_history = account_history;
        account.witness_account = witness;
        account.is_active_witness = isActiveWitnessAccount(witness);
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
