import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AppPropTypes from 'app/utils/AppPropTypes';
import Header from 'app/components/modules/Header';
import * as userActions from 'app/redux/UserReducer';
import classNames from 'classnames';
import ConnectedSidePanel from 'app/components/modules/ConnectedSidePanel';
import CloseButton from 'app/components/elements/CloseButton';
import Dialogs from 'app/components/modules/Dialogs';
import Modals from 'app/components/modules/Modals';
import MiniHeader from 'app/components/modules/MiniHeader';
import tt from 'counterpart';
import PageViewsCounter from 'app/components/elements/PageViewsCounter';
import { serverApiRecordEvent } from 'app/utils/ServerApiClient';
import { key_utils } from '@blurtfoundation/blurtjs/lib/auth/ecc';
import resolveRoute from 'app/ResolveRoute';
import { VIEW_MODE_WHISTLE } from 'shared/constants';
import * as appActions from 'app/redux/AppReducer';
import {
    getNightmodeFromSearch,
    getStoredNightmode,
    NIGHTMODE_STORAGE_KEY,
} from 'app/utils/themePreferences';

const pageRequiresEntropy = (path) => {
    const { page } = resolveRoute(path);

    const entropyPages = [
        'ChangePassword',
        'RecoverAccountStep1',
        'RecoverAccountStep2',
        'UserProfile',
        'CreateAccount',
    ];
    /* Returns true if that page requires the entropy collection listener */
    return entropyPages.indexOf(page) !== -1;
};

class App extends React.Component {
    constructor(props) {
        super(props);
        const hasInitialNightmode =
            process.env.BROWSER &&
            typeof window !== 'undefined' &&
            typeof window.__BLURT_INITIAL_NIGHTMODE__ === 'boolean';
        const initialSystemNightmode =
            hasInitialNightmode
                ? window.__BLURT_INITIAL_NIGHTMODE__
                : process.env.BROWSER &&
                  typeof window !== 'undefined' &&
                  window.matchMedia &&
                  window.matchMedia('(prefers-color-scheme: dark)').matches;
        // TODO: put both of these and associated toggles into Redux Store.
        this.state = {
            showCallout: true,
            systemNightmode: !!initialSystemNightmode,
        };
        this.listenerActive = null;
        this.systemThemeQuery = null;
        this.systemThemeListener = null;
    }

    getEffectiveNightmode(nightmodeEnabled = this.props.nightmodeEnabled) {
        if (typeof nightmodeEnabled === 'boolean') return nightmodeEnabled;

        const queryNightmode = getNightmodeFromSearch(
            process.env.BROWSER && typeof window !== 'undefined'
                ? window.location.search
                : ''
        );
        if (typeof queryNightmode === 'boolean') return queryNightmode;

        const storedNightmode = getStoredNightmode();
        if (typeof storedNightmode === 'boolean') return storedNightmode;

        return this.state.systemNightmode;
    }

    syncNightmodeFromLocation = (props = this.props) => {
        const queryNightmode = getNightmodeFromSearch(props.locationSearch);
        if (
            typeof queryNightmode !== 'boolean' ||
            props.nightmodeEnabled === queryNightmode
        ) {
            return;
        }

        this.props.setUserPreferences({
            ...props.userPreferences,
            nightmode: queryNightmode,
        });
    };

    updateSystemNightmode = () => {
        if (!this.systemThemeQuery) return;
        this.setState({ systemNightmode: this.systemThemeQuery.matches }, () => {
            if (typeof this.props.nightmodeEnabled !== 'boolean') {
                this.toggleBodyNightmode(this.getEffectiveNightmode());
            }
        });
    };

