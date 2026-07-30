'use client';

import React from 'react';
import { Shield, CheckCircle2, Zap } from 'lucide-react';

interface SkillRadarProps {
  skills?: string[];
}

export function SkillRadar({ skills = ['Rust', 'Anchor', 'TypeScript', 'Solana Pay', 'Metaplex', 'cNFTs'] }: SkillRadarProps) {
  const skillLevels: Record<string, number> = {
    Rust: 88,
    Anchor: 92,
    TypeScript: 95,
    'Solana Pay': 75,
    Metaplex: 85,
    cNFTs: 90,
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-500" />
            Developer Skill Breakdown
          </h3>
          <p className="text-xs text-zinc-500">Verified Web3 core competencies</p>
        </div>
        <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-xs font-bold">
          Level 4 Dev
        </span>
      </div>

      <div className="space-y-3.5">
        {skills.map(skill => {
          const score = skillLevels[skill] || 80;
          return (
            <div key={skill} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  {skill}
                </span>
                <span className="font-mono text-zinc-500 font-medium">{score}% Mastery</span>
              </div>
              <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700"
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
