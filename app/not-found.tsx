import React from 'react';
import Link from 'next/link';
import { Layers, ArrowLeft, HelpCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="py-20 text-center max-w-md mx-auto space-y-6">
      <div className="w-16 h-16 rounded-3xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
        <Layers className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <span className="font-mono text-xs font-bold text-emerald-600 uppercase tracking-widest">404 - Page Not Found</span>
        <h1 className="text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">Solana Slot Empty</h1>
        <p className="text-xs text-zinc-500 leading-relaxed">
          The requested page or route does not exist on ChainTree. Return to the home dashboard or explore our developer courses.
        </p>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Link
          href="/"
          className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Return Home</span>
        </Link>
        <Link
          href="/courses"
          className="px-5 py-2.5 rounded-xl bg-[#f3f3f3] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold hover:bg-zinc-200 transition-colors"
        >
          Explore Courses
        </Link>
      </div>
    </div>
  );
}
