import React from 'react'
import Head from 'next/head'
import { Container, Text, Card, Grid, Row, Col, Spacer, Badge } from '@nextui-org/react'
import WalletHeader from '../../components/Staking/WalletHeader'
import SEOHead from '../../components/SEO'
import { TbCurrencySolana, TbCode, TbChecklist } from 'react-icons/tb'

export default function StakingPage() {
  return (
    <>
      <SEOHead
        title="Solana SPL Token Staking - ChainTree"
        description="Learn Solana smart contract development by staking SPL tokens, earning real-time rewards, and interacting with Anchor PDAs on Devnet."
        canonical="/staking"
        keywords={['solana', 'staking', 'spl token', 'anchor', 'rust', 'pda', 'devnet', 'chaintree']}
      />

      <div style={{ background: '#010101', minHeight: '100vh', paddingBottom: '60px' }}>
        <Container maxW="lg" css={{ pt: '$12' }}>
          {/* Header Banner */}
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Badge
              color="success"
              variant="flat"
              css={{ mb: '$4', fontSize: '13px', px: '$4', py: '$2', textTransform: 'uppercase', letterSpacing: '1px' }}
            >
              Solana Devnet Staking dApp
            </Badge>
            <Text
              h1
              size={42}
              weight="extrabold"
              css={{
                background: 'linear-gradient(135deg, #56F569 0%, #FFFFFF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: '$2',
              }}
            >
              SPL Token Staking Platform
            </Text>
            <Text size={18} css={{ color: '#A0A0A0', maxW: '650px', margin: '0 auto' }}>
              Stake test SPL tokens in an on-chain Anchor vault, earn real-time linear rewards, and explore Solana PDAs and account ownership.
            </Text>
          </div>

          {/* Phase 1: Wallet Connection & SOL Balance */}
          <WalletHeader />

          <Spacer y={2} />

          {/* Scaffold Overview Card */}
          <Card
            css={{
              background: 'rgba(20, 20, 25, 0.6)',
              border: '1px dashed rgba(86, 245, 105, 0.3)',
              borderRadius: '16px',
              padding: '$8',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <TbCode color="#56F569" size={28} />
              <Text h3 size={22} weight="bold" css={{ color: '#FFFFFF', margin: 0 }}>
                Phase 1 Project Scaffold Complete
              </Text>
            </div>

            <Text size={15} css={{ color: '#D8D8D8', mb: '$6' }}>
              The Anchor workspace and Next.js wallet connection are now fully wired up for Devnet!
            </Text>

            <Grid.Container gap={2}>
              <Grid xs={12} md={4}>
                <Card css={{ background: 'rgba(255, 255, 255, 0.03)', p: '$6', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Text weight="bold" size={16} css={{ color: '#56F569', mb: '$2' }}>
                    1. Wallet Adapter Integration
                  </Text>
                  <Text size={14} css={{ color: '#A0A0A0' }}>
                    Supports Phantom and Solflare wallets on Devnet with auto-reconnect and state persistence.
                  </Text>
                </Card>
              </Grid>

              <Grid xs={12} md={4}>
                <Card css={{ background: 'rgba(255, 255, 255, 0.03)', p: '$6', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Text weight="bold" size={16} css={{ color: '#56F569', mb: '$2' }}>
                    2. Devnet Faucet Airdrop
                  </Text>
                  <Text size={14} css={{ color: '#A0A0A0' }}>
                    Request 1 SOL directly from the devnet cluster to fund your wallet for smart contract transactions.
                  </Text>
                </Card>
              </Grid>

              <Grid xs={12} md={4}>
                <Card css={{ background: 'rgba(255, 255, 255, 0.03)', p: '$6', border: '1px solid rgba(255,255,255,0.08)' }}>
                  <Text weight="bold" size={16} css={{ color: '#56F569', mb: '$2' }}>
                    3. Anchor Smart Contract
                  </Text>
                  <Text size={14} css={{ color: '#A0A0A0' }}>
                    Program code located at <code style={{ color: '#56F569' }}>solana-programs/programs/chaintree_staking</code>.
                  </Text>
                </Card>
              </Grid>
            </Grid.Container>
          </Card>
        </Container>
      </div>
    </>
  )
}
