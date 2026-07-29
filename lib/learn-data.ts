export type Track = {
  id: string
  title: string
  subtitle: string
  level: "Beginner" | "Intermediate" | "Advanced"
  lessons: number
  completed: number
  xp: number
  reward: string
  accent: string
}

export const tracks: Track[] = [
  {
    id: "solana-101",
    title: "Solana 101",
    subtitle: "Accounts, rent, and the runtime",
    level: "Beginner",
    lessons: 12,
    completed: 12,
    xp: 480,
    reward: "0.25 SOL",
    accent: "bg-emerald-500",
  },
  {
    id: "spl-tokens",
    title: "SPL Tokens",
    subtitle: "Mints, ATAs, and transfers",
    level: "Beginner",
    lessons: 9,
    completed: 6,
    xp: 320,
    reward: "0.15 SOL",
    accent: "bg-emerald-500",
  },
  {
    id: "anchor",
    title: "Anchor Programs",
    subtitle: "IDLs, PDAs, and CPI calls",
    level: "Intermediate",
    lessons: 14,
    completed: 4,
    xp: 210,
    reward: "1 cNFT",
    accent: "bg-yellow-400",
  },
  {
    id: "defi",
    title: "DeFi Primitives",
    subtitle: "AMMs, oracles, and liquidity",
    level: "Intermediate",
    lessons: 11,
    completed: 1,
    xp: 60,
    reward: "0.4 SOL",
    accent: "bg-orange-500",
  },
  {
    id: "sec",
    title: "Program Security",
    subtitle: "Signer checks and overflow",
    level: "Advanced",
    lessons: 8,
    completed: 0,
    xp: 0,
    reward: "1 SBT",
    accent: "bg-gray-300",
  },
  {
    id: "compression",
    title: "State Compression",
    subtitle: "Merkle trees and cNFTs",
    level: "Advanced",
    lessons: 7,
    completed: 0,
    xp: 0,
    reward: "0.6 SOL",
    accent: "bg-gray-300",
  },
]

export type Skill = { number: string; label: string; value: string; color: string }

export const skills: Skill[] = [
  { number: "1", label: "Accounts model", value: "82%", color: "bg-emerald-500" },
  { number: "2", label: "Transactions", value: "74%", color: "bg-emerald-500" },
  { number: "3", label: "SPL tokens", value: "61%", color: "bg-yellow-400" },
  { number: "4", label: "Anchor / Rust", value: "38%", color: "bg-orange-500" },
  { number: "5", label: "PDAs & CPI", value: "44%", color: "bg-orange-500" },
  { number: "6", label: "Security", value: "27%", color: "bg-orange-500" },
  { number: "7", label: "Tooling & CLI", value: "69%", color: "bg-yellow-400" },
]

export type Learner = {
  rank: number
  handle: string
  wallet: string
  xp: number
  streak: number
  badges: number
  you?: boolean
}

export const leaderboard: Learner[] = [
  { rank: 1, handle: "sol.dev", wallet: "7xKX…9fQa", xp: 18420, streak: 96, badges: 14 },
  { rank: 2, handle: "anchorlily", wallet: "3JmR…kL21", xp: 16980, streak: 71, badges: 12 },
  { rank: 3, handle: "pda.wizard", wallet: "9Qwe…Za77", xp: 15230, streak: 64, badges: 11 },
  { rank: 4, handle: "you", wallet: "5Hb9…Tv4c", xp: 12760, streak: 18, badges: 8, you: true },
  { rank: 5, handle: "mintmaster", wallet: "Bn4T…Qx09", xp: 11540, streak: 33, badges: 9 },
  { rank: 6, handle: "cnft.chad", wallet: "Ep2L…Mm5s", xp: 9870, streak: 12, badges: 6 },
  { rank: 7, handle: "rentexempt", wallet: "Gk8V…Rr3d", xp: 8410, streak: 7, badges: 5 },
]

export type Badge = {
  id: string
  name: string
  detail: string
  status: "owned" | "claimable" | "locked"
  iconType: "chart" | "list" | "book"
}

export const badges: Badge[] = [
  { id: "b1", name: "First Airdrop", detail: "Devnet faucet claimed", status: "owned", iconType: "chart" },
  { id: "b2", name: "Token Minter", detail: "Deployed an SPL mint", status: "owned", iconType: "list" },
  { id: "b3", name: "Anchor Initiate", detail: "Shipped first program", status: "claimable", iconType: "book" },
  { id: "b4", name: "PDA Adept", detail: "Complete Anchor track", status: "locked", iconType: "chart" },
  { id: "b5", name: "Auditor", detail: "Pass security quiz", status: "locked", iconType: "list" },
  { id: "b6", name: "Compressor", detail: "Mint 1k cNFTs", status: "locked", iconType: "book" },
]

export type Activity = {
  id: string
  label: string
  detail: string
  signature: string
  amount: string
  kind: "reward" | "mint" | "quiz" | "stake"
}

export const activity: Activity[] = [
  { id: "a1", label: "Lesson reward", detail: "SPL Tokens · Lesson 6", signature: "4kQ2…8Zpx", amount: "+12 XP", kind: "reward" },
  { id: "a2", label: "Badge minted", detail: "Token Minter cNFT", signature: "9Bd7…La3m", amount: "1 cNFT", kind: "mint" },
  { id: "a3", label: "Quiz passed", detail: "Accounts model · 9/10", signature: "2Tf5…Wq0v", amount: "+45 XP", kind: "quiz" },
  { id: "a4", label: "Payout claimed", detail: "Solana 101 completion", signature: "6Nm1…Yh8k", amount: "+0.25 SOL", kind: "reward" },
  { id: "a5", label: "Staked to learn", detail: "Anchor track deposit", signature: "8Pr3…Cd6j", amount: "-0.10 SOL", kind: "stake" },
]

export type Question = {
  prompt: string
  options: string[]
  answer: number
  explain: string
}

export const quiz: Question[] = [
  {
    prompt: "What does a Program Derived Address (PDA) let a program do?",
    options: [
      "Sign transactions on behalf of a keypair it owns",
      "Deterministically derive an address with no private key",
      "Store unlimited data for free",
      "Bypass rent exemption entirely",
    ],
    answer: 1,
    explain: "PDAs are derived from seeds and a program id, and fall off the ed25519 curve, so no private key exists.",
  },
  {
    prompt: "Which account must be marked mutable to receive an SPL token transfer?",
    options: ["The mint account", "The payer's system account", "The destination associated token account", "The token program"],
    answer: 2,
    explain: "The destination ATA holds the balance, so it must be writable for the transfer to land.",
  },
  {
    prompt: "What is rent exemption on Solana?",
    options: [
      "A minimum lamport balance that keeps an account alive",
      "A monthly fee paid to validators",
      "A discount on transaction fees",
      "A staking reward multiplier",
    ],
    answer: 0,
    explain: "Deposit at least the rent-exempt minimum and the account is never reaped for rent.",
  },
]
