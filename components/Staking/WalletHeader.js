import React, { useEffect, useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Card, Text, Grid, Row, Col, Badge } from '@nextui-org/react'
import AirdropButton from './AirdropButton'
import { FaWallet, FaEthereum } from 'react-icons/fa'
import { TbCurrencySolana } from 'react-icons/tb'

// Dynamically import WalletMultiButton to avoid SSR hydration mismatches
const WalletMultiButton = dynamic(
  () => import('@solana/wallet-adapter-react-ui').then((mod) => mod.WalletMultiButton),
  { ssr: false }
)

export default function WalletHeader() {
  const { connection } = useConnection()
  const { publicKey, connected } = useWallet()
  const [solBalance, setSolBalance] = useState(null)
  const [loadingBalance, setLoadingBalance] = useState(false)

  const fetchBalance = useCallback(async () => {
    if (!publicKey) {
      setSolBalance(null)
      return
    }

    setLoadingBalance(true)
    try {
      const balance = await connection.getBalance(publicKey, 'confirmed')
      setSolBalance(balance / LAMPORTS_PER_SOL)
    } catch (err) {
      console.error('Error fetching SOL balance:', err)
    } finally {
      setLoadingBalance(false)
    }
  }, [connection, publicKey])

  useEffect(() => {
    fetchBalance()
    // Refresh balance every 15 seconds
    const interval = setInterval(fetchBalance, 15000)
    return () => clearInterval(interval)
  }, [fetchBalance])

  return (
    <Card
      css={{
        background: 'rgba(20, 20, 25, 0.85)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(86, 245, 105, 0.2)',
        borderRadius: '16px',
        padding: '$8',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      }}
    >
      <Grid.Container gap={2} alignItems="center" justify="space-between">
        {/* Wallet Connect Button & Network Status */}
        <Grid xs={12} sm={6} md={5}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <FaWallet color="#56F569" size={18} />
              <Text weight="bold" size={18} css={{ color: '#FFFFFF' }}>
                Wallet Connection
              </Text>
              <Badge
                color={connected ? 'success' : 'default'}
                variant="flat"
                css={{ fontSize: '11px', textTransform: 'uppercase' }}
              >
                {connected ? 'Devnet Connected' : 'Not Connected'}
              </Badge>
            </div>
            <div className="wallet-button-container">
              <WalletMultiButton />
            </div>
          </div>
        </Grid>

        {/* SOL Balance & Devnet Airdrop */}
        <Grid xs={12} sm={6} md={7}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '16px',
              width: '100%',
            }}
          >
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                padding: '10px 18px',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <TbCurrencySolana color="#56F569" size={24} />
              <div>
                <Text size={12} css={{ color: '#A0A0A0', lineHeight: 1 }}>
                  SOL Balance
                </Text>
                <Text weight="extrabold" size={18} css={{ color: '#56F569', lineHeight: 1.2 }}>
                  {connected
                    ? solBalance !== null
                      ? `${solBalance.toFixed(4)} SOL`
                      : 'Loading...'
                    : '---'}
                </Text>
              </div>
            </div>

            <AirdropButton onAirdropSuccess={fetchBalance} />
          </div>
        </Grid>
      </Grid.Container>

      <style jsx global>{`
        .wallet-button-container .wallet-adapter-button {
          background-color: #56f569 !important;
          color: #010101 !important;
          font-weight: 700 !important;
          border-radius: 12px !important;
          height: 44px !important;
          font-family: inherit !important;
          transition: all 0.2s ease !important;
        }
        .wallet-button-container .wallet-adapter-button:hover {
          background-color: #42c851 !important;
          transform: translateY(-1px);
        }
      `}</style>
    </Card>
  )
}
