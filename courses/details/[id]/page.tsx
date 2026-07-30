import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { dataSource } from '@/lib/data';
import {
  BookOpen,
  CheckCircle2,
  Award,
  Clock,
  ShieldCheck,
  User,
  ArrowLeft,
  Sparkles,
  Layers
} from 'lucide-react';

interface DetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function CourseDetailsPage({ params }: DetailsPageProps) {
  const { id } = await params;
  const course = await dataSource.getCourse(id);
  if (!course) notFound();

  return (
    <div className="space-y-8 py-2">
      <Link href={`/courses/${course.id}`} className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Course Syllabus
      </Link>

      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1 font-semibold rounded-full bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            {course.level} Level Track
          </span>
          <span className="px-3 py-1 font-semibold rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/20 flex items-center gap-1">
            <Award className="w-3.5 h-3.5" />
            Verified cNFT Credential Included
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          {course.title}
        </h1>

        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-3xl">
          {course.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#e5e5e5] dark:border-zinc-800">
          <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400 uppercase font-mono">Instructor</span>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">{course.instructor.name}</span>
            <span className="text-xs text-zinc-500">{course.instructor.title}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400 uppercase font-mono">Est. Duration</span>
            <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">{course.duration}</span>
            <span className="text-xs text-zinc-500">{course.sections.flatMap(s => s.lessons).length} Lessons</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800 space-y-1">
            <span className="text-xs text-zinc-400 uppercase font-mono">Credential Standard</span>
            <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 block">Metaplex cNFT</span>
            <span className="text-xs text-zinc-500">SPL Compressed Merkle Proof</span>
          </div>
        </div>

        <div className="pt-4 flex items-center gap-3">
          <Link
            href={`/courses/${course.id}`}
            className="px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-md transition-colors"
          >
            Enroll & Start Learning
          </Link>
          <Link
            href="/verify"
            className="px-6 py-3.5 rounded-2xl bg-[#f3f3f3] dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs font-semibold transition-colors"
          >
            Public Credential Verifier
          </Link>
        </div>
      </div>
    </div>
  );
}
