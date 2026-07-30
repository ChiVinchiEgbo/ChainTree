import { DataSource } from './types';
import { db, hasFirebaseClientConfig } from '../firebase/client';
import { mockSource } from './mock';
import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit
} from 'firebase/firestore';
import { Course, StudyGroup, Cohort, LeaderboardItem, UserProfile, PlatformStats, Certificate, StakingInfo } from '../types';

export const firebaseSource: DataSource = {
  async getCourses(): Promise<Course[]> {
    if (!db) return mockSource.getCourses();
    try {
      const q = query(collection(db, 'courses'), orderBy('index', 'asc'));
      const snap = await getDocs(q);
      if (snap.empty) return mockSource.getCourses();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Course));
    } catch (e) {
      console.warn('[Firebase] Failed to fetch courses, falling back to mock:', e);
      return mockSource.getCourses();
    }
  },

  async getCourse(id: string): Promise<Course | null> {
    if (!db) return mockSource.getCourse(id);
    try {
      const docRef = doc(db, 'courses', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Course;
      }
      return mockSource.getCourse(id);
    } catch (e) {
      return mockSource.getCourse(id);
    }
  },

  async getLesson(courseId: string, sectionIndex: number, lessonSlug: string) {
    const course = await this.getCourse(courseId);
    if (!course) return mockSource.getLesson(courseId, sectionIndex, lessonSlug);
    const section = course.sections?.[sectionIndex] || course.sections?.[0];
    if (!section) return null;
    const lesson = section.lessons?.find(l => l.slug === lessonSlug) || section.lessons?.[0];
    if (!lesson) return null;
    return { lesson, sectionTitle: section.title };
  },

  async getProfile(uid: string): Promise<UserProfile | null> {
    if (!db || !uid) return mockSource.getProfile(uid);
    try {
      const docRef = doc(db, 'users', uid);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { uid: snap.id, ...snap.data() } as UserProfile;
      }
      return mockSource.getProfile(uid);
    } catch (e) {
      return mockSource.getProfile(uid);
    }
  },

  async updateProfile(uid: string, updates: Partial<UserProfile>): Promise<UserProfile> {
    if (!db || !uid) return mockSource.updateProfile(uid, updates);
    try {
      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, { ...updates, uid }, { merge: true });
      const updated = await this.getProfile(uid);
      return updated || (updates as UserProfile);
    } catch (e) {
      return mockSource.updateProfile(uid, updates);
    }
  },

  async getStudyGroups(): Promise<StudyGroup[]> {
    if (!db) return mockSource.getStudyGroups();
    try {
      const q = query(collection(db, 'study_groups'), orderBy('index', 'asc'));
      const snap = await getDocs(q);
      if (snap.empty) return mockSource.getStudyGroups();
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as StudyGroup));
    } catch (e) {
      return mockSource.getStudyGroups();
    }
  },

  async getStudyGroup(slugOrId: string): Promise<StudyGroup | null> {
    if (!db) return mockSource.getStudyGroup(slugOrId);
    try {
      const docRef = doc(db, 'study_groups', slugOrId);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as StudyGroup;
      }
      return mockSource.getStudyGroup(slugOrId);
    } catch (e) {
      return mockSource.getStudyGroup(slugOrId);
    }
  },

  async createStudyGroup(data) {
    if (!db) return mockSource.createStudyGroup(data);
    try {
      const id = `sg-${Date.now()}`;
      const docRef = doc(db, 'study_groups', id);
      const newGroup: StudyGroup = { ...data, id, index: Date.now() };
      await setDoc(docRef, newGroup);
      return newGroup;
    } catch (e) {
      return mockSource.createStudyGroup(data);
    }
  },

  async joinStudyGroup(groupId: string, member) {
    if (!db) return mockSource.joinStudyGroup(groupId, member);
    try {
      const group = await this.getStudyGroup(groupId);
      if (group) {
        const members = group.members || [];
        if (!members.some(m => m.uid === member.uid)) {
          members.push(member);
          await updateDoc(doc(db, 'study_groups', group.id), { members });
        }
        return { ...group, members };
      }
      return mockSource.joinStudyGroup(groupId, member);
    } catch (e) {
      return mockSource.joinStudyGroup(groupId, member);
    }
  },

  async leaveStudyGroup(groupId: string, uid: string) {
    if (!db) return mockSource.leaveStudyGroup(groupId, uid);
    try {
      const group = await this.getStudyGroup(groupId);
      if (group) {
        const members = (group.members || []).filter(m => m.uid !== uid);
        await updateDoc(doc(db, 'study_groups', group.id), { members });
        return { ...group, members };
      }
      return mockSource.leaveStudyGroup(groupId, uid);
    } catch (e) {
      return mockSource.leaveStudyGroup(groupId, uid);
    }
  },

  async updateStudyGroup(id: string, updates: Partial<StudyGroup>): Promise<StudyGroup> {
    return mockSource.updateStudyGroup(id, updates);
  },

  async deleteStudyGroup(id: string): Promise<boolean> {
    return mockSource.deleteStudyGroup(id);
  },

  async stakeTokens(walletAddress: string, amount: number): Promise<StakingInfo> {
    return mockSource.stakeTokens(walletAddress, amount);
  },

  async unstakeTokens(walletAddress: string, amount: number): Promise<StakingInfo> {
    return mockSource.unstakeTokens(walletAddress, amount);
  },

  async claimRewards(walletAddress: string): Promise<StakingInfo> {
    return mockSource.claimRewards(walletAddress);
  },

  async requestAirdrop(walletAddress: string): Promise<StakingInfo> {
    return mockSource.requestAirdrop(walletAddress);
  },

  async getCohort(id: string): Promise<Cohort | null> {
    if (!db) return mockSource.getCohort(id);
    try {
      const docRef = doc(db, 'cohorts', id);
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        return { id: snap.id, ...snap.data() } as Cohort;
      }
      return mockSource.getCohort(id);
    } catch (e) {
      return mockSource.getCohort(id);
    }
  },

  async createCohort(data) {
    if (!db) return mockSource.createCohort(data);
    try {
      const id = `cohort-${Date.now()}`;
      const docRef = doc(db, 'cohorts', id);
      const newCohort: Cohort = { ...data, id, index: Date.now() };
      await setDoc(docRef, newCohort);
      return newCohort;
    } catch (e) {
      return mockSource.createCohort(data);
    }
  },

  async getLeaderboard(): Promise<LeaderboardItem[]> {
    return mockSource.getLeaderboard();
  },

  async getStats(): Promise<PlatformStats> {
    return mockSource.getStats();
  },

  async verifyCertificate(mintOrTxOrId: string): Promise<Certificate | null> {
    return mockSource.verifyCertificate(mintOrTxOrId);
  },

  async getStakeInfo(walletAddress: string): Promise<StakingInfo> {
    return mockSource.getStakeInfo(walletAddress);
  },

  async updateUserProgress(uid: string, courseId: string, lessonSlug: string): Promise<UserProfile> {
    return mockSource.updateUserProgress(uid, courseId, lessonSlug);
  },

  async mintCertificate(uid: string, courseId: string, walletAddress: string): Promise<Certificate> {
    return mockSource.mintCertificate(uid, courseId, walletAddress);
  }
};
