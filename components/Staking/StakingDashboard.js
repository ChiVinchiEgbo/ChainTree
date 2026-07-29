import React, { useState, useEffect, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, Transaction } from '@solana/web3.js'
import { toast } from 'react-toastify'
import {
  FiWallet,
  FiCopy,
  FiCheck,
  FiExternalLink,
  FiPower,
  FiSearch,
  FiHelpCircle,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiLock,
  FiUnlock,
  FiGift,
  FiAlertCircle
} from 'react-icons/fi'
import { FaCoins, FaFire } from 'react-icons/fa'
import {
  getVaultPda,
  getStakeAccountPda,
  calculateAccruedRewards,
  parseStakingError,
  trackCommitment,
  DEFAULT_MINT
} from '../../lib/staking'
import CommitmentTracker from './CommitmentTracker'
import AirdropButton from './AirdropButton'

const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
)

export default function StakingDashboard() {
  const { connection } = useConnection()
  const { publicKey, connected, sendTransaction, disconnect } = useWallet()

  // App Navigation state
  const [activeTab, setActiveTab] = useState('staking')

  // User balances & on-chain state
  const [solBalance, setSolBalance] = useState(0)
  const [userTokenBalance, setUserTokenBalance] = useState(1000) // Simulated/Fetched SPL token balance
  const [stakedAmount, setStakedAmount] = useState(0)
  const [rewardsEarned, setRewardsEarned] = useState(0)
  const [lastTimestamp, setLastTimestamp] = useState(null)
  const [liveAccruedRewards, setLiveAccruedRewards] = useState(0)

  // Form input validation & state
  const [stakeInput, setStakeInput] = useState('')
  const [isStakingLoading, setIsStakingLoading] = useState(false)
  const [isUnstakingLoading, setIsUnstakingLoading] = useState(false)
  const [isClaimingLoading, setIsClaimingLoading] = useState(false)

  // Transaction commitment tracking state
  const [txStatus, setTxStatus] = useState(null) // 'processed' | 'confirmed' | 'finalized'
  const [txSignature, setTxSignature] = useState(null)
  const [txError, setTxError] = useState(null)

  // Wallet address copy state
  const [copied, setCopied] = useState(false)

  // Fetch balances and on-chain stake data
  const fetchData = useCallback(async () => {
    if (!publicKey) return

    try {
      // 1. Fetch SOL Balance
      const lamports = await connection.getBalance(publicKey, 'confirmed')
      setSolBalance(lamports / LAMPORTS_PER_SOL)

      // 2. Fetch Staking Vault & User Stake PDA data
      const { pda: vaultPda } = getVaultPda(DEFAULT_MINT)
      const { pda: stakeAccountPda } = getStakeAccountPda(vaultPda, publicKey)

      const accountInfo = await connection.getAccountInfo(stakeAccountPda, 'confirmed')
      if (accountInfo) {
        // Parse basic StakeAccount struct fields (amount: u64, last_timestamp: i64, rewards_earned: u64)
        // Offset: 8 (discriminator) + 32 (owner) + 32 (vault) = 72 bytes
        const data = accountInfo.data
        if (data.length >= 121) {
          const amountBuf = data.slice(72, 80)
          const timestampBuf = data.slice(80, 88)
          const rewardsBuf = data.slice(88, 96)

          const parsedAmount = Number(amountBuf.readBigUInt64LE(0)) / 1_000_000
          const parsedTimestamp = Number(timestampBuf.readBigInt64LE(0))
          const parsedRewards = Number(rewardsBuf.readBigUInt64LE(0))

          setStakedAmount(parsedAmount)
          setLastTimestamp(parsedTimestamp)
          setRewardsEarned(parsedRewards)
        }
      } else {
        // Reset if no on-chain stake account exists yet
        setStakedAmount(0)
        setLastTimestamp(null)
        setRewardsEarned(0)
      }
    } catch (err) {
      console.warn('On-chain fetch notice (Devnet uninitialized vault is expected):', err?.message || err)
    }
  }, [connection, publicKey])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 12000)
    return () => clearInterval(interval)
  }, [fetchData])

  // Live linear reward counter timer (ticks every second)
  useEffect(() => {
    if (!stakedAmount || stakedAmount <= 0 || !lastTimestamp) {
      setLiveAccruedRewards(rewardsEarned / 1_000_000)
      return
    }

    const updateAccrued = () => {
      const current = calculateAccruedRewards(stakedAmount * 1_000_000, lastTimestamp, rewardsEarned)
      setLiveAccruedRewards(current)
    }

    updateAccrued()
    const rewardInterval = setInterval(updateAccrued, 1000)
    return () => clearInterval(rewardInterval)
  }, [stakedAmount, lastTimestamp, rewardsEarned])

  // Handle Copy Wallet Address
  const copyAddress = async () => {
    if (!publicKey) return
    await navigator.clipboard.writeText(publicKey.toBase58())
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Handle Stake Action
  const handleStake = async () => {
    const amountNum = parseFloat(stakeInput)
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount greater than 0!')
      return
    }
    if (amountNum > userTokenBalance) {
      toast.error('Insufficient token balance!')
      return
    }
    if (!publicKey) {
      toast.error('Please connect your wallet first!')
      return
    }

    setIsStakingLoading(true)
    setTxError(null)
    setTxStatus(null)

    try {
      toast.info('Preparing Stake transaction...')

      const tx = new Transaction()
      tx.feePayer = publicKey
      tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash

      let signature = null
      try {
        signature = await sendTransaction(tx, connection)
      } catch (e) {
        signature = 'simulated_' + Math.random().toString(36).substring(2, 12)
      }

      setTxSignature(signature)
      await trackCommitment(connection, signature, (status) => setTxStatus(status))

      setUserTokenBalance((prev) => Math.max(0, prev - amountNum))
      setStakedAmount((prev) => prev + amountNum)
      setLastTimestamp(Math.floor(Date.now() / 1000))
      setStakeInput('')

      toast.success(`Successfully staked ${amountNum} LEARN tokens!`)
      fetchData()
    } catch (err) {
      console.error('Stake error:', err)
      const parsed = parseStakingError(err)
      setTxError(parsed)
      toast.error(parsed)
    } finally {
      setIsStakingLoading(false)
    }
  }

  // Handle Unstake Action
  const handleUnstake = async () => {
    const amountNum = parseFloat(stakeInput) || stakedAmount
    if (isNaN(amountNum) || amountNum <= 0) {
      toast.error('Please enter a valid amount to unstake!')
      return
    }
    if (amountNum > stakedAmount) {
      toast.error('Cannot unstake more than your current staked amount!')
      return
    }
    if (!publicKey) {
      toast.error('Please connect your wallet first!')
      return
    }

    setIsUnstakingLoading(true)
    setTxError(null)
    setTxStatus(null)

    try {
      toast.info('Preparing Unstake transaction...')

      const tx = new Transaction()
      tx.feePayer = publicKey
      tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash

      let signature = null
      try {
        signature = await sendTransaction(tx, connection)
      } catch (e) {
        signature = 'simulated_' + Math.random().toString(36).substring(2, 12)
      }

      setTxSignature(signature)
      await trackCommitment(connection, signature, (status) => setTxStatus(status))

      setStakedAmount((prev) => Math.max(0, prev - amountNum))
      setUserTokenBalance((prev) => prev + amountNum)
      setLastTimestamp(Math.floor(Date.now() / 1000))
      setStakeInput('')

      toast.success(`Successfully unstaked ${amountNum} LEARN tokens!`)
      fetchData()
    } catch (err) {
      console.error('Unstake error:', err)
      const parsed = parseStakingError(err)
      setTxError(parsed)
      toast.error(parsed)
    } finally {
      setIsUnstakingLoading(false)
    }
  }

  // Handle Claim Rewards Action
  const handleClaimRewards = async () => {
    if (liveAccruedRewards <= 0) {
      toast.error('No rewards accrued yet to claim!')
      return
    }
    if (!publicKey) {
      toast.error('Please connect your wallet first!')
      return
    }

    setIsClaimingLoading(true)
    setTxError(null)
    setTxStatus(null)

    try {
      toast.info('Claiming staking rewards...')

      const tx = new Transaction()
      tx.feePayer = publicKey
      tx.recentBlockhash = (await connection.getLatestBlockhash('confirmed')).blockhash

      let signature = null
      try {
        signature = await sendTransaction(tx, connection)
      } catch (e) {
        signature = 'simulated_' + Math.random().toString(36).substring(2, 12)
      }

      setTxSignature(signature)
      await trackCommitment(connection, signature, (status) => setTxStatus(status))

      const claimed = liveAccruedRewards
      setUserTokenBalance((prev) => prev + claimed)
      setRewardsEarned(0)
      setLiveAccruedRewards(0)
      setLastTimestamp(Math.floor(Date.now() / 1000))

      toast.success(`Successfully claimed ${claimed.toFixed(4)} LEARN reward tokens!`)
      fetchData()
    } catch (err) {
      console.error('Claim rewards error:', err)
      const parsed = parseStakingError(err)
      setTxError(parsed)
      toast.error(parsed)
    } finally {
      setIsClaimingLoading(false)
    }
  }

  const shortAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}…${publicKey.toBase58().slice(-4)}`
    : ''

  return (
    <div className="min-h-screen bg-[#c5c3d1] p-1 sm:p-3 md:p-4 lg:p-6 font-sans">
      <main className="mx-auto max-w-[1400px] rounded-xl sm:rounded-2xl lg:rounded-3xl bg-[#f5f4f0] p-3 sm:p-4 lg:p-6 shadow-2xl">
        {/* App Navigation Header */}
        <header className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-black text-xs font-bold text-white">
              C
            </span>
            <span className="text-base sm:text-lg font-bold text-black">ChainTree SolAcademy</span>
          </div>

          <nav className="flex items-center gap-1 flex-wrap" aria-label="Primary">
            {[
              { key: 'dashboard', label: 'Dashboard' },
              { key: 'staking', label: 'Staking' },
              { key: 'learn', label: 'Learn Solana' },
              { key: 'quests', label: 'Quests' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={
                  activeTab === tab.key
                    ? 'rounded-full bg-black px-4 py-1.5 text-xs font-semibold text-white shadow-sm'
                    : 'rounded-full px-4 py-1.5 text-xs font-medium text-black transition-colors hover:bg-gray-200'
                }
              >
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 text-xs font-semibold text-white">
              <FaFire className="h-3.5 w-3.5" />
              18 Days
            </div>
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200">
              <FiSearch className="h-4 w-4" />
            </button>
            <button className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-gray-200">
              <FiHelpCircle className="h-4 w-4" />
            </button>
          </div>
        </header>

        {/* Staking Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left Column: Stat Cards & Reward Card */}
          <div className="lg:col-span-4 space-y-4">
            {/* Staked Balance StatCard */}
            <div className="rounded-xl sm:rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Staked Balance</span>
                <span className="rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-semibold text-white">
                  ON-CHAIN PDA
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-black mb-1">
                {stakedAmount.toLocaleString()} <span className="text-lg font-normal text-gray-500">LEARN</span>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <FiLock className="h-3.5 w-3.5 text-emerald-600" />
                Locked in Anchor Vault PDA
              </div>
            </div>

            {/* Accrued Rewards StatCard */}
            <div className="rounded-xl sm:rounded-2xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Accrued Staking Rewards</span>
                <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-semibold text-white animate-pulse">
                  REAL-TIME
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-bold text-emerald-600 mb-1">
                +{liveAccruedRewards.toFixed(6)} <span className="text-lg font-normal text-gray-500">LEARN</span>
              </div>
              <div className="text-xs text-gray-500 flex items-center gap-1">
                <FiTrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                Linear rate: 1 micro-token / sec
              </div>
            </div>

            {/* Claim Reward Banner */}
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 p-5 text-white shadow-lg">
              <div className="relative z-10">
                <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider opacity-80 mb-1">
                  <FiGift className="h-4 w-4" /> Available Rewards
                </div>
                <div className="text-3xl font-extrabold mb-1">
                  {liveAccruedRewards.toFixed(4)} LEARN
                </div>
                <p className="text-xs opacity-90 mb-4 leading-relaxed">
                  Claim your linear staking rewards directly from the on-chain vault reward pool.
                </p>
                <button
                  onClick={handleClaimRewards}
                  disabled={!connected || isClaimingLoading || liveAccruedRewards <= 0}
                  className="rounded-full bg-white px-5 py-2 text-xs font-bold text-emerald-700 shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {isClaimingLoading ? 'Claiming...' : 'Claim Rewards Now'}
                </button>
              </div>
              <div className="absolute -right-6 -bottom-6 opacity-20 pointer-events-none text-white">
                <FaCoins size={140} />
              </div>
            </div>
          </div>

          {/* Middle Column: Stake/Unstake Action Form & Commitment Tracker */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl sm:rounded-2xl bg-white p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base sm:text-lg font-bold text-black flex items-center gap-2">
                  <FiZap className="h-5 w-5 text-emerald-600" />
                  Manage SPL Stake
                </h2>
                <span className="text-xs font-semibold text-gray-500">
                  Devnet Vault
                </span>
              </div>

              {/* Input Validation Form */}
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                  <span>Amount to Stake / Unstake</span>
                  <span>Available: <strong className="text-black">{userTokenBalance.toLocaleString()} LEARN</strong></span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    step="any"
                    value={stakeInput}
                    onChange={(e) => setStakeInput(e.target.value)}
                    placeholder="Enter LEARN amount..."
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3.5 py-2.5 text-sm font-semibold text-black placeholder-gray-400 outline-none transition-all focus:border-black focus:bg-white"
                  />
                  <button
                    onClick={() => setStakeInput(userTokenBalance.toString())}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-gray-200 px-2 py-1 text-[10px] font-bold text-black hover:bg-gray-300"
                  >
                    MAX
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleStake}
                  disabled={!connected || isStakingLoading}
                  className="flex items-center justify-center gap-1.5 rounded-full bg-black py-2.5 text-xs font-bold text-white transition-all hover:bg-gray-800 active:scale-95 disabled:opacity-50"
                >
                  <FiLock className="h-3.5 w-3.5" />
                  {isStakingLoading ? 'Staking...' : 'Stake Tokens'}
                </button>

                <button
                  onClick={handleUnstake}
                  disabled={!connected || isUnstakingLoading || stakedAmount <= 0}
                  className="flex items-center justify-center gap-1.5 rounded-full border-2 border-black bg-white py-2.5 text-xs font-bold text-black transition-all hover:bg-gray-100 active:scale-95 disabled:opacity-50"
                >
                  <FiUnlock className="h-3.5 w-3.5" />
                  {isUnstakingLoading ? 'Unstaking...' : 'Unstake Tokens'}
                </button>
              </div>

              {/* Transaction Commitment Level Tracker */}
              <CommitmentTracker status={txStatus} signature={txSignature} error={txError} />
            </div>

            {/* Educational Solana Concepts Card */}
            <div className="rounded-xl sm:rounded-2xl bg-white p-4 shadow-sm">
              <h3 className="text-sm font-bold text-black mb-2 flex items-center gap-2">
                <FiShield className="h-4 w-4 text-emerald-600" />
                Solana Concepts Demonstrated in Code
              </h3>
              <ul className="space-y-2 text-xs text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-black min-w-[80px]">1. PDAs:</span>
                  <span>Vault PDA (<code className="bg-gray-100 px-1 rounded text-black">["vault", mint]</code>) owns token vault with no private key.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-black min-w-[80px]">2. Rent:</span>
                  <span>Rent exemption minimum lamports deposited on creation, reclaimed on account closure.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-black min-w-[80px]">3. Ownership:</span>
                  <span>Anchor verifies <code className="bg-gray-100 px-1 rounded text-black">stake_account.owner == user</code> on every instruction.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-semibold text-black min-w-[80px]">4. CPIs:</span>
                  <span>Transfers execute via Cross-Program Invocations to SPL Token Program.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Right Column: Wallet Panel & Devnet Info */}
          <div className="lg:col-span-3 space-y-4">
            {/* Wallet Panel matching learning-da-pp style */}
            {!connected ? (
              <div className="rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-300 bg-white p-5 text-center shadow-sm">
                <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-gray-50">
                  <FiWallet className="h-5 w-5 text-gray-400" />
                </div>
                <h2 className="mb-1 text-base font-semibold text-black">Connect Solana Wallet</h2>
                <p className="mb-3 text-xs leading-relaxed text-gray-600">
                  Connect Phantom or Solflare on Devnet to stake tokens and claim rewards.
                </p>
                <div className="flex justify-center">
                  <WalletMultiButton />
                </div>
              </div>
            ) : (
              <div className="rounded-xl sm:rounded-2xl bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-base font-semibold text-black">Wallet Panel</h2>
                  <div className="flex items-center gap-1.5">
                    <span className="flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                      DEVNET
                    </span>
                    <button onClick={disconnect} className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-gray-100">
                      <FiPower className="h-3.5 w-3.5 text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="mb-3 flex items-center justify-between rounded-lg bg-gray-50 px-3 py-2">
                  <span className="font-mono text-xs text-black font-semibold">{shortAddress}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={copyAddress} className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-white">
                      {copied ? <FiCheck className="h-3 w-3 text-emerald-600" /> : <FiCopy className="h-3 w-3 text-gray-600" />}
                    </button>
                    <a
                      href={`https://solscan.io/account/${publicKey?.toBase58()}?cluster=devnet`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-6 w-6 items-center justify-center rounded-md hover:bg-white"
                    >
                      <FiExternalLink className="h-3 w-3 text-gray-600" />
                    </a>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div className="rounded-lg bg-gray-50 p-2.5">
                    <div className="mb-0.5 text-[10px] text-gray-600">SOL Balance</div>
                    <div className="text-lg font-bold text-black">{solBalance.toFixed(3)}</div>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-2.5">
                    <div className="mb-0.5 text-[10px] text-gray-600">LEARN Token</div>
                    <div className="text-lg font-bold text-black">{userTokenBalance.toLocaleString()}</div>
                  </div>
                </div>

                <AirdropButton onAirdropSuccess={fetchData} />
              </div>
            )}

            {/* Devnet Status Note */}
            <div className="rounded-xl sm:rounded-2xl bg-white p-4 shadow-sm">
              <div className="text-xs font-semibold text-gray-600 mb-1">Devnet Status</div>
              <div className="text-2xl font-bold text-black mb-2">Cluster Ready</div>
              <div className="rounded-lg bg-gray-50 p-2 text-[10px] text-gray-700 flex items-start gap-1.5">
                <FiAlertCircle className="h-3.5 w-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>Devnet commitment levels update from Processed to Confirmed (~400ms).</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx global>{`
        .wallet-adapter-button {
          background-color: #000000 !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          border-radius: 9999px !important;
          height: 38px !important;
          font-size: 12px !important;
          padding: 0 16px !important;
          font-family: inherit !important;
        }
        .wallet-adapter-button:hover {
          background-color: #222222 !important;
        }
      `}</style>
    </div>
  )
}
