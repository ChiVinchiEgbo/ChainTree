import React, { useState } from 'react'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL } from '@solana/web3.js'
import { Button, Text, Loading } from '@nextui-org/react'
import { toast } from 'react-toastify'
import { FaCoins } from 'react-icons/fa'

export default function AirdropButton({ onAirdropSuccess }) {
  const { connection } = useConnection()
  const { publicKey } = useWallet()
  const [loading, setLoading] = useState(false)

  const handleAirdrop = async () => {
    if (!publicKey) {
      toast.error('Please connect your wallet first!')
      return
    }

    setLoading(true)
    try {
      toast.info('Requesting 1 SOL from Devnet Faucet...')
      
      // Request 1 SOL airdrop from Solana RPC
      const signature = await connection.requestAirdrop(
        publicKey,
        1 * LAMPORTS_PER_SOL
      )

      // Confirm transaction using confirmed commitment
      const latestBlockhash = await connection.getLatestBlockhash()
      await connection.confirmTransaction(
        {
          signature,
          blockhash: latestBlockhash.blockhash,
          lastValidBlockHeight: latestBlockhash.lastValidBlockHeight,
        },
        'confirmed'
      )

      toast.success('Successfully airdropped 1 SOL!')
      if (onAirdropSuccess) {
        onAirdropSuccess()
      }
    } catch (err) {
      console.error('Airdrop error:', err)
      toast.error(
        err?.message?.includes('429') || err?.message?.includes('Rate limit')
          ? 'Devnet rate limit reached! Try again in a minute or use faucet.solana.com'
          : 'Airdrop failed. Devnet faucets can be congested.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      auto
      flat
      color="success"
      disabled={!publicKey || loading}
      onClick={handleAirdrop}
      icon={loading ? <Loading type="points" color="currentColor" size="sm" /> : <FaCoins size={16} />}
      css={{
        background: 'rgba(86, 245, 105, 0.15)',
        color: '#56F569',
        border: '1px solid #56F569',
        fontWeight: '$bold',
        '&:hover': {
          background: 'rgba(86, 245, 105, 0.25)',
        },
      }}
    >
      <Text weight="bold" css={{ color: '#56F569', ml: '$2' }}>
        {loading ? 'Airdropping...' : 'Request 1 SOL (Devnet)'}
      </Text>
    </Button>
  )
}
