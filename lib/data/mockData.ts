import { Course, StudyGroup, Cohort, LeaderboardItem, UserProfile, PlatformStats, Certificate, Badge } from '../types';

export const MOCK_COURSES: Course[] = [
  {
    id: 'solana-anchor-fundamentals',
    index: 1,
    title: 'Solana & Anchor Smart Contract Fundamentals',
    slug: 'solana-anchor-fundamentals',
    description: 'Master Rust and the Anchor Framework to build high-performance, secure programs on the Solana blockchain.',
    image: 'https://picsum.photos/seed/solana-anchor/800/450',
    level: 'Beginner',
    tags: ['Rust', 'Anchor', 'Solana', 'Smart Contracts'],
    instructor: {
      name: 'Armani Ferrante',
      avatar: 'https://picsum.photos/seed/armani/100/100',
      title: 'Solana Core Contributor & Anchor Creator',
    },
    duration: '12 Hours • 4 Sections',
    enrolledCount: 1420,
    certificateMintable: true,
    sections: [
      {
        title: 'Section 1: Solana Architecture & Account Model',
        lessons: [
          {
            title: '1.1 Introduction to Solana Runtime & Accounts',
            slug: 'intro-solana-runtime',
            duration: '25 mins',
            content: `
# 1.1 Introduction to Solana Runtime & Accounts

Welcome to **ChainTree's Solana & Anchor Fundamentals** course!

Unlike EVM-based blockchains (like Ethereum) where smart contracts hold state in contract storage, Solana separates **code** from **data**.

## Core Concepts

1. **Executables vs Data Accounts**: On Solana, code lives in an *executable account* (Program). Data lives in separate *data accounts* owned by that program.
2. **Program Derived Addresses (PDAs)**: Deterministically derived addresses that allow smart contracts to sign transactions without possessing a private key.
3. **Lamports**: The fractional unit of SOL (1 SOL = 1,000,000,000 lamports).

\`\`\`rust
// Example Solana Account Info in Rust
pub struct AccountInfo<'a> {
    pub key: &'a Pubkey,
    pub is_signer: bool,
    pub is_writable: bool,
    pub lamports: Rc<RefCell<&'a mut u64>>,
    pub data: Rc<RefCell<&'a mut [u8]>>,
    pub owner: &'a Pubkey,
    pub executable: bool,
    pub rent_epoch: Epoch,
}
\`\`\`

### Key Takeaway
Solana programs are completely stateless logic handlers that operate on accounts passed into the instruction.
            `,
            resources: [
              { title: 'Solana Docs: Account Model', url: 'https://docs.solana.com/developing/programming-model/accounts' },
              { title: 'Anchor Documentation', url: 'https://www.anchor-lang.com/' }
            ]
          },
          {
            title: '1.2 Understanding Program Derived Addresses (PDAs)',
            slug: 'understanding-pdas',
            duration: '35 mins',
            content: `
# 1.2 Program Derived Addresses (PDAs)

PDAs are the bedrock of state management and access control in Anchor and Solana.

## How PDAs Work
A PDA is created by hashing a set of **seeds** together with a **Program ID**. If the resulting point lies off the Ed25519 elliptic curve, it is a valid PDA with a "bump seed".

\`\`\`rust
use anchor_lang::prelude::*;

#[account]
pub struct UserProfile {
    pub authority: Pubkey, // 32 bytes
    pub streak_count: u16,  // 2 bytes
    pub bump: u8,           // 1 byte
}

#[derive(Accounts)]
pub struct InitializeUser<'info> {
    #[account(
        init,
        payer = user,
        space = 8 + 32 + 2 + 1,
        seeds = [b"user-profile", user.key().as_ref()],
        bump
    )]
    pub user_profile: Account<'info, UserProfile>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}
\`\`\`
            `,
            resources: [
              { title: 'Anchor PDA Guide', url: 'https://www.anchor-lang.com/docs/pdas' }
            ]
          }
        ]
      },
      {
        title: 'Section 2: Writing your first Anchor Program',
        lessons: [
          {
            title: '2.1 Initializing Anchor & Declare ID',
            slug: 'init-anchor-declare-id',
            duration: '30 mins',
            content: `
# 2.1 Initializing Anchor & Declare ID

Anchor abstracts away low-level Solana boilerplate like manual borsh serialization and account validation.

\`\`\`rust
use anchor_lang::prelude::*;

declare_id!("C3TreeStakingProg1111111111111111111111111");

#[program]
pub mod chaintree_counter {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count = 0;
        msg!("Counter initialized to 0!");
        Ok(())
    }

    pub fn increment(ctx: Context<Increment>) -> Result<()> {
        let counter = &mut ctx.accounts.counter;
        counter.count += 1;
        msg!("Counter incremented to {}", counter.count);
        Ok(())
    }
}

#[account]
pub struct Counter {
    pub count: u64,
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(init, payer = user, space = 8 + 8)]
    pub counter: Account<'info, Counter>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter: Account<'info, Counter>,
}
\`\`\`
            `
          },
          {
            title: '2.2 Client-Side Integration with @solana/web3.js',
            slug: 'client-integration-web3js',
            duration: '40 mins',
            content: `
# 2.2 Client-Side Integration with @solana/web3.js

Connect your React or Next.js app to your Anchor program using AnchorProvider and Program.

\`\`\`typescript
import { Program, AnchorProvider, web3 } from '@coral-xyz/anchor';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export function useChainTreeCounter() {
  const { connection } = useConnection();
  const wallet = useWallet();

  const incrementCounter = async () => {
    if (!wallet.publicKey) return;
    const provider = new AnchorProvider(connection, wallet as any, {});
    const program = new Program(IDL, PROGRAM_ID, provider);

    const tx = await program.methods
      .increment()
      .accounts({
        counter: counterPda,
      })
      .rpc();

    console.log("Tx signature:", tx);
  };

  return { incrementCounter };
}
\`\`\`
            `
          }
        ]
      }
    ]
  },
  {
    id: 'metaplex-cnfts-credentials',
    index: 2,
    title: 'Metaplex Compressed NFTs & On-Chain Credentialing',
    slug: 'metaplex-cnfts-credentials',
    description: 'Learn to mint thousands of verfiable credential cNFTs for pennies using Bubblegum and Concurrent Merkle Trees.',
    image: 'https://picsum.photos/seed/cnft-metaplex/800/450',
    level: 'Intermediate',
    tags: ['cNFT', 'Metaplex', 'Credentials', 'Solana'],
    instructor: {
      name: 'Anatoly Yakovenko',
      avatar: 'https://picsum.photos/seed/anatoly/100/100',
      title: 'Solana Co-Founder',
    },
    duration: '8 Hours • 3 Sections',
    enrolledCount: 980,
    certificateMintable: true,
    sections: [
      {
        title: 'Section 1: State Compression & Merkle Trees',
        lessons: [
          {
            title: '1.1 Understanding State Compression on Solana',
            slug: 'understanding-state-compression',
            duration: '30 mins',
            content: `
# 1.1 Understanding State Compression on Solana

Standard SPL NFTs store metadata directly in account data, costing ~0.012 SOL per mint. State Compression stores metadata off-chain inside a **Concurrent Merkle Tree** on Solana.

## Cost Comparison
- **10,000 Standard NFTs**: ~$120 SOL (~$18,000 USD)
- **10,000 Compressed cNFTs**: ~$0.005 SOL (~$0.75 USD)

This enables ChainTree to issue instant, free, verifiable credentials for every completed bootcamp lesson!
            `
          }
        ]
      }
    ]
  },
  {
    id: 'solana-pay-defi',
    index: 3,
    title: 'Solana Pay & DeFi Protocol Architecture',
    slug: 'solana-pay-defi',
    description: 'Build real-world DeFi applications including staking pools, automated market makers (AMMs), and payment channels.',
    image: 'https://picsum.photos/seed/solana-defi/800/450',
    level: 'Advanced',
    tags: ['DeFi', 'Staking', 'Solana Pay', 'Anchor'],
    instructor: {
      name: 'Raj Gokal',
      avatar: 'https://picsum.photos/seed/raj/100/100',
      title: 'Solana Co-Founder',
    },
    duration: '15 Hours • 5 Sections',
    enrolledCount: 750,
    certificateMintable: true,
    sections: [
      {
        title: 'Section 1: Staking Vault Architecture',
        lessons: [
          {
            title: '1.1 Designing an On-Chain Staking Vault',
            slug: 'designing-staking-vault',
            duration: '45 mins',
            content: `
# 1.1 Designing an On-Chain Staking Vault

In this lesson, you will learn how to write a staking program where users lock SPL tokens into a vault account to earn reward tokens over time.

\`\`\`rust
#[account]
pub struct StakeDeposit {
    pub owner: Pubkey,
    pub amount: u64,
    pub start_slot: u64,
    pub last_claim_slot: u64,
}
\`\`\`
            `
          }
        ]
      }
    ]
  }
];

