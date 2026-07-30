'use client';

import React from 'react';
import { Target, CheckCircle2, Circle, Flame, Award, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Quest {
  id: string;
  title: string;
  reward: string;
  progress: number; // 0 to 100
  completed: boolean;
  href: string;
}

const DEFAULT_QUESTS: Quest[] = [
  {
    id: 'q1',
    title: 'Complete 1 Anchor Smart Contract Lesson',
    reward: '+100 XP',
    progress: 100,
    completed: true,
    href: '/courses/solana-anchor-fundamentals'
  },
  {
    id: 'q2',
    title: 'Connect Solana Devnet Wallet to Staking Vault',
    reward: '+150 XP & cNFT Badge',
    progress: 50,
    completed: false,
    href: '/staking'
  },
  {
    id: 'q3',
    title: 'Join a Solana Study Group Cohort',
    reward: '+75 XP',
    progress: 0,
    completed: false,
    href: '/study-groups'
  }
];

export function QuestList() {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            <Target className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Daily Developer Quests</h3>
            <p className="text-xs text-zinc-500">Earn XP & unlock Solana credentials</p>
          </div>
        </div>
        <span className="flex items-center gap-1 font-mono text-xs text-amber-500 font-bold bg-amber-500/10 px-2.5 py-1 rounded-full">
          <Flame className="w-3.5 h-3.5 fill-amber-500" />
          3d Streak
        </span>
      </div>

      <div className="space-y-3">
        {DEFAULT_QUESTS.map((quest) => (
          <div
            key={quest.id}
            className="p-3.5 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 flex items-center justify-between gap-3 hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center gap-3 min-w-0">
              {quest.completed ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              ) : (
                <Circle className="w-5 h-5 text-zinc-300 dark:text-zinc-600 shrink-0" />
              )}
              <div className="space-y-0.5 min-w-0">
                <p className={`text-xs font-semibold ${quest.completed ? 'line-through text-zinc-400' : 'text-zinc-900 dark:text-zinc-100'} truncate`}>
                  {quest.title}
                </p>
                <span className="inline-block text-[10px] font-mono font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.2 rounded-md">
                  {quest.reward}
                </span>
              </div>
            </div>

            <Link
              href={quest.href}
              className="p-1.5 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:text-emerald-500 transition-colors shrink-0"
              title="Go to Quest"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
