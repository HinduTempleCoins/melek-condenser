import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router'
import TimeAgoWrapper from 'app/components/elements/TimeAgoWrapper'
import Memo from 'app/components/elements/Memo'
import { numberWithCommas, vestsToHp } from 'app/utils/StateFunctions'
import tt from 'counterpart'
import GDPRUserList from 'app/utils/GDPRUserList'

class TransferHistoryRow extends React.Component {
  render () {
    const {
      op,
      context,
      curation_reward,
      author_reward,
      benefactor_reward,
      delegated_reward,
      returned_delegation,
      powerdown_vests,
      powerdown_payment,
      reward_vests,
      socialUrl
    } = this.props
    // context -> account perspective

    const type = op[1].op[0]
    const data = op[1].op[1]

    /* All transfers involve up to 2 accounts, context and 1 other. */
    let message = ''

    const description_start = ''
    const other_account = null
    const description_end = ''
    const trxUrl = 'https://blocks.blurtwallet.com/#/tx/' + op[1].trx_id
    if (type === 'transfer_to_vesting') {
      const amount = data.amount.split(' ')[0]

      if (data.from === context) {
        if (data.to === '') {
          message = tt(
            'transferhistoryrow_jsx.transfer_to_vesting.from_self.no_to',
            { amount }
          )
          // tt('g.transfer') + amount + tt('g.to') + 'BLURT POWER';
        } else {
          message = (
            <span>
              {tt(
                'transferhistoryrow_jsx.transfer_to_vesting.from_self.to_someone',
                { amount }
              )}
              {otherAccountLink(data.to)}
            </span>
          )
          // tt('g.transfer') + amount + ' BLURT POWER' + tt('g.to');
        }
      } else if (data.to === context) {
        message = (
          <span>
            {tt(
              'transferhistoryrow_jsx.transfer_to_vesting.to_self',
              { amount }
            )}
            {otherAccountLink(data.from)}
          </span>
        )
        // tt('g.receive') + amount + ' BLURT POWER' + tt('g.from');
      } else {
        message = (
          <span>
            {tt(
              'transferhistoryrow_jsx.transfer_to_vesting.from_user_to_user',
              {
                amount,
                from: data.from
              }
            )}
            {otherAccountLink(data.to)}
          </span>
        )
        // tt('g.transfer') + amount + ' BLURT POWER' + tt('g.from') +data.from + tt('g.to');
      }
    } else if (
      /^transfer$|^transfer_to_savings$|^transfer_from_savings$/.test(
        type
      )
    ) {
      // transfer_to_savings
      const fromWhere =
                type === 'transfer_to_savings'
                  ? 'to_savings'
                  : type === 'transfer_from_savings'
                    ? 'from_savings'
                    : 'not_savings'

      if (data.from === context) {
        // Semi-bad behavior - passing `type` to translation engine -- @todo better somehow?
        // type can be to_savings, from_savings, or not_savings
        // Also we can't pass React elements (link to other account) so its order is fixed :()
        message = (
          <span>
            {tt(
              [
                'transferhistoryrow_jsx',
                'transfer',
                'from_self',
                fromWhere
              ],
              { amount: data.amount }
            )}
            {otherAccountLink(data.to)}
            {data.request_id &&
                            tt('transferhistoryrow_jsx.request_id', {
                              request_id: data.request_id
                            })}
          </span>
        )
        // tt('g.transfer') + `${fromWhere} ${data.amount}` + tt('g.to');
      } else if (data.to === context) {
        message = (
          <span>
            {tt(
              [
                'transferhistoryrow_jsx',
                'transfer',
                'to_self',
                fromWhere
              ],
              { amount: data.amount }
            )}
            {otherAccountLink(data.from)}
            {data.request_id &&
                            tt('transferhistoryrow_jsx.request_id', {
                              request_id: data.request_id
                            })}
          </span>
        )
        // tt('g.receive') + `${fromWhere} ${data.amount}` + tt('g.from');
      } else {
        // Removing the `from` link from this one -- only one user is linked anyways.
        message = (
          <span>
            {tt(
              [
                'transferhistoryrow_jsx',
                'transfer',
                'to_someone_from_someone',
                fromWhere
              ],
              {
                amount: data.amount,
                from: data.from,
                to: data.to
              }
            )}
            {data.request_id &&
                            ' ' +
                                tt('transferhistoryrow_jsx.request_id', {
                                  request_id: data.request_id
                                })}
          </span>
        )
        // tt('g.transfer') + `${fromWhere} ${data.amount}` + tt('g.from');
      }
    } else if (type === 'cancel_transfer_from_savings') {
      message = tt(
        'transferhistoryrow_jsx.cancel_transfer_from_savings',
        {
          request_id: data.request_id
        }
      )
      // `${tt('transferhistoryrow_jsx.cancel_transfer_from_savings')} (${tt('g.request')} ${data.request_id})`;
    } else if (type === 'fill_transfer_from_savings') {
      if (data.to === context) {
        message = (
          <span>
            {tt('transferhistoryrow_jsx.fill_transfer_from_savings.to_self', {
              amount: data.amount
            })}
            {otherAccountLink(data.from)}
          </span>
        )
      } else {
        message = (
          <span>
            {tt('transferhistoryrow_jsx.fill_transfer_from_savings.from_self', {
              amount: data.amount
            })}
            {otherAccountLink(data.to)}
          </span>
        )
      }
    } else if (type === 'withdraw_vesting') {
      if (data.vesting_shares === '0.000000 VESTS') {
        message = tt('transferhistoryrow_jsx.stop_power_down')
      } else {
        message = tt('transferhistoryrow_jsx.withdraw_vesting', {
          powerdown_vests
        })
      }
      // tt('transferhistoryrow_jsx.start_power_down_of') + ' ' + powerdown_vests + ' BLURT';
    } else if (type === 'fill_vesting_withdraw') {
      if (data.to_account === context) {
        message = (
          <span>
            {tt(
              data.from_account && data.from_account !== context
                ? 'transferhistoryrow_jsx.fill_vesting_withdraw.to_self_from'
                : 'transferhistoryrow_jsx.fill_vesting_withdraw.to_self',
              { amount: powerdown_payment || data.deposited }
            )}
            {data.from_account && data.from_account !== context && (
              <span>{otherAccountLink(data.from_account)}</span>
            )}
          </span>
        )
      } else {
        message = (
          <span>
            {tt('transferhistoryrow_jsx.fill_vesting_withdraw.from_self', {
              amount: powerdown_payment || data.deposited
            })}
            {data.to_account && (
              <span>{otherAccountLink(data.to_account)}</span>
            )}
          </span>
        )
      }
    } else if (type === 'delegate_vesting_shares') {
      if (data.delegator === context) {
        if (parseFloat(data.vesting_shares) === 0) {
          message = (
            <span>
              {tt('transferhistoryrow_jsx.delegate_vesting_shares.revoke')}
              {otherAccountLink(data.delegatee)}
            </span>
          )
        } else {
          message = (
            <span>
              {tt('transferhistoryrow_jsx.delegate_vesting_shares.from_self', {
                amount: delegated_reward
              })}
              {otherAccountLink(data.delegatee)}
            </span>
          )
        }
      } else if (data.delegatee === context) {
        message = (
          <span>
            {tt('transferhistoryrow_jsx.delegate_vesting_shares.to_self', {
              amount: delegated_reward
            })}
            {otherAccountLink(data.delegator)}
          </span>
        )
      } else {
        message = (
          <span>
            {tt(
              'transferhistoryrow_jsx.delegate_vesting_shares.from_user_to_user',
              {
                amount: delegated_reward,
                from: data.delegator
              }
            )}
            {otherAccountLink(data.delegatee)}
          </span>
        )
      }
    } else if (type === 'return_vesting_delegation') {
      message = tt('transferhistoryrow_jsx.return_vesting_delegation', {
        amount: returned_delegation
      })
    } else if (type === 'curation_reward') {
      message = rewardHistoryMessage(
        curation_reward,
        postLink(socialUrl, data.comment_author, data.comment_permlink)
      )
      // `${curation_reward} BLURT POWER` + tt('g.for');
    } else if (type === 'author_reward') {
      let blurt_payout = ''
      if (data.steem_payout !== '0.000 BLURT') {
        blurt_payout = ', ' + data.steem_payout
      }
      message = rewardHistoryMessage(
        author_reward,
        postLink(socialUrl, data.author, data.permlink)
      )
      // `${data.sbd_payout}${blurt_payout}, ${tt( 'g.and' )} ${author_reward} BLURT POWER ${tt('g.for')}`;
    } else if (type === 'claim_reward_balance') {
      const rewards = []
      if (parseFloat(data.reward_blurt.split(' ')[0]) > 0) {
        rewards.push(data.reward_blurt)
      }
      if (parseFloat(data.reward_vests.split(' ')[0]) > 0) {
        rewards.push(`${data.reward_vests}`)
      }

      switch (rewards.length) {
        case 3:
          message = tt(
            'transferhistoryrow_jsx.claim_reward_balance.three_rewards',
            {
              first_reward: rewards[0],
              second_reward: rewards[1],
              third_reward: rewards[2]
            }
          )
          // `${rewards[0]}, ${rewards[1]} and ${ rewards[2] }`;
          break
        case 2:
          message = tt(
            'transferhistoryrow_jsx.claim_reward_balance.two_rewards',
            { first_reward: rewards[0], second_reward: rewards[1] }
          )
          // `${rewards[0]} and ${rewards[1]}`;
          break
        case 1:
          message = tt(
            'transferhistoryrow_jsx.claim_reward_balance.one_reward',
            { reward: rewards[0] }
          )
          // `${rewards[0]}`;
          break
      }
    } else if (type === 'interest') {
      message = tt('transferhistoryrow_jsx.interest', {
        interest: data.interest
      })
      // `${tt( 'transferhistoryrow_jsx.receive_interest_of' )} ${data.interest}`;
    } else if (type === 'fill_convert_request') {
      message = tt('transferhistoryrow_jsx.fill_convert_request', {
        amount_in: data.amount_in,
        amount_out: data.amount_out
      })
      // `Fill convert request: ${data.amount_in} for ${ data.amount_out }`;
    } else if (type === 'comment_benefactor_reward') {
      message = rewardHistoryMessage(
        benefactor_reward,
        postLink(socialUrl, data.author, data.permlink)
      )
      // `${benefactor_reward} BLURT POWER for ${ data.author }/${data.permlink}`;
    } else {
      message = type.replace(/_/g, ' ')
    }
    const isRewardHistoryRow =
            type === 'curation_reward' ||
            type === 'author_reward' ||
            type === 'comment_benefactor_reward'
    const messageNode = isRewardHistoryRow
      ? message
      : <a href={trxUrl}>{message}</a>

    return (
      <tr
        key={op[0]}
        className={'Trans' + (isRewardHistoryRow ? ' Trans--reward' : '')}
      >
        <td className='TransferHistoryRow__date'>
          <TimeAgoWrapper date={op[1].timestamp} />
        </td>
        <td className='TransferHistoryRow__text'>
          {messageNode}
        </td>
        <td className='TransferHistoryRow__memo show-for-medium'>
          <Memo text={data.memo} username={context} />
        </td>
      </tr>
    )
  }
}

