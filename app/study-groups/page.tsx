import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { dataSource } from '@/lib/data';
import {
  Users,
  Calendar,
  Clock,
  Disc as Discord,
  Plus,
  ChevronRight,
  Download,
  ExternalLink
} from 'lucide-react';

export default async function StudyGroupsPage() {
  const groups = await dataSource.getStudyGroups();

  return (
    <div className="space-y-8 py-2">
      {/* Header */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold border border-emerald-500/20">
            <Users className="w-3.5 h-3.5" />
            Peer-to-Peer Developer Study Groups
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Solana Study Groups & Cohorts
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Never learn alone. Join small, focused peer study groups to debug Anchor smart contracts, review code PRs, and complete bootcamp milestones together.
          </p>
        </div>

        <Link
          href="/admin/create-group"
          className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shrink-0 transition-colors flex items-center gap-2 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Study Group</span>
        </Link>
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => {
          const formattedDate = new Date(group.scheduled_at).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          });

          // Generate iCal link
          const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:ChainTree Study Group: ${group.name}\nDESCRIPTION:${group.description}\nEND:VEVENT\nEND:VCALENDAR`;
          const icsHref = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

          return (
            <div
              key={group.id}
              className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 shadow-xs flex flex-col justify-between space-y-5 hover:border-emerald-500/50 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    Cohort Group #{group.index}
                  </span>
                  <a
                    href={group.discordUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-xl bg-[#f3f3f3] dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 hover:text-indigo-500 transition-colors"
                    title="Discord Channel"
                  >
                    <Discord className="w-4 h-4" />
                  </a>
                </div>

                <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 line-clamp-1">
                  {group.name}
                </h3>

                <p className="text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {group.description}
                </p>

                {/* Schedule */}
                <div className="p-3 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 flex items-center justify-between text-xs text-zinc-700 dark:text-zinc-300">
                  <div className="flex items-center gap-2 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{formattedDate}</span>
                  </div>
                  <a
                    href={icsHref}
                    download={`${group.slug}-schedule.ics`}
                    className="p-1 text-zinc-400 hover:text-emerald-600 transition-colors"
                    title="Add to iCal / Calendar"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* Members preview */}
                <div className="flex items-center justify-between text-xs pt-2">
                  <div className="flex items-center -space-x-2">
                    {group.members.slice(0, 4).map((member, i) => (
                      <div key={i} className="w-7 h-7 rounded-full border-2 border-white dark:border-zinc-900 overflow-hidden relative bg-zinc-300">
                        {member.avatar ? (
                          <Image src={member.avatar} alt={member.name} fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                            {member.name[0]}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <span className="font-mono text-zinc-500 font-medium">{group.members.length} Members</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center gap-2">
                <Link
                  href={`/study-groups/${group.slug}`}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold text-center transition-colors"
                >
                  View Study Group
                </Link>
                <Link
                  href={`/study-groups/details/${group.id}`}
                  className="p-2.5 rounded-xl bg-[#f3f3f3] dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 text-xs transition-colors"
                  title="Details view"
                >
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
