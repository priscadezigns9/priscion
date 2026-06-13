# PRISCION FEATURES & ARCHITECTURAL LOGIC

This is the canonical document for the Priscion L1 Ecosystem. It serves as the primary memory source for Zapia to ensure zero regression in design, logic, and feature implementation.

## 1. MUZE Wallet: Onboarding & Authentication
*   **Dual-Path Entry**: 
    *   **Neural Login (Web2 Path)**: Primary onboarding for non-technical users. Uses **Email and Password**. Data is anchored to the `profiles` table in **Supabase**.
    *   **Vault Setup (Web3 Path)**: For advanced users. Options for Create, Recover (Seed), and Ledger.
*   **Sovereign Password**: Users create a vault password during setup. This password is used for local encryption and the "Neural Handshake."
*   **Neural Login Storage**: When a Web2 user signs up, their basic profile is stored in Supabase. This allows them to login across devices without immediate seed phrase management.

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
*   **MUZE Logo**: `assets/muze_logo.png`
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

---
*Last Updated: June 12, 2026*