const otherAccountLink = (username) =>
  GDPRUserList.includes(username)
    ? (
      <span>{username}</span>
      )
    : (
      <Link to={`/@${username}`}>{username}</Link>
      )

const rewardHistoryMessage = (amount, link) => (
  <span className='TransferHistoryRow__reward-message'>
    <span className='TransferHistoryRow__reward-amount'>{amount}</span>
    <span className='TransferHistoryRow__reward-unit'>BP</span>
    <span className='TransferHistoryRow__reward-connector'>for</span>
    {link}
  </span>
)

const postLink = (socialUrl, author, permlink) => (
  <a
    className='TransferHistoryRow__post-link'
    href={`${socialUrl}/@${author}/${permlink}`}
    target='_blank'
    rel='noreferrer'
  >
    {author}/{permlink}
  </a>
)

export default connect(
  // mapStateToProps
  (state, ownProps) => {
    const op = ownProps.op
    const type = op[1].op[0]
    const data = op[1].op[1]
    const powerdown_vests =
            type === 'withdraw_vesting'
              ? numberWithCommas(vestsToHp(state, data.vesting_shares))
              : undefined
    const powerdown_payment =
            type === 'fill_vesting_withdraw'
              ? data.deposited
              : undefined
    const reward_vests =
            type === 'claim_reward_balance'
              ? numberWithCommas(vestsToHp(state, data.reward_vests))
              : undefined
    const delegated_reward =
            type === 'delegate_vesting_shares'
              ? numberWithCommas(vestsToHp(state, data.vesting_shares))
              : undefined
    const returned_delegation =
            type === 'return_vesting_delegation'
              ? numberWithCommas(vestsToHp(state, data.vesting_shares))
              : undefined
    const curation_reward =
            type === 'curation_reward'
              ? numberWithCommas(vestsToHp(state, data.reward))
              : undefined
    const author_reward =
            type === 'author_reward'
              ? numberWithCommas(vestsToHp(state, data.vesting_payout))
              : undefined
    const benefactor_reward =
            type === 'comment_benefactor_reward'
              ? numberWithCommas(
                vestsToHp(state, data.reward || data.vesting_payout)
              )
              : undefined
    const socialUrl = state.app.get('socialUrl')
    return {
      ...ownProps,
      curation_reward,
      author_reward,
      benefactor_reward,
      delegated_reward,
      returned_delegation,
      powerdown_vests,
      powerdown_payment,
      reward_vests,
      socialUrl
    }
  }
)(TransferHistoryRow)
