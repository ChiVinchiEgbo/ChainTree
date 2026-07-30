'use client';

import React from 'react';
import Link from 'next/link';
import { AppHeader } from './app-header';
import { Layers, ShieldCheck, Github, Twitter, Disc as Discord } from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#c5c3d1] dark:bg-[#1a1726] p-2 sm:p-4 lg:p-6 transition-colors font-sans antialiased">
      {/* Floating App Surface Panel */}
      <div className="max-w-[1440px] mx-auto bg-[#f5f4f0] dark:bg-[#121318] text-[#1a1a1a] dark:text-zinc-100 rounded-2xl sm:rounded-3xl lg:rounded-[2rem] border border-[#d5d3e0] dark:border-zinc-800 shadow-xl overflow-hidden min-h-[calc(100vh-2rem)] flex flex-col transition-colors">
        
        {/* Skip to Content for Accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-3 focus:bg-emerald-500 focus:text-white rounded-lg"
        >
          Skip to main content
        </a>

        {/* Header */}
        <AppHeader />

        {/* Main Content Area */}
        <main id="main-content" className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="border-t border-[#e5e5e5] dark:border-zinc-800/80 bg-[#f3f3f3]/50 dark:bg-zinc-900/40 py-8 px-4 sm:px-6 lg:px-8 mt-12">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 dark:text-zinc-400">
            
            {/* Left: Brand & Tagline */}
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white">
                <Layers className="w-4 h-4" />
              </div>
              <div>
                <span className="font-bold text-zinc-900 dark:text-zinc-200">ChainTree</span>
                <span className="mx-2">•</span>
                <span>Solana Web3 Learning Platform & Credential Engine</span>
              </div>
            </div>

            {/* Middle: Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 font-medium">
              <Link href="/courses" className="hover:text-emerald-600 transition-colors">Courses</Link>
              <Link href="/solana-bootcamp" className="hover:text-emerald-600 transition-colors">Bootcamp</Link>
              <Link href="/study-groups" className="hover:text-emerald-600 transition-colors">Study Groups</Link>
              <Link href="/staking" className="hover:text-emerald-600 transition-colors">Staking</Link>
              <Link href="/verify" className="hover:text-emerald-600 transition-colors">Credential Verifier</Link>
              <Link href="/faq" className="hover:text-emerald-600 transition-colors">FAQ</Link>
            </div>

            {/* Right: Socials & Devnet Badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono text-[11px] border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                <span>Solana Devnet</span>
              </div>
              <a
                href="https://github.com/chaintree-dev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 p-1"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/chaintree_dev"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 p-1"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://discord.gg/chaintree"
                target="_blank"
                rel="noreferrer"
                className="hover:text-zinc-900 dark:hover:text-zinc-100 p-1"
                aria-label="Discord"
              >
                <Discord className="w-4 h-4" />
              </a>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}
