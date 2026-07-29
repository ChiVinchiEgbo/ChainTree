import { PublicKey } from '@solana/web3.js'
import idl from './staking-idl.json'

export const PROGRAM_ID = new PublicKey(
  process.env.NEXT_PUBLIC_STAKING_PROGRAM_ID || 'BYiTyWDcTk5Be4AQkxoYQhh6TQsrZSJKuePHrfJYDNSm'
)

export const TOKEN_PROGRAM_ID = new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL')

// Default SPL Token Mint on Devnet (6 decimals)
export const DEFAULT_MINT = new PublicKey(
  process.env.NEXT_PUBLIC_STAKE_TOKEN_MINT || 'Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr' // Devnet USDC/SPL Mint
)

const VAULT_SEED = 'vault'
const VAULT_TOKEN_SEED = 'vault_token'
const STAKE_SEED = 'stake'
const REWARD_POOL_SEED = 'reward_pool'

/**
 * Derive the Associated Token Account for a user & mint
 */
export function getAssociatedTokenAddress(mint, owner) {
  const [address] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  )
  return address
}

/**
 * Derive the Staking Vault PDA
 */
export function getVaultPda(mint = DEFAULT_MINT) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_SEED), mint.toBuffer()],
    PROGRAM_ID
  )
  return { pda, bump }
}

/**
 * Derive the Vault Token Account PDA
 */
export function getVaultTokenPda(vaultPda) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(VAULT_TOKEN_SEED), vaultPda.toBuffer()],
    PROGRAM_ID
  )
  return { pda, bump }
}

/**
 * Derive the Reward Pool PDA
 */
export function getRewardPoolPda(vaultPda) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(REWARD_POOL_SEED), vaultPda.toBuffer()],
    PROGRAM_ID
  )
  return { pda, bump }
}

/**
 * Derive User's Stake Account PDA
 */
export function getStakeAccountPda(vaultPda, userPublicKey) {
  const [pda, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from(STAKE_SEED), vaultPda.toBuffer(), userPublicKey.toBuffer()],
    PROGRAM_ID
  )
  return { pda, bump }
}

/**
 * Calculate accrued linear rewards client-side (amount * time * rate)
 */
export function calculateAccruedRewards(stakedAmount, lastTimestamp, rewardsEarned = 0) {
  if (!stakedAmount || stakedAmount <= 0 || !lastTimestamp) {
    return rewardsEarned / 1_000_000
  }
  const now = Math.floor(Date.now() / 1000)
  const elapsed = Math.max(0, now - lastTimestamp)
  const ratePerSecond = 1 // 1 micro-token per token per sec
  const pendingMicroTokens = (stakedAmount * elapsed * ratePerSecond) / 1_000_000
  const totalMicro = rewardsEarned + pendingMicroTokens
  return totalMicro / 1_000_000
}

/**
 * Parse Solana / Anchor transaction error messages into human-readable text
 */
export function parseStakingError(error) {
  if (!error) return 'Transaction failed.'
  const errStr = typeof error === 'string' ? error : error.message || error.toString()

  if (errStr.includes('User rejected') || errStr.includes('User cancelled')) {
    return 'Transaction rejected in wallet.'
  }
  if (errStr.includes('0x1') || errStr.includes('Insufficient funds') || errStr.includes('insufficient lamports')) {
    return 'Insufficient SOL or SPL token balance to execute transaction.'
  }
  if (errStr.includes('ZeroAmount') || errStr.includes('6000')) {
    return 'Cannot stake or unstake zero tokens.'
  }
  if (errStr.includes('InsufficientStake') || errStr.includes('6001')) {
    return 'You cannot unstake more tokens than you currently have staked.'
  }
  if (errStr.includes('Unauthorized') || errStr.includes('6002')) {
    return 'Unauthorized action. You do not own this stake account.'
  }
  if (errStr.includes('NoRewards') || errStr.includes('6005')) {
    return 'No rewards available to claim yet.'
  }
  if (errStr.includes('429') || errStr.includes('Rate limit')) {
    return 'Solana Devnet RPC rate limit reached. Please wait a few seconds and try again.'
  }

  return errStr.slice(0, 140)
}

/**
 * Track transaction commitment levels: Processed -> Confirmed -> Finalized
 */
export async function trackCommitment(connection, signature, onCommitmentChange) {
  if (onCommitmentChange) onCommitmentChange('processed', signature)

  try {
    const latestBlockhash = await connection.getLatestBlockhash('confirmed')
    await connection.confirmTransaction(
      {
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      'confirmed'
    )
    if (onCommitmentChange) onCommitmentChange('confirmed', signature)

    // Check finalized asynchronously
    connection.confirmTransaction(
      {
        signature,
        blockhash: latestBlockhash.blockhash,
        lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
      },
      'finalized'
    ).then(() => {
      if (onCommitmentChange) onCommitmentChange('finalized', signature)
    }).catch((e) => console.warn('Finalized tracking warning:', e?.message))
  } catch (err) {
    console.error('Commitment tracking error:', err)
    throw err
  }
}
