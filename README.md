# Valo

A platform for validating business ideas with community feedback, AI-powered market insights, and co-founder matching.

## Overview

Valo helps entrepreneurs validate their ideas before building. Users can submit business ideas, receive AI-generated market analysis, gather community feedback through voting and comments, and find co-founders through a skills-based matching algorithm.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript, React 19 |
| Styling | Tailwind CSS v4 |
| Auth | Clerk |
| Database | Supabase (PostgreSQL) |
| AI | Google Gemini API |
| Data Fetching | TanStack React Query |
| Realtime | Supabase Realtime (WebSocket) |
| Animations | Motion, tw-animate-css |
| Icons | Lucide React |
| Testing | Vitest, React Testing Library |

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Environment Variables

Create a `.env.local` file with the following:

```
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-in

# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Google Gemini
GEMINI_API_KEY=

# Feature Flags
NEXT_PUBLIC_SITE_IN_DEVELOPMENT=false
```

### Installation

```bash
npm install
npm run dev
```

The app runs at `http://localhost:3000`.

## Project Structure

```
app/
  (Auth)/                   # Protected routes (requires login)
    home/                   # Feed with infinite scroll
    ideas/new/              # Create new idea
    ideas/[id]/             # Idea detail page
    profile/                # User profile & settings
    settings/               # Account settings
    layout.tsx              # Auth layout (sidebar, onboarding gate)
  api/                      # API routes
    ideas/                  # CRUD for ideas
    votes/                  # Upvote/downvote
    comments/               # Comments
    connections/            # Co-founder connection requests
    profile/                # User profile
    onboarding/             # Onboarding completion
    waitlist/               # Waitlist signup
  onboarding/               # Onboarding page
  sign-in/                  # Clerk sign-in
  sign-up/                  # Clerk sign-up
  page.tsx                  # Landing page with waitlist
  globals.css               # Design tokens & Tailwind config
components/                 # Reusable React components
hooks/                      # Custom hooks (useFeedQuery)
lib/                        # Utilities & services
  ai.ts                     # Gemini AI integration
  matching.ts               # Co-founder matching algorithm
  supabase-server.ts        # Server-side Supabase client
  supabase.ts               # Client-side Supabase client
  query-client.ts           # React Query config
  utils.ts                  # General utilities (cn)
types/                      # TypeScript type definitions
supabase/migrations/        # Database migrations
__tests__/                  # Test files
```

## Features

### Idea Submission

Users submit ideas with a title, problem statement, solution, target audience, category, tags, and development stage. Categories include SaaS, Mobile App, Hardware, Marketplace, and more. Ideas progress through stages: Concept, Validation, MVP, Beta, Launched, Scaling.

### AI Market Insights

When creating an idea, users can opt in to AI-generated market analysis powered by Google Gemini. This produces:

- **Market Analysis** — TAM, CAGR, market growth, market size
- **Competitive Analysis** — Competitors with market share and revenue, estimated user share, market opportunity
- **Implementation Difficulty** — 1–10 score with explanation

Insights are generated server-side and stored as JSONB. If generation fails, the idea is still created without insights.

### Community Voting & Comments

Ideas receive community validation through upvotes and downvotes (one vote per user per idea). Vote counts are maintained via a database trigger. Comments provide threaded feedback on each idea.

### Co-Founder Matching

Idea creators can mark their idea as "Looking for Co-founder" and specify requirements:

- **Skills needed** — 20 options (Frontend, Backend, AI/ML, Marketing, etc.)
- **Roles needed** — Technical, Business, Design, Marketing, Operations
- **Experience level** — Any, Junior, Mid-Level, Senior, Lead/Principal
- **Time commitment** — Full-time, Part-time, Weekends, Flexible

The matching algorithm calculates a percentage score:

| Factor | Weight |
|--------|--------|
| Skills overlap | 50% |
| Role match | 30% |
| Availability | 10% |
| Experience level | 10% |

Match percentages display as a circular ring on idea cards (green >= 70%, amber >= 40%, gray < 40%).

### Connections

Users can send connection requests to idea authors with a personalized message. Requests follow a `pending -> accepted/declined` workflow. Duplicate requests are prevented at the database level.

### User Profiles

