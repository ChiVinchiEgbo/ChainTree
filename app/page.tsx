import React from 'react';
import Link from 'next/link';
import { dataSource } from '@/lib/data';
import { StatCard } from '@/components/learn/stat-card';
import { TrackCard } from '@/components/learn/track-card';
import { LeaderboardTable } from '@/components/learn/leaderboard-table';
import { QuestList } from '@/components/learn/quest-list';
import {
  Code2,
  Award,
  ShieldCheck,
  Wallet,
  Cpu,
  Users,
  Coins,
  ArrowRight,
  Sparkles,
  Layers,
  CheckCircle2,
  Flame
} from 'lucide-react';

export default async function HomePage() {
  const [courses, stats, leaderboard] = await Promise.all([
    dataSource.getCourses(),
    dataSource.getStats(),
    dataSource.getLeaderboard(),
  ]);

  return (
    <div className="space-y-12 py-2">
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-zinc-800 overflow-hidden shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-0" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl -z-0" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            100% Free Open-Source Solana Developer Platform
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-balance leading-tight">
            Build Smart Contracts on <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">Solana</span>. Earn Verifiable cNFT Credentials.
          </h1>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed text-balance">
            ChainTree bridges developer education with on-chain verification. Learn Rust, Anchor, and Web3.js through project-based bootcamps, collaborate in study groups, and mint proof-of-completion cNFT credentials directly to your Solana wallet.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/solana-bootcamp"
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <span>Join Free Solana Bootcamp</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/courses"
              className="px-6 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-colors"
            >
              Explore Course Catalog
            </Link>
            <Link
              href="/verify"
              className="px-6 py-3.5 rounded-2xl bg-transparent hover:bg-zinc-800/60 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Verify a Credential</span>
            </Link>
          </div>
        </div>

        {/* Live Platform Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 pt-8 border-t border-zinc-800/80">
          <div>
            <span className="block text-2xl font-bold font-mono text-emerald-400">{stats.totalDevelopers.toLocaleString()}</span>
            <span className="text-xs text-zinc-400">Active Developers</span>
          </div>
          <div>
            <span className="block text-2xl font-bold font-mono text-emerald-400">{stats.coursesCompleted.toLocaleString()}</span>
            <span className="text-xs text-zinc-400">Courses Completed</span>
          </div>
          <div>
            <span className="block text-2xl font-bold font-mono text-amber-400">{stats.certificatesMinted.toLocaleString()}</span>
            <span className="text-xs text-zinc-400">cNFTs Minted</span>
          </div>
          <div>
            <span className="block text-2xl font-bold font-mono text-teal-400">{stats.totalSolStaked.toLocaleString()} SOL</span>
            <span className="text-xs text-zinc-400">Total Staked</span>
          </div>
        </div>
      </section>

      {/* Core Value Propositions Bento Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Why Web3 Developers Choose ChainTree
            </h2>
            <p className="text-xs text-zinc-500">Built ground-up for Solana developers, study groups, and hiring partners</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Interactive Bootcamps</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Master Rust, Anchor, and Web3.js with step-by-step interactive syntax checkers, real codebase examples, and project milestone reviews.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">On-Chain cNFT Credentials</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Receive Metaplex Token Metadata & SPL compressed NFTs minted to your connected Solana wallet upon completing courses and bootcamps.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Public Credential Verifier</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Anyone or any recruiter can validate developer certificates instantly against Solana RPC, with direct links to Solscan and Solana Explorer.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-zinc-500/10 border border-zinc-500/20 text-zinc-700 dark:text-zinc-300 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Collaborative Study Groups</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Join active study cohorts with scheduled meetups, calendar invites, live member rosters, and dedicated Discord channels.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Token Staking Vault</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Stake TREE tokens into Anchor vaults to earn rewards, maintain learning commitment streaks, and claim devnet SOL airdrops.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-500 flex items-center justify-center">
              <Wallet className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Native Solana Wallet Adapter</h3>
            <p className="text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Seamlessly connect Phantom, Solflare, Backpack, or any Web3 wallet. Your wallet address is your developer identity.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Course Catalog Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">
              Featured Web3 Bootcamps & Courses
            </h2>
            <p className="text-xs text-zinc-500">Project-based learning tracks crafted by core Solana contributors</p>
          </div>
          <Link
            href="/courses"
            className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
          >
            View All Courses <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <TrackCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* Leaderboard & Daily Quests Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <LeaderboardTable items={leaderboard} />
        </div>
        <div>
          <QuestList />
        </div>
      </section>

      {/* Bootcamp CTA Banner */}
      <section className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-3xl p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg">
        <div className="space-y-2 text-center md:text-left">
          <span className="text-xs font-mono font-bold uppercase tracking-wider bg-black/20 px-3 py-1 rounded-full inline-block">
            Cohorts Enrolling Now
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold">Ready to become a certified Solana Engineer?</h3>
          <p className="text-emerald-100 text-xs sm:text-sm max-w-xl">
            Enroll in our 100% free Solana & Anchor Bootcamp. Build production smart contracts and receive a verified cNFT credential upon graduation.
          </p>
        </div>
        <Link
          href="/solana-bootcamp"
          className="px-6 py-3.5 rounded-2xl bg-white text-emerald-700 hover:bg-emerald-50 text-xs font-bold shrink-0 shadow-md transition-all"
        >
          Enroll in Bootcamp
        </Link>
      </section>

    </div>
  );
}
