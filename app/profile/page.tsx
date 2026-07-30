'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useWallet } from '@solana/wallet-adapter-react';
import { dataSource } from '@/lib/data';
import { UserProfile, Certificate, Badge } from '@/lib/types';
import { BadgeGrid } from '@/components/learn/badge-grid';
import { SkillRadar } from '@/components/learn/skill-radar';
import {
  User,
  Building,
  Briefcase,
  Github,
  Twitter,
  Linkedin,
  Wallet,
  Edit,
  Share2,
  CheckCircle2,
  Award,
  ShieldCheck,
  X,
  Save
} from 'lucide-react';
import { toast } from 'sonner';

import { useDataSource } from '@/hooks/use-data-source';

export default function ProfileDashboardPage() {
  const { publicKey } = useWallet();
  const { userProfile: profile, updateProfile } = useDataSource();
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    company: '',
    bio: '',
    github: '',
    twitter: '',
    linkedin: ''
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        role: profile.role || '',
        company: profile.company || '',
        bio: profile.bio || '',
        github: profile.github || '',
        twitter: profile.twitter || '',
        linkedin: profile.linkedin || ''
      });
    }
  }, [profile]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    await updateProfile(formData);
    setEditModalOpen(false);
    toast.success('Profile updated successfully!');
  };

  const copyShareLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Profile share link copied to clipboard!');
    }
  };

  if (!profile) {
    return <div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading developer profile...</div>;
  }

  const walletAddress = publicKey ? publicKey.toBase58() : profile.wallet || 'Not Connected';

  return (
    <div className="space-y-8 py-2">
      {/* Top Banner Card */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl relative overflow-hidden bg-emerald-500 text-white flex items-center justify-center font-extrabold text-2xl shrink-0">
            {profile.photoURL ? (
              <Image src={profile.photoURL} alt={profile.name} fill className="object-cover" referrerPolicy="no-referrer" />
            ) : (
              profile.name[0]
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 dark:text-zinc-100">{profile.name}</h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] font-bold border border-emerald-500/20">
                Verified Solana Dev
              </span>
            </div>
            <p className="text-xs text-zinc-500 flex items-center gap-2">
              <span>{profile.role || 'Web3 Developer'}</span>
              <span>•</span>
              <span>{profile.company || 'Ecosystem Contributor'}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setEditModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 transition-colors"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          <button
            onClick={copyShareLink}
            className="p-2.5 rounded-xl bg-[#f3f3f3] dark:bg-zinc-800 hover:bg-zinc-200 text-zinc-700 dark:text-zinc-300 text-xs transition-colors"
            title="Share Profile"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Personal & Social Data */}
        <div className="space-y-6">
          {/* Personal Info Card */}
          <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <User className="w-4 h-4 text-emerald-500" />
              Developer Info & Wallet
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 space-y-1">
                <span className="text-zinc-400 font-mono text-[10px] block uppercase">Connected Solana Wallet</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 block truncate">
                  {walletAddress}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 space-y-1">
                <span className="text-zinc-400 font-mono text-[10px] block uppercase">Bio / Summary</span>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">{profile.bio || 'No bio provided yet.'}</p>
              </div>

              <div className="p-3 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 space-y-2">
                <span className="text-zinc-400 font-mono text-[10px] block uppercase">Social Connections</span>
                <div className="flex items-center gap-3">
                  {profile.github && (
                    <a href={profile.github} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-emerald-600">
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {profile.twitter && (
                    <a href={profile.twitter} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-emerald-600">
                      <Twitter className="w-4 h-4" />
                    </a>
                  )}
                  {profile.linkedin && (
                    <a href={profile.linkedin} target="_blank" rel="noreferrer" className="text-zinc-600 hover:text-emerald-600">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          <SkillRadar skills={profile.skills} />
        </div>

        {/* Right Column: Credentials & Badges */}
        <div className="lg:col-span-2 space-y-6">
          <BadgeGrid badges={profile.badges} certificates={profile.certificates} />
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#e5e5e5] dark:border-zinc-800 pb-3">
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">Edit Developer Profile</h3>
              <button onClick={() => setEditModalOpen(false)} className="text-zinc-400 hover:text-zinc-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Role Title</label>
                  <input
                    type="text"
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-zinc-700 dark:text-zinc-300">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">Bio</label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={e => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-zinc-700 dark:text-zinc-300">GitHub URL</label>
                <input
                  type="text"
                  value={formData.github}
                  onChange={e => setFormData({ ...formData, github: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#f8f8f8] dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 text-zinc-900 dark:text-zinc-100 font-mono"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold flex items-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
