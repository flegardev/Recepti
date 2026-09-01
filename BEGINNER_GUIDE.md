# 🎓 Nana's Recipes (Recepti) — Beginner's Learning Guide

## What This Project Does
**Recepti** is a private household cookbook Progressive Web App (PWA) built with Next.js 15, React 19, and Supabase. It features an algorithmic pantry ingredient matcher ("What can I cook with ingredients currently in my pantry?"), step-by-step cooking mode, automatic shopping list aggregation, and PostgreSQL Row-Level Security (RLS).

---

## 🗺️ Architecture Map

```
ENTRY POINT
  │  (src/app/layout.tsx & src/app/page.tsx)
  ▼
NEXT.JS APP ROUTER & PROXY
  │  (src/app/proxy.ts, Route Handlers, Theme Boundary)
  ▼
SERVER ACTIONS & DOMAIN LOGIC
  │  ├── Pantry Ingredient Matcher (src/lib/domain/matcher.ts)
  │  ├── Shopping List Aggregator (src/features/shopping/actions.ts)
  │  └── Recipe Editor Drafts (src/features/recipes/actions.ts)
  ▼
SUPABASE PERSISTENCE & RLS
  │  (src/lib/supabase/server.ts, PostgreSQL Tables, Row-Level Security Policies)
  ▼
UI / PWA PROGRESSIVE WEB APP
     (React 19 Components, Tailwind CSS, Service Worker Offline Cache, Shopping Manager)
```

---

## 🎯 Core Files to Study First (Recommended Learning Order)

1. [`src/lib/domain/matcher.ts`](file:///C:/Users/tinif/repos/Recepti/src/lib/domain/matcher.ts)
   - **Why study first**: Contains the core business algorithm that matches pantry inventory against recipe requirements, handles culinary substitutions, and computes makeability scores.
2. [`src/lib/supabase/server.ts`](file:///C:/Users/tinif/repos/Recepti/src/lib/supabase/server.ts)
   - **Why study next**: Demonstrates how Next.js 15 Server Components and Server Actions connect to Supabase with cookie-based SSR sessions.
3. [`supabase/migrations/202607150002_rls_and_storage.sql`](file:///C:/Users/tinif/repos/Recepti/supabase/migrations/202607150002_rls_and_storage.sql)
   - **Why study third**: Teaches multi-tenant database isolation using PostgreSQL Row-Level Security (RLS) policies.
4. [`src/features/shopping/actions.ts`](file:///C:/Users/tinif/repos/Recepti/src/features/shopping/actions.ts)
   - **Why study fourth**: Shows Next.js Server Actions modifying shopping list line items and syncing with Supabase.
5. [`src/app/page.tsx`](file:///C:/Users/tinif/repos/Recepti/src/app/page.tsx)
   - **Why study fifth**: The primary dashboard view rendering makeable recipes, recently cooked meals, and pantry starters.

---

## 🛠️ How to Run & Verify

1. **Start Development Server**:
   ```bash
   pnpm dev
   ```
2. **Run Test Suite**:
   ```bash
   pnpm test
   ```
