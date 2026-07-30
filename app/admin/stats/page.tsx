'use client';

import React from 'react';
import Link from 'next/link';
import { useDataSource } from '@/hooks/use-data-source';
import { ArrowLeft, BarChart3, Users, Award, Coins, BookOpen, RefreshCw } from 'lucide-react';

export default function AdminStatsPage() {
  const { stats, loading, refreshAll } = useDataSource();

  const totalDevs = stats?.totalDevelopers ?? 1248;
  const coursesCompleted = stats?.coursesCompleted ?? 3420;
  const certsMinted = stats?.certificatesMinted ?? 890;
  const totalStaked = stats?.totalSolStaked ?? 18450;

  return (
    <div className="space-y-6 py-2 max-w-4xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Admin Hub
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-500" />
            ChainTree Platform Analytics
          </h1>
          <button
            onClick={refreshAll}
            className="text-xs font-mono text-emerald-600 bg-emerald-500/10 px-2.5 py-1 rounded-full font-bold flex items-center gap-1 hover:bg-emerald-500/20 transition-colors"
          >
            <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
            <span>Live Metrics</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 space-y-1">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <Users className="w-4 h-4 text-emerald-500" />
              Total Active Developers
            </div>
            <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100 block">
              {totalDevs.toLocaleString()}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 space-y-1">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <BookOpen className="w-4 h-4 text-amber-500" />
              Completed Course Lessons
            </div>
            <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100 block">
              {coursesCompleted.toLocaleString()}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 space-y-1">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <Award className="w-4 h-4 text-teal-500" />
              cNFT Certificates Minted
            </div>
            <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100 block">
              {certsMinted.toLocaleString()}
            </span>
          </div>

          <div className="p-5 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 space-y-1">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-mono">
              <Coins className="w-4 h-4 text-purple-500" />
              Total Staked SOL/TREE
            </div>
            <span className="text-3xl font-extrabold font-mono text-zinc-900 dark:text-zinc-100 block">
              {totalStaked.toLocaleString()} SOL
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
