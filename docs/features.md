# PRISCION FEATURES & ARCHITECTURAL LOGIC

This is the canonical document for the Priscion L1 Ecosystem. It serves as the primary memory source for Zapia to ensure zero regression in design, logic, and feature implementation.

## 1. MUZE Wallet: Onboarding & Authentication
*   **Dual-Path Entry**: 
    *   **Neural Login (Web2 Path)**: Primary onboarding for non-technical users. Uses **Email and Password**. Data is anchored to the `profiles` table in **Supabase**.
    *   **Vault Setup (Web3 Path)**: For advanced users. Options for Create, Recover (Seed), and Ledger.
*   **Sovereign Password**: Users create a vault password during setup. This password is used for local encryption and the "Neural Handshake."
*   **Neural Login Storage**: When a Web2 user signs up, their basic profile is stored in Supabase. This allows them to login across devices without immediate seed phrase management.

## 2. Recovery & Seed Management
*   **Delayed Discovery**: The recovery phrase (seed) is not forced on the user at signup (to lower friction). 
*   **Settings Vault**: The seed is accessible via a secure section in the Settings stage (`#stage-settings`).
*   **Global BIP-39 Dictionary**: Shards are generated using the industry-standard English wordlist (BIP-39), ensuring global compatibility and high-fidelity security.
*   **The "Handshake" Protocol**: 
    *   The user must view their 12-word seed phrase in the Settings.
    *   Once a user confirms they have saved/written down their recovery phrase via the "I HAVE WRITTEN THIS DOWN" button, the phrase is **permanently purged from the UI** (`#seed-display-area` hidden).
    *   A "Seed Secured" status card is displayed instead.
    *   The confirmation status is stored in `localStorage` as `muze_seed_confirmed`.
*   **Key Rotation (Non-Destructive)**: If a user loses their seed phrase, they do not lose the wallet (if they have their Neural Login). They can "rotate" the phrase, which generates a new master key/seed.

## 3. MUZE API & Agency Model
*   **Business Onboarding**: Legacy Web2 brands migrate to Web3 via the MUZE API.
*   **Paid Tiers**:
    *   **Standard**: Personal use, basic transactions.
    *   **Developer/Business API**: A **paid feature** (Subscription-based). Enables businesses to use the MUZE infrastructure for their own brand nodes, inventory on-chain, and customer payments.
*   **Logic**: The API acts as a bridge. Businesses pay in $PRN or a monthly $MUSD subscription to maintain their "Neural Node" on the Priscion Ledger.

## 4. UI/UX Standards
*   **Fidelity**: High-fidelity UI with **Sky Blue (#F0F9FF)**, **Pure White**, and **Muze Blue (#5AC8FA)**.
*   **Typography**: **Playfair Display** (Headings/Balances) and **Inter** (UI/Body).
*   **Centers**: All onboarding layers, cards, and auth forms must be perfectly centered within the viewport.
*   **Favicon**: Always the **MUZE Icon** (`/assets/muze_icon_logo.png`).

## 5. Token Economy (The Four-Token Ledger)
*   **$PRN (Priscion)**: Public Utility. Network fees, NFTs, brand activations.
*   **$NRL (Neural)**: Reserve/Governance. Private reserve, DAO voting.
*   **$JLO (Chillata Token)**: The specific token used for private transactions.
*   **$MUSD (Muze USD)**: Stablecoin. Ecosystem settlement and merchant payouts.

## 6. DApp Suite (LYNX, MYNT, PULSE, LEGGO, CHILLATA)
*   **LYNX**: Handle-to-handle messenger.
*   **MYNT**: Marketplace for Public ($PRN) and Private ($JLO) NFTs.
*   **PULSE**: Network explorer and activity hub.
*   **LEGGO**: Launchpad for brand nodes.
*   **CHILLATA**: The Sovereign Exchange / Swap interface.

## 7. God Mode: Architect Sovereignty
*   **Frictionless Routing**: When God Mode is active (`isGodMode: true`), the Architect bypasses all login walls, vault prompts, and onboarding layers.
*   **URL Separation**: 
    *   **User Gateway**: `priscion.com/muzewallet/` remains a standard, functional gate for all users.
    *   **Architect Console**: `priscion.com/muzewallet/vault.html` acts as the secure destination for the Architect.
*   **Handshake Protocol**: The Architect activates God Mode via a 5-click handshake on the "Neural Login" header followed by the `alice` token.
*   **Neural Notepad**: A persistent workspace (the "tall pad") integrated into the Architect Console for strategy tracking and network orchestration.

## 8. Permanent Storage: Arweave Forever Vault
*   **Goal**: Decentralized, permanent storage on the Arweave Blockweave via **Irys**.
*   **Sovereign Assets**: Core brand assets and heritage data are pinned to ensure zero middleman deletion and 200+ year permanence.

## 9. Brand Integrity
*   **The Spelling Mandate**: The official brand name is **Priscion** (P-R-I-S-C-I-O-N). All legacy typos ("Procyon", "Prisicon") have been purged from the ecosystem.
*   **Domain Hub**: `procyon.com` serves as the technical backbone, but the public signal is exclusively **Priscion**.

---
*Last Updated: June 16, 2026*
