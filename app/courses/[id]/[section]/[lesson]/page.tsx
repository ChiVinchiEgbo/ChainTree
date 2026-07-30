import React from 'react';
import { notFound } from 'next/navigation';
import { dataSource } from '@/lib/data';
import { LessonPageClient } from '@/components/learn/lesson-page-client';

interface LessonPageProps {
  params: Promise<{ id: string; section: string; lesson: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { id, section, lesson } = await params;
  const sectionIndex = parseInt(section, 10) || 0;

  const course = await dataSource.getCourse(id);
  if (!course) notFound();

  const lessonData = await dataSource.getLesson(id, sectionIndex, lesson);
  if (!lessonData) notFound();

  const profile = await dataSource.getProfile('u1');
  const courseProgress = profile?.progress?.[course.id] || { completedLessons: [], percent: 0 };

  return (
    <div className="py-2">
      <LessonPageClient
        course={course}
        currentLesson={lessonData.lesson}
        sectionTitle={lessonData.sectionTitle}
        sectionIndex={sectionIndex}
        completedSlugs={courseProgress.completedLessons}
      />
    </div>
  );
}
