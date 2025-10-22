# Parametric AI

A modern, full stack AI application built with Next.js, Express, tRPC, and Prisma in a monorepo architecture using Turborepo.

## Project Structure

This is a monorepo managed by [pnpm workspaces](https://pnpm.io/workspaces) and [Turborepo](https://turborepo.com). It consists of:

### Apps

- **`web`** - Next.js 15 frontend application (Port: 3001)
- **`server`** - Express.js backend API server (Port: 3000)

### Packages

- **`@parametric-ai/api`** - tRPC API routes and procedures
- **`@parametric-ai/auth`** - Authentication logic with Better Auth
- **`@parametric-ai/db`** - Prisma database schema and client
- **`@parametric-ai/ui`** - Shared React component library
- **`@parametric-ai/utils`** - Shared utility functions

## Tech Stack

- **Framework:** Next.js 15 with App Router & Turbopack
- **Backend:** Express.js with tRPC
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** Better Auth
- **Styling:** Tailwind CSS
- **State Management:** Zustand, TanStack Query
- **Forms:** React Hook Form with Zod validation
- **UI Components:** Shadcn with Radix UI primitives
- **Code Quality:** Biome (via Ultracite), TypeScript
- **Package Manager:** pnpm
- **Monorepo:** Turborepo

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher)
- **pnpm** (v10.18.0 or higher)
- **PostgreSQL** (v14 or higher)

```bash
# Install pnpm if you haven't already
npm install -g pnpm@10.18.0

# Verify installations
node --version
pnpm --version
psql --version
```

## Quick Start

### 1. Clone the Repository

```bash
git clone git@github.com:AbhishekKolge/parametric-ai.git
cd parametric-ai
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Set Up Environment Variables

Create `.env` files for both the server and web applications:

#### Server Environment (`apps/server/.env`)

```bash
# Copy the example file
cp apps/server/.env.example apps/server/.env
```

Edit `apps/server/.env` with your configuration:

```bash
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/parametric_ai

# Better Auth
BETTER_AUTH_SECRET=your-secret-key-here-minimum-32-characters
BETTER_AUTH_URL=http://localhost:3000

# CORS
CORS_ORIGIN=http://localhost:3001

# AI Integration
GROQ_API_KEY=your-groq-api-key-here
GROQ_API_BASE_URL=https://api.groq.com/openai/v1

# Email (SendGrid)
SENDGRID_API_KEY=your-sendgrid-api-key
SENDGRID_HOST=smtp.sendgrid.net
SENDGRID_PORT=587
SENDGRID_USER=apikey
EMAIL_FROM_ID=your-email@example.com
EMAIL_FROM_NAME=Parametric AI

# Server
PORT=3000
APP_NAME=Parametric AI
```

#### Web Environment (`apps/web/.env`)

```bash
# Copy the example file
cp apps/web/.env.example apps/web/.env
```

Edit `apps/web/.env`:

```bash
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
NEXT_PUBLIC_CLIENT_URL=http://localhost:3001
```

### 4. Set Up the Database

#### Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE parametric_ai;

# Exit psql
\q
```

#### Run Migrations

```bash
# Generate Prisma client and run migrations
pnpm db:migrate
```

#### (Optional) Open Prisma Studio

```bash
# View and edit your database in the browser
pnpm db:studio
```

### 5. Start Development Servers

#### Option 1: Start All Services

```bash
pnpm dev
```

This will start both the web app and server concurrently.

#### Option 2: Start Services Individually

```bash
# Terminal 1 - Start the backend server
pnpm dev:server

# Terminal 2 - Start the web app
pnpm dev:web
```

### 6. Access the Application

- **Web App:** http://localhost:3001
- **API Server:** http://localhost:3000
- **API Health Check:** http://localhost:3000/health
- **tRPC Endpoint:** http://localhost:3000/trpc
- **Auth Endpoint:** http://localhost:3000/api/auth

## Available Scripts

### Root Level Scripts

```bash
# Development
pnpm dev              # Start all apps in development mode
pnpm dev:web          # Start only the web app
pnpm dev:server       # Start only the server

# Build
pnpm build            # Build all apps and packages

# Database
pnpm db:push          # Push schema changes to database
pnpm db:migrate       # Run database migrations
pnpm db:generate      # Generate Prisma client
pnpm db:studio        # Open Prisma Studio

# Code Quality
pnpm check            # Format and lint code with Biome
pnpm check-types      # Check TypeScript types across all packages
```

