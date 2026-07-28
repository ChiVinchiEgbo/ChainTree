# 🌳 ChainTree

> **ChainTree** is a next-generation, open-source Web3 developer learning platform and on-chain credentialing engine built on the **Solana** blockchain.

[![Solana](https://img.shields.io/badge/Solana-Mainnet%2FDevnet-14F195?style=flat-square&logo=solana)](https://solana.com)
[![Anchor](https://img.shields.io/badge/Anchor-v0.29.0-2b2b2b?style=flat-square)](https://www.anchor-lang.com)
[![Next.js](https://img.shields.io/badge/Next.js-12.3-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-blue.style=flat-square)](LICENSE)

---

## 📌 Overview

**ChainTree** empowers developers to learn Web3 development through hands-on bootcamps, structured courses, and collaborative study groups. Upon completing a bootcamp or course, students receive verifiable **On-Chain NFT Certificates** minted directly to their Solana wallets.

With integrated on-chain verification, employers and organizations can instantly validate course completion credentials directly against the Solana blockchain.

---

## ✨ Key Features

- **🎓 Interactive Web3 & Solana Bootcamps**: Comprehensive, project-based courses covering Solana development, Rust, Anchor Framework, Web3.js, Smart Contracts, and DeFi.
- **📜 On-Chain NFT Certificates**: Automatically mint Metaplex NFTs & SPL Compressed NFTs (cNFTs) as proof of bootcamp completion.
- **🔍 Instant On-Chain Certificate Verifier**: Public verification portal (`/verify`) allowing anyone to verify certificate authenticity directly via Solana RPC nodes.
- **👛 Solana Wallet Adapter**: Native wallet connection supporting Phantom, Solflare, Backpack, and other major Solana wallets.
- **⚙️ Custom Anchor Smart Contracts**: On-chain Anchor program (`bootcamp_certificates`) tracking course state, authority permissions, and total certificate mint tallies.
- **👥 Collaborative Study Groups & Cohorts**: Group learning features with schedule management and automated community integration.
- **🌐 Multi-Language Support (i18n)**: Fully internationalized interface supporting English, Portuguese (pt-BR), and extensible to additional languages.

---

## 🛠 Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | [Next.js](https://nextjs.org/), [React 17](https://reactjs.org/), [TailwindCSS](https://tailwindcss.com/), [NextUI](https://nextui.org/) |
| **Blockchain Client** | [@solana/web3.js](https://solana-labs.github.io/solana-web3.js/), [@solana/wallet-adapter](https://github.com/solana-labs/wallet-adapter) |
| **Smart Contracts** | [Solana](https://solana.com), [Rust](https://www.rust-lang.org/), [Anchor Framework](https://www.anchor-lang.com/) |
| **NFT Standards** | [Metaplex Token Metadata](https://www.metaplex.com/), SPL Compressed NFTs (Bubblegum) |
| **Backend & Storage** | [Firebase (Firestore / Auth / Admin SDK)](https://firebase.google.com/), Cloud Functions |
| **Localization** | [i18next](https://www.i18next.com/) |

---

## 📂 Repository Structure

```text
ChainTree/
├── components/          # Reusable UI components (Navbar, Footer, SEO, Wallet, Cards)
├── docs/                # Developer guides and contribution documentation
├── functions/           # Firebase Cloud Functions (NFT delivery, email templates)
├── pages/               # Next.js page routes
│   ├── admin/           # Admin dashboard for cohort & study group management
│   ├── courses/         # Course content and lesson viewer
│   ├── profile/         # Student progress & earned certificates dashboard
│   ├── solana-bootcamp/ # Solana & Anchor specialized bootcamp page
│   ├── study-groups/    # Community study group directory
│   └── verify.js        # On-Chain Certificate Verification portal
├── public/              # Static assets, images, and i18n translation files
├── scripts/             # Firestore seeding and utility scripts
└── solana-programs/     # Rust & Anchor Smart Contracts
    ├── programs/
    │   └── bootcamp_certificates/ # Anchor contract source (lib.rs)
    └── scripts/         # Solana NFT minting scripts (Metaplex & cNFT)
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:

- **Node.js**: `>= 20.0.0`
- **npm** or **yarn**
- *(Optional for Smart Contract Dev)* **Rust**, **Solana CLI**, and **Anchor CLI**

### 1. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/ChiVinchiEgbo/ChainTree.git
cd ChainTree
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env.local` and configure your environment variables:

```bash
cp .env.example .env.local
```

Configure your Firebase credentials, Solana RPC endpoint (Devnet/Mainnet), and wallet keypair.

### 3. Development Server

Run the Next.js development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the app.

---

## ⛓ Solana Smart Contract Development

The smart contract suite lives in `solana-programs/`.

### Build Program

```bash
cd solana-programs
anchor build
```

### Deploy to Devnet

```bash
anchor deploy --provider.cluster devnet
```

### Program Features (`bootcamp_certificates`):
- `initialize_course`: Initializes an on-chain PDA account for a course.
- `mint_certificate`: Records an on-chain certificate minting event for a student wallet address and increments total certificates issued.

---

## 🧪 Testing & Code Quality

Run tests:
```bash
npm test
```

Run ESLint:
```bash
npm run lint
```

---

## 🤝 Contributing

Contributions are welcome! Please read [docs/how-to-contribute.md](docs/how-to-contribute.md) for guidelines on branch naming, code style, and submitting pull requests.

---

## 📄 License

Licensed under the [MIT License](LICENSE). Copyright © 2026 ChainTree.# ChainTree
