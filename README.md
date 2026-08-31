# Nana's Recipes (Recepti) -- Private Household Cookbook PWA

A household recipe management Progressive Web App (PWA) built with Next.js 16, React 19, TypeScript, Tailwind CSS, and Supabase PostgreSQL, featuring pantry ingredient matching and Row-Level Security (RLS).

![Nana's Recipes Showcase](./public/images/nanas-recipes-hero.webp)

## Overview

**Nana's Recipes** is a private household cookbook application designed to store family recipes, assist with meal planning, and reduce food waste through pantry ingredient matching.

Built as an installable Progressive Web App with an offline-capable service worker, the application connects to a Supabase PostgreSQL database protected by Row-Level Security (RLS) policies that isolate shared household data.

## Features

- **Pantry Ingredient Matching**: Evaluates available pantry items and dynamically ranks recipes by ingredient availability, highlighting missing ingredients.
- **Interactive Cooking Mode**: Step-by-step cooking view with integrated preparation timers and checkable instructions.
- **Automated Shopping Lists**: Generates consolidated grocery lists directly from missing recipe ingredients.
- **Household Multi-User Access**: Family sharing governed by Supabase Auth and Row-Level Security (`OWNER_EMAILS` allowlist).
- **Progressive Web App (PWA)**: Installable on mobile and desktop with offline caching powered by a service worker (`public/sw.js`).
- **Image Optimization**: Recipe photo processing and WebP conversion using Sharp.
- **Quality Assurance**: Unit and component tests with Vitest, database connectivity tests, and Playwright end-to-end flows.

## Screenshots

| Application Showcase Banner |
|:---:|
| ![Nana's Recipes Hero](./public/images/nanas-recipes-hero.webp) |

## Tech Stack

- **Framework**: Next.js 16 (App Router, Server Actions, Server Components)
- **UI & Styling**: React 19, Tailwind CSS, Radix UI Primitives, Lucide Icons, Sonner
- **Database & Auth**: Supabase (PostgreSQL 16, Row-Level Security, Supabase Auth & SSR)
- **Forms & Validation**: React Hook Form, Zod
- **Image Processing**: Sharp
- **PWA & Offline**: Service Worker, Web App Manifest
- **Testing & Quality**: Vitest, Playwright, Testing Library, ESLint, Prettier

## Project Structure

```text
recepti/
├── docs/                       # Architecture specs, database schemas, and migration guides
├── e2e/                        # Playwright end-to-end integration tests
├── public/                     # Static media, icons, and service worker
│   ├── images/                 # High-resolution hero showcase images
│   └── sw.js                   # PWA offline service worker
├── scripts/                    # Database seeding and documentation validation scripts
├── src/
│   ├── app/                    # Next.js App Router routes (recipes, pantry, shopping, auth)
│   ├── components/             # Reusable UI widgets and Shadcn components
│   ├── data/                   # Default starter recipes and ingredient categories
│   ├── features/               # Cookbook, pantry matcher, and cooking mode modules
│   ├── lib/                    # Supabase client/server singletons and utility helpers
│   └── types/                  # Database definitions and application TypeScript types
├── supabase/                   # Supabase SQL migrations and RLS policy scripts
├── package.json                # Project dependencies and lifecycle scripts
├── tsconfig.json               # TypeScript strict configuration
└── vitest.config.ts            # Vitest unit test runner settings
```

## Installation & Setup

### Prerequisites

- Node.js 20+
- pnpm (recommended) or npm
- Supabase Project (Cloud or Local CLI)

### Quickstart

1. **Clone the repository:**
   ```bash
   git clone https://github.com/flegardev/recepti.git
   cd recepti
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Configure environment variables:**
   ```bash
   cp .env.example .env.local
   ```

4. **Run database seed script (Optional):**
   ```bash
   pnpm db:seed
   ```

5. **Start the local development server:**
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

Configure environment variables in `.env.local`:

```env
# Supabase Public Keys (Client-Safe)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Household Membership Allowlist (Server-Only)
OWNER_EMAILS=owner@example.com,family-member@example.com

# Testing
E2E_TEST_MODE=0
```

## Available Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Starts Next.js development server on port 3000 |
| `pnpm build` | Compiles and optimizes production build |
| `pnpm start` | Starts production server |
| `pnpm test` | Runs unit and component test suites via Vitest |
| `pnpm test:e2e` | Executes Playwright end-to-end tests |
| `pnpm test:db` | Runs database connectivity and schema integrity tests |
| `pnpm db:seed` | Seeds Supabase with starter family recipes |
| `pnpm typecheck` | Generates Next.js types and runs strict `tsc --noEmit` |
| `pnpm lint` | Validates codebase with ESLint |
| `pnpm format` | Formats all files with Prettier |

## Database & Security

Nana's Recipes uses Supabase PostgreSQL:
- **Supabase Row-Level Security (RLS)** is applied across `recipes`, `ingredients`, `pantry_items`, and `shopping_list`.
- Authenticated users can only read and mutate rows belonging to verified accounts in `OWNER_EMAILS`.

## License & Portfolio Notice

Copyright (c) 2026 Tini Flegar. All rights reserved.
Published for portfolio review and technical demonstration.
