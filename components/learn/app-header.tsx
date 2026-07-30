'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useTheme } from 'next-themes';
import {
  Sparkles,
  BookOpen,
  Users,
  Coins,
  ShieldCheck,
  Search,
  Sun,
  Moon,
  User,
  LogOut,
  LogIn,
  Settings,
  Layers,
  Award,
  ChevronDown,
  Menu,
  X
} from 'lucide-react';
import { WalletPanel } from './wallet-panel';

export function AppHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const navItems = [
    { label: 'Home', href: '/', icon: Sparkles },
    { label: 'Courses', href: '/courses', icon: BookOpen },
    { label: 'Bootcamp', href: '/solana-bootcamp', icon: Layers },
    { label: 'Study Groups', href: '/study-groups', icon: Users },
    { label: 'Staking', href: '/staking', icon: Coins },
    { label: 'Verify', href: '/verify', icon: ShieldCheck },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#f5f4f0]/90 dark:bg-[#121318]/90 backdrop-blur-md border-b border-[#e5e5e5] dark:border-zinc-800 transition-colors">
      <div className="w-full px-5 sm:px-7 lg:px-8 h-16 flex items-center justify-between gap-3 sm:gap-4">
        
        {/* Brand Logo & Wordmark */}
        <Link href="/" className="flex items-center gap-2.5 group shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
            <Layers className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-[#1a1a1a] dark:text-zinc-100 flex items-center gap-1">
              ChainTree
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                Solana
              </span>
            </span>
          </div>
        </Link>

        {/* Desktop Primary Nav */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#f3f3f3] dark:bg-zinc-800/60 p-1 rounded-full border border-[#e5e5e5] dark:border-zinc-700/60">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-full transition-all ${
                  isActive
                    ? 'bg-white dark:bg-zinc-900 text-emerald-600 dark:text-emerald-400 shadow-xs font-semibold'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-white/50 dark:hover:bg-zinc-800/50'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Quick Search */}
          <form onSubmit={handleSearchSubmit} className="hidden md:flex items-center relative">
            <Search className="w-3.5 h-3.5 absolute left-3 text-zinc-400" />
            <input
              type="text"
              placeholder="Search courses, Rust..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-36 lg:w-48 xl:w-56 pl-8 pr-3 py-1.5 text-xs bg-[#f3f3f3] dark:bg-zinc-800/80 border border-[#e5e5e5] dark:border-zinc-700 rounded-full focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 transition-all"
            />
          </form>

          {/* Wallet Panel */}
          <WalletPanel />

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 rounded-full bg-[#f3f3f3] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors shrink-0"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-zinc-600" />}
          </button>

          {/* User Profile / Auth Menu */}
          {session?.user ? (
            <div className="relative shrink-0">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-1.5 bg-[#f3f3f3] dark:bg-zinc-800 p-1 pl-2.5 pr-2 rounded-full border border-[#e5e5e5] dark:border-zinc-700 hover:border-emerald-500/50 transition-colors whitespace-nowrap shrink-0"
              >
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                  {session.user.name?.[0]?.toUpperCase() || 'D'}
                </div>
                <span className="text-xs font-medium max-w-[80px] truncate text-zinc-800 dark:text-zinc-200">
                  {session.user.name?.split(' ')[0] || 'Dev'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-400 shrink-0" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-2xl shadow-lg p-1.5 z-50 text-xs">
                  <div className="px-3 py-2 border-b border-zinc-100 dark:border-zinc-800 mb-1">
                    <div className="font-semibold text-zinc-900 dark:text-zinc-100">{session.user.name}</div>
                    <div className="text-[11px] text-zinc-500 truncate">{session.user.email}</div>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 text-emerald-500" />
                    <span>My Dashboard</span>
                  </Link>
                  <Link
                    href="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <Settings className="w-3.5 h-3.5 text-amber-500" />
                    <span>Admin Panel</span>
                  </Link>
                  <button
                    onClick={() => {
                      setUserMenuOpen(false);
                      signOut();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors text-left mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/auth"
              className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-full text-xs font-semibold shadow-xs transition-colors whitespace-nowrap shrink-0"
            >
              <LogIn className="w-3.5 h-3.5 shrink-0" />
              <span>Sign In</span>
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="lg:hidden p-1.5 rounded-xl bg-[#f3f3f3] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 text-zinc-700 dark:text-zinc-300"
          >
            {mobileNavOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      {mobileNavOpen && (
        <div className="lg:hidden border-t border-[#e5e5e5] dark:border-zinc-800 bg-[#f5f4f0] dark:bg-[#121318] px-4 py-3 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileNavOpen(false)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-sm font-medium ${
                  isActive
                    ? 'bg-emerald-500 text-white font-semibold'
                    : 'text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200/50 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
