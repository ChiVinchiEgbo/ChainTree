'use client';

import React from 'react';
import { Badge, Certificate } from '@/lib/types';
import { ShieldCheck, Award, ExternalLink, Calendar } from 'lucide-react';

interface BadgeGridProps {
  badges?: Badge[];
  certificates?: Certificate[];
}

export function BadgeGrid({ badges = [], certificates = [] }: BadgeGridProps) {
  return (
    <div className="space-y-6">
      {/* On-Chain Certificates */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">On-Chain Credentials</h3>
              <p className="text-xs text-zinc-500">Verified Solana cNFT certificates</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold px-2.5 py-1 bg-emerald-500/10 text-emerald-600 rounded-full">
            {certificates.length} Verified
          </span>
        </div>

        {certificates.length === 0 ? (
          <div className="text-center py-8 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl bg-zinc-50/50 dark:bg-zinc-800/20">
            <Award className="w-8 h-8 text-zinc-300 dark:text-zinc-600 mx-auto mb-2" />
            <p className="text-xs text-zinc-500 font-medium">No certificates minted yet</p>
            <p className="text-[11px] text-zinc-400 mt-1">Complete any bootcamp course to receive your on-chain cNFT credential.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certificates.map(cert => (
              <div
                key={cert.id}
                className="p-4 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 space-y-3 hover:border-emerald-500/40 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                      <ShieldCheck className="w-3 h-3" />
                      SOLANA DEVNET
                    </span>
                    <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">{cert.courseTitle}</h4>
                  </div>
                </div>

                <div className="space-y-1 text-xs text-zinc-500 font-mono">
                  <div className="flex items-center justify-between">
                    <span>Mint:</span>
                    <span className="font-bold text-zinc-700 dark:text-zinc-300">
                      {cert.mintAddress.slice(0, 6)}...{cert.mintAddress.slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Issued:</span>
                    <span className="text-zinc-700 dark:text-zinc-300">{cert.issueDate}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-700/60 flex items-center justify-between">
                  <a
                    href={`/verify?query=${cert.mintAddress}`}
                    className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
                  >
                    Verify Credential <ExternalLink className="w-3 h-3" />
                  </a>
                  <a
                    href={`https://solscan.io/token/${cert.mintAddress}?cluster=devnet`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] font-mono text-zinc-400 hover:text-zinc-600 flex items-center gap-1"
                  >
                    Solscan <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Achievement Badges */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 shadow-xs">
        <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100 mb-4 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-amber-500" />
          Achievement Badges
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {badges.map(badge => (
            <div
              key={badge.id}
              className="p-3.5 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0 font-bold">
                <Award className="w-5 h-5" />
              </div>
              <div className="space-y-0.5 min-w-0">
                <h4 className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">{badge.title}</h4>
                <p className="text-[11px] text-zinc-500 truncate">{badge.description}</p>
                <span className="text-[10px] font-mono text-zinc-400 block">{badge.dateEarned}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
