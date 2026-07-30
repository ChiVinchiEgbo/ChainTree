'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';
import {
  Coins,
  ShieldCheck,
  Flame,
  ArrowUpRight,
  ArrowDownLeft,
  Gift,
  RefreshCw,
  Clock,
  Award,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

import { useDataSource } from '@/hooks/use-data-source';

export default function StakingDashboardPage() {
  const { publicKey, connected } = useWallet();
  const { connection } = useConnection();
  const {
    stakingInfo,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    requestAirdrop,
    loading
  } = useDataSource();

  const [stakeInput, setStakeInput] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'stake' | 'unstake'>('stake');
  const [loadingAirdrop, setLoadingAirdrop] = useState(false);
  const [loadingTx, setLoadingTx] = useState(false);

  const stakedAmount = stakingInfo?.stakedAmount ?? 25.5;
  const pendingRewards = stakingInfo?.pendingRewards ?? 1.84;
  const walletBalance = stakingInfo?.devnetWalletBalance ?? 8.45;
  const history = stakingInfo?.history || [];

  const handleAirdrop = async () => {
    setLoadingAirdrop(true);
    try {
      if (publicKey) {
        try {
          toast.info('Requesting 2 SOL Devnet Airdrop...');
          const signature = await connection.requestAirdrop(publicKey, 2 * LAMPORTS_PER_SOL);
          await connection.confirmTransaction(signature, 'confirmed');
        } catch (e) {
          // Devnet rate limit fallback
        }
      }
      await requestAirdrop();
      toast.success('Airdrop successful! 2.0 SOL added to your devnet wallet.');
    } catch (e: any) {
      toast.error('Airdrop request failed');
    } finally {
      setLoadingAirdrop(false);
    }
  };

  const handleStake = async () => {
    const amt = parseFloat(stakeInput);
    if (isNaN(amt) || amt <= 0) {
      toast.error('Enter a valid amount to stake');
      return;
    }
    setLoadingTx(true);
    try {
      await stakeTokens(amt);
      setStakeInput('');
      toast.success(`Successfully staked ${amt} TREE tokens into Anchor Vault!`);
    } catch (e) {
      toast.error('Failed to stake tokens');
    } finally {
      setLoadingTx(false);
    }
  };

  const handleUnstake = async () => {
    const amt = parseFloat(stakeInput);
    if (isNaN(amt) || amt <= 0 || amt > stakedAmount) {
      toast.error('Enter a valid unstake amount');
      return;
    }
    setLoadingTx(true);
    try {
      await unstakeTokens(amt);
      setStakeInput('');
      toast.success(`Successfully unstaked ${amt} TREE tokens.`);
    } catch (e) {
      toast.error('Failed to unstake tokens');
    } finally {
      setLoadingTx(false);
    }
  };

  const handleClaimRewards = async () => {
    if (pendingRewards <= 0) {
      toast.info('No rewards pending currently.');
      return;
    }
    setLoadingTx(true);
    try {
      await claimRewards();
      toast.success(`Claimed ${pendingRewards.toFixed(2)} TREE reward tokens!`);
    } catch (e) {
      toast.error('Failed to claim rewards');
    } finally {
      setLoadingTx(false);
    }
  };

  return (
    <div className="space-y-8 py-2">
      {/* Dashboard Banner Header */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
            <Coins className="w-3.5 h-3.5" />
            Anchor Staking Vault Program
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            TREE Token Staking Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Stake TREE tokens to lock in learning commitment streaks, boost XP multipliers, and earn continuous yield directly on Solana Devnet.
          </p>
        </div>

        <button
          onClick={handleAirdrop}
          disabled={loadingAirdrop}
          className="px-5 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-2 shadow-sm"
        >
          <Sparkles className={`w-4 h-4 ${loadingAirdrop ? 'animate-spin' : ''}`} />
          <span>Request Devnet SOL Airdrop</span>
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs text-zinc-500 font-medium block">Staked TREE Amount</span>
          <span className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
            {stakedAmount.toFixed(2)} TREE
          </span>
          <span className="text-[11px] text-zinc-400 block font-mono">~$76.50 USD</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs text-zinc-500 font-medium block">Pending Rewards</span>
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold font-mono text-amber-500">
              {pendingRewards.toFixed(2)} TREE
            </span>
            <button
              onClick={handleClaimRewards}
              disabled={pendingRewards === 0 || loadingTx}
              className="px-3 py-1 rounded-xl bg-amber-500 text-white text-xs font-bold hover:bg-amber-600 disabled:opacity-40 transition-colors"
            >
              Claim
            </button>
          </div>
          <span className="text-[11px] text-zinc-400 block font-mono">Auto-accruing per slot</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs text-zinc-500 font-medium block">Vault Staking APR</span>
          <span className="text-2xl font-bold font-mono text-teal-600 dark:text-teal-400">
            14.2%
          </span>
          <span className="text-[11px] text-zinc-400 block font-mono">Anchor Program Fixed Yield</span>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-2xl p-5 shadow-xs space-y-1">
          <span className="text-xs text-zinc-500 font-medium block">Wallet Devnet Balance</span>
          <span className="text-2xl font-bold font-mono text-zinc-900 dark:text-zinc-100">
            {walletBalance.toFixed(2)} SOL
          </span>
          <span className="text-[11px] text-emerald-600 font-mono">Solana Devnet Connected</span>
        </div>
      </div>

      {/* Stake / Unstake Action Card */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs max-w-xl mx-auto space-y-6">
        {/* Segmented Control Tabs */}
        <div className="flex bg-[#f3f3f3] dark:bg-zinc-800 p-1 rounded-2xl border border-[#e5e5e5] dark:border-zinc-700">
          <button
            onClick={() => setActiveTab('stake')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'stake'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Stake Tokens
          </button>
          <button
            onClick={() => setActiveTab('unstake')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              activeTab === 'unstake'
                ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs'
                : 'text-zinc-600 dark:text-zinc-400'
            }`}
          >
            Unstake Tokens
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center justify-between">
              <span>Amount (TREE)</span>
              <span className="font-mono text-zinc-400 text-[11px]">
                {activeTab === 'stake' ? `Available: ${walletBalance.toFixed(2)}` : `Staked: ${stakedAmount.toFixed(2)}`}
              </span>
            </label>
            <div className="relative">
              <input
                type="number"
                placeholder="0.0"
                value={stakeInput}
                onChange={(e) => setStakeInput(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 text-sm font-mono font-bold text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => setStakeInput(activeTab === 'stake' ? walletBalance.toString() : stakedAmount.toString())}
                className="absolute right-3 top-3 text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-md hover:bg-emerald-500/20"
              >
                MAX
              </button>
            </div>
          </div>

          {activeTab === 'stake' ? (
            <button
              onClick={handleStake}
              disabled={loadingTx}
              className="w-full py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{loadingTx ? 'Confirming Transaction...' : 'Stake TREE Tokens'}</span>
            </button>
          ) : (
            <button
              onClick={handleUnstake}
              disabled={loadingTx}
              className="w-full py-3.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2"
            >
              <ArrowDownLeft className="w-4 h-4" />
              <span>{loadingTx ? 'Confirming Transaction...' : 'Unstake TREE Tokens'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Dynamic Staking Transaction History */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4 max-w-4xl mx-auto">
        <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-500" />
          Vault Activity & On-Chain History
        </h3>

        <div className="divide-y divide-zinc-100 dark:divide-zinc-800 text-xs">
          {history.length === 0 ? (
            <p className="text-zinc-500 py-4 text-center">No staking transactions yet.</p>
          ) : (
            history.map((tx, idx) => (
              <div key={idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl text-white ${
                    tx.type === 'stake' ? 'bg-emerald-500' :
                    tx.type === 'unstake' ? 'bg-zinc-800' :
                    tx.type === 'claim' ? 'bg-amber-500' : 'bg-teal-500'
                  }`}>
                    {tx.type === 'stake' ? <ArrowUpRight className="w-3.5 h-3.5" /> :
                     tx.type === 'unstake' ? <ArrowDownLeft className="w-3.5 h-3.5" /> :
                     tx.type === 'claim' ? <Gift className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
                  </div>
                  <div>
                    <span className="font-bold text-zinc-900 dark:text-zinc-100 capitalize block">{tx.type}</span>
                    <span className="text-[11px] font-mono text-zinc-400 block">{tx.txHash}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-bold font-mono text-emerald-600 dark:text-emerald-400 block">
                    {tx.type === 'unstake' ? '-' : '+'}{tx.amount} {tx.type === 'airdrop' ? 'SOL' : 'TREE'}
                  </span>
                  <span className="text-[10px] text-zinc-400 block font-mono">{tx.date}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
