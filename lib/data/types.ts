import {
  Course,
  StudyGroup,
  Cohort,
  LeaderboardItem,
  UserProfile,
  PlatformStats,
  Certificate,
  StakingInfo,
  Lesson
} from '../types';

export interface DataSource {
  getCourses(): Promise<Course[]>;
  getCourse(id: string): Promise<Course | null>;
  getLesson(courseId: string, sectionIndex: number, lessonSlug: string): Promise<{ lesson: Lesson; sectionTitle: string } | null>;
  getProfile(uid: string): Promise<UserProfile | null>;
  updateProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile>;
  getStudyGroups(): Promise<StudyGroup[]>;
  getStudyGroup(slugOrId: string): Promise<StudyGroup | null>;
  createStudyGroup(data: Omit<StudyGroup, 'id' | 'index'>): Promise<StudyGroup>;
  updateStudyGroup(id: string, updates: Partial<StudyGroup>): Promise<StudyGroup>;
  deleteStudyGroup(id: string): Promise<boolean>;
  joinStudyGroup(groupId: string, member: { uid: string; name: string; avatar?: string; wallet?: string }): Promise<StudyGroup>;
  leaveStudyGroup(groupId: string, uid: string): Promise<StudyGroup>;
  getCohort(id: string): Promise<Cohort | null>;
  createCohort(data: Omit<Cohort, 'id' | 'index'>): Promise<Cohort>;
  getLeaderboard(): Promise<LeaderboardItem[]>;
  getStats(): Promise<PlatformStats>;
  verifyCertificate(mintOrTxOrId: string): Promise<Certificate | null>;
  getStakeInfo(walletAddress: string): Promise<StakingInfo>;
  stakeTokens(walletAddress: string, amount: number): Promise<StakingInfo>;
  unstakeTokens(walletAddress: string, amount: number): Promise<StakingInfo>;
  claimRewards(walletAddress: string): Promise<StakingInfo>;
  requestAirdrop(walletAddress: string): Promise<StakingInfo>;
  updateUserProgress(uid: string, courseId: string, lessonSlug: string): Promise<UserProfile>;
  mintCertificate(uid: string, courseId: string, walletAddress: string): Promise<Certificate>;
}
