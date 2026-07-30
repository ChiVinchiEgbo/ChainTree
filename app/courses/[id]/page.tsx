import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { dataSource } from '@/lib/data';
import {
  Clock,
  BookOpen,
  CheckCircle2,
  Award,
  ChevronRight,
  ShieldCheck,
  User,
  ArrowLeft,
  Play
} from 'lucide-react';

interface CourseOverviewProps {
  params: Promise<{ id: string }>;
}

export default async function CourseOverviewPage({ params }: CourseOverviewProps) {
  const { id } = await params;
  const course = await dataSource.getCourse(id);

  if (!course) {
    notFound();
  }

  // Get demo user progress
  const profile = await dataSource.getProfile('u1');
  const courseProgress = profile?.progress?.[course.id] || { completedLessons: [], percent: 0 };

  const firstLesson = course.sections[0]?.lessons[0];
  const firstLessonHref = firstLesson ? `/courses/${course.id}/0/${firstLesson.slug}` : '#';

  return (
    <div className="space-y-8 py-2">
      {/* Back button */}
      <Link href="/courses" className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-600 dark:text-zinc-400 hover:text-emerald-600">
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Course Catalog
      </Link>

      {/* Course Header Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="px-3 py-1 font-semibold rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              {course.level} Level
            </span>
            {course.certificateMintable && (
              <span className="px-3 py-1 font-semibold rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                cNFT Credential
              </span>
            )}
            <span className="text-zinc-400 font-mono flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.duration}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            {course.title}
          </h1>

          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {course.description}
          </p>

          <div className="flex flex-wrap gap-2 pt-2">
            {course.tags.map(tag => (
              <span key={tag} className="text-xs font-mono px-2.5 py-1 bg-[#f3f3f3] dark:bg-zinc-800 rounded-lg text-zinc-600 dark:text-zinc-400">
                #{tag}
              </span>
            ))}
          </div>

          {/* Instructor Meta */}
          <div className="pt-4 border-t border-[#e5e5e5] dark:border-zinc-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full relative overflow-hidden bg-zinc-200">
              <Image src={course.instructor.avatar} alt={course.instructor.name} fill className="object-cover" referrerPolicy="no-referrer" />
            </div>
            <div>
              <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100 block">{course.instructor.name}</span>
              <span className="text-[11px] text-zinc-500">{course.instructor.title}</span>
            </div>
          </div>
        </div>

        {/* Enrollment & Action Panel */}
        <div className="bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">Your Progress</h3>
            
            <div className="flex items-center justify-between text-xs font-mono font-bold">
              <span className="text-zinc-500">Completion Status</span>
              <span className="text-emerald-600 dark:text-emerald-400">{courseProgress.percent}%</span>
            </div>

            <div className="w-full bg-zinc-200 dark:bg-zinc-700 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${courseProgress.percent}%` }}
              />
            </div>

            <p className="text-[11px] text-zinc-500">
              {courseProgress.completedLessons.length} of {course.sections.flatMap(s => s.lessons).length} lessons completed
            </p>
          </div>

          <div className="space-y-2">
            <Link
              href={firstLessonHref}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2 shadow-md"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>{courseProgress.percent > 0 ? 'Continue Course' : 'Start Course Now'}</span>
            </Link>

            <Link
              href={`/courses/details/${course.id}`}
              className="w-full py-2.5 px-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-700 dark:text-zinc-300 text-xs font-semibold text-center block hover:bg-zinc-50 transition-colors"
            >
              View Full Course Details
            </Link>
          </div>
        </div>
      </div>

      {/* Syllabus / Sections List */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-emerald-500" />
            Course Curriculum & Lessons
          </h2>
          <span className="text-xs font-mono text-zinc-500">
            {course.sections.length} Sections • {course.sections.flatMap(s => s.lessons).length} Lessons
          </span>
        </div>

        <div className="space-y-4">
          {course.sections.map((section, sIdx) => (
            <div key={sIdx} className="border border-[#e5e5e5] dark:border-zinc-800 rounded-2xl overflow-hidden">
              <div className="p-4 bg-[#f8f8f8] dark:bg-zinc-800/60 border-b border-[#e5e5e5] dark:border-zinc-800 font-bold text-xs text-zinc-800 dark:text-zinc-200">
                {section.title}
              </div>

              <div className="divide-y divide-[#e5e5e5] dark:divide-zinc-800">
                {section.lessons.map((lesson) => {
                  const isDone = courseProgress.completedLessons.includes(lesson.slug);

                  return (
                    <Link
                      key={lesson.slug}
                      href={`/courses/${course.id}/${sIdx}/${lesson.slug}`}
                      className="p-4 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors group text-xs"
                    >
                      <div className="flex items-center gap-3">
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-zinc-300 dark:border-zinc-600 shrink-0" />
                        )}
                        <span className="font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                          {lesson.title}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 font-mono text-zinc-400">
                        <span>{lesson.duration}</span>
                        <ChevronRight className="w-4 h-4 text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