export const MOCK_STUDY_GROUPS: StudyGroup[] = [
  {
    id: 'sg-anchor-builders',
    index: 1,
    name: 'Anchor Smart Contract Cohort #4',
    slug: 'anchor-smart-contract-cohort-4',
    description: 'Weekly deep dives into Anchor program security, PDA seeds, CPIs, and Rust macro debugging with fellow Solana developers.',
    scheduled_at: new Date(Date.now() + 86400000 * 2).toISOString(), // 2 days from now
    members: [
      { uid: 'u1', name: 'Alex Rivera', avatar: 'https://picsum.photos/seed/u1/100/100', wallet: '8x2P...4mQ1' },
      { uid: 'u2', name: 'Sarah Chen', avatar: 'https://picsum.photos/seed/u2/100/100', wallet: '4kL9...9pX2' },
      { uid: 'u3', name: 'Devon Vance', avatar: 'https://picsum.photos/seed/u3/100/100', wallet: '7mR3...1sA9' },
    ],
    discordUrl: 'https://discord.gg/chaintree',
    courseId: 'solana-anchor-fundamentals'
  },
  {
    id: 'sg-cnft-builders',
    index: 2,
    name: 'Compressed NFT Credentialing Lab',
    slug: 'compressed-nft-credentialing-lab',
    description: 'Hands-on practice building Metaplex Bubblegum trees, indexing compressed NFTs, and validating on-chain proofs.',
    scheduled_at: new Date(Date.now() + 86400000 * 4).toISOString(),
    members: [
      { uid: 'u4', name: 'Marcus Brody', avatar: 'https://picsum.photos/seed/u4/100/100', wallet: '9aB1...8vC3' },
      { uid: 'u5', name: 'Elena Rostova', avatar: 'https://picsum.photos/seed/u5/100/100', wallet: '2xY7...5zW9' },
    ],
    discordUrl: 'https://discord.gg/chaintree',
    courseId: 'metaplex-cnfts-credentials'
  },
  {
    id: 'sg-defi-architects',
    index: 3,
    name: 'DeFi Staking & Vault Architects',
    slug: 'defi-staking-vault-architects',
    description: 'Collaborative study group focusing on liquidity pools, yield farming contracts, and Solana Pay point-of-sale integrations.',
    scheduled_at: new Date(Date.now() + 86400000 * 6).toISOString(),
    members: [
      { uid: 'u6', name: 'Kenji Sato', avatar: 'https://picsum.photos/seed/u6/100/100', wallet: '5hJ4...3kM8' },
      { uid: 'u7', name: 'Liam O\'Connor', avatar: 'https://picsum.photos/seed/u7/100/100', wallet: '3pL1...7nR4' },
    ],
    discordUrl: 'https://discord.gg/chaintree',
    courseId: 'solana-pay-defi'
  }
];

