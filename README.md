# ChainTree 🌲⚡

> **Open-Source Solana Web3 Developer Learning Platform & On-Chain Credential Engine**

ChainTree bridges developer education with on-chain verification on Solana. Learn **Rust**, **Anchor Framework**, **Metaplex Compressed NFTs (cNFTs)**, and **Solana Pay/DeFi** through interactive bootcamps, collaborate in peer study groups, stake TREE tokens, and receive verifiable cNFT credentials directly to your Web3 wallet.

---

## 🚀 Key Features

- 📚 **Interactive Solana Bootcamps**: Step-by-step tracks covering Rust fundamentals, Anchor smart contracts, and Web3.js client integration.
- 🏅 **On-Chain cNFT Credentials**: Receive Metaplex Bubblegum compressed NFTs minted directly to your connected Solana wallet upon completing courses.
- 🛡️ **Public Credential Verifier**: Validate developer certificates, mint addresses, wallet addresses, or transaction hashes directly against Solana RPC state, complete with Solscan & Solana Explorer links.
- 👥 **Peer-to-Peer Study Groups**: Join cohort groups with scheduled meetups, Discord integration, member rosters, and one-click `.ics` calendar exports.
- 🪙 **Anchor Staking Vault**: Stake TREE tokens to lock in commitment streaks, boost XP multipliers, earn yields, and claim Solana Devnet SOL airdrops.
- 🏆 **Builder Leaderboard & Profiles**: Verified developer profiles featuring skill breakdown radars, streak counters, and earned badge displays.
- ⚙️ **Admin Console**: Management interface to create new study groups, update rosters, and monitor real-time platform analytics.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router, Server & Client Components)
- **Language**: [TypeScript 5](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Solana Web3**: `@solana/web3.js` & `@solana/wallet-adapter-react` (Phantom, Solflare support)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) & Web3 Wallet Authentication
- **Package Manager**: [Bun](https://bun.sh/) / `npm`

---

## 💻 Running Locally

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **Bun** (recommended) or **npm**

### Step-by-Step Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/ChiVinchiEgbo/ChainTree.git
   cd ChainTree
   ```

2. **Install Dependencies**
   ```bash
   bun install
   # or
   npm install
   ```

3. **Start the Development Server**
   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. **Open in Browser**
   Navigate to [http://localhost:3000](http://localhost:3000) to view the platform.

---

## 📂 Project Structure

```
chaintree/
├── app/                        # Next.js App Router pages
│   ├── admin/                  # Admin console, study group creation & analytics
│   ├── api/auth/               # NextAuth authentication routes
│   ├── auth/                   # Sign In & Sign Up auth flow
│   ├── courses/                # Course catalog & interactive lesson viewer
│   ├── profile/                # Developer profile, badges & credentials
│   ├── solana-bootcamp/        # Bootcamp landing page
│   ├── staking/                # Anchor token staking dashboard & SOL airdrops
│   ├── study-groups/           # Peer study groups directory & detail pages
│   └── verify/                 # Public cNFT credential verifier
├── components/                 # React components
│   ├── learn/                  # App header, shell, lesson viewer, study group controls
│   ├── providers/              # Solana Wallet & Session providers
│   └── ui/                     # Reusable UI primitives
├── hooks/                      # Custom React hooks (useDataSource, useIsMobile)
├── lib/                        # Data layer, mock storage engine & types
└── public/                     # Static assets & SVG icons
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.
