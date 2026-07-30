'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Course, Lesson } from '@/lib/types';
import { LessonViewer } from './lesson-viewer';
import { useDataSource } from '@/hooks/use-data-source';
import { toast } from 'sonner';

interface LessonPageClientProps {
  course: Course;
  currentLesson: Lesson;
  sectionTitle: string;
  sectionIndex: number;
  completedSlugs: string[];
}

export function LessonPageClient({
  course,
  currentLesson,
  sectionTitle,
  sectionIndex,
  completedSlugs: initialCompletedSlugs
}: LessonPageClientProps) {
  const router = useRouter();
  const { userProfile, updateUserProgress, mintCertificate } = useDataSource();

  const profileProgress = userProfile?.progress?.[course.id]?.completedLessons || initialCompletedSlugs;

  const handleMarkComplete = async (slug: string) => {
    await updateUserProgress(course.id, slug);
  };

  const handleMintCertificate = async () => {
    try {
      toast.info('Minting cNFT Certificate on Solana Devnet...');
      const cert = await mintCertificate(course.id);
      toast.success(`Successfully minted cNFT Credential! Mint: ${cert.mintAddress}`);
      router.push(`/verify?query=${encodeURIComponent(cert.mintAddress)}`);
    } catch (e) {
      toast.error('Failed to mint certificate');
    }
  };

  return (
    <LessonViewer
      course={course}
      currentLesson={currentLesson}
      sectionTitle={sectionTitle}
      sectionIndex={sectionIndex}
      completedSlugs={profileProgress}
      onMarkComplete={handleMarkComplete}
      onMintCertificate={handleMintCertificate}
    />
  );
}
