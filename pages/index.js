import React from 'react'
import HomeCards from '../components/Home/Cards'
import Main from '../components/Home'
import { getHomeCourse, defaultCourse } from '../lib/course'
import { useTranslation } from 'react-i18next'
import SEOHead from '../components/SEO'
import { buildOrganizationSchema } from '../components/SEO/schemas'

export default function Home({ course }) {
  const { t } = useTranslation()

  const cards = [
    t('home.cards.0'),
    t('home.cards.1'),
    t('home.cards.2'),
    t('home.cards.3'),
    t('home.cards.4'),
  ]

  return (
    <>
      <SEOHead
        title="ChainTree - Learn Web3 & Solana Development"
        description="Join ChainTree bootcamp to learn Solana, Rust, Anchor smart contracts, and Web3 technologies. Free courses with on-chain NFT certificates. Start your Web3 journey today!"
        canonical="/"
        keywords={['web3', 'solana', 'blockchain', 'bootcamp', 'smart contracts', 'NFT', 'Anchor', 'Rust', 'DeFi', 'chaintree']}
        ogImage={course?.image_url || 'https://build.w3d.community/og/og-home.png'}
        ogImageAlt="ChainTree Bootcamp - Web3 and Solana Blockchain Courses"
        jsonLd={buildOrganizationSchema()}
      />
      <Main course={course} />
      <HomeCards cards={cards} />
    </>
  )
}

export async function getServerSideProps() {
  return {
    props: {
      course: await getHomeCourse(),
    },
  }
}
