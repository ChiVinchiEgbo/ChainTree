'use client';

import { useState, useEffect, useCallback } from 'react';
import { dataSource } from '@/lib/data';
import {
  StudyGroup,
  UserProfile,
  StakingInfo,
  PlatformStats,
  Certificate,
  Course
} from '@/lib/types';
import { useWallet } from '@solana/wallet-adapter-react';

export function useDataSource() {
  const { publicKey } = useWallet();
  const walletAddress = publicKey?.toBase58() || '';

  const [courses, setCourses] = useState<Course[]>([]);
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [stakingInfo, setStakingInfo] = useState<StakingInfo | null>(null);
  const [stats, setStats] = useState<PlatformStats | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshAll = useCallback(async () => {
    try {
      const [c, sg, prof, stake, st] = await Promise.all([
        dataSource.getCourses(),
        dataSource.getStudyGroups(),
        dataSource.getProfile('u1'),
        dataSource.getStakeInfo(walletAddress),
        dataSource.getStats(),
      ]);
      setCourses(c);
      setStudyGroups(sg);
      setUserProfile(prof);
      setStakingInfo(stake);
      setStats(st);
    } catch (e) {
      console.error('Failed to load data:', e);
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refreshAll();

    const handleDataChanged = () => {
      refreshAll();
    };

    window.addEventListener('chaintree-data-changed', handleDataChanged);
    return () => {
      window.removeEventListener('chaintree-data-changed', handleDataChanged);
    };
  }, [refreshAll]);

  // Actions
  const createStudyGroup = async (data: Omit<StudyGroup, 'id' | 'index'>) => {
    const newGroup = await dataSource.createStudyGroup(data);
    await refreshAll();
    return newGroup;
  };

  const updateStudyGroup = async (id: string, updates: Partial<StudyGroup>) => {
    const updated = await dataSource.updateStudyGroup(id, updates);
    await refreshAll();
    return updated;
  };

  const deleteStudyGroup = async (id: string) => {
    const res = await dataSource.deleteStudyGroup(id);
    await refreshAll();
    return res;
  };

  const joinStudyGroup = async (groupId: string, member: { uid: string; name: string; avatar?: string; wallet?: string }) => {
    const updated = await dataSource.joinStudyGroup(groupId, member);
    await refreshAll();
    return updated;
  };

  const leaveStudyGroup = async (groupId: string, uid: string) => {
    const updated = await dataSource.leaveStudyGroup(groupId, uid);
    await refreshAll();
    return updated;
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const updated = await dataSource.updateProfile('u1', updates);
    await refreshAll();
    return updated;
  };

  const updateUserProgress = async (courseId: string, lessonSlug: string) => {
    const updated = await dataSource.updateUserProgress('u1', courseId, lessonSlug);
    await refreshAll();
    return updated;
  };

  const stakeTokens = async (amount: number) => {
    const updated = await dataSource.stakeTokens(walletAddress || 'devnet-wallet', amount);
    await refreshAll();
    return updated;
  };

  const unstakeTokens = async (amount: number) => {
    const updated = await dataSource.unstakeTokens(walletAddress || 'devnet-wallet', amount);
    await refreshAll();
    return updated;
  };

  const claimRewards = async () => {
    const updated = await dataSource.claimRewards(walletAddress || 'devnet-wallet');
    await refreshAll();
    return updated;
  };

  const requestAirdrop = async () => {
    const updated = await dataSource.requestAirdrop(walletAddress || 'devnet-wallet');
    await refreshAll();
    return updated;
  };

  const mintCertificate = async (courseId: string) => {
    const cert = await dataSource.mintCertificate('u1', courseId, walletAddress || '8x2P...4mQ1');
    await refreshAll();
    return cert;
  };

  return {
    courses,
    studyGroups,
    userProfile,
    stakingInfo,
    stats,
    loading,
    refreshAll,
    createStudyGroup,
    updateStudyGroup,
    deleteStudyGroup,
    joinStudyGroup,
    leaveStudyGroup,
    updateProfile,
    updateUserProgress,
    stakeTokens,
    unstakeTokens,
    claimRewards,
    requestAirdrop,
    mintCertificate,
  };
}
