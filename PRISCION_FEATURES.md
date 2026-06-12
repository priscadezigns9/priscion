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
*   **The "Handshake" Protocol**: 
    *   The user must view their 12-word seed phrase in the Settings.
    *   Once a user confirms they have saved/written down their recovery phrase via the "I HAVE WRITTEN THIS DOWN" button, the phrase is **permanently purged from the UI** (`#seed-display-area` hidden).
    *   A "Seed Secured" status card is displayed instead.
    *   The confirmation status is stored in `localStorage` as `muze_seed_confirmed`.
*   **Key Rotation (Non-Destructive)**: If a user loses their seed phrase, they do not lose the wallet (if they have their Neural Login). They can "rotate" the phrase, which generates a new master key/seed, similar to rotating an API key.

## 3. MUZE API & Agency Model
*   **Business Onboarding**: Legacy Web2 brands migrate to Web3 via the MUZE API.
*   **Paid Tiers**:
    *   **Standard**: Personal use, basic transactions.
    *   **Developer/Business API**: A **paid feature** (Subscription-based). Enables businesses to use the MUZE infrastructure for their own brand nodes, inventory on-chain, and customer payments.
*   **Logic**: The API acts as a bridge. Businesses pay in $PRN or a monthly $MUSD subscription to maintain their "Neural Node" on the Priscion Ledger.

## 4. UI/UX Standards
*   **Fidelity**: High-fidelity UI with **Sky Blue (#F0F9FF)**, **Pure White**, and **Muze Blue (#5AC8FA)**.
*   **Typography**: **Playfair Display** (Headings/Balances) and **Inter** (UI/Body).
*   **Centers**: All onboarding layers, cards, and auth forms must be perfectly centered (vertically and horizontally) within the viewport.
*   **Favicon**: Always the **P-Logo** (`/assets/p-logo.png`).

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
*   **Priscion Elite Card**: `assets/card.jpg` (Displays the user's current card image).

## 10. Current Visual Layout & Snapshot Log
These snapshots represent the approved high-fidelity interface as of June 12, 2026.

### **MUZE Entry (Onboarding)**
*   **Status**: High-Fidelity, Sky Blue Theme, Centered.
*   **Snapshot**: `screenshots/scs_priscioncom_1781295384187_1646.png`

### **Neural Login (Web2 Entry)**
*   **Status**: Functional Toggle, Centered Card.
*   **Snapshot**: `screenshots/scs_priscioncom_1781295390086_4454.png`

### **PULSE Ledger Explorer**
*   **Status**: Active, High-Fidelity Grid.
*   **Snapshot**: `screenshots/scs_priscioncom_1781295576331_9369.png`

### **MYNT NFT Marketplace**
*   **Status**: Functional, Asset Grid Active.
*   **Snapshot**: `screenshots/scs_priscioncom_1781295586526_4939.jpg`

### **CHILLATA Exchange**
*   **Status**: Sovereign Swap UI.
*   **Snapshot**: `screenshots/scs_priscioncom_1781295593807_4805.png`

### **LYNX Messenger**
*   **Status**: Sovereign Handle-to-Handle UI.
*   **Snapshot**: `screenshots/scs_priscioncom_1781295598857_7538.png`

### **MUZE Settings & Seed Handshake**
*   **Status**: Active, Functional Handshake.
*   **Snapshot**: `screenshots/scs_priscioncom_1781295958694_5072.png`

### **Architect Command Center (God Mode)**
*   **Status**: Active Split-Screen "Lens View" for real-time Hub monitoring and vault management.
*   **Snapshot**: `screenshots/scs_priscioncom_1781305727270_5972.png`

### **Priscion Elite Card (Visual)**
*   **Status**: Integrated into MUZE.
*   **Snapshot**: `screenshots/card_visual_fixed.png`

## 11. Handle Anchoring & Registration
*   **User-Defined Handle**: During **Sign Up**, users explicitly choose their own **Sovereign Handle** (e.g., `myname.pri`). The system automatically appends `.pri` if omitted.
*   **Availability Check**: The system checks the `profiles` table in Supabase to ensure the handle is not already taken before allowing registration.
*   **Supabase Anchoring**: Once confirmed, the handle is anchored to the user's unique ID in the Supabase `profiles` table. 
*   **Persistence**: Upon login, the system fetches the anchored handle from the database rather than predicting it, ensuring the user's chosen identity is persistent across all sessions and devices.
*   **Visual Confirmation**: The chosen handle is displayed as a primary asset in the MUZE Wallet header.

## 12. Onboarding Diversion (Web2 vs. Web3)
*   **Segmented Entry**: The MUZE entrance layer now explicitly shards users based on their technical background:
    *   **Neural Login (Web2)**: Diverts newcomers to a Gmail-like experience where they register with a **Handle**, **Email**, and **Password**.
    *   **Vault Setup (Web3)**: Diverts sovereign users to direct vault creation, recovery, or hardware wallet connection.
*   **Recovery Access**: Once inside the MUZE Console, users can access their **Recovery Shard** (Secret Phrase) via the **Settings** stage. This is protected by a secondary "Neural Password" verification to ensure high-fidelity security.

## 13. High-Fidelity Sovereign Shard Protocol
*   **Decoupled Creation**: Recovery phrases are no longer generated at signup. Users must explicitly initiate generation within the **MUZE Settings** stage.
*   **BIP-0039 World Dictionary**: Shards are pulled dynamically from the official industry-standard English wordlist.
*   **Dynamic Handshake Verification**: After generation, the wallet triggers a random-index security question (e.g., "Enter word #4"). Successful verification anchors the shard to the handle.
*   **One-Way Persistence**: Once verified, the phrase is locked. It is hidden from the UI and cannot be retrieved. 
*   **Password-Gated Reset**: To generate a new shard, users must provide their **Neural Password**, which wipes the previous anchor and starts the generation flow fresh.

## 14. Handle Economy & Tiered Pricing
*   **Signal Strength Pricing**: Fees are determined by the "Signal Strength" of the handle to prevent hoarding and ensure ecosystem fairness.
    *   **Standard (.pri)**: Base utility fee for personal names.
    *   **Premium (Luxury/Dictionary)**: High-fidelity fees for global brand names (e.g., dior.pri, vogue.pri).
    *   **Short Handles (3-4 chars)**: Exponentially higher fees to prevent bot-snatching.
*   **The Protected Registry**: A gated list of high-value brand names that trigger verification requirements and premium pricing.
*   **Revenue Allocation**: Premium fees are directed to the **NEURAL ($NRL) Treasury** or the **TWMK Endowment**, supporting the mission backbone.

---
*Last Updated: June 12, 2026*
