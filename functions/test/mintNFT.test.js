
const { mint } = require('../mintNFT')

describe('mint', () => {
  it('should mint a Solana NFT and call the callback with the expected data', async () => {
    const cohort = { name: 'cohort-name', id: 'cohort-id' }
    const nft_title = 'nft-title'
    const dummySolanaWallet = '11111111111111111111111111111111'
    const user = { email: 'user-email', wallet: dummySolanaWallet, id: 'user-id' }
    const callback = jest.fn()

    await mint(cohort, nft_title, user, callback)

    expect(callback).toHaveBeenCalledWith({
      cohort,
      course_title: nft_title,
      wallet_address: user.wallet,
      nft_contract: expect.any(String),
      nft_id: expect.any(String),
      user,
      user_id: user.id,
      cohort_id: cohort.id,
      cohort_name: cohort.name,
      created_at: expect.any(Date),
    })
  })
})
