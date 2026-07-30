'use client';

import React from 'react';
import Link from 'next/link';
import { useDataSource } from '@/hooks/use-data-source';
import { ArrowLeft, Settings, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

export default function EditGroupPage() {
  const { studyGroups, deleteStudyGroup, loading } = useDataSource();

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      await deleteStudyGroup(id);
      toast.success(`Deleted study group "${name}"`);
    }
  };

  return (
    <div className="space-y-6 py-2 max-w-3xl mx-auto">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Admin Hub
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <h1 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-500" />
          Manage Existing Study Groups
        </h1>

        {loading ? (
          <div className="text-xs text-zinc-500 font-mono py-4 text-center">Loading study groups...</div>
        ) : studyGroups.length === 0 ? (
          <p className="text-xs text-zinc-500 py-4 text-center">No study groups currently available.</p>
        ) : (
          <div className="space-y-3">
            {studyGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 flex items-center justify-between gap-4 text-xs"
              >
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{group.name}</h4>
                  <p className="text-zinc-500 line-clamp-1">{group.description}</p>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1 block">
                    {group.members.length} Members registered
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <Link
                    href={`/study-groups/${group.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 font-semibold"
                  >
                    View
                  </Link>
                  <button
                    onClick={() => handleDelete(group.id, group.name)}
                    className="p-1.5 rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 transition-colors"
                    title="Delete study group"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
