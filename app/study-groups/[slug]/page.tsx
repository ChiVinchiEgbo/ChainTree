import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { dataSource } from '@/lib/data';
import {
  Users,
  Calendar,
  Clock,
  Disc as Discord,
  ArrowLeft,
  UserPlus,
  ShieldCheck,
  Download,
  ExternalLink
} from 'lucide-react';

interface GroupDetailProps {
  params: Promise<{ slug: string }>;
}

export default async function StudyGroupDetailPage({ params }: GroupDetailProps) {
  const { slug } = await params;
  const group = await dataSource.getStudyGroup(slug);

  if (!group) notFound();

  const formattedDate = new Date(group.scheduled_at).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const icsContent = `BEGIN:VCALENDAR\nVERSION:2.0\nBEGIN:VEVENT\nSUMMARY:ChainTree Study Group: ${group.name}\nDESCRIPTION:${group.description}\nEND:VEVENT\nEND:VCALENDAR`;
  const icsHref = `data:text/calendar;charset=utf8,${encodeURIComponent(icsContent)}`;

  return (
    <div className="space-y-8 py-2 max-w-4xl mx-auto">
      <Link href="/study-groups" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Study Groups
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="px-3 py-1 font-mono font-bold text-xs rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Active Cohort Group
          </span>
          <a
            href={group.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold"
          >
            <Discord className="w-3.5 h-3.5" />
            <span>Join Discord Channel</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {group.name}
        </h1>

        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
          {group.description}
        </p>

        {/* Schedule Box */}
        <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-mono text-zinc-400 uppercase block">Next Live Meetup</span>
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">{formattedDate}</span>
            </div>
          </div>

          <a
            href={icsHref}
            download={`${group.slug}-schedule.ics`}
            className="px-4 py-2 rounded-xl bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 text-xs font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5 hover:bg-zinc-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Add to Calendar (.ics)</span>
          </a>
        </div>

        {/* Member Roster */}
        <div className="space-y-3 pt-4 border-t border-[#e5e5e5] dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-500" />
              Group Member Roster ({group.members.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {group.members.map((member, i) => (
              <div
                key={i}
                className="p-3 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-full overflow-hidden relative bg-zinc-300 shrink-0">
                  {member.avatar ? (
                    <Image src={member.avatar} alt={member.name} fill className="object-cover" referrerPolicy="no-referrer" />
                  ) : (
                    <div className="w-full h-full bg-emerald-500 text-white flex items-center justify-center font-bold">
                      {member.name[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 block truncate">{member.name}</span>
                  <span className="text-[10px] font-mono text-zinc-400 block truncate">{member.wallet || 'Wallet Linked'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
