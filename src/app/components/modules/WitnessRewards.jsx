/* eslint react/prop-types: 0 */
import React from 'react';
import { connect } from 'react-redux';
import LoadingIndicator from 'app/components/elements/LoadingIndicator';
import { numberWithCommas, vestsToHp, assetFloat } from 'app/utils/StateFunctions';
import tt from 'counterpart';
import Moment from 'moment';
import { VEST_TICKER } from 'app/client_config';
import { REWARDS_HISTORY_DAYS } from 'app/utils/historyPageSize';

class WitnessRewards extends React.Component {
    render() {
        const { transfer_history, isLoading, state, isActiveWitness } = this.props;
        const showLoadingState = isLoading && transfer_history.length === 0;
        const pricePerBlurt = parseFloat(state.global.get('blurt_price') || 0);

        if (!isActiveWitness && !showLoadingState) {
            return null;
        }

        const lastWeek = Moment.utc().subtract(REWARDS_HISTORY_DAYS, 'days');

        const rewardsWeek = transfer_history.reduce((total, item) => {
            if (!item || !item[1] || !item[1].op) return total;
            if (item[1].op[0] !== 'producer_reward') return total;

            const timestamp = Moment.utc(item[1].timestamp);
            if (!timestamp.isSameOrAfter(lastWeek)) return total;

            return (
                total +
                assetFloat(
                    item[1].op[1].vesting_shares ||
                        item[1].op[1].vesting_payout ||
                        item[1].op[1].reward ||
                        `0.000000 ${VEST_TICKER}`,
                    VEST_TICKER
                )
            );
        }, 0);
        const rewardsWeekPower = Number(
            vestsToHp(state, `${rewardsWeek} ${VEST_TICKER}`)
        );
        const rewardsWeekUsd = rewardsWeekPower * pricePerBlurt;

        return (
            <div className="UserWallet">
                <div className="UserWallet__balance UserReward__row UserWallet__rewards-summary row">
                    <div className="column small-12 medium-8 UserWallet__rewards-summary-label">
                        {tt(
                            'witnessrewards_jsx.estimated_witness_rewards_last_week'
                        )}
                        :
                    </div>
                    <div className="column small-12 medium-4 UserWallet__rewards-summary-total">
                        {showLoadingState ? (
                            <span>{tt('g.loading_data')}...</span>
                        ) : (
                            <span className="UserWallet__rewards-summary-values">
                                <span>
                                    {numberWithCommas(rewardsWeekPower.toFixed(3))}{' '}
                                    BP
                                </span>
                                {pricePerBlurt > 0 && (
                                    <span className="UserWallet__rewards-summary-separator">
                                        &middot;
                                    </span>
                                )}
                                {pricePerBlurt > 0 && (
                                    <span>
                                        ${numberWithCommas(rewardsWeekUsd.toFixed(2))}
                                    </span>
                                )}
                            </span>
                        )}
                    </div>
                </div>

                <div className="row">
                    <div className="column small-12">
                        <hr />
                    </div>
                </div>

                {showLoadingState && (
                    <div className="row">
                        <div className="column small-12">
                            <div className="UserWallet__loading-state UserWallet__loading-state--history">
                                <LoadingIndicator type="circle" />
                                <span>{tt('g.loading_data')}...</span>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}

export default connect((state, ownProps) => {
    const { account } = ownProps;
    return {
        state,
        isActiveWitness: !!account.is_active_witness,
        transfer_history: account.transfer_history || [],
    };
})(WitnessRewards);
