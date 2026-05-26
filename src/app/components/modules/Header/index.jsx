import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import Icon from 'app/components/elements/Icon';
import resolveRoute from 'app/ResolveRoute';
import tt from 'counterpart';
import { APP_NAME } from 'app/client_config';
import SearchInput from 'app/components/elements/SearchInput';
import IconButton from 'app/components/elements/IconButton';
import DropdownMenu from 'app/components/elements/DropdownMenu';
import * as userActions from 'app/redux/UserReducer';
import * as appActions from 'app/redux/AppReducer';
import Userpic from 'app/components/elements/Userpic';
import VotingPowerIndicator from 'app/components/elements/VotingPowerIndicator';
import { SIGNUP_URL } from 'shared/constants';
import MELEKLogo from 'app/components/elements/MELEKLogo';
import normalizeProfile from 'app/utils/NormalizeProfile';
import { appendThemeToUrl } from 'app/utils/themePreferences';

const getEffectiveNightmode = (nightmodeEnabled) => {
    if (typeof nightmodeEnabled === 'boolean') {
        return nightmodeEnabled;
    }
    const bodyHasDarkTheme =
        process.env.BROWSER &&
        typeof document !== 'undefined' &&
        document.body &&
        document.body.classList.contains('theme-dark');
    const htmlHasDarkTheme =
        process.env.BROWSER &&
        typeof document !== 'undefined' &&
        document.documentElement &&
        document.documentElement.classList.contains('theme-dark');
    const bodyHasLightTheme =
        process.env.BROWSER &&
        typeof document !== 'undefined' &&
        document.body &&
        document.body.classList.contains('theme-light');
    const htmlHasLightTheme =
        process.env.BROWSER &&
        typeof document !== 'undefined' &&
        document.documentElement &&
        document.documentElement.classList.contains('theme-light');
    return !!(
        bodyHasDarkTheme ||
        htmlHasDarkTheme ||
        (!bodyHasLightTheme &&
            !htmlHasLightTheme &&
            process.env.BROWSER &&
            window.matchMedia &&
            window.matchMedia('(prefers-color-scheme: dark)').matches)
    );
};

class Header extends React.Component {
    static propTypes = {
        current_account_name: PropTypes.string,
        account_meta: PropTypes.object,
        category: PropTypes.string,
        order: PropTypes.string,
        pathname: PropTypes.string,
    };

    constructor() {
        super();
    }

    componentDidUpdate(prevProps) {
        const { loggedIn } = this.props;
        if (prevProps.loggedIn && !loggedIn) {
            if (process.env.BROWSER) {
                browserHistory.replace(`/`);
            }
        }
    }

