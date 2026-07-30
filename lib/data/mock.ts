import { DataSource } from './types';
import {
  MOCK_COURSES,
  MOCK_STUDY_GROUPS,
  MOCK_COHORTS,
  MOCK_LEADERBOARD,
  MOCK_USER_PROFILE,
  MOCK_STATS,
  MOCK_CERTIFICATES
} from './mockData';
import {
  Course,
  StudyGroup,
  Cohort,
  LeaderboardItem,
  UserProfile,
  PlatformStats,
  Certificate,
  StakingInfo,
  StakeTransaction
} from '../types';

const IS_SERVER = typeof window === 'undefined';

function getItem<T>(key: string, fallback: T): T {
  if (IS_SERVER) return fallback;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    return fallback;
  }
}

function setItem<T>(key: string, value: T): void {
  if (IS_SERVER) return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('chaintree-data-changed', { detail: { key, value } }));
  } catch (e) {
    console.error('Failed to set localStorage key:', key, e);
  }
}

const DEFAULT_STAKING_INFO: StakingInfo = {
  stakedAmount: 25.5,
  pendingRewards: 1.84,
  apr: 14.2,
  totalStaked: 18450,
  devnetWalletBalance: 8.45,
  history: [
    { type: 'stake', amount: 10, txHash: '5xY9aB...2mC3', date: '2026-07-20' },
    { type: 'claim', amount: 0.5, txHash: '8aB1xC...9vC2', date: '2026-07-25' },
    { type: 'stake', amount: 15.5, txHash: '1aZ2yB...4mQ8', date: '2026-07-28' },
  ]
};

