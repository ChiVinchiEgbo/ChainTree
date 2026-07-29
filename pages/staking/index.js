import React from 'react'
import dynamic from 'next/dynamic'
import SEOHead from '../../components/SEO'

// Dynamically import StakingDashboard to disable SSR for browser wallet adapter
const StakingDashboard = dynamic(
  () => import('../../components/Staking/StakingDashboard'),
  { ssr: false }
)

export default function StakingPage() {
  return (
    <>
      <SEOHead
        title="SPL Token Staking Platform - ChainTree SolAcademy"
        description="Learn Solana development by staking SPL tokens, earning real-time linear rewards, and managing on-chain Anchor PDAs on Devnet."
        canonical="/staking"
        keywords={['solana', 'staking', 'spl token', 'anchor', 'rust', 'pda', 'devnet', 'chaintree']}
      />
      <StakingDashboard />
    </>
  )
}