Profiles include skills, roles, bio, LinkedIn URL, availability, experience level, interests, and a "seeking co-founder" flag. A completeness percentage tracks how much of the profile is filled out, with prompts to complete missing fields.

### Onboarding

New users complete onboarding after their first sign-in, providing their name, username, role, country, and company. This updates both Clerk metadata and a Supabase `users` record. Incomplete onboarding redirects users back to `/onboarding` on every authenticated route.

### Waitlist

The public landing page includes an email capture form for pre-launch signups, stored in a `waitlist` table with duplicate prevention.

## Architecture

### Route Protection

The auth layout (`app/(Auth)/layout.tsx`) gates all protected routes. It checks `user.publicMetadata.onboardingComplete` and redirects incomplete profiles to `/onboarding`. Clerk middleware in `proxy.ts` calls `auth.protect()` on non-public routes.

**Public routes:** `/`, `/sign-in`, `/sign-up`, `/onboarding`, `/ideas/*`, `/api/waitlist`, `/api/onboarding`

### Auth Flow

1. User signs in via Clerk
2. Clerk middleware protects routes
3. Auth layout checks onboarding status in Clerk metadata
4. If incomplete, redirect to `/onboarding`
5. Onboarding writes to both Clerk (`publicMetadata`) and Supabase (`users` table)
6. Server-side Supabase clients authenticate using Clerk JWTs via `auth.getToken()`

### Data Fetching

- **Feed** — TanStack React Query with cursor-based infinite pagination (30 items per page). Stale time: 2 min, GC time: 10 min.
- **Realtime** — Supabase channel subscription on `ideas` table INSERT events auto-updates the feed cache.
- **Mutations** — Optimistic updates for votes and comments with rollback on failure.

## Database Schema

### Tables

| Table | Purpose | Key Columns |
|-------|---------|------------|
| `users` | User profiles | clerk_id, username, skills[], looking_for[], bio, availability, seeking_cofounder, interests[] |
| `ideas` | Business ideas | user_id, title, problem, solution, audience, tags[], category, stage, market_analysis (JSONB), vote_count |
| `votes` | Idea votes | idea_id, user_id, vote_type (-1 or 1). Unique per user per idea. |
| `comments` | Idea comments | idea_id, user_id, user_name, content |
| `connections` | Co-founder requests | requester_id, recipient_id, idea_id, status, message |
| `waitlist` | Pre-launch emails | email (unique) |

### Row Level Security

- **Ideas/Users** — Public read. Authenticated insert. Author/owner-only update and delete.
- **Votes/Comments** — Public read. Authenticated insert, update, delete.
- **Connections** — Public read. Authenticated insert, update.
- **Waitlist** — Unauthenticated insert (via service role).

### Triggers

- `update_idea_vote_count()` — Auto-updates `ideas.vote_count` when votes change
- `update_connections_updated_at()` — Auto-updates `connections.updated_at` on modification

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/ideas` | Fetch paginated ideas feed (cursor-based) |
| POST | `/api/ideas` | Create idea (with optional AI insights) |
| GET | `/api/ideas/[id]` | Fetch single idea |
| PATCH | `/api/ideas/[id]` | Update idea (author only) |
| DELETE | `/api/ideas/[id]` | Delete idea (author only) |
| GET | `/api/ideas/user` | Fetch current user's ideas |
| GET | `/api/votes` | Get user's vote on an idea |
| POST | `/api/votes` | Add, update, or remove vote |
| POST | `/api/comments` | Add comment to idea |
| GET | `/api/connections` | Fetch connections (sent/received/all) |
| POST | `/api/connections` | Send connection request |
| PATCH | `/api/connections/[id]` | Accept or decline connection |
| DELETE | `/api/connections/[id]` | Delete connection |
| GET | `/api/profile` | Fetch user profile |
| PATCH | `/api/profile` | Update user profile |
| POST | `/api/onboarding` | Complete onboarding |
| POST | `/api/waitlist` | Join waitlist |

## Testing

Tests use Vitest with React Testing Library and jsdom.

```bash
npm test
```

Coverage includes:
- **Onboarding API** — Auth validation, username uniqueness, Clerk/Supabase dual writes
- **Matching algorithm** — Score calculation, edge cases, weight distribution
- **Auth layout** — Route protection, onboarding redirects
- **Middleware** — Public/protected route handling

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run tests |
