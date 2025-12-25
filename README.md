# Event Management System

A modern event management platform built with Next.js, featuring Solana NFT integration for event tickets and a comprehensive event management dashboard.

## 🚀 Deployment

**Live Application:** [https://event-management-saket.vercel.app/events](https://event-management-saket.vercel.app/events)

## 📁 File Structure

```
event-management/
├── app/                          # Next.js app directory
│   ├── api/                      # API routes
│   │   ├── cron/                 # Cron job endpoint for health checks
│   │   │   └── route.ts
│   │   └── events/               # Event API endpoints
│   │       ├── [id]/             # Dynamic route for individual events
│   │       │   └── route.ts
│   │       └── route.ts          # GET and POST endpoints for events
│   ├── assests/                  # Static assets
│   │   └── search.svg
│   ├── components/               # React components
│   │   ├── card.tsx
│   │   ├── create-event-modal.tsx
│   │   ├── data-table.tsx
│   │   ├── event-actions-dropdown.tsx
│   │   ├── event-card.tsx
│   │   ├── event-detail-shimmer.tsx
│   │   └── navbar.tsx
│   ├── events/                   # Event pages
│   │   ├── [id]/                 # Dynamic route for event details
│   │   │   └── page.tsx
│   │   ├── create/               # Event creation page
│   │   │   └── page.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx              # Events listing page
│   ├── features/                 # Feature modules
│   ├── hooks/                    # Custom React hooks
│   │   ├── use-events.ts
│   │   └── use-wallet.ts
│   ├── lib/                      # Library and utilities
│   │   ├── api-response.ts       # API response utilities
│   │   ├── providers/
│   │   │   └── query-providers.tsx
│   │   ├── services/             # Business logic services
│   │   │   ├── event-service.ts
│   │   │   └── nft-service.ts    # Solana NFT minting service
│   │   └── validations/
│   │       └── event.ts          # Event validation schemas
│   ├── utils/                    # Utility functions
│   │   ├── date.ts
│   │   └── number.ts
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── db/                           # Database configuration
│   ├── index.ts                  # Database connection and setup
│   └── schema.ts                 # Drizzle ORM schema definitions
├── drizzle/                      # Database migrations
│   ├── 0000_sticky_sharon_carter.sql
│   ├── 0001_condemned_red_wolf.sql
│   ├── 0002_overjoyed_the_hunter.sql
│   └── meta/                     # Migration metadata
├── public/                       # Static public assets
│   └── [various SVG icons]
├── scripts/                      # Utility scripts
│   ├── generate-solana-keypair.ts
│   └── verify-schema.ts
├── drizzle.config.ts             # Drizzle ORM configuration
├── next.config.ts                # Next.js configuration
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vercel.json                   # Vercel deployment configuration
└── README.md                     # This file
```

## 📋 Project Overview

This is a full-stack event management system that allows users to:

- **Create and manage events** with detailed information (name, description, dates, location, categories)
- **View events** in a table format with filtering and search capabilities
- **Mint Solana NFTs** automatically when events are created (for event tickets/verification)
- **Track event metrics** including tickets sold, revenue, and unique attendees
- **Manage event status** (draft, upcoming, ongoing, completed, cancelled)
- **Schedule automated health checks** via cron jobs

The application uses a modern tech stack with server-side rendering, type-safe database queries, and blockchain integration for NFT functionality.

## 🛠 Tech Stack

### Frontend

- **Next.js 16.1.1** - React framework with App Router
- **React 19.2.3** - UI library
- **TypeScript 5** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Framer Motion 12.23.26** - Animation library
- **TanStack React Query 5.90.12** - Data fetching and caching
- **TanStack React Table 8.21.3** - Table component library

### Backend

- **Next.js API Routes** - Serverless API endpoints
- **Drizzle ORM 0.45.1** - Type-safe SQL query builder
- **PostgreSQL** - Relational database (via `pg` and `postgres` packages)
- **Node.js Runtime** - Server-side execution

### Blockchain

- **Solana Web3.js 1.98.4** - Solana blockchain interaction
- **@solana/spl-token 0.4.14** - SPL token operations
- **@metaplex-foundation/mpl-token-metadata 3.4.0** - NFT metadata handling
- **bs58 6.0.0** - Base58 encoding/decoding

### Development Tools

- **Drizzle Kit 0.31.8** - Database migrations and schema management
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **tsx** - TypeScript execution

## 🚀 Setup Instructions

### Prerequisites

- **Node.js** 18+ and npm
- **PostgreSQL** database (local or cloud-hosted like Supabase)
- **Solana wallet** with devnet/mainnet access (for NFT minting)

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd event-management
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env.local` file in the root directory with the following variables:

   ```env
   DATABASE_URL=postgresql://user:password@host:port/database
   SOLANA_RPC_URL=https://api.devnet.solana.com
   SOLANA_MINT_PRIVATE_KEY=your_base58_encoded_private_key
   CRON_SECRET=your_cron_secret_key
   ```

   See the [Environment Variables](#-environment-variables) section for detailed information.

4. **Generate Solana keypair (if needed)**

   ```bash
   npm run db:generate
   tsx scripts/generate-solana-keypair.ts
   ```

5. **Set up the database**

   Run migrations to create the database schema:

   ```bash
   npm run db:push
   ```

   Or use migrations:

   ```bash
   npm run db:migrate
   ```

6. **Verify database schema (optional)**

   ```bash
   npm run db:verify
   ```

7. **Start the development server**

   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production (includes database schema generation)
- `npm start` - Start production server
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations
- `npm run db:push` - Push schema changes to database
- `npm run db:studio` - Open Drizzle Studio (database GUI)
- `npm run db:verify` - Verify database schema
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔐 Environment Variables

### Required Variables

| Variable                  | Description                                               | Example                                         |
| ------------------------- | --------------------------------------------------------- | ----------------------------------------------- |
| `DATABASE_URL`            | PostgreSQL connection string                              | `postgresql://user:password@host:port/database` |
| `SOLANA_MINT_PRIVATE_KEY` | Base58-encoded Solana keypair private key for NFT minting | `5KJvsngHeM...` (base58 string)                 |

### Optional Variables

| Variable         | Description                            | Default                         | Example                               |
| ---------------- | -------------------------------------- | ------------------------------- | ------------------------------------- |
| `SOLANA_RPC_URL` | Solana RPC endpoint URL                | `https://api.devnet.solana.com` | `https://api.mainnet-beta.solana.com` |
| `CRON_SECRET`    | Secret key for cron job authentication | -                               | `your-secret-key-here`                |

### Getting Environment Variables

#### DATABASE_URL

For **Supabase**:

1. Go to your Supabase project settings
2. Navigate to Database → Connection string
3. Copy the connection string (URI format)
4. Format: `postgresql://postgres:[YOUR-PASSWORD]@[HOST]:5432/postgres`

For **local PostgreSQL**:

```
postgresql://postgres:password@localhost:5432/event_management
```

#### SOLANA_MINT_PRIVATE_KEY

1. Generate a Solana keypair using the provided script:
   ```bash
   tsx scripts/generate-solana-keypair.ts
   ```
2. Copy the base58-encoded private key from the output
3. Add it to your `.env.local` file

Alternatively, use an existing wallet:

- Export your wallet's private key in base58 format
- Ensure the wallet has sufficient SOL for transaction fees

#### SOLANA_RPC_URL

- **Devnet** (for testing): `https://api.devnet.solana.com`
- **Mainnet** (production): `https://api.mainnet-beta.solana.com`
- **Custom RPC**: Use services like Helius, QuickNode, or Alchemy

#### CRON_SECRET

Generate a random secret string for cron job authentication:

```bash
openssl rand -base64 32
```

### Environment Variable Setup for Vercel

1. Go to your Vercel project settings
2. Navigate to **Settings** → **Environment Variables**
3. Add all required variables:
   - `DATABASE_URL`
   - `SOLANA_MINT_PRIVATE_KEY`
   - `SOLANA_RPC_URL` (if different from default)
   - `CRON_SECRET` (if using cron jobs)

## 📊 Database Schema

The application uses a single `events` table with the following key fields:

- **Basic Info**: `name`, `description`, `location`, `category`, `subCategory`
- **Timing**: `startDate`, `endDate`, `timezone`
- **Status**: `status` (draft, upcoming, ongoing, completed, cancelled)
- **Metrics**: `ticketsSold`, `totalRevenue`, `uniqueAttendees`
- **Media**: `imageUrl`, `logoUrl`, `organizerLogo`
- **Metadata**: `teams` (JSONB), `tags` (JSONB), `policy`, `organizer`
- **Blockchain**: `nftMintAddress` (Solana NFT mint address)
- **Timestamps**: `createdAt`, `updatedAt`

## 🔄 Features

- ✅ Event CRUD operations
- ✅ Event filtering and search
- ✅ Pagination support
- ✅ Automatic Solana NFT minting on event creation
- ✅ Event status management
- ✅ Responsive UI with Tailwind CSS
- ✅ Type-safe database queries with Drizzle ORM
- ✅ Automated health checks via cron jobs
- ✅ Serverless API architecture

## 📝 Notes

- The application uses **Node.js runtime** for API routes (required for Drizzle + PostgreSQL)
- Database connections are optimized for serverless environments (connection pooling)
- SSL is automatically configured for Supabase and production environments
- NFT minting happens asynchronously - events are created even if NFT minting fails

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting and formatting: `npm run lint && npm run format`
5. Submit a pull request

## 📄 License

[Add your license information here]
