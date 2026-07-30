import React from 'react';
import { redirect } from 'next/navigation';
import { dataSource } from '@/lib/data';

interface DetailIdProps {
  params: Promise<{ id: string }>;
}

export default async function StudyGroupDetailsByIdPage({ params }: DetailIdProps) {
  const { id } = await params;
  const group = await dataSource.getStudyGroup(id);
  if (group) {
    redirect(`/study-groups/${group.slug}`);
  }
  redirect('/study-groups');
}
