/* eslint react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import TransferHistoryRow from 'app/components/cards/TransferHistoryRow';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import {
    numberWithCommas,
    vestsToHp,
    assetFloat,
} from 'app/utils/StateFunctions';
import tt from 'counterpart';
import Moment from 'moment';
import {
    LIQUID_TICKER,
    VEST_TICKER,
    DEBT_TICKER,
    DEBT_TOKEN_SHORT,
} from 'app/client_config';
import {
    getDefaultRewardsPageSize,
    getRewardsPageSizeFromTop,
    REWARDS_HISTORY_DAYS,
} from 'app/utils/historyPageSize';

class AuthorRewards extends React.Component {
    constructor() {
        super();
        this.state = {
            historyIndex: 0,
            historyPageSize: getDefaultRewardsPageSize(),
            historyTransitionDirection: null,
        };
        this.historyWrapNode = null;
        this.historyPagerNode = null;
        this.historyTouchStartX = null;
        this.historyTouchStartY = null;
        this.historyPageSizeTimers = [];
        this.onShowDeposit = () => {
            this.setState({ showDeposit: !this.state.showDeposit });
        };
        this.onShowDepositBlurt = () => {
            this.setState({
                showDeposit: !this.state.showDeposit,
                depositType: LIQUID_TICKER,
            });
        };
        this.onShowDepositPower = () => {
            this.setState({
                showDeposit: !this.state.showDeposit,
                depositType: VEST_TICKER,
            });
        };
        this.setHistoryWrapRef = this.setHistoryWrapRef.bind(this);
        this.setHistoryPagerRef = this.setHistoryPagerRef.bind(this);
        this.updateHistoryPageSize = this.updateHistoryPageSize.bind(this);
        this.scheduleHistoryPageSizeUpdate =
            this.scheduleHistoryPageSizeUpdate.bind(this);
        this.clearHistoryPageSizeTimers =
            this.clearHistoryPageSizeTimers.bind(this);
        this.handleHistoryTouchStart =
            this.handleHistoryTouchStart.bind(this);
        this.handleHistoryTouchEnd = this.handleHistoryTouchEnd.bind(this);
        // this.onShowDeposit = this.onShowDeposit.bind(this)
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.account_name !== this.props.account_name ||
            nextProps.transfer_history !== this.props.transfer_history ||
            nextProps.transfer_history.length !==
                this.props.transfer_history.length ||
            nextState.historyIndex !== this.state.historyIndex ||
            nextState.historyPageSize !== this.state.historyPageSize
        );
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.account_name !== this.props.account_name) {
            this.setState({
                historyIndex: 0,
                historyTransitionDirection: null,
            });
        }
    }

    componentDidMount() {
        if (!process.env.BROWSER || typeof window === 'undefined') return;

        this.scheduleHistoryPageSizeUpdate();
        window.addEventListener('resize', this.updateHistoryPageSize);
        window.addEventListener('orientationchange', this.updateHistoryPageSize);
        window.addEventListener('load', this.updateHistoryPageSize);
    }

    componentDidUpdate(prevProps, prevState) {
        if (
            prevProps.account_name !== this.props.account_name ||
            prevProps.transfer_history !== this.props.transfer_history ||
            prevState.historyPageSize !== this.state.historyPageSize
        ) {
            this.scheduleHistoryPageSizeUpdate();
        }
    }

    componentWillUnmount() {
        if (!process.env.BROWSER || typeof window === 'undefined') return;

        this.clearHistoryPageSizeTimers();
        window.removeEventListener('resize', this.updateHistoryPageSize);
        window.removeEventListener(
            'orientationchange',
            this.updateHistoryPageSize
        );
        window.removeEventListener('load', this.updateHistoryPageSize);
    }

    setHistoryWrapRef(node) {
        this.historyWrapNode = node;
    }

    setHistoryPagerRef(node) {
        this.historyPagerNode = node;
    }

    clearHistoryPageSizeTimers() {
        if (!process.env.BROWSER || typeof window === 'undefined') return;

        this.historyPageSizeTimers.forEach((timerId) =>
            window.clearTimeout(timerId)
        );
        this.historyPageSizeTimers = [];
    }

    scheduleHistoryPageSizeUpdate() {
        if (!process.env.BROWSER || typeof window === 'undefined') return;

        this.clearHistoryPageSizeTimers();
        [0, 250, 1000, 2000].forEach((delay) => {
            const timerId = window.setTimeout(
                this.updateHistoryPageSize,
                delay
            );
            this.historyPageSizeTimers.push(timerId);
        });
    }

    updateHistoryPageSize() {
        if (
            !process.env.BROWSER ||
            typeof window === 'undefined' ||
            !this.historyWrapNode
        ) {
            return;
        }

        const historyPageSize = getRewardsPageSizeFromTop(
            this.historyWrapNode.getBoundingClientRect().top
        );

        if (historyPageSize !== this.state.historyPageSize) {
            this.setState({ historyPageSize });
        }
    }

    getEffectiveHistoryIndex(totalEntries, historyPageSize) {
        const maxHistoryIndex = Math.max(
            0,
            Math.ceil(totalEntries / historyPageSize) - 1
        );

        return Math.min(this.state.historyIndex, maxHistoryIndex);
    }

    canUseSwipePagination() {
        return (
            process.env.BROWSER &&
            typeof window !== 'undefined' &&
            window.innerWidth <= 640
        );
    }

    handleHistoryTouchStart(event) {
        if (
            !this.canUseSwipePagination() ||
            !event.touches ||
            event.touches.length !== 1
        ) {
            return;
        }

        const touch = event.touches[0];
        this.historyTouchStartX = touch.clientX;
        this.historyTouchStartY = touch.clientY;
    }

    handleHistoryTouchEnd(event, totalEntries, historyPageSize) {
        if (
            !this.canUseSwipePagination() ||
            this.historyTouchStartX === null ||
            this.historyTouchStartY === null ||
            !event.changedTouches ||
            event.changedTouches.length !== 1
        ) {
            this.historyTouchStartX = null;
            this.historyTouchStartY = null;
            return;
        }

        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - this.historyTouchStartX;
        const deltaY = touch.clientY - this.historyTouchStartY;

        this.historyTouchStartX = null;
        this.historyTouchStartY = null;

        if (
            totalEntries <= historyPageSize ||
            Math.abs(deltaX) < 36 ||
            Math.abs(deltaX) <= Math.abs(deltaY)
        ) {
            return;
        }

        this._setHistoryPage(deltaX < 0, totalEntries, historyPageSize);
    }

    _setHistoryPage(back, totalEntries, historyPageSize) {
        const currentHistoryIndex = this.getEffectiveHistoryIndex(
            totalEntries,
            historyPageSize
        );
        const maxHistoryIndex = Math.max(
            0,
            Math.ceil(totalEntries / historyPageSize) - 1
        );
        const nextHistoryIndex = currentHistoryIndex + (back ? 1 : -1);

        this.setState({
            historyIndex: Math.max(
                0,
                Math.min(maxHistoryIndex, nextHistoryIndex)
            ),
            historyTransitionDirection: back ? 'older' : 'newer',
        });
    }

    render() {
        const {
            state: { historyPageSize: requestedHistoryPageSize },
        } = this;
        const { account_name, transfer_history, isLoading } = this.props;

        /// transfer log
        let rewards24Vests = 0;
        let rewardsWeekVests = 0;
        let totalRewardsVests = 0;
        let rewards24Blurt = 0;
        let rewardsWeekBlurt = 0;
        let totalRewardsBlurt = 0;
        const rewards24HBD = 0;
        const rewardsWeekHBD = 0;
        const totalRewardsHBD = 0;
        const oneDay = 86400 * 1000;
        const now = Moment.utc();
        const yesterday = now.clone().subtract(1, 'day');
        const lastWeek = now
            .clone()
            .subtract(REWARDS_HISTORY_DAYS, 'days');

        let firstDate, finalDate;
        let author_log = transfer_history
            .map((item, index) => {
                // Filter out rewards
                if (item[1].op[0] === 'author_reward') {
                    const timestamp = Moment.utc(item[1].timestamp);
                    const timestampMs = timestamp.valueOf();
                    const isLastWeekReward = timestamp.isSameOrAfter(lastWeek);

                    if (!finalDate) {
                        finalDate = timestampMs;
                    }
                    firstDate = timestampMs;

                    const vest = assetFloat(
                        item[1].op[1].vesting_payout,
                        VEST_TICKER
                    );
                    const blurt = assetFloat(
                        item[1].op[1].blurt_payout ||
                            item[1].op[1].steem_payout ||
                            '0.000 ' + LIQUID_TICKER,
                        LIQUID_TICKER
                    );
                    // const hbd = assetFloat(
                    //     item[1].op[1].sbd_payout,
                    //     DEBT_TICKER
                    // );

                    if (isLastWeekReward) {
                        if (timestamp.isSameOrAfter(yesterday)) {
                            rewards24Vests += vest;
                            rewards24Blurt += blurt;
                            // rewards24HBD += hbd;
                        }
                        rewardsWeekVests += vest;
                        rewardsWeekBlurt += blurt;
                        // rewardsWeekHBD += hbd;
                    }
                    totalRewardsVests += vest;
                    totalRewardsBlurt += blurt;
                    // totalRewardsHBD += hbd;

                    return {
                        isLastWeekReward,
                        row: (
                            <TransferHistoryRow
                                key={index}
                                op={item}
                                context={account_name}
                            />
                        ),
                    };
                }
                return null;
            })
            .filter((el) => !!el);

        const daysOfCuration = (firstDate - finalDate) / oneDay || 1;
        const averageCurationVests = !daysOfCuration
            ? 0
            : totalRewardsVests / daysOfCuration;
        const averageCurationBlurt = !daysOfCuration
            ? 0
            : totalRewardsBlurt / daysOfCuration;
        const averageCurationHBD = !daysOfCuration
            ? 0
            : totalRewardsHBD / daysOfCuration;
        const hasFullWeek = daysOfCuration >= 7;
        const authorLogNewestFirst = author_log
            .filter((item) => item.isLastWeekReward)
            .reverse();
        const showHistoryLoadingState = isLoading && authorLogNewestFirst.length === 0;
        const historyPageSize = Math.min(
            requestedHistoryPageSize,
            Math.max(1, authorLogNewestFirst.length)
        );
        const historyIndex = this.getEffectiveHistoryIndex(
            authorLogNewestFirst.length,
            historyPageSize
        );
        const hasMultiplePages =
            authorLogNewestFirst.length > historyPageSize;
        const hasOlderPage =
            (historyIndex + 1) * historyPageSize <
            authorLogNewestFirst.length;
        const historyTableAnimationClass = this.state
            .historyTransitionDirection
            ? ` UserWallet__history-table--slide-${this.state.historyTransitionDirection}`
            : '';

        author_log = authorLogNewestFirst
            .slice(
                historyIndex * historyPageSize,
                (historyIndex + 1) * historyPageSize
            )
            .map((item) => item.row);

        const navButtons = (
            <nav
                className="UserWallet__history-pager UserWallet__history-pager--swipe"
                ref={this.setHistoryPagerRef}
            >
                <ul className="pager">
                    <li>
                        <div
                            className={
                                'button tiny hollow float-left ' +
                                (historyIndex === 0 ? ' disabled' : '')
                            }
                            onClick={
                                historyIndex === 0
                                    ? null
                                    : this._setHistoryPage.bind(
                                          this,
                                          false,
                                          authorLogNewestFirst.length,
                                          historyPageSize
                                      )
                            }
                            aria-label="Previous"
                        >
                            <span aria-hidden="true">
                                &larr; {tt('g.newer')}
                            </span>
                        </div>
                    </li>
                    <li className="UserWallet__history-swipe-hint" aria-hidden="true">
                        <span className="UserWallet__history-swipe-hint-chevron UserWallet__history-swipe-hint-chevron--left">
                            &#8249;
                        </span>
                        <span className="UserWallet__history-swipe-hint-track" />
                        <span className="UserWallet__history-swipe-hint-chevron UserWallet__history-swipe-hint-chevron--right">
                            &#8250;
                        </span>
                    </li>
                    <li>
                        <div
                            className={
                                'button tiny hollow float-right ' +
                                (!hasOlderPage ? ' disabled' : '')
                            }
                            onClick={
                                !hasOlderPage
                                    ? null
                                    : this._setHistoryPage.bind(
                                          this,
                                          true,
                                          authorLogNewestFirst.length,
                                          historyPageSize
                                      )
                            }
                            aria-label="Next"
                        >
                            <span aria-hidden="true">
                                {tt('g.older')} &rarr;
                            </span>
                        </div>
                    </li>
                </ul>
            </nav>
        );
        return (
            <div className="UserWallet">
                <div className="UserWallet__balance UserReward__row UserWallet__rewards-summary row">
                    <div className="column small-12 medium-8 UserWallet__rewards-summary-label">
                        {tt(
                            'authorrewards_jsx.estimated_author_rewards_last_week'
                        )}
                        :
                    </div>
                    <div className="column small-12 medium-4 UserWallet__rewards-summary-total">
                        {showHistoryLoadingState ? (
                            <span>{tt('g.loading_data')}...</span>
                        ) : (
                            <span className="UserWallet__rewards-summary-values">
                                <span>
                                    {numberWithCommas(
                                        vestsToHp(
                                            this.props.state,
                                            rewardsWeekVests + ' ' + VEST_TICKER
                                        )
                                    ) +
                                        ' ' +
                                        'BP'}
                                </span>
                                <span className="UserWallet__rewards-summary-separator">
                                    &middot;
                                </span>
                                <span>
                                    {rewardsWeekBlurt.toFixed(3) +
                                        ' ' +
                                        LIQUID_TICKER}
                                </span>
                            </span>
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="column small-12">
                        <hr />
                    </div>
                </div>

                <div className="row">
                    <div className="column small-12">
                        {/** history */}
                        <h4>
                            {tt('authorrewards_jsx.author_rewards_history')}
                        </h4>
                        {showHistoryLoadingState ? (
                            <div className="UserWallet__loading-state UserWallet__loading-state--history">
                                <LoadingIndicator type="circle" />
                                <span>{tt('g.loading_data')}...</span>
                            </div>
                        ) : (
                            <div
                                className={
                                    'UserWallet__history-table-wrap' +
                                    (hasMultiplePages
                                        ? ' UserWallet__history-table-wrap--swipe'
                                        : '')
                                }
                                ref={this.setHistoryWrapRef}
                                onTouchEnd={(event) =>
                                    this.handleHistoryTouchEnd(
                                        event,
                                        authorLogNewestFirst.length,
                                        historyPageSize
                                    )
                                }
                                onTouchStart={this.handleHistoryTouchStart}
                                style={{
                                    '--wallet-history-row-count': historyPageSize,
                                }}
                            >
                                {author_log.length > 0 && (
                                    <table
                                        className={
                                            'UserWallet__history-table' +
                                            historyTableAnimationClass
                                        }
                                        key={`author-history-${historyIndex}`}
                                    >
                                        <tbody>{author_log}</tbody>
                                    </table>
                                )}
                            </div>
                        )}
                        {hasMultiplePages && navButtons}
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    // mapStateToProps
    (state, ownProps) => {
        const { account } = ownProps;
        return {
            state,
            account_name: account.name,
            transfer_history: account.transfer_history || [],
        };
    }
)(AuthorRewards);
