'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Course } from '@/lib/types';
import { Clock, Users, Award, ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react';

interface TrackCardProps {
  course: Course;
  progressPercent?: number;
}

export function TrackCard({ course, progressPercent }: TrackCardProps) {
  const levelColors = {
    Beginner: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    Intermediate: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    Advanced: 'bg-teal-500/10 text-teal-600 dark:text-teal-400 border-teal-500/20',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl overflow-hidden hover:shadow-md transition-all flex flex-col group hover:border-emerald-500/50">
      {/* Cover Image & Level Badge */}
      <div className="relative h-48 w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
        <Image
          src={course.image}
          alt={course.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className={`px-2.5 py-1 text-[11px] font-semibold rounded-full border backdrop-blur-md ${levelColors[course.level]}`}>
            {course.level}
          </span>
          {course.certificateMintable && (
            <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-black/60 text-emerald-400 border border-emerald-500/30 backdrop-blur-md flex items-center gap-1">
              <Award className="w-3 h-3 text-emerald-400" />
              <span>cNFT Credential</span>
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {course.tags.map(tag => (
              <span key={tag} className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-[#f3f3f3] dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                #{tag}
              </span>
            ))}
          </div>

          <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-2">
            {course.title}
          </h3>

          <p className="mt-1.5 text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed">
            {course.description}
          </p>
        </div>

        {/* Progress bar if present */}
        {typeof progressPercent === 'number' && (
          <div className="space-y-1.5 pt-2 border-t border-[#e5e5e5] dark:border-zinc-800">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-500 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                Progress
              </span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer meta */}
        <div className="pt-3 border-t border-[#e5e5e5] dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden relative bg-zinc-200">
              <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">{course.instructor.name}</span>
          </div>

          <div className="flex items-center gap-3 font-mono text-[11px]">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-zinc-400" />
              {course.duration.split('•')[0]}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="pt-1 flex items-center gap-2">
          <Link
            href={`/courses/${course.id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-white text-white dark:text-zinc-900 text-xs font-semibold transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{progressPercent && progressPercent > 0 ? 'Continue Learning' : 'Start Course'}</span>
          </Link>
          <Link
            href={`/courses/details/${course.id}`}
            className="p-2 rounded-xl bg-[#f3f3f3] dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 text-xs transition-colors"
            title="View Syllabus & Details"
          >
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