### Individual Package Scripts

```bash
# Web app (from apps/web/)
cd apps/web
pnpm dev              # Start Next.js dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Server (from apps/server/)
cd apps/server
pnpm dev              # Start Express dev server with hot reload
pnpm build            # Build for production
pnpm start            # Start production server
```

## Database Management

### Prisma Commands

```bash
# Push schema changes (development)
pnpm db:push

# Create a new migration
pnpm db:migrate

# Generate Prisma client
pnpm db:generate

# Open Prisma Studio
pnpm db:studio

# Reset database (deletes all data)
cd packages/db
pnpm prisma migrate reset
```

### Schema Location

Database schemas are located in `packages/db/prisma/schema/`:

- `schema.prisma` - Main schema configuration
- `auth.prisma` - Authentication models
- `experiment.prisma` - Experiment models

## Authentication

This project uses [Better Auth](https://www.better-auth.com) for authentication. The authentication system supports:

- Email/Password authentication
- Email verification
- Session management
- Protected routes

### Setting Up Auth

1. Generate a secure secret for `BETTER_AUTH_SECRET`:

   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

2. Configure email provider (SendGrid) for email verification
3. Update `BETTER_AUTH_URL` if deploying to production

## UI Components

The project uses a custom component library (`@parametric-ai/ui`) built on top of:

- **Shadcn UI** - Component Library
- **Radix UI** - Accessible primitives
- **Tailwind CSS** - Utility-first styling
- **Lucide React** - Icons

Components are located in `packages/ui/src/components/`.

## Configuration Files

- `turbo.json` - Turborepo pipeline configuration
- `biome.json` - Biome linter/formatter configuration
- `tsconfig.json` - TypeScript configuration
- `pnpm-workspace.yaml` - pnpm workspace configuration
- `package.json` - Root package with workspace scripts

## Project Structure Details

```
parametric-ai/
├── apps/
│   ├── server/              # Express.js backend
│   │   └── src/
│   │       ├── index.ts     # Server entry point
│   │       └── utils/       # Server utilities
│   └── web/                 # Next.js frontend
│       └── src/
│           ├── app/         # Next.js App Router pages
│           ├── components/  # React components
│           ├── hooks/       # Custom React hooks
│           ├── modules/     # Feature modules
│           └── services/    # API services (tRPC)
├── packages/
│   ├── api/                 # tRPC API definitions
│   │   └── src/
│   │       ├── router.ts    # API router
│   │       └── modules/     # API modules
│   ├── auth/                # Authentication package
│   ├── db/                  # Prisma database
│   │   └── prisma/
│   │       ├── schema/      # Database schemas
│   │       └── migrations/  # Database migrations
│   ├── ui/                  # Shared UI components
│   └── utils/               # Shared utilities
└── [config files]
```

## Production Build

### Build All Packages

```bash
pnpm build
```

### Deploy

1. **Database:** Ensure your production PostgreSQL database is set up
2. **Environment Variables:** Update `.env` files with production values
3. **Migrations:** Run migrations on production database
4. **Build:** Run `pnpm build`
5. **Start:** Run production servers

```bash
# Server
Build Command: pnpm install --frozen-lockfile; pnpm turbo run build --filter=server;
Pre-Deploy Command: pnpm --filter @parametric-ai/db db:migrate
Start Command: pnpm --filter server start

# Web (Next.js)
Build Command: pnpm install --frozen-lockfile; pnpm turbo run build --filter=web;
Start Command: pnpm --filter web start
```

### Prisma Client Out of Sync

```bash
# Regenerate Prisma client
pnpm db:generate
```

### Type Errors

```bash
# Check types across all packages
pnpm check-types
```

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [tRPC Documentation](https://trpc.io/docs/quickstart)
- [Prisma Documentation](https://www.prisma.io/docs/getting-started/quickstart-prismaPostgres)
- [Better Auth Documentation](https://www.better-auth.com)
- [Turborepo Documentation](https://turborepo.com/docs)
- [Biome Documentation](https://biomejs.dev/guides/getting-started)
- [Ultracite](https://www.ultracite.ai/introduction)