    toggleBodyNightmode(nightmodeEnabled) {
        const effectiveNightmode = this.getEffectiveNightmode(nightmodeEnabled);
        const darkClass = 'theme-dark';
        const lightClass = 'theme-light';
        const nextClass = effectiveNightmode ? darkClass : lightClass;
        const previousClass = effectiveNightmode ? lightClass : darkClass;
        const colorScheme = effectiveNightmode ? 'dark' : 'light';

        if (process.env.BROWSER && typeof nightmodeEnabled === 'boolean') {
            try {
                window.localStorage.setItem(
                    NIGHTMODE_STORAGE_KEY,
                    String(nightmodeEnabled)
                );
            } catch (error) {}
        }

        [document.documentElement, document.body, this.refs.App_root]
            .filter(Boolean)
            .forEach((node) => {
                node.classList.remove(previousClass);
                node.classList.add(nextClass);
                node.setAttribute('data-theme', colorScheme);
            });

        const backgroundColor = effectiveNightmode ? '#1c252b' : '#fff';
        document.body.style.colorScheme = colorScheme;
        document.body.style.backgroundColor = backgroundColor;
        document.documentElement.style.colorScheme = colorScheme;
        document.documentElement.style.backgroundColor = backgroundColor;

        if (this.refs.App_root) {
            this.refs.App_root.style.colorScheme = colorScheme;
            this.refs.App_root.style.backgroundColor = backgroundColor;
        }
    }

    componentWillMount() {
        if (process.env.BROWSER) localStorage.removeItem('autopost'); // July 14 '16 compromise, renamed to autopost2
        this.props.loginUser();
    }

    componentDidMount() {
        this.syncNightmodeFromLocation(this.props);

        if (window.matchMedia) {
            this.systemThemeQuery = window.matchMedia(
                '(prefers-color-scheme: dark)'
            );
            this.systemThemeListener = this.updateSystemNightmode;
            if (this.systemThemeQuery.addEventListener) {
                this.systemThemeQuery.addEventListener(
                    'change',
                    this.systemThemeListener
                );
            } else if (this.systemThemeQuery.addListener) {
                this.systemThemeQuery.addListener(this.systemThemeListener);
            }
            this.updateSystemNightmode();
        }

        this.toggleBodyNightmode(this.props.nightmodeEnabled);

        if (pageRequiresEntropy(this.props.pathname)) {
            this._addEntropyCollector();
        }
    }

    componentWillReceiveProps(np) {
        this.syncNightmodeFromLocation(np);
        this.toggleBodyNightmode(np.nightmodeEnabled);
        // Add listener if the next page requires entropy and the current page didn't
        if (
            pageRequiresEntropy(np.pathname) &&
            !pageRequiresEntropy(this.props.pathname)
        ) {
            this._addEntropyCollector();
        } else if (!pageRequiresEntropy(np.pathname)) {
            // Remove if next page does not require entropy
            this._removeEntropyCollector();
        }
    }

    componentWillUnmount() {
        if (this.listenerActive) {
            this._removeEntropyCollector();
        }

        if (!this.systemThemeQuery || !this.systemThemeListener) return;

        if (this.systemThemeQuery.removeEventListener) {
            this.systemThemeQuery.removeEventListener(
                'change',
                this.systemThemeListener
            );
        } else if (this.systemThemeQuery.removeListener) {
            this.systemThemeQuery.removeListener(this.systemThemeListener);
        }
    }

    _addEntropyCollector() {
        if (!this.listenerActive && this.refs.App_root) {
            this.refs.App_root.addEventListener(
                'mousemove',
                this.onEntropyEvent,
                { capture: false, passive: true }
            );
            this.listenerActive = true;
        }
    }