    render() {
        const {
            category,
            order,
            pathname,
            current_account_name,
            username,
            showLogin,
            logout,
            loggedIn,
            vertical,
            nightmodeEnabled,
            toggleNightmode,
            userPath,
            showSidePanel,
            navigate,
            account_meta,
            socialUrl,
            currentAccount,
            BLURT_VOTING_MANA_REGENERATION_SECONDS,
        } = this.props;

        /*Set the document.title on each header render.*/
        const route = resolveRoute(pathname);
        const home_account = false;
        let page_title = route.page;

        const topic = '';
        let page_name = null;
        if (route.page === 'WalletIndex') {
        } else if (route.page == 'Privacy') {
            page_title = tt('navigation.privacy_policy');
        } else if (route.page == 'Tos') {
            page_title = tt('navigation.terms_of_service');
        } else if (route.page == 'ChangePassword') {
            page_title = tt('header_jsx.change_account_password');
        } else if (route.page == 'CreateAccount') {
            page_title = tt('header_jsx.create_account');
        } else if (route.page == 'Approval') {
            page_title = `Account Confirmation`;
        } else if (
            route.page == 'RecoverAccountStep1' ||
            route.page == 'RecoverAccountStep2'
        ) {
            page_title = tt('header_jsx.stolen_account_recovery');
        } else if (route.page === 'Proposals') {
            page_title = tt('header_jsx.steem_proposals');
        } else if (route.page === 'UserProfile') {
            const user_name = route.params[0].slice(1);
            const name = account_meta
                ? normalizeProfile(account_meta.toJS()).name
                : null;
            const user_title = name ? `${name} (@${user_name})` : user_name;
            page_title = user_title;
            if (route.params[1] === 'curation-rewards') {
                page_title = tt('header_jsx.curation_rewards_by', {
                    username: user_title,
                });
            }
            if (route.params[1] === 'author-rewards') {
                page_title = tt('header_jsx.author_rewards_by', {
                    username: user_title,
                });
            }
            if (route.params[1] === 'witness-rewards') {
                page_title = tt('header_jsx.witness_rewards_by', {
                    username: user_title,
                });
            }
        } else {
            page_name = ''; //page_title = route.page.replace( /([a-z])([A-Z])/g, '$1 $2' ).toLowerCase();
        }

        // Format first letter of all titles and lowercase user name
        if (route.page !== 'UserProfile') {
            page_title =
                page_title.charAt(0).toUpperCase() + page_title.slice(1);
        }

        const account_link = appendThemeToUrl(
            `${socialUrl}/@${username}`,
            nightmodeEnabled
        );
        const blog_home_link = appendThemeToUrl(
            socialUrl,
            nightmodeEnabled
        );
        const wallet_link = `/@${username}/transfers`;
        const reset_password_link = `/@${username}/password`;
        const settings_link = `/@${username}/settings`;
        const pathCheck = userPath === '/submit.html' ? true : null;
        const effectiveNightmode = getEffectiveNightmode(nightmodeEnabled);
        const blogLogo = '/images/blurt-logo-2025062801.png';

        const user_menu = [
            {
                link: account_link,
                icon: 'profile',
                value: tt('g.blog'),
                sameTab: true,
            },
            {
                link: wallet_link,
                icon: 'wallet',
                value: tt('g.wallet'),
            },
            {
                link: '#',
                icon: 'eye',
                onClick: (e) => toggleNightmode(e, effectiveNightmode),
                value: tt('g.toggle_nightmode'),
            },
            {
                link: reset_password_link,
                icon: 'password',
                value: tt('g.change_password'),
            },
            { link: settings_link, icon: 'cog', value: tt('g.settings') },
            loggedIn
                ? {
                      link: '#',
                      icon: 'enter',
                      onClick: logout,
                      value: tt('g.logout'),
                  }
                : { link: '#', onClick: showLogin, value: tt('g.login') },
        ];

        return (
            <header className="Header">
                <nav className="row Header__nav">
                    <div className="small-5 large-6 columns Header__logotype">
                        {/*LOGO*/}
                        <Link className="Header__wallet-home-link" to="/">
                            <MELEKLogo />
                        </Link>
                        {/*
                          "Back to blog" link disabled during the bootstrap
                          period. The upstream image was a BLURT BLOG logo
                          and the link pointed at blurt.blog (a Blurt-
                          branded surface). Restore once melek.salon is
                          deployed and a MELEK blog-logo asset exists.
                          See feedback_no_blurt_deploy.
                        */}
                    </div>

                    <div className="small-7 large-6 columns Header__buttons">
                        {/*NOT LOGGED IN SIGN UP LINK*/}
                        {!loggedIn && (
                            <span className="Header__user-signup show-for-medium">
                                <a
                                    className="Header__login-link"
                                    href="/login.html"
                                    onClick={showLogin}
                                >
                                    {tt('g.login')}
                                </a>
                                <a
                                    className="Header__signup-link"
                                    href={SIGNUP_URL}
                                >
                                    {tt('g.sign_up')}
                                </a>
                            </span>
                        )}
                        {/*USER AVATAR */}
                        {loggedIn && (
                            <VotingPowerIndicator
                                account={currentAccount}
                                BLURT_VOTING_MANA_REGENERATION_SECONDS={
                                    BLURT_VOTING_MANA_REGENERATION_SECONDS
                                }
                            />
                        )}
                        {loggedIn && (
                            <DropdownMenu
                                className={'Header__usermenu'}
                                items={user_menu}
                                title={username}
                                el="span"
                                selected={tt('g.rewards')}
                                position="left"
                            >
                                <li className={'Header__userpic '}>
                                    <span title={username}>
                                        <Userpic account={username} />
                                    </span>
                                </li>
                            </DropdownMenu>
                        )}
                        {/*HAMBURGER*/}
                        <span
                            onClick={showSidePanel}
                            className="toggle-menu Header__hamburger"
                        >
                            <span className="hamburger" />
                        </span>
                    </div>
                </nav>
            </header>
        );
    }
}

export { Header as _Header_ };

const mapStateToProps = (state, ownProps) => {
    // SSR code split.
    if (!process.env.BROWSER) {
        return {
            username: null,
            loggedIn: false,
        };
    }

    let user_profile;
    const route = resolveRoute(ownProps.pathname);
    if (route.page === 'UserProfile') {
        user_profile = state.global.getIn([
            'accounts',
            route.params[0].slice(1),
        ]);
    }

    // TODO: Cleanup
    const userPath = state.routing.locationBeforeTransitions.pathname;
    const username = state.user.getIn(['current', 'username']);
    const loggedIn = !!username;
    const current_account_name = username
        ? username
        : state.offchain.get('account');

    return {
        username,
        loggedIn,
        userPath,
        nightmodeEnabled: state.app.getIn(['user_preferences', 'nightmode']),
        socialUrl: state.app.get('socialUrl'),
        currentAccount: username
            ? state.global.getIn(['accounts', username])
            : null,
        BLURT_VOTING_MANA_REGENERATION_SECONDS:
            state.global.getIn([
                'props',
                'BLURT_VOTING_MANA_REGENERATION_SECONDS',
            ]) ||
            state.global.getIn([
                'blurt_config',
                'BLURT_VOTING_MANA_REGENERATION_SECONDS',
            ]) ||
            432000,
        account_meta: user_profile,
        current_account_name,
        ...ownProps,
    };
};

const mapDispatchToProps = (dispatch) => ({
    showLogin: (e) => {
        if (e) e.preventDefault();
        dispatch(userActions.showLogin({ type: 'basic' }));
    },
    logout: (e) => {
        if (e) e.preventDefault();
        dispatch(userActions.logout({ type: 'default' }));
    },
    toggleNightmode: (e, currentNightmode) => {
        if (e) e.preventDefault();
        dispatch(appActions.toggleNightmode(currentNightmode));
    },
    showSidePanel: () => {
        dispatch(userActions.showSidePanel());
    },
    hideSidePanel: () => {
        dispatch(userActions.hideSidePanel());
    },
});

const connectedHeader = connect(mapStateToProps, mapDispatchToProps)(Header);

export default connectedHeader;
