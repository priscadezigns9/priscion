# PRISCION FEATURES & ARCHITECTURAL LOGIC

This is the canonical document for the Priscion L1 Ecosystem. It serves as the primary memory source for Zapia to ensure zero regression in design, logic, and feature implementation.

## 1. MUZE Wallet: Onboarding & Authentication
*   **Dual-Path Entry**: 
    *   **Neural Login (Web2 Path)**: Primary onboarding for non-technical users. Features a **Login / Signup** toggle for handle creation (`name.pri`). Uses **Email and Password**. Data is anchored to the `profiles` table in **Supabase**.
    *   **Vault Setup (Web3 Path)**: For advanced users. Options for Create, Recover (Seed), and Ledger.
*   **Strict Onboarding Protocol (v8)**: 
    *   **Vault Wizard**: Mandatory 3-step sequence for all new vaults: **Step 1: Display Seed** -> **Step 2: Verify Seed** (requires manual input of words #3 and #7) -> **Step 3: Secure Vault** (sets local encryption password).
    *   **Ledger Identity Gate**: Connecting a Ledger requires the user to explicitly name their hardware-gated identity (e.g. `my-ledger.pri`) to ensure dynamic handle injection.
*   **Sovereign Password**: Users create a vault password during setup. This password is used for local encryption and the "Neural Handshake."

## 2. Recovery & Seed Management
*   **Delayed Discovery**: The recovery phrase (seed) is not forced on the user at signup.
*   **Settings Vault**: The seed is accessible via a secure section in the Settings stage (`#stage-settings`).
*   **The "Handshake" Protocol**: 
    *   **Click to Reveal**: The recovery phrase is hidden/blurred by default. The user must explicitly click "REVEAL SEED" to view the phrase.
*   **Profile Logic**:
    *   **Interactive Handle**: Clicking the user's handle/pfp opens a **Multi-Wallet Overlay** with options:
        1.  **Create New Wallet**
        2.  **Restore Wallet**
        3.  **Connect Ledger**
    *   **PFP Change**: Users can click their profile picture to upload a new **Avatar Artifact**.

## 3. MUZE API & Agency Model
*   **Business Onboarding**: Legacy Web2 brands migrate to Web3 via the MUZE API.
*   **Paid Tiers**:
    *   **Standard**: Personal use, basic transactions.
    *   **Developer/Business API**: A **paid feature** (Subscription-based). Enables businesses to use the MUZE infrastructure for their own brand nodes.
*   **Buy Crypto Integration**: Users can buy $PRN assets directly within the wallet via **PayPal** or **Credit Card**.
*   **Payment Stack**: Integrated support for **PayPal**, **Credit Card**, and **$PRN** native settlement.
*   **API Activation & Data Collection**: 
    *   **Logic**: When a business clicks "ACTIVATE API," the system captures their **Sovereign Handle** and **Supabase ID** to link the license.
    *   **Inquiry Path**: For businesses requiring custom help, the "Sign Up" flow directs them to a contact point for high-fidelity onboarding.

## 4. UI/UX Standards
*   **Fidelity**: High-fidelity UI with **Sky Blue (#F0F9FF)**, **Pure White**, and **Muze Blue (#5AC8FA)**.
*   **Typography**: **Playfair Display** (Headings/Balances) and **Inter** (UI/Body).
*   **Dark Mode**: A modern, vector-style persistent toggle in the navigation for high-fidelity night work.
*   **Action Bar**: Must feature SEND, RECV, SWAP, and **⚡ STAKE** buttons. All buttons must trigger immediate visual feedback ("Anchoring...").
*   **dApp Stage Interaction**: Clicking a dApp tile (PULSE, CHILLATA, etc.) must open the app directly within the MUZE Wallet viewport.
*   **Asset Categorization**:
    *   **Vault**: Primary fungible tokens ($PRN, ADA, NRL).
    *   **Collectibles**: Dedicated gallery for **NFTs and ADA Handles**. By default, it shows the user's `.pri` handle with the Priscion logo.
*   **Favicon**: Always the **P-Logo** (`/assets/p-logo.png`).

## 5. Token Economy (The Four-Token Ledger)
*   **$PRN (Priscion)**: Public Utility. Network fees, NFTs, brand activations.
*   **$NRL (Neural)**: Reserve/Governance. Private reserve, DAO voting.
*   **$JLO (Chillata Token)**: The specific token used for private transactions.
*   **$MUSD (Muze USD)**: Stablecoin. Ecosystem settlement and merchant payouts.
*   **Jello Messenger**: A private, encrypted messenger integrated into the **Chillata (Jello)** layer.
*   **Live Logic**: Balances and transaction counts are pulled live from the Supabase `profiles` ledger.
*   **$NRL (Neural)**: Reserve/Governance. Private reserve, DAO voting.
*   **$JLO (Chillata Token)**: The specific token used for private transactions.
*   **$MUSD (Muze USD)**: Stablecoin. Ecosystem settlement and merchant payouts.

## 6. DApp Suite (LYNX, MYNT, PULSE, LEGGO, CHILLATA)
*   **LYNX**: Handle-to-handle messenger.
*   **MYNT**: Marketplace for Public ($PRN) and Private ($JLO) NFTs.
*   **PULSE**: Network explorer and activity hub.
*   **LEGGO**: Launchpad for brand nodes.
*   **CHILLATA**: The Sovereign Exchange / Swap interface.
*   **JELLO Layer**: The separate Privacy Layer for the entire network.

## 7. Permanent Storage: Arweave Forever Vault
*   **Goal**: To migrate core assets (Digital Card, Calalloo Heritage, TWMK Evidence) to decentralized, permanent storage on the Arweave Blockweave.
*   **Bridge**: **Irys** selected for high-speed uploads.
*   **Sovereign Assets**: Initial identification of `assets/card.png` as a primary candidate for decentralized pinning.
*   **Deployment Status**: INITIALIZED (2026-06-10).
*   **Benefits**: 200+ year permanence, zero middleman deletion, and "Master Design" fidelity.

## 8. Autonomous Provisioning & Onboarding
*   **Lead Capture Engine**: 
    *   **Source**: `priscion.com` (Essential, Growth, Sovereign packages).
    *   **Database**: Supabase `leads` table.
*   **Financial Watchdog**: Script `autonomous_core/financial_watchdog.py` scans financial feeds for Reference IDs (`PD-XXXXXX`).
*   **Autonomous Provisioning**: Script `autonomous_core/provision_clients.py` identifying "Paid" clients for automated WhatsApp alerts and high-fidelity onboarding emails.
*   **Onboarding Checklists**: Standardized requirements for Branding (Logos/Refs), Growth (Domain/Goals), and AI (Neural training data).

## 9. Brand & Visual Assets
### **Primary Logos**
*   **MUZE Logo**: `assets/muze_icon_logo.png` (Canonical Wallet Icon).
*   **PRISCION Logo**: `assets/muze_icon_logo.png`
*   **PULSE Logo**: `assets/pulse_logo.png`
*   **P-Logo (Global)**: `assets/p-logo.png`

### **Asset Imagery**
*   **Priscion Elite Card**: `assets/card_ai_access.jpg` (High-fidelity AI Access card artifact).

## 10. Architect Command Center (God Mode)
*   **Zero-Simulation Mandate**: Hardcoded dashboard numbers are strictly banned. The Command Center must reflect **Live Node Status** and **Anchored Ledger Data**.
*   **Hard-Anchor Layout**: Implementation of `display: table` structural model in `vault.html` to force immutable side-by-side positioning of the Architect Console and the Live User Mirror.
*   **Neural Messenger**: Direct P2P link between the Architect and Zapia (Brain Logic AI) integrated into the Console.

## 11. Sovereign Handle Economy
*   **User-Defined Handle**: During **Sign Up**, users explicitly choose their own **Sovereign Handle** (e.g., `myname.pri`). The system automatically appends `.pri` if omitted.
*   **Minting Design**: All minted handles manifest as **Square Tiles** featuring the **Priscion Logo**, the **Handle Name**, and the **.pri** suffix.
*   **Core Ecosystem Handles**: 
    *   `priscion.pri` (Network Head)
    *   `zapia.pri` (AI Liaison)
    *   `muze.pri`, `pulse.pri`, `mynt.pri`, `chillata.pri`, `jello.pri`, `lynx.pri` (Infrastructure Nodes).
*   **Supabase Anchoring**: Once confirmed, the handle is anchored to the user's unique ID in the Supabase `profiles` table.

## 12. Agency Hub & Migration Pipeline
*   **The Hub Role**: Centralized management for the **Priscion Migration Agency**. 
*   **Migration Logic**: When a Web2 brand migrates, the Hub triggers:
    1.  **Node Provisioning**: Deployment of brand-specific smart contracts.
    2.  **Asset Anchoring**: Hashing and pinning of brand inventory/logos to the ledger.
    3.  **Handle Issuance**: Verified business handle anchoring.
*   **Pipeline Visibility**: The Hub provides real-time status of migrations in progress and node health for managed brands.

## 13. Digital Card Infrastructure
*   **The Artifact**: `assets/card_ai_access.jpg`. A physical-to-digital high-fidelity representation of the user's sovereign identity.
*   **Access Token**: The card acts as a verification handshake for the **Developer API** and **Elite AI Access**.
*   **Real-World (IRL) Bridge**: 
    *   **Mobile NFC/QR**: MUZE Wallet on mobile uses NFC and secure QR codes for merchant-point-of-sale taps.
    *   **Merchant Node**: Terminal-based settlement where merchants receive stable value while users spend sovereign assets.
    *   **Fiat-to-Asset Swap**: Real-time conversion into **$MUSD** for instant real-world spending at legacy terminals.
*   **Physical Key**: Optional NFC-embedded physical card acting as a "Physical Proof of Key" to the digital Vault.

## 14. God Mode (The Architect Console)
*   **Persistent Synchronization**: The God Mode HUD (Traffic, Revenue, System Pulse) is synchronized with **Supabase** autonomously.
*   **Autonomous Sync Agent**: A background subagent (`autonomous_core/god_mode_sync.py`) runs every 6 hours via cron to fetch live user data and network health, ensuring the HUD is current even when the user is not actively in a session.
*   **Revenue Shield Visualization**: A high-fidelity financial engine in the Architect Console that aggregates ecosystem liquidity ($1,250 per node + baseline) and visualizes the network's financial pulse.
*   **Neural Handshake (v8)**: Architect access utilizes the `muze_v8_active` session protocol, ensuring a secure and verified entry into the global telemetry hub via `architect.pri`.
*   **Live Traffic HUD**: Real-time clicks, session counts, and sign-up telemetry (Email/Timestamp) pulled directly from the Supabase profile registry.

---
*Last Updated: June 13, 2026*

