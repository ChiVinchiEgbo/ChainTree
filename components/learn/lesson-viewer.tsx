'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Course, Lesson } from '@/lib/types';
import {
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  ExternalLink,
  Sparkles,
  FileText,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { LessonQuiz } from './lesson-quiz';
import { toast } from 'sonner';

interface LessonViewerProps {
  course: Course;
  currentLesson: Lesson;
  sectionTitle: string;
  sectionIndex: number;
  completedSlugs?: string[];
  onMarkComplete?: (slug: string) => void;
  onMintCertificate?: () => void;
}

export function LessonViewer({
  course,
  currentLesson,
  sectionTitle,
  sectionIndex,
  completedSlugs = [],
  onMarkComplete,
  onMintCertificate
}: LessonViewerProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [completed, setCompleted] = useState(completedSlugs.includes(currentLesson.slug));

  // Flatten all lessons across sections for Prev/Next
  const allLessons = course.sections.flatMap((s, sIdx) =>
    s.lessons.map(l => ({ ...l, sectionIndex: sIdx, sectionTitle: s.title }))
  );

  const currentIndex = allLessons.findIndex(l => l.slug === currentLesson.slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleComplete = () => {
    setCompleted(true);
    if (onMarkComplete) {
      onMarkComplete(currentLesson.slug);
    }
    toast.success(`Marked "${currentLesson.title}" as completed! +100 XP`);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden w-full flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 text-xs font-semibold"
      >
        <span className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-500" />
          Course Curriculum & Navigation
        </span>
        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </button>

      {/* Curriculum Sidebar */}
      <aside
        className={`w-full lg:w-80 bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-5 shrink-0 space-y-4 ${
          sidebarOpen ? 'block' : 'hidden lg:block'
        }`}
      >
        <div className="pb-3 border-b border-[#e5e5e5] dark:border-zinc-800">
          <Link href={`/courses/${course.id}`} className="text-xs font-semibold text-emerald-600 hover:underline flex items-center gap-1 mb-1">
            <ChevronLeft className="w-3.5 h-3.5" /> Back to Course Overview
          </Link>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 line-clamp-1">{course.title}</h3>
        </div>

        <div className="space-y-4 max-h-[calc(100vh-16rem)] overflow-y-auto pr-1">
          {course.sections.map((section, sIdx) => (
            <div key={sIdx} className="space-y-1.5">
              <h4 className="text-xs font-bold font-mono text-zinc-500 uppercase tracking-wider px-2">
                {section.title}
              </h4>

              <div className="space-y-1">
                {section.lessons.map((lesson) => {
                  const isCurrent = lesson.slug === currentLesson.slug;
                  const isDone = completedSlugs.includes(lesson.slug) || (isCurrent && completed);

                  return (
                    <Link
                      key={lesson.slug}
                      href={`/courses/${course.id}/${sIdx}/${lesson.slug}`}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
                        isCurrent
                          ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-500/30'
                          : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600 shrink-0" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400 shrink-0">{lesson.duration}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 w-full space-y-6">
        
        {/* Lesson Header */}
        <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
              {sectionTitle}
            </span>
            <span className="text-zinc-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {currentLesson.duration}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {currentLesson.title}
          </h1>
        </div>

        {/* Markdown Content */}
        <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs text-zinc-800 dark:text-zinc-200 leading-relaxed text-sm space-y-4">
          <div className="prose dark:prose-invert max-w-none prose-emerald">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {currentLesson.content}
            </ReactMarkdown>
          </div>

          {/* Resources if available */}
          {currentLesson.resources && currentLesson.resources.length > 0 && (
            <div className="pt-6 border-t border-[#e5e5e5] dark:border-zinc-800 mt-6 space-y-2">
              <h4 className="font-bold text-xs uppercase font-mono tracking-wider text-zinc-500 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-amber-500" />
                Lesson Developer Resources
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentLesson.resources.map((res, i) => (
                  <a
                    key={i}
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 flex items-center justify-between text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:border-emerald-500 transition-colors"
                  >
                    <span>{res.title}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Knowledge Quiz Check */}
        <LessonQuiz onComplete={handleComplete} />

        {/* Completion Bar & Navigation */}
        <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={handleComplete}
            className={`w-full sm:w-auto px-6 py-3 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 ${
              completed
                ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-md'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{completed ? 'Lesson Completed (+100 XP)' : 'Mark Lesson as Complete'}</span>
          </button>

          {/* Prev / Next buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {prevLesson ? (
              <Link
                href={`/courses/${course.id}/${prevLesson.sectionIndex}/${prevLesson.slug}`}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#f3f3f3] dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
              </Link>
            ) : (
              <div />
            )}

            {nextLesson ? (
              <Link
                href={`/courses/${course.id}/${nextLesson.sectionIndex}/${nextLesson.slug}`}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 hover:bg-zinc-800 text-white dark:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Next Lesson</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            ) : (
              <button
                onClick={onMintCertificate}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
              >
                <Award className="w-4 h-4" />
                <span>Mint Course Credential cNFT</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
