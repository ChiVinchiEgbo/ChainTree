'use client';

import React, { useState } from 'react';
import { useDataSource } from '@/hooks/use-data-source';
import { useWallet } from '@solana/wallet-adapter-react';
import { UserPlus, UserMinus, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

interface StudyGroupActionsProps {
  groupId: string;
  groupName: string;
  members: { uid: string; name: string; wallet?: string }[];
}

export function StudyGroupActions({ groupId, groupName, members }: StudyGroupActionsProps) {
  const { joinStudyGroup, leaveStudyGroup, userProfile } = useDataSource();
  const { publicKey } = useWallet();
  const [loading, setLoading] = useState(false);

  const currentUid = userProfile?.uid || 'u1';
  const currentName = userProfile?.name || 'Solana Developer';
  const currentWallet = publicKey?.toBase58() || userProfile?.wallet || '8x2P...4mQ1';

  const isMember = members.some(m => m.uid === currentUid || (currentWallet && m.wallet === currentWallet));

  const handleToggleJoin = async () => {
    setLoading(true);
    try {
      if (isMember) {
        await leaveStudyGroup(groupId, currentUid);
        toast.info(`Left study group "${groupName}"`);
      } else {
        await joinStudyGroup(groupId, {
          uid: currentUid,
          name: currentName,
          wallet: currentWallet,
          avatar: `https://picsum.photos/seed/${currentUid}/100/100`
        });
        toast.success(`Joined study group "${groupName}"!`);
      }
    } catch (e) {
      toast.error('Failed to update group membership');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleToggleJoin}
      disabled={loading}
      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
        isMember
          ? 'bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 border border-red-500/20'
          : 'bg-emerald-500 hover:bg-emerald-600 text-white'
      }`}
    >
      {isMember ? (
        <>
          <UserMinus className="w-3.5 h-3.5" />
          <span>Leave Group</span>
        </>
      ) : (
        <>
          <UserPlus className="w-3.5 h-3.5" />
          <span>Join Study Group</span>
        </>
      )}
    </button>
  );
}
