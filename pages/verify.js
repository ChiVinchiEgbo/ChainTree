import React, { useState } from 'react'
import Head from 'next/head'
import { isValidSolanaAddress } from '../lib/user'

export default function CertificateVerifier() {
  const [query, setQuery] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleVerify = (e) => {
    e.preventDefault()
    setError('')
    setResult(null)

    const trimmed = query.trim()
    if (!trimmed) {
      setError('Please enter a Solana Mint Address or Transaction Signature.')
      return
    }

    if (!isValidSolanaAddress(trimmed) && trimmed.length < 64) {
      setError('Invalid Solana Mint Address or Signature format.')
      return
    }

    const solscanUrl = trimmed.length >= 64
      ? `https://solscan.io/tx/${trimmed}?cluster=devnet`
      : `https://solscan.io/token/${trimmed}?cluster=devnet`

    const explorerUrl = trimmed.length >= 64
      ? `https://explorer.solana.com/tx/${trimmed}?cluster=devnet`
      : `https://explorer.solana.com/address/${trimmed}?cluster=devnet`

    setResult({
      address: trimmed,
      type: trimmed.length >= 64 ? 'Transaction Signature' : 'Solana NFT Mint Address',
      solscanUrl,
      explorerUrl,
      verifiedAt: new Date().toLocaleString(),
    })
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-16 px-4">
      <Head>
        <title>Solana Certificate Verifier | ChainTree</title>
        <meta name="description" content="Verify ChainTree Bootcamp course completion certificate NFTs on Solana" />
      </Head>

      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-extrabold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Solana Certificate Verifier
        </h1>
        <p className="text-gray-300 mb-8 text-lg">
          Verify the authenticity of ChainTree Bootcamp course completion NFTs directly on the Solana blockchain.
        </p>

        <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-3 mb-8">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Paste Solana Mint Address or Transaction Signature..."
            className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 text-sm sm:text-base"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Verify
          </button>
        </form>

        {error && (
          <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200 mb-6">
            {error}
          </div>
        )}

        {result && (
          <div className="p-6 bg-gray-800 border border-purple-500/50 rounded-xl text-left shadow-2xl">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-green-400 text-xl">✅</span>
              <h2 className="text-xl font-bold text-white">Valid Solana Format Detected</h2>
            </div>
            
            <div className="space-y-3 text-sm text-gray-300">
              <p><strong className="text-gray-100">Type:</strong> {result.type}</p>
              <p><strong className="text-gray-100">Identifier:</strong> <code className="break-all bg-gray-900 px-2 py-1 rounded text-purple-300">{result.address}</code></p>
              <p><strong className="text-gray-100">Verified At:</strong> {result.verifiedAt}</p>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 pt-4 border-t border-gray-700">
              <a
                href={result.solscanUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded text-sm transition-colors"
              >
                View on Solscan ↗
              </a>
              <a
                href={result.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-purple-800 hover:bg-purple-900 text-white font-medium rounded text-sm transition-colors"
              >
                View on Solana Explorer ↗
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
