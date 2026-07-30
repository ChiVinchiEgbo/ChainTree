'use client';

import React, { useState } from 'react';
import { HelpCircle, ChevronDown, Sparkles } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'What is ChainTree?',
    a: 'ChainTree is an open-source Web3 developer platform and on-chain credentialing engine built on Solana. It enables developers to learn Rust, Anchor, and Web3.js through project-based bootcamps and receive verifiable proof-of-completion cNFT credentials.'
  },
  {
    q: 'Are ChainTree bootcamps and courses free?',
    a: 'Yes! ChainTree bootcamps and developer tracks are 100% free and open-source.'
  },
  {
    q: 'How do compressed NFT (cNFT) credentials work?',
    a: 'Upon completing a course or bootcamp milestone, ChainTree calls Metaplex Token Metadata & Bubblegum SPL compressed NFT programs to mint a cNFT directly to your connected Solana wallet address.'
  },
  {
    q: 'How can recruiters or employers verify my certificates?',
    a: 'Anyone can visit the Public Verifier page (/verify) and input your Solana wallet address or cNFT mint signature to instantly verify your completion status against Solana RPC state.'
  },
  {
    q: 'How do TREE token staking and devnet SOL airdrops work?',
    a: 'Developers can request devnet SOL directly through the Staking Dashboard and stake TREE tokens to unlock higher XP multipliers and commitment badges.'
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-8 py-2 max-w-3xl mx-auto">
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xs text-center space-y-3">
        <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-500 w-fit mx-auto border border-emerald-500/20">
          <HelpCircle className="w-6 h-6" />
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          Everything you need to know about ChainTree, Solana cNFT credentials, and study groups.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-2xl overflow-hidden shadow-xs transition-all"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-4 sm:p-5 text-left font-bold text-xs sm:text-sm text-zinc-900 dark:text-zinc-100 flex items-center justify-between gap-4 hover:bg-zinc-50 dark:hover:bg-zinc-800/40 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              {isOpen && (
                <div className="px-4 pb-5 pt-1 text-xs text-zinc-600 dark:text-zinc-400 border-t border-[#e5e5e5] dark:border-zinc-800 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
