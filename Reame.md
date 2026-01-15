# ProofNest

**ProofNest** is a trust-first note and document vault that lets you prove **you created something at a specific time** — permanently and independently.

No crypto wallets.  
No tokens.  
No buzzwords.

Just clear, verifiable proof.

## What is ProofNest?

People create ideas, notes, proposals, and documents every day — but proving **who created what, and when** is still surprisingly hard.

ProofNest solves this by:
- Locking your content with a cryptographic fingerprint
- Anchoring that fingerprint to an immutable timestamp
- Making the proof verifiable by anyone, anytime

Think of it as **digital notarization for modern creators**.

---

## Who is this for?

- **Solo developers** protecting product ideas
- **Freelancers** securing proposals and specs
- **Creators & designers** proving originality
- **Founders** documenting early-stage work

If losing control of your work would hurt — ProofNest is for you.

---

## Core Principles

- **Trust over hype**  
  We don’t sell “blockchain” — we sell proof.

- **Minimal Web3**  
  Blockchain is used only where it’s objectively better: immutable timestamps.

- **AI as an assistant, not a gimmick**  
  AI summarizes and classifies content. It does not replace authorship.

- **Solo-dev friendly architecture**  
  Simple, maintainable, and extensible.

---

## How it works (high level)

1. You write a note or document
2. ProofNest generates a cryptographic hash
3. That hash is permanently timestamped
4. You get a public, verifiable proof link

The content stays private.  
The proof stays public.

---

## Project Structure

```bash
proof-nest/
├─ apps/
│  ├─ web/                 # Next.js Web App (MAIN)
│  │  ├─ app/
│  │  │  ├─ (auth)/
│  │  │  │  ├─ login/
│  │  │  │  │  └─ page.tsx
│  │  │  │  └─ callback/
│  │  │  │     └─ route.ts
│  │  │  ├─ (dashboard)/
│  │  │  │  ├─ layout.tsx
│  │  │  │  ├─ page.tsx
│  │  │  │  ├─ notes/
│  │  │  │  │  ├─ page.tsx
│  │  │  │  │  └─ [id]/
│  │  │  │  │     └─ page.tsx
│  │  │  │  └─ proofs/
│  │  │  │     └─ [id]/
│  │  │  │        └─ page.tsx
│  │  │  ├─ api/
│  │  │  │  ├─ notes/
│  │  │  │  │  └─ route.ts
│  │  │  │  ├─ proofs/
│  │  │  │  │  ├─ create/
│  │  │  │  │  │  └─ route.ts
│  │  │  │  │  └─ verify/
│  │  │  │  │     └─ route.ts
│  │  │  └─ layout.tsx
│  │  │
│  │  ├─ components/
│  │  │  ├─ ui/
│  │  │  ├─ notes/
│  │  │  ├─ proofs/
│  │  │  └─ shared/
│  │  │
│  │  ├─ lib/
│  │  │  ├─ auth.ts
│  │  │  ├─ supabase.ts
│  │  │  ├─ crypto.ts
│  │  │  ├─ ai.ts
│  │  │  ├─ blockchain.ts
│  │  │  └─ permissions.ts
│  │  │
│  │  ├─ styles/
│  │  ├─ public/
│  │  └─ middleware.ts
│  │
│  ├─ mobile/              # React Native (PHASE 3)
│  │  ├─ app/
│  │  ├─ components/
│  │  ├─ services/
│  │  └─ lib/
│  │
│  └─ desktop/             # Tauri App (PHASE 2)
│     ├─ src/
│     ├─ src-tauri/
│     └─ lib/
│
├─ packages/
│  ├─ core/                # LOGIC DÙNG CHUNG
│  │  ├─ hashing/
│  │  │  └─ sha256.ts
│  │  ├─ normalize/
│  │  │  └─ text.ts
│  │  ├─ encryption/
│  │  │  └─ encrypt.ts
│  │  └─ types/
│  │     └─ index.ts
│  │
│  ├─ db/
│  │  ├─ schema.sql
│  │  └─ migrations/
│  │
│  └─ config/
│     ├─ env.ts
│     └─ constants.ts
│
├─ scripts/
│  ├─ seed.ts
│  └─ backfill.ts
│
├─ docs/
│  ├─ architecture.md
│  ├─ mvp-scope.md
│  └─ api.md
│
├─ .env.example
├─ package.json
├─ tsconfig.json
└─ turbo.json
```

---

## Apps

### `apps/web` (Main App)
- Next.js (App Router)
- Supabase (auth + database)
- Server-side AI & notarization
- SEO-friendly landing page
- Dashboard for notes & proofs

### `apps/desktop` (Planned)
- Tauri + React
- Local encryption & hashing
- For privacy-focused power users

### `apps/mobile` (Planned)
- React Native (Expo)
- Quick notes & proof viewing
- Companion app, not full replacement

---

## Shared Packages

### `packages/core`
Shared logic used across web, desktop, and mobile:
- Text normalization
- Cryptographic hashing
- Encryption utilities
- Shared TypeScript types

### `packages/db`
- SQL schema
- Migrations
- Source of truth for data models

---

## AI Usage

AI is used to:
- Generate concise summaries of notes
- Classify content (idea, proposal, spec, etc.)
- Assist with comparison and organization

AI **does not**:
- Write content for users
- Modify or reinterpret proofs

---

## Web3 Usage

Blockchain is used only for:
- Anchoring cryptographic hashes
- Providing immutable timestamps

Users:
- Do not need a wallet
- Do not pay gas
- Do not interact with the blockchain directly

All notarization happens server-side.

---

## Getting Started (Web App)

### 1. Install dependencies
```bash
cd apps/web
npm install
```

### 2. Environment variables
```copy
cp .env.example .env
```

### 3. Run the app
```copy
npm run dev
```