    _removeEntropyCollector() {
        if (this.listenerActive && this.refs.App_root) {
            this.refs.App_root.removeEventListener(
                'mousemove',
                this.onEntropyEvent
            );
            this.listenerActive = null;
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        const { pathname, new_visitor, nightmodeEnabled } = this.props;
        const n = nextProps;
        return (
            pathname !== n.pathname ||
            new_visitor !== n.new_visitor ||
            this.state.showCallout !== nextState.showCallout ||
            this.state.systemNightmode !== nextState.systemNightmode ||
            nightmodeEnabled !== n.nightmodeEnabled
        );
    }

    onEntropyEvent = (e) => {
        if (e.type === 'mousemove')
            key_utils.addEntropy(e.pageX, e.pageY, e.screenX, e.screenY);
        else console.log('onEntropyEvent Unknown', e.type, e);
    };

    signUp = () => {
        serverApiRecordEvent('Sign up', 'Hero banner');
    };

    learnMore = () => {
        serverApiRecordEvent('Learn more', 'Hero banner');
    };

    render() {
        const {
            params,
            children,
            new_visitor,
            nightmodeEnabled,
            viewMode,
            pathname,
            category,
            order,
        } = this.props;

        const miniHeader = false;
        const whistleView = viewMode === VIEW_MODE_WHISTLE;
        const headerHidden = whistleView;
        const params_keys = Object.keys(params);
        const ip =
            pathname === '/' ||
            (params_keys.length === 2 &&
                params_keys[0] === 'order' &&
                params_keys[1] === 'category');
        const alert = this.props.error;
        let callout = null;
        if (this.state.showCallout && alert) {
            callout = (
                <div className="App__announcement row">
                    <div className="column">
                        <div className={classNames('callout', { alert })}>
                            <CloseButton
                                onClick={() =>
                                    this.setState({ showCallout: false })
                                }
                            />
                            <p>{alert}</p>
                        </div>
                    </div>
                </div>
            );
        } else if (false && ip && this.state.showCallout) {
            callout = (
                <div className="App__announcement row">
                    <div className="column">
                        <div
                            className={classNames(
                                'callout success',
                                { alert },
                                { warning },
                                { success }
                            )}
                        >
                            <CloseButton
                                onClick={() =>
                                    this.setState({ showCallout: false })
                                }
                            />
                            <ul>
                                <li>
                                    /*
                                    <a href="https://steemit.com/steemit/@steemitblog/steemit-com-is-now-open-source">
                                        ...STORY TEXT...
                                    </a>
                                    */
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            );
        }
        if ($STM_Config.read_only_mode && this.state.showCallout) {
            callout = (
                <div className="App__announcement row">
                    <div className="column">
                        <div
                            className={classNames(
                                'callout warning',
                                { alert },
                                { warning },
                                { success }
                            )}
                        >
                            <CloseButton
                                onClick={() =>
                                    this.setState({ showCallout: false })
                                }
                            />
                            <p>{tt('g.read_only_mode')}</p>
                        </div>
                    </div>
                </div>
            );
        }

        const themeClass =
            typeof nightmodeEnabled !== 'boolean' && !process.env.BROWSER
                ? ''
                : this.getEffectiveNightmode(nightmodeEnabled)
                    ? ' theme-dark'
                    : ' theme-light';

        return (
            <div
                className={classNames('App', themeClass, {
                    'index-page': ip,
                    'mini-header': miniHeader,
                    'whistle-view': whistleView,
                })}
                ref="App_root"
            >
                <ConnectedSidePanel alignment="right" />

                {headerHidden ? null : miniHeader ? (
                    <MiniHeader />
                ) : (
                    <Header
                        pathname={pathname}
                        category={category}
                        order={order}
                    />
                )}

                <div className="App__content">
                    {callout}
                    {children}
                </div>
                <Dialogs />
                <Modals />
                <PageViewsCounter />
            </div>
        );
    }
}

App.propTypes = {
    error: PropTypes.string,
    children: AppPropTypes.Children,
    pathname: PropTypes.string,
    category: PropTypes.string,
    order: PropTypes.string,
    loginUser: PropTypes.func.isRequired,
};

export default connect(
    (state, ownProps) => {
        const current_user = state.user.get('current');
        const current_account_name = current_user
            ? current_user.get('username')
            : state.offchain.get('account');

        return {
            viewMode: state.app.get('viewMode'),
            error: state.app.get('error'),
            new_visitor:
                !state.user.get('current') &&
                !state.offchain.get('user') &&
                !state.offchain.get('account') &&
                state.offchain.get('new_visit'),

            nightmodeEnabled: state.app.getIn([
                'user_preferences',
                'nightmode',
            ]),
            pathname: ownProps.location.pathname,
            locationSearch: ownProps.location.search || '',
            userPreferences: state.app.get('user_preferences').toJS(),
            order: ownProps.params.order,
            category: ownProps.params.category,
        };
    },
    (dispatch) => ({
        loginUser: () => dispatch(userActions.usernamePasswordLogin({})),
        setUserPreferences: (payload) =>
            dispatch(appActions.setUserPreferences(payload)),
    })
)(App);
