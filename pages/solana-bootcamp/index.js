import Head from 'next/head'
import React from 'react'
import HomeCards from '../../components/Home/Cards'

export default function SolanaBootcampHome() {
  const cards = [
    '100% Free Web3 Education!',
    'Build your first Rust & Anchor Smart Contract on Solana!',
    'Project-based hands-on learning',
    'Earn Solana cNFT completion certificates',
    'Connect with Solana builders & mentors',
  ]

  return (
    <>
      <Head>
        <title>Solana & Anchor Bootcamp - ChainTree</title>
        <meta property="og:title" content="Solana & Anchor Bootcamp - ChainTree" />
        <meta
          property="og:description"
          content="Learn Solana development with Anchor. Build Web3 dApps on Solana with hands-on lessons and earn an NFT certificate."
        />
        <meta property="og:image:alt" content="Solana Bootcamp ChainTree" />
      </Head>
      <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-16 px-4">
        <div className="max-w-4xl w-full text-center">
          <h1 className="text-5xl font-extrabold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Solana & Anchor Smart Contract Bootcamp
          </h1>
          <p className="text-gray-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
            Master Rust programming, Anchor framework, and Metaplex Compressed NFTs on the fastest blockchain in Web3.
          </p>
          <HomeCards cards={cards} />
        </div>
      </div>
    </>
  )
}