export const MOCK_COHORTS: Cohort[] = [
  {
    id: 'cohort-summer-2026',
    index: 1,
    name: 'Solana Summer 2026 Developer Bootcamp',
    schedule: 'Mondays & Thursdays • 17:00 UTC',
    members: ['u1', 'u2', 'u3', 'u4', 'u5'],
    courseId: 'solana-anchor-fundamentals',
    discordUrl: 'https://discord.gg/chaintree-cohort'
  }
];

export const MOCK_LEADERBOARD: LeaderboardItem[] = [
  { rank: 1, uid: 'u1', name: 'Alex Rivera', wallet: '8x2P9k...4mQ1', points: 4250, coursesCompleted: 3, streakDays: 18, avatar: 'https://picsum.photos/seed/u1/100/100' },
  { rank: 2, uid: 'u2', name: 'Sarah Chen', wallet: '4kL9aB...9pX2', points: 3890, coursesCompleted: 3, streakDays: 14, avatar: 'https://picsum.photos/seed/u2/100/100' },
  { rank: 3, uid: 'u3', name: 'Devon Vance', wallet: '7mR3vC...1sA9', points: 3120, coursesCompleted: 2, streakDays: 11, avatar: 'https://picsum.photos/seed/u3/100/100' },
  { rank: 4, uid: 'u4', name: 'Marcus Brody', wallet: '9aB1xY...8vC3', points: 2750, coursesCompleted: 2, streakDays: 8, avatar: 'https://picsum.photos/seed/u4/100/100' },
  { rank: 5, uid: 'u5', name: 'Elena Rostova', wallet: '2xY7hJ...5zW9', points: 2100, coursesCompleted: 1, streakDays: 5, avatar: 'https://picsum.photos/seed/u5/100/100' },
];

