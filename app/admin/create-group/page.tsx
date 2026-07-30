'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { dataSource } from '@/lib/data';
import { toast } from 'sonner';

export default function CreateGroupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [discordUrl, setDiscordUrl] = useState('');
  const [scheduledAt, setScheduledAt] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      toast.error('Please complete group name and description');
      return;
    }

    await dataSource.createStudyGroup({
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description,
      discordUrl: discordUrl || 'https://discord.gg/chaintree',
      scheduled_at: scheduledAt || new Date().toISOString(),
      courseId: 'solana-anchor-fundamentals',
      members: []
    });

    toast.success(`Study Group "${name}" created!`);
    router.push('/study-groups');
  };

  return (
    <div className="space-y-6 py-2 max-w-xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Admin Hub
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100">Create New Study Group</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 dark:text-zinc-300">Group Name</label>
            <input
              type="text"
              placeholder="e.g. Anchor PDA Security Guild"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="space-y-1">
            <label className="font-semibold text-zinc-700 dark:text-zinc-300">Description</label>
            <textarea
              rows={3}
              placeholder="Describe group goals, meetup topics, and target experience level..."
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Discord Channel URL</label>
              <input
                type="text"
                placeholder="https://discord.gg/..."
                value={discordUrl}
                onChange={e => setDiscordUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-zinc-700 dark:text-zinc-300">Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={scheduledAt}
                onChange={e => setScheduledAt(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Publish Study Group</span>
          </button>
        </form>
      </div>
    </div>
  );
}
