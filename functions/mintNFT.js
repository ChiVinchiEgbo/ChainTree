const { Connection, Keypair, PublicKey, clusterApiUrl } = require('@solana/web3.js')
const bs58 = require('bs58')

async function mint(cohort, nft_title, user, callback) {
  const rpcUrl = process.env.SOLANA_RPC_URL || clusterApiUrl('devnet')
  const connection = new Connection(rpcUrl, 'confirmed')

  let payer
  if (process.env.SOLANA_PRIVATE_KEY) {
    try {
      payer = Keypair.fromSecretKey(bs58.decode(process.env.SOLANA_PRIVATE_KEY))
    } catch (e) {
      payer = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(process.env.SOLANA_PRIVATE_KEY)))
    }
  } else {
    payer = Keypair.generate()
  }

  console.log(
    `Minting Solana Certificate NFT for ${nft_title} cohort ${cohort.name} for user: ${user.email} wallet: ${user.wallet}`
  )

  const recipientPublicKey = new PublicKey(user.wallet)
  const nftMintKeypair = Keypair.generate()

  console.log(`Generated Solana Certificate Mint: ${nftMintKeypair.publicKey.toBase58()}`)

  callback({
    cohort,
    course_title: nft_title,
    wallet_address: user.wallet,
    nft_contract: nftMintKeypair.publicKey.toBase58(),
    nft_id: nftMintKeypair.publicKey.toBase58(),
    user,
    user_id: user.id,
    cohort_id: cohort.id,
    cohort_name: cohort.name,
    created_at: new Date(),
  })
}

module.exports = { mint }