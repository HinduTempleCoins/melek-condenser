import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import tt from 'counterpart';
import CloseButton from 'app/components/elements/CloseButton';
import Icon from 'app/components/elements/Icon';
import { Link } from 'react-router';

const SidePanel = ({
    alignment,
    visible,
    hideSidePanel,
    username,
    walletUrl,
}) => {
    if (process.env.BROWSER) {
        visible && document.addEventListener('click', hideSidePanel);
        !visible && document.removeEventListener('click', hideSidePanel);
    }

    const loggedIn =
        username === undefined
            ? 'show-for-small-only'
            : 'SidePanel__hide-signup';

    const makeLink = (i, ix, arr) => {
        // A link is internal if it begins with a slash
        const isExternal = !i.link.match(/^\//) || i.isExternal;
        if (isExternal) {
            const cn = ix === arr.length - 1 ? 'last' : null;
            return (
                <li key={i.value} className={cn}>
                    <a
                        href={i.link}
                        target={i.internal ? null : '_blank'}
                        rel="noopener noreferrer"
                    >
                        {i.label}&nbsp;
                        <Icon name="extlink" />
                    </a>
                </li>
            );
        } else {
            const cn = ix === arr.length - 1 ? 'last' : null;
            return (
                <li key={i.value} className={cn}>
                    <Link to={i.link}>{i.label}</Link>
                </li>
            );
        }
    };

    const sidePanelLinks = {
        internal: [
            {
                value: 'welcome',
                label: tt('navigation.welcome'),
                link: '/welcome',
            },
            {
                value: 'faq',
                label: tt('navigation.faq'),
                link: '/faq.html',
                internal: true,
            },
            {
                value: 'tags',
                label: tt('navigation.explore'),
                link: '/tags',
            },
            // {
            //     value: 'recover_account_step_1',
            //     label: tt('navigation.stolen_account_recovery'),
            //     link: 'https://signer.melek.salon/recover',
            // },
            {
                value: 'change_password',
                label: tt('navigation.change_account_password'),
                link: '/portal/wallet.html',
                isExternal: true,
                internal: true,
            },
            {
                value: 'vote_for_witnesses',
                label: tt('navigation.vote_for_witnesses'),
                link: '/~witnesses',
                internal: true,
            },
        ],
        exchanges: [
            // MELEK is not listed on any third-party exchange yet. This list previously carried
            // Blurt's exchange links with the ticker string swapped to MELEK — every one of them
            // was a dead or wrong market page. The section below renders only when this is
            // non-empty, so adding a real venue here brings it straight back.
        ],
        wrapped: [
            // Was a Uniswap link for 0x3747…e5d4 — the real wBLURT ERC-20, under a "Wrapped MELEK"
            // heading. No wMELEK contract exists yet; add it here when it does.
        ],
        external: [
            {
                value: 'chat',
                label: tt('navigation.chat'),
                link: '/chat',
                internal: true,
            },
            {
                value: 'block_explorer',
                label: 'Block Explorer',
                link: 'https://explorer.melek.salon',
            },
            // {
            //     value: 'jobs',
            //     label: tt('navigation.jobs'),
            //     link: 'https://recruiting.paylocity.com/recruiting/jobs/List/3288/Steemit-Inc',
            // },
            // {
            //     value: 'tools',
            //     label: 'Tools',
            //     link: 'https://melek.salon/',
            // },
            // {
            //     value: 'business',
            //     label: tt('navigation.business_center'),
            //     link: 'https://steemeconomy.com/',
            // },
            // {
            //     value: 'api_docs',
            //     label: tt('navigation.api_docs'),
            //     link: 'https://developers.steem.io/',
            // },
        ],
        organizational: [
            // {
            //     value: 'bluepaper',
            //     label: tt('navigation.bluepaper'),
            //     link: 'https://steem.io/steem-bluepaper.pdf',
            // },
            // {
            //     value: 'smt_whitepaper',
            //     label: tt('navigation.smt_whitepaper'),
            //     link: 'https://smt.steem.io/',
            // },
            // {
            //     value: 'whitepaper',
            //     label: tt('navigation.whitepaper'),
            //     link: 'https://steem.io/SteemWhitePaper.pdf',
            // },
            {
                value: 'about',
                label: tt('navigation.about'),
                link: '/about.html',
                internal: true,
            },
        ],
        legal: [
            {
                value: 'privacy',
                label: tt('navigation.privacy_policy'),
                link: '/privacy.html',
            },
            {
                value: 'tos',
                label: tt('navigation.terms_of_service'),
                link: '/tos.html',
            },
        ],
        extras: [
            {
                value: 'login',
                label: tt('g.sign_in'),
                link: '/login.html',
            },
            {
                value: 'signup',
                label: tt('g.sign_up'),
                link: '/portal/signup.html',
                isExternal: true,
                internal: true,
            },
            {
                value: 'wallet',
                label: 'Wallet',
                link: '/portal/wallet.html',
                isExternal: true,
                internal: true,
            },
            {
                value: 'portal',
                label: 'MELEK Portal',
                link: '/portal/',
                isExternal: true,
                internal: true,
            },
            {
                value: 'post',
                label: tt('g.post'),
                link: '/submit.html',
            },
        ],
        swag: [
            // Was Blurt's Redbubble store. Point at a MELEK store when one exists.
        ],
    };

    return (
        <div className="SidePanel">
            <div className={(visible ? 'visible ' : '') + alignment}>
                <CloseButton onClick={hideSidePanel} />
                <ul className={`vertical menu ${loggedIn}`}>
                    {sidePanelLinks.extras.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    {sidePanelLinks.internal.map(makeLink)}
                </ul>
                {sidePanelLinks.exchanges.length > 0 && (
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">
                            {tt('navigation.third_party_exchanges')}
                        </a>
                    </li>
                    {sidePanelLinks.exchanges.map(makeLink)}
                </ul>
                )}
                {sidePanelLinks.wrapped.length > 0 && (
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">Wrapped MELEK</a>
                    </li>
                    {sidePanelLinks.wrapped.map(makeLink)}
                </ul>
                )}
                {sidePanelLinks.swag.length > 0 && (
                <ul className="vertical menu">
                    <li>
                        <a className="menu-section">
                            {tt('navigation.blurt_swag')}
                        </a>
                    </li>
                    {sidePanelLinks.swag.map(makeLink)}
                </ul>
                )}
                <ul className="vertical menu">
                    {sidePanelLinks.external.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    {sidePanelLinks.organizational.map(makeLink)}
                </ul>
                <ul className="vertical menu">
                    {sidePanelLinks.legal.map(makeLink)}
                </ul>
            </div>
        </div>
    );
};

SidePanel.propTypes = {
    alignment: PropTypes.oneOf(['left', 'right']).isRequired,
    visible: PropTypes.bool.isRequired,
    hideSidePanel: PropTypes.func.isRequired,
    username: PropTypes.string,
};

SidePanel.defaultProps = {
    username: undefined,
};

export default connect(
    (state, ownProps) => {
        const walletUrl = state.app.get('walletUrl');
        return {
            walletUrl,
            ...ownProps,
        };
    },
    (dispatch) => ({})
)(SidePanel);
