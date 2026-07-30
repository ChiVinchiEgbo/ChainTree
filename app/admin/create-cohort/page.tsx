'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function CreateCohortPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState('');
  const [capacity, setCapacity] = useState('50');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !startDate) {
      toast.error('Please enter title and start date');
      return;
    }
    toast.success(`Cohort "${title}" created successfully!`);
    router.push('/admin');
  };

  return (
    <div className="space-y-6 py-2 max-w-xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Admin Hub
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Create New Bootcamp Cohort</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 dark:text-zinc-300">Cohort Name</label>
            <input
              type="text"
              placeholder="e.g. Solana Summer Cohort #4"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={e => setStartDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Student Capacity</label>
              <input
                type="number"
                value={capacity}
                onChange={e => setCapacity(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Launch Cohort</span>
          </button>
        </form>
      </div>
    </div>
  );
}