export const mockSource: DataSource = {
  async getCourses(): Promise<Course[]> {
    return getItem('chaintree_courses', MOCK_COURSES);
  },

  async getCourse(id: string): Promise<Course | null> {
    const courses = await this.getCourses();
    const course = courses.find(c => c.id === id || c.slug === id);
    return course || courses[0] || null;
  },

  async getLesson(courseId: string, sectionIndex: number, lessonSlug: string) {
    const course = await this.getCourse(courseId);
    if (!course) return null;
    const section = course.sections[sectionIndex] || course.sections[0];
    if (!section) return null;
    const lesson = section.lessons.find(l => l.slug === lessonSlug) || section.lessons[0];
    if (!lesson) return null;
    return { lesson, sectionTitle: section.title };
  },

  async getProfile(uid: string): Promise<UserProfile | null> {
    const profile = getItem<UserProfile>('chaintree_user_profile', MOCK_USER_PROFILE);
    return { ...profile, uid };
  },

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    const current = await this.getProfile(uid);
    const updated: UserProfile = {
      ...(current || MOCK_USER_PROFILE),
      ...updates,
      uid
    };
    setItem('chaintree_user_profile', updated);
    return updated;
  },

  async getStudyGroups(): Promise<StudyGroup[]> {
    return getItem('chaintree_study_groups', MOCK_STUDY_GROUPS);
  },

  async getStudyGroup(slugOrId: string): Promise<StudyGroup | null> {
    const groups = await this.getStudyGroups();
    return groups.find(sg => sg.id === slugOrId || sg.slug === slugOrId) || groups[0] || null;
  },

  async createStudyGroup(data) {
    const groups = await this.getStudyGroups();
    const newGroup: StudyGroup = {
      ...data,
      id: `sg-${Date.now()}`,
      index: groups.length + 1
    };
    const updated = [newGroup, ...groups];
    setItem('chaintree_study_groups', updated);

    // Update stats
    const stats = await this.getStats();
    stats.activeStudyGroups += 1;
    setItem('chaintree_stats', stats);

    return newGroup;
  },

  async updateStudyGroup(id: string, updates: Partial<StudyGroup>): Promise<StudyGroup> {
    const groups = await this.getStudyGroups();
    let updatedGroup: StudyGroup | null = null;
    const updatedList = groups.map(g => {
      if (g.id === id || g.slug === id) {
        updatedGroup = { ...g, ...updates };
        return updatedGroup;
      }
      return g;
    });
    if (!updatedGroup) throw new Error('Study group not found');
    setItem('chaintree_study_groups', updatedList);
    return updatedGroup;
  },

  async deleteStudyGroup(id: string): Promise<boolean> {
    const groups = await this.getStudyGroups();
    const filtered = groups.filter(g => g.id !== id && g.slug !== id);
    setItem('chaintree_study_groups', filtered);

    // Update stats
    const stats = await this.getStats();
    stats.activeStudyGroups = Math.max(0, stats.activeStudyGroups - 1);
    setItem('chaintree_stats', stats);

    return true;
  },

  async joinStudyGroup(groupId: string, member) {
    const groups = await this.getStudyGroups();
    let joinedGroup: StudyGroup | null = null;
    const updatedList = groups.map(group => {
      if (group.id === groupId || group.slug === groupId) {
        const exists = group.members.some(m => m.uid === member.uid || (member.wallet && m.wallet === member.wallet));
        if (!exists) {
          joinedGroup = { ...group, members: [...group.members, member] };
          return joinedGroup;
        }
        joinedGroup = group;
      }
      return group;
    });

    if (!joinedGroup) throw new Error('Study group not found');
    setItem('chaintree_study_groups', updatedList);
    return joinedGroup;
  },

  async leaveStudyGroup(groupId: string, uid: string) {
    const groups = await this.getStudyGroups();
    let leftGroup: StudyGroup | null = null;
    const updatedList = groups.map(group => {
      if (group.id === groupId || group.slug === groupId) {
        leftGroup = { ...group, members: group.members.filter(m => m.uid !== uid) };
        return leftGroup;
      }
      return group;
    });

    if (!leftGroup) throw new Error('Study group not found');
    setItem('chaintree_study_groups', updatedList);
    return leftGroup;
  },

  async getCohort(id: string): Promise<Cohort | null> {
    const cohorts = getItem('chaintree_cohorts', MOCK_COHORTS);
    return cohorts.find(c => c.id === id) || cohorts[0] || null;
  },

  async createCohort(data) {
    const cohorts = getItem<Cohort[]>('chaintree_cohorts', MOCK_COHORTS);
    const newCohort: Cohort = {
      ...data,
      id: `cohort-${Date.now()}`,
      index: cohorts.length + 1
    };
    setItem('chaintree_cohorts', [newCohort, ...cohorts]);
    return newCohort;
  },

  async getLeaderboard(): Promise<LeaderboardItem[]> {
    return getItem('chaintree_leaderboard', MOCK_LEADERBOARD);
  },

  async getStats(): Promise<PlatformStats> {
    return getItem('chaintree_stats', MOCK_STATS);
  },

  async verifyCertificate(mintOrTxOrId: string): Promise<Certificate | null> {
    const query = mintOrTxOrId.toLowerCase().trim();
    if (!query) return null;

    const certs = getItem<Certificate[]>('chaintree_certificates', MOCK_CERTIFICATES);
    const cert = certs.find(
      c =>
        c.id.toLowerCase() === query ||
        c.mintAddress.toLowerCase() === query ||
        c.txHash.toLowerCase() === query ||
        c.walletAddress.toLowerCase() === query
    );
    if (cert) return cert;

    // Generates dynamic verified record if looks like Solana address / tx hash
    if (query.length >= 20) {
      return {
        id: `cert-${query.slice(0, 8)}`,
        courseId: 'solana-anchor-fundamentals',
        courseTitle: 'Solana & Anchor Smart Contract Fundamentals',
        studentName: 'Verified Solana Dev',
        walletAddress: query,
        mintAddress: query.startsWith('tx_') ? `cNFT_${query.slice(3, 12)}` : query,
        txHash: query.startsWith('tx_') ? query : `tx_${query.slice(0, 16)}`,
        issueDate: new Date().toISOString().split('T')[0],
        status: 'verified',
        imageUrl: 'https://picsum.photos/seed/verified-cert/800/600'
      };
    }
    return null;
  },

  async getStakeInfo(walletAddress: string): Promise<StakingInfo> {
    const info = getItem<StakingInfo>('chaintree_staking_info', DEFAULT_STAKING_INFO);
    if (walletAddress) {
      return info;
    }
    return {
      ...info,
      stakedAmount: 0,
      pendingRewards: 0
    };
  },

  async stakeTokens(walletAddress: string, amount: number): Promise<StakingInfo> {
    const current = await this.getStakeInfo(walletAddress);
    const newTx: StakeTransaction = {
      type: 'stake',
      amount,
      txHash: `tx_stake_${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0]
    };
    const updated: StakingInfo = {
      ...current,
      stakedAmount: Math.round((current.stakedAmount + amount) * 100) / 100,
      totalStaked: Math.round((current.totalStaked + amount) * 100) / 100,
      devnetWalletBalance: Math.max(0, Math.round((current.devnetWalletBalance - amount) * 100) / 100),
      history: [newTx, ...current.history]
    };
    setItem('chaintree_staking_info', updated);

    // Update global stats
    const stats = await this.getStats();
    stats.totalSolStaked = Math.round((stats.totalSolStaked + amount) * 100) / 100;
    setItem('chaintree_stats', stats);

    return updated;
  },

  async unstakeTokens(walletAddress: string, amount: number): Promise<StakingInfo> {
    const current = await this.getStakeInfo(walletAddress);
    const unstakeAmount = Math.min(current.stakedAmount, amount);
    const newTx: StakeTransaction = {
      type: 'unstake',
      amount: unstakeAmount,
      txHash: `tx_unstake_${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0]
    };
    const updated: StakingInfo = {
      ...current,
      stakedAmount: Math.round((current.stakedAmount - unstakeAmount) * 100) / 100,
      totalStaked: Math.max(0, Math.round((current.totalStaked - unstakeAmount) * 100) / 100),
      devnetWalletBalance: Math.round((current.devnetWalletBalance + unstakeAmount) * 100) / 100,
      history: [newTx, ...current.history]
    };
    setItem('chaintree_staking_info', updated);

    const stats = await this.getStats();
    stats.totalSolStaked = Math.max(0, Math.round((stats.totalSolStaked - unstakeAmount) * 100) / 100);
    setItem('chaintree_stats', stats);

    return updated;
  },

  async claimRewards(walletAddress: string): Promise<StakingInfo> {
    const current = await this.getStakeInfo(walletAddress);
    if (current.pendingRewards <= 0) return current;
    const claimed = current.pendingRewards;
    const newTx: StakeTransaction = {
      type: 'claim',
      amount: claimed,
      txHash: `tx_claim_${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0]
    };
    const updated: StakingInfo = {
      ...current,
      pendingRewards: 0,
      devnetWalletBalance: Math.round((current.devnetWalletBalance + claimed) * 100) / 100,
      history: [newTx, ...current.history]
    };
    setItem('chaintree_staking_info', updated);
    return updated;
  },

  async requestAirdrop(walletAddress: string): Promise<StakingInfo> {
    const current = await this.getStakeInfo(walletAddress);
    const airdropAmount = 2.0;
    const newTx: StakeTransaction = {
      type: 'airdrop',
      amount: airdropAmount,
      txHash: `tx_airdrop_${Math.random().toString(36).substring(2, 9)}`,
      date: new Date().toISOString().split('T')[0]
    };
    const updated: StakingInfo = {
      ...current,
      devnetWalletBalance: Math.round((current.devnetWalletBalance + airdropAmount) * 100) / 100,
      history: [newTx, ...current.history]
    };
    setItem('chaintree_staking_info', updated);
    return updated;
  },

  async updateUserProgress(uid: string, courseId: string, lessonSlug: string): Promise<UserProfile> {
    const courses = await this.getCourses();
    const course = courses.find(c => c.id === courseId);
    const totalLessons = course ? course.sections.flatMap(s => s.lessons).length : 4;

    const profile = await this.getProfile(uid);
    const existing = profile?.progress?.[courseId] || { completedLessons: [], percent: 0 };
    const completed = new Set(existing.completedLessons);
    completed.add(lessonSlug);

    const completedArray = Array.from(completed);
    const percent = Math.min(100, Math.round((completedArray.length / totalLessons) * 100));

    const updatedProfile: UserProfile = {
      ...(profile || MOCK_USER_PROFILE),
      uid,
      progress: {
        ...(profile?.progress || {}),
        [courseId]: {
          completedLessons: completedArray,
          percent,
          lastAccessedLesson: lessonSlug
        }
      }
    };

    setItem('chaintree_user_profile', updatedProfile);

    // If a course was 100% completed, update stats & leaderboard
    if (percent === 100 && existing.percent < 100) {
      const stats = await this.getStats();
      stats.coursesCompleted += 1;
      setItem('chaintree_stats', stats);

      const leaderboard = await this.getLeaderboard();
      const updatedLb = leaderboard.map(item => {
        if (item.uid === uid) {
          return {
            ...item,
            coursesCompleted: item.coursesCompleted + 1,
            points: item.points + 500,
            streakDays: item.streakDays + 1
          };
        }
        return item;
      });
      setItem('chaintree_leaderboard', updatedLb);
    }

    return updatedProfile;
  },

  async mintCertificate(uid: string, courseId: string, walletAddress: string): Promise<Certificate> {
    const courses = await this.getCourses();
    const course = courses.find(c => c.id === courseId) || courses[0];
    const profile = await this.getProfile(uid);

    const certs = getItem<Certificate[]>('chaintree_certificates', MOCK_CERTIFICATES);
    const wallet = walletAddress || profile?.wallet || '8x2P...4mQ1';
    
    const newCert: Certificate = {
      id: `cert-${courseId}-${Date.now().toString().slice(-4)}`,
      courseId: course.id,
      courseTitle: course.title,
      studentName: profile?.name || 'Solana Developer',
      walletAddress: wallet,
      mintAddress: `${wallet.slice(0, 4)}cNFT${Date.now().toString().slice(-8)}`,
      txHash: `tx_${Math.random().toString(36).substring(2, 15)}`,
      issueDate: new Date().toISOString().split('T')[0],
      status: 'verified',
      imageUrl: course.image
    };

    const updatedCerts = [newCert, ...certs];
    setItem('chaintree_certificates', updatedCerts);

    // Update user profile certificates
    const currentCerts = profile?.certificates || [];
    const updatedProfile: UserProfile = {
      ...(profile || MOCK_USER_PROFILE),
      certificates: [newCert, ...currentCerts]
    };
    setItem('chaintree_user_profile', updatedProfile);

    // Update global platform stats
    const stats = await this.getStats();
    stats.certificatesMinted += 1;
    setItem('chaintree_stats', stats);

    return newCert;
  }
};
