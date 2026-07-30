import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { AppProviders } from '@/components/providers/AppProviders';
import { AppShell } from '@/components/learn/app-shell';

const geistSans = Geist({
  variable: '--font-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'ChainTree | Open-Source Web3 Developer Learning & Solana Credentials',
  description: 'Master Rust, Anchor, and Solana development with project-based bootcamps, collaborative study groups, and verifiable on-chain cNFT credentials.',
  keywords: ['Solana', 'Anchor', 'Rust', 'Web3', 'Blockchain', 'Bootcamp', 'cNFT', 'Developer Learning'],
  openGraph: {
    title: 'ChainTree | Solana Web3 Developer Platform',
    description: 'Learn Solana & Anchor, earn on-chain cNFT credentials, and stake tokens.',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="bg-[#c5c3d1] dark:bg-[#1a1726] antialiased selection:bg-emerald-500 selection:text-white">
        <AppProviders>
          <AppShell>
            {children}
          </AppShell>
        </AppProviders>
      </body>
    </html>
  );
}