export const MOCK_STATS: PlatformStats = {
  totalDevelopers: 3480,
  coursesCompleted: 5920,
  certificatesMinted: 4150,
  activeStudyGroups: 24,
  totalSolStaked: 18450,
};

export const MOCK_BADGES: Badge[] = [
  {
    id: 'badge-anchor-master',
    title: 'Anchor Pioneer',
    iconName: 'ShieldCheck',
    description: 'Completed Solana & Anchor Smart Contract Fundamentals course.',
    dateEarned: '2026-06-15'
  },
  {
    id: 'badge-cnft-minter',
    title: 'cNFT Architect',
    iconName: 'Award',
    description: 'Minted first verifiable Metaplex compressed NFT credential.',
    dateEarned: '2026-07-02'
  },
  {
    id: 'badge-staker',
    title: 'Solana Staker',
    iconName: 'Coins',
    description: 'Staked 10+ TREE tokens in the ChainTree vault program.',
    dateEarned: '2026-07-20'
  }
];

export const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 'cert-solana-anchor-001',
    courseId: 'solana-anchor-fundamentals',
    courseTitle: 'Solana & Anchor Smart Contract Fundamentals',
    studentName: 'Alex Rivera',
    walletAddress: '8x2P9kL3mV7qY4nR1zW8sA6tP0cB1dE2fG3hI4mQ1',
    mintAddress: 'Cert7x9P2mL4qY8nW1zA6tP0cB1dE2fG3hI4mQ1pX2z',
    txHash: '5xY9aB2mC3dE4fG5hI6jK7lM8nO9pQ0rS1tU2vW3xY4z5aB6cD7eF8gH9iJ0kL',
    issueDate: '2026-06-15',
    status: 'verified',
    imageUrl: 'https://picsum.photos/seed/cert-anchor/800/600'
  }
];

export const MOCK_USER_PROFILE: UserProfile = {
  uid: 'u1',
  name: 'Alex Rivera',
  email: 'alex.rivera@chaintree.dev',
  wallet: '8x2P9kL3mV7qY4nR1zW8sA6tP0cB1dE2fG3hI4mQ1',
  photoURL: 'https://picsum.photos/seed/u1/100/100',
  bio: 'Full-stack Web3 developer building decentralized applications on Solana and Anchor.',
  role: 'Solana Smart Contract Engineer',
  company: 'Solana Ecosystem Labs',
  skills: ['Rust', 'Anchor', 'TypeScript', 'React', 'Metaplex', 'Web3.js'],
  github: 'https://github.com/alexrivera-dev',
  twitter: 'https://twitter.com/alexrivera_sol',
  linkedin: 'https://linkedin.com/in/alexrivera-web3',
  progress: {
    'solana-anchor-fundamentals': {
      completedLessons: ['intro-solana-runtime', 'understanding-pdas', 'init-anchor-declare-id'],
      percent: 75,
      lastAccessedLesson: 'client-integration-web3js'
    }
  },
  badges: MOCK_BADGES,
  certificates: MOCK_CERTIFICATES,
  createdAt: '2026-01-10T12:00:00Z'
};
