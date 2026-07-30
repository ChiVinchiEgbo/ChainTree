'use client';

import React from 'react';
import Image from 'next/image';
import { LeaderboardItem } from '@/lib/types';
import { Trophy, Flame, Award, ShieldCheck } from 'lucide-react';

interface LeaderboardTableProps {
  items: LeaderboardItem[];
}

export function LeaderboardTable({ items }: LeaderboardTableProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl overflow-hidden shadow-xs">
      <div className="p-5 border-b border-[#e5e5e5] dark:border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
            <Trophy className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Solana Builder Leaderboard</h3>
            <p className="text-xs text-zinc-500">Top developers ranked by on-chain credentials & streak</p>
          </div>
        </div>
        <span className="text-xs font-mono px-3 py-1 bg-zinc-100 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
          Weekly Sprint
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#f8f8f8] dark:bg-zinc-800/50 text-zinc-500 uppercase font-mono tracking-wider border-b border-[#e5e5e5] dark:border-zinc-800">
            <tr>
              <th className="py-3 px-4">Rank</th>
              <th className="py-3 px-4">Developer</th>
              <th className="py-3 px-4">Wallet</th>
              <th className="py-3 px-4">Courses</th>
              <th className="py-3 px-4">Streak</th>
              <th className="py-3 px-4 text-right">XP Points</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5] dark:divide-zinc-800">
            {items.map((item) => {
              const isTopThree = item.rank <= 3;
              const rankColor =
                item.rank === 1
                  ? 'bg-amber-400 text-black font-bold'
                  : item.rank === 2
                  ? 'bg-zinc-300 text-black font-bold'
                  : item.rank === 3
                  ? 'bg-amber-700 text-white font-bold'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400';

              return (
                <tr key={item.uid} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center font-mono text-xs ${rankColor}`}>
                      {item.rank}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full relative overflow-hidden bg-zinc-200">
                        {item.avatar ? (
                          <Image src={item.avatar} alt={item.name} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                            {item.name[0]}
                          </div>
                        )}
                      </div>
                      <span className="font-semibold text-zinc-900 dark:text-zinc-100">{item.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-zinc-500">
                    {item.wallet}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-mono font-medium text-emerald-600 dark:text-emerald-400">
                      <Award className="w-3.5 h-3.5" />
                      {item.coursesCompleted}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center gap-1 font-mono font-medium text-amber-500">
                      <Flame className="w-3.5 h-3.5 fill-amber-500" />
                      {item.streakDays}d
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100 text-sm">
                    {item.points.toLocaleString()} XP
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
