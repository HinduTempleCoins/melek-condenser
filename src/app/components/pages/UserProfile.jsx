/* eslint react/prop-types: 0 */
import React from 'react';
import { Link, browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { api } from '@blurtfoundation/blurtjs';

import * as globalActions from 'app/redux/GlobalReducer';
import * as transactionActions from 'app/redux/TransactionReducer';
import * as userActions from 'app/redux/UserReducer';
import { actions as fetchDataSagaActions } from 'app/redux/FetchDataSaga';
import Icon from 'app/components/elements/Icon';
import UserKeys from 'app/components/elements/UserKeys';
import PasswordReset from 'app/components/elements/PasswordReset';
import AccountPrivacy from 'app/components/elements/AccountPrivacy';
import CreateCommunity from 'app/components/elements/CreateCommunity';
import UserWallet from 'app/components/modules/UserWallet';
import Delegations from 'app/components/modules/Delegations';
import Settings from 'app/components/modules/Settings';
import CurationRewards from 'app/components/modules/CurationRewards';
import AuthorRewards from 'app/components/modules/AuthorRewards';
import WitnessRewards from 'app/components/modules/WitnessRewards';
import { appendThemeToUrl } from 'app/utils/themePreferences';
import UserList from 'app/components/elements/UserList';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import { isFetchingOrRecentlyUpdated } from 'app/utils/StateFunctions';
import Tooltip from 'app/components/elements/Tooltip';
import DateJoinWrapper from 'app/components/elements/DateJoinWrapper';
import tt from 'counterpart';
import { List } from 'immutable';
import WalletSubMenu from 'app/components/elements/WalletSubMenu';
import Userpic from 'app/components/elements/Userpic';
import Callout from 'app/components/elements/Callout';
import normalizeProfile from 'app/utils/NormalizeProfile';
import userIllegalContent from 'app/utils/userIllegalContent';
import proxifyImageUrl from 'app/utils/ProxifyUrl';
import SanitizedLink from 'app/components/elements/SanitizedLink';
import DropdownMenu from 'app/components/elements/DropdownMenu';

export default class UserProfile extends React.Component {
    constructor() {
        super();
        this.state = {
            resolvedIsActiveWitness: false,
            resolvedWitnessAccount: null,
        };
        this._isMounted = false;
        this._witnessLookupId = 0;
        this.onPrint = () => {
            window.print();
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.resolveWitnessStatus(this.props);
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.accountname !== this.props.accountname ||
            prevProps.account !== this.props.account
        ) {
            this.resolveWitnessStatus(this.props);
        }
    }

    componentWillUnmount() {
        this._isMounted = false;
        this.props.clearTransferDefaults();
        this.props.clearPowerdownDefaults();
    }

    getIsActiveWitness = (witness) =>
        !!(
            witness &&
            witness.owner &&
            witness.signing_key &&
            witness.signing_key !== 'BLT1111111111111111111111111111111114T1Anm'
        );

    resolveWitnessStatus = (props) => {
        const { account, accountname } = props;
        if (!accountname) return;

        const normalizedAccountName = accountname.toLowerCase();
        const accountData = account && account.toJS ? account.toJS() : account;

        if (accountData && accountData.is_active_witness === true) {
            if (
                !this.state.resolvedIsActiveWitness ||
                this.state.resolvedWitnessAccount !== normalizedAccountName
            ) {
                this.setState({
                    resolvedIsActiveWitness: true,
                    resolvedWitnessAccount: normalizedAccountName,
                });
            }
            return;
        }

        if (this.state.resolvedWitnessAccount === normalizedAccountName) {
            return;
        }

        if (this.state.resolvedIsActiveWitness) {
            this.setState({ resolvedIsActiveWitness: false });
        }

        const witnessLookupId = ++this._witnessLookupId;

        api.callAsync('condenser_api.get_witness_by_account', [normalizedAccountName])
            .then((witness) => {
                if (!this._isMounted || witnessLookupId !== this._witnessLookupId) {
                    return;
                }

                this.setState({
                    resolvedIsActiveWitness: this.getIsActiveWitness(witness),
                    resolvedWitnessAccount: normalizedAccountName,
                });
            })
            .catch(() => {
                if (!this._isMounted || witnessLookupId !== this._witnessLookupId) {
                    return;
                }

                this.setState({
                    resolvedIsActiveWitness: false,
                    resolvedWitnessAccount: normalizedAccountName,
                });
            });
    };

    calculateVotingPower = (account) => {
        const {
            BLURT_VOTING_MANA_REGENERATION_SECONDS = 432000,
        } = this.props;

        if (
            !account ||
            !account.voting_manabar ||
            !BLURT_VOTING_MANA_REGENERATION_SECONDS
        ) {
            return 0;
        }

        const current_mana = parseInt(
            account.voting_manabar.current_mana || 0,
            10
        );
        const last_update_time = account.voting_manabar.last_update_time || 0;
        const vesting_shares = Number(
            (account.vesting_shares || '0.000000 VESTS').split(' ')[0]
        );
        const delegated_vesting_shares = Number(
            (account.delegated_vesting_shares || '0.000000 VESTS').split(' ')[0]
        );
        const received_vesting_shares = Number(
            (account.received_vesting_shares || '0.000000 VESTS').split(' ')[0]
        );
        const vesting_withdraw_rate = Number(
            (account.vesting_withdraw_rate || '0.000000 VESTS').split(' ')[0]
        );

        const net_vesting_shares =
            vesting_shares - delegated_vesting_shares + received_vesting_shares;
        const maxMana =
            (net_vesting_shares - vesting_withdraw_rate) * 1000000;

        if (maxMana <= 0) {
            return 0;
        }

        const now = Math.round(Date.now() / 1000);
        const elapsed = now - last_update_time;
        const regenerated_mana =
            (elapsed * maxMana) / BLURT_VOTING_MANA_REGENERATION_SECONDS;

        let currentMana = current_mana + regenerated_mana;
        if (currentMana >= maxMana) {
            currentMana = maxMana;
        }

        return (currentMana * 100) / maxMana;
    };

    votingPowerPoint = (centerX, centerY, radius, angle) => {
        const radians = (angle * Math.PI) / 180;

        return {
            x: centerX + radius * Math.sin(radians),
            y: centerY - radius * Math.cos(radians),
        };
    };

    votingPowerArc = (centerX, centerY, radius, startAngle, endAngle) => {
        const start = this.votingPowerPoint(centerX, centerY, radius, startAngle);
        const end = this.votingPowerPoint(centerX, centerY, radius, endAngle);
        const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

        return [
            'M',
            start.x,
            start.y,
            'A',
            radius,
            radius,
            0,
            largeArcFlag,
            1,
            end.x,
            end.y,
        ].join(' ');
    };

    shouldComponentUpdate(np, ns) {
        return (
            np.currentUser !== this.props.currentUser ||
            np.account !== this.props.account ||
            np.wifShown !== this.props.wifShown ||
            np.globalStatus !== this.props.globalStatus ||
            np.loading !== this.props.loading ||
            np.location.pathname !== this.props.location.pathname ||
            ns.resolvedIsActiveWitness !== this.state.resolvedIsActiveWitness ||
            ns.resolvedWitnessAccount !== this.state.resolvedWitnessAccount
        );
    }

    render() {
        const {
            props: {
                currentUser,
                wifShown,
                globalStatus,
                accountname,
                isMyAccount,
                socialUrl,
                nightmodeEnabled,
            },
            onPrint,
        } = this;
        const username = currentUser ? currentUser.get('username') : null;

        // Redirect user homepage to transfers page
        const { section } = this.props.routeParams;
        if (!section) {
            if (process.env.BROWSER) {
                browserHistory.replace(`/@${accountname}/transfers`);
            }
            return null;
        }

        // Loading status
        const status = globalStatus
            ? globalStatus.getIn([section, 'by_author'])
            : null;
        const fetching = (status && status.fetching) || this.props.loading;

        let account;
        const accountImm = this.props.account;
        if (accountImm) {
            account = accountImm.toJS();
        } else if (fetching) {
            return (
                <center>
                    <LoadingIndicator type="circle" />
                </center>
            );
        } else {
            return (
                <div>
                    <center>{tt('user_profile.unknown_account')}</center>
                </div>
            );
        }

        let tab_content = null;

        let rewardsClass = '';
        let walletClass = '';
        if (section === 'transfers') {
            walletClass = 'active';
            tab_content = (
                <div>
                    <UserWallet
                        key={`wallet:${accountname}`}
                        account={accountImm}
                        isLoading={fetching}
                        showTransfer={this.props.showTransfer}
                        showPowerdown={this.props.showPowerdown}
                        currentUser={currentUser}
                        withdrawVesting={this.props.withdrawVesting}
                    />
                </div>
            );
        } else if (section === 'delegations') {
            walletClass = 'active';
            tab_content = (
                <div>
                    <Delegations
                        account={accountImm}
                        showTransfer={this.props.showTransfer}
                        showPowerdown={this.props.showPowerdown}
                        currentUser={currentUser}
                        withdrawVesting={this.props.withdrawVesting}
                    />
                </div>
            );
        } else if (section === 'curation-rewards') {
            rewardsClass = 'active';
            tab_content = (
                <CurationRewards
                    key={`curation-rewards:${accountname}`}
                    account={account}
                    isLoading={fetching}
                />
            );
        } else if (section === 'author-rewards') {
            rewardsClass = 'active';
            tab_content = (
                <AuthorRewards
                    key={`author-rewards:${accountname}`}
                    account={account}
                    isLoading={fetching}
                />
            );
        } else if (section === 'witness-rewards') {
            rewardsClass = 'active';
            tab_content = (
                <WitnessRewards
                    key={`witness-rewards:${accountname}`}
                    account={account}
                    isLoading={fetching}
                />
            );
        } else if (section === 'settings') {
            tab_content = <Settings routeParams={this.props.routeParams} />;
        } else if (section === 'permissions') {
            walletClass = 'active';
            tab_content = (
                <div>
                    <div className="row">
                        <div className="column">
                            <WalletSubMenu
                                accountname={account.name}
                                isMyAccount={isMyAccount}
                            />
                        </div>
                    </div>
                    <br />
                    <UserKeys account={accountImm} />
                </div>
            );
        } else if (section === 'password') {
            walletClass = 'active';
            tab_content = (
                <div>
                    <div className="row">
                        <div className="column">
                            <WalletSubMenu
                                accountname={account.name}
                                isMyAccount={isMyAccount}
                            />
                        </div>
                    </div>
                    <br />
                    <PasswordReset account={accountImm} />
                </div>
            );
        } else if (section === 'communities') {
            walletClass = 'active';
            tab_content = (
                <div>
                    <div className="row">
                        <div className="column">
                            <WalletSubMenu
                                accountname={account.name}
                                isMyAccount={isMyAccount}
                            />
                        </div>
                    </div>
                    <br />
                    <CreateCommunity account={accountImm} />
                </div>
            );
        } 
        // else if (section === 'privacy') {
        //     walletClass = 'active';
        //     tab_content = (
        //         <div>
        //             <div className="row">
        //                 <div className="column">
        //                     <WalletSubMenu
        //                         accountname={account.name}
        //                         isMyAccount={isMyAccount}
        //                     />
        //                 </div>
        //             </div>
        //             <br />
        //             <AccountPrivacy account={accountImm} />
        //         </div>
        //     );
        // } 
        else {
            console.log('no matches. section:', section);
            tab_content = <div>Invalid Page</div>;
        }

        // detect illegal users
        if (userIllegalContent.includes(accountname)) {
            tab_content = <div>Unavailable For Legal Reasons.</div>;
        }

        let printLink = null;
        if (section === 'permissions') {
            if (wifShown) {
                printLink = (
                    <div>
                        <a className="float-right noPrint" onClick={onPrint}>
                            <Icon name="printer" />
                            {tt('g.print')}&nbsp;&nbsp;
                        </a>
                    </div>
                );
            }
        }

        const rewardsMenu = [
            {
                link: `/@${accountname}/curation-rewards`,
                label: tt('g.curation_rewards'),
                value: tt('g.curation_rewards'),
            },
            {
                link: `/@${accountname}/author-rewards`,
                label: tt('g.author_rewards'),
                value: tt('g.author_rewards'),
            },
        ];

        if (
            section === 'witness-rewards' ||
            account.is_active_witness ||
            this.state.resolvedIsActiveWitness
        ) {
            rewardsMenu.push({
                link: `/@${accountname}/witness-rewards`,
                label: tt('g.witness_rewards'),
                value: tt('g.witness_rewards'),
            });
        }

        const top_menu = (
            <div className="row UserProfile__top-menu">
                <div className="columns small-10 medium-12 medium-expand">
                    <ul className="menu" style={{ flexWrap: 'wrap' }}>
                        <li>
                            <a
                                href={appendThemeToUrl(
                                    `${socialUrl}/@${accountname}`,
                                    nightmodeEnabled
                                )}
                            >
                                {tt('g.blog')}
                            </a>
                        </li>
                        <DropdownMenu
                            className={rewardsClass}
                            items={rewardsMenu}
                            el="li"
                            selected={tt('g.rewards')}
                            position="right"
                        />
                    </ul>
                </div>
                <div className="columns shrink">
                    <ul className="menu" style={{ flexWrap: 'wrap' }}>
                        <li>
                            <a
                                href={`/@${accountname}/transfers`}
                                className={walletClass}
                                onClick={(e) => {
                                    e.preventDefault();
                                    browserHistory.push(e.target.pathname);
                                    return false;
                                }}
                            >
                                {tt('g.wallet')}
                            </a>
                        </li>
                        {isMyAccount ? (
                            <li>
                                <Link
                                    to={`/@${accountname}/settings`}
                                    activeClassName="active"
                                >
                                    {tt('g.settings')}
                                </Link>
                            </li>
                        ) : null}
                    </ul>
                </div>
            </div>
        );

        const { name, location, about, website, cover_image } =
            normalizeProfile(account);
        const website_label = website
            ? website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')
            : null;

        let cover_image_style = {};
        if (cover_image) {
            cover_image_style = {
                backgroundImage:
                    'url(' + proxifyImageUrl(cover_image, '2048x512') + ')',
            };
        }

        return (
            <div className="UserProfile">
                <div className="UserProfile__banner row expanded">
                    <div className="column" style={cover_image_style}>
                        <h1 className="UserProfile__identity">
                            <span className="UserProfile__identity-main">
                                <Userpic account={account.name} hideIfDefault />
                                <span>{name || account.name}</span>
                            </span>
                        </h1>

                        <div>
                            {about && (
                                <p className="UserProfile__bio">{about}</p>
                            )}
                            <p className="UserProfile__info">
                                {location && (
                                    <span>
                                        <Icon name="location" /> {location}
                                    </span>
                                )}
                                {website && (
                                    <span>
                                        <Icon name="link" />{' '}
                                        <SanitizedLink
                                            url={website}
                                            text={website_label}
                                        />
                                    </span>
                                )}
                                <Icon name="calendar" />{' '}
                                <DateJoinWrapper date={account.created} />
                            </p>
                        </div>
                    </div>
                </div>
                <div className="UserProfile__top-nav row expanded noPrint">
                    {top_menu}
                </div>
                <div>{printLink}</div>
                <div>{tab_content}</div>
            </div>
        );
    }
}

module.exports = {
    path: '@:accountname(/:section)',
    component: connect(
        (state, ownProps) => {
            const wifShown = state.global.get('UserKeys_wifShown');
            const currentUser = state.user.get('current');
            const socialUrl = state.app.get('socialUrl');
            const accountname = ownProps.routeParams.accountname.toLowerCase();
            const isMyAccount =
                currentUser && currentUser.get('username') === accountname;

            return {
                loading: state.app.get('loading'),
                globalStatus: state.global.get('status'),
                account: state.global.getIn(['accounts', accountname]),
                discussions: state.global.get('discussion_idx'),
                wifShown,
                currentUser,
                accountname,
                isMyAccount,
                socialUrl,
                BLURT_VOTING_MANA_REGENERATION_SECONDS: state.global.getIn([
                    'props',
                    'BLURT_VOTING_MANA_REGENERATION_SECONDS',
                ]) ||
                state.global.getIn([
                    'blurt_config',
                    'BLURT_VOTING_MANA_REGENERATION_SECONDS',
                ]) ||
                432000,
                nightmodeEnabled: state.app.getIn(['user_preferences', 'nightmode']),
            };
        },
        (dispatch) => ({
            login: () => {
                dispatch(userActions.showLogin());
            },
            clearTransferDefaults: () => {
                dispatch(userActions.clearTransferDefaults());
            },
            showTransfer: (transferDefaults) => {
                dispatch(userActions.setTransferDefaults(transferDefaults));
                dispatch(userActions.showTransfer());
            },
            clearPowerdownDefaults: () => {
                dispatch(userActions.clearPowerdownDefaults());
            },
            showPowerdown: (powerdownDefaults) => {
                console.log('power down defaults:', powerdownDefaults);
                dispatch(userActions.setPowerdownDefaults(powerdownDefaults));
                dispatch(userActions.showPowerdown());
            },
            withdrawVesting: ({
                account,
                vesting_shares,
                errorCallback,
                successCallback,
            }) => {
                const successCallbackWrapper = (...args) => {
                    dispatch(
                        globalActions.getState({ url: `@${account}/transfers` })
                    );
                    return successCallback(...args);
                };
                dispatch(
                    transactionActions.broadcastOperation({
                        type: 'withdraw_vesting',
                        operation: { account, vesting_shares },
                        errorCallback,
                        successCallback: successCallbackWrapper,
                    })
                );
            },
            requestData: (args) =>
                dispatch(fetchDataSagaActions.requestData(args)),
        })
    )(UserProfile),
};
