export interface LessonResource {
  title: string;
  url: string;
}

export interface Lesson {
  title: string;
  slug: string;
  content: string; // Markdown content
  resources?: LessonResource[];
  duration: string;
}

export interface Section {
  title: string;
  lessons: Lesson[];
}

export interface Instructor {
  name: string;
  avatar: string;
  title: string;
}

export interface Course {
  id: string;
  index: number;
  title: string;
  slug: string;
  description: string;
  image: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  tags: string[];
  instructor: Instructor;
  sections: Section[];
  duration: string;
  enrolledCount?: number;
  certificateMintable?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  iconName: string;
  description: string;
  dateEarned: string;
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  walletAddress: string;
  mintAddress: string;
  txHash: string;
  issueDate: string;
  status: 'verified' | 'unverified';
  imageUrl?: string;
}

export interface UserProgress {
  completedLessons: string[]; // slugs
  percent: number;
  lastAccessedLesson?: string;
}

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  wallet?: string;
  photoURL?: string;
  bio?: string;
  role?: string;
  company?: string;
  skills?: string[];
  github?: string;
  twitter?: string;
  linkedin?: string;
  progress?: Record<string, UserProgress>; // courseId -> progress
  badges?: Badge[];
  certificates?: Certificate[];
  createdAt?: string;
}

export interface Cohort {
  id: string;
  index: number;
  name: string;
  schedule: string;
  members: string[]; // user UIDs or names
  courseId: string;
  discordUrl?: string;
}

export interface StudyGroupMember {
  uid: string;
  name: string;
  avatar?: string;
  wallet?: string;
}

export interface StudyGroup {
  id: string;
  index: number;
  name: string;
  slug: string;
  description: string;
  scheduled_at: string; // ISO string
  members: StudyGroupMember[];
  discordUrl: string;
  courseId: string;
}

export interface LeaderboardItem {
  rank: number;
  uid: string;
  name: string;
  wallet: string;
  points: number;
  coursesCompleted: number;
  streakDays: number;
  avatar?: string;
}

export interface StakeTransaction {
  type: 'stake' | 'unstake' | 'claim' | 'airdrop';
  amount: number;
  txHash: string;
  date: string;
}

export interface StakingInfo {
  stakedAmount: number;
  pendingRewards: number;
  apr: number;
  totalStaked: number;
  devnetWalletBalance: number;
  history: StakeTransaction[];
}

export interface PlatformStats {
  totalDevelopers: number;
  coursesCompleted: number;
  certificatesMinted: number;
  activeStudyGroups: number;
  totalSolStaked: number;
}
