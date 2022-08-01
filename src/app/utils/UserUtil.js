/**
 *
 * @returns {boolean}
 */
export const isLoggedIn = () =>
    typeof localStorage !== 'undefined' && !!localStorage.getItem('autopost2');

/**
 *
 * @returns {string}
 */
export const packLoginData = (
    username,
    password,
    memoWif,
    login_owner_pubkey,
    login_with_keychain
) =>
    Buffer.from(
        `${username}\t${password}\t${memoWif || ''}\t${
            login_owner_pubkey || ''
        }\t${login_with_keychain || ''}`
    ).toString('hex');

/**
 *
 * @returns {array} [username, password, memoWif, login_owner_pubkey, login_with_keychain]
 */
export const extractLoginData = (data) =>
    Buffer.from(data, 'hex').toString().split('\t');

export default {
    isLoggedIn,
    extractLoginData,
};
