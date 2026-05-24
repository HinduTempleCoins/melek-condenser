import React from 'react'
import classnames from 'classnames'

const getAccountData = (account) =>
  account && typeof account.toJS === 'function' ? account.toJS() : account

const calculateVotingPower = (
  account,
  BLURT_VOTING_MANA_REGENERATION_SECONDS = 432000
) => {
  const currentAccount = getAccountData(account)
  if (
    !currentAccount ||
    !currentAccount.voting_manabar ||
    !BLURT_VOTING_MANA_REGENERATION_SECONDS
  ) {
    return 0
  }

  const current_mana = parseInt(
    currentAccount.voting_manabar.current_mana || 0,
    10
  )
  const last_update_time = currentAccount.voting_manabar.last_update_time || 0
  const vesting_shares = Number(
    (currentAccount.vesting_shares || '0.000000 VESTS').split(' ')[0]
  )
  const delegated_vesting_shares = Number(
    (currentAccount.delegated_vesting_shares || '0.000000 VESTS').split(' ')[0]
  )
  const received_vesting_shares = Number(
    (currentAccount.received_vesting_shares || '0.000000 VESTS').split(' ')[0]
  )
  const vesting_withdraw_rate = Number(
    (currentAccount.vesting_withdraw_rate || '0.000000 VESTS').split(' ')[0]
  )

  const net_vesting_shares =
    vesting_shares - delegated_vesting_shares + received_vesting_shares
  const maxMana =
    (net_vesting_shares - vesting_withdraw_rate) * 1000000

  if (maxMana <= 0) {
    return 0
  }

  const now = Math.round(Date.now() / 1000)
  const elapsed = now - last_update_time
  const regenerated_mana =
    (elapsed * maxMana) / BLURT_VOTING_MANA_REGENERATION_SECONDS

  let currentMana = current_mana + regenerated_mana
  if (currentMana >= maxMana) {
    currentMana = maxMana
  }

  return (currentMana * 100) / maxMana
}

const votingPowerPoint = (centerX, centerY, radius, angle) => {
  const radians = (angle * Math.PI) / 180

  return {
    x: centerX + radius * Math.sin(radians),
    y: centerY - radius * Math.cos(radians)
  }
}

const votingPowerArc = (centerX, centerY, radius, startAngle, endAngle) => {
  const start = votingPowerPoint(centerX, centerY, radius, startAngle)
  const end = votingPowerPoint(centerX, centerY, radius, endAngle)
  const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0

  return [
    'M', start.x, start.y,
    'A', radius, radius, 0, largeArcFlag, 1, end.x, end.y
  ].join(' ')
}

export default function VotingPowerIndicator ({
  account,
  BLURT_VOTING_MANA_REGENERATION_SECONDS
}) {
  const currentVotingPowerValue = Math.max(
    0,
    Math.min(
      100,
      Number(
        calculateVotingPower(
          account,
          BLURT_VOTING_MANA_REGENERATION_SECONDS
        )
      ) || 0
    )
  )

  const currentVotingPowerLabel = `${currentVotingPowerValue.toFixed(0)}%`
  const votingPowerAngle = currentVotingPowerValue * 3.6
  const votingPowerRadius = 42
  const votingPowerAvailableArc =
    currentVotingPowerValue >= 99.95
      ? null
      : currentVotingPowerValue > 0
        ? votingPowerArc(50, 50, votingPowerRadius, 0, votingPowerAngle)
        : null
  const votingPowerConsumedArc =
    currentVotingPowerValue <= 0.05
      ? null
      : currentVotingPowerValue < 99.95
        ? votingPowerArc(
          50,
          50,
          votingPowerRadius,
          votingPowerAngle,
          359.999
        )
        : null

  const votingPowerClassName = classnames('Header__voting-power', {
    'Header__voting-power--high': currentVotingPowerValue >= 70,
    'Header__voting-power--medium':
      currentVotingPowerValue >= 45 && currentVotingPowerValue < 70,
    'Header__voting-power--low': currentVotingPowerValue < 45
  })

  return (
    <span
      className={votingPowerClassName}
      title={`VP: ${currentVotingPowerLabel}`}
      aria-label={`VP: ${currentVotingPowerLabel}`}
    >
      <svg
        className='Header__voting-power-ring'
        viewBox='0 0 100 100'
        aria-hidden='true'
      >
        <circle
          className='Header__voting-power-track'
          cx='50'
          cy='50'
          r={votingPowerRadius}
        />
        {votingPowerConsumedArc && (
          <path
            className='Header__voting-power-consumed'
            d={votingPowerConsumedArc}
          />
        )}
        {currentVotingPowerValue >= 99.95 && (
          <circle
            className='Header__voting-power-progress'
            cx='50'
            cy='50'
            r={votingPowerRadius}
          />
        )}
        {votingPowerAvailableArc && (
          <path
            className='Header__voting-power-progress'
            d={votingPowerAvailableArc}
          />
        )}
      </svg>
      <span className='Header__voting-power-inner'>
        <span className='Header__voting-power-bolt'>⚡</span>
        <span className='Header__voting-power-value'>
          {currentVotingPowerLabel}
        </span>
      </span>
    </span>
  )
}
