import React from 'react';
import Link from 'next/link';
import { dataSource } from '@/lib/data';
import { TrackCard } from '@/components/learn/track-card';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Code2,
  Award,
  Users,
  ArrowRight,
  Layers
} from 'lucide-react';

export default async function SolanaBootcampPage() {
  const course = await dataSource.getCourse('solana-anchor-fundamentals');

  return (
    <div className="space-y-10 py-2">
      {/* Hero Banner */}
      <section className="bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 text-white rounded-3xl p-8 sm:p-12 border border-zinc-800 space-y-6 relative overflow-hidden shadow-xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          100% Free • Open-Source Cohort
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-balance leading-tight max-w-3xl">
          Solana & Anchor Smart Contract Bootcamp
        </h1>

        <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed max-w-2xl">
          An intensive, project-driven developer bootcamp designed to take you from Rust basics to deploying secure Anchor programs, PDA vault architectures, and DeFi protocols on Solana Devnet.
        </p>

        <div className="flex flex-wrap items-center gap-3 pt-2">
          {course && (
            <Link
              href={`/courses/${course.id}`}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-2"
            >
              <span>Enroll in Bootcamp Free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          <Link
            href="/study-groups"
            className="px-6 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 text-xs font-bold transition-colors"
          >
            Join Study Cohort
          </Link>
        </div>
      </section>

      {/* Benefits Grid */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-2">
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-500 w-fit border border-emerald-500/20">
            <Code2 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Rust & Anchor</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">Write type-safe, performant smart contracts using Anchor Macros & PDAs.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-2">
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500 w-fit border border-amber-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Project-Based</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">Build real on-chain counters, staking vaults, and token distribution programs.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-2">
          <div className="p-2.5 rounded-2xl bg-teal-500/10 text-teal-500 w-fit border border-teal-500/20">
            <Award className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">cNFT Certificate</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">Mint an official Metaplex compressed NFT credential to your wallet on completion.</p>
        </div>

        <div className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 space-y-2">
          <div className="p-2.5 rounded-2xl bg-purple-500/10 text-purple-500 w-fit border border-purple-500/20">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Live Mentorship</h3>
          <p className="text-xs text-zinc-500 leading-relaxed">Collaborate with study cohorts, mentors, and fellow builders in Discord.</p>
        </div>
      </section>

      {/* Featured Bootcamp Track */}
      {course && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Bootcamp Primary Track</h2>
          <div className="max-w-md">
            <TrackCard course={course} />
          </div>
        </section>
      )}
    </div>
  );
}
