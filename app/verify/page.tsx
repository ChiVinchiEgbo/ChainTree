'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { dataSource } from '@/lib/data';
import { Certificate } from '@/lib/types';
import { ShieldCheck, Search, ExternalLink, CheckCircle2, XCircle } from 'lucide-react';

function VerifierContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('query') || '';

  const [queryInput, setQueryInput] = useState(initialQuery);
  const [result, setResult] = useState<Certificate | null>(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleVerify = async (query: string) => {
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    try {
      const cert = await dataSource.verifyCertificate(query.trim());
      setResult(cert);
    } catch (e) {
      console.error(e);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) {
      handleVerify(initialQuery);
    }
  }, [initialQuery]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleVerify(queryInput);
  };

  return (
    <div className="space-y-8 py-2 max-w-4xl mx-auto">
      {/* Search Banner */}
      <div className="bg-white dark:bg-zinc-900 border border-[#e5e5e5] dark:border-zinc-800 rounded-3xl p-6 sm:p-10 shadow-xs space-y-6 text-center">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex items-center justify-center mx-auto">
          <ShieldCheck className="w-6 h-6" />
        </div>

        <div className="space-y-2 max-w-xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-zinc-900 dark:text-zinc-100 tracking-tight">
            Solana Credential Public Verifier
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Validate ChainTree on-chain developer certificates directly against Solana RPC state. Input any mint address, wallet address, or transaction signature.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="max-w-xl mx-auto flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Paste Solana cNFT Mint Address, Wallet, or Tx..."
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              className="w-full pl-10 pr-4 py-3 text-xs font-mono bg-[#f8f8f8] dark:bg-zinc-800 border border-[#e5e5e5] dark:border-zinc-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-zinc-900 dark:text-zinc-100"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-xs shadow-md transition-colors shrink-0"
          >
            {loading ? 'Verifying...' : 'Verify Now'}
          </button>
        </form>
      </div>

      {/* Result Output */}
      {searched && (
        <div className="space-y-4">
          {result ? (
            <div className="bg-white dark:bg-zinc-900 border-2 border-emerald-500/50 rounded-3xl p-6 sm:p-8 shadow-md space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                  </span>
                  <div>
                    <h3 className="font-extrabold text-lg text-emerald-600 dark:text-emerald-400">
                      Authentic Credential Verified
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono">Confirmed via Solana Devnet RPC</p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full border border-emerald-500/20">
                  Status: VERIFIED
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-[#f8f8f8] dark:bg-zinc-800/60 border border-[#e5e5e5] dark:border-zinc-700/60 text-xs">
                <div>
                  <span className="text-zinc-400 font-mono block mb-1">Course Credential</span>
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">{result.courseTitle}</span>
                </div>

                <div>
                  <span className="text-zinc-400 font-mono block mb-1">Recipient Student</span>
                  <span className="font-bold text-sm text-zinc-900 dark:text-zinc-100 block">{result.studentName}</span>
                </div>

                <div>
                  <span className="text-zinc-400 font-mono block mb-1">Solana Mint Address</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200 block truncate">{result.mintAddress}</span>
                </div>

                <div>
                  <span className="text-zinc-400 font-mono block mb-1">Issued Date</span>
                  <span className="font-mono text-zinc-800 dark:text-zinc-200 block">{result.issueDate}</span>
                </div>
              </div>

              {/* Block Explorer Links */}
              <div className="pt-4 border-t border-[#e5e5e5] dark:border-zinc-800 flex flex-wrap items-center gap-3">
                <a
                  href={`https://solscan.io/token/${result.mintAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 transition-colors"
                >
                  <span>View on Solscan</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <a
                  href={`https://explorer.solana.com/address/${result.mintAddress}?cluster=devnet`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-[#f3f3f3] dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-200 transition-colors"
                >
                  <span>View on Solana Explorer</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-zinc-900 border border-red-500/30 rounded-3xl p-8 text-center space-y-2">
              <XCircle className="w-8 h-8 text-red-500 mx-auto" />
              <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-100">No Verified Credential Found</h3>
              <p className="text-xs text-zinc-500 max-w-md mx-auto">
                We could not find a verified cNFT certificate matching <code className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">{queryInput}</code> on Solana Devnet.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifierPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-zinc-500 font-mono">Loading credential verifier...</div>}>
      <VerifierContent />
    </Suspense>
  );
}
