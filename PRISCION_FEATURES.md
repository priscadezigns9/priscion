# PRISICON FEATURES & ARCHITECTURAL LOGIC

This is the canonical document for the Prisicon L1 Ecosystem. It serves as the primary memory source for Zapia to ensure zero regression in design, logic, and feature implementation.

## 1. MUZE Wallet: Onboarding & Authentication
*   **Dual-Path Entry**: 
    *   **Neural Login (Web2 Path)**: Primary onboarding for non-technical users. Features a **Login / Signup** toggle for handle creation (`name.pri`). Uses **Email and Password**. Data is anchored to the `profiles` table in **Supabase**. **Free Handle & PRN Address**: New signups automatically receive a Sovereign Handle and a native PRN receive address.
    *   **Vault Setup (Web3 Path / "Secure My Wallet")**: For advanced users. Options for **Create New Wallet**, **Restore Wallet**, and **Connect Ledger**.
*   **Strict Onboarding Protocol (v9)**: 
    *   **Vault Wizard**: Mandatory 3-step sequence for all new vaults: **Step 1: Display Seed** -> **Step 2: Verify Seed** (requires manual input of words #3 and #7) -> **Step 3: Secure Vault** (sets local encryption password).
    *   **God Mode Handshake**: Architect access is gated behind a recovery-seed-box trigger. **Path: Vault Setup (Web3) -> Recover (Seed) -> Tap inside recovery seed text box 5 times -> Enter Password: `alice`.**
    *   **Live User Lens**: The Architect Command Center (`vault.html`) features a persistent iframe mirror showing the live user-facing wallet experience, allowing the Architect to verify UI/UX from the "inside out."
    *   **Cardano Asset Recovery**: Users can restore any Cardano wallet using 12/24-word seed phrases. Upon restoration, they can instantly link or claim a Sovereign Handle to their existing Cardano keys.
*   **Sovereign Password**: Users create a vault password during setup. This password is used for local encryption and the "Neural Handshake."

## 2. Recovery & Seed Management
*   **Delayed Discovery**: The recovery phrase (seed) is not forced on the user at signup.
*   **The "Handshake" Protocol**: 
    *   **Click to Reveal**: The recovery phrase is hidden/blurred by default. The user must explicitly click "REVEAL SEED" to view the phrase.
*   **Profile Logic**:
    *   **Interactive Handle**: Clicking the user's handle/pfp opens a **Multi-Wallet Overlay** with options: Create, Restore, or Connect Ledger.

## 3. Sovereign Exchange & Staking (CHILLATA)
*   **Dual-Mode Interface**:
    *   **Sovereign Swap**: High-fidelity terminal for exchanging $PRN, $JLLO, $MUSD, $NRL, and $ATLR.
    *   **Liquidity Pools**: Interface for anchoring assets to the ledger. Users earn a 0.2% share of swap fees. Supported pools: PRN/NRL, PRN/MUSD.
*   **Yield & Revenue Engine**:
    *   **Staking (Neural Mining)**: Sustainable yield target: **7% - 8.5% APY**. This is derived from a combination of network emissions and transaction fee redistribution, ensuring long-term economic viability without hyper-inflation.
    *   **Sovereign Fees (The Revenue Shield)**:
        *   **Swap Fee**: 0.3% per transaction (0.2% to Liquidity Providers, 0.1% to the Architect/Agency Treasury).
        *   **Migration Fee**: A one-time activation fee for Web2-to-Web3 brand migrations.
        *   **API/Business Tiers**: Monthly subscription for high-volume enterprise node access.
*   **Asset Categorization**:
    *   **Vault**: Primary fungible tokens ($PRN, ADA, NRL). Includes native **SEND** and **RECEIVE** functionality for Cardano ($ADA).
    *   **Native Asset Registry**: Dashboard-level visibility for Cardano Native Assets including **$JLLO** (Chillata) and **$MUSD** (Muze USD). Includes a Discovery link for managing all Cardano portfolio assets.
    *   **Collectibles**: Dedicated gallery for **NFTs and ADA Handles**.

## 4. MUZE API & Agency Model
*   **Business Onboarding**: Legacy Web2 brands migrate to Web3 via the MUZE API.
*   **Paid Tiers**:
    *   **Standard**: Personal use, basic transactions.
    *   **Developer/Business API**: A **paid feature** (Subscription-based). Enables businesses to use the MUZE infrastructure for their own brand nodes.
*   **Buy Crypto Integration**: Users can buy $PRN and Cardano ($ADA) assets directly within the wallet via **PayPal** or **Credit Card**.
*   **Payment Stack**: Integrated support for **PayPal**, **Credit Card**, and **$PRN** native settlement.
*   **Procyon Digital Card**: The #001 Elite Card acts as a physical-to-digital bridge, designed to allow users to spend their $PRN, $ADA, and other ecosystem tokens in real-world retail environments.

## 5. UI/UX Standards
*   **Fidelity**: High-fidelity UI with **Sky Blue (#F0F9FF)**, **Pure White**, and **Muze Blue (#5AC8FA)**.
*   **Typography**: **Playfair Display** (Headings/Balances) and **Inter** (UI/Body).
*   **Action Bar**: Must feature SEND, RECV, SWAP, and **⚡ STAKE** buttons. All buttons must trigger immediate visual feedback ("Anchoring...").

## 6. Token Economy (The Four-Token Ledger)
*   **$PRN (Prisicon)**: Public Utility. Network fees, NFTs, brand activations. **Official Ticker: PRN.**
*   **$NRL (Neural)**: Reserve/Governance. Private reserve, DAO voting.
*   **$JLLO (Jello)**: Privacy Layer Token. Used for private transactions and the Jello Layer.
*   **$MUSD (Muze USD)**: Stablecoin. Ecosystem settlement and merchant payouts.
*   **Cardano Token Registry**: $PRN metadata (name, ticker, logo) is registered via the Cardano GitHub Registry to ensure visibility in all Cardano wallets (Vespr, Eternl, etc.).

## 7. DApp Suite (LYNX, MYNT, PULSE, LEGGO, CHILLATA)
*   **LYNX**: Independent handle-to-handle private messenger. Anchored to the **Jello Layer**.
*   **MYNT**: Marketplace for Public ($PRN) and Private ($JLLO) NFTs.
*   **PULSE**: Network explorer and activity hub.
*   **LEGGO**: Sovereign Web3 Browser & Node Launchpad.
*   **CHILLATA**: The Sovereign Exchange (DEX). High-fidelity swap terminal for $PRN, $JLLO, $MUSD, and $ATLR. Includes real-time **Network Momentum** graphing.
*   **JELLO Layer**: The separate Privacy Layer for the entire network.

## 8. LEGGO: Sovereign Web3 Browser
*   **Architecture**: Built on an independent privacy-first engine. Stripped of Web2 tracking.
*   **LEO AI Assistant**: Built-in Sovereign AI assistant for web navigation, research, and independent web discovery.
*   **Brave-Style Chrome**: Features side-panel menu for Tabs, Private Windows, VPN, History, and Bookmarks.
*   **Native Wallet Sync**: MUZE Wallet and handles are baked directly into the browser chrome.

## 9. Permanent Storage: Arweave Forever Vault
*   **Goal**: To migrate core assets (Digital Card, Calalloo Heritage, TWMK Evidence) to decentralized, permanent storage on the Arweave Blockweave.
*   **Bridge**: **Irys** selected for high-speed uploads.
*   **Sovereign Assets**: Initial identification of `assets/card.png` as a primary candidate for decentralized pinning.

## 10. Architect Command Center (God Mode)
*   **Zero-Simulation Mandate**: Hardcoded dashboard numbers are strictly banned. The Command Center must reflect **Live Node Status** and **Anchored Ledger Data**.
*   **Autonomous Sync Agent**: A background subagent (`autonomous_core/god_mode_sync.py`) runs every 6 hours via cron to fetch live user data and network health.
*   **Revenue Shield**: High-fidelity financial engine aggregating ecosystem liquidity ($1,250 per node + baseline).
*   **Neural Handshake (v9)**: Architect access utilizes the **5-tap recovery seed protocol** for secure telemetry entry. **Live Protocol: Path: Vault Setup -> Restore -> Tap textarea 5 times.**

## 11. Security & Hardware Logic
*   **Live Ledger Handshake**: MUZE supports live USB handshakes for Ledger devices. Establishing a connection anchors cold storage keys to the active session.
*   **Live Mode Integrity**: Total ban on hardcoded "simulation" data. All dashboard feedback must represent live anchoring on the Cardano or Sovereign ledger.

## 12. Sovereign Handle Economy
*   **User-Defined Handle**: Users choose their own **Sovereign Handle** (e.g., `name.pri`).
*   **Share-to-Earn**: Users earn $PRN by sharing their referral links. New users receive a "Free Handle" welcome bonus.
*   **Staking (Neural Mining)**: Users earn continuous $PRN rewards by holding assets and maintaining a synced node status in the wallet.

---
*Last Updated: June 14, 2026*

## 13. Sovereign Asset Directory
*   **Primary Logo**: https://priscion.com/assets/priscion_logo.png
*   **$PRN Coin Asset**: https://priscion.com/assets/prn.jpg
*   **Neural Reserve Asset**: https://priscion.com/assets/nrl.jpg
*   **Atelia Gaming Asset**: https://priscion.com/assets/atlr.jpg
*   **Jello Layer Asset**: https://priscion.com/assets/jlo.jpg
*   **Muze USD Asset**: https://priscion.com/assets/musd.jpg
