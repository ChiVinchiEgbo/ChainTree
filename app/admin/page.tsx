import React from 'react';
import Link from 'next/link';
import { dataSource } from '@/lib/data';
import { Plus, Users, BarChart3, Settings, ChevronRight, ShieldCheck } from 'lucide-react';

export default async function AdminHubPage() {
  const stats = await dataSource.getStats();

  return (
    <div className="space-y-8 py-2">
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex items-center justify-between">
        <div>
          <span className="px-3 py-1 font-mono font-bold text-xs rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Admin Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight mt-1">
            ChainTree Platform Management
          </h1>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/create-cohort"
          className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 hover:border-emerald-500/50 transition-colors space-y-3 group shadow-xs"
        >
          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 w-fit">
            <Plus className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-500 transition-colors">
            Create Bootcamp Cohort
          </h3>
          <p className="text-xs text-zinc-500">Launch a new scheduled developer learning cohort.</p>
        </Link>

        <Link
          href="/admin/create-group"
          className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 hover:border-emerald-500/50 transition-colors space-y-3 group shadow-xs"
        >
          <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-500 w-fit">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-amber-500 transition-colors">
            Create Study Group
          </h3>
          <p className="text-xs text-zinc-500">Set up new peer study groups with Discord integration.</p>
        </Link>

        <Link
          href="/admin/edit-group"
          className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 hover:border-emerald-500/50 transition-colors space-y-3 group shadow-xs"
        >
          <div className="p-3 rounded-2xl bg-teal-500/10 text-teal-500 w-fit">
            <Settings className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-teal-500 transition-colors">
            Manage Study Groups
          </h3>
          <p className="text-xs text-zinc-500">Edit member rosters, schedules, and group details.</p>
        </Link>

        <Link
          href="/admin/stats"
          className="p-6 rounded-3xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 hover:border-emerald-500/50 transition-colors space-y-3 group shadow-xs"
        >
          <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 w-fit">
            <BarChart3 className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 group-hover:text-purple-500 transition-colors">
            Platform Analytics
          </h3>
          <p className="text-xs text-zinc-500">View real-time user growth and cNFT mint metrics.</p>
        </Link>
      </div>
    </div>
  );
}